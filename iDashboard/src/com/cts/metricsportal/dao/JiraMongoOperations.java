/**
 * Cognizant Technology Solutions
 *
 */
package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.BugsVO;
import com.cts.metricsportal.vo.CustomTemplateVO;
import com.cts.metricsportal.vo.CyclesTrendVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.JiraTestCaseVO;
import com.cts.metricsportal.vo.JiraTestExecutionVO;
import com.cts.metricsportal.vo.JiraUserStoryStatusVO;
import com.cts.metricsportal.vo.JiraUserStoryVO;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.OperationalDashboardsCyclesVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.cts.metricsportal.vo.UserStoryDefectsStatusVO;
import com.cts.metricsportal.vo.UserStoryDefectsVO;
import com.cts.metricsportal.vo.UserVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;

public class JiraMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(JiraMongoOperations.class);

	public static String isDashboardsetpublic(String dashboardName) {
		String owner = "";
		boolean ispublic = false;
		try {

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			List<OperationalDashboardVO> dashboardinfo = getMongoOperation().find(query1, OperationalDashboardVO.class);
			ispublic = dashboardinfo.get(0).isIspublic();
			if (ispublic) {
				owner = dashboardinfo.get(0).getOwner();
			}

		} catch (Exception Ex) {

		}
		return owner;
	}

	public static List<UserVO> getAllInfoList(String userId) {

		logger.info("Fetching Jira Operations Result..");
		logger.info("Fetching Jira Info List..");

		Query allinfo = new Query();
		allinfo.addCriteria(Criteria.where("userId").is(userId));
		List<UserVO> allinfolist = new ArrayList<UserVO>();
		try {
			allinfolist = getMongoOperation().find(allinfo, UserVO.class);
		} catch (Exception ex) {
			logger.error("Failed to fetch Jira info list " + ex.getMessage());
		} finally {
		}
		return allinfolist;
	}

	@SuppressWarnings("unchecked")
	public static List<String> getReleaseList(int i, int j, List<String> domain, List<String> projectlist) {
		logger.info("Fetching Release list..");
		List<String> release = new ArrayList<String>();

		Query query1 = new Query();
		query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
		query1.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
		try {
			release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
		} catch (Exception ex) {
			logger.error("Failed to fetch release list" + ex.getMessage());
		} finally {
		}
		return release;
	}

	public static List<LevelItemsVO> getlevelIdList(int i, int j, int k, List<String> domain, List<String> projectlist,
			List<String> release) {
		logger.info("Fetching Jira levelId Result..");
		List<LevelItemsVO> levelIdList = new ArrayList<LevelItemsVO>();

		Query query2 = new Query();
		query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
		query2.addCriteria(Criteria.where("level2").is(projectlist.get(j)));
		query2.addCriteria(Criteria.where("level3").is(release.get(k)));
		try {
			levelIdList = getMongoOperation().find(query2, LevelItemsVO.class);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}
		return levelIdList;
	}

	public static List<JiraDefectVO> getProjectList(List<String> levelIdList) {
		logger.info("Fetching project..");
		List<JiraDefectVO> idlist = null;
		Query projectquery = new Query();
		projectquery.addCriteria(Criteria.where("_id").in(levelIdList));
		try {
			idlist = getMongoOperation().find(projectquery, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch project list " + e.getMessage());
		}
		return idlist;
	}

	public static List<String> getVersionList(List<String> levelIdList) {
		logger.info("Fetching version..");
		List<String> versionlist = new ArrayList<String>();
		List<String> finalversionlist = new ArrayList<String>();
		List<JiraTestExecutionVO> cycleDetails = new ArrayList<JiraTestExecutionVO>();

		Query versionquery = new Query();
		versionquery.addCriteria(Criteria.where("_id").in(levelIdList));
		try {
			cycleDetails = getMongoOperation().find(versionquery, JiraTestExecutionVO.class);
			for (int i = 0; i < cycleDetails.size(); i++) {
				versionlist.add(cycleDetails.get(i).getVersionName());
			}
			Set<String> versionSet = new HashSet<String>(versionlist);
			finalversionlist = new ArrayList<String>(versionSet);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch version list " + e.getMessage());
		}
		return finalversionlist;
	}

	public static long getTotExecutionCount(List<String> levelIdList, Date startDate, Date endDate) {
		logger.info("Fetching version..");
		long totExeCount = 0;
		List<JiraTestExecutionVO> cycleDetails = new ArrayList<JiraTestExecutionVO>();

		Query versionquery = new Query();
		versionquery.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			versionquery.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));
		}
		try {
			cycleDetails = getMongoOperation().find(versionquery, JiraTestExecutionVO.class);
			totExeCount = cycleDetails.size();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch version list " + e.getMessage());
		}
		return totExeCount;
	}

	public static HashMap<String, String> getTestsCreatedVsExecuted(List<String> levelIdList, String selectedproject,
			String userId) {
		logger.info("Fetching Tests created VS Executed..");
		HashMap<String, String> mTestsCount = new HashMap<String, String>();
		long defTestsCreatedCount = 0;
		long defTestsExecutedCount = 0;

		String query = "{},{_id:0,levelId:1}";

		Query createdQuery = new Query();
		Query zephyrQuery = new Query();
		Query qMetryQuery = new Query();

		createdQuery.addCriteria(Criteria.where("_id").in(levelIdList));
		zephyrQuery.addCriteria(Criteria.where("_id").in(levelIdList));
		qMetryQuery.addCriteria(Criteria.where("_id").in(levelIdList));

		List<String> issueTypeList = new ArrayList<String>();
		issueTypeList.add("Test");

		createdQuery.addCriteria(Criteria.where("issueType").in(issueTypeList));

		List<JiraTestCaseVO> TestCaseslist = new ArrayList<JiraTestCaseVO>();
		List<String> tcIssueList = new ArrayList<String>();
		try {
			TestCaseslist = getMongoOperation().find(createdQuery, JiraTestCaseVO.class);
			for (int i = 0; i < TestCaseslist.size(); i++) {
				tcIssueList.add(TestCaseslist.get(i).getIssueKey());
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
		defTestsCreatedCount = tcIssueList.size();
		mTestsCount.put("Created", "" + defTestsCreatedCount);

		return mTestsCount;

	}

	public static HashMap<String, String> getBugsdetectedcountbyprojects(List<String> levelIdList,
			String selectedproject, String userId, Date startDate, Date endDate) {
		logger.info("Fetching Bugs detected..");
		HashMap<String, String> mBugsCount = new HashMap<String, String>();
		long defBugsDetectedCount = 0;

		String query = "{},{_id:0,levelId:1}";

		Query comQuery = new BasicQuery(query);
		comQuery.addCriteria(Criteria.where("_id").in(levelIdList));

		if (startDate != null || endDate != null) {
			comQuery.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			comQuery.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
		}

		List<JiraTestCaseVO> TestCaseslist = new ArrayList<JiraTestCaseVO>();

		try {
			TestCaseslist = getMongoOperation().find(comQuery, JiraTestCaseVO.class);
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
		for (int i = 0; i < TestCaseslist.size(); i++) {
			defBugsDetectedCount = defBugsDetectedCount + TestCaseslist.get(i).getLinkedBugs().size();
		}

		mBugsCount.put("Total", "" + defBugsDetectedCount);

		return mBugsCount;

	}

	public static long getTestExecutionCount(List<String> levelIdList, String userId, String vardtfrom,
			String vardtto) {
		logger.info("Fetching Test Execution Count..");
		long testExecutionCount = 0;
		String query = "{},{_id:0,levelId:1}";
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		
		Date startDate=null, endDate=null;
		try {
			startDate = formatter.parse(vardtfrom);
			
			 endDate = formatter.parse(vardtto);
		} catch (ParseException e1) {
			
			e1.printStackTrace();
		}
		

		Query zephyrQuery = new BasicQuery(query);

		List<String> issueZephyrStatusList = new ArrayList<String>();
		issueZephyrStatusList.add("PASS");
		issueZephyrStatusList.add("FAIL");
		//issueZephyrStatusList.add("WIP");
		//issueZephyrStatusList.add("BLOCKED");

		zephyrQuery.addCriteria(Criteria.where("issueStatus").in(issueZephyrStatusList));
		zephyrQuery.addCriteria(Criteria.where("_id").in(levelIdList));
		zephyrQuery.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));

		List<JiraTestExecutionVO> TestExelist = new ArrayList<JiraTestExecutionVO>();

		try {
			TestExelist = getMongoOperation().find(zephyrQuery, JiraTestExecutionVO.class);
			testExecutionCount = TestExelist.size();
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

		return testExecutionCount;

	}

	public static HashMap<String, String> getRatioOfTestCaseFails(String dashboardName, List<String> levelIdList,
			String userId, String vardtfrom, String vardtto) {

		logger.info("Fetching Ratio of Test Case Fails..");

		HashMap<String, String> mTCFailsCount = new HashMap<String, String>();
		Date startDate = new Date(vardtfrom);
		Date endDate = new Date(vardtto);

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));

		List<String> verlist = new ArrayList<String>();
		try {
			verlist = getMongoOperation().getCollection("operationalDashboards").distinct("versions.versionName",
					filterQuery.getQueryObject());
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

		List<String> cyclelist = new ArrayList<String>();
		try {
			cyclelist = getMongoOperation().getCollection("operationalDashboards").distinct("cycles.cycleName",
					filterQuery.getQueryObject());
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

		String query = "{},{_id:0,levelId:1}";

		// Zephyr-Side

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));

		query1.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));

		query1.addCriteria(Criteria.where("issueStatus").is("FAIL"));

		if (verlist.size() > 0) {
			query1.addCriteria(Criteria.where("versionName").in(verlist));
		}
		if (cyclelist.size() > 0) {
			query1.addCriteria(Criteria.where("cycleName").in(cyclelist));
		}

		List<JiraTestExecutionVO> TestExelist = new ArrayList<JiraTestExecutionVO>();
		List<Integer> issueIdList = new ArrayList<Integer>();

		try {
			TestExelist = getMongoOperation().find(query1, JiraTestExecutionVO.class);
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

		for (int i = 0; i < TestExelist.size(); i++) {
			issueIdList.add(TestExelist.get(i).getIssueID());
		}

		Set<Integer> uniqueIssueId = new HashSet<Integer>(issueIdList);

		long zIssueIDFailedlistCnt = uniqueIssueId.size();

		List<BugsVO> zBugIDArray = new ArrayList<BugsVO>();

		for (int i = 0; i < TestExelist.size(); i++) {
			zBugIDArray.addAll(TestExelist.get(i).getBugs());
		}

		Set<BugsVO> zBugIDSet = new HashSet<BugsVO>(zBugIDArray);
		List<BugsVO> zBugIDlist = new ArrayList<BugsVO>(zBugIDSet);

		long zOpenBugs = 0;
		long zClosedBugs = 0;

		for (int i = 0; i < zBugIDlist.size(); i++) {
			if (zBugIDlist.get(i).getBugStatus().equalsIgnoreCase("Closed")) {
				zClosedBugs++;
			} else {
				zOpenBugs++;
			}
		}

		// QMetry-Side

		long totalIssueIDFailedlistCnt = zIssueIDFailedlistCnt;
		long totalOpenBugs = zOpenBugs;
		long totalClosedBugs = zClosedBugs;

		double OpenRatio = 0.0;
		double ClosedRatio = 0.0;

		if (totalIssueIDFailedlistCnt != 0) {
			if (zOpenBugs != 0) {
				OpenRatio = totalIssueIDFailedlistCnt / totalOpenBugs;
			}
			if (zClosedBugs != 0) {
				ClosedRatio = totalIssueIDFailedlistCnt / totalClosedBugs;
			}
		}

		mTCFailsCount.put("Open", "" + OpenRatio);
		mTCFailsCount.put("Closed", "" + ClosedRatio);//

		return mTCFailsCount;

	}

	public static List<CyclesTrendVO> getexepassfailtrendchart(String dashboardName, List<String> levelIdList,
			String userId, String vardtfrom, String vardtto) {

		logger.info("Fetching Ratio of Test Case Fails..");

		List<CyclesTrendVO> testsPassedVsFailed = new ArrayList<CyclesTrendVO>();

		long diff = 0;
		long noOfDays = 0;

		Date startDate = new Date(vardtfrom);
		Date endDate = new Date(vardtto);

		diff = endDate.getTime() - startDate.getTime();
		noOfDays = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));

		List<String> verlist = new ArrayList<String>();
		try {
			verlist = getMongoOperation().getCollection("operationalDashboards").distinct("versions.versionName",
					filterQuery.getQueryObject());
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

		List<String> cyclelist = new ArrayList<String>();
		try {
			cyclelist = getMongoOperation().getCollection("operationalDashboards").distinct("cycles.cycleName",
					filterQuery.getQueryObject());
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

		String query = "{},{_id:0,levelId:1}";

		// Zephyr Side

		Query queryZepPass = new BasicQuery(query);
		queryZepPass.addCriteria(Criteria.where("_id").in(levelIdList));
		Query queryZepFail = new BasicQuery(query);
		queryZepFail.addCriteria(Criteria.where("_id").in(levelIdList));
		Query queryZepWIP = new BasicQuery(query);
		queryZepWIP.addCriteria(Criteria.where("_id").in(levelIdList));
		Query queryZepBlocked = new BasicQuery(query);
		queryZepBlocked.addCriteria(Criteria.where("_id").in(levelIdList));

		queryZepPass.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));
		queryZepFail.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));
		queryZepWIP.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));
		queryZepBlocked.addCriteria(Criteria.where("executedOn").gte(startDate).lte(endDate));

		if (verlist.size() > 0) {
			queryZepPass.addCriteria(Criteria.where("versionName").in(verlist));
			queryZepFail.addCriteria(Criteria.where("versionName").in(verlist));
			queryZepWIP.addCriteria(Criteria.where("versionName").in(verlist));
			queryZepBlocked.addCriteria(Criteria.where("versionName").in(verlist));
		}
		if (cyclelist.size() > 0) {
			queryZepPass.addCriteria(Criteria.where("cycleName").in(cyclelist));
			queryZepFail.addCriteria(Criteria.where("cycleName").in(cyclelist));
			queryZepWIP.addCriteria(Criteria.where("cycleName").in(cyclelist));
			queryZepBlocked.addCriteria(Criteria.where("cycleName").in(cyclelist));
		}

		queryZepPass.addCriteria(Criteria.where("issueStatus").is("PASS"));
		queryZepFail.addCriteria(Criteria.where("issueStatus").is("FAIL"));
		queryZepWIP.addCriteria(Criteria.where("issueStatus").is("WIP"));
		queryZepBlocked.addCriteria(Criteria.where("issueStatus").is("BLOCKED"));

		List<JiraTestExecutionVO> zPassedList = new ArrayList<JiraTestExecutionVO>();
		try {
			zPassedList = getMongoOperation().find(queryZepPass, JiraTestExecutionVO.class);
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

		List<JiraTestExecutionVO> zFailedList = new ArrayList<JiraTestExecutionVO>();
		try {
			zFailedList = getMongoOperation().find(queryZepFail, JiraTestExecutionVO.class);
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

		List<JiraTestExecutionVO> zWIPList = new ArrayList<JiraTestExecutionVO>();
		try {
			zWIPList = getMongoOperation().find(queryZepWIP, JiraTestExecutionVO.class);
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

		List<JiraTestExecutionVO> zBlockedList = new ArrayList<JiraTestExecutionVO>();
		try {
			zBlockedList = getMongoOperation().find(queryZepBlocked, JiraTestExecutionVO.class);
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

		// qMetry Side

		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);

		for (int i = 1; i <= noOfDays; i++) {

			Date dtDateFrom = cal.getTime();
			cal.add(Calendar.DATE, 1);
			Date dtDateTo = cal.getTime();

			CyclesTrendVO testPassFailed = new CyclesTrendVO();
			int PassedCount = 0;
			int FailedCount = 0;
			int WIPCount = 0;
			int BlockedCount = 0;

			for (int j = 0; j < zPassedList.size(); j++) {
				if (zPassedList.get(j).getExecutedOn().after(dtDateFrom)
						&& zPassedList.get(j).getExecutedOn().before(dtDateTo)) {
					PassedCount++;
				}
			}

			for (int j = 0; j < zFailedList.size(); j++) {
				if (zFailedList.get(j).getExecutedOn().after(dtDateFrom)
						&& zFailedList.get(j).getExecutedOn().before(dtDateTo)) {
					FailedCount++;
				}
			}

			for (int j = 0; j < zWIPList.size(); j++) {
				if (zWIPList.get(j).getExecutedOn().after(dtDateFrom)
						&& zWIPList.get(j).getExecutedOn().before(dtDateTo)) {
					WIPCount++;
				}

			}

			for (int j = 0; j < zBlockedList.size(); j++) {
				if (zBlockedList.get(j).getExecutedOn().after(dtDateFrom)
						&& zBlockedList.get(j).getExecutedOn().before(dtDateTo)) {
					BlockedCount++;
				}
			}

			testPassFailed.setPassStatus(PassedCount);
			testPassFailed.setFailStatus(FailedCount);
			testPassFailed.setWipStatus(WIPCount);
			testPassFailed.setBlockedStatus(BlockedCount);

			testPassFailed.setIsodate(dtDateFrom);

			testsPassedVsFailed.add(testPassFailed);
		}

		return testsPassedVsFailed;
	}

	public static List<String> getCycleList(List<String> levelIdList, String dashboardName, String userId) {
		logger.info("Fetching cycle..");
		List<String> verlist = new ArrayList<String>();
		List<String> cyclelist = new ArrayList<String>();
		List<String> finalcyclelist = new ArrayList<String>();
		List<JiraTestExecutionVO> cycleDetails = new ArrayList<JiraTestExecutionVO>();

		Query versionquery = new Query();
		versionquery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		versionquery.addCriteria(Criteria.where("owner").is(userId));
		try {
			verlist = getMongoOperation().getCollection("operationalDashboards").distinct("versions.versionName",
					versionquery.getQueryObject());
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BaseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		Query cyclequery = new Query();
		try {
			if (verlist.size() > 0) {
				cyclequery.addCriteria(Criteria.where("versionName").in(verlist));
				cyclequery.addCriteria(Criteria.where("_id").in(levelIdList));
			}

			cycleDetails = getMongoOperation().find(cyclequery, JiraTestExecutionVO.class);
			for (int i = 0; i < cycleDetails.size(); i++) {
				cyclelist.add(cycleDetails.get(i).getCycleName());
			}
			Set<String> cycleSet = new HashSet<String>(cyclelist);
			finalcyclelist = new ArrayList<String>(cycleSet);
			int count = 0;
			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			String listCycleString = "[";

			for (int i = 0; i < finalcyclelist.size(); i++) {
				listCycleString = listCycleString + "{\"" + "cycleName\"" + ":\"" + (finalcyclelist.get(i)) + "\"}";
				if (i != finalcyclelist.size() - 1) {
					listCycleString = listCycleString + ",";
				}
			}

			listCycleString = listCycleString + "]";

			JsonParser jsonParser = null;
			try {
				jsonParser = jf.createJsonParser(listCycleString);
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			List<OperationalDashboardsCyclesVO> listCycles = null;
			TypeReference<List<OperationalDashboardsCyclesVO>> tRef = new TypeReference<List<OperationalDashboardsCyclesVO>>() {
			};

			try {
				listCycles = mapper.readValue(jsonParser, tRef);
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

			dashvo1.setDashboardName(dashboardName);
			dashvo1.setOwner(userId);
			dashvo1.setCycles(listCycles);

			Query query = new Query();

			query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			query.addCriteria(Criteria.where("owner").is(userId));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("owner", userId);
			update.set("cycles", listCycles);

			List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

			for (OperationalDashboardVO vo : dashvoInfo) {
				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = count + 1;

				}
			}
			if (count == 1) {
				getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
			}

			Collections.sort(finalcyclelist);
			return finalcyclelist;
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch cycle list " + e.getMessage());
		}
		return finalcyclelist;
	}

	/**
	 * the levelIdList is matched with current collection and corresponding
	 * '_id' is returned
	 * 
	 * @param dashboardName
	 * @param owner
	 * @param domainName
	 * @param projectName
	 * 
	 * @return levellist
	 */
	public static List<String> getJiraGlobalLevelIdUserStoryQuery(String dashboardName, String owner, String domainName,
			String projectName) {
		logger.info("Fetching Global LevelId Jira UserStory..");
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<JiraUserStoryVO> reqList = new ArrayList<JiraUserStoryVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("issueID").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("issueID", "$issueID").append("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "JiraUserStory", JiraUserStoryVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch Global LevelId" + e.getMessage());
		}

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;
	}

	public static List<String> getJiraGlobalLevelIdUserStoryDefQuery(String dashboardName, String owner,
			String domainName, String projectName) {
		logger.info("Fetching Global LevelId Jira UserStoryDefect..");
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<UserStoryDefectsVO> reqList = new ArrayList<UserStoryDefectsVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("defectId").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("defectId", "$defectId").append("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "JiraUserstorydefects", UserStoryDefectsVO.class)
					.getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Fialed to fetch Jira Global LevelId UserStoryDefect " + e.getMessage());
		}

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;
	}

	public static List<String> getJiraGlobalLevelIdRequirementsQuery(List<Integer> levelIdList) {
		List<JiraRequirmentVO> reqList = new ArrayList<JiraRequirmentVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(
				Fields.fields("issueID", "issueSprintStartDate", "issueSprintEndDate").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("issueID", "$issueID").append("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "JiraRequirements", JiraRequirmentVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;
	}

	public static List<String> getJiraGlobalLevelIdDesignQuery(List<Integer> levelIdList) {
		logger.info("Fetching Global LevelId Jira UserStory Design..");
		List<TestCaseVO> reqList = new ArrayList<TestCaseVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(
				Fields.fields("issueID", "issueSprintStartDate", "issueSprintEndDate").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("issueID", "$issueID").append("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "JiraTestCases", TestCaseVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch Global LevelId Jira UserStory Design" + e.getMessage());
		}

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}

		return levellist;

	}

	public static List<String> getJiraGlobalLevelIdsDefectsQuery(List<Integer> levelIdList) {
		logger.info("Fetching Global LevelId Jira Defects..");
		List<JiraDefectVO> reqList = new ArrayList<JiraDefectVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(
				Fields.fields("issueID", "issueSprintStartDate", "issueSprintEndDate").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("issueID", "$issueID").append("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "JiraDefects", JiraDefectVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch Global LevelId Jira Defects" + e.getMessage());
		}

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;

	}

	public static List<String> getJiraGlobalLevelIdsExecutionQuery(List<Integer> levelIdList) {
		logger.info("Fetching Global LevelId Jira Defects..");
		List<JiraTestExecutionVO> exeList = new ArrayList<JiraTestExecutionVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(
				Fields.fields("issueKey", "issueSprintStartDate", "issueSprintEndDate").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("issueKey", "$issueKey").append("_id", "$_id")).as("duplication"));

		try {
			exeList = getMongoOperation().aggregate(agg, "JiraCycles", JiraTestExecutionVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch Global LevelId Jira Defects" + e.getMessage());
		}

		if (exeList.size() != 0) {
			for (int i = 0; i < exeList.size(); i++) {
				levellist.add(exeList.get(i).getDuplication().get(0).get_id());
			}
		}
		return levellist;

	}

	public static long getDefClosedCountQuery(String authString, String userId, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, List<String> levelIdList) {
		logger.info("Fetching defect closed count..");
		long defTestExecutionCount = 0;
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		
		Date startDate=null, endDate=null;
		try {
			startDate = formatter.parse(vardtfrom);
			
			 endDate = formatter.parse(vardtto);
		} catch (ParseException e1) {
			
			e1.printStackTrace();
		}
		
		List<String> prolist = new ArrayList<String>();
		prolist = getprolistQuery(dashboardName, userId);

		List<String> sprintlist = new ArrayList<String>();
		sprintlist = getsprintlistQuery(dashboardName, userId);

		List<String> epiclist = new ArrayList<String>();
		epiclist = getepiclistQuery(dashboardName, userId);

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
		query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

		query1.addCriteria(Criteria.where("issueStatus").is("Closed"));

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
		if (epiclist.size() > 0) {
			query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
		}

		try {
			defTestExecutionCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			
			logger.error("Failed to fetch defect closed count" + e.getMessage());
		}

		return defTestExecutionCount;
	}

	public static long getreopenCountQuery(String authString, String userId, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, List<String> levelIdList) {
		logger.info("Fetching defect Open count..");
		long defreopenCount = 0;
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		
		Date startDate=null, endDate=null;
		try {
			startDate = formatter.parse(vardtfrom);
			
			 endDate = formatter.parse(vardtto);
		} catch (ParseException e1) {
			
			e1.printStackTrace();
		}
		
		List<String> prolist = new ArrayList<String>();
		prolist = getprolistQuery(dashboardName, userId);

		List<String> sprintlist = new ArrayList<String>();
		sprintlist = getsprintlistQuery(dashboardName, userId);

		List<String> epiclist = new ArrayList<String>();
		epiclist = getepiclistQuery(dashboardName, userId);

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
		query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));

		query1.addCriteria(Criteria.where("issueStatus").is("Revalidate"));

		if (prolist.size() > 0) {
			query1.addCriteria(Criteria.where("prjName").in(prolist));
		}
		if (sprintlist.size() > 0) {
			query1.addCriteria(Criteria.where("issueSprint").in(sprintlist));
		}
		if (epiclist.size() > 0) {
			query1.addCriteria(Criteria.where("issueEpic").in(epiclist));
		}

		try {
			defreopenCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch defect open count " + e.getMessage());
		}
		return defreopenCount;
	}

	public static List<String> getprolistQuery(String dashboardName, String userId) {

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));
		List<String> prolist = new ArrayList<String>();
		try {
			prolist = getMongoOperation().getCollection("operationalDashboards").distinct("projects.prjName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		return prolist;
	}

	public static List<String> getsprintlistQuery(String dashboardName, String userId) {
		logger.info("Fetching Sprint list..");
		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));
		List<String> sprintlist = new ArrayList<String>();
		try {
			sprintlist = getMongoOperation().getCollection("operationalDashboards").distinct("sprints.sprintName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch sprint list " + e.getMessage());
		}

		return sprintlist;
	}

	public static List<String> getepiclistQuery(String dashboardName, String userId) {
		logger.info("Fetching epic list..");
		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(userId));
		List<String> epiclist = new ArrayList<String>();
		try {
			epiclist = getMongoOperation().getCollection("operationalDashboards").distinct("epics.epicName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch epic list " + e.getMessage());
		}
		return epiclist;
	}

	public static List<JiraDefectVO> getclosedListQuery(List<String> prolist, List<String> sprintlist,
			List<String> epiclist, List<String> levelIdList, Date startDate, Date endDate) {

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

		query1.addCriteria(Criteria.where("issueStatus").is("Closed"));

		List<JiraDefectVO> closedList = new ArrayList<JiraDefectVO>();
		try {
			closedList = getMongoOperation().find(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return closedList;

	}

	public static List<JiraDefectVO> getopenedListQuery(List<String> prolist, List<String> sprintlist,
			List<String> epiclist, List<String> levelIdList, Date startDate, Date endDate) {
		logger.info("Fetching opened list..");
		String query = "{},{_id:0,levelId:1}";

		Query query2 = new BasicQuery(query);

		query2.addCriteria(Criteria.where("_id").in(levelIdList));
		query2.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
		query2.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
		if (prolist.size() > 0) {
			query2.addCriteria(Criteria.where("prjName").in(prolist));
		}
		if (sprintlist.size() > 0) {
			query2.addCriteria(Criteria.where("issueSprint").in(sprintlist));
		}
		if (epiclist.size() > 0) {
			query2.addCriteria(Criteria.where("issueEpic").in(epiclist));
		}

		query2.addCriteria(Criteria.where("issueStatus").ne("Closed"));

		List<JiraDefectVO> openedList = new ArrayList<JiraDefectVO>();
		try {
			openedList = getMongoOperation().find(query2, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		return openedList;
	}

	public static List<JiraDefectVO> getReqListQuery(List<String> levelIdList) {

		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));

		List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();

		try {
			reqlist = getMongoOperation().find(query, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return reqlist;
	}

	public static List<JiraDefectVO> getDefectPriorityQuery(List<String> prolist, List<String> sprintlist,
			List<String> epiclist, List<String> levelIdList, Date startDate, Date endDate) {
		logger.info("Fetching defect priority..");
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

		List<JiraDefectVO> defectPriority = new ArrayList<JiraDefectVO>();
		try {
			defectPriority = getMongoOperation().find(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch defect priority " + e.getMessage());
		}
		return defectPriority;
	}

	public static List<JiraDefectVO> getdefectsOpenStatusPriorityQuery(List<String> prolist, List<String> sprintlist,
			List<String> epiclist, List<String> levelIdList, Date startDate, Date endDate) {
		List<JiraDefectVO> defectPriority = new ArrayList<JiraDefectVO>();
		Query query1 = new Query();
		logger.info("Fetching defect open status priority..");
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

		try {
			defectPriority = getMongoOperation().find(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch open status priority " + e.getMessage());
		}
		return defectPriority;
	}

	public static List<JiraUserStoryStatusVO> getUserStoryOwner(List<String> levelIdList) {
		logger.info("Fetching user story owner chart..");
		Aggregation agg;
		List<JiraUserStoryStatusVO> result = new ArrayList<JiraUserStoryStatusVO>();
		try {

			if (!"".equals(levelIdList) && !"undefined".equals(levelIdList)) {
				agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
						group("storyOwner").count().as("ownercount"),
						project("ownercount").and("storyOwner").previousOperation());
			} else {
				agg = newAggregation(group("storyOwner").count().as("ownercount"),
						project("ownercount").and("storyOwner").previousOperation());
			}

			AggregationResults<JiraUserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);

			result = groupResults.getMappedResults();

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("failed to fetch user story owner chart " + e.getMessage());
		}
		return result;

	}

	public static long getUserStoryCount(List<String> levelIdList) {
		logger.info("Fetching total user story count ..");
		long totalUserStories = 0;
		try {
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			totalUserStories = getMongoOperation().count(query1, JiraUserStoryVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return totalUserStories;
	}

	public static List<UserStoryDefectsStatusVO> getUserStoryDef(List<String> levelIdList) {
		logger.info("Fetching  user story defect chart..");
		List<UserStoryDefectsStatusVO> result = new ArrayList<UserStoryDefectsStatusVO>();
		try {
			Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
					group("storyID").count().as("typecount"), project("typecount").and("storyID").previousOperation());

			AggregationResults<UserStoryDefectsStatusVO> groupResults = getMongoOperation().aggregate(agg,
					UserStoryDefectsVO.class, UserStoryDefectsStatusVO.class);

			result = groupResults.getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story defect chart " + e.getMessage());
		}
		return result;
	}

	public static long getLifeUserStoryCount(List<String> levelIdList) {
		logger.info("Fetching user story count..");
		long totalUserStories = 0;
		try {
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);

			if (!"undefined".equals(levelIdList)) {
				Criteria criteria1 = new Criteria();
				criteria1.andOperator(Criteria.where("_id").in(levelIdList));
				query1.addCriteria(criteria1);
				totalUserStories = getMongoOperation().count(query1, JiraUserStoryVO.class);
			}

			else {
				totalUserStories = getMongoOperation().count(query1, JiraUserStoryVO.class);
			}

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story count " + e.getMessage());
		}
		return totalUserStories;
	}

	public static long getUserStoryIterationCount(List<Integer> levelIdList) {
		logger.info("Fetching user story iterations..");
		long totalUserStoriesIterations = 0;
		try {

			// String query = "{},{_id:0}";
			Query query1 = new Query();

			if (!IdashboardConstantsUtil.UNDEFINED.equals(levelIdList)) {
				query1.addCriteria(Criteria.where("levelId").in(levelIdList));
				totalUserStoriesIterations = getMongoOperation().count(query1, UserStoriesIterationVO.class);
			}

			else {
				totalUserStoriesIterations = getMongoOperation().count(query1, UserStoriesIterationVO.class);
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return totalUserStoriesIterations;
	}

	public static long getInitIterationUserStoryBackLogCount(Map<String, String> searchvalues) {
		logger.info("Fetching user story backlog count..");
		long totalUserStoriesBacklog = 0;
		try {
			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {
				if (!entry.getValue().equals(IdashboardConstantsUtil.UNDEFINED)) {
					if (!entry.getValue().equals(IdashboardConstantsUtil.NULL)) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}

			totalUserStoriesBacklog = getMongoOperation().count(query1, JiraUserStoryVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story backlog count " + e.getMessage());
		}
		return totalUserStoriesBacklog;
	}

	public static long getUserStoryDefectCount(List<String> levelIdList) {
		logger.info("Fetching defects asscoiated with user story  ..");
		long totalUserStoryDefectCount = 0;
		try {

			Query query1 = new Query();
			if (!IdashboardConstantsUtil.UNDEFINED.equals(levelIdList)) {
				query1.addCriteria(Criteria.where("_id").in(levelIdList));
				totalUserStoryDefectCount = getMongoOperation().count(query1, UserStoryDefectsVO.class);
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story defect count " + e.getMessage());
		}
		return totalUserStoryDefectCount;
	}

	public static List<JiraUserStoryStatusVO> getUserStoryTrendChart(List<String> levelIdList) {
		logger.info("Fetching user story trend chart  ..");
		List<JiraUserStoryStatusVO> result = new ArrayList<JiraUserStoryStatusVO>();
		try {
			Aggregation agg;
			if (!IdashboardConstantsUtil.EMPTY.equals(levelIdList)
					&& !IdashboardConstantsUtil.UNDEFINED.equals(levelIdList)) {
				agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
						group("storyCreationDate").count().as("count"),
						project("count").and("storyCreationDate").previousOperation(),
						sort(Direction.ASC, "storyCreationDate"));
			} else {
				agg = newAggregation(group("storyCreationDate").count().as("count"),
						project("count").and("storyCreationDate").previousOperation(),
						sort(Direction.ASC, "storyCreationDate"));
			}

			AggregationResults<JiraUserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);

			result = groupResults.getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public static List<JiraUserStoryStatusVO> getUserStoryTrendChartFinal(List<String> levelIdList,
			Date storyCreationDate) {
		List<JiraUserStoryStatusVO> result1 = new ArrayList<JiraUserStoryStatusVO>();
		try {

			Aggregation agg1 = newAggregation(match(Criteria.where("storyCreationDate").is(storyCreationDate)),
					group("storyStatus").count().as("statusCnt"),
					project("statusCnt").and("storyStatus").previousOperation());

			AggregationResults<JiraUserStoryStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);

			result1 = groupResultsFinal.getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story trend chart " + e.getMessage());
		}
		return result1;
	}

	public static List<JiraUserStoryStatusVO> getUserStorybyStatusChartData(List<String> levelIdList) {
		logger.info("Fetching user story status bar chart  ..");
		List<JiraUserStoryStatusVO> result = new ArrayList<JiraUserStoryStatusVO>();
		try {
			Aggregation agg;

			if (!IdashboardConstantsUtil.NULL.equals(levelIdList)
					&& !IdashboardConstantsUtil.UNDEFINED.equals(levelIdList)) {

				agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
						group("iteration").count().as("typecount"),
						project("typecount").and("iteration").previousOperation());

			} else {
				agg = newAggregation(group("iteration").count().as("typecount"),
						project("typecount").and("iteration").previousOperation());
			}

			AggregationResults<JiraUserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);
			result = groupResults.getMappedResults();

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story status bar chart " + e.getMessage());
		}

		return result;
	}

	public static List<JiraUserStoryStatusVO> getDesignType(List<String> levelIdList) {
		List<JiraUserStoryStatusVO> result = new ArrayList<JiraUserStoryStatusVO>();
		try {
			Aggregation agg;

			if (!IdashboardConstantsUtil.NULL.equals(levelIdList)
					&& !IdashboardConstantsUtil.UNDEFINED.equals(levelIdList)) {
				agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
						group("prjName").count().as("typecount"),
						project("typecount").and("prjName").previousOperation());

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

			AggregationResults<JiraUserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);
			result = groupResults.getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch design type " + e.getMessage());
		}
		return result;
	}

	public static List<JiraUserStoryStatusVO> getUserStoryFunnelchart(List<String> levelIdList) {
		logger.info("Fetching user story priority pie chart..");
		List<JiraUserStoryStatusVO> result = new ArrayList<JiraUserStoryStatusVO>();
		try {

			Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
					group("storyStatus").count().as("priorityCnt"),
					project("priorityCnt").and("storyStatus").previousOperation(), sort(Direction.DESC, "priorityCnt"));

			AggregationResults<JiraUserStoryStatusVO> groupResults = getMongoOperation().aggregate(agg,
					JiraUserStoryVO.class, JiraUserStoryStatusVO.class);
			result = groupResults.getMappedResults();

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story priority pie chart " + e.getMessage());
		}
		return result;
	}

	public static List<JiraUserStoryVO> getRecordsReq(int itemsPerPage, int startIndex, List<String> levelIdList) {
		logger.info("Fetching user story table records..");
		List<JiraUserStoryVO> userStoryAnalysisList = new ArrayList<JiraUserStoryVO>();
		try {

			String query = "{},{_id:0,storyID:1,storyName:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (itemsPerPage != 0) {
				query1.skip(itemsPerPage * (startIndex - 1));
				query1.limit(itemsPerPage);
			}
			userStoryAnalysisList = getMongoOperation().find(query1, JiraUserStoryVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story table records " + e.getMessage());
		}
		return userStoryAnalysisList;
	}

	public static long getUserStorySearchPageCount(Map<String, String> searchValues) {
		long pageCount = 0;
		try {
			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchValues.entrySet()) {
				if (!IdashboardConstantsUtil.UNDEFINED.equals(entry.getValue())) {
					if (!entry.getValue().equals(IdashboardConstantsUtil.NULL)) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			pageCount = getMongoOperation().count(query1, JiraUserStoryVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Search failed .." + e.getMessage());
		}

		return pageCount;
	}

	public static List<JiraUserStoryVO> getSearchUserStory(int itemsPerPage, int startIndex,
			Map<String, String> searchValues) {
		List<JiraUserStoryVO> searchResult = new ArrayList<JiraUserStoryVO>();

		try {
			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);

			for (Map.Entry<String, String> entry : searchValues.entrySet()) {

				if (!"undefined".equals(entry.getValue())) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}

			query1.skip(itemsPerPage * (startIndex - 1));
			query1.limit(itemsPerPage);
			searchResult = getMongoOperation().find(query1, JiraUserStoryVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Search failed ." + e.getMessage());
		}
		return searchResult;
	}

	public static List<Date> getdefaultdate(List<String> levelIdList, String dashboardName, String owner) {

		List<Date> finalDateList = new ArrayList<Date>();

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(owner));

		List<String> verlist = new ArrayList<String>();
		try {
			verlist = getMongoOperation().getCollection("operationalDashboards").distinct("versions.versionName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException |BaseException |BadLocationException e1) {
			
			e1.printStackTrace();
		}

		List<String> cyclelist = new ArrayList<String>();
		try {
			cyclelist = getMongoOperation().getCollection("operationalDashboards").distinct("cycles.cycleName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException |BaseException |BadLocationException e1) {
			
			e1.printStackTrace();
		}

		List<JiraTestExecutionVO> issueSprintStartDateTCList = new ArrayList<JiraTestExecutionVO>();
		List<JiraTestExecutionVO> issueSprintEndDateTCList = new ArrayList<JiraTestExecutionVO>();

		Query query1 = new Query();
		Query query2 = new Query();

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query2.addCriteria(Criteria.where("_id").in(levelIdList));

		if (verlist.size() > 0) {
			query1.addCriteria(Criteria.where("versionName").in(verlist));
			query2.addCriteria(Criteria.where("versionName").in(verlist));
		}
		if (cyclelist.size() > 0) {
			query1.addCriteria(Criteria.where("cycleName").in(cyclelist));
			query2.addCriteria(Criteria.where("cycleName").in(cyclelist));
		}

		query1.with(new Sort(Sort.Direction.ASC, "executedOn"));
		query2.with(new Sort(Sort.Direction.DESC, "executedOn"));

		try {
			issueSprintStartDateTCList = getMongoOperation().find(query1, JiraTestExecutionVO.class);
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
		try {
			issueSprintEndDateTCList = getMongoOperation().find(query2, JiraTestExecutionVO.class);
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

		Date startDate = new Date();
		Date endDate = new Date();

		for (int i = 0; i < issueSprintStartDateTCList.size(); i++) {
			if (issueSprintStartDateTCList.get(i).getExecutedOn() != null) {
				startDate = issueSprintStartDateTCList.get(i).getExecutedOn();
				break;
			}
		}

		for (int j = 0; j < issueSprintEndDateTCList.size(); j++) {
			if (issueSprintEndDateTCList.get(j).getExecutedOn() != null) {
				endDate = issueSprintEndDateTCList.get(j).getExecutedOn();
				break;
			}
		}

		finalDateList.add(startDate);
		finalDateList.add(endDate);

		return finalDateList;
	}
	
	
	public static List<Date> getOnLoaddate(List<String> levelIdList, String dashboardName, String owner) {

		List<Date> finalDateList = new ArrayList<Date>();

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(owner));

		/*List<String> verlist = new ArrayList<String>();
		try {
			verlist = getMongoOperation().getCollection("operationalDashboards").distinct("versions.versionName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BaseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		List<String> cyclelist = new ArrayList<String>();
		try {
			cyclelist = getMongoOperation().getCollection("operationalDashboards").distinct("cycles.cycleName",
					filterQuery.getQueryObject());
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BaseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}*/

		List<JiraTestExecutionVO> issueSprintStartDateTCList = new ArrayList<JiraTestExecutionVO>();
		List<JiraTestExecutionVO> issueSprintEndDateTCList = new ArrayList<JiraTestExecutionVO>();

		Query query1 = new Query();
		Query query2 = new Query();

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query2.addCriteria(Criteria.where("_id").in(levelIdList));

		/*if (verlist.size() > 0) {
			query1.addCriteria(Criteria.where("versionName").in(verlist));
			query2.addCriteria(Criteria.where("versionName").in(verlist));
		}
		if (cyclelist.size() > 0) {
			query1.addCriteria(Criteria.where("cycleName").in(cyclelist));
			query2.addCriteria(Criteria.where("cycleName").in(cyclelist));
		}*/

		query1.with(new Sort(Sort.Direction.ASC, "executedOn"));
		query2.with(new Sort(Sort.Direction.DESC, "executedOn"));

		try {
			issueSprintStartDateTCList = getMongoOperation().find(query1, JiraTestExecutionVO.class);
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
		try {
			issueSprintEndDateTCList = getMongoOperation().find(query2, JiraTestExecutionVO.class);
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

		Date startDate = new Date();
		Date endDate = new Date();
		for (int i = 0; i < issueSprintStartDateTCList.size(); i++) {
			if (issueSprintStartDateTCList.get(i).getExecutedOn() != null) {
				startDate = issueSprintStartDateTCList.get(i).getExecutedOn();
				break;
			}
		}

		for (int j = 0; j < issueSprintEndDateTCList.size(); j++) {
			if (issueSprintEndDateTCList.get(j).getExecutedOn() != null) {
				endDate = issueSprintEndDateTCList.get(j).getExecutedOn();
				break;
			}
		}

		finalDateList.add(startDate);
		finalDateList.add(endDate);

		return finalDateList;
	}


	public static String getRollingPeriod(List<String> levelIdList, String dashboardName, String owner) {

		List<OperationalDashboardVO> finalOperationalList = new ArrayList<OperationalDashboardVO>();
		List<CustomTemplateVO> finalTemplateList = new ArrayList<CustomTemplateVO>();

		Query filterQuery = new Query();
		filterQuery.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		filterQuery.addCriteria(Criteria.where("owner").is(owner));

		try {
			finalOperationalList = getMongoOperation().find(filterQuery, OperationalDashboardVO.class);
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

		String templateName = finalOperationalList.get(0).getTemplateName();

		Query templateQuery = new Query();
		templateQuery.addCriteria(Criteria.where("templateName").is(templateName));
		//templateQuery.addCriteria(Criteria.where("userId").is(owner));

		try {
			finalTemplateList = getMongoOperation().find(templateQuery, CustomTemplateVO.class);
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

		String rollingPeriod = finalTemplateList.get(0).getRollingPeriod();

		return rollingPeriod;
	}

	public static List<String> getVersionListSel(List<String> levelIdList, String dfromval, String dtoval) {
		logger.info("Fetching version..");
		List<String> versionlist = new ArrayList<String>();
		List<String> finalversionlist = new ArrayList<String>();
		List<JiraTestExecutionVO> cycleDetails = new ArrayList<JiraTestExecutionVO>();
		Date dfromdate = new Date(dfromval);
		Date dtoddate = new Date(dtoval);

		Query versionquery = new Query();
		versionquery.addCriteria(Criteria.where("_id").in(levelIdList));
		versionquery.addCriteria(Criteria.where("executedOn").gte(dfromdate).lte(dtoddate));
		try {
			cycleDetails = getMongoOperation().find(versionquery, JiraTestExecutionVO.class);
			for (int i = 0; i < cycleDetails.size(); i++) {
				versionlist.add(cycleDetails.get(i).getVersionName());
			}
			Set<String> versionSet = new HashSet<String>(versionlist);
			finalversionlist = new ArrayList<String>(versionSet);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch version list " + e.getMessage());
		}
		return finalversionlist;
	}

}
