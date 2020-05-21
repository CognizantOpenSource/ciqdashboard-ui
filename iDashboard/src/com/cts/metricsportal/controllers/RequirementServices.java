package com.cts.metricsportal.controllers;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
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
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.DateTimeCalc;
import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectChartVO;
import com.cts.metricsportal.vo.JiraReqTrendVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.JiraTestCaseVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.OperationalDashboardsEpicsVO;
import com.cts.metricsportal.vo.OperationalDashboardsSprintsVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Path("/requirementServices")
public class RequirementServices extends BaseMongoOperation {
	static final Logger logger = Logger.getLogger(RequirementServices.class);
	DateTimeCalc dateTimeCalc = new DateTimeCalc();

	/**
	 * This Service will return the Priority details.
	 * 
	 * @param dashboardName
	 * @param owner
	 * @return priorityresult
	 */
	@GET
	@Path("/reqprioritychartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirementStatusVO> getRequirementPiechart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		List<RequirementStatusVO> priorityresult = null;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);
		Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
				group("priority").count().as("priorityCnt"), project("priorityCnt").and("priority").previousOperation(),
				sort(Direction.ASC, "priority"));
		AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class,
				RequirementStatusVO.class);
		priorityresult = groupResults.getMappedResults();

		return priorityresult;

	}

	/**
	 * Date Filter Code - Ends Here
	 */

	/**
	 * Levis code starts here
	 */

	/* NEW DROP DOWN CODE STARTS HERE */

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
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<JiraRequirmentVO> idlist = new ArrayList<JiraRequirmentVO>();
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value
		
		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
				projectName);

		Query projectquery = new Query();
		projectquery.addCriteria(Criteria.where("_id").in(levelIdList));
		idlist = getMongoOperation().find(projectquery, JiraRequirmentVO.class);
		List<String> projectlist = new ArrayList<String>();
		List<String> prolist = null;
		if (authenticateToken) {
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
	@Path("/sprintlevellist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("selectedproject") String selectedproject,
			@QueryParam("selectedepic") String selectedepic) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query sprintquery = new Query();
		List<String> sprintlist = new ArrayList<String>();

		List<String> prolist = new ArrayList<String>();
		for (String retval : selectedproject.split(",")) {
			prolist.add(retval);
		}

		sprintquery.addCriteria(Criteria.where("prjName").in(prolist));
		if (authenticateToken) {

			if (selectedepic == null) {
				// System.out.println("SelectedEpic is NULL");
				sprintlist = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
						sprintquery.getQueryObject());
			} else if (selectedepic != null) {
				// System.out.println("SelectedEpic is NOT NULL");
				sprintquery.addCriteria(Criteria.where("issueEpic").is(selectedepic));
				sprintlist = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
						sprintquery.getQueryObject());
			}

			return sprintlist;

		} else {
			return sprintlist;
		}

	}

	// Sprint List - Drop Down (implement levelId later)
	@SuppressWarnings("unchecked")
	@GET
	@Path("/sprintsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSprintList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

	//	Date dfromdate = new Date(dfromval);
	//	Date dtoddate = new Date(dtoval);

		List<String> sprintlist = new ArrayList<String>();

		if (authenticateToken) {

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
			//sprintquery.addCriteria(Criteria.where("issueSprintStartDate").gte(dfromdate)
				//	.andOperator(Criteria.where("issueSprintEndDate").lte(dtoddate)));
			sprintlist = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
					sprintquery.getQueryObject());

			/*
			 * int count = 0; ObjectMapper mapper = new ObjectMapper();
			 * 
			 * JsonFactory jf = new MappingJsonFactory();
			 * 
			 * String listSprintString = "[";
			 * 
			 * for (int i = 0; i < sprintlist.size(); i++) { listSprintString =
			 * listSprintString + "{\"" + "sprintName\"" + ":\"" +
			 * (sprintlist.get(i)) + "\"}"; if (i != sprintlist.size() - 1) {
			 * listSprintString = listSprintString + ","; } }
			 * 
			 * listSprintString = listSprintString + "]";
			 * 
			 * JsonParser jsonParser = jf.createJsonParser(listSprintString);
			 * 
			 * List<OperationalDashboardsSprintsVO> listSprints = null;
			 * TypeReference<List<OperationalDashboardsSprintsVO>> tRef = new
			 * TypeReference<List<OperationalDashboardsSprintsVO>>() { };
			 * 
			 * listSprints = mapper.readValue(jsonParser, tRef);
			 * 
			 * OperationalDashboardVO dashvo1 = new OperationalDashboardVO();
			 * 
			 * dashvo1.setDashboardName(dashboardName);
			 * dashvo1.setOwner(userId); dashvo1.setSprints(listSprints);
			 * 
			 * Query query = new Query();
			 * 
			 * query.addCriteria(Criteria.where("dashboardName").is(
			 * dashboardName));
			 * query.addCriteria(Criteria.where("owner").is(userId));
			 * 
			 * Update update = new Update(); update.set("dashboardName",
			 * dashboardName); update.set("owner", userId);
			 * update.set("sprints", listSprints);
			 * 
			 * List<OperationalDashboardVO> dashvoInfo =
			 * getMongoOperation().findAll(OperationalDashboardVO.class);
			 * 
			 * for (OperationalDashboardVO vo : dashvoInfo) { if
			 * (vo.getOwner().equalsIgnoreCase(userId) &&
			 * vo.getDashboardName().equalsIgnoreCase(dashboardName)) { count =
			 * count + 1;
			 * 
			 * } } if (count == 1) { getMongoOperation().updateFirst(query,
			 * update, OperationalDashboardVO.class); }
			 */
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
			boolean authenticateToken = LayerAccess.authenticateToken(authString);

			 Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(dfromval);
				endDate = dateTimeCalc.getEndDate(dtoval);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}
			
			List<String> sprintlist = new ArrayList<String>();

			if (authenticateToken) {

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
				sprintquery.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate)
						.andOperator(Criteria.where("issueSprintEndDate").lte(endDate)));
				sprintlist = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
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
			@QueryParam("dashboardName") String dashboardName, @QueryParam("selectedproject") String selectedproject,
			@QueryParam("selectedsprint") String selectedsprint) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

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

		if (authenticateToken) {

			epiclist = getMongoOperation().getCollection("JiraRequirements").distinct("issueEpic",
					epicquery.getQueryObject());

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
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<String> epiclist = new ArrayList<String>();

		if (authenticateToken) {

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

			epiclist = getMongoOperation().getCollection("JiraRequirements").distinct("issueEpic",
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
			dashvo1.setOwner(userId);
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

	@SuppressWarnings("unchecked")
	@GET
	@Path("/reqTotalStoriesCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalStoriesCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		long defTotalStoriesCount = 0;

		if (authenticateToken) {
			Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(vardtfrom);
				endDate = dateTimeCalc.getEndDate(vardtto);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}
			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value
			
			
			
			filterQuery.addCriteria(Criteria.where("owner").is(userId));

			List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
					projectName);
			String query = "{},{_id:0,levelId:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueType").is("Story"));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}

			defTotalStoriesCount = getMongoOperation().count(query1, JiraRequirmentVO.class);

			return defTotalStoriesCount;
		} else {
			return defTotalStoriesCount;
		}
	}

	@GET
	@Path("/reqTotalStoryPoints")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalStoryPoints(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		long defTotalStoryPoints = 0;

		if (authenticateToken) {

			Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(vardtfrom);
				endDate = dateTimeCalc.getEndDate(vardtto);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}
			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value
			
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

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
					projectName);
			String query = "{},{_id:0,levelId:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
			query1.addCriteria(Criteria.where("issueType").is("Story"));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			List<JiraRequirmentVO> listStories = getMongoOperation().find(query1, JiraRequirmentVO.class);
			double dblTotalStoryPoints = 0;
			for (JiraRequirmentVO indvStory : listStories) {
				int int_indvStoryPoint = indvStory.getStoryPoints();
				String indvStoryPoint = "" + int_indvStoryPoint;
				double dbStoryPoint = Double.parseDouble(indvStoryPoint);
				dblTotalStoryPoints = dblTotalStoryPoints + dbStoryPoint;
			}

			defTotalStoryPoints = (long) dblTotalStoryPoints;

			return defTotalStoryPoints;
		} else {
			return defTotalStoryPoints;
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/jirareqStatusTrend")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraReqTrendVO> getReqStatusTrendChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
				projectName);
		List<JiraReqTrendVO> trendvolist = null;
		JiraReqTrendVO reqtrendvo = new JiraReqTrendVO();
		trendvolist = new ArrayList<JiraReqTrendVO>();

		if (authenticateToken) {

			Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(vardtfrom);
				endDate = dateTimeCalc.getEndDate(vardtto);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}

			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			filterQuery.addCriteria(Criteria.where("owner").is(userId));

			List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());
			/*
			 * List<String> epiclist = new ArrayList<String>(); epiclist =
			 * getMongoOperation().getCollection("operationalDashboards").
			 * distinct("epics.epicName", filterQuery.getQueryObject());
			 */
			String query = "{},{_id:0,levelId:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueType").is("Story"));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

			if (prolist.size() > 0) {
				for(int lst=0;lst<prolist.size();lst++) {
					if(prolist.get(lst).equals("undefined")) {
						prolist.remove(lst);
					}
				}
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			/*
			 * if (epiclist.size()>0) {
			 * query1.addCriteria(Criteria.where("issueEpic").in(epiclist)); }
			 */

			List<Date> datelist = new ArrayList<Date>();
			List<JiraRequirmentVO> reqlist = new ArrayList<JiraRequirmentVO>();

			reqlist = getMongoOperation().find(query1, JiraRequirmentVO.class);

			List<Date> datesslist = new ArrayList<Date>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						datesslist.add(reqlist.get(i).getIssueCreated());
					}
				}
			}
			Set<Date> hSet = new HashSet<Date>(datesslist);
			datelist = new ArrayList<Date>(hSet);

			List<JiraRequirmentVO> reqDataList = new ArrayList<JiraRequirmentVO>();
			reqDataList = getMongoOperation().find(query1, JiraRequirmentVO.class);

			List<String> blacklist = new ArrayList<String>();

			for (int i = 0; i < datelist.size(); i++) {

				Date dateString = datelist.get(i);
				boolean proceed = true;
				reqtrendvo = new JiraReqTrendVO();

				// Levis columns

				int done = 0;
				int toDo = 0;
				int inProgress = 0;
				int inTesting = 0;

				if (proceed) {
					for (int j = 0; j < reqDataList.size(); j++) {
						if (reqDataList.get(j).getIssueCreated().getDate() == datelist.get(i).getDate()
								&& (reqDataList.get(j).getIssueCreated().getMonth() + 1) == (datelist.get(i).getMonth()
										+ 1)
								&& (reqDataList.get(j).getIssueCreated().getYear() + 1900) == (datelist.get(i).getYear()
										+ 1900)) {

							try {

								if (reqDataList.get(j).getIssueStatus().equalsIgnoreCase("Done")) {
									done++;
									reqtrendvo.setDone(done);
								}

								else if (reqDataList.get(j).getIssueStatus().equalsIgnoreCase("To Do")) {
									toDo++;
									reqtrendvo.setToDo(toDo);
								}

								else if (reqDataList.get(j).getIssueStatus().equalsIgnoreCase("In Progress")) {
									inProgress++;
									reqtrendvo.setInProgress(inProgress);
								}

								else if (reqDataList.get(j).getIssueStatus().equalsIgnoreCase("In Testing")) {
									inTesting++;
									reqtrendvo.setInTesting(inTesting);
								}

							} catch (Exception e) {
								logger.error("exception caught" + e.getMessage());
							}
						}
					}

					Date date = new Date();
					date = dateString;
					SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
					String format = formatter.format(date);

					if (!blacklist.contains(format)) {
						reqtrendvo.setDate(format);
						reqtrendvo.setMydate(dateString);
						trendvolist.add(reqtrendvo);
					}
					blacklist.add(format);
				}
			}

			Collections.sort(trendvolist, new Comparator<JiraReqTrendVO>() {
				public int compare(JiraReqTrendVO m1, JiraReqTrendVO m2) {
					return m1.getDate().compareTo(m2.getDate());
				}
			});
			return trendvolist;
		} else {
			return trendvolist;
		}
	}

	// Requirement by Status
	@GET
	@Path("/reqStoriesByStatus")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getReqStoriesByStatus(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

		List<JiraRequirmentVO> reqlist = new ArrayList<JiraRequirmentVO>();

		if (authenticateToken) {
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));
			reqlist = getMongoOperation().find(query, JiraRequirmentVO.class);

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

			Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(vardtfrom);
				endDate = dateTimeCalc.getEndDate(vardtto);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}
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
			query1.addCriteria(Criteria.where("issueType").is("Story"));

			if (prolist.size() > 0) {
				query1.addCriteria(Criteria.where("prjName").in(prolist));
			}
			if (sprintlist.size() > 0) {
				query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
			}
			if (epiclist.size() > 0) {
				query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
			}

			List<JiraRequirmentVO> ReqList = new ArrayList<JiraRequirmentVO>();
			ReqList = getMongoOperation().find(query1, JiraRequirmentVO.class);

			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String status = statuslist.get(i);

				for (int j = 0; j < ReqList.size(); j++) {
					if (ReqList.get(j).getIssueStatus().equalsIgnoreCase(status)) {
						Count++;
					}
				}
				vo.setValue(status);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		} else {
			return finalresult;
		}
		return finalresult;
	}

	@GET
	@Path("/reqStoriesByPriority")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getReqStoriesByPriority(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException,IllegalArgumentException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();

		List<JiraRequirmentVO> reqlist = new ArrayList<JiraRequirmentVO>();

		if (authenticateToken) {
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
					projectName);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").in(levelIdList));
			reqlist = getMongoOperation().find(query, JiraRequirmentVO.class);

			List<String> statuslist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssuePriority());
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			statuslist = new ArrayList<String>(hSet);

			Date startDate = null,endDate = null;
			 
			try {
				startDate = dateTimeCalc.getStartDate(vardtfrom);
				endDate = dateTimeCalc.getEndDate(vardtto);
					
			} catch (ParseException e) {
				
				e.printStackTrace();
			}

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
			query1.addCriteria(Criteria.where("issueType").is("Story"));
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

			List<JiraRequirmentVO> ReqList = new ArrayList<JiraRequirmentVO>();
			ReqList = getMongoOperation().find(query1, JiraRequirmentVO.class);

			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String status = statuslist.get(i);

				for (int j = 0; j < ReqList.size(); j++) {
					if (ReqList.get(j).getIssuePriority().equalsIgnoreCase(status)) {
						Count++;
					}
				}
				vo.setValue(status);
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

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<Date> finalDateList = new ArrayList<Date>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
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

		List<JiraRequirmentVO> issueSprintStartDateReqList = new ArrayList<JiraRequirmentVO>();
		List<JiraRequirmentVO> issueSprintEndDateReqList = new ArrayList<JiraRequirmentVO>();

		if (authenticateToken) {

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

			issueSprintStartDateReqList = getMongoOperation().find(query1, JiraRequirmentVO.class);
			issueSprintEndDateReqList = getMongoOperation().find(query2, JiraRequirmentVO.class);

			Date startDate = null;
			Date endDate = null;

			for (int i = 0; i < issueSprintStartDateReqList.size(); i++) {
				if (issueSprintStartDateReqList.get(i).getIssueSprintStartDate() != null) {
					startDate = issueSprintStartDateReqList.get(i).getIssueSprintStartDate();
					break;
				}
			}

			for (int j = 0; j < issueSprintEndDateReqList.size(); j++) {
				if (issueSprintEndDateReqList.get(j).getIssueSprintEndDate() != null) {
					endDate = issueSprintEndDateReqList.get(j).getIssueSprintEndDate();
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

			boolean authenticateToken = LayerAccess.authenticateToken(authString);

			List<Date> finalDateList = new ArrayList<Date>();

			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName,
					projectName);

			Query filterQuery = new Query();
			filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			
			
			String owner = "";

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value
			
			filterQuery.addCriteria(Criteria.where("owner").is(userId));

			/*List<String> prolist = new ArrayList<String>();
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());

			List<String> epiclist = new ArrayList<String>();
			epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
					filterQuery.getQueryObject());
*/
			List<JiraRequirmentVO> issueSprintStartDateReqList = new ArrayList<JiraRequirmentVO>();
			List<JiraRequirmentVO> issueSprintEndDateReqList = new ArrayList<JiraRequirmentVO>();

			if (authenticateToken) {

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
				}
*/
				query1.with(new Sort(Sort.Direction.ASC, "issueSprintStartDate"));
				query2.with(new Sort(Sort.Direction.DESC, "issueSprintEndDate"));

				issueSprintStartDateReqList = getMongoOperation().find(query1, JiraRequirmentVO.class);
				issueSprintEndDateReqList = getMongoOperation().find(query2, JiraRequirmentVO.class);

				Date startDate = null;
				Date endDate = null;

				for (int i = 0; i < issueSprintStartDateReqList.size(); i++) {
					if (issueSprintStartDateReqList.get(i).getIssueSprintStartDate() != null) {
						startDate = issueSprintStartDateReqList.get(i).getIssueSprintStartDate();
						break;
					}
				}

				for (int j = 0; j < issueSprintEndDateReqList.size(); j++) {
					if (issueSprintEndDateReqList.get(j).getIssueSprintEndDate() != null) {
						endDate = issueSprintEndDateReqList.get(j).getIssueSprintEndDate();
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