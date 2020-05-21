package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.CyclesTrendVO;
import com.cts.metricsportal.vo.DefectChartVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DomainVO;
import com.cts.metricsportal.vo.JiraUserStoryStatusVO;
import com.cts.metricsportal.vo.JiraUserStoryVO;
import com.cts.metricsportal.vo.UserStoryDefectsStatusVO;
import com.cts.metricsportal.vo.UserStoryTrendVO;

@Path("/jiraMetricsServices")
public class JiraServices {

	JiraMetrics jirametrics = new JiraMetrics();

	@GET
	@Path("/versionsList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getVersionsList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<String> versionlist = null;
		versionlist = jirametrics.getVersionList(authString, dashboardName, domainName, projectName);
		return versionlist;

	}
	@GET
	@Path("/versionsListSel")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getVersionsListSel(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("dfromval") String dfromval,
			@QueryParam("dtoval") String dtoval ) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<String> versionlist = null;
		versionlist = jirametrics.getVersionListSel(authString, dashboardName, domainName, projectName, dfromval, dtoval);
		return versionlist;

	}

	@GET
	@Path("/totexecutioncount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotExecutionCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long versionlist = 0;
		try {
			versionlist = jirametrics.getTotExecutionCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return versionlist;

	}

	@GET
	@Path("/cycleList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getCycleList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<String> versionlist = null;
		versionlist = jirametrics.getCycleList(authString, dashboardName, domainName, projectName);
		return versionlist;

	}

	@GET
	@Path("/testsCreatedVsExecuted")
	@Produces(MediaType.APPLICATION_JSON)
	public HashMap<String, String> getTestsCreatedVsExecuted(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("selectedproject") String selectedproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		HashMap<String, String> testsCreatedVsExecuted = new HashMap<String, String>();
		testsCreatedVsExecuted = jirametrics.getTestsCreatedVsExecuted(authString, dashboardName, domainName,
				projectName, selectedproject);
		return testsCreatedVsExecuted;

	}

	@GET
	@Path("/bugsdetectedcountbyprojects")
	@Produces(MediaType.APPLICATION_JSON)
	public HashMap<String, String> getBugsdetectedcountbyprojects(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("selectedproject") String selectedproject,
			@QueryParam("vardtfrom") String vardtfrom, @QueryParam("vardtto") String vardtto)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		HashMap<String, String> testsCreatedVsExecuted = new HashMap<String, String>();
		try {
			testsCreatedVsExecuted = jirametrics.getBugsdetectedcountbyprojects(authString, dashboardName, domainName,
					projectName, selectedproject,vardtfrom,vardtto);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return testsCreatedVsExecuted;

	}

	@GET
	@Path("/testexecutioncount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTestexecutioncount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long testsCreatedVsExecuted = 0;
		testsCreatedVsExecuted = jirametrics.getTestExecutionCount(authString, dashboardName, domainName, projectName,
				vardtfrom, vardtto);
		return testsCreatedVsExecuted;

	}

	@GET
	@Path("/ratiooftestcasefails")
	@Produces(MediaType.APPLICATION_JSON)
	public HashMap<String, String> getRatioOfTestCaseFails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		HashMap<String, String> ratiooftestcasefails = new HashMap<String, String>();
		ratiooftestcasefails = jirametrics.getRatioOfTestCaseFails(authString, dashboardName, domainName, projectName,
				vardtfrom, vardtto);
		return ratiooftestcasefails;

	}

	@GET
	@Path("/exepassfailtrendchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CyclesTrendVO> getexepassfailtrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<CyclesTrendVO> passfailtrendchart = new ArrayList<CyclesTrendVO>();
		passfailtrendchart = jirametrics.getexepassfailtrendchart(authString, dashboardName, domainName, projectName,
				vardtfrom, vardtto);
		return passfailtrendchart;

	}

	@GET
	@Path("/createJiraOperationalDashboard")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getJiraOperationDashboard(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		jirametrics = new JiraMetrics();
		List<DomainVO> finalproject = jirametrics.getJiraOperationDashboard(authString);
		return finalproject;

	}

	// Project List - Drop Down
	@GET
	@Path("/projectlevellist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getProjectList(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		List<String> prolist = null;
		jirametrics = new JiraMetrics();
		prolist = jirametrics.getProjectList(authString, dashboardName, domainName, projectName);
		return prolist;
	}

	// Closed Defects count ba-panel

	@GET
	@Path("/defclosedcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDefClosedCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long defTestExecutionCount = 0;
		defTestExecutionCount = jirametrics.getDefClosedCount(authString, dashboardName, domainName, projectName,
				vardtfrom, vardtto);
		return defTestExecutionCount;
	}

	// Re-Opened Defect Count

	@GET
	@Path("/reopenCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getreopentCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long defreopenCount = 0;
		defreopenCount = jirametrics.getreopentCount(authString, dashboardName, domainName, projectName, vardtfrom,
				vardtto);
		return defreopenCount;
	}

	/* Defect Status Trend(Trend Graph) Starts Here */

	// Defect Status Trend - On Load
	/*
	 * Metric : Operational/Defect/ Defect Status Trend (Daily Status) Rest URL
	 * : rest/defectServices/ defecttrendchartdata JS File :
	 * WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js JS
	 * Function: defectsCtrl/ $scope.defectTrendChart
	 */

	@GET
	@Path("/passfailtrendchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectStatusVO> getpassfailtrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<DefectStatusVO> finalresult = new ArrayList<DefectStatusVO>();
		try {
			finalresult = jirametrics.getpassfailtrendchart(authString, dashboardName, domainName, projectName, vardtfrom,
					vardtto);
		} catch (ParseException e) {
			
			e.printStackTrace();
		}
		return finalresult;
	}

	// Defect Status chart (Bar & Pie)

	@GET
	@Path("/defectStatusChart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectStatusChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		try {
			finalresult = jirametrics.getdefectStatusChart(authString, dashboardName, domainName, projectName, vardtfrom,
					vardtto);
		} catch (ParseException e) {
			
			e.printStackTrace();
		}
		return finalresult;
	}

	// Defects Open Priority Donut chart

	@GET
	@Path("/defectsOpenStatusPriority")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectChartVO> getdefectsOpenStatusPriority(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();
		try {
			finalresult = jirametrics.getdefectsOpenStatusPriority(authString, dashboardName, domainName, projectName,
					vardtfrom, vardtto);
		} catch (ParseException e) {
			
			e.printStackTrace();
		}
		return finalresult;
	}

	/*
	 * *************************************************************************
	 * *****************JIRA UserStory starts
	 * Here*********************************************************************
	 * ***********************************
	 */

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
	public List<JiraUserStoryStatusVO> getUserStoryOwner(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryStatusVO> result = jirametrics.getUserStoryOwner(authString, dashboardName, domainName,
				userStrproject);

		return result;
	}

	// User Story Count
	/*
	 * Metric : lifecycle/User Stories/ User story count Rest URL :
	 * rest/RallyServices/userStoryCount : WebContent JS File: UserStoryCtrl.js
	 * JS Function: UserStoryCtrl/ initialUserStorycount=function()
	 */

	@GET
	@Path("/userStoryCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long totalUserStories = jirametrics.getUserStoryCount(authString, dashboardName, domainName, userStrproject);

		return totalUserStories;
	}

	@GET
	@Path("/userstorydefchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryDefectsStatusVO> getUserStoryDef(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String projectName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<UserStoryDefectsStatusVO> result = jirametrics.getUserStoryDef(authString, dashboardName, domainName,
				projectName);

		return result;
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
	public long getLifeUserStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long totalUserStories = jirametrics.getLifeUserStoryCount(authString, dashboardName, domainName,
				userStrproject);

		return totalUserStories;

	}

	@GET
	@Path("/lifeuserStorySprintCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryIterationCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long totalUserStoriesSprint = jirametrics.getUserStoryIterationCount(authString, dashboardName, domainName,
				userStrproject);

		return totalUserStoriesSprint;

	}

	@GET
	@Path("/initIterationUserStoryBackLogCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getinitIterationUserStoryBackLogCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long totalUserStoriesBacklog = jirametrics.getInitIterationUserStoryBackLogCount(authString, dashboardName,
				domainName, userStrproject);

		return totalUserStoriesBacklog;

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
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long totalUserStoryDefectCount = jirametrics.getUserStoryDefectCount(authString, dashboardName, domainName,
				userStrproject);

		return totalUserStoryDefectCount;

	}
	/*
	 * User Story Trend Graph
	 */

	@GET
	@Path("/userstorytrendchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserStoryTrendVO> getUserStoryTrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<UserStoryTrendVO> trendvolist = jirametrics.getUserStoryTrendChart(authString, dashboardName, domainName,
				userStrproject);

		return trendvolist;

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
	public List<JiraUserStoryStatusVO> getUserStorybyStatusChartData(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryStatusVO> result = jirametrics.getUserStorybyStatusChartData(authString, dashboardName,
				domainName, userStrproject);

		return result;
	}

	// User Story Pie Chart on Load
	/*
	 * Metric : lifecycle/User Stories/ User story Project chart Rest URL :
	 * rest/RallyServices/userstorybyprjchartdata JS File : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/ newTypeChart=function()
	 */

	@GET
	@Path("/userstorybyprjchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraUserStoryStatusVO> getDesignType(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryStatusVO> result = jirametrics.getDesignType(authString, dashboardName, domainName,
				userStrproject);

		return result;

	}

	///////////////// User Story Prority Funnel Chart///////////////////////

	@GET
	@Path("/userStorypriorityFunnelchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraUserStoryStatusVO> getUserStoryFunnelchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryStatusVO> result = jirametrics.getUserStoryFunnelchart(authString, dashboardName, domainName,
				userStrproject);

		return result;
	}

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
	public List<JiraUserStoryVO> getRecordsreq(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryVO> userStoryAnalysisList = jirametrics.getRecordsReq(authString, itemsPerPage, start_index,
				dashboardName, domainName, userStrproject);

		return userStoryAnalysisList;

	}

	//////////////////////////// for User Story Search
	//////////////////////////// /////////////////////////////////////////////////

	@GET
	@Path("/userStorySearchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStorySearchPageCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("storyID") String storyID,
			@QueryParam("storyName") String storyName, @QueryParam("userStrdescription") String userStrdescription,
			@QueryParam("storyOwner") String storyOwner) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		long pageCount = jirametrics.getUserStorySearchPageCount(authString, dashboardName, domainName, projectName,
				storyID, storyName, userStrdescription, storyOwner);

		return pageCount;
	}

	@GET
	@Path("/searchUserStory")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraUserStoryVO> getSearchUserStory(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("storyID") String storyID,
			@QueryParam("storyName") String storyName, @QueryParam("userStrdescription") String userStrdescription,
			@QueryParam("storyOwner") String storyOwner, @QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int startIndex) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		jirametrics = new JiraMetrics();
		List<JiraUserStoryVO> searchResult = jirametrics.getSearchUserStory(authString, dashboardName, domainName,
				projectName, storyID, storyName, userStrdescription, storyOwner, itemsPerPage, startIndex);

		return searchResult;
	}

	@GET
	@Path("/getOnLoaddate")
	@Produces(MediaType.APPLICATION_JSON)

	public List<Date> getOnLoaddate(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		jirametrics = new JiraMetrics();
		List<Date> finalDateResult = jirametrics.getOnLoaddate(authString, dashboardName, domainName, projectName);
		return finalDateResult;
	}
	
	@GET
	@Path("/getdefaultdate")
	@Produces(MediaType.APPLICATION_JSON)

	public List<Date> getdefaultdate(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		jirametrics = new JiraMetrics();
		List<Date> finalDateResult = jirametrics.getdefaultdate(authString, dashboardName, domainName, projectName);
		return finalDateResult;
	}
	
	@GET
	@Path("/getRollingPeriod")
	@Produces(MediaType.TEXT_PLAIN)

	public String getRollingPeriod(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		jirametrics = new JiraMetrics();
		String rollingPeriod = jirametrics.getRollingPeriod(authString, dashboardName, domainName, projectName);
		return rollingPeriod;
	}

}