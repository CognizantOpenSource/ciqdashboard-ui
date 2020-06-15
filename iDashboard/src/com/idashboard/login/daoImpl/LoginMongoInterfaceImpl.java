package com.idashboard.login.daoImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.naming.NamingException;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cognizant.cimesg.encryptl.core.EncryptL;
import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.controllers.BaseMongoOperation;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.util.SessionHandler;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.login.dao.LoginMongoInterface;

public class LoginMongoInterfaceImpl extends BaseMongoOperation implements LoginMongoInterface {

	static final Logger logger = Logger.getLogger(LoginMongoInterfaceImpl.class);

	SessionHandler sessionHandler = new SessionHandler();

	public UserVO Login_ExecuteQuery_GetUserInfo(String authString) {

		UserVO userInfo = new UserVO();
		UserVO ldapInfo = new UserVO();
		Query query1 = new Query();

		try {

			AuthenticationService authenticationService = new AuthenticationService();

			UserVO authUser = authenticationService.getUserDetails(authString);

			query1.addCriteria(Criteria.where("userId").is(authUser.getUserId()));
			UserVO userFromDb = getMongoOperation().findOne(query1, UserVO.class);
			boolean authStatus = false;

			/*
			 * UserVO uvo = authenticatee(auth); String userId = uvo.getUserId(); //653731
			 * String password = uvo.getPassword()
			 */; // mcWLbn6/9l7VZVaeDPsjqQ==

			if (userFromDb != null) {
				if (userFromDb.getUserId().equals(authUser.getUserId())) {
					if (userFromDb.isLdap()) {
						try {
							authStatus = authenticationService.authenticateLdap(userFromDb.getUserId(),
									authUser.getPassword());
							if (authStatus) {

								List<String> ldapUserDetails = new ArrayList<String>();
								String Photo = null;
								String userName = null;
								String mobile = "";
								String mail = "";

								ldapUserDetails = getLdapUserDetails(userFromDb.getUserId(), authUser.getPassword());

								Photo = ldapUserDetails.get(0);
								userName = ldapUserDetails.get(1);
								mobile = ldapUserDetails.get(3);
								mail = ldapUserDetails.get(2);

								ldapInfo.setProfilePhoto(Photo);
								ldapInfo.setUserName(userName);
								ldapInfo.setEmail(mail);
								ldapInfo.setMobileNum(mobile);

								// Update User Info;
								Query query = new Query();
								query.addCriteria(Criteria.where("userId").is(userFromDb.getUserId()));

								Update update = new Update();
								update.set("userName", userName);
								update.set("email", mail);
								update.set("mobileNum", mobile);
								update.set("userImg", Photo);
								getMongoOperation().updateFirst(query, update, UserVO.class);

							}

						} catch (Exception e) {
							logger.error("Wrong LDAP Password");
						}
					} else {
						EncryptL encrypt = new EncryptL();
						String HashedPwd = encrypt.calculateHash(authUser.getPassword());
						authStatus = userFromDb.getPassword().equals(HashedPwd);
						if (authStatus) {
							userFromDb.setPassword(HashedPwd);
						}
					}

					if (authStatus) {
						Query query2 = new Query();
						if (userFromDb.isLdap()) {

							query2.addCriteria(Criteria.where("userId").is(authUser.getUserId()));
							UserVO userupdateinfo = getMongoOperation().findOne(query2, UserVO.class);

							userInfo = userupdateinfo;
							/* userInfo=ldapInfo */;

						} else {
							userInfo = userFromDb;
							userInfo.setAuthStatus(true);
						}
					}
				}
			} // session by 653731
			if (userInfo != null && userInfo.isActive()) {
				boolean isPlugin = false;
				String sId = sessionHandler.createNewSesion(userInfo.getUserId(), isPlugin);
				userInfo.set_id(sId);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return userInfo;
	}

	// Get Ladp Details
	public List<String> getLdapUserDetails(String username, String password) throws Exception {
		String photoString = null;
		String userTitle = "";
		String userName = "";
		String usermail = "";
		String usermobile = "";
		String name = "";
		String sn = "";
		List<String> ldapUserDetails = new ArrayList<String>();
		Properties ldapSettings = new Properties();
		try {
			ldapSettings = PropertyManager.getProperties("ldapSettings.properties");
			LdapAuthentication authenticator = new LdapAuthentication(ldapSettings);

			Map ldapUserInfo = authenticator.getLdapUserInfo(username, password);
			if (ldapUserInfo != null) {
				if (ldapUserInfo.get("profilePhoto") != null) {
					byte[] photo = (byte[]) ldapUserInfo.get("profilePhoto");
					photoString = new sun.misc.BASE64Encoder().encode(photo);
				} else {
					photoString = "";
				}

				// userTitle = (String) ldapUserInfo.get("title");
				name = (String) ldapUserInfo.get("givenname");
				sn = (String) ldapUserInfo.get("sn");
				userName = name + " " + sn;
				userTitle = userName;
				usermail = (String) ldapUserInfo.get("mail");
				usermobile = (String) ldapUserInfo.get("telephonenumber");
			}

		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new BaseException("Some error occured while getting the user's ldap profile picture", e);
		}

		ldapUserDetails.add(photoString);
		ldapUserDetails.add(userTitle);
		ldapUserDetails.add(usermail);
		ldapUserDetails.add(usermobile);

		return ldapUserDetails;
	}

	public boolean Login_ExecuteQuery_SetAcoountlock(String authString) {

		boolean Acctlock = false;

		try {

			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);

			
				Update update = new Update();
				update.set("acLock", true);

				Query query = new Query();
				query.addCriteria(Criteria.where("userId").is(userId));
				getMongoOperation().updateMulti(query, update, UserVO.class);

				Acctlock = true;
			
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return Acctlock;

	}

	public int Login_ExecuteQuery_SignupUser(String userId, String password, String userName, String email,
			String mobileNum) {

		int count = 0;

		try {
			String encryptedPassword;
			AuthenticationService authenticationService = new AuthenticationService();
			EncryptL encrypt = new EncryptL();
			UserVO uservo = new UserVO();
			Query query = new Query();

			encryptedPassword = encrypt.calculateHash(authenticationService.decryptHeader(password));

			StringBuilder sb = new StringBuilder();

			/*
			 * for (char ch : encryptedPassword) { sb.append(ch); }
			 */

			uservo.setAdmin(false);
			uservo.setUserId(userId);
			uservo.setPassword(encryptedPassword);
			uservo.setLdap(false);
			uservo.setLifeCycle(false);
			uservo.setCoEDashboard(false);
			uservo.setCustomMetrics(false);
			uservo.setRiskCompliance(false);
			uservo.setMobileNum(mobileNum);
			uservo.setEmail(email);
			uservo.setOperational(false);

			uservo.setUserImg(
					"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");

			uservo.setQbot(false);
			uservo.setAccessible(false);
			uservo.setRole("SDET");
			uservo.setUserName(userName);
			uservo.setActive(false);
			uservo.setSelectedProjects(null);

			query = new Query(new Criteria().orOperator(Criteria.where("userId").is(userId),
					Criteria.where("userName").is(userName), Criteria.where("email").is(email),
					Criteria.where("mobileNum").is(mobileNum)));

			List<UserVO> userInfo = getMongoOperation().find(query, UserVO.class);

			for (UserVO vo : userInfo) {
				if (vo.getUserId().equalsIgnoreCase(userId)) {

					count = 1;
					break;
				} else if (vo.getUserName().equalsIgnoreCase(userName)) {

					count = 2;
					break;
				} else if (vo.getEmail().equalsIgnoreCase(email)) {

					count = 3;
					break;
				} else if (vo.getMobileNum().equalsIgnoreCase(mobileNum)) {

					count = 4;
					break;
				}
			}
			if (count == 0) {
				getMongoOperation().save(uservo, "userInfo");
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return count;
	}

	public int Login_ExecuteQuery_Resetpassword(String authString, String data) {

		int count = 0;
		try {

			AuthenticationService authenticationService = new AuthenticationService();
			String userId = authenticationService.getUser(authString);

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("userId").is(userId));
			Update update = new Update();
			EncryptL encrypt = new EncryptL();
			String password = encrypt.calculateHash(authenticationService.decryptHeader(data));
			update.set("password", password);
			update.set("ispassReset", false);
			/*
			 * Query query2 = new Query();
			 * query2.addCriteria(Criteria.where("userId").is(userId)); Update update1 = new
			 * Update(); update1.unset("ispassReset");
			 */
			getMongoOperation().updateFirst(query1, update, UserVO.class);
			/* getMongoOperation().updateFirst(query2, update1, UserVO.class); */

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count = 0;
	}
}
