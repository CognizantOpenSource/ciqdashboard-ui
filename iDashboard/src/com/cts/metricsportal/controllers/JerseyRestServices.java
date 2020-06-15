package com.cts.metricsportal.controllers;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;

import java.io.ByteArrayInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLConnection;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.StringTokenizer;

import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.swing.text.BadLocationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.apache.poi.util.IOUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cognizant.cimesg.encryptl.core.EncryptL;
import com.cognizant.idashboard.iAuthentication;
import com.idashboard.LicenseReader.*;
import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.dao.AlmMongoOperations;
import com.idashboard.emailScheduler.MailScheduler;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.util.SessionHandler;
import com.cts.metricsportal.vo.ALMdetailsVO;
import com.cts.metricsportal.vo.AvailableMetricVO;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.Ca_detailVO;
import com.cts.metricsportal.vo.CustomTemplateVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.DomainProjectVO;
import com.cts.metricsportal.vo.DomainVO;
import com.cts.metricsportal.vo.LevelItemsVO;

import com.cts.metricsportal.vo.MenuItemsVO;
import com.cts.metricsportal.vo.MenuListVO;
import com.cts.metricsportal.vo.OperationDashboardDetailsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.ProjectVO;
import com.cts.metricsportal.vo.ReleaseVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.SelectedMetricVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.ToolSelectionVO;
import com.cts.metricsportal.vo.UserCountVO;
import com.cts.metricsportal.vo.UserProjectVO;
//import com.cts.metricsportal.vo.UserVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idashboard.admin.vo.LicenseVO;
import com.idashboard.admin.vo.UserVO;
import com.mongodb.BasicDBObject;
import com.sun.jersey.multipart.FormDataParam;
import com.idashboard.LicenseReader.*;

@Path("/jsonServices")
public class JerseyRestServices extends BaseMongoOperation {

	// Tool Selection Details
	static final Logger logger = Logger.getLogger(JerseyRestServices.class);
	SessionHandler sessionHandler = new SessionHandler();

	@GET
	@Path("/saveToolDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int getsaveToolDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("toolsSelected") String toolsSelected, @QueryParam("template") String template)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (adminstatus) {
			String templatelist[] = template.split(",");

			ToolSelectionVO toolDetails = new ToolSelectionVO();

			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			JsonParser jsonParser = jf.createJsonParser(toolsSelected);

			List<ToolSelectionVO> toolSelection = null;
			TypeReference<List<ToolSelectionVO>> tRef = new TypeReference<List<ToolSelectionVO>>() {
			};

			toolSelection = mapper.readValue(jsonParser, tRef);

			getMongoOperation().dropCollection(ToolSelectionVO.class);

			for (int i = 0; i < toolSelection.size(); i++) {

				toolDetails.setImagePath(toolSelection.get(i).getImagePath());
				toolDetails.setKey(toolSelection.get(i).getKey());
				toolDetails.setLabel(toolSelection.get(i).getLabel());
				toolDetails.setUserId(userId);
				toolDetails.setPosition(toolSelection.get(i).getPosition());
				toolDetails.setTemplate(templatelist[i]);

				getMongoOperation().save(toolDetails, "toolSelection");

			}
		}

