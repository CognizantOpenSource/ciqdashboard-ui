package com.cts.metricsportal.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraRequirementStatusVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.JiraTestCaseVO;
import com.cts.metricsportal.vo.JiraUserStoryVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.cts.metricsportal.vo.UserStoriesVO;

public class ODJiraMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(ODJiraMongoOperations.class);

	public static long getReqCountQuery(String dashboardName, String userId, String domainName, String projectName) {
		long totalreq = 0;

		List<String> levelIdList;
		try {
			levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName, projectName);
			String queryy = "{},{_id: 1}";
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			totalreq = getMongoOperation().count(query1, JiraRequirmentVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return totalreq;
	}

	public static List<JiraRequirmentVO> gettotalStoryListQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate) {
		List<JiraRequirmentVO> listStories = new ArrayList<JiraRequirmentVO>();
		List<String> levelIdList;
		try {
			levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName, projectName);
			String queryy = "{},{_id: 0}";
			List <String> exceptionList = new ArrayList<String>();
			//*********************************************************
			// Change Date  - 5/31/2019
			// There is not issuesprint type as Backlog. Now we considering 
			// null or empty as backlog
			//*********************************************************
			//exceptionList.add("");
			//exceptionList.add("Backlog");
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
			query1.addCriteria(Criteria.where("issueType").is("Story"));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
				query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
			}
			listStories = getMongoOperation().find(query1, JiraRequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return listStories;
	}

	public static long getTotalDefectCountQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate) {

		List<String> levelIdList;
		long totDefCount = 0;
		try {
			levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
			String queryy = "{},{_id: 1}";
			List <String> exceptionList = new ArrayList<String>();
			//*********************************************************
			// Change Date  - 5/31/2019
			// There is not issuesprint type as Backlog. Now we considering 
			// null or empty as backlog
			//*********************************************************
			//exceptionList.add("");
			//exceptionList.add("Backlog");
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
				query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
			}
			totDefCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return totDefCount;
	}

	public static long getOpenDefectCount(List<String> levelIdList, Date startDate, Date endDate) {
		long openedCount = 0;

		List <String> exceptionList = new ArrayList<String>();
		//*********************************************************
		// Change Date  - 5/31/2019
		// There is not issuesprint type as Backlog. Now we considering 
		// null or empty as backlog
		//*********************************************************
		//exceptionList.add("");
		//exceptionList.add("Backlog");
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
		query.addCriteria(Criteria.where("issueStatus").ne("Closed"));
		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
		}
		try {
			openedCount = getMongoOperation().count(query, JiraDefectVO.class);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}

		return openedCount;
	}

	public static long getTotalDefectCount(List<String> levelIdList, Date startDate, Date endDate) {
		long totDefCount = 0;

		String queryy = "{},{_id: 1}";
		List <String> exceptionList = new ArrayList<String>();
		//*********************************************************
		// Change Date  - 5/31/2019
		// There is not issuesprint type as Backlog. Now we considering 
		// null or empty as backlog
		//*********************************************************
		//exceptionList.add("");
		//exceptionList.add("Backlog");
		
		Query query1 = new BasicQuery(queryy);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
		}
		try {
			totDefCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}

		return totDefCount;
	}

	public static long getTotalTestCountinitialdashQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate) {
		String query = "{},{_id:0,levelId:1}";
		String owner = "";
		long testCount = 0;
		List<String> levelIdList;
		try {

			// Check the Dashboard is set as public
			owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
			Query query1 = new BasicQuery(query);

			List <String> exceptionList = new ArrayList<String>();
			//*********************************************************
			// Change Date  - 5/31/2019
			// There is not issuesprint type as Backlog. Now we considering 
			// null or empty as backlog
			//*********************************************************
			//exceptionList.add("");
			//exceptionList.add("Backlog");
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
			if (startDate != null || endDate != null) {
				//issueSprintStartDate - Need to upate this code issuesprindStartdate is empty then need to 
				//get get the date from issuecreated date ( 6/6/2109)
				query1.addCriteria(Criteria.where("issueCreated").gte(startDate));
				query1.addCriteria(Criteria.where("issueCreated").lte(endDate));
			}
			
			testCount = getMongoOperation().count(query1, JiraTestCaseVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return testCount;
	}

	public static long getUserStoryCountQuery(List<String> levelIdList, Date startDate, Date endDate)
			throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching total user story count ..");
		long totalUserStories = 0;
		//List <String> exceptionList = new ArrayList<String>();
		//*********************************************************
		// Change Date  - 5/31/2019
		// There is not issuesprint type as Backlog. Now we considering 
		// null or empty as backlog
		//*********************************************************
		//exceptionList.add("");
		//exceptionList.add("Backlog");
		try {
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			//query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
				query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
				query1.addCriteria(Criteria.where("issueType").is("Story"));
			}
			totalUserStories = getMongoOperation().count(query1, JiraRequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return totalUserStories;
	}

	@SuppressWarnings("unchecked")
	public static long getuserStorySprintCountQuery(List<String> levelIdList, Date startDate, Date endDate)
			throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching user story Sprint count..");
		long totalUserStoriesIterations = 0;

		List<String> distinctsprint = new ArrayList<String>();

		try {

			// String query = "{},{_id:0}";
			Query query1 = new Query();
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
				query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));
			}
			distinctsprint = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
					query1.getQueryObject());
			distinctsprint.remove("");
			//*********************************************************
			// Change Date  - 5/31/2019
			// There is not issuesprint type as Backlog. Now we considering 
			// null or empty as backlog
			//*********************************************************
			//distinctsprint.remove("Backlog");

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return distinctsprint.size();
	}
}
