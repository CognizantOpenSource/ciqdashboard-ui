package com.idashboard.admin.daoImpl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cognizant.cimesg.encryptl.core.EncryptL;
import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.controllers.BaseMongoOperation;

import com.cts.metricsportal.vo.OperationDashboardDetailsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.UserCountVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idashboard.admin.dao.UserManagementMongoInterface;
import com.idashboard.admin.vo.UserProjectVO;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.common.vo.DomainVO;
import com.idashboard.common.vo.LevelItemsVO;
import com.idashboard.common.vo.ProjectVO;
import com.idashboard.common.vo.ReleaseVO;
import com.mongodb.BasicDBObject;

public class UserManagementMongoOperationImpl extends BaseMongoOperation implements UserManagementMongoInterface {

	static final Logger logger = Logger.getLogger(UserManagementMongoOperationImpl.class);

	public List<UserVO> UserManagement_ExecuteQuery_GetUserList() {
		List<UserVO> admininfo = null;

		try {

			admininfo = new ArrayList<UserVO>();

			String sizequery = "{},{_id:0,userId:1}";
			Query query = new BasicQuery(sizequery);
			admininfo = getMongoOperation().find(query, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return admininfo;

	}

	public List<DomainVO> UserManagement_ExecuteQuery_GetProjetList() {

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();

		try {

			Query almquery = new Query();
			almquery.addCriteria(Criteria.where("SourceTool").is("ALM"));
			List<String> domain = getMongoOperation().getCollection("levelId").distinct("level1",
					almquery.getQueryObject());

			ProjectVO selectproject = null;

			for (int i = 0; i < domain.size(); i++) {

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("AD" + domainID++);
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSourceTool("ALM");
				selectdomain.setSelected(false);
				Query query = new Query();
				query.addCriteria(Criteria.where("SourceTool").is("ALM"));
				query.addCriteria(Criteria.where("level1").is(domain.get(i)));
				List<String> project = getMongoOperation().getCollection("levelId").distinct("level2",
						query.getQueryObject());

				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < project.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("AP" + projectID++);
					selectproject.setLevel2(project.get(j));
					selectproject.setSelected(false);
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("SourceTool").is("ALM"));
					query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
					query1.addCriteria(Criteria.where("level2").is(project.get(j)));
					release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
					endjson = new ArrayList<ReleaseVO>();

					for (int k = 0; k < release.size(); k++) {

						ReleaseVO selectrelease = new ReleaseVO();
						selectrelease.setLevel3ID("AR" + releaseID++);
						selectrelease.setLevel3(release.get(k));
						selectrelease.setSelected(false);
						endjson.add(selectrelease);

						Query query2 = new Query();
						query2.addCriteria(Criteria.where("SourceTool").is("ALM"));
						query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
						query2.addCriteria(Criteria.where("level2").is(project.get(j)));
						query2.addCriteria(Criteria.where("level3").is(release.get(k)));

						List<LevelItemsVO> levelIdList = getMongoOperation().find(query2, LevelItemsVO.class);
						levelId = levelIdList.get(0).getLevelId();
						selectrelease.setLevelId(levelId);
					}
					selectproject.setChildren(endjson);
					finalrelease.add(selectproject);

				}
				selectdomain.setChildren(finalrelease);
				finalproject.add(selectdomain);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return finalproject;

	}

	public List<DomainVO> UserManagement_ExecuteQuery_JiraGetProjetList() {

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();

		try {

			Query almquery = new Query();
			almquery.addCriteria(Criteria.where("SourceTool").is("JIRA"));
			List<String> domain = getMongoOperation().getCollection("levelId").distinct("level1",
					almquery.getQueryObject());

			ProjectVO selectproject = null;

			for (int i = 0; i < domain.size(); i++) {

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("JD" + domainID++);
				selectdomain.setSourceTool("JIRA");
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSelected(false);
				Query query = new Query();
				query.addCriteria(Criteria.where("SourceTool").is("JIRA"));
				query.addCriteria(Criteria.where("level1").is(domain.get(i)));
				List<String> project = getMongoOperation().getCollection("levelId").distinct("level2",
						query.getQueryObject());

				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < project.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("JP" + projectID++);
					selectproject.setLevel2(project.get(j));
					selectproject.setSelected(false);
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("SourceTool").is("JIRA"));
					query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
					query1.addCriteria(Criteria.where("level2").is(project.get(j)));
					release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
					endjson = new ArrayList<ReleaseVO>();

					for (int k = 0; k < release.size(); k++) {

						ReleaseVO selectrelease = new ReleaseVO();
						selectrelease.setLevel3ID("JR" + releaseID++);
						selectrelease.setLevel3(release.get(k));
						selectrelease.setSelected(false);
						endjson.add(selectrelease);

						Query query2 = new Query();
						query2.addCriteria(Criteria.where("SourceTool").is("JIRA"));
						query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
						query2.addCriteria(Criteria.where("level2").is(project.get(j)));
						query2.addCriteria(Criteria.where("level3").is(release.get(k)));

						List<LevelItemsVO> levelIdList = getMongoOperation().find(query2, LevelItemsVO.class);
						levelId = levelIdList.get(0).getLevelId();
						selectrelease.setLevelId(levelId);
					}
					selectproject.setChildren(endjson);
					finalrelease.add(selectproject);

				}
				selectdomain.setChildren(finalrelease);
				finalproject.add(selectdomain);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return finalproject;

	}

	public int UserManagement_ExecuteQuery_CreateUser(String authString, String userId, String password,
			String userName, String email, String mobileNum, boolean isLadp, boolean adminstatus,
			AuthenticationService authenticateService) {

		int count = 0;

		String password1 = null;
		String auth = password;

		try {

			EncryptL encrypt = new EncryptL();

			if (!isLadp) {
				password1 = encrypt.calculateHash(authenticateService.decryptHeader(password));
			} else {
				password1 = null;
			}

			// boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

			UserVO uservo = new UserVO();
			Query query = new Query();

			if (adminstatus) {
				uservo.setAdmin(false);
				uservo.setUserId(userId);

				uservo.setPassword(password1);

				uservo.setLdap(isLadp);

				// Check PasswordReset
				if (isLadp) {

					uservo.setIspassReset(false);
					mobileNum = userId + "0000";
					email = userId + "@mail.com";
					userName = userId;

				} else {
					uservo.setIspassReset(true);
				}

				uservo.setLifeCycle(false);
				uservo.setCoEDashboard(false);
				uservo.setCustomMetrics(false);
				uservo.setRiskCompliance(false);
				uservo.setMobileNum(mobileNum);
				uservo.setEmail(email);
				uservo.setOperational(false);

				uservo.setQbot(false);
				uservo.setRole("SDET");
				uservo.setUserName(userName);
				uservo.setUserImg(
						"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");

				if (adminstatus) {
					uservo.setActive(true);
					uservo.setAccessible(true);
				} else {
					uservo.setActive(false);
					uservo.setAccessible(false);
				}
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

			} else {
				return 5;
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return count;
	}

	public int UserManagement_ExecuteQuery_UpdateUser(String authString, String userId, String userName, String email,
			String mobileNum, boolean adminstatus) {

		int count = 0;
		try {

			UserVO uservo = new UserVO();
			Query query = new Query();

			query = new Query(new Criteria().orOperator(Criteria.where("userId").is(userId),
					Criteria.where("userName").is(userName), Criteria.where("email").is(email),
					Criteria.where("mobileNum").is(mobileNum)));

			List<UserVO> userInfo = getMongoOperation().find(query, UserVO.class);
			if (adminstatus) {
				Update update = new Update();
				update.set("userName", userName);
				update.set("email", email);
				update.set("mobileNum", mobileNum);

				query.addCriteria(Criteria.where("userId").is(userId));

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
					getMongoOperation().updateFirst(query, update, UserVO.class);
				}

			} else {
				return 5;
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_UploadUserImage(String authString, InputStream userImg,
			String profileFileName, String userId) {

		int change = 1;
		try {

			String photoString;

			Update update = new Update();

			if ((FilenameUtils.isExtension(profileFileName, "jpg") || FilenameUtils.isExtension(profileFileName, "jpeg")
					|| FilenameUtils.isExtension(profileFileName, "png"))
					&& (!profileFileName.equalsIgnoreCase("undefined"))) {

				byte[] imageBytes = IOUtils.toByteArray(userImg);
				String contentType = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imageBytes));
				if (contentType == null) {
					change = 0;
					// throw new BaseException("Please upload validate image file only !");
				} else if (contentType.startsWith("image/")) {
					photoString = Base64.getEncoder().encodeToString(imageBytes);
					update.set("userImg", photoString);

					Query query = new Query();
					query.addCriteria(Criteria.where("userId").is(userId));

					getMongoOperation().updateFirst(query, update, UserVO.class);
				} else {
					change = 0;
					// throw new BaseException("Please upload validate image file only!");
				}
			} else if (profileFileName.equalsIgnoreCase("undefined")) {
				update.set("userImg", "");
				change = 0;
			} else {
				update.set("userImg", "");
				change = 0;
				// return change;
				// throw new BaseException("Please upload image with extension as .jpg or .jpeg
				// only!");

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return change;
	}

	public int UserManagement_ExecuteQuery_UpdateUserRole(String authString, String userId, String role) {

		int change = 1;
		try {

			Query query = new Query();
			Update update = new Update();
			update.set("role", role);
			if (role.equalsIgnoreCase("admin")) {
				update.set("isAdmin", true);
			} else {
				update.set("isAdmin", false);
			}

			query.addCriteria(Criteria.where("userId").is(userId));
			getMongoOperation().updateFirst(query, update, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return change;
	}

	public int UserManagement_ExecuteQuery_RemoveLogo(String authString, String userId) {

		int change = 1;
		try {
			Update update = new Update();
			update.set("orgName", "");
			update.set("orgLogo", "");

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));

			getMongoOperation().updateMulti(query, update, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return change;

	}

	public int UserManagement_ExecuteQuery_AddLogo(String authString, String orgName, InputStream orgLogo,
			String usersel, String profileFileName) {

		int change = 1;

		try {

			String photoString;
			List<String> users = new ArrayList<String>();
			for (String retval : usersel.split(",")) {
				users.add(retval);
			}

			Update update = new Update();

			if ((FilenameUtils.isExtension(profileFileName, "jpg") || FilenameUtils.isExtension(profileFileName, "jpeg")
					|| FilenameUtils.isExtension(profileFileName, "png")
					|| FilenameUtils.isExtension(profileFileName, "gif"))
					&& (!profileFileName.equalsIgnoreCase("undefined"))) {

				byte[] imageBytes = IOUtils.toByteArray(orgLogo);

				String contentType = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imageBytes));
				if (contentType == null) {
					change = 0;
				} else if (contentType.startsWith("image/")) {
					photoString = Base64.getEncoder().encodeToString(imageBytes);

					update.set("orgLogo", photoString);
					update.set("orgName", orgName);

					Query query = new Query();
					query.addCriteria(Criteria.where("userId").in(users));

					getMongoOperation().updateMulti(query, update, UserVO.class);
				} else {
					change = 0;
				}

			} else if (profileFileName.equalsIgnoreCase("undefined")) {
				update.set("orgName", "");
				update.set("orgLogo", "");
				change = 0;
			} else {
				update.set("orgName", "");
				update.set("orgLogo", "");
				change = 0;
				// throw new BaseException("Please upload image with extension as .jpg or .jpeg
				// only!");

			}

			/*
			 * byte[] imageBytes = IOUtils.toByteArray(orgLogo); photoString =
			 * Base64.getEncoder().encodeToString(imageBytes);
			 * 
			 * update.set("orgLogo", photoString);
			 */

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return change;
	}

	public int UserManagement_ExecuteQuery_UpdateUserInfo(String authString, String data) {

		int count = 0;
		try {

			UserVO uservo = new UserVO();
			ObjectMapper obj = new ObjectMapper();

			// obj.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

			uservo = obj.readValue(data, UserVO.class);

			// Whitelisting - Security fix for JSON injection

			Query userquery = new Query();
			List<UserVO> userInfo = getMongoOperation().find(userquery, UserVO.class);
			List<UserVO> testedUserInfo = new ArrayList<UserVO>();

			if (!uservo.isLdap()) {
				for (UserVO uvo : userInfo) {
					if (uservo.getEmail().equalsIgnoreCase(uvo.getEmail())
							&& uservo.getMobileNum().equalsIgnoreCase(uvo.getMobileNum())
							&& uservo.getUserId().equalsIgnoreCase(uvo.getUserId())
							&& uservo.getUserName().equalsIgnoreCase(uvo.getUserName())) {
						testedUserInfo.add(uservo);
						break;
					}
				}
			}

			// Whitelisting ends here
			testedUserInfo.add(uservo);
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(0).getUserId()));

			Update update = new Update();
			update.set("isAccessible", testedUserInfo.get(0).isAccessible());
			update.set("isLdap", testedUserInfo.get(0).isLdap());
			update.set("isOperational", testedUserInfo.get(0).isOperational());
			update.set("isLifeCycle", testedUserInfo.get(0).isLifeCycle());
			update.set("isQbot", testedUserInfo.get(0).isQbot());
			update.set("isCoEDashboard", testedUserInfo.get(0).isCoEDashboard());
			update.set("isRiskCompliance", testedUserInfo.get(0).isRiskCompliance());
			if (testedUserInfo.get(0).isRiskCompliance() == true || testedUserInfo.get(0).isCoEDashboard() == true) {
				update.set("isCustomMetrics", true);
			} else {
				update.set("isCustomMetrics", false);
			}
			count = 1;
			if (testedUserInfo.get(0).isAccessible() == true) {

				update.set("isActive", true);
			} else {

				update.set("isActive", false);
			}

			getMongoOperation().updateFirst(query, update, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_SaveAdminProjectAccess(String authString, String userId,
			List<String> selectedProjects) {

		int count = 0;

		try {
			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			String listLevelIDString = "[";

			for (int i = 0; i < selectedProjects.size(); i++) {
				listLevelIDString = listLevelIDString + (selectedProjects.get(i));
				if (i != selectedProjects.size() - 1) {
					listLevelIDString = listLevelIDString + ",";
				}
			}

			listLevelIDString = listLevelIDString + "]";

			JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

			List<UserProjectVO> listLevelID = null;
			TypeReference<List<UserProjectVO>> tRef = new TypeReference<List<UserProjectVO>>() {
			};

			listLevelID = mapper.readValue(jsonParser, tRef);

			// Whitelisting - Security fix for JSON injection

			Query levelquery = new Query();
			List<LevelItemsVO> levelDetails = getMongoOperation().find(levelquery, LevelItemsVO.class);
			List<UserProjectVO> testedListLevelID = new ArrayList<UserProjectVO>();

			for (UserProjectVO vo : listLevelID) {
				for (LevelItemsVO lvo : levelDetails) {
					if (vo.getLevel1().equalsIgnoreCase(lvo.getLevel1())
							&& vo.getLevel2().equalsIgnoreCase(lvo.getLevel2())) {
						testedListLevelID.add(vo);
						break;
					}
				}
			}

			// Whitelisting ends here

			Update update = new Update();

			update.set("selectedProjects", testedListLevelID);

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));

			getMongoOperation().updateFirst(query, update, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_UpdateDashboards(String authString, String userId) {

		int count = 0;

		try {
			List<UserVO> userdetails = new ArrayList<UserVO>();

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));

			userdetails = getMongoOperation().find(query, UserVO.class);

			List<String> level1list = new ArrayList<String>();
			List<String> level2list = new ArrayList<String>();

			for (int i = 0; i < userdetails.get(0).getSelectedProjects().size(); i++) {
				level1list.add(userdetails.get(0).getSelectedProjects().get(i).getLevel1());
				level2list.add(userdetails.get(0).getSelectedProjects().get(i).getLevel2());
			}

			if (level1list.size() != 0) {

				List<OperationalDashboardVO> dashboarddetails = new ArrayList<OperationalDashboardVO>();

				Query query1 = new Query();
				query1.addCriteria(Criteria.where("owner").is(userId));

				dashboarddetails = getMongoOperation().find(query1, OperationalDashboardVO.class);

				List<String> notselected = new ArrayList<String>();

				for (int d = 0; d < dashboarddetails.size(); d++) {
					for (OperationDashboardDetailsVO vo : dashboarddetails.get(d).getReleaseSet()) {

						if (!level2list.contains(vo.getLevel2())) {
							notselected.add(vo.getLevel2());
						}

						if (notselected.size() != 0) {
							for (int o = 0; o < notselected.size(); o++) {
								Query query2 = new Query();
								query2.addCriteria(Criteria.where("owner").is(userId));
								query2.addCriteria(Criteria.where("releaseSet.level1").is(vo.getLevel1()));

								Update update = new Update().pull("releaseSet",
										new BasicDBObject("level2", notselected.get(o)));

								getMongoOperation().updateMulti(query2, update, "operationalDashboards");
								count = 1;
							}
						}
					}
				}
			} else {

				Query query3 = new Query();
				query3.addCriteria(Criteria.where("owner").is(userId));

				Update update = new Update();
				update.unset("releaseSet");

				getMongoOperation().updateMulti(query3, update, "operationalDashboards");

				count = 1;
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return count;
	}

	public int UserManagement_ExecuteQuery_DeleteUserInfo(String authString, String userId) {

		int count = 0;
		try {

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			getMongoOperation().remove(query, UserVO.class);
			logger.error("DELETED USER SUCCESSFULLY");

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("owner").is(userId));
			getMongoOperation().remove(query1, OperationalDashboardVO.class);
			logger.error("USER CREATED DASHBOARDS DELETED SUCCESSFULLY");

			count = 1;

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public List<UserVO> UserManagement_ExecuteQuery_GetLoginRequests(String authString) {

		List<UserVO> userInfo = null;

		try {

			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isAccessible").is(false));
			userInfo = getMongoOperation().find(query, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return userInfo;
	}

	public Object[] UserManagement_ExecuteQuery_GetActiveUsersCount(String authString) {
		Object[] objArray = null;
		try {

			List<UserVO> userInfo = null;

			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isActive").is(true));

			userInfo = getMongoOperation().find(query, UserVO.class);
			objArray = userInfo.toArray();

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return objArray;
	}

	public int UserManagement_ExecuteQuery_LoginRequests(String authString, String output) {

		int count = 0;
		try {

			ObjectMapper mapper = new ObjectMapper();
			List<UserVO> myObjects = mapper.readValue(output, new TypeReference<List<UserVO>>() {
			});

			// Whitelisting - Security fix for JSON injection

			Query userquery = new Query();
			List<UserVO> userInfo = getMongoOperation().find(userquery, UserVO.class);
			List<UserVO> testedUserInfo = new ArrayList<UserVO>();

			for (UserVO vo : myObjects) {
				for (UserVO uvo : userInfo) {
					if (vo.getEmail().equalsIgnoreCase(uvo.getEmail())
							&& vo.getPassword().equalsIgnoreCase(uvo.getPassword())
							&& vo.getRole().equalsIgnoreCase(uvo.getRole())
							&& vo.getUserId().equalsIgnoreCase(uvo.getUserId())
							&& vo.getUserName().equalsIgnoreCase(uvo.getUserName())) {
						testedUserInfo.add(vo);
						break;
					}
				}
			}

			// Whitelisting ends here

			for (int i = 0; i < testedUserInfo.size(); i++) {

				if (testedUserInfo.get(i).isAccessible()) {
					Query query = new Query();
					Update update = new Update();
					update.set("isAccessible", testedUserInfo.get(i).isAccessible());
					update.set("isActive", true);

					query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));

					getMongoOperation().updateFirst(query, update, UserVO.class);
					count = 1;
				}
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public Object[] UserManagement_ExecuteQuery_GetInActiveUsersCount(String authString) {
		Object[] objArray = null;
		try {

			List<UserVO> userInfo = null;

			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isActive").is(false));

			userInfo = getMongoOperation().find(query, UserVO.class);

			objArray = userInfo.toArray();

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return objArray;
	}

	public List<UserCountVO> UserManagement_ExecuteQuery_GetUserCount(String authString) {

		List<UserCountVO> adminUserCount = null;
		try {

			adminUserCount = new ArrayList<UserCountVO>();
			UserCountVO userCount = new UserCountVO();

			Query query1 = new Query();
			Query query2 = new Query();
			Query query3 = new Query();

			long pendingRequests = 0;
			long activeUsers = 0;
			long inactiveUsers = 0;

			query1.addCriteria(Criteria.where("isAccessible").is(false));
			pendingRequests = getMongoOperation().count(query1, UserVO.class);

			query2.addCriteria(Criteria.where("isActive").is(true));
			activeUsers = getMongoOperation().count(query2, UserVO.class);

			query3.addCriteria(Criteria.where("isActive").is(false));
			inactiveUsers = getMongoOperation().count(query3, UserVO.class);

			userCount.setPendingRequests(pendingRequests);
			userCount.setActiveUsers(activeUsers);
			userCount.setInactiveUsers(inactiveUsers);

			adminUserCount.add(userCount);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return adminUserCount;
	}

	public List<UserVO> UserManagement_ExecuteQuery_GetLockedAccountCount(String authString) {

		List<UserVO> userInfo = null;
		try {

			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("acLock").is(true));
			userInfo = getMongoOperation().find(query, UserVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return userInfo;
	}

	public int UserManagement_ExecuteQuery_GetInactivateUsers(String authString, String output) {

		int count = 0;
		try {

			ObjectMapper mapper = new ObjectMapper();
			List<UserVO> myObjects = mapper.readValue(output, new TypeReference<List<UserVO>>() {
			});

			// Whitelisting - Security fix for JSON injection

			Query userquery = new Query();
			List<UserVO> userInfo = getMongoOperation().find(userquery, UserVO.class);
			List<UserVO> testedUserInfo = new ArrayList<UserVO>();

			for (UserVO vo : myObjects) {
				for (UserVO uvo : userInfo) {
					if (vo.getEmail().equalsIgnoreCase(uvo.getEmail())
							&& vo.getPassword().equalsIgnoreCase(uvo.getPassword())
							&& vo.getRole().equalsIgnoreCase(uvo.getRole())
							&& vo.getUserId().equalsIgnoreCase(uvo.getUserId())
							&& vo.getUserName().equalsIgnoreCase(uvo.getUserName())) {
						testedUserInfo.add(vo);
						break;
					}
				}
			}

			// Whitelisting ends here

			for (int i = 0; i < testedUserInfo.size(); i++) {

				if (testedUserInfo.get(i).isActive() == false) {
					Query query = new Query();
					Update update = new Update();
					update.set("isActive", false);
					update.set("isAccessible", false);

					query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));
					getMongoOperation().updateFirst(query, update, UserVO.class);
					count = 1;
				}

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_GetactivateUsers(String authString, String output) {

		int count = 0;
		try {

			ObjectMapper mapper = new ObjectMapper();
			List<UserVO> myObjects = mapper.readValue(output, new TypeReference<List<UserVO>>() {
			});

			// Whitelisting - Security fix for JSON injection

			Query userquery = new Query();
			List<UserVO> userInfo = getMongoOperation().find(userquery, UserVO.class);
			List<UserVO> testedUserInfo = new ArrayList<UserVO>();

			for (UserVO vo : myObjects) {
				for (UserVO uvo : userInfo) {
					if (vo.getEmail().equalsIgnoreCase(uvo.getEmail())
							&& vo.getPassword().equalsIgnoreCase(uvo.getPassword())
							&& vo.getRole().equalsIgnoreCase(uvo.getRole())
							&& vo.getUserId().equalsIgnoreCase(uvo.getUserId())
							&& vo.getUserName().equalsIgnoreCase(uvo.getUserName())) {
						testedUserInfo.add(vo);
						break;
					}
				}
			}

			// Whitelisting ends here

			for (int i = 0; i < testedUserInfo.size(); i++) {

				if (testedUserInfo.get(i).isActive() == false) {
					Query query = new Query();
					Update update = new Update();
					update.set("isActive", true);
					update.set("isAccessible", true);

					query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));
					getMongoOperation().updateFirst(query, update, UserVO.class);
					count = 1;
				}

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_GetLockRequests(String authString, String output) {

		int count = 0;
		try {

			ObjectMapper mapper = new ObjectMapper();
			List<UserVO> myObjects = mapper.readValue(output, new TypeReference<List<UserVO>>() {
			});

			// Whitelisting - Security fix for JSON injection

			Query userquery = new Query();
			List<UserVO> userInfo = getMongoOperation().find(userquery, UserVO.class);
			List<UserVO> testedUserInfo = new ArrayList<UserVO>();

			for (UserVO vo : myObjects) {
				for (UserVO uvo : userInfo) {
					if (vo.getEmail().equalsIgnoreCase(uvo.getEmail())
							&& vo.getPassword().equalsIgnoreCase(uvo.getPassword())
							&& vo.getRole().equalsIgnoreCase(uvo.getRole())
							&& vo.getUserId().equalsIgnoreCase(uvo.getUserId())
							&& vo.getUserName().equalsIgnoreCase(uvo.getUserName())) {
						testedUserInfo.add(vo);
						break;
					}
				}
			}

			// Whitelisting ends here

			for (int i = 0; i < testedUserInfo.size(); i++) {

				Query query = new Query();
				Update update = new Update();
				update.set("acLock", testedUserInfo.get(i).isAcLock());

				query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));

				getMongoOperation().updateFirst(query, update, UserVO.class);
				count = 1;
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int UserManagement_ExecuteQuery_Savenewpassword(String authString, 
			String oldPassword, String newPassword)
			 {
		
		int count = 0;
		
		String dbPassword = "";
		String newPassword1 ="";

		try {
			
			EncryptL encrypt = new EncryptL();
			AuthenticationService authenticationService = new AuthenticationService();
			
			UserVO authUser = authenticationService.getUserDetails(authString);

			
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("userId").is(authUser.getUserId()));
			UserVO userFromDb = getMongoOperation().findOne(query1, UserVO.class);
			
			dbPassword = userFromDb.getPassword();
			
			String oldPassword1 = encrypt.calculateHash(authenticationService.decryptHeader(oldPassword));
			
			if (dbPassword.equalsIgnoreCase(oldPassword1)) {
				newPassword1 =encrypt.calculateHash(authenticationService.decryptHeader(newPassword));
				Update update = new Update(); 
				update.set("password", newPassword1);
				getMongoOperation().updateFirst(query1, update, UserVO.class);
				count++;
			}
			

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return count;
	}

}
