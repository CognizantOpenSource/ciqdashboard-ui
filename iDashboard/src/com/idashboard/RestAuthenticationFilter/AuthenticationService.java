package com.idashboard.RestAuthenticationFilter;
/**
@author 653731
*/
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.naming.NamingException;
import javax.swing.text.BadLocationException;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cognizant.idashboard.iAuthentication;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.AESUtil;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.util.SessionHandler;
import com.cts.metricsportal.vo.IdashboardSession;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.idashboard.admin.vo.UserVO;
//import com.cts.metricsportal.vo.UserVO;

public class AuthenticationService extends BaseMongoOperation {
	
	final static Integer AUTH_FAILED = 401;
	final static Integer SESSION_TIMEOUT = 441;
	final static Integer OTHER_ACTIVE_SESSION = 440;
	final static Integer UNKNOWN_EXCEPTION = -1;
	final static Integer OK = 200;
	
	SessionHandler sessionHandler = new SessionHandler();
	
	public String getUser(String authCredentials) {

		String username = null;
		// header value format will be "Basic encodedstring" for Basic
		// authentication. Example "Basic YWRtaW46YWRtaW4="
		authCredentials = decryptHeader(authCredentials);
		if(authCredentials!= null) {
			StringTokenizer tokenizer = new StringTokenizer(authCredentials, ":");
			username = tokenizer.nextToken();
		}
		return username;

	}

	public UserVO getUserDetails(String authCredentials) {
		UserVO userInfo = new UserVO();
		authCredentials = decryptHeader(authCredentials);
		String username = authCredentials.split(":")[0];
		String password = authCredentials.split(":")[1];
		userInfo.setUserId(username);
		userInfo.setPassword(password);
		password = null;
		return userInfo;
	}
	
	public String decryptHeader(String header) {
		String decHeader = AESUtil.decryptHeader(header);
		return decHeader;			//admin:cGFzc3d
	}
	
	public UserVO getUserDetailsPassEncrypted(String authCredentials) {
		UserVO userInfo = new UserVO();
		authCredentials = decryptHeader(authCredentials);
		if(authCredentials!= null) {
			String username = authCredentials.split(":")[0];
			String password = authCredentials.split(":")[1];
			password = new String(decryptHeader(password));
			userInfo.setUserId(username);
			userInfo.setPassword(password);
			password = null;
		}
		return userInfo;
	}
	
