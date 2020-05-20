package com.cts.metricsportal.controllers;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.naming.NamingException;
import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.DatatypeConverter;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.cts.metricsportal.vo.UserStoriesVO;
import com.cts.metricsportal.vo.UserStoryDefectsStatusVO;
import com.cts.metricsportal.vo.UserStoryDefectsVO;
import com.cts.metricsportal.vo.UserStoryStatusVO;
import com.cts.metricsportal.vo.UserStoryTestCasesVO;
import com.cts.metricsportal.vo.UserStoryTrendVO;
import com.cts.metricsportal.vo.UserVO;

@Path("/rallyServices")
public class RallyServices extends BaseMongoOperation {
	static final Logger logger = Logger.getLogger(RallyServices.class);

	// User Story Owner on Load
	/*
	 * Metric : lifecycle/User Stories/ User story owner chart Rest URL :
	 * rest/RallyServices/userstoryownerchartdata JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * newOwnerCountChart=function()
	 */

	@GET
	@Path("/userstoryownerchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getuserstorynowner(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject
			) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<UserStoryStatusVO> result = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		 	if(operationalAccess){
			Aggregation agg;
			if (!"".equals(userStrproject) && !"undefined".equals(userStrproject)) {
				agg = newAggregation(match(Criteria.where("projectName").is(userStrproject)),
						group("storyOwner").count().as("ownercount"),
						project("ownercount").and("storyOwner").previousOperation());
			} else {
				agg = newAggregation(group("storyOwner").count().as("ownercount"),
						project("ownercount").and("storyOwner").previousOperation());
			}

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);

			result = groupResults.getMappedResults();