		return 1;
	}

	// creating and saving the custom template created by admin for metrics
	@POST
	@Path("/saveMetricDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int saveMetricDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedTemplate") String selectedTemplate,
			@QueryParam("selectMetrics") List<String> selectMetrics, @QueryParam("rollingPeriod") String rollingPeriod,
			@QueryParam("isJiratool") boolean isJiratool, @QueryParam("isAlmtool") boolean isAlmtool)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {

		int count = 0;
		String newtempId = "";

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (adminstatus) {

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = new MappingJsonFactory();

			String listMetricString = "";
			List<SelectedMetricVO> listMetrics = null;
			TypeReference<List<SelectedMetricVO>> tRef = new TypeReference<List<SelectedMetricVO>>() {
			};
			for (int i = 0; i < selectMetrics.size(); i++) {
				listMetricString = listMetricString + (selectMetrics.get(i));
				JsonParser jsonParser = jf.createJsonParser(listMetricString);
				if (i != selectMetrics.size() - 1) {
					listMetricString = listMetricString + ",";
				}
				listMetrics = mapper.readValue(jsonParser, tRef);
			}

			listMetricString = listMetricString + "";

			// generate template ID

			Query query = new Query();
			query.limit(1);
			query.with(new Sort(Sort.Direction.DESC, "templateId"));

			List<CustomTemplateVO> fetchres = getMongoOperation().find(query, CustomTemplateVO.class);
			if (!fetchres.isEmpty()) {
				String tempId = fetchres.get(0).getTemplateId();
				tempId = tempId.substring(1);
				int tempnum = Integer.parseInt(tempId);
				tempnum += 1;

				newtempId = "T" + tempnum;

			} else {
				newtempId = "T1001";
			}

			CustomTemplateVO dashvo = new CustomTemplateVO();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);
			dashvo.setRole("admin");
			dashvo.setTemplateId(newtempId);
			dashvo.setTemplateName(selectedTemplate);
			dashvo.setSelectedMetrics(listMetrics);

			dashvo.setAlmtool(isAlmtool);
			dashvo.setJiratool(isJiratool);
			dashvo.setUserId(userId);
			dashvo.setRollingPeriod(rollingPeriod);

			getMongoOperation().save(dashvo, "customTemplate");

		}

		return count;

	}

	// update template detaails in db

	@POST
	@Path("/updateMetricDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int updateMetricDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedTemplate") String selectedTemplate,
			@QueryParam("selectMetrics") List<String> selectMetrics, @QueryParam("rollingPeriod") String rollingPeriod,
			@QueryParam("isJiratool") boolean isJiratool, @QueryParam("isAlmtool") boolean isAlmtool)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		int count = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (adminstatus) {

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = new MappingJsonFactory();

			String listMetricString = "";
			List<SelectedMetricVO> listMetrics = null;
			TypeReference<List<SelectedMetricVO>> tRef = new TypeReference<List<SelectedMetricVO>>() {
			};
			for (int i = 0; i < selectMetrics.size(); i++) {
				listMetricString = listMetricString + (selectMetrics.get(i));
				JsonParser jsonParser = jf.createJsonParser(listMetricString);
				if (i != selectMetrics.size() - 1) {
					listMetricString = listMetricString + ",";
				}
				listMetrics = mapper.readValue(jsonParser, tRef);
			}

			listMetricString = listMetricString + "";

			// generate template ID

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			query.addCriteria(Criteria.where("role").is("admin"));
			query.addCriteria(Criteria.where("templateName").is(selectedTemplate));

			Update update = new Update();
			update.set("rollingPeriod", rollingPeriod);
			update.set("isJiratool", isJiratool);
			update.set("isAlmtool", isAlmtool);
			update.set("selectedMetrics", listMetrics);
			getMongoOperation().updateFirst(query, update, CustomTemplateVO.class);

		}

		return count;

	}

	// delete used template details
	@GET
	@Path("/templateNameInOperational")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public long templateNameInOperational(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) throws Exception {
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		long templateList = 0;

		if (adminstatus) {
			List<OperationalDashboardVO> operationaldb = new ArrayList<OperationalDashboardVO>();

			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(templateName));
			templateList = getMongoOperation().count(query, OperationalDashboardVO.class);
		}
		return templateList;
	}

	// delete used template details
	@GET
	@Path("/deleteTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteTemplateName(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		List<String> templateList = new ArrayList<String>();

		int count = 0;
		if (adminstatus) {

			Query query = new Query();
			Query query1 = new Query();
			// templateList =
			// getMongoOperation().getCollection("operationalDashboards").distinct("templateName");
			// if(templateList.contains(templateName)){

			query.addCriteria(Criteria.where("templateName").is(templateName));
			getMongoOperation().remove(query, CustomTemplateVO.class);

			List<OperationalDashboardVO> operationaldb = new ArrayList<OperationalDashboardVO>();

			query1.addCriteria(Criteria.where("templateName").is(templateName));
			Update update = new Update();
			update.set("templateName", "");
			getMongoOperation().updateMulti(query1, update, OperationalDashboardVO.class);

		} else {
			count = 1;
		}

		return count;
	}

	// delete unused template
	@GET
	@Path("/deleteUnusedTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteUnusedTemplateName(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		int count = 0;
		if (adminstatus) {

			Query query = new Query();

			query.addCriteria(Criteria.where("templateName").is(templateName));
			getMongoOperation().remove(query, CustomTemplateVO.class);

			return count;

		}

		else {
			return count = 1;
		}
	}

	// get the number of template from property file

	@GET
	@Path("/getNumberOfTemplate")
	public int getverticaldata() throws Exception {
		String numberOfTemplate = null;
		if (numberOfTemplate == null) {

			numberOfTemplate = PropertyManager.getProperty("NumberOfTemplate", "properties/admintemplate.properties");

		}

		int verticallist = Integer.parseInt(numberOfTemplate);

		return verticallist;

	}

	// get available list of metric from db
	@GET
	@Path("/metricAvailableList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<AvailableMetricVO> getAvailableMetricList(@HeaderParam("Authorization") String authString,
			@QueryParam("jiraMetric") boolean jiraMetric, @QueryParam("almMetric") boolean almMetric)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<AvailableMetricVO> availableMetric = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			availableMetric = new ArrayList<AvailableMetricVO>();
			if (jiraMetric || almMetric) {
				Query query = new Query();
				query = new Query(new Criteria().orOperator(Criteria.where("almMetric").is(almMetric),
						Criteria.where("jiraMetric").is(jiraMetric)));

				availableMetric = getMongoOperation().find(query, AvailableMetricVO.class);
			}
		}
		return availableMetric;

	}

	// existTemplateName
	@POST
	@Path("/existTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean templateName(@HeaderParam("Authorization") String authString,
			@QueryParam("selectTemplate") String selectTemplate) throws Exception {
		boolean exist = false;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (adminstatus) {

			Query query = new Query();

			query.addCriteria(Criteria.where("templateName").is(selectTemplate));

			List<CustomTemplateVO> userInfo = getMongoOperation().find(query, CustomTemplateVO.class);
			if (userInfo.size() > 0) {
				exist = true;
			}

		}
		return exist;
	}

	// get template details from db
	@GET
	@Path("/templateDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CustomTemplateVO> getTemplateDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		String query = "{},{_id:0}";
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		List<CustomTemplateVO> templateDetails = new ArrayList<CustomTemplateVO>();
		if (adminstatus) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("role").is("admin"));
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));

			templateDetails = getMongoOperation().find(query1, CustomTemplateVO.class);

		}

		return templateDetails;
	}

	// License Details

	@GET
	@Path("/licenseDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LicenseVO> getlicenseDetails() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		LicenseReader lr = new LicenseReader();
		List<LicenseVO> readerValues = new ArrayList<LicenseVO>();

		try {
			//readerValues = lr.getReaderValues();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (readerValues.get(0).getisMacIdVerify()) {
			readerValues = readerValues;
		} else {
			readerValues = null;
		}

		String user = null;

		if (!(readerValues == null)) {

			user = readerValues.get(0).getUser();

			Date expiryDate = readerValues.get(0).getEndDate();
			int daysRemaining = (int) readerValues.get(0).getDaysRemaining();

			if (readerValues.get(0).getDaysRemaining() < 5 && !(readerValues.get(0).getDaysRemaining() <= 0)) {
				MailScheduler mailschedule = new MailScheduler();
				mailschedule.TimerTaskForMail(daysRemaining, expiryDate, user, false);
			}

			if (readerValues.get(0).getDaysRemaining() <= 0) {
				MailScheduler mailschedule = new MailScheduler();
				mailschedule.TimerTaskForMail(daysRemaining, expiryDate, user, true);
			}

			String version = readerValues.get(0).getVersion();

			if (version != null) {
				if (version.equalsIgnoreCase(" Lite Version")) {
					Update update = new Update();
					update.set("isQbot", false);
					Query query1 = new Query();
					getMongoOperation().updateMulti(query1, update, UserVO.class);
				}
			}
		}

		return readerValues;
	}

	// License Details

	@GET
	@Path("/lockAccount")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean getlockAccount(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (!adminstatus) {
			Update update = new Update();
			update.set("acLock", true);

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			getMongoOperation().updateMulti(query, update, UserVO.class);

			return true;
		} else {
			return false;
		}
	}

	// Check LDAP Status of User

	@GET
	@Path("/updateLicenseKey")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean updateLicenseKey(@HeaderParam("Authorization") String authString,
			@QueryParam("licenseKey") String licenseKey) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		String licenseKeyFinal = licenseKey.replaceAll("%2B", "+");

		String filePath = null;
		try {
			filePath = PropertyManager.getProperty("LICENSE_FILE_PATH", "properties/dashboardConfig.properties");
		} catch (Exception e2) {
			// TODO Auto-generated catch block
			logger.error(e2.getMessage());
		}

		LicenseReader readFile = new LicenseReader();
		String securedFilePath = readFile.cleanString(filePath);

		FileWriter fw = new FileWriter(securedFilePath);
		// BufferedWriter br = null;
		boolean change = false;
		try {
			// fw = new FileWriter(filePath);
			fw.write(licenseKeyFinal);
			change = true;
		} catch (Exception e) {
			logger.error("Didnt update");
		} finally {
			fw.close();
		}

		return change;
	}

	// Check LDAP Status of User

	@GET
	@Path("/getldapstatus")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean getldapstatus(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserVO> userinfo = null;
		Query query1 = new Query();
		boolean status = false;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		query1.addCriteria(Criteria.where("userId").regex(userId, "i"));
		userinfo = getMongoOperation().find(query1, UserVO.class);
		if (!userinfo.isEmpty()) {
			status = userinfo.get(0).isLdap();
		}

		return status;
	}

	// Authentication - For the user to login

	@POST
	@Path("/authentication")
	@Produces(MediaType.APPLICATION_JSON)
	public UserVO getUserInfo(@HeaderParam("Authorization") String authString) throws Exception {
		AuthenticationService authenticationService = new AuthenticationService();

		UserVO authUser = authenticationService.getUserDetails(authString);

		UserVO userInfo = new UserVO();
		UserVO ldapInfo = new UserVO();
		Query query1 = new Query();
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
						/*userInfo=ldapInfo*/;
					
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
		return userInfo;
	}

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

	@POST
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean logoutlogs(@HeaderParam("Authorization") String authString) throws Exception {
		boolean result = false;
		AuthenticationService authenticationService = new AuthenticationService();
		try {

			UserVO userInfo = authenticationService.getUserDetailsPassEncrypted(authString);
			sessionHandler.logoutCurrentSession(userInfo);
			result = true;
		} catch (Exception e) {
			logger.error(e);
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/createOperationalDashboard")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getOperationDashboard(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		Query allinfo = new Query();
		allinfo.addCriteria(Criteria.where("userId").is(userId));
		List<UserVO> allinfolist = new ArrayList<UserVO>();
		allinfolist = getMongoOperation().find(allinfo, UserVO.class);

		List<String> domainlist = new ArrayList<String>();

		// domain
		for (int q = 0; q < allinfolist.get(0).getSelectedProjects().size(); q++) {
			if (allinfolist.get(0).getSelectedProjects().get(q).getSourceTool().equalsIgnoreCase("ALM")) {
				domainlist.add(allinfolist.get(0).getSelectedProjects().get(q).getLevel1());
			}
		}

		Set<String> domainset = new HashSet<String>(domainlist);
		List<String> domain = new ArrayList<String>(domainset);

		/*
		 * Query domainquery = new Query();
		 * domainquery.addCriteria(Criteria.where("userId").is(userId)); List<String>
		 * domain = getMongoOperation().getCollection("userInfo").distinct(
		 * "selectedProjects.level1", domainquery.getQueryObject());
		 */
		// end of domain

		// project
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;
		if (operationalAccess) {
			for (int i = 0; i < domain.size(); i++) {
				List<String> projectlist = new ArrayList<String>();
				for (int s = 0; s < allinfolist.get(0).getSelectedProjects().size(); s++) {
					if (allinfolist.get(0).getSelectedProjects().get(s).getLevel1().equals(domain.get(i))) {
						if (allinfolist.get(0).getSelectedProjects().get(s).getSourceTool().equalsIgnoreCase("ALM")) {
							projectlist.add(allinfolist.get(0).getSelectedProjects().get(s).getLevel2());
						}
					}

				}

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("AD" + domainID++);
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSelected(false);
				selectdomain.setSourceTool("ALM");
				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < projectlist.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("AP" + projectID++);
					selectproject.setLevel2(projectlist.get(j));
					selectproject.setSelected(false);
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
					query1.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
					release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
					endjson = new ArrayList<ReleaseVO>();

					for (int k = 0; k < release.size(); k++) {

						ReleaseVO selectrelease = new ReleaseVO();
						selectrelease.setLevel3ID("AR" + releaseID++);
						selectrelease.setLevel3(release.get(k));
						selectrelease.setSelected(false);
						endjson.add(selectrelease);

						Query query2 = new Query();
						query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
						query2.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
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

			return finalproject;
		} else {
			return finalproject;
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/createJiraOperationalDashboard")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getJiraOperationDashboard(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		Query allinfo = new Query();
		allinfo.addCriteria(Criteria.where("userId").is(userId));
		List<UserVO> allinfolist = new ArrayList<UserVO>();
		allinfolist = getMongoOperation().find(allinfo, UserVO.class);
		List<String> domainlist = new ArrayList<String>();

		// domain
		for (int q = 0; q < allinfolist.get(0).getSelectedProjects().size(); q++) {
			if (allinfolist.get(0).getSelectedProjects().get(q).getSourceTool().equalsIgnoreCase("JIRA")) {
				domainlist.add(allinfolist.get(0).getSelectedProjects().get(q).getLevel1());
			}
		}

		Set<String> domainset = new HashSet<String>(domainlist);
		List<String> domain = new ArrayList<String>(domainset);
		// end of domain

		// project
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;
		if (operationalAccess) {
			for (int i = 0; i < domain.size(); i++) {
				List<String> projectlist = new ArrayList<String>();
				for (int s = 0; s < allinfolist.get(0).getSelectedProjects().size(); s++) {
					if (allinfolist.get(0).getSelectedProjects().get(s).getLevel1().equals(domain.get(i))) {
						if (allinfolist.get(0).getSelectedProjects().get(s).getSourceTool().equalsIgnoreCase("JIRA")) {
							projectlist.add(allinfolist.get(0).getSelectedProjects().get(s).getLevel2());
						}
					}

				}

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("JD" + domainID++);
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSelected(false);
				selectdomain.setSourceTool("JIRA");
				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < projectlist.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("JP" + projectID++);
					selectproject.setLevel2(projectlist.get(j));
					selectproject.setSelected(false);
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
					query1.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
					release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
					endjson = new ArrayList<ReleaseVO>();

					for (int k = 0; k < release.size(); k++) {

						ReleaseVO selectrelease = new ReleaseVO();
						selectrelease.setLevel3ID("JR" + releaseID++);
						selectrelease.setLevel3(release.get(k));
						selectrelease.setSelected(false);
						endjson.add(selectrelease);

						Query query2 = new Query();
						query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
						query2.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
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

			return finalproject;
		} else {
			return finalproject;
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/getprojectsforadminaccess")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getprojectsforadminaccess(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		Query almquery = new Query();
		almquery.addCriteria(Criteria.where("SourceTool").is("ALM"));
		List<String> domain = getMongoOperation().getCollection("levelId").distinct("level1",
				almquery.getQueryObject());
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;
		if (adminstatus) {
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
			return finalproject;
		} else {
			return finalproject;
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/getjiraprojectsforadminaccess")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getjiraprojectsforadminaccess(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		Query almquery = new Query();
		almquery.addCriteria(Criteria.where("SourceTool").is("JIRA"));
		List<String> domain = getMongoOperation().getCollection("levelId").distinct("level1",
				almquery.getQueryObject());
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;
		if (adminstatus) {
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
			return finalproject;
		} else {
			return finalproject;
		}
	}

	@POST
	@Path("/saveAdminProjectAccess")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveAdminProjectAccess(@HeaderParam("Authorization") String authString,
			@QueryParam("userId") String userId, @QueryParam("selectedProjects") List<String> selectedProjects)
			throws Exception {
		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (adminstatus) {
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

			return count;
		} else {
			return count;
		}

	}

	/*
	 * @SuppressWarnings("unchecked")
	 * 
	 * @GET
	 * 
	 * @Path("/projectaccess")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON) public List<String> getprojectaccess()
	 * throws JsonParseException, JsonMappingException, IOException,
	 * NumberFormatException, BaseException, BadLocationException { { List<String>
	 * coll = getMongoOperation().getCollection("levelId").distinct("level2");
	 * return coll; }
	 * 
	 * }
	 */

	/* Sign Up process */
	@POST
	@Path("/signup")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int signup(@QueryParam("userId") String userId, @QueryParam("password") String password,
			@QueryParam("userName") String userName, @QueryParam("email") String email,
			@QueryParam("mobileNum") String mobileNum) throws Exception {

		int count = 0;

		UserVO uservo = new UserVO();
		Query query = new Query();
		byte[] decoded = DatatypeConverter.parseBase64Binary(password);
		char[] encryptedPassword = iAuthentication.write(decoded);
		StringBuilder sb = new StringBuilder();

		for (char ch : encryptedPassword) {
			sb.append(ch);
		}

		uservo.setAdmin(false);
		uservo.setUserId(userId);
		uservo.setPassword(sb.toString());
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

		query = new Query(
				new Criteria().orOperator(Criteria.where("userId").is(userId), Criteria.where("userName").is(userName),
						Criteria.where("email").is(email), Criteria.where("mobileNum").is(mobileNum)));

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
		return count;

	}

	/* Sign Up process */
	@POST
	@Path("/adminsignup")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int getadminsignup(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId,
			@QueryParam("password") String password, @QueryParam("userName") String userName,
			@QueryParam("email") String email, @QueryParam("mobileNum") String mobileNum) throws Exception {

		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		UserVO uservo = new UserVO();
		Query query = new Query();

		uservo.setAdmin(false);
		uservo.setUserId(userId);
		String encryptedPassword = iAuthentication.write(password);
		uservo.setPassword(encryptedPassword);
		uservo.setLdap(false);
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
		if (adminstatus) {
			uservo.setActive(true);
			uservo.setAccessible(true);
		} else {
			uservo.setActive(false);
			uservo.setAccessible(false);
		}
		uservo.setSelectedProjects(null);

		query = new Query(
				new Criteria().orOperator(Criteria.where("userId").is(userId), Criteria.where("userName").is(userName),
						Criteria.where("email").is(email), Criteria.where("mobileNum").is(mobileNum)));

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
		return count;

	}

	/* create new admin */
	@POST
	@Path("/createAdminUser")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)

	public int getcreateAdminUser(@HeaderParam("Authorization") String authString,
			@FormDataParam("userId") String userId, @FormDataParam("password") String password,
			@FormDataParam("userName") String userName, @FormDataParam("email") String email,
			@FormDataParam("mobileNum") String mobileNum, @FormDataParam("ldap") boolean isLadp) throws Exception {
		AuthenticationService authenticateService = new AuthenticationService();
		int count = 0;
		String password1 = null;
		String auth = password;
		EncryptL encrypt = new EncryptL();
		if (!isLadp) {
			password1 = encrypt.calculateHash(authenticateService.decryptHeader(password));
		} else {
			password1 = null;
		}
		;
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

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
			return count;
		} else {
			return 5;
		}

	}

	/* Admin Details Update */
	@POST
	@Path("/adminupdate")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public int getadminupdate(@HeaderParam("Authorization") String authString, @FormDataParam("userId") String userId,
			@FormDataParam("userName") String userName, @FormDataParam("email") String email,
			@FormDataParam("mobileNum") String mobileNum) throws Exception {

		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		UserVO uservo = new UserVO();
		Query query = new Query();

		query = new Query(
				new Criteria().orOperator(Criteria.where("userId").is(userId), Criteria.where("userName").is(userName),
						Criteria.where("email").is(email), Criteria.where("mobileNum").is(mobileNum)));

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
			return count;
		} else {
			return 5;
		}
	}

	/* Admin Details */
	@GET
	@Path("/adminDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getAdminInfo(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserVO> admininfo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			admininfo = new ArrayList<UserVO>();

			String sizequery = "{},{_id:0,userId:1}";
			Query query = new BasicQuery(sizequery);
			admininfo = getMongoOperation().find(query, UserVO.class);

			return admininfo;
		} else {
			return admininfo;
		}
	}

	/* Admin User Count and Pending Requests Details */
	@GET
	@Path("/adminUserCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserCountVO> getAdminUserCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<UserCountVO> adminUserCount = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
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

			return adminUserCount;
		} else {
			return adminUserCount;
		}
	}

	/* Getting Pending Login Requests */
	@GET
	@Path("/getloginRequests")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getloginRequests(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserVO> userInfo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isAccessible").is(false));
			userInfo = getMongoOperation().find(query, UserVO.class);

			return userInfo;
		} else {
			return userInfo;
		}
	}

	/* Getting Pending Login Requests */
	@GET
	@Path("/lockedAccountCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getlockedAccountCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<UserVO> userInfo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("acLock").is(true));
			userInfo = getMongoOperation().find(query, UserVO.class);

			return userInfo;
		} else {
			return userInfo;
		}
	}

	/* Aproving Login Requests */
	@POST
	@Path("/loginRequests")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int loginRequests(@HeaderParam("Authorization") String authString, String output) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int count = 0;
		if (adminstatus) {

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
			return count;
		} else {
			return count;
		}

	}

	/* Aproving Lock Requests */
	@POST
	@Path("/lockRequests")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int lockRequests(@HeaderParam("Authorization") String authString, String output) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int count = 0;
		if (adminstatus) {

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
			return count;
		} else {
			return count;
		}

	}

	/* Save new password */
	@POST
	@Path("/savenewpassword")
	@Produces(MediaType.APPLICATION_JSON)
	public int savenewpassword(@HeaderParam("Authorization") String authString,
			@HeaderParam("oldpassword") String oldPassword, @HeaderParam("newpassword") String newPassword)
			throws Exception {
		int count = 0;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("userId").is(userId));

		EncryptL encrypt = new EncryptL();
		String oldPassword1 = encrypt.calculateHash(authenticationService.decryptHeader(oldPassword));
		if (getMongoOperation().find(query1, UserVO.class).get(0).getPassword().equalsIgnoreCase(oldPassword1)) {
			String newPassword1 = encrypt.calculateHash(authenticationService.decryptHeader(newPassword));
			Update update = new Update();
			update.set("password", newPassword1);
			getMongoOperation().updateFirst(query1, update, UserVO.class);
			count++;
		}

		return count;
	}

	/* resetting password */
	@POST
	@Path("/Resetpassword")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int Resetpassword(@HeaderParam("Authorization") String authString, String data) throws Exception {
		int count = 0;

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
		return count;
	}

	/* Getting Active Users */
	@GET
	@Path("/getActiveUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Object[] getActiveUsers(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserVO> userInfo = null;
		Object[] objArray = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isActive").is(true));

			userInfo = getMongoOperation().find(query, UserVO.class);
			objArray = userInfo.toArray();
			return objArray;
		} else {
			return objArray;
		}
	}

	/* Inactivating Users */
	@POST
	@Path("/inactivateUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int inactivateUsers(@HeaderParam("Authorization") String authString, String output) throws Exception {
		int count = 0;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {

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

			return count;
		} else {
			return count;
		}

	}

	/* Activating Users */
	@POST
	@Path("/activateUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int activateUsers(@HeaderParam("Authorization") String authString, String output) throws Exception {
		int count = 0;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {

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

				if (testedUserInfo.get(i).isActive()) {

					update.set("isActive", true);
					update.set("isAccessible", true);
					query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));
					getMongoOperation().updateFirst(query, update, UserVO.class);
					logger.error("After  activating User");

					count = 1;
				}

			}

			return count;
		} else {
			return count;
		}

	}

	/* Getting InActive Users */
	@GET
	@Path("/getInactiveUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Object[] getInactiveUsers(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		List<UserVO> userInfo = null;
		Object[] objArray = null;
		if (adminstatus) {
			userInfo = new ArrayList<UserVO>();
			Query query = new Query();
			query.addCriteria(Criteria.where("isActive").is(false));

			userInfo = getMongoOperation().find(query, UserVO.class);

			objArray = userInfo.toArray();

			return objArray;
		} else {
			return objArray;
		}
	}

	/* Updating User Configurations */
	@POST
	@Path("/updateUserInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateUserInfo(@HeaderParam("Authorization") String authString, String data) throws Exception {
		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
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
			return count;
		} else {
			return count;
		}
	}

	/* Updating User Configurations */

	@POST
	@Path("/userprojectaccess")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateuserprojectaccess(@QueryParam("projectlist") List<String> projectlist,
			@QueryParam("userId") String userId) throws Exception {
		int count = 0;

		Update update = new Update();
		update.set("projectlist", projectlist);

		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId));

		getMongoOperation().updateFirst(query, update, UserVO.class);

		return count;
	}

	/* Deleting User */
	@POST
	@Path("/deleteUserInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteUserInfo(@HeaderParam("Authorization") String authString, String userId) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		int count = 0;
		if (adminstatus) {

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			getMongoOperation().remove(query, UserVO.class);
			logger.error("DELETED USER SUCCESSFULLY");

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("owner").is(userId));
			getMongoOperation().remove(query1, OperationalDashboardVO.class);
			logger.error("USER CREATED DASHBOARDS DELETED SUCCESSFULLY");

			count = 1;
			return count;

		} else {
			return count;
		}
	}

	// delete multiple user from db
	@POST
	@Path("/deleteUserList")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteUserList(@HeaderParam("Authorization") String authString, String output) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int count = 0;
		if (adminstatus) {

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
				/*
				 * boolean value= testedUserInfo.get(i).unavailable(); if(value==true){ Query
				 * query = new Query();
				 * query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId
				 * ())); getMongoOperation().remove(query, UserVO.class); count = 1; } } return
				 * count; } else { return count; }
				 * 
				 * }
				 */
				if (testedUserInfo.get(i).isAccessible()) {
					Query query = new Query();
					Update update = new Update();
					update.set("unavailable", testedUserInfo.get(i).isAccessible());
					update.set("unavailable", true);

					query.addCriteria(Criteria.where("userId").is(testedUserInfo.get(i).getUserId()));

					getMongoOperation().remove(query, UserVO.class);
					count = 1;
				}
			}
			return count;
		} else {
			return count;
		}

	}

	@POST
	@Path("/UpdateInstance")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int UpdateInstance(@HeaderParam("Authorization") String authString,
			@QueryParam("instanceName") String instanceName, @QueryParam("serverUrl") String serverUrl,
			@QueryParam("domain") String domain, @QueryParam("project") String project,
			@QueryParam("password") String password, @QueryParam("userId") String userId) throws Exception {
		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();

		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		DomainProjectVO dashvo = new DomainProjectVO();
		ALMdetailsVO almvo = new ALMdetailsVO();
		if (adminstatus) {
			dashvo.setDomain(domain);

			dashvo.setProject(project);

			Query query = new Query();
			query.addCriteria(Criteria.where("instanceName").is(instanceName));
			query.addCriteria(Criteria.where("password").is(password));
			query.addCriteria(Criteria.where("userId").is(userId));
			query.addCriteria(Criteria.where("serverUrl").is(serverUrl));
			Update update = new Update();

			update.push("selectedFields", dashvo);

			List<ALMdetailsVO> dashvoInfo = getMongoOperation().findAll(ALMdetailsVO.class);
			for (ALMdetailsVO vo : dashvoInfo) {

				if (vo.getInstanceName().equalsIgnoreCase(instanceName) && vo.getUserId().equalsIgnoreCase(userId)) {
					count = 1;
					break;

				}
			}

			getMongoOperation().updateFirst(query, update, ALMdetailsVO.class);

			return count;
		} else {
			return count;
		}

	}

	@GET
	@Path("/domainAndProjectDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainProjectVO> getTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("instanceName") String instanceName, @QueryParam("serverUrl") String serverUrl,
			@QueryParam("userId") String userId, @QueryParam("password") String password) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		/*
		 * String decoded = new String(Base64.getDecoder().decode(password)); String
		 * encryptedPassword=iAuthentication.write(decoded);
		 */ Query query1 = new Query();
		query1.addCriteria(Criteria.where("instanceName").is(instanceName));
		query1.addCriteria(Criteria.where("userId").is(userId));
		query1.addCriteria(Criteria.where("password").is(password));
		query1.addCriteria(Criteria.where("serverUrl").is(serverUrl));
		List<ALMdetailsVO> dashboardinfo = getMongoOperation().find(query1, ALMdetailsVO.class);

		List<DomainProjectVO> domainDetails = new ArrayList<DomainProjectVO>();
		// Table Details
		if (adminstatus) {
			for (int i = 0; i < dashboardinfo.get(0).getSelectedFields().size(); i++) {
				DomainProjectVO domainInfo = new DomainProjectVO();
				String domain = dashboardinfo.get(0).getSelectedFields().get(i).getDomain();
				String project = dashboardinfo.get(0).getSelectedFields().get(i).getProject();

				// set domain
				domainInfo.setDomain(domain);
				// set project
				domainInfo.setProject(project);
				// add everything to a list
				domainDetails.add(domainInfo);
			}
			return domainDetails;
		} else {
			return domainDetails;
		}
	}

	// HPALM INSTANCE DETAILS

	@POST
	@Path("/saveInstance")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveInstance(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId,
			@QueryParam("serverUrl") String serverUrl, @QueryParam("instanceName") String instanceName,
			@QueryParam("password") String password) throws Exception {

		int count = 0;

		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		ALMdetailsVO almvo = new ALMdetailsVO();
		Query query = new Query();

		// added this to fix SAST-issue
		byte[] decoded = DatatypeConverter.parseBase64Binary(password);
		char[] encrptedPassword = iAuthentication.write(decoded);

		StringBuilder sb = new StringBuilder();
		for (char ch : encrptedPassword) {
			sb.append(ch);
		}

		if (adminstatus) {
			almvo.setInstanceName(instanceName);
			almvo.setPassword(sb.toString());
			almvo.setUserId(userId);
			almvo.setServerUrl(serverUrl);

			query = new Query(new Criteria().orOperator(Criteria.where("instanceName").is(instanceName),
					Criteria.where("userId").is(userId), Criteria.where("password").is(sb),
					Criteria.where("serverUrl").is(serverUrl)));

			List<ALMdetailsVO> alminfo = getMongoOperation().find(query, ALMdetailsVO.class);

			for (ALMdetailsVO vo : alminfo) {

				if (vo.getInstanceName().equalsIgnoreCase(instanceName)) {
					count = 1;
					break;
				} else if (vo.getUserId().equalsIgnoreCase(userId)) {
					count = 2;
					break;
				} else if (vo.getPassword().equalsIgnoreCase(password)) {
					count = 3;
					break;
				} else if (vo.getServerUrl().equalsIgnoreCase(serverUrl)) {
					count = 4;
					break;
				}
			}
			Arrays.fill(encrptedPassword, ' ');
			if (count == 0) {
				getMongoOperation().save(almvo, "ALMSource");
			}
			return count;
		} else {
			return count;
		}

	}

	@GET
	@Path("/instanceDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ALMdetailsVO> getInstanceDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ALMdetailsVO> instanceinfo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		if (adminstatus) {
			instanceinfo = new ArrayList<ALMdetailsVO>();

			Query query = new Query();

			instanceinfo = getMongoOperation().find(query, ALMdetailsVO.class);
			return instanceinfo;
		} else {
			return instanceinfo;
		}
	}

	// delete hpalm dat
	@GET
	@Path("/deleteHPALMRoww")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteHPALMRoww(@HeaderParam("Authorization") String authString, @QueryParam("domain") String domain,
			@QueryParam("project") String project) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		int count = 0;
		if (adminstatus) {

			Query query = new Query();

			query.addCriteria(Criteria.where("selectedFields.domain").is(domain));
			query.addCriteria(Criteria.where("selectedFields.project").is(project));

			Update update = new Update();
			/*
			 * Update update = new Update().pull("selectedFields", new
			 * BasicDBObject("userId",""));
			 * 
			 * System.out.println("UPDATE OBJ: " + update.toString());
			 */

			update.set("selectedFields.$", null);
			getMongoOperation().updateFirst(query, update, ALMdetailsVO.class);
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("selectedFields").is(IdashboardConstantsUtil.NULL));
			Update update1 = new Update();
			update1.pull("selectedFields", null);

			/* update.unset("selectedFields.$.domain"); */

			/* update.pull("selectedFields.$", null); */
			/* update.unset("selectedFields.$.project"); */

			/*
			 * update.pull("selectedFields.$.userId",userId);
			 * update.pull("selectedFields.$.password",password);
			 * update.pull("selectedFields.$.domain",domain);
			 * update.pull("selectedFields.$.project",project);
			 */
			/* update.unset("selectedFields."); */

			getMongoOperation().updateFirst(query1, update1, ALMdetailsVO.class);

			/* getMongoOperation().remove(query, ALMdetailsVO.class); */
			logger.error("deleted");

			return count;
		} else {
			return count;
		}
	}

	@GET
	@Path("/deleteALMInstance")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteALMInstance(@HeaderParam("Authorization") String authString,
			@QueryParam("instanceName") String instanceName) throws Exception {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		int count = 0;
		if (adminstatus) {

			Query query = new Query();
			query.addCriteria(Criteria.where("instanceName").is(instanceName));
			getMongoOperation().remove(query, ALMdetailsVO.class);
			logger.error("DELETED instance SUCCESSFULLY");

			return count;

		} else {
			return count;
		}
	}

	/* Fetching MenuItems based on Role */
	@GET
	@Path("/getMenuItems")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MenuListVO> getMenuItems(@QueryParam("role") String role, @QueryParam("menuType") String menuType)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		Query query = new Query();
		query.addCriteria(Criteria.where("role").is(role).andOperator(Criteria.where("menuType").is(menuType)));

		logger.error(query);

		List<MenuItemsVO> menuvoitems = new ArrayList<MenuItemsVO>();
		menuvoitems = getMongoOperation().find(query, MenuItemsVO.class);

		logger.error(menuvoitems);

		return menuvoitems.get(0).getMenuList();
	}

	@GET
	@Path("/totalTestCountinitial")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalTestCountinitial() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		long TestCount = getMongoOperation().count(query1, TestCaseVO.class);

		return TestCount;
	}

	/* Defect Count displays in dashboard */

	@GET
	@Path("/defectCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDefectCount() throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		String query = "{},{_id:0,defectId:1,Status:1}";
		Query query1 = new BasicQuery(new BasicDBObject("$where", "return this.Status == 'Open'"));
		long equallength = getMongoOperation().count(query1, DefectVO.class);
		query1 = new BasicQuery(query);
		long defCount = getMongoOperation().count(query1, DefectVO.class);
		long total = equallength * 100 / defCount;
		return total;
	}

	/* Defect DonutChart Details based on status */
	@GET
	@Path("/defectStatusCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectStatusVO> getDefectStatus() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		Aggregation agg = newAggregation(group("status").count().as("count"),
				project("count").and("status").previousOperation());
		AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
				DefectStatusVO.class);
		List<DefectStatusVO> result = groupResults.getMappedResults();
		return result;
	}

	@Path("/barchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectStatusVO> getDefectdashchart() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		Aggregation agg = newAggregation(group("defectAge").count().as("count"),
				project("count").and("priority").previousOperation());
		AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
				DefectStatusVO.class);
		List<DefectStatusVO> result = groupResults.getMappedResults();
		return result;
	}

	@GET
	@Path("/requirmentDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getRequirementDetails() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		String query = "{},{_id:0,Reqid:1,createdDate:1,isDeleted:1,deletedDate:1,isModified:1,modifiedDate:1,isMapped:1,reqPriority:1,reqComplexity:1,reqCriticality:1,reqModifiedCount:1}";

		Query query1 = new BasicQuery(query);

		List<RequirmentVO> requirmentList = getMongoOperation().find(query1, RequirmentVO.class);

		return requirmentList;
	}

	@GET
	@Path("/modifiedrequirmentDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getmodifiedRequirementDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		Query query1 = new Query();
		List<RequirmentVO> modifiedreq = new ArrayList<RequirmentVO>();
		query1.addCriteria(Criteria.where("isDeleted").is("false").and("isModified").is("true"));
		modifiedreq = getMongoOperation().find(query1, RequirmentVO.class);
		return modifiedreq;
	}

	@GET
	@Path("/testcaseDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TestCaseVO> getTestCaseDetails() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		String query = "{},{_id:0,tc_id:1,tc_description:1,tc_status:1,tc_autotech:1,tc_priority:1,tc_severity:1,tc_assigned_Machine:1,tc_executedOn:1,tc_complexity:1,tc_isAuto:1,tc_createdOn:1,tc_createdBy:1,tc_assignedUser:1,tc_project:1}";

		Query query1 = new BasicQuery(query);

		List<TestCaseVO> TestCaseList = getMongoOperation().find(query1, TestCaseVO.class);

		return TestCaseList;

	}

	@GET
	@Path("/errorDiscoveryRate")
	@Produces(MediaType.APPLICATION_JSON)
	public long errorDiscoveryRate() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id: 0, Environment: 1}";
		Query query1 = new BasicQuery(query);
		long totalDefects = getMongoOperation().count(query1, DefectVO.class);
		String query2 = "{},{_id: 0, tc_id: 1}";
		Query query3 = new BasicQuery(query2);
		long totalTestCases = getMongoOperation().count(query3, TestCaseVO.class);
		long errorDiscoveryRate = (totalDefects * 100 / totalTestCases);
		return errorDiscoveryRate;
	}

	@GET
	@Path("/defectsdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectVO> getRecords(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<DefectVO> srcFileAnalysisList = null;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		Date startDate = new Date();
		Date endDate = new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();

		if (!vardtfrom.equalsIgnoreCase("-")) {
			startDate = new Date(vardtfrom);
		}
		if (!vardtto.equalsIgnoreCase("-")) {
			endDate = new Date(vardtto);
		}

		if (!timeperiod.equalsIgnoreCase("undefined") && !timeperiod.equalsIgnoreCase("null")) {
			int noofdays = 0;
			if (timeperiod.equalsIgnoreCase("Last 30 days")) {
				noofdays = 30;
			} else if (timeperiod.equalsIgnoreCase("Last 60 days")) {
				noofdays = 60;
			} else if (timeperiod.equalsIgnoreCase("Last 90 days")) {
				noofdays = 90;
			} else if (timeperiod.equalsIgnoreCase("Last 180 days")) {
				noofdays = 180;
			} else if (timeperiod.equalsIgnoreCase("Last 365 days")) {
				noofdays = 365;
			}
			dates = new Date(); // current date
			Calendar cal = Calendar.getInstance();
			cal.setTime(dates);
			cal.add(Calendar.DATE, -(noofdays));
			dateBefore7Days = cal.getTime();
		}
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
				projectName);

		String query = "{},{_id: 0, defectId: 1, assignedto: 1, summary: 1, status: 1, priority: 1, severity: 1}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		srcFileAnalysisList = getMongoOperation().find(query1, DefectVO.class);
		return srcFileAnalysisList;

	}

	// updateinfo updateDashboards

	@GET
	@Path("/updateDashboards")
	@Produces(MediaType.APPLICATION_JSON)
	public int updateDashboards(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<UserVO> userdetails = new ArrayList<UserVO>();

		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(userId));

		userdetails = getMongoOperation().find(query, UserVO.class);

		int count = 0;

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
		return count;

	}

	/* Build Jobs */

	@GET
	@Path("/buildsJobs")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildJobsVO> buildJobs() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		List<BuildJobsVO> buildJobList = getMongoOperation().find(query1, BuildJobsVO.class);
		return buildJobList;

	}

	/* Code Analysis */

	@GET
	@Path("/ca_detail")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Ca_detailVO> codeAnalysis() throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		List<Ca_detailVO> codeAnalysisList = getMongoOperation().find(query1, Ca_detailVO.class);
		return codeAnalysisList;

	}

	@GET
	@Path("/roleChange")
	@Produces(MediaType.APPLICATION_JSON)
	public int changeRole(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId,
			@QueryParam("role") String role) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int change = 1;
		if (adminstatus) {
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
			return change;
		} else {
			return change;
		}
	}

	/*
	 * @POST
	 * 
	 * @Path("/uploadOrgLogo")
	 * 
	 * @Consumes(MediaType.MULTIPART_FORM_DATA)
	 * 
	 * @Produces(MediaType.APPLICATION_JSON)
	 * 
	 * public int getuploadImage(@HeaderParam("Authorization") String authString,
	 * 
	 * @FormDataParam("orgName") String orgName,
	 * 
	 * @FormDataParam("orgLogo") InputStream orgLogo,
	 * 
	 * @FormDataParam("usersel") String usersel,
	 * 
	 * @FormDataParam("filename") String profileFileName) throws JsonParseException,
	 * JsonMappingException, IOException, NumberFormatException, BaseException,
	 * BadLocationException { int change = 1; AuthenticationService AuthServ = new
	 * AuthenticationService(); boolean adminstatus =
	 * LayerAccess.getAdminLayerAccess(authString); String photoString; List<String>
	 * users = new ArrayList<String>(); for (String retval : usersel.split(",")) {
	 * users.add(retval); } if (adminstatus) {
	 * 
	 * Update update = new Update();
	 * 
	 * if ((FilenameUtils.isExtension(profileFileName, "jpg") ||
	 * FilenameUtils.isExtension(profileFileName, "jpeg") ||
	 * FilenameUtils.isExtension(profileFileName, "png") ||
	 * FilenameUtils.isExtension(profileFileName, "gif")) &&
	 * (!profileFileName.equalsIgnoreCase("undefined"))) {
	 * 
	 * byte[] imageBytes = IOUtils.toByteArray(orgLogo); photoString =
	 * Base64.getEncoder().encodeToString(imageBytes); update.set("orgLogo",
	 * photoString); update.set("orgName", orgName); } else
	 * if(profileFileName.equalsIgnoreCase("undefined")){ update.set("orgName", "");
	 * update.set("orgLogo", ""); } else { update.set("orgName", "");
	 * update.set("orgLogo", ""); change=0; return change; //throw new
	 * BaseException("Please upload image with extension as .jpg or .jpeg only!");
	 * 
	 * }
	 * 
	 * 
	 * 
	 * 
	 * 
	 * byte[] imageBytes = IOUtils.toByteArray(orgLogo); photoString =
	 * Base64.getEncoder().encodeToString(imageBytes);
	 * 
	 * update.set("orgLogo", photoString);
	 * 
	 * Query query = new Query();
	 * query.addCriteria(Criteria.where("userId").in(users));
	 * 
	 * getMongoOperation().updateMulti(query, update, UserVO.class);
	 * 
	 * return change; } else { return change; } }
	 */

	// ***********************************************************************************
	// Function : Upload Organization Logo Image
	//
	// Description : To check the header information , when upload the image
	//
	// Date of Change : 4 / 8 /2020
	//
	// Changed By : Subbu (138497)
	// ***********************************************************************************
	@POST
	@Path("/uploadOrgLogo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)

	public int getuploadImage(@HeaderParam("Authorization") String authString, @FormDataParam("orgName") String orgName,
			@FormDataParam("orgLogo") InputStream orgLogo, @FormDataParam("usersel") String usersel,
			@FormDataParam("filename") String profileFileName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		int change = 1;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		String photoString;
		List<String> users = new ArrayList<String>();
		for (String retval : usersel.split(",")) {
			users.add(retval);
		}
		if (adminstatus) {

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

			return change;
		} else {
			return change;
		}
	}

	// ***************************************************************************************
	// Function : Upload User Image
	//
	// Description : To check the header information , when upload the User image
	//
	// Date of Change : 4 / 8 /2020
	//
	// Changed By : Subbu (138497)
	// ***********************************************************************************

	@POST
	@Path("/uploadUserImg")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)

	public int getuploadUserImg(@HeaderParam("Authorization") String authString,
			@FormDataParam("userImg") InputStream userImg, @FormDataParam("filename") String profileFileName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		int change = 1;
		AuthenticationService AuthServ = new AuthenticationService();
		String userId = AuthServ.getUser(authString);
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

		return change;

	}

	/*
	 * @POST
	 * 
	 * @Path("/uploadUserImg")
	 * 
	 * @Consumes(MediaType.MULTIPART_FORM_DATA)
	 * 
	 * @Produces(MediaType.APPLICATION_JSON)
	 * 
	 * public int getuploadUserImg(@HeaderParam("Authorization") String authString,
	 * 
	 * @FormDataParam("userImg") InputStream userImg, @FormDataParam("filename")
	 * String profileFileName) throws JsonParseException, JsonMappingException,
	 * IOException, NumberFormatException, BaseException, BadLocationException { int
	 * change = 1; AuthenticationService AuthServ = new AuthenticationService();
	 * String userId = AuthServ.getUser(authString); String photoString;
	 * 
	 * Update update = new Update();
	 * 
	 * if ((FilenameUtils.isExtension(profileFileName, "jpg") ||
	 * FilenameUtils.isExtension(profileFileName, "jpeg") ||
	 * FilenameUtils.isExtension(profileFileName, "png")) &&
	 * (!profileFileName.equalsIgnoreCase("undefined"))) {
	 * 
	 * byte[] imageBytes = IOUtils.toByteArray(userImg); photoString =
	 * Base64.getEncoder().encodeToString(imageBytes); update.set("userImg",
	 * photoString); } else if (profileFileName.equalsIgnoreCase("undefined")) {
	 * update.set("userImg", ""); } else { update.set("userImg", ""); change = 0;
	 * return change; // throw new BaseException("Please upload image with extension
	 * as .jpg or .jpeg // only!");
	 * 
	 * }
	 * 
	 * 
	 * Update update = new Update();
	 * 
	 * byte[] imageBytes = IOUtils.toByteArray(userImg); photoString =
	 * Base64.getEncoder().encodeToString(imageBytes);
	 * 
	 * 
	 * Query query = new Query();
	 * query.addCriteria(Criteria.where("userId").is(userId));
	 * 
	 * getMongoOperation().updateFirst(query, update, UserVO.class);
	 * 
	 * return change;
	 * 
	 * }
	 */

	@GET
	@Path("/removeImg")
	@Produces(MediaType.APPLICATION_JSON)

	public int getremoveImg(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int change = 1;

		if (adminstatus) {
			Update update = new Update();
			update.set("orgName", "");
			update.set("orgLogo", "");

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));

			getMongoOperation().updateMulti(query, update, UserVO.class);

			return change;
		} else {
			return change;
		}
	}

	@GET
	@Path("/isToolSelectedAlready")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> isToolSelectedAlready(@HeaderParam("Authorization") String authString) throws Exception {
		Query query1 = new Query();
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		List<String> toolLabel = new ArrayList<String>();
		List<ToolSelectionVO> toolDetails = new ArrayList<ToolSelectionVO>();
		if (adminstatus) {
			toolDetails = getMongoOperation().findAll(ToolSelectionVO.class);
			for (int i = 0; i < toolDetails.size(); i++) {
				String label = toolDetails.get(i).getLabel();
				toolLabel.add(label);
			}

		}
		return toolLabel;
	}

}