	public Integer authenticate(String authCredentials, Boolean isPlugin) {
		IdashboardSession session = null;
		if (null == authCredentials || authCredentials.trim().equals(""))
			return AUTH_FAILED;
		// header value format will be "Basic encryptedstring" for Basic
		// authentication. Example "Basic NmlatruoavcsYWRtaW46YWRtaW4="
		
		boolean authStatusLogin = false;
	
		UserVO requestUser = getUserDetailsPassEncrypted(authCredentials);
		String userId = requestUser.getUserId();
		String password = requestUser.getPassword();
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));
		UserVO vo = null;
		
		try {
			vo = getMongoOperation().findOne(query1, UserVO.class);
			
			if (vo != null && vo.getUserId().equals(userId)) {
				if (vo.isLdap()) {

					authStatusLogin = authenticateLdap(userId, password);
					if (authStatusLogin == true) {
						return OK;
					} else {
						return AUTH_FAILED;
					}

				} else {
					session = sessionHandler.getSession(userId,false);
					if (session.getTimestamp() == -1)
						return AUTH_FAILED;
					authStatusLogin = password.equals(session.getSessionId());
					
					if (!authStatusLogin) {
						return OTHER_ACTIVE_SESSION;
					}
					if (sessionHandler.isExpired(session, isPlugin)) {
						return SESSION_TIMEOUT;
					}
					authStatusLogin = authStatusLogin & !sessionHandler.isExpired(session, isPlugin);
				}
			}
		} catch (NumberFormatException | BadLocationException e) {
				e.printStackTrace();
			}
		if (authStatusLogin && session != null) {
			sessionHandler.updateCurrentSession(session);
			return OK;
		} else {
			return AUTH_FAILED;
		}
	}

	// Check project access

	public boolean authenticateProjects(String authCredentials, String dashboardName, String domainName,
			String projectName) {

		boolean authStatus = false;
		boolean ispublic = false;

		List<UserVO> projectinfo = new ArrayList<UserVO>();
		List<OperationalDashboardVO> opprojectinfo = null;

		UserVO uvo = getUserDetailsPassEncrypted(authCredentials);
		String userId = uvo.getUserId();

		String owner = "";

		try {

			// Check the Dashboard set as ispublic

			Query query3 = new Query();
			query3.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			List<OperationalDashboardVO> dashboardinfo = getMongoOperation().find(query3, OperationalDashboardVO.class);
			ispublic = dashboardinfo.get(0).isIspublic();

			if (ispublic) {
				owner = dashboardinfo.get(0).getOwner();
				userId = owner;
			}

			// End of public

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("userId").is(userId));

			Query query2 = new Query();
			query2.addCriteria(Criteria.where("owner").is(userId));
			query2.addCriteria(Criteria.where("dashboardName").is(dashboardName));

			opprojectinfo = getMongoOperation().find(query2, OperationalDashboardVO.class);

			if (!opprojectinfo.isEmpty()) {
				projectinfo = getMongoOperation().find(query1, UserVO.class);
			}

		} catch(NumberFormatException | BadLocationException e) {
			e.printStackTrace();
		}

		if (!projectinfo.isEmpty()) {
			for (UserVO provo : projectinfo) {
				for (int i = 0; i < provo.getSelectedProjects().size(); i++) {
					if (provo.getSelectedProjects().get(i).getLevel1().equalsIgnoreCase(domainName)
							&& provo.getSelectedProjects().get(i).getLevel2().equalsIgnoreCase(projectName)) {
						authStatus = true;
					}
				}
			}
		}

		return authStatus;
	}

	public Integer checkAdminUser(String authCredentials) {
		boolean isPlugin = false;
		IdashboardSession session = null;
		boolean adminAccess = false;
		
		if (authCredentials == null || authCredentials.trim().equals("")) {
			return AUTH_FAILED;
		}
		
		UserVO uvo = getUserDetailsPassEncrypted(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();
		UserVO vo = null;
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));
		try {
			vo = getMongoOperation().findOne(query1,UserVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			
			e.printStackTrace();
		}

			if (vo != null && vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isAdmin()) {
					session = sessionHandler.getSession(userId,false);
					if (session.getTimestamp() == -1)
						return AUTH_FAILED;
					adminAccess = password.equals(session.getSessionId());
					
					if (!adminAccess) {
						return OTHER_ACTIVE_SESSION;
					}
					if (sessionHandler.isExpired(session, isPlugin)) {
						return SESSION_TIMEOUT;
					}
					adminAccess = adminAccess && !sessionHandler.isExpired(session, isPlugin);
					
				} else {
					return AUTH_FAILED;
				}
			}
			if (adminAccess && session != null) {
				sessionHandler.updateCurrentSession(session);
				return OK;
			} else {
				return AUTH_FAILED;
			}
	}

	public Integer checkOperationalLayerAccess(String authCredentials) {
		boolean isPlugin = false;
		IdashboardSession session = null;
		boolean operationalAccess = false;
		
		UserVO uvo = getUserDetailsPassEncrypted(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));
		UserVO vo = null;
		
		try {
			vo = getMongoOperation().findOne(query1 ,UserVO.class);
		} catch (NumberFormatException | BadLocationException e) {
			
			e.printStackTrace();
		}

			if (vo != null && vo.getUserId().equals(userId)) {
				if (vo.isOperational()) {
					session = sessionHandler.getSession(userId,false);
					if (session.getTimestamp() == -1)
						return AUTH_FAILED;
					operationalAccess = password.equals(session.getSessionId());
					
					if (!operationalAccess) {
						return OTHER_ACTIVE_SESSION;
					}
					if (sessionHandler.isExpired(session, isPlugin)) {
						return SESSION_TIMEOUT;
					}
					
				} else {
					return AUTH_FAILED;
				}
		}
		if (operationalAccess && session != null) {
			sessionHandler.updateCurrentSession(session);
			return OK;
		} else {
			return AUTH_FAILED;
		}
	
	}

	public Integer checkLifecycleLayerAccess(String authCredentials) {
		boolean isPlugin = false;
		IdashboardSession session = null;
		boolean lifecyleAccess = false;
		
		UserVO uvo = getUserDetailsPassEncrypted(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));
		UserVO vo = null;
		
		try {
			vo = getMongoOperation().findOne(query1 ,UserVO.class);
		} catch (NumberFormatException | BadLocationException e) {
				e.printStackTrace();
		}
	
			if (vo != null && vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isLifeCycle()) {
					session = sessionHandler.getSession(userId,false);
					if (session.getTimestamp() == -1)
						return AUTH_FAILED;
					lifecyleAccess = password.equals(session.getSessionId());
					
					if (!lifecyleAccess) {
						return OTHER_ACTIVE_SESSION;
					}
					if (sessionHandler.isExpired(session, isPlugin)) {
						return SESSION_TIMEOUT;
					}
					
				} else {
					return AUTH_FAILED;
				}
			}
			
			if (lifecyleAccess && session != null) {
				sessionHandler.updateCurrentSession(session);
				return OK;
			} else {
				return AUTH_FAILED;
			}
	}

	public Integer checkIntelligentLayerAccess(String authCredentials) {
		boolean isPlugin = false;
		IdashboardSession session = null;
		boolean intelligentAccess = false;
		
		UserVO uvo = getUserDetailsPassEncrypted(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));
		UserVO vo = null;
		
		try {
			vo = getMongoOperation().findOne(query1 ,UserVO.class);
		} catch (NumberFormatException | BadLocationException e) {
				e.printStackTrace();
		}
			if (vo != null && vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isQbot()) {
					session = sessionHandler.getSession(userId,false);
					if (session.getTimestamp() == -1)
						return AUTH_FAILED;
					intelligentAccess = password.equals(session.getSessionId());
					
					if (!intelligentAccess) {
						return OTHER_ACTIVE_SESSION;
					}
					if (sessionHandler.isExpired(session, isPlugin)) {
						return SESSION_TIMEOUT;
					}
					
				} else {
					return AUTH_FAILED;
				}
			}
			if (intelligentAccess && session != null) {
				sessionHandler.updateCurrentSession(session);
				return OK;
			} else {
				return AUTH_FAILED;
			}
	}
	
	public boolean authenticateLdap(String username, String password) {

		// return true;

		Properties ldapSettings = new Properties();

		try {
			ldapSettings = PropertyManager.getProperties("ldapSettings.properties");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		boolean authStatus = false;

		// Use the AccessJL library to perform the authentication.
		LdapAuthentication authenticator = new LdapAuthentication(ldapSettings);

		// The authenticate method of the AccessJL library performs
		// the actual LDAP authentication.
		try {

			// For LDAP we need to send a Original password
			//String password = iAuthentication.read(passwordAuth);

			authStatus = authenticator.authenticate(username.trim(), password);
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			password = null;
		}

		return authStatus;

	}

	public boolean authenticate1(String username, String password) {

		byte[] bytesOfMessage = null;
		String checkpassword = null;
		/*
		 * try { bytesOfMessage = password.getBytes("UTF-8"); } catch
		 * (UnsupportedEncodingException e2) { // TODO Auto-generated catch
		 * block e2.printStackTrace(); }
		 * 
		 * MessageDigest md = null; try { md = MessageDigest.getInstance("MD5");
		 * } catch (NoSuchAlgorithmException e1) { // TODO Auto-generated catch
		 * block e1.printStackTrace(); } byte[] thedigest =
		 * md.digest(bytesOfMessage); //convert the byte to hex format
		 * StringBuffer sb = new StringBuffer(); for (int i = 0; i <
		 * thedigest.length; i++) { sb.append(Integer.toString((thedigest[i] &
		 * 0xff) + 0x100, 16).substring(1)); checkpassword = sb.toString(); }
		 */
		checkpassword = password;
		Query query = new Query();
		Criteria criteria1 = new Criteria();
		criteria1.andOperator(Criteria.where("userId").regex(username, "i"),
				Criteria.where("password").is(checkpassword));
		query.addCriteria(criteria1);
		List<UserVO> userDetails = new ArrayList<UserVO>();

		try {
			userDetails = getMongoOperation().find(query, UserVO.class);
		} catch (NumberFormatException e) {

			e.printStackTrace();
		} catch (BaseException e) {

			e.printStackTrace();
		} catch (BadLocationException e) {

			e.printStackTrace();
		}

		if (userDetails.size() != 0) {
			return true;
		} else {
			return false;
		}
	}

}