			return result;}
		 	else{
		 		return result;	
		 	}
	
	}

	@GET
	@Path("/lifeUserstoryStatuschartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getlifeUserstoryStatuschartdata(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject,
			@QueryParam("userStrIter") String userStrIter) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserStoryStatusVO> result = null;
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);

		//System.out.println("lifeUserstoryStatuschartdata >>>> 1111:::2222" + userStrproject);

		// System.out.println("lifeUserstoryStatuschartdata >>>> 1111:::2222" +
		// userStrIter);

		
			Aggregation agg = null;

			// if(!"".equals(userStrproject)&& !
			// "undefined".equals(userStrproject) ){
			if(LCAccess){
			if (!"undefined".equals(userStrproject)) {

				// System.out.println("if first if >>>>>");
				String query = "{},{_id:0,iterationName:1}";
				BasicQuery query1 = new BasicQuery(query);

				Criteria criteria1 = new Criteria();
				criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
				query1.addCriteria(criteria1);
				query1.with(new Sort(Sort.Direction.DESC, "endDate"));

				if (!"undefined".equals(userStrIter)) {
					// System.out.println("if 2nd if >>>>>");

					agg = newAggregation(
							match(Criteria.where("projectName").is(userStrproject).and("iteration").is(userStrIter)),
							group("storyStatus").count().as("typecount"),
							project("typecount").and("storyStatus").previousOperation());

				} else {
					// System.out.println("if first else >>>>>");

					List<UserStoriesIterationVO> iterations = getMongoOperation().find(query1,
							UserStoriesIterationVO.class);
					String currentIteration = null;
					if(!iterations.isEmpty()){
						currentIteration = iterations.get(0).getIterationName();}
				if(currentIteration!=null)
					agg = newAggregation(
							match(Criteria.where("projectName").is(userStrproject).and("iteration")
									.is(currentIteration)),
							group("storyStatus").count().as("typecount"),
							project("typecount").and("storyStatus").previousOperation());

				}

			} else {
				// System.out.println("if 2nd else >>>>>");
				agg = newAggregation(group("storyStatus").count().as("typecount"),
						project("typecount").and("storyStatus").previousOperation());

			}
			if(agg!=null){
				AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
						UserStoryStatusVO.class);

				result = groupResults.getMappedResults();
			}
			

			return result;}
			else{
				return result;	
			}
		
	}

	
	// User Story Count
	/*
	 * Metric : lifecycle/User Stories/ User story count Rest URL :
	 * rest/RallyServices/userStoryCount : WebContent JS File: UserStoryCtrl.js
	 * JS Function: UserStoryCtrl/ initialUserStorycount=function()
	 */

	@GET
	@Path("/lifeuserStoryCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getlifeUserStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStories = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

			// System.out.println("userStoryCount>>>>>4444::::userStrproject
			// :::"+ userStrproject);
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);
			if(operationalAccess){
			if (!"undefined".equals(userStrproject)) {
				Criteria criteria1 = new Criteria();
				criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
				query1.addCriteria(criteria1);
				totalUserStories = getMongoOperation().count(query1, UserStoriesVO.class);
			} else {
				totalUserStories = getMongoOperation().count(query1, UserStoriesVO.class);
			}

		return totalUserStories;}
			else{
				return totalUserStories;	
			}

	}

	@GET
	@Path("/projectDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getprojectDetails(@HeaderParam("Authorization") String authString) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStories = 0;
		List<String> projectcoll = null;

		//System.out.println("authenticateresult >>>>>" + authenticateresult);

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		 if(operationalAccess){
			projectcoll = getMongoOperation().getCollection("userstories").distinct("projectName");
		

		//System.out.println("projectDetails>>>>>4444::::" + projectcoll);

		return projectcoll;}
		 else{
			 return projectcoll; 
		 }

	}

	@GET
	@Path("/iterationDetailsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getiterationDetailsList(@HeaderParam("Authorization") String authString,
		@QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStories = 0;
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);

		String query = "{},{_id:0,iterationName:1}";
		BasicQuery query1 = new BasicQuery(query);

		//System.out.println("calling iterationDetailsList >>>>4444:::" + userStrproject);
		
		Criteria criteria1 = new Criteria();
		criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
		query1.addCriteria(criteria1);
		query1.with(new Sort(Sort.Direction.DESC, "endDate"));

		List<UserStoriesIterationVO> iterations = getMongoOperation().find(query1, UserStoriesIterationVO.class);
		List<String> iterationList = new ArrayList<String>();
		if(LCAccess){
		for (int i = 0; i < iterations.size(); i++) {
			iterationList.add(iterations.get(i).getIterationName());
		}

		// System.out.println("calling iterationDetailsList
		// >>>>4444:::"+iterationList);

		return iterationList;}
		else{
			return iterationList;	
		}

	}

	@GET
	@Path("/iterationDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public UserStoriesIterationVO getiterationDetails(@HeaderParam("Authorization") String authString,
			 @QueryParam("userStrproject") String userStrproject,
			@QueryParam("userStrIter") String userStrIter) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStories = 0;
		// List<UserStoriesIterationVO> iterations=new
		// ArrayList<UserStoriesIterationVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		UserStoriesIterationVO userStrObj = null;
		List<UserStoriesIterationVO> result = new ArrayList<UserStoriesIterationVO>();
		if(LCAccess){
		if (!"undefined".equals(userStrproject)) {
			String query = "{},{_id:0,iterationName:1}";
			BasicQuery query1 = new BasicQuery(query);
			BasicQuery query2 = new BasicQuery(query);

			Criteria criteria1 = new Criteria();

			if (!"undefined".equals(userStrIter)) {
				Criteria criteria2 = new Criteria();
				criteria2.andOperator(Criteria.where("projectName").is(userStrproject),
						Criteria.where("iterationName").is(userStrIter));
				query2.addCriteria(criteria2);
				result = getMongoOperation().find(query2, UserStoriesIterationVO.class);
				if(!result.isEmpty()){
				userStrObj = result.get(0);}
			} else {
				criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
				query1.addCriteria(criteria1);
				query1.with(new Sort(Sort.Direction.DESC, "endDate"));
				result = getMongoOperation().find(query1, UserStoriesIterationVO.class);
				if(!result.isEmpty()){
				userStrObj = result.get(0);}
			}

		}
		return userStrObj;}
		else{
			return userStrObj;	
		}

	}

	@GET
	@Path("/iterationStoryCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getiterationStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("userStrproject") String userStrproject,
			@QueryParam("userStrIter") String userStrIter) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStories = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		// System.out.println("iterationStoryCount userStrproject >>>
		// 44444::::66666" + userStrproject);
		// System.out.println("iterationStoryCount userStrIter >>> 4444:::66666"
		// + userStrIter);
