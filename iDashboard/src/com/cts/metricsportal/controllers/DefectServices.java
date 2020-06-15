package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

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

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectChartVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.DefectsVersionVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraTestCaseVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.OperationalDashboardsEpicsVO;
import com.cts.metricsportal.vo.OperationalDashboardsSprintsVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Path("/defectServices")
public class DefectServices extends BaseMongoOperation {

	// Defect Table Details - On-load with Sort
	/*
	 * Metric : Operational/Defect/Defects Details Rest URL :
	 * rest/defectServices/defectsData JS File :
	 * WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js JS
	 * Function: $scope.sortedtable =
	 * function(sortvalue,itemsPerPage,start_index,reverse)
	 */
	@GET
	@Path("/defectsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectVO> getRecords(@HeaderParam("Authorization") String authString,
			@QueryParam("sortvalue") String sortvalue, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("reverse") boolean reverse,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<DefectVO> defAnalyzedata = null;
		Date startDate =  new Date();
		Date endDate = new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

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
		String query = "{},{_id:0,defectID:1,detectedBy:1,status:1,assignedBy:1,assignedTo:1,detectedPhase:1,priority:1,severity:1,module:1,defectAge:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		if (reverse == false) {
			query1.with(new Sort(Sort.Direction.ASC, sortvalue));
		} else {
			query1.with(new Sort(Sort.Direction.DESC, sortvalue));
		}
		query1.skip(itemsPerPage * (start_index - 1));
		query1.limit(itemsPerPage);
		defAnalyzedata = getMongoOperation().find(query1, DefectVO.class);
		return defAnalyzedata;

	}

	@GET
	@Path("/searchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getsearchpagecount(@HeaderParam("Authorization") String authString,
			@QueryParam("defectId") String defectId,
			@QueryParam("summary") String summary,
			@QueryParam("priority") String priority, @QueryParam("status") String status,
			@QueryParam("severity") String severity,@QueryParam("assignedto") String assignedto,
			@QueryParam("releaseName") String releaseName,@QueryParam("environment") String environment,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,

			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		long pagecount = 0;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

		Date startDate =  new Date();
		Date endDate =  new Date();
		Date dates = new Date();
		Date dateBefore7Days = new Date();

		if (!vardtfrom.equalsIgnoreCase("-")) {
			startDate = new Date(vardtfrom);
		}
		if (!vardtto.equalsIgnoreCase("-")) {
			endDate = new Date(vardtto);
		}
		if (operationalAccess) {
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

			Map<String, String> searchvalues = new HashMap<String, String>();

			searchvalues.put("summary", summary);
			//searchvalues.put("defectId", defectId);
			searchvalues.put("priority", priority);
			searchvalues.put("status", status);
			searchvalues.put("severity", severity);
			searchvalues.put("assignedto", assignedto);
			searchvalues.put("releaseName", releaseName);
			searchvalues.put("environment", environment);

			String query = "{},{_id:0,defectId:1,priority:1,summary:1,releaseName:1,environment:1,severity:1,assignedto:1,status:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			/*
			 * if (defectId != 0) {
			 * query1.addCriteria(Criteria.where("defectId").is(defectId)); }
			 */
			
			if (!defectId.equalsIgnoreCase("")) {
				int idefectId=Integer.parseInt(defectId);				
				query1.addCriteria(Criteria.where("$where").is("/^" + idefectId + ".*/.test(this.defectId)"));				
			}
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
			}
			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			pagecount = getMongoOperation().count(query1, DefectVO.class);
			return pagecount;
		} else {
			return pagecount;
		}
	}

	@GET
	@Path("/searchDefects")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectVO> getsearchreq(@HeaderParam("Authorization") String authString,
			@QueryParam("defectId") String defectId,
			@QueryParam("summary") String summary,
			@QueryParam("priority") String priority,@QueryParam("status") String status,
			@QueryParam("severity") String severity, @QueryParam("assignedto") String assignedto,
			@QueryParam("releaseName") String releaseName,@QueryParam("environment") String environment,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<DefectVO> searchresult = null;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

		Date startDate =  new Date();
		Date endDate =  new Date();
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
		if (operationalAccess) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
					projectName);
			Map<String, String> searchvalues = new HashMap<String, String>();

			searchvalues.put("summary", summary);
			//searchvalues.put("description", description);
			searchvalues.put("priority", priority);
			searchvalues.put("status", status);
			searchvalues.put("severity", severity);
			searchvalues.put("assignedto", assignedto);
			searchvalues.put("releaseName", releaseName);
			searchvalues.put("environment", environment);			

			String query = "{},{_id:0,defectId:1,priority:1,summary:1,releaseName:1,environment:1,severity:1,assignedto:1,status:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
			}
			/*
			 * if (defectId != 0) {
			 * query1.addCriteria(Criteria.where("defectId").is(defectId)); }
			 */
			
			if (!defectId.equalsIgnoreCase("")) {
				int idefectId=Integer.parseInt(defectId);
				query1.addCriteria(Criteria.where("$where").is("/^" + idefectId + ".*/.test(this.defectId)"));
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
			searchresult = getMongoOperation().find(query1, DefectVO.class);
			return searchresult;
		} else {
			return searchresult;
		}

	}

	/* Total Closed Defects Count(BA Panel) Starts Here */

	// Defects Count - On Load
	/*
	 * Metric : Operational/Defect/Total Defects Count Rest URL :
	 * rest/defectServices/closedCountinitial JS File :
	 * WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js JS
	 * Function: defectsCtrl/ $scope.initialcount = function()
	 */

	@GET
	@Path("/closedCountinitial")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalPassedDefectCountinitial(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long defclosedCount = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		if (operationalAccess) {
			String query = "{},{_id:0,levelId:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			query1.addCriteria(Criteria.where("status").is("Closed"));
			defclosedCount = getMongoOperation().count(query1, DefectVO.class);

			return defclosedCount;
		} else {
			return defclosedCount;
		}
	}

	/**
	 * Date Filter Code - Ends Here
	 */

	/**
	 * Date Filter Code - Starts Here
	 */

	/**
	 * Date Filter Code - Ends Here
	 */

	/* NEW DROP DOWN CODE STARTS HERE */

	// Sprint List - Drop Down
	@SuppressWarnings("unchecked")
	@GET
	@Path("/sprintlevellist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("owner") String owner,
			@QueryParam("selectedproject") String selectedproject,
			@QueryParam("selectedepic") String selectedepic)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		
		Query sprintquery = new Query();
		List<String> sprintlist = new ArrayList<String>();

		List<String> prolist = new ArrayList<String>();
		for (String retval : selectedproject.split(",")) {
			prolist.add(retval);
		}

		sprintquery.addCriteria(Criteria.where("prjName").in(prolist));
		if (operationalAccess) {

			if (selectedepic == null) {
				// System.out.println("SelectedEpic is NULL");
				sprintlist = getMongoOperation().getCollection("Defects").distinct("issueSprint",
						sprintquery.getQueryObject());
			} else if (selectedepic != null) {
				// System.out.println("SelectedEpic is NOT NULL");
				sprintquery.addCriteria(Criteria.where("issueEpic").is(selectedepic));
				sprintlist = getMongoOperation().getCollection("Defects").distinct("issueSprint",
						sprintquery.getQueryObject());
			}

			return sprintlist;

		} else {
			return sprintlist;
		}

	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/sprintsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		
	//	Date dfromdate = new Date (dfromval);
	//	Date dtoddate = new Date (dtoval);

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
		//	sprintquery.addCriteria(Criteria.where("issueSprintStartDate").gte(dfromdate));
		//	sprintquery.addCriteria(Criteria.where("issueSprintEndDate").lte(dtoddate));

			sprintlist = getMongoOperation().getCollection("JiraDefects").distinct("issueSprint",
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

			JsonParser jsonParser = jf.createJsonParser(listSprintString);

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
	
	
	// Sprint List - Drop Down (implement levelId later)
			@SuppressWarnings("unchecked")
			@GET
			@Path("/sprintsListSel")
			@Produces(MediaType.APPLICATION_JSON)
			public List<String> getSprintListSel(@HeaderParam("Authorization") String authString,
					@QueryParam("dashboardName") String dashboardName, @QueryParam("dfromval") String dfromval,
					@QueryParam("dtoval") String dtoval) throws JsonParseException, JsonMappingException, IOException,
					NumberFormatException, BaseException, BadLocationException {

				AuthenticationService UserEncrypt = new AuthenticationService();
				String userId = UserEncrypt.getUser(authString);
				boolean operationalAccess = LayerAccess.authenticateToken(authString);

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
					sprintlist = getMongoOperation().getCollection("JiraDefects").distinct("issueSprint",
							sprintquery.getQueryObject());

				
					return sprintlist;

				} else {
					return sprintlist;
				}

			}


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
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
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

			epiclist = getMongoOperation().getCollection("JiraDefects").distinct("issueEpic",
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

			JsonParser jsonParser = jf.createJsonParser(listEpicString);

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
			query.addCriteria(Criteria.where("owner").is(userId));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("owner", userId);
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
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

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

	/* NEW DROP DOWN CODE ENDS HERE */

	// Total defect Logged trend

	@GET
	@Path("/defectLoggedTrendchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectTrendVO> getdefectloggedtrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long diff = 0;
		long noOfDays = 0;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		List<DefectTrendVO> finalresult = new ArrayList<DefectTrendVO>();

		if (operationalAccess) {

			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			diff = endDate.getTime() - startDate.getTime();
			noOfDays = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
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

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
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

			List<JiraDefectVO> DefectStatus = new ArrayList<JiraDefectVO>();
			DefectStatus = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < noOfDays; i++) {

				Calendar today = Calendar.getInstance();
				today.setTime(startDate);
				today.add(Calendar.DATE, i);
				Date adaybefore = today.getTime();

				DefectTrendVO vo = new DefectTrendVO();
				int Count = 0;

				for (int j = 0; j < DefectStatus.size(); j++) {
					if (DefectStatus.get(j).getIssueCreated().getDate() == adaybefore.getDate()
							&& (DefectStatus.get(j).getIssueCreated().getMonth() + 1) == (adaybefore.getMonth() + 1)
							&& (DefectStatus.get(j).getIssueCreated().getYear() + 1900) == (adaybefore.getYear()
									+ 1900)) {
						Count++;
					}
				}

				String cdate = adaybefore.getDate() + "/" + (adaybefore.getMonth() + 1) + "/"
						+ (adaybefore.getYear() + 1900);
				DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
				Date datecreated = null;

				try {
					datecreated = df.parse(cdate);
				} catch (java.text.ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				vo.setIsodate(datecreated);
				vo.setTotalcount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;
	}

	// Total Assignee bar chart

	@GET
	@Path("/defectOwnerChartData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectOwnerChartData(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long diff = 0;
		long noOfDays = 0;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

		/*
		 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
		 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
		 */

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

		if (operationalAccess) {

			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));

			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

			reqlist = getMongoOperation().find(query, JiraDefectVO.class);

			List<String> ownerlist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssueStatus());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			ownerlist = new ArrayList<String>(hSet);

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

			List<JiraDefectVO> DefectAssignee = new ArrayList<JiraDefectVO>();
			DefectAssignee = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < ownerlist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String owneri = ownerlist.get(i);

				for (int j = 0; j < DefectAssignee.size(); j++) {
					if (DefectAssignee.get(j).getIssueAssignee().equalsIgnoreCase(owneri)) {
						Count++;
					}
				}
				vo.setValue(owneri);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;
	}

	// Total Reported By bar chart

	@GET
	@Path("/defectReportChartData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectReportChartData(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long diff = 0;
		long noOfDays = 0;
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		if (operationalAccess) {
			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));

			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

			reqlist = getMongoOperation().find(query, JiraDefectVO.class);

			List<String> ownerlist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssueStatus());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			ownerlist = new ArrayList<String>(hSet);

			/*
			 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
			 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			 */

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

			List<JiraDefectVO> DefectReported = new ArrayList<JiraDefectVO>();
			DefectReported = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < ownerlist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String owneri = ownerlist.get(i);

				for (int j = 0; j < DefectReported.size(); j++) {
					if (DefectReported.get(j).getIssueReporter().equalsIgnoreCase(owneri)) {
						Count++;
					}
				}
				vo.setValue(owneri);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;
	}

	// Total Reported By bar chart

	@GET
	@Path("/defectsPriorityBarchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectsPriorityBarchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long diff = 0;
		long noOfDays = 0;
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		if (operationalAccess) {
			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));

			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

			reqlist = getMongoOperation().find(query, JiraDefectVO.class);

			List<String> prioritylist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssueStatus());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			prioritylist = new ArrayList<String>(hSet);
			
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

			List<JiraDefectVO> DefectPriority = new ArrayList<JiraDefectVO>();
			DefectPriority = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < prioritylist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String priority = prioritylist.get(i);

				for (int j = 0; j < DefectPriority.size(); j++) {
					if (DefectPriority.get(j).getIssuePriority().equalsIgnoreCase(priority)) {
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

	// Defect Open Status Bar chart

	@GET
	@Path("/defectsOpenStatusBarchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectsOpenStatusBarchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long diff = 0;
		long noOfDays = 0;
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		if (operationalAccess) {
			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("levelId").in(levelIdList));
			query.addCriteria(Criteria.where("issueStatus").ne("Closed"));

			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

			reqlist = getMongoOperation().find(query, JiraDefectVO.class);

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

			query1.addCriteria(Criteria.where("issueStatus").ne("Closed"));

			List<JiraDefectVO> DefectPriority = new ArrayList<JiraDefectVO>();
			DefectPriority = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String Status = statuslist.get(i);

				for (int j = 0; j < DefectPriority.size(); j++) {
					if (DefectPriority.get(j).getIssueStatus().equalsIgnoreCase(Status)) {
						Count++;
					}
				}
				vo.setValue(Status);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;
	}

	// Defect Open Status Bar chart by Version

	@GET
	@Path("/defectsOpenStatusByVersion")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getDefectsOpenStatusByVersion(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		if (operationalAccess) {
			Date startDate = new Date(vardtfrom);
			Date endDate = new Date(vardtto);

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));
			query.addCriteria(Criteria.where("issueStatus").ne("Done"));

			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

			reqlist = getMongoOperation().find(query, JiraDefectVO.class);

			List<String> versionlist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssueStatus());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			versionlist = new ArrayList<String>(hSet);

			// List<String> storyIDlist = new ArrayList<String>();
			// storyIDlist =
			// getMongoOperation().getCollection("TestCases").distinct("linkedStories.storyID",
			// query1.getQueryObject());
			// defStoriesCount = storyIDlist.size();
			// mDevStoriesCount.put("Stories",""+defStoriesCount);
			/*
			 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
			 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			 */

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

			query1.addCriteria(Criteria.where("issueStatus").ne("Done"));

			List<JiraDefectVO> DefectList_Open = new ArrayList<JiraDefectVO>();
			DefectList_Open = getMongoOperation().find(query1, JiraDefectVO.class);

			for (int i = 0; i < versionlist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String version = versionlist.get(i);

				for (int j = 0; j < DefectList_Open.size(); j++) {
					List<DefectsVersionVO> listDefectVersion = DefectList_Open.get(j).getIssueVersion();
					for (int k = 0; k < listDefectVersion.size(); k++) {

						if (listDefectVersion.get(k).getVersionName().toString().equalsIgnoreCase(version)) {
							Count++;
						}
					}
				}
				vo.setValue(version);
				vo.setCount(Count);

				finalresult.add(vo);
			}

		} else {
			return finalresult;
		}
		return finalresult;
	}

	/**
	 * MASS MUTUAL LANDING PAGE BA PANEL CODE STARTS HERE
	 */

	/**
	 * This is the method which get the total defect count (BA Panel) in Landing
	 * Page.
	 * 
	 * @param args
	 *            dashboardName,owner.
	 * @return totDefCount.
	 * @see http://localhost:8080/intelligentdashboard/rest/defectServices/totalDefCount?dashboardName=All&owner=298834
	 */

	@GET
	@Path("/totalDefCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalDefectCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);

		long totDefCount = 0;

		if (operationalAccess) {
			List<Integer> levelIdList = OperationalDAO.getLevelIds(dashboardName, owner);
			String queryy = "{},{_id: 1}";
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			totDefCount = getMongoOperation().count(query1, DefectVO.class);

			return totDefCount;
		} else {
			return totDefCount;
		}
	}

	/**
	 * This is the method which get the open defect percentage (BA Panel) in
	 * Landing Page.
	 * 
	 * @param args
	 *            dashboardName,owner.
	 * @return defectOpenRate.
	 * @see http://localhost:8080/intelligentdashboard/rest/defectServices/defectOpenRate?dashboardName=All&owner=298834
	 */
	@GET
	@Path("/defectOpenRate")
	@Produces(MediaType.APPLICATION_JSON)
	public int defectOpenRate(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = LayerAccess.authenticateToken(authString);
		int defOpenRate = 0;
		if (operationalAccess) {
			List<Integer> levelIdList = OperationalDAO.getLevelIds(dashboardName, owner);
			long DefecTotCount = 0;
			long OpenedCount = 0;

			Query query = new Query();
			query.addCriteria(Criteria.where("levelId").in(levelIdList));
			query.addCriteria(Criteria.where("issueStatus").ne("Closed"));
			OpenedCount = getMongoOperation().count(query, DefectVO.class);

			String queryy = "{},{_id: 1}";
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			DefecTotCount = getMongoOperation().count(query1, DefectVO.class);

			if (OpenedCount > 0 && DefecTotCount > 0) {
				defOpenRate = (int) (OpenedCount * 100 / DefecTotCount);
			} else {
				defOpenRate = 0;
			}

			return defOpenRate;
		} else {
			return defOpenRate;
		}
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

			boolean operationalAccess = LayerAccess.authenticateToken(authString);

			List<Date> finalDateList = new ArrayList<Date>();

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
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

			List<JiraDefectVO> issueSprintStartDateTCList = new ArrayList<JiraDefectVO>();
			List<JiraDefectVO> issueSprintEndDateTCList = new ArrayList<JiraDefectVO>();

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

				issueSprintStartDateTCList = getMongoOperation().find(query1, JiraDefectVO.class);
				issueSprintEndDateTCList = getMongoOperation().find(query2, JiraDefectVO.class);

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

					boolean operationalAccess = LayerAccess.authenticateToken(authString);

					List<Date> finalDateList = new ArrayList<Date>();

					List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName,
							projectName);

					Query filterQuery = new Query();
					filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
					filterQuery.addCriteria(Criteria.where("owner").is(userId));

					/*List<String> prolist = new ArrayList<String>();
					prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
							filterQuery.getQueryObject());

					List<String> sprintlist = new ArrayList<String>();
					sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
							filterQuery.getQueryObject());

					List<String> epiclist = new ArrayList<String>();
					epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
							filterQuery.getQueryObject());*/

					List<JiraDefectVO> issueSprintStartDateTCList = new ArrayList<JiraDefectVO>();
					List<JiraDefectVO> issueSprintEndDateTCList = new ArrayList<JiraDefectVO>();

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

						issueSprintStartDateTCList = getMongoOperation().find(query1, JiraDefectVO.class);
						issueSprintEndDateTCList = getMongoOperation().find(query2, JiraDefectVO.class);

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

}
