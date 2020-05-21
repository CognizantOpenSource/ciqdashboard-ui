package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectChartVO;
import com.cts.metricsportal.vo.JiraTestCaseVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.OperationalDashboardsEpicsVO;
import com.cts.metricsportal.vo.OperationalDashboardsSprintsVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Path("/testCaseServices")
public class DesignServices extends BaseMongoOperation {

	/* Tree Structure Services Starts Here */

	// Design Details - Count
	/*
	 * Metric : Operational/Design/ Design Details Rest URL :
	 * rest/testCaseServices/tcTableRecordsCount JS File :
	 * WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js JS
	 * Function: TestCasesCtrl/ $scope.tcCountForPagination= function()
	 */
	@GET
	@Path("/tcTableRecordsCount")
	@Produces(MediaType.APPLICATION_JSON)

	public long reqTableRecordsCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		long count = 0;
		Date startDate =  new Date();
		Date endDate = new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (!vardtfrom.equalsIgnoreCase("-")) {
			startDate = new Date(vardtfrom);
		}
		if (!vardtto.equalsIgnoreCase("-")) {
			endDate = new Date(vardtto);
		}

		if (!timeperiod.equalsIgnoreCase("undefined") && !timeperiod.equalsIgnoreCase("null")) {
			int noofdays = 0;
			if (timeperiod.equalsIgnoreCase("Last 60 days")) {
				noofdays = 60;
			} else if (timeperiod.equalsIgnoreCase("Last 30 days")) {
				noofdays = 30;
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
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);
		if (operationalAccess) {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
			}
			count = getMongoOperation().count(query1, TestCaseVO.class);
			return count;
		} else {
			return count;
		}

	}

	@GET
	@Path("/searchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getsearchpagecount(@HeaderParam("Authorization") String authString, @QueryParam("testID") int testID,
			@QueryParam("testName") String testName, @QueryParam("releaseName") String releaseName,
			@QueryParam("automationType") String automationType, @QueryParam("automationStatus") String automationStatus, @QueryParam("testDesigner") String testDesigner,
			@QueryParam("testDesignStatus") String testDesignStatus, @QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long pagecount = 0;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		Date startDate =  new Date();
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
			if (timeperiod.equalsIgnoreCase("Last 60 days")) {
				noofdays = 60;
			} else if (timeperiod.equalsIgnoreCase("Last 30 days")) {
				noofdays = 30;
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
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		Map<String, String> searchvalues = new HashMap<String, String>();
		if (operationalAccess) {
			searchvalues.put("testName", testName);
			searchvalues.put("releaseName", releaseName);
			searchvalues.put("automationType", automationType);
			searchvalues.put("automationStatus", automationStatus);
			searchvalues.put("testDesigner", testDesigner);
			searchvalues.put("testDesignStatus", testDesignStatus);

			String query = "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testDesigner: 1, testType: 1, testDesignStatus: 1, testCreationDate: 1,reqId:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			if (testID != 0) {
				query1.addCriteria(Criteria.where("testID").is(testID));
			}
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
			}

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			pagecount = getMongoOperation().count(query1, TestCaseVO.class);
			return pagecount;
		} else {
			return pagecount;
		}

	}

	// Search TC
	@GET
	@Path("/searchTest")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TestCaseVO> getsearchreq(@HeaderParam("Authorization") String authString,
			@QueryParam("testID") int testID,
			@QueryParam("testName") String testName, @QueryParam("releaseName") String releaseName,
			@QueryParam("automationType") String automationType, @QueryParam("automationStatus") String automationStatus, @QueryParam("testDesigner") String testDesigner,
			@QueryParam("testDesignStatus") String testDesignStatus,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {
		List<TestCaseVO> searchresult = null;
		Date startDate =  new Date();
		Date endDate = new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (!vardtfrom.equalsIgnoreCase("-")) {
			startDate = new Date(vardtfrom);
		}
		if (!vardtto.equalsIgnoreCase("-")) {
			endDate = new Date(vardtto);
		}

		if (!timeperiod.equalsIgnoreCase("undefined") && !timeperiod.equalsIgnoreCase("null")) {
			int noofdays = 0;
			if (timeperiod.equalsIgnoreCase("Last 60 days")) {
				noofdays = 60;
			} else if (timeperiod.equalsIgnoreCase("Last 30 days")) {
				noofdays = 30;
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
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);
		Map<String, String> searchvalues = new HashMap<String, String>();
		if (operationalAccess) {
			searchvalues.put("testName", testName);
			searchvalues.put("releaseName", releaseName);
			searchvalues.put("automationType", automationType);
			searchvalues.put("automationStatus", automationStatus);
			searchvalues.put("testDesigner", testDesigner);
			searchvalues.put("testDesignStatus", testDesignStatus);

			String query = "{},{_id: 0, testID: 1, testName: 1, releaseName: 1, testDesigner: 1, automationType: 1, testDesignStatus: 1, testCreationDate: 1,automationStatus:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
			}
			if (testID != 0) {
				query1.addCriteria(Criteria.where("testID").is(testID));
			}

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			searchresult = getMongoOperation().find(query1, TestCaseVO.class);
			return searchresult;
		} else {
			return searchresult;
		}
	}

	// Design Table Details - On-load with Sort
	/*
	 * Metric : Operational/Design/Design Details Rest URL :
	 * rest/testCaseServices/testcaseData JS File :
	 * WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js JS
	 * Function: $scope.sortedtable =
	 * function(sortvalue,itemsPerPage,start_index,reverse)
	 */
	@GET
	@Path("/testcaseData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TestCaseVO> getRecords(@HeaderParam("Authorization") String authString,
			@QueryParam("sortvalue") String sortvalue, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("reverse") boolean reverse,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TestCaseVO> tcAnalyzedata = null;
		Date startDate =  new Date();
		Date endDate = new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();
		

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (!vardtfrom.equalsIgnoreCase("-")) {
			startDate = new Date(vardtfrom);
		}
		if (!vardtto.equalsIgnoreCase("-")) {
			endDate = new Date(vardtto);
		}

		if (!timeperiod.equalsIgnoreCase("undefined") && !timeperiod.equalsIgnoreCase("null")) {
			int noofdays = 0;
			if (timeperiod.equalsIgnoreCase("Last 60 days")) {
				noofdays = 60;
			} else if (timeperiod.equalsIgnoreCase("Last 30 days")) {
				noofdays = 30;
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
		String query = "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testDesigner: 1, testType: 1, testDesignStatus: 1, testCreationDate: 1,reqId:1}";
		Query query1 = new BasicQuery(query);
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		if (reverse == false) {
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.with(new Sort(Sort.Direction.ASC, sortvalue));
		} else {
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.with(new Sort(Sort.Direction.DESC, sortvalue));
		}
		query1.skip(itemsPerPage * (start_index - 1));
		query1.limit(itemsPerPage);
		if (operationalAccess) {
			tcAnalyzedata = getMongoOperation().find(query1, TestCaseVO.class);
			return tcAnalyzedata;
		} else {
			return tcAnalyzedata;
		}

	}

	// Analyse Button

	/*
	 * @GET
	 * 
	 * @Path("/designDataLevel")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON) public List<TestCaseVO>
	 * getRecordsLevel(
	 * 
	 * @HeaderParam("Authorization") String authString,
	 * 
	 * @QueryParam("dashboardName") String dashboardName,
	 * 
	 * @QueryParam("domainName") String domainName,
	 * 
	 * @QueryParam("projectName") String projectName,
	 * 
	 * @QueryParam("owner") String owner ) throws JsonParseException,
	 * JsonMappingException, IOException, NumberFormatException, BaseException,
	 * BadLocationException { boolean
	 * authenticateresult=authenticateUser(authString); List<TestCaseVO>
	 * executionAnalyzedataLevel=null; if(authenticateresult) { List<String>
	 * levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName,
	 * owner, domainName, projectName); String query =
	 * "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testDesigner: 1, testType: 1, testDesignStatus: 1, testCreationDate: 1,reqId:1}"
	 * ; Query query1 = new BasicQuery(query);
	 * query1.addCriteria(Criteria.where("_id").in(levelIdList));
	 * executionAnalyzedataLevel = getMongoOperation().find(query1,
	 * TestCaseVO.class); return executionAnalyzedataLevel; } else { return
	 * executionAnalyzedataLevel; }
	 * 
	 * }
	 */

	// Project List - Drop Down
	@SuppressWarnings("unchecked")
	@GET
	@Path("/projectlevellist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getProjectList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		List<JiraTestCaseVO> idlist = new ArrayList<JiraTestCaseVO>();
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		Query projectquery = new Query();
		projectquery.addCriteria(Criteria.where("_id").in(levelIdList));
		idlist = getMongoOperation().find(projectquery, JiraTestCaseVO.class);
		List<String> projectlist = new ArrayList<String>();
		List<String> prolist = null;
		if (operationalAccess) {
			for (int i = 0; i < idlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (idlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						projectlist.add(idlist.get(i).getPrjName());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(projectlist);
			prolist = new ArrayList<String>(hSet);

			return prolist;
		} else {
			return prolist;
		}

	}

	// Sprint List - Drop Down
	@SuppressWarnings("unchecked")
	@GET
	@Path("/sprintsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		
		//Date dfromdate = new Date (dfromval);
		//Date dtoddate = new Date (dtoval);

		List<String> sprintlist = new ArrayList<String>();

		if (operationalAccess) {

			Query sprintquery = new Query();

			List<String> prolist = new ArrayList<String>();
			Query projectquery = new Query();
			projectquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value
			
			projectquery.addCriteria(Criteria.where("owner").is(userId));
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					projectquery.getQueryObject());

			sprintquery.addCriteria(Criteria.where("prjName").in(prolist));
			//sprintquery.addCriteria(Criteria.where("issueSprintStartDate").gte(dfromdate));
			//sprintquery.addCriteria(Criteria.where("issueSprintEndDate").lte(dtoddate));

			// List<String> epiclist = new ArrayList<String>();
			// Query epicquery = new Query();
			// epicquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			// epicquery.addCriteria(Criteria.where("owner").is(owner));
			// epiclist =
			// getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
			// epicquery.getQueryObject());
			//
			// if (epiclist.size() > 0) {
			// sprintquery.addCriteria(Criteria.where("issueEpic").in(epiclist));
			// }

			sprintlist = getMongoOperation().getCollection("JiraTestCases").distinct("issueSprint",
					sprintquery.getQueryObject());

			int count = 0;
			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			String listSprintString = "[";

			for (int i = 0; i < sprintlist.size(); i++) {
				listSprintString = listSprintString + "{\"" + "sprintName\"" + ":\"" + (sprintlist.get(i)) + "\"}";
				if (i != sprintlist.size() - 1) {
					listSprintString = listSprintString + ",";
				}
			}

			listSprintString = listSprintString + "]";

			com.fasterxml.jackson.core.JsonParser jsonParser = jf.createJsonParser(listSprintString);

			List<OperationalDashboardsSprintsVO> listSprints = null;
			TypeReference<List<OperationalDashboardsSprintsVO>> tRef = new TypeReference<List<OperationalDashboardsSprintsVO>>() {
			};

			listSprints = mapper.readValue(jsonParser, tRef);

			OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

			dashvo1.setDashboardName(dashboardName);
			dashvo1.setOwner(userId);
			dashvo1.setSprints(listSprints);

			Query query = new Query();

			query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			query.addCriteria(Criteria.where("owner").is(userId));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("owner", userId);
			update.set("sprints", listSprints);

			List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

			for (OperationalDashboardVO vo : dashvoInfo) {
				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = count + 1;

				}
			}
			if (count == 1) {
				getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
			}

			return sprintlist;

		} else {
			return sprintlist;
		}

	}

	
	@SuppressWarnings("unchecked")
	@GET
	@Path("/sprintsListSel")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintListSel(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("dfromval") String dfromval,
			@QueryParam("dtoval") String dtoval) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		Date dfromdate = new Date(dfromval);
		Date dtoddate = new Date(dtoval);

		List<String> sprintlist = new ArrayList<String>();

		if (operationalAccess) {

			Query sprintquery = new Query();

			List<String> prolist = new ArrayList<String>();
			Query projectquery = new Query();
			projectquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value
			
			projectquery.addCriteria(Criteria.where("owner").is(userId));
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					projectquery.getQueryObject());

			sprintquery.addCriteria(Criteria.where("prjName").in(prolist));
			sprintquery.addCriteria(Criteria.where("issueSprintStartDate").gte(dfromdate)
					.andOperator(Criteria.where("issueSprintEndDate").lte(dtoddate)));
			sprintlist = getMongoOperation().getCollection("JiraTestCases").distinct("issueSprint",
					sprintquery.getQueryObject());

		
			return sprintlist;

		} else {
			return sprintlist;
		}

	}

	// EPIC List - Drop Down
	@SuppressWarnings("unchecked")
	@GET
	@Path("/epiclevellist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getEpicList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("selectedproject") String selectedproject, @QueryParam("selectedsprint") String selectedsprint)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		
		Query epicquery = new Query();
		List<String> epiclist = new ArrayList<String>();

		List<String> prolist = new ArrayList<String>();
		for (String retval : selectedproject.split(",")) {
			prolist.add(retval);
		}
		epicquery.addCriteria(Criteria.where("prjName").in(prolist));

		if (selectedsprint.equalsIgnoreCase(null)) {
			List<String> sprintlist = new ArrayList<String>();
			for (String retval : selectedsprint.split(",")) {
				sprintlist.add(retval);
			}
			epicquery.addCriteria(Criteria.where("issueSprint").in(sprintlist));
		}

		if (operationalAccess) {

			epiclist = getMongoOperation().getCollection("Defects").distinct("issueEpic", epicquery.getQueryObject());

			return epiclist;
		} else {
			return epiclist;
		}

	}

	// EPIC List - Drop Down
	@SuppressWarnings("unchecked")
	@GET
	@Path("/epicsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getEpicList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		
		List<String> epiclist = new ArrayList<String>();

		if (operationalAccess) {

			Query epicquery = new Query();

			List<String> prolist = new ArrayList<String>();
			Query projectquery = new Query();
			projectquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			projectquery.addCriteria(Criteria.where("owner").is(userId));
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					projectquery.getQueryObject());

			List<String> sprlist = new ArrayList<String>();
			Query sprintquery = new Query();
			sprintquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			sprintquery.addCriteria(Criteria.where("owner").is(userId));
			sprlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					sprintquery.getQueryObject());

			epicquery.addCriteria(Criteria.where("prjName").in(prolist));
			if (sprlist.size() > 0) {
				epicquery.addCriteria(Criteria.where("issueSprint").in(sprlist));
			}

			epiclist = getMongoOperation().getCollection("JiraTestCases").distinct("issueEpic",
					epicquery.getQueryObject());

			int count = 0;
			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			String listEpicString = "[";

			for (int i = 0; i < epiclist.size(); i++) {
				listEpicString = listEpicString + "{\"" + "epicName\"" + ":\"" + (epiclist.get(i)) + "\"}";
				if (i != epiclist.size() - 1) {
					listEpicString = listEpicString + ",";
				}
			}

			listEpicString = listEpicString + "]";

			com.fasterxml.jackson.core.JsonParser jsonParser = jf.createJsonParser(listEpicString);

			List<OperationalDashboardsEpicsVO> listEpics = null;
			TypeReference<List<OperationalDashboardsEpicsVO>> tRef = new TypeReference<List<OperationalDashboardsEpicsVO>>() {
			};

			listEpics = mapper.readValue(jsonParser, tRef);

			OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

			dashvo1.setDashboardName(dashboardName);
			dashvo1.setOwner(owner);
			dashvo1.setEpics(listEpics);

			Query query = new Query();

			query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			query.addCriteria(Criteria.where("owner").is(owner));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("owner", owner);
			update.set("epics", listEpics);

			List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

			for (OperationalDashboardVO vo : dashvoInfo) {
				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = count + 1;

				}
			}
			if (count == 1) {
				getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
			}

			return epiclist;
		} else {
			return epiclist;
		}

	}

	/* NEW DROP DOWN CODE ENDS HERE */

	// Total Test Count - On Load
	/*
	 * Metric : Operational/ Design/Total Test Count Rest URL :
	 * rest/testCaseServices/totalTestCountinitial JS File :
	 * WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js JS
	 * Function: TestCasesCtrl / $scope.initialcount = function()
	 */

	@GET
	@Path("/totalJiraTestCountinitial")
	@Produces(MediaType.APPLICATION_JSON)

	public long getTotalJiraTestCountinitial(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		String ownerid = "";
		boolean ispublic = false;

		

		// Check the Dashboard is set as public
		ownerid = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = ownerid;
			owner= ownerid;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		long TestCount = 0;
		if (operationalAccess) {

			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			filterQuery.addCriteria(Criteria.where("userId").is(owner));

			List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());

			List<String> epiclist = new ArrayList<String>();
			epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
					filterQuery.getQueryObject());

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);

			String query = "{},{_id:0,levelId:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			TestCount = getMongoOperation().count(query1, JiraTestCaseVO.class);
			return TestCount;
		} else {
			return TestCount;
		}
	}

	// Design Count by Prior - On Load
	@GET
	@Path("/designpriorchartdata")
	@Produces(MediaType.APPLICATION_JSON)

	public List<DefectChartVO> getjiraPriority(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		String ownerid = "";

		boolean ispublic = false;

		

		// Check the Dashboard is set as public
		ownerid = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (ownerid != "") {
			userId = ownerid;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		Date startDate = new Date(vardtfrom);
		Date endDate = new Date(vardtto);

		List<JiraTestCaseVO> reqlist = new ArrayList<JiraTestCaseVO>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		reqlist = getMongoOperation().find(query, JiraTestCaseVO.class);

		List<String> statuslist = new ArrayList<String>();
		List<String> prioritylist = new ArrayList<String>();

		for (int i = 0; i < reqlist.size(); i++) {
			for (int j = 0; j < levelIdList.size(); j++) {
				if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
					prioritylist.add(reqlist.get(i).getIssuePriority());
				}
			}
		}
		Set<String> hSet = new HashSet<String>(prioritylist);
		statuslist = new ArrayList<String>(hSet);

		/*
		 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
		 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
		 */

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));

		List<String> prolist = new ArrayList<String>();
		prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
				filterQuery.getQueryObject());

		List<String> sprintlist = new ArrayList<String>();
		sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
				filterQuery.getQueryObject());

		List<String> epiclist = new ArrayList<String>();
		epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
				filterQuery.getQueryObject());

		if (operationalAccess) {

			Query query1 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			List<JiraTestCaseVO> TCList = new ArrayList<JiraTestCaseVO>();
			TCList = getMongoOperation().find(query1, JiraTestCaseVO.class);

			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String priority = statuslist.get(i);

				for (int j = 0; j < TCList.size(); j++) {
					if (TCList.get(j).getIssuePriority().equalsIgnoreCase(priority)) {
						Count++;
					}
				}
				vo.setValue(priority);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;

	}

	// Design Count by Status
	@GET
	@Path("/designjirastatuschartdata")
	@Produces(MediaType.APPLICATION_JSON)

	public List<DefectChartVO> getdesignjirastatus(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		String ownerid = "";
		boolean ispublic = false;

		// Check the Dashboard is set as public

		Query query2 = new Query();
		query2.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		List<OperationalDashboardVO> dashboardinfo = getMongoOperation().find(query2, OperationalDashboardVO.class);
		ispublic = dashboardinfo.get(0).isIspublic();
		if (ispublic) {
			ownerid = dashboardinfo.get(0).getOwner();
			userId = ownerid;
			owner = ownerid;
		}

		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		Date startDate = new Date(vardtfrom);
		Date endDate = new Date(vardtto);

		List<JiraTestCaseVO> reqlist = new ArrayList<JiraTestCaseVO>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		reqlist = getMongoOperation().find(query, JiraTestCaseVO.class);

		List<String> statuslist = new ArrayList<String>();
		List<String> statlist = new ArrayList<String>();

		for (int i = 0; i < reqlist.size(); i++) {
			for (int j = 0; j < levelIdList.size(); j++) {
				if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
					statlist.add(reqlist.get(i).getIssueStatus());
				}
			}
		}
		Set<String> hSet = new HashSet<String>(statlist);
		statuslist = new ArrayList<String>(hSet);

		/*
		 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
		 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
		 */

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));

		List<String> prolist = new ArrayList<String>();
		prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
				filterQuery.getQueryObject());

		List<String> sprintlist = new ArrayList<String>();
		sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
				filterQuery.getQueryObject());

		List<String> epiclist = new ArrayList<String>();
		epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
				filterQuery.getQueryObject());

		if (operationalAccess) {

			Query query1 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			List<JiraTestCaseVO> TCList = new ArrayList<JiraTestCaseVO>();
			TCList = getMongoOperation().find(query1, JiraTestCaseVO.class);

			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String priority = statuslist.get(i);

				for (int j = 0; j < TCList.size(); j++) {
					if (TCList.get(j).getIssueStatus().equalsIgnoreCase(priority)) {
						Count++;
					}
				}
				vo.setValue(priority);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;

	}

	// Get Default Date

	@GET
	@Path("/getdefaultdate")
	@Produces(MediaType.APPLICATION_JSON)

	public List<Date> getdefaultdate(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		List<Date> finalDateList = new ArrayList<Date>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));

		List<String> prolist = new ArrayList<String>();
		prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
				filterQuery.getQueryObject());

		List<String> sprintlist = new ArrayList<String>();
		sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
				filterQuery.getQueryObject());

		List<String> epiclist = new ArrayList<String>();
		epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
				filterQuery.getQueryObject());

		List<JiraTestCaseVO> issueSprintStartDateTCList = new ArrayList<JiraTestCaseVO>();
		List<JiraTestCaseVO> issueSprintEndDateTCList = new ArrayList<JiraTestCaseVO>();

		if (operationalAccess) {

			Query query1 = new Query();
			Query query2 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query2.addCriteria(Criteria.where("_id").in(levelIdList));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
				query2.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
				query2.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
				query2.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			query1.with(new Sort(Sort.Direction.ASC, "issueSprintStartDate"));
			query2.with(new Sort(Sort.Direction.DESC, "issueSprintEndDate"));

			issueSprintStartDateTCList = getMongoOperation().find(query1, JiraTestCaseVO.class);
			issueSprintEndDateTCList = getMongoOperation().find(query2, JiraTestCaseVO.class);

			Date startDate =  new Date();
			Date endDate =  new Date();

			for (int i = 0; i < issueSprintStartDateTCList.size(); i++) {
				if (issueSprintStartDateTCList.get(i).getIssueSprintStartDate() != null) {
					startDate = issueSprintStartDateTCList.get(i).getIssueSprintStartDate();
					break;
				}
			}
			
			for (int j = 0; j < issueSprintEndDateTCList.size(); j++) {
			if (issueSprintEndDateTCList.get(j).getIssueSprintEndDate() != null) {
				endDate = issueSprintEndDateTCList.get(j).getIssueSprintEndDate();
				break;
			}
			}

			finalDateList.add(startDate);
			finalDateList.add(endDate);

		} else {
			return finalDateList;
		}
		return finalDateList;

	}
	
	// Get On Load Date

		@GET
		@Path("/getOnLoaddate")
		@Produces(MediaType.APPLICATION_JSON)

		public List<Date> getOnLoaddate(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
				NumberFormatException, BaseException, BadLocationException {

			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);

			// End of the check value

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

			List<Date> finalDateList = new ArrayList<Date>();

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);

			/*Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			filterQuery.addCriteria(Criteria.where("owner").is(userId));

			List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());

			List<String> epiclist = new ArrayList<String>();
			epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
					filterQuery.getQueryObject());*/

			List<JiraTestCaseVO> issueSprintStartDateTCList = new ArrayList<JiraTestCaseVO>();
			List<JiraTestCaseVO> issueSprintEndDateTCList = new ArrayList<JiraTestCaseVO>();

			if (operationalAccess) {

				Query query1 = new Query();
				Query query2 = new Query();

				query1.addCriteria(Criteria.where("_id").in(levelIdList));
				query2.addCriteria(Criteria.where("_id").in(levelIdList));

				/*if (prolist.size() > 0) {
					query1.addCriteria(Criteria.where("prjName").in(prolist));
					query2.addCriteria(Criteria.where("prjName").in(prolist));
				}
				if (sprintlist.size() > 0) {
					query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
					query2.addCriteria(Criteria.where("issueSprint").in(sprintlist));
				}
				if (epiclist.size() > 0) {
					query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
					query2.addCriteria(Criteria.where("issueEpic").in(epiclist));
				}*/

				query1.with(new Sort(Sort.Direction.ASC, "issueSprintStartDate"));
				query2.with(new Sort(Sort.Direction.DESC, "issueSprintEndDate"));

				issueSprintStartDateTCList = getMongoOperation().find(query1, JiraTestCaseVO.class);
				issueSprintEndDateTCList = getMongoOperation().find(query2, JiraTestCaseVO.class);

				Date startDate = new Date();
				Date endDate =  new Date();

				for (int i = 0; i < issueSprintStartDateTCList.size(); i++) {
					if (issueSprintStartDateTCList.get(i).getIssueSprintStartDate() != null) {
						startDate = issueSprintStartDateTCList.get(i).getIssueSprintStartDate();
						break;
					}
				}
				
				for (int j = 0; j < issueSprintEndDateTCList.size(); j++) {
				if (issueSprintEndDateTCList.get(j).getIssueSprintEndDate() != null) {
					endDate = issueSprintEndDateTCList.get(j).getIssueSprintEndDate();
					break;
				}
				}

				finalDateList.add(startDate);
				finalDateList.add(endDate);

			} else {
				return finalDateList;
			}
			return finalDateList;

		}
		
		@GET
		@Path("/designownerchartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectChartVO> getJiraDesignOwner(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
				@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
				@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
				BadLocationException {


			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			String ownerid = "";

			// Check the Dashboard is set as public
			ownerid = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (ownerid != "") {
				userId = ownerid;
			}
			// End of the check value

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<JiraTestCaseVO> reqlist = new ArrayList<JiraTestCaseVO>();

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));
			reqlist = getMongoOperation().find(query, JiraTestCaseVO.class);

			List<String> ownerlist = new ArrayList<String>();
			List<String> prioritylist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						prioritylist.add(reqlist.get(i).getIssueAssignee());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(prioritylist);
			ownerlist = new ArrayList<String>(hSet);

			/*
			 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
			 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			 */

			List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			filterQuery.addCriteria(Criteria.where("owner").is(userId));

			List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());

			List<String> epiclist = new ArrayList<String>();
			epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
					filterQuery.getQueryObject());

			if (operationalAccess) {

				Query query1 = new Query();

				query1.addCriteria(Criteria.where("_id").in(levelIdList));

				query1.addCriteria(Criteria.where("issueCreated").gte(startDate).lte(endDate));
				/*query1.addCriteria(Criteria.where("issueCreated").lte(endDate));*/

				if (prolist.size() > 0) {
					query1.addCriteria(Criteria.where("prjName").in(prolist));
				}
				if (sprintlist.size() > 0) {
					query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
				}
				if (epiclist.size() > 0) {
					query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
				}

				List<JiraTestCaseVO> TCList = new ArrayList<JiraTestCaseVO>();
				TCList = getMongoOperation().find(query1, JiraTestCaseVO.class);

				for (int i = 0; i < ownerlist.size(); i++) {

					DefectChartVO vo = new DefectChartVO();
					int Count = 0;
					String ownerdesign = ownerlist.get(i);

					for (int j = 0; j < TCList.size(); j++) {
						if (TCList.get(j).getIssueAssignee().equalsIgnoreCase(ownerdesign)) {
							Count++;
						}
					}
					vo.setValue(ownerdesign);
					vo.setCount(Count);

					finalresult.add(vo);
				}
			} else {
				return finalresult;
			}
			return finalresult;

		}
		
		@GET
		@Path("/jiradesigntable")
		@Produces(MediaType.APPLICATION_JSON)
		public static List<JiraTestCaseVO> getRecordstcQuery(@HeaderParam("Authorization") String authString,
				@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
				@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
				@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
				@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName) throws NumberFormatException, BaseException, BadLocationException {
			
			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			String ownerid = "";

			// Check the Dashboard is set as public
			ownerid = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (ownerid != "") {
				userId = ownerid;
			}
			// End of the check value

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<JiraTestCaseVO> reqlist = new ArrayList<JiraTestCaseVO>();

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);

			List<JiraTestCaseVO> reqAnalysisList=null;
		
	    		String query = "{},{_id:0,reqID:1,reqType:1,status:1,priority:1,creationTime:1,lastModified:1}";
		 	
		 	 Query query1 = new BasicQuery(query);	
		 	query1.addCriteria(Criteria.where("_id").in(levelIdList));
		 	if(startDate != null || endDate != null)
			{	query1.addCriteria(Criteria.where("issueCreated").gte(startDate).lte(endDate));
			}
			
		 	if(itemsPerPage!=0){
		 	 query1.skip(itemsPerPage * (start_index- 1));
		 	 query1.limit(itemsPerPage);
		 	}
		 	 reqAnalysisList =  getMongoOperation().find(query1, JiraTestCaseVO.class);	 
		 	 return reqAnalysisList;
		}
		
		@GET
		@Path("/tcJiraRecordsCount")
		@Produces(MediaType.APPLICATION_JSON)
		public long jiraTableRecordsCount(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
				@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
				throws JsonParseException, JsonMappingException, IOException, BadLocationException {
			long count = 0;
			Date startDate =  new Date();
			Date endDate = new Date();
			Date dates = new Date();
			Date dateBefore7Days = new Date();

			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

			if (!vardtfrom.equalsIgnoreCase("-")) {
				startDate = new Date(vardtfrom);
			}
			if (!vardtto.equalsIgnoreCase("-")) {
				endDate = new Date(vardtto);
			}

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);
			if (operationalAccess) {
				Query query1 = new Query();
				query1.addCriteria(Criteria.where("_id").in(levelIdList));
				if (startDate != null || endDate != null) {
					query1.addCriteria(Criteria.where("issueCreated").gte(startDate).lte(endDate));
				}
				count = getMongoOperation().count(query1, JiraTestCaseVO.class);
				return count;
			} else {
				return count;
			}

		}

		@GET
		@Path("/jirasearchpagecount")
		@Produces(MediaType.APPLICATION_JSON)
		public long getjirasearchpagecount(@HeaderParam("Authorization") String authString, @QueryParam("testID") int testID,
				@QueryParam("summary") String summary, @QueryParam("testDescription") String testDescription,
				@QueryParam("issuePriority") String issuePriority, @QueryParam("testDesigner") String testDesigner,
				@QueryParam("testDesignStatus") String testDesignStatus, @QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
				NumberFormatException, BaseException, BadLocationException {
			long pagecount = 0;

			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

			Date startDate =  new Date();
			Date endDate = new Date();
			Date dates = new Date();
			Date dateBefore7Days = new Date();

			if (!vardtfrom.equalsIgnoreCase("-")) {
				startDate = new Date(vardtfrom);
			}
			if (!vardtto.equalsIgnoreCase("-")) {
				endDate = new Date(vardtto);
			}

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
					projectName);

			Map<String, String> searchvalues = new HashMap<String, String>();
			if (operationalAccess) {
				searchvalues.put("summary", summary);
				searchvalues.put("issueDescription", testDescription);
				searchvalues.put("issuePriority", issuePriority);
				searchvalues.put("issueAssignee", testDesigner);
				searchvalues.put("issueStatus", testDesignStatus);

				String query = "{},{_id: 0, issueID: 1, summary: 1, issueDescription: 1, issueAssignee: 1, issuePriority: 1, issueStatus: 1, issueCreated: 1}";
				Query query1 = new BasicQuery(query);
				query1.addCriteria(Criteria.where("_id").in(levelIdList));

				if (testID != 0) {
					query1.addCriteria(Criteria.where("issueID").is(testID));
				}
				if (startDate != null || endDate != null) {
					query1.addCriteria(Criteria.where("issueCreated").gte(startDate).lte(endDate));
				}

				for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

					if (!entry.getValue().equals("undefined")) {
						if (!entry.getValue().equals("null")) {
							query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
						}
					}
				}
				pagecount = getMongoOperation().count(query1, JiraTestCaseVO.class);
				return pagecount;
			} else {
				return pagecount;
			}

		}
		
		// Design Table Details - On-load with Sort
			/*
			 * Metric : Operational/Design/Design Details Rest URL :
			 * rest/testCaseServices/testcaseData JS File :
			 * WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js JS
			 * Function: $scope.sortedtable =
			 * function(sortvalue,itemsPerPage,start_index,reverse)
			 */
			@GET
			@Path("/jiratestcaseData")
			@Produces(MediaType.APPLICATION_JSON)
			public List<JiraTestCaseVO> getJiraRecords(@HeaderParam("Authorization") String authString,
					@QueryParam("sortvalue") String sortvalue, @QueryParam("itemsPerPage") int itemsPerPage,
					@QueryParam("start_index") int start_index, @QueryParam("reverse") boolean reverse,
					@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
					@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
					@QueryParam("vardtto") String vardtto)
					throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
					BadLocationException {
				List<JiraTestCaseVO> tcAnalyzedata = null;
				Date startDate =  new Date();
				Date endDate = new Date();
				Date dates = new Date();
				Date dateBefore7Days = new Date();
				

				AuthenticationService UserEncrypt = new AuthenticationService();
				String userId = UserEncrypt.getUser(authString);
				boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

				if (!vardtfrom.equalsIgnoreCase("-")) {
					startDate = new Date(vardtfrom);
				}
				if (!vardtto.equalsIgnoreCase("-")) {
					endDate = new Date(vardtto);
				}

				Query query1 = new Query();
				List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
						projectName);
				if (startDate != null || endDate != null) {
					query1.addCriteria(Criteria.where("issueCreated").gte(startDate).lte(endDate));
				}
				
				if (reverse == false) {
					query1.addCriteria(Criteria.where("_id").in(levelIdList));
					query1.with(new Sort(Sort.Direction.ASC, sortvalue));
				} else {
					query1.addCriteria(Criteria.where("_id").in(levelIdList));
					query1.with(new Sort(Sort.Direction.DESC, sortvalue));
				}
				query1.skip(itemsPerPage * (start_index - 1));
				query1.limit(itemsPerPage);
				if (operationalAccess) {
					tcAnalyzedata = getMongoOperation().find(query1, JiraTestCaseVO.class);
					return tcAnalyzedata;
				} else {
					return tcAnalyzedata;
				}

			}
			
			// Search TC
			@GET
			@Path("/jirasearchTest")
			@Produces(MediaType.APPLICATION_JSON)
			public List<JiraTestCaseVO> getSearchTcJira(@HeaderParam("Authorization") String authString,
					@QueryParam("testID") int testID, @QueryParam("summary") String summary,
					@QueryParam("testDescription") String testDescription, @QueryParam("issuePriority") String issuePriority,
					@QueryParam("testDesigner") String testDesigner, @QueryParam("testDesignStatus") String testDesignStatus,
					@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
					@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
					@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
					@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
					throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
					BadLocationException, ParseException {
				List<JiraTestCaseVO> searchresult = null;
				Date startDate =  new Date();
				Date endDate = new Date();
				Date dates = new Date();
				Date dateBefore7Days = new Date();
				
				AuthenticationService UserEncrypt = new AuthenticationService();
				String userId = UserEncrypt.getUser(authString);
				boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

				if (!vardtfrom.equalsIgnoreCase("-")) {
					startDate = new Date(vardtfrom);
				}
				if (!vardtto.equalsIgnoreCase("-")) {
					endDate = new Date(vardtto);
				}

				List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
						projectName);
				
				Map<String, String> searchvalues = new HashMap<String, String>();
				if (operationalAccess) {
					searchvalues.put("summary", summary);
					searchvalues.put("issueDescription", testDescription);
					searchvalues.put("issuePriority", issuePriority);
					searchvalues.put("issueAssignee", testDesigner);
					searchvalues.put("issueStatus", testDesignStatus);

					String query = "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testDesigner: 1, testType: 1, testDesignStatus: 1, testCreationDate: 1,reqId:1}";
					Query query1 = new BasicQuery(query);
					query1.addCriteria(Criteria.where("_id").in(levelIdList));
					if (startDate != null || endDate != null) {
						query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
					} else if (dateBefore7Days != null && dates != null) {
						query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
					}
					if (testID != 0) {
						query1.addCriteria(Criteria.where("testID").is(testID));
					}

					for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

						if (!entry.getValue().equals("undefined")) {
							if (!entry.getValue().equals("null")) {
								query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
							}
						}
					}
					query1.skip(itemsPerPage * (start_index - 1));
					query1.limit(itemsPerPage);
					searchresult = getMongoOperation().find(query1, JiraTestCaseVO.class);
					return searchresult;
				} else {
					return searchresult;
				}
			}


}