if(LCAccess){
		if (!"undefined".equals(userStrproject)) {
			String query = "{},{_id:0,iterationName:1}";
			BasicQuery query1 = new BasicQuery(query);
			BasicQuery query2 = new BasicQuery(query);

			Criteria criteria1 = new Criteria();
			criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
			query1.addCriteria(criteria1);
			query1.with(new Sort(Sort.Direction.DESC, "endDate"));

			List<UserStoriesIterationVO> iterations = getMongoOperation().find(query1, UserStoriesIterationVO.class);
			Criteria criteria2 = new Criteria();

			if (!"undefined".equals(userStrIter)) {

				//System.out.println("in if>>>>>");

				criteria2 = new Criteria();
				criteria2.andOperator(Criteria.where("projectName").is(userStrproject),
						Criteria.where("iteration").is(userStrIter));
				query2.addCriteria(criteria2);
				totalUserStories = getMongoOperation().count(query2, UserStoriesVO.class);

			} else {
				//System.out.println("in else>>>>>");
				String currentIter = IdashboardConstantsUtil.NULL;
				if(!iterations.isEmpty()){
					currentIter = iterations.get(0).getIterationName();}
				if(currentIter!=null)
				criteria2.andOperator(Criteria.where("projectName").is(userStrproject),
						Criteria.where("iteration").is(currentIter));
				query2.addCriteria(criteria2);
				totalUserStories = getMongoOperation().count(query2, UserStoriesVO.class);
			}
		}

		// System.out.println("in iterationStoryCount totalUserStories >>>>>" +
		// totalUserStories);

		return totalUserStories;}
