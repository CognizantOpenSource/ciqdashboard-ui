package com.cts.metricsportal.RestAuthenticationFilter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.naming.NamingException;
import javax.swing.text.BadLocationException;
import javax.xml.bind.DatatypeConverter;

import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cognizant.idashboard.iAuthentication;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.UserVO;

public class AuthenticationService extends BaseMongoOperation {

	public String getUser(String authCredentials) {

		UserVO vo = new UserVO();
		// header value format will be "Basic encodedstring" for Basic
		// authentication. Example "Basic YWRtaW46YWRtaW4="
		final String encodedUserPassword = authCredentials.replaceFirst("Basic" + " ", "");
		String usernameAndPassword = null;
		try {
			byte[] decodedBytes = DatatypeConverter.parseBase64Binary(encodedUserPassword);
			usernameAndPassword = new String(decodedBytes, "UTF-8");
		} catch (IOException e) {
			/* e.printStackTrace(); */
		}
		final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");

		final String userId = tokenizer.nextToken();

		return userId;

	}

	public boolean authenticate(String authCredentials) {

		if (null == authCredentials)
			return false;
		// header value format will be "Basic encodedstring" for Basic
		// authentication. Example "Basic YWRtaW46YWRtaW4="

		UserVO userInfo = new UserVO();

		List<UserVO> userDetails = new ArrayList<UserVO>();
		try {
			userDetails = getMongoOperation().findAll(UserVO.class);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		boolean authStatus = false;
		UserVO uvo = authenticateUser(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();

		for (UserVO vo : userDetails) {
			if (vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isLdap()) {

					authStatus = authenticateInternal(userId, password);
					if (authStatus == true) {

						userInfo = vo;
						return authStatus;
					} else {
						return false;
					}

				} else {
					authStatus = authenticate1(userId, password);
					return authStatus;
				}
			}
		}

		return authStatus;
	}

	// Check project access

	public boolean authenticateProjects(String authCredentials, String dashboardName, String domainName,
			String projectName) {

		boolean authStatus = false;
		boolean ispublic = false;

		List<UserVO> projectinfo = new ArrayList<UserVO>();
		List<OperationalDashboardVO> opprojectinfo = null;

		UserVO uvo = authenticateUser(authCredentials);
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

		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
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

	public boolean checkAdminUser(String authCredentials) {

		UserVO userInfo = new UserVO();

		List<UserVO> userDetails = new ArrayList<UserVO>();
		try {
			userDetails = getMongoOperation().findAll(UserVO.class);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		boolean authStatus = false;
		UserVO uvo = authenticateUser(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();

		for (UserVO vo : userDetails) {
			if (vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isAdmin()) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public boolean checkOperationalLayerAccess(String authCredentials) {

		UserVO userInfo = new UserVO();

		List<UserVO> userDetails = new ArrayList<UserVO>();
		try {
			userDetails = getMongoOperation().findAll(UserVO.class);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		boolean authStatus = false;
		UserVO uvo = authenticateUser(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();

		for (UserVO vo : userDetails) {
			if (vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isOperational()) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public boolean checkLCLayerAccess(String authCredentials) {

		UserVO userInfo = new UserVO();

		List<UserVO> userDetails = new ArrayList<UserVO>();
		try {
			userDetails = getMongoOperation().findAll(UserVO.class);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		boolean authStatus = false;
		UserVO uvo = authenticateUser(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();

		for (UserVO vo : userDetails) {
			if (vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isLifeCycle()) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public boolean checkIntelligentLayerAccess(String authCredentials) {

		UserVO userInfo = new UserVO();

		List<UserVO> userDetails = new ArrayList<UserVO>();
		try {
			userDetails = getMongoOperation().findAll(UserVO.class);
		} catch (NumberFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BaseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		boolean authStatus = false;
		UserVO uvo = authenticateUser(authCredentials);
		String userId = uvo.getUserId();
		String password = uvo.getPassword();

		for (UserVO vo : userDetails) {
			if (vo.getUserId().equalsIgnoreCase(userId)) {
				if (vo.isQbot()) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public UserVO authenticateUser(String authCredentials) {

		UserVO vo = new UserVO();
		// header value format will be "Basic encodedstring" for Basic
		// authentication. Example "Basic YWRtaW46YWRtaW4="
		final String encodedUserPassword = authCredentials.replaceFirst("Basic" + " ", "");
		String usernameAndPassword = null;
		try {
			byte[] decodedBytes = DatatypeConverter.parseBase64Binary(encodedUserPassword);
			usernameAndPassword = new String(decodedBytes, "UTF-8");
		} catch (IOException e) {
			/* e.printStackTrace(); */
		}
		final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");

		final String userId = tokenizer.nextToken();
		String password1 = tokenizer.nextToken();

		byte[] decodedBytesPassword = DatatypeConverter.parseBase64Binary(password1);
		char[] password = null;
		
		StringBuilder sb =new StringBuilder();
		try {
			password = iAuthentication.write(decodedBytesPassword);
			// setting the username and pwd
			
			for(char ch: password) {
				sb.append(ch);
			}
			
			vo.setUserId(userId);
			vo.setPassword(sb.toString());
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			password1 = null;
			sb.setLength(0);
			Arrays.fill(password, ' ');
		}

		return vo;
	}

	public boolean authenticateInternal(String username, String passwordAuth) {

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

			// For LDAP we need to sent a Original password
			String password = iAuthentication.read(passwordAuth);

			authStatus = authenticator.authenticate(username, password);
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			passwordAuth = null;
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