else{
	return totalUserStories;	
}

	}

	@GET
	@Path("/initIterationUserStoryPoints")
	@Produces(MediaType.APPLICATION_JSON)
	public long getIterationUserStoryPoints(@HeaderParam("Authorization") String authString,
			@QueryParam("userStrproject") String userStrproject,
			@QueryParam("userStrIter") String userStrIter) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStoriesPoints = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		//System.out.println("initIterationUserStoryPoints >>>>77777:::888888" + userStrproject);
		if(LCAccess){
		if (!"undefined".equals(userStrproject)) {
			String query = "{},{_id:0,iterationName:1}";
			BasicQuery query1 = new BasicQuery(query);

			Criteria criteria1 = new Criteria();
			criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
			query1.addCriteria(criteria1);
			query1.with(new Sort(Sort.Direction.DESC, "endDate"));

			if (!"undefined".equals(userStrIter)) {

				Aggregation agg = newAggregation(match(Criteria.where("iteration").is(userStrIter)),
						group("iteration").sum("planEstimate").as("sumct"),
						project("sumct").and("storyID").previousOperation());

				AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
						UserStoriesVO.class, UserStoryStatusVO.class);
				if(!groupResults.getMappedResults().isEmpty()){
				totalUserStoriesPoints = (long) groupResults.getMappedResults().get(0).getSumct();
				}
			} else {
				List<UserStoriesIterationVO> iterations = getMongoOperation().find(query1,
						UserStoriesIterationVO.class);
				String currentIter = IdashboardConstantsUtil.NULL;
				if(!iterations.isEmpty()){
				currentIter = iterations.get(0).getIterationName();
				}
				Aggregation agg = null;
				AggregationResults<UserStoryStatusVO> groupResults = null;
				if(currentIter!=null)
					agg = newAggregation(match(Criteria.where("iteration").is(currentIter)),
						group("iteration").sum("planEstimate").as("sumct"),
						project("sumct").and("storyID").previousOperation());
				if(agg != null){
					 groupResults = getMongoOperation().aggregate(agg,
							UserStoriesVO.class, UserStoryStatusVO.class);
				}
				
				
				if(!groupResults.getMappedResults().isEmpty()){
				totalUserStoriesPoints = (long) groupResults.getMappedResults().get(0).getSumct();
				}
			}

		}

		// System.out.println("initIterationUserStoryPoints
		// totalUserStoriesPoints >>>>77777:::888888" + totalUserStoriesPoints);

		return totalUserStoriesPoints;}
		else{
			return totalUserStoriesPoints;	
		}

	}

	// User Story backlog Count
	/*
	 * Metric : lifecycle/User Stories/ User story backlog count Rest URL :
	 * rest/RallyServices/userStoryBackLogCount : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * initUserStoryBackLogCount=function()
	 */

	@GET
	@Path("/userStoryBackLogCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getuserStoryBackLogCount(@HeaderParam("Authorization") String authString) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStoriesBacklog = 0;

		
			String hasChildren = "false";
			String backlogStr = "true";

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("hasChildren", hasChildren);
			searchvalues.put("backlogStr", backlogStr);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {
				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}

			}

			totalUserStoriesBacklog = getMongoOperation().count(query1, UserStoriesVO.class);

		return totalUserStoriesBacklog;

	}

	@GET
	@Path("/initIterationUserStoryBackLogCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getinitIterationUserStoryBackLogCount(@HeaderParam("Authorization") String authString,
			@QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStoriesBacklog = 0;
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);


			String hasChildren = "false";
			String backlogStr = "true";

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("hasChildren", hasChildren);
			searchvalues.put("backlogStr", backlogStr);
			searchvalues.put("projectName", userStrproject);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);
			if(operationalAccess){
			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {
				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}

			}

			totalUserStoriesBacklog = getMongoOperation().count(query1, UserStoriesVO.class);

		

		return totalUserStoriesBacklog;}
			else{
				return totalUserStoriesBacklog;
			}

	}

	
	@GET
	@Path("/lifeuserStorySprintCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getlifeuserStorySprintCount(@HeaderParam("Authorization") String authString,
			@QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		// System.out.println("lifeuserStorySprintCount >>>>> userStrproject
		// >>>" + userStrproject);

		long totalUserStoriesSprint = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);


			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);
			if(operationalAccess){
			if (!"undefined".equals(userStrproject)) {
				Criteria criteria1 = new Criteria();
				criteria1.andOperator(Criteria.where("projectName").is(userStrproject));
				query1.addCriteria(criteria1);
				totalUserStoriesSprint = getMongoOperation().count(query1, UserStoriesIterationVO.class);
			} else {

				totalUserStoriesSprint = getMongoOperation().count(query1, UserStoriesIterationVO.class);
			}

		

		// System.out.println("lifeuserStorySprintCount >>>>>
		// totalUserStoriesSprint >>>" + totalUserStoriesSprint);

		return totalUserStoriesSprint;}
			else{
				return totalUserStoriesSprint;		
			}

	}

	/*
	 * User Story Test count - On Load Metric : Operational/userstories/user
	 * story Testcase Rest URL : rest/rallyServices/userStoryTestCount JS File :
	 * userstoriesdata\UserStoryCtrl.js
	 */

	@GET
	@Path("/userStoryTestCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryTestCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		long totaluserStoryTest = 0;

			String query = "{},{_id:0,storyID:1,testID:1,testCreationDate:1,testLastUpdateDate:1}";
			BasicQuery query2 = new BasicQuery(query);
			totaluserStoryTest = getMongoOperation().count(query2, UserStoryTestCasesVO.class);

		

		return totaluserStoryTest;

	}

	/*
	 * User Story Defect count - On Load Metric : Operational/userstories/user
	 * story defect Rest URL : rest/rallyServices/userStoryDefectCount JS File :
	 * userstoriesdata\UserStoryCtrl.js
	 */

	@GET
	@Path("/userStoryDefectCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryDefectCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		long totaluserStoryDefectCount = 0;
		if(operationalAccess){
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);
			totaluserStoryDefectCount = getMongoOperation().count(query1, UserStoryDefectsVO.class);

			return totaluserStoryDefectCount;}
		else{
			return totaluserStoryDefectCount;
		}
	
	}

	// Design Count by Test Type
	/*
	 * Metric : Operational/Design/Design Count by Test Type Rest URL :
	 * rest/testCaseServices/designtypechartdata JS File :
	 * WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js JS
	 * Function: TestCasesCtrl/ $scope.newTypeChart=function(domain,
	 * project,release)
	 */

	@GET
	@Path("/userstorydefchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryDefectsStatusVO> getUserStoryDef(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<UserStoryDefectsStatusVO> result = null;
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		 if(operationalAccess){
			Aggregation agg = newAggregation(group("storyID").count().as("typecount"),
					project("typecount").and("storyID").previousOperation());

			AggregationResults<UserStoryDefectsStatusVO> groupResults = getMongoOperation().aggregate(agg,
					UserStoryDefectsVO.class, UserStoryDefectsStatusVO.class);

			result = groupResults.getMappedResults();

			return result;}
		 else{
			 return result; 
		 }
	}

	@GET
	@Path("/sprintdefchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryDefectsStatusVO> getSprintdefchartdata(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<UserStoryDefectsStatusVO> result = null;

			// System.out.println("from sprintdefchartdata 44444:::::444444");

			Aggregation agg = newAggregation(group("SprintID").count().as("typecount"),
					project("typecount").and("SprintID").previousOperation());

			AggregationResults<UserStoryDefectsStatusVO> groupResults = getMongoOperation().aggregate(agg,
					UserStoryDefectsVO.class, UserStoryDefectsStatusVO.class);

			result = groupResults.getMappedResults();

			return result;
	}

	// User Story Owner on Load
	/*
	 * Metric : lifecycle/User Stories/ User story project pie chart Rest URL :
	 * rest/RallyServices/userstorysprintchartdata JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * userStorySprintChart=function()
	 */

	@GET
	@Path("/userstorysprintchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getUserStorySprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		// List<UserStoryDefectsStatusVO> result=null;
		List<UserStoryStatusVO> result = null;
	
			// System.out.println("calling userstorysprintchartdata >>>>
			// 4444::::");
			// Aggregation agg =
			// newAggregation(group("SprintID").count().as("typecount"),
			// project("typecount").and("SprintID").previousOperation(),
			// sort(Direction.ASC, "SprintID"));

			Aggregation agg = newAggregation(group("iteration").count().as("typecount"),
					project("typecount").and("iteration").previousOperation(), sort(Direction.ASC, "iteration"));

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);
			result = groupResults.getMappedResults();

			//System.out.println("size is >>>> " + result.size());

			for (int i = 0; i < result.size(); i++) {

				//System.out.println("iteration is >>>444::" + result.get(i).getIteration());

			}

			// System.out.println("calling userstorysprintchartdata >>>>
			// 4444::::"+ result);

			return result;
	}

	//////////////////////////// User Story Trend
	//////////////////////////// Graph//////////////////////////////////////////////////

	@GET 
	@Path("/userstorytrendchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryTrendVO> getUserStoryrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		 boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		//List<String> levelIdList = RequirementsUtil.getLevelIds(dashboardName, owner);
		List<UserStoryTrendVO> trendvolist = null;
		
		//System.out.println("calling authenticateresult >>>4444:::4444:666" + authenticateresult);

		UserStoryTrendVO userStoryTrendVO = new UserStoryTrendVO();
		trendvolist = new ArrayList<UserStoryTrendVO>();
		
			//System.out.println("calling userstorytrendchartdata >>>4444:::4444:666");

			Aggregation agg;
if(operationalAccess || LCAccess){
			if (!"".equals(userStrproject) && !"undefined".equals(userStrproject)) {

				agg = newAggregation(match(Criteria.where("projectName").is(userStrproject)),
						group("storyCreationDate").count().as("count"),
						project("count").and("storyCreationDate").previousOperation(),
						sort(Direction.ASC, "storyCreationDate"));
			} else {

				agg = newAggregation(group("storyCreationDate").count().as("count"),
						project("count").and("storyCreationDate").previousOperation(),
						sort(Direction.ASC, "storyCreationDate"));

			}

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);

			List<UserStoryStatusVO> result = groupResults.getMappedResults();

			for (int i = 0; i < result.size(); i++) {

				int iCompleted = 0;
				int iDefined = 0;
				int iinProgress = 0;

				List<UserStoryStatusVO> result1 = new ArrayList<UserStoryStatusVO>();

				Aggregation agg1 = newAggregation(
						match(Criteria.where("storyCreationDate").is(result.get(i).getStoryCreationDate())),
						group("storyStatus").count().as("statusCnt"),
						project("statusCnt").and("storyStatus").previousOperation());

				AggregationResults<UserStoryStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						UserStoriesVO.class, UserStoryStatusVO.class);

				result1 = groupResultsFinal.getMappedResults();
				Date dateString = result.get(i).getStoryCreationDate();

				userStoryTrendVO = new UserStoryTrendVO();
				try {
					for (int j = 0; j < result1.size(); j++) {
						if (result1.get(j).getStoryStatus().equalsIgnoreCase("In-Progress")) {
							iinProgress = result1.get(j).getStatusCnt();
							userStoryTrendVO.setInprogress(iinProgress);
						}

						else if (result1.get(j).getStoryStatus().equalsIgnoreCase("Completed")) {
							iCompleted = result1.get(j).getStatusCnt();
							userStoryTrendVO.setCompleted(iCompleted);
						}

						else if (result1.get(j).getStoryStatus().equalsIgnoreCase("Defined")) {

							iDefined = result1.get(j).getStatusCnt();
							userStoryTrendVO.setDefined(iDefined);
							;

						}

					}
				} catch (Exception e) {
					logger.error("exception caught" + e.getMessage());
				}
				Date date = new Date();
				date = dateString;
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				String format = formatter.format(date);
				String strExistingFlag = "False";

				for (UserStoryTrendVO chartVO : trendvolist) {
					String strDate = chartVO.getDate();

					if (strDate.toString().equals((format.toString()))) {

						chartVO.setDefined(iDefined + chartVO.getDefined());
						chartVO.setInprogress(iinProgress + chartVO.getInprogress());
						chartVO.setCompleted(iCompleted + chartVO.getCompleted());
						strExistingFlag = "True";
						break;
					}
				}
				if (strExistingFlag.equalsIgnoreCase("False")) {
					userStoryTrendVO.setDate(format);
					userStoryTrendVO.setMydate(dateString);
					trendvolist.add(userStoryTrendVO);
				}
			}
			return trendvolist;}
else{
	return trendvolist;
}
	

	}

	//////////////////////////////////////////////////////////////////////////////

	///////////////// User Story Prority Funnel Chart///////////////////////

	@GET
	@Path("/userStorypriorityFunnelchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getUserStoryFunnelchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<UserStoryStatusVO> result = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		 if(operationalAccess){
			Aggregation agg = newAggregation(group("storyStatus").count().as("priorityCnt"),
					project("priorityCnt").and("storyStatus").previousOperation(), sort(Direction.DESC, "priorityCnt"));

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);

			result = groupResults.getMappedResults();
			return result;}
		 else{
			 return result; 
		 }
	}

	///////////////////////////////////////////////////////////////////////

	// User Story Data Table on Load
	/*
	 * Metric : lifecycle/User Stories/ User story Data Table Rest URL :
	 * rest/RallyServices/userStoryTableDetails JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * userStoryTableData=function()
	 */

	@GET
	@Path("/userStoryTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoriesVO> getRecordsreq(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		List<UserStoriesVO> userStoryAnalysisList = null;
		if(operationalAccess){
			String query = "{},{_id:0,storyID:1,storyName:1}";
			Query query1 = new BasicQuery(query);
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			userStoryAnalysisList = getMongoOperation().find(query1, UserStoriesVO.class);
			return userStoryAnalysisList;}
		else{
			return userStoryAnalysisList;
		}
	}

	// User Story Test Case search count
	/*
	 * Metric : lifecycle/User Stories/ User Test Case search count Rest URL :
	 * rest/RallyServices/userStorytestCaseSearchpagecount JS File : WebContent
	 * JS File: UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * searchableTestCase=function()
	 */

	@GET
	@Path("/userStorytestCaseSearchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStorytestCaseSearchpagecount(@HeaderParam("Authorization") String authString,
			@QueryParam("testID") String testID, @QueryParam("storyID") String storyID,
			@QueryParam("testName") String testName, @QueryParam("testDescription") String testDescription,
			@QueryParam("priority") String priority, @QueryParam("status") String status,
			@QueryParam("projectName") String projectName, @QueryParam("dashboardName") String dashboardName
			) throws JsonParseException,

			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		long pagecount = 0;

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("storyID", storyID);
			searchvalues.put("testID", testID);
			searchvalues.put("projectName", projectName);
			searchvalues.put("testName", testName);
			searchvalues.put("testDescription", testDescription);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {
				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}

			}
			pagecount = getMongoOperation().count(query1, UserStoryTestCasesVO.class);

			return pagecount;
	
	}

	// User Story Test Case Search
	/*
	 * Metric : lifecycle/User Stories/ User story Test Case Search Rest URL :
	 * rest/RallyServices/userStoryTestCaseSearch JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * searchableTestCase=function()
	 */
	@GET
	@Path("/userStoryTestCaseSearch")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryTestCasesVO> getUserStoryTestCaseSearch(@HeaderParam("Authorization") String authString,
			@QueryParam("testID") String testID, @QueryParam("storyID") String storyID,
			@QueryParam("testName") String testName, @QueryParam("testDescription") String testDescription,
			@QueryParam("priority") String priority, @QueryParam("status") String status,
			@QueryParam("projectName") String projectName, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<UserStoryTestCasesVO> searchresult = null;

		

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("storyID", storyID);
			searchvalues.put("testID", testID);
			searchvalues.put("projectName", projectName);
			searchvalues.put("testName", testName);
			searchvalues.put("testDescription", testDescription);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}

			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			searchresult = getMongoOperation().find(query1, UserStoryTestCasesVO.class);

			return searchresult;
	
	}

	/////////////////// for User Story Defect Search
	/////////////////// ////////////////////////////////////

	// User Story Defect Search
	/*
	 * Metric : lifecycle/User Stories/ User story Defect Search Rest URL :
	 * rest/RallyServices/userStoryDefectSearchpagecount JS File : WebContent JS
	 * File: UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * searchDefect=function()
	 */

	@GET
	@Path("/userStoryDefectSearchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryDefectSearchpagecount(@HeaderParam("Authorization") String authString,
			@QueryParam("defID") String defID, @QueryParam("storyID") String storyID,
			@QueryParam("defName") String defName, @QueryParam("defDescription") String defDescription,
			@QueryParam("defPrjName") String defPrjName, @QueryParam("dashboardName") String dashboardName) throws JsonParseException,

			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		long pagecount = 0;

			Map<String, String> searcDefecthvalues = new HashMap<String, String>();

			searcDefecthvalues.put("storyID", storyID);
			searcDefecthvalues.put("defID", defID);
			searcDefecthvalues.put("defPrjName", defPrjName);
			searcDefecthvalues.put("defName", defName);
			searcDefecthvalues.put("defDescription", defDescription);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searcDefecthvalues.entrySet()) {
				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}

			}

			pagecount = getMongoOperation().count(query1, UserStoryDefectsVO.class);
			return pagecount;
	}

	// User Story Defect Search
	/*
	 * Metric : lifecycle/User Stories/ User story Defect Search Rest URL :
	 * rest/RallyServices/userStoryDefectSearchpagecount JS File : WebContent JS
	 * File: UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * searchDefect=function()
	 */
	@GET
	@Path("/userStoryDefectSearch")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryDefectsVO> getUserStoryDefectSearch(@HeaderParam("Authorization") String authString,
			@QueryParam("defID") String defID, @QueryParam("storyID") String storyID,
			@QueryParam("defName") String defName, @QueryParam("defDescription") String defDescription,
			@QueryParam("defPrjName") String defPrjName, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<UserStoryDefectsVO> searchresult = null;

		

			Map<String, String> searchvalues1 = new HashMap<String, String>();

			searchvalues1.put("storyID", storyID);
			searchvalues1.put("defID", defID);
			searchvalues1.put("defPrjName", defPrjName);
			searchvalues1.put("defName", defName);
			searchvalues1.put("defDescription", defDescription);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues1.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}

			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			searchresult = getMongoOperation().find(query1, UserStoryDefectsVO.class);

			return searchresult;
	}

	/////////////////////////////////////////////////////////////////////////////////////

	//////////////////////////// for User Story Search
	//////////////////////////// /////////////////////////////////////////////////

	@GET
	@Path("/userStorySearchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStorysearchpagecount(@HeaderParam("Authorization") String authString,
			@QueryParam("storyID") String storyID, @QueryParam("storyName") String storyName,
			@QueryParam("userStrdescription") String userStrdescription, @QueryParam("storyOwner") String storyOwner,
			@QueryParam("projectName") String projectName, @QueryParam("dashboardName") String dashboardName) throws JsonParseException,

			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		long pagecount = 0;

		if ("".equals(storyOwner)) {
			storyOwner = "null";
		}


			Map<String, String> searchvalues = new HashMap<String, String>();
			userStrdescription = (userStrdescription == null) ? "null" : userStrdescription;
			searchvalues.put("storyID", storyID);
			searchvalues.put("storyName", storyName);
			searchvalues.put("userStrdescription", userStrdescription);
			searchvalues.put("storyOwner", storyOwner);
			searchvalues.put("projectName", projectName);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {
				if (!"undefined".equals(entry.getValue())) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}

			}

			pagecount = getMongoOperation().count(query1, UserStoriesVO.class);
			return pagecount;
	}

	@GET
	@Path("/searchUserStory")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoriesVO> getsearchUserStory(@HeaderParam("Authorization") String authString,
			@QueryParam("storyID") String storyID, @QueryParam("storyName") String storyName,
			@QueryParam("userStrdescription") String userStrdescription, @QueryParam("storyOwner") String storyOwner,
			@QueryParam("projectName") String projectName, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index, @QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<UserStoriesVO> searchresult = null;

		userStrdescription = (userStrdescription == null) ? "null" : userStrdescription;
		if ("".equals(storyOwner)) {
			storyOwner = "null";
		}


			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("storyID", storyID);
			searchvalues.put("storyName", storyName);
			searchvalues.put("userStrdescription", userStrdescription);
			searchvalues.put("storyOwner", storyOwner);
			searchvalues.put("projectName", projectName);

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!"undefined".equals(entry.getValue())) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}

			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			searchresult = getMongoOperation().find(query1, UserStoriesVO.class);

			return searchresult;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////

	// User Story Pie Chart on Load
	/*
	 * Metric : lifecycle/User Stories/ User story Project chart Rest URL :
	 * rest/RallyServices/userstorybyprjchartdata JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/ newTypeChart=function()
	 */

	@GET
	@Path("/userstorybyprjchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getdesigntype(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject
			) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
	
		List<UserStoryStatusVO> result = null;
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

			//System.out.println(">>>>>>>44444::: userstorybyprjchartdata 444444:::>>>>> " + userStrproject);

			Aggregation agg;
			if(operationalAccess){
			if (!"".equals(userStrproject) && !"undefined".equals(userStrproject)) {
				agg = newAggregation(match(Criteria.where("projectName").is(userStrproject)),
						group("projectName").count().as("typecount"),
						project("typecount").and("projectName").previousOperation());

				// agg = newAggregation(match(Criteria.where("projectName")
				// .is(userStrproject).and("iteration").is("Iteration 2 -
				// Streamline
				// Operations")),group("projectName").count().as("typecount"),
				// project("typecount").and("projectName").previousOperation());
				//

			} else {

				agg = newAggregation(group("projectName").count().as("typecount"),
						project("typecount").and("projectName").previousOperation());

			}

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);
			result = groupResults.getMappedResults();

			//System.out.println("result >>>>>44444:::" + result);

			return result;}
			else{
				return result;
			}
		
	}

	//////////////////////// Chart by User Story Status
	//////////////////////// ////////////////////////////////

	// User Story Status bar Chart on Load
	/*
	 * Metric : lifecycle/User Stories/ User story Status bar chart Rest URL :
	 * rest/RallyServices/userstorybystatuschartdata JS File : WebContent JS
	 * File: UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * userStoryByStatusPieChart=function()
	 */

	@GET
	@Path("/userstorybystatuschartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryStatusVO> getuserstorybystatuschartdata(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<UserStoryStatusVO> result = null;

			Aggregation agg;
			
			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			 boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
			 if(operationalAccess){
			if (!"".equals(userStrproject) && !"undefined".equals(userStrproject)) {

				agg = newAggregation(match(Criteria.where("projectName").is(userStrproject)),
						group("iteration").count().as("typecount"),
						project("typecount").and("iteration").previousOperation());

			} else {
				agg = newAggregation(group("iteration").count().as("typecount"),
						project("typecount").and("iteration").previousOperation());
			}

			AggregationResults<UserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg, UserStoriesVO.class,
					UserStoryStatusVO.class);
			result = groupResults.getMappedResults();

			return result;}
			 else{
				 return result; 
			 }

	}

	////////////////////////////////////////////////////////////////////////

	@GET
	@Path("/userStoryTestCaseTableDetails")
	// @Path("/reqTableDetailsdata")
	@Produces(MediaType.APPLICATION_JSON)
	// public List<RequirmentVO> getRecordsreq(
	public List<UserStoryTestCasesVO> getRecordsTestCases(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<UserStoryTestCasesVO> testCaseAnalysisList = null;

			String query = "{},{_id:0,storyID:1,testID:1}";
			Query query1 = new BasicQuery(query);
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			testCaseAnalysisList = getMongoOperation().find(query1, UserStoryTestCasesVO.class);

			return testCaseAnalysisList;
	}

	@GET
	@Path("/userStoryDefectTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryDefectsVO> getRecordsDefectDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<UserStoryDefectsVO> defAnalysisList = null;

			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			defAnalysisList = getMongoOperation().find(query1, UserStoryDefectsVO.class);

			return defAnalysisList;
	}

	@GET
	@Path("/searchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getsearchpagecount(@HeaderParam("Authorization") String authString,
			@QueryParam("storyID") String storyID, @QueryParam("storyName") String storyName,
			@QueryParam("Description") String Description, @QueryParam("storyOwner") String storyOwner,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long pagecount = 0;

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("storyName", storyName);
			searchvalues.put("Description", Description);
			searchvalues.put("storyName", storyName);

			String query = "{},{_id: 0, storyID: 1, storyName: 1, Description: 1, storyName: 1, storyCreationDate: 1,storyLastUpdateDate:1}";
			Query query1 = new BasicQuery(query);

			if (storyID != "") {
				query1.addCriteria(Criteria.where("storyID").is(storyID));
			}

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			pagecount = getMongoOperation().count(query1, UserStoriesVO.class);

			return pagecount;
	}

}
