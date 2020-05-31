package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraRequirementStatusVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.OperationDashboardDetailsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.mongodb.BasicDBObject;

public class OperationalMongoOperations extends BaseMongoOperation {
	static final Logger logger = Logger.getLogger(AlmMongoOperations.class);

	public static long getRequirementVolatilityFilter(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching Requirement volatility..");
		long reqResult = 0;
		try {
			String query = "{},{_id:0,levelId:1,reqID:1,creationTime:1,lastModified:1}";
			BasicQuery query1 = new BasicQuery(query);
			query1 = new BasicQuery(
					new BasicDBObject("$where", "this.creationTime.getTime() != this.lastModified.getTime()"));
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}
			long reqModified = getMongoOperation().count(query1, RequirmentVO.class);
			BasicQuery query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null && endDate != null) {
				query2.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}
			long totalReq = getMongoOperation().count(query2, RequirmentVO.class);
			if (reqModified != 0 && totalReq != 0) {
				reqResult = reqModified * 100 / totalReq;

			} else {
				reqResult = 0;
			}

		}

		catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Volatility filter" + e.getMessage());
		}
		return reqResult;
	}

	public static long getRequirementCountFilter(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {

		long totalreq = 0;

		logger.info("Fetching ALM Requirement Filter Count..");
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
		}

		try {

			totalreq = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			logger.error("Failed to fetch total Requirement Count " + e.getMessage());
		}

		return totalreq;
	}

	public static long getTcExec(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching ALM Total Test Case Executed..");
		long tcsExecuted = 0;

		try {
			Query query1 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			List<String> statuslist = new ArrayList<String>();
			statuslist.add("Passed");
			statuslist.add("Failed");

			query1.addCriteria(Criteria.where("testExecutionStatus").in(statuslist));

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));

			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));

			}

			tcsExecuted = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch total Test Case Executed !" + e.getMessage());
		}

		return tcsExecuted;
	}

	public static long getTcPlan(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching ALM Total Test Case Planned..");
		long tcsPlannedtoexecute = 0;
		Query query2 = new Query();
		query2.addCriteria(Criteria.where("_id").in(levelIdList));

		if (startDate != null || endDate != null) {
			query2.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query2.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}
		try {
			tcsPlannedtoexecute = getMongoOperation().count(query2, TestExecutionVO.class);
		} catch (NumberFormatException | BadLocationException e) {

			logger.error("Failed to fetch Test Case planned to be Executed !" + e.getMessage());
		}
		return tcsPlannedtoexecute;
	}

	public static long getDesignCoverageFilterQuery(String dashboardName, String domain, String project, Date startDate,
			Date endDate, Date dates, Date dateBefore7Days, List<String> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		long designcovg = 0;
		logger.info("Fetching ALM Design Coverage Filter..");

		String TotalQuery = "{},{_id:0,levelId:1,testType:1}";
		Query query = new Query();

		query.addCriteria(
				Criteria.where("reqID").ne("").orOperator(Criteria.where("reqID").ne(IdashboardConstantsUtil.NULL)));
		BasicQuery query1 = new BasicQuery(TotalQuery);
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long designedTcs = getMongoOperation().count(query, TestCaseVO.class);
		// System.out.println(designedTcs);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null && endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		}
		if (startDate != null && endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		}
		long totaltccount = getMongoOperation().count(query1, TestCaseVO.class);
		// System.out.println(totaltccount);

		if (totaltccount > 0) {
			designcovg = designedTcs * 100 / totaltccount;
			// System.out.println("cov:::"+designcovg);
		} else {
			designcovg = 0;
		}
		return designcovg;
	}

	/*
	 * public static int getdefectRejectionRateFilterQuery(String dashboardName,
	 * String domain, String project, Date startDate, Date endDate, Date
	 * dateBefore7Days, Date dates, List<String> levelIdList) throws
	 * NumberFormatException, BaseException, BadLocationException {
	 * logger.info("Fetching ALM Defect Rejection rate"); long DefecListCount = 0;
	 * long rejectedCount = 0;
	 * 
	 * Query query = new Query();
	 * query.addCriteria(Criteria.where("_id").in(levelIdList)); if (startDate !=
	 * null || endDate != null) {
	 * query.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate)); }
	 * else if (dateBefore7Days != null && dates != null) {
	 * query.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates))
	 * ; }
	 * 
	 * query.addCriteria(Criteria.where("status").is("Rejected")); rejectedCount =
	 * getMongoOperation().count(query, DefectVO.class);
	 * 
	 * String queryy = "{},{_id: 1}"; Query query1 = new BasicQuery(queryy);
	 * query1.addCriteria(Criteria.where("_id").in(levelIdList)); if (startDate !=
	 * null && endDate != null) {
	 * query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate)); }
	 * 
	 * DefecListCount = getMongoOperation().count(query1, DefectVO.class); int
	 * defRejRate; if (rejectedCount > 0 && DefecListCount > 0) { defRejRate = (int)
	 * (rejectedCount * 100 / DefecListCount); } else { defRejRate = 0; } return
	 * defRejRate; }
	 */

	public static List<Integer> getdefectRejectionRateFilterQuery(String dashboardName, String domain, String project,
			Date startDate, Date endDate, Date dateBefore7Days, Date dates, List<Integer> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		/*logger.info("Fetching ALM Defect Rejection rate");
		
		long DefecListCount = 0;
		long rejectedCount = 0;
		
		List<Integer> defectrejrate = new ArrayList<Integer>();

		Query query = new Query();
		//query.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}

		query.addCriteria(Criteria.where("environment").in("QA","QA (System & Regression)"));
		
		query.addCriteria(Criteria.where("status").in("Dropped", "Rejected"));
		
		rejectedCount = getMongoOperation().count(query, DefectVO.class);

		String queryy = "{},{_id: 1}";
		Query query1 = new BasicQuery(queryy);
		//query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null && endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		}

		DefecListCount = getMongoOperation().count(query1, DefectVO.class);
		long defRejRate;
		if (rejectedCount > 0 && DefecListCount > 0) {
//			defRejRate = (int) Math.round((rejectedCount * 100 / DefecListCount));
			defRejRate = Math.round(((double)rejectedCount * 100)/ ((double)DefecListCount));
		} else {
			defRejRate = 0;
		}*/
		
		logger.info("Fetching ALM Defect Rejection rate");
		
		List<Integer> defectrejrate = new ArrayList<Integer>();
		
		long totalQADefects = 0;
		long totalQARejectedDefects = 0;

		Query query = new Query();
		query.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}

		query.addCriteria(Criteria.where("environment").in("QA", "QA (System & Regression)"));
		
		totalQADefects = getMongoOperation().count(query, DefectVO.class);
		
		query.addCriteria(Criteria.where("status").in("Dropped", "Rejected"));
		
		totalQARejectedDefects = getMongoOperation().count(query, DefectVO.class);
		
		int defRejRate;
		if (totalQADefects > 0 && totalQARejectedDefects > 0) {
			defRejRate = (int) Math.round(((double)totalQARejectedDefects * 100)/ ((double)totalQADefects));
		} else {
			defRejRate = 0;
		}
		
		defectrejrate.add((int)totalQARejectedDefects);
		defectrejrate.add((int)totalQADefects);
		defectrejrate.add((int)defRejRate);
		
		
		
		return defectrejrate;
	}

	public static long getOpenDefectCount(List<String> levelIdList, String dashboardName, String userId, Date dates,
			Date dateBefore7Days) {
		long openedCount = 0;

		Query query = new Query();

		query.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("issueStatus").ne("Closed"));
		
		query.addCriteria(Criteria.where("issueSprintStartDate").gte(dates));
		query.addCriteria(Criteria.where("issueSprintEndDate").lte(dateBefore7Days));
		
		
		try {
			openedCount = getMongoOperation().count(query, JiraDefectVO.class);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}

		return openedCount;
	}

	public static long getTotalDefectCount(List<String> levelIdList, String dashboardName, String userId, Date dates,
			Date dateBefore7Days) {
		long totDefCount = 0;

		Query query = new Query();

		query.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("issueSprintStartDate").gte(dates));
		query.addCriteria(Criteria.where("issueSprintEndDate").lte(dateBefore7Days));


		try {
			totDefCount = getMongoOperation().count(query, JiraDefectVO.class);
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}

		return totDefCount;
	}

	public static long getRequirementLeakFilter(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching Requirement leak..");
		long reqLeak = 0;
		try {
			String query = "{},{_id:0,levelId:1,reqID:1,status:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null && endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}
			query1.addCriteria(Criteria.where("status").is("Not Covered"));
			reqLeak = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Leak filter" + e.getMessage());
		}
		return reqLeak;
	}

	public static long getAutoCoverageFilterQuery(String dashboardName, String domain, String project, Date startDate,
			Date endDate, Date dates, Date dateBefore7Days, List<String> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		long acresult = 0;

		logger.info("Fetching ALM Auto coverage filter..");
		String query = "{},{_id:0,levelId:1,testType:1}";

		BasicQuery query1 = new BasicQuery(new BasicDBObject("$where", "this.testType != 'MANUAL'"));
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long autotc = getMongoOperation().count(query1, TestCaseVO.class);

		BasicQuery query2 = new BasicQuery(query);
		query2.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query2.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query2.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long totaltc = getMongoOperation().count(query2, TestCaseVO.class);

		if (autotc > 0 && totaltc > 0) {
			acresult = autotc * 100 / totaltc;
		} else {
			acresult = 0;
		}
		return acresult;
	}

	public static long errorDiscovery1(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("ALM Error discovery rate..");
		long reqResult = 0;
		List<TestExecutionVO> sevlist = new ArrayList<TestExecutionVO>();
		List<String> statuslist = new ArrayList<String>();
		long errorrate = sevlist.size();
		long tcsplannedtoexecute = 0;

		String query1 = "{},{_id:0,levelId:1,defectId:1,status:1}";
		Query query2 = new BasicQuery(query1);

		try {
			query2.addCriteria(Criteria.where("levelId").in(levelIdList));

			if (startDate != null || endDate != null) {
				query2.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query2.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}

			statuslist.add("Passed");
			statuslist.add("Failed");

			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(startDate).lte(endDate)),
						match(Criteria.where("testExecutionStatus").in(statuslist)
								.andOperator(Criteria.where("defectId").ne("0"))),
						group("defectId").count().as("count"), project("count").and("defectId").previousOperation());

				AggregationResults<TestExecutionVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExecutionVO.class);
				sevlist = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates)),
						match(Criteria.where("testExecutionStatus").in(statuslist)
								.andOperator(Criteria.where("defectId").ne("0"))),
						group("defectId").count().as("count"), project("count").and("defectId").previousOperation());
				AggregationResults<TestExecutionVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExecutionVO.class);
				sevlist = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionStatus").in(statuslist)
								.andOperator(Criteria.where("defectId").ne("0"))),
						group("defectId").count().as("count"), project("count").and("defectId").previousOperation());
				AggregationResults<TestExecutionVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExecutionVO.class);
				sevlist = groupResults.getMappedResults();
			}

			tcsplannedtoexecute = getMongoOperation().count(query2, TestExecutionVO.class);
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Error Discovery" + e.getMessage());
		}
		if (errorrate > 0 && tcsplannedtoexecute > 0) {
			reqResult = errorrate * 100 / tcsplannedtoexecute;
		}
		return reqResult;

	}

	public static long getreopenCountQuery(String authString, String dashboardName, String domain, String project,
			Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("Fetching defect Open count..");
		long defreopenCount = 0;

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprintStartDate").gte(dateBefore7Days));
		query1.addCriteria(Criteria.where("issueSprintEndDate").lte(dates));


		query1.addCriteria(Criteria.where("issueStatus").is("Revalidate"));

		try {
			defreopenCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch defect open count " + e.getMessage());
		}
		return defreopenCount;
	}

	public static long getUserStoryDefectCount(String authString, String dashboardName, String domain, String project,
			Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("Fetching defects asscoiated with user story  ..");
		long totalUserStoryDefectCount = 0;

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprintStartDate").gte(dateBefore7Days));
		query1.addCriteria(Criteria.where("issueSprintEndDate").lte(dates));

		try {
			totalUserStoryDefectCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch defect open count " + e.getMessage());
		}

		return totalUserStoryDefectCount;
	}

	public static long getDefClosedCountQuery(String authString, String dashboardName, String domain, String project,
			String vardtfrom, String vardtto, List<String> levelIdList) {

		logger.info("Fetching defect closed count..");
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

		long defTestExecutionCount = 0;
		Date startDate=null, endDate=null;
		try {
			startDate = formatter.parse(vardtfrom);
			endDate = formatter.parse(vardtto);

		} catch (ParseException e1) {
			
			e1.printStackTrace();
		}

		String query = "{},{_id:0,levelId:1}";

		Query query1 = new BasicQuery(query);

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("issueSprintStartDate").gte(startDate));
		query1.addCriteria(Criteria.where("issueSprintEndDate").lte(endDate));


		query1.addCriteria(Criteria.where("issueStatus").is("Closed"));
		
		//List <String> exceptionList = new ArrayList<String>();
		//exceptionList.add("");
		//exceptionList.add("Backlog");
		//query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));

		try {
			defTestExecutionCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error("Failed to fetch defect closed count" + e.getMessage());
		}

		return defTestExecutionCount;
	}

	public static long getTotalDefectCountFilterQuery(String dashboardName, String domain, String project,
			Date startDate, Date endDate, Date dateBefore7Days, Date dates, List<String> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		long defCount = 0;
		logger.info("Fetching ALM Defect Count Filter..");
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		defCount = getMongoOperation().count(query1, DefectVO.class);
		return defCount;
	}

	public static long getTcCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Total Test Cases Count..");
		long totalTcExeCount = 0;
		try {
			String query = "{},{_id:0,levelId:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			query1.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
			totalTcExeCount = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Count !" + e.getMessage());
		}
		return totalTcExeCount;
	}

	public static long getLifeUserStoryCount(String authString, String dashboardName, String domain, String project,
			Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("Fetching user story count..");
		long totalUserStories = 0;
		try {
			String query = "{},{storyID:'US1'}";
			Query query1 = new BasicQuery(query);

			if (!"undefined".equals(levelIdList)) {
				Criteria criteria1 = new Criteria();
				criteria1.andOperator(Criteria.where("_id").in(levelIdList));
				query1.addCriteria(criteria1);
				query1.addCriteria(Criteria.where("issueType").is("Story"));
				query1.addCriteria(Criteria.where("issueSprintStartDate").gte(dateBefore7Days));
				query1.addCriteria(Criteria.where("issueSprintEndDate").lte(dates));
				totalUserStories = getMongoOperation().count(query1, JiraRequirmentVO.class);
			}

			else {
				totalUserStories = getMongoOperation().count(query1, JiraRequirmentVO.class);
			}

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story count " + e.getMessage());
		}
		return totalUserStories;
	}

	public static List<JiraRequirementStatusVO> gettotalStoryListQuery(String authString, String dashboardName,
			String domain, String project, Date dates, Date dateBefore7Days, List<String> levelIdList) {

		List<JiraRequirementStatusVO> listStories = new ArrayList<JiraRequirementStatusVO>();

		try {
			String queryy = "{},{_id: 0}";
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(dateBefore7Days));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(dates));
			query1.addCriteria(Criteria.where("issueType").is("Story"));			
			listStories = getMongoOperation().find(query1, JiraRequirementStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return listStories;
	}

	public static long getTotalDefectCountQuery(String authString, String dashboardName, String domain, String project,
			Date dates, Date dateBefore7Days, List<String> levelIdList) {
		long totDefCount = 0;
		try {
			String queryy = "{},{_id: 1}";
			Query query1 = new BasicQuery(queryy);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("issueSprintStartDate").gte(dateBefore7Days));
			query1.addCriteria(Criteria.where("issueSprintEndDate").lte(dates));
			//List <String> exceptionList = new ArrayList<String>();
			//exceptionList.add("");
			//***************************************************************
			// Date of change  : 23/05/2019
			// When issue ia added to backlog, the issuesprit is empty 
			//
			//***************************************************************
			//exceptionList.add("Backlog");
			query1.addCriteria(Criteria.where("issueType").is("Bug"));
			//query1.addCriteria(Criteria.where("issueSprint").ne(exceptionList));
			totDefCount = getMongoOperation().count(query1, JiraDefectVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return totDefCount;
	}

	public static long getTotalTestCountFilterQuery(String dashboardName, String domain, String project, Date startDate,
			Date endDate, Date dates, Date dateBefore7Days, List<String> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching ALM Total Test Count Filter..");
		long testCount = 0;
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		testCount = getMongoOperation().count(query1, TestCaseVO.class);
		return testCount;
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

	public static long getInitIterationUserStoryBackLogCount(String authString, String dashboardName, String domain,
			String project, Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("Fetching user story backlog count..");
		long totalUserStoriesBacklog = 0;
		
		try {
			String query = "{},{_id:0,levelId:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("_id").in(levelIdList));

			List <String> exceptionList = new ArrayList<String>();
			exceptionList.add("");
			
			//***************************************************************
			// Date of change  : 23/05/2019
			// When issue ia added to backlog, the issuesprit is empty 
			//
			//***************************************************************
			//exceptionList.add("Backlog");
			query1.addCriteria(Criteria.where("issueSprint").in(exceptionList));
			query1.addCriteria(Criteria.where("issueType").is("Story"));

			totalUserStoriesBacklog = getMongoOperation().count(query1, JiraRequirmentVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch user story backlog count " + e.getMessage());
		}
		return totalUserStoriesBacklog;
	}

	public static List<String> getGlobalLevelProjects(String dashboardName, String owner) {
		List<OperationalDashboardVO> operational = new ArrayList<OperationalDashboardVO>();
		List<Integer> levelidlist = new ArrayList<Integer>();
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query1.addCriteria(Criteria.where("owner").is(owner));
		try {
			operational = getMongoOperation().find(query1, OperationalDashboardVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		List<String> projectList = new ArrayList<String>();
		List<String> projects = new ArrayList<String>();
		List<OperationDashboardDetailsVO> operationalReleaseSet = new ArrayList<OperationDashboardDetailsVO>();
		operationalReleaseSet = operational.get(0).getReleaseSet();
		for (int i = 0; i < operationalReleaseSet.size(); i++) {
			projectList.add(operationalReleaseSet.get(i).getLevel2());

		}
		Set<String> uniqueProjectList = new HashSet<String>(projectList);
		projects.addAll(uniqueProjectList);
		return projects;
	}
	
	// Regression Automation

		public static List<Long> getRegressionAutomationFilterQuery(String dashboardName, String userId, String domainName,
				String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
				List<String> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
			long regautoresult = 0;
			long result = 0;

			long testcasecount_n = 0;
			long testcasecount_d = 0;
			
			List<Long> regressionautocoverage = new ArrayList<Long>();

			Query query1 = new Query();
			Query query2 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
				query2.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));

			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
				query2.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			}

			query1.addCriteria(Criteria.where("automationStatus").is("Ready").and("automationType").is("Regression"));

			testcasecount_n = getMongoOperation().count(query1, TestCaseVO.class);

			query2.addCriteria(Criteria.where("_id").in(levelIdList));
			query2.addCriteria(Criteria.where("automationType").is("Regression"));
			testcasecount_d = getMongoOperation().count(query2, TestCaseVO.class);
			
			if (testcasecount_n != 0 && testcasecount_d != 0)
			{
//				result = Math.round((testcasecount_n * 100) / testcasecount_d);
				result = Math.round(((double)testcasecount_n * 100)/ ((double)testcasecount_d));
			}

			regautoresult = (int) result;
			
			regressionautocoverage.add(testcasecount_n);
			regressionautocoverage.add(testcasecount_d);
			regressionautocoverage.add(regautoresult);
			

			return regressionautocoverage;
		}

		// End of Regression Automation
		
		@SuppressWarnings("unchecked")
		public static List<Long> getFunctionalPercent(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
				List<Integer> levelIdList) {
			/*logger.info("Fetching ALM Functional Test Case Executed..");

			long funcAutomationUtilizationPercent = 0;
			List<Long> functionalautoutil = new ArrayList<Long>();

			try {
				
				Query funcTestDesigned = new Query();

				funcTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
				funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

				List<Integer> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
						funcTestDesigned.getQueryObject());

				funcTestDesigned.addCriteria(Criteria.where("automationStatus").is("Ready"));
				List<Integer> listFuncAutomationTestDesigned = getMongoOperation().getCollection("ALMTestCases")
						.distinct("testID", funcTestDesigned.getQueryObject());

				// Used for Utilization

				Query funcTestExecuted = new Query();
				Query funcTestExecutedAutomation = new Query();

				funcTestExecuted.addCriteria(Criteria.where("levelId").in(levelIdList));
				funcTestExecutedAutomation.addCriteria(Criteria.where("levelId").in(levelIdList));

				if (startDate != null || endDate != null) {
					funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
					funcTestExecutedAutomation.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
				} else if (dateBefore7Days != null && dates != null) {
					funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
					funcTestExecutedAutomation
							.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
				}

				funcTestExecuted.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));
				funcTestExecutedAutomation.addCriteria(Criteria.where("testID").in(listFuncAutomationTestDesigned));

				List<Integer> listFuncTestExecuted = getMongoOperation().getCollection("ALMTestExecution")
						.distinct("testID", funcTestExecuted.getQueryObject());

				List<Integer> listFuncTestExecutedAutomation = getMongoOperation().getCollection("ALMTestExecution")
						.distinct("testID", funcTestExecutedAutomation.getQueryObject());

				int iFunctionalTestsExecuted = listFuncTestExecuted.size();
				int iFunctionalAutomationTestsExecuted = listFuncTestExecutedAutomation.size();

				if (iFunctionalTestsExecuted != 0 && iFunctionalAutomationTestsExecuted != 0) {
					funcAutomationUtilizationPercent = Math.round((iFunctionalAutomationTestsExecuted * 100)
							/ iFunctionalTestsExecuted);
				}

				functionalautoutil.add((long)iFunctionalAutomationTestsExecuted);
				functionalautoutil.add((long)iFunctionalTestsExecuted);
				functionalautoutil.add(funcAutomationUtilizationPercent);*/
			
			logger.info("Fetching ALM Functional Test Case Executed..");

			long funcAutomationUtilizationPercent = 0;
			List<Long> functionalautoutil = new ArrayList<Long>();

			try {
				Query funcTestDesigned = new Query();

				funcTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
				funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

				List<Integer> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
						funcTestDesigned.getQueryObject());

				funcTestDesigned.addCriteria(Criteria.where("automationStatus").is("Ready"));
				List<Integer> listFuncAutomationTestDesigned = getMongoOperation().getCollection("ALMTestCases")
						.distinct("testID", funcTestDesigned.getQueryObject());

				// Used for Utilization

				Query funcTestExecuted = new Query();
				Query funcTestExecutedAutomation = new Query();

				funcTestExecuted.addCriteria(Criteria.where("levelId").in(levelIdList));
				funcTestExecutedAutomation.addCriteria(Criteria.where("levelId").in(levelIdList));

				if (startDate != null || endDate != null) {
					funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
					funcTestExecutedAutomation.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
				} else if (dateBefore7Days != null && dates != null) {
					funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
					funcTestExecutedAutomation
							.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
				}

				funcTestExecuted.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));
				funcTestExecutedAutomation.addCriteria(Criteria.where("testID").in(listFuncAutomationTestDesigned));

				// List<Integer> listUniqueFuncTestExecuted =
				// getMongoOperation().getCollection("ALMTestExecution")
				// .distinct("testID", funcTestExecuted.getQueryObject());
				//
				// List<Integer> listUniqueFuncTestExecutedAutomation =
				// getMongoOperation().getCollection("ALMTestExecution")
				// .distinct("testID", funcTestExecutedAutomation.getQueryObject());

				// int iFunctionalTestsExecuted = listUniqueFuncTestExecuted.size();
				// int iFunctionalAutomationTestsExecuted =
				// listUniqueFuncTestExecutedAutomation.size();
				
				funcTestExecuted.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
				funcTestExecutedAutomation.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

				List<TestExecutionVO> listFuncTestExecuted = getMongoOperation().find(funcTestExecuted,
						TestExecutionVO.class);
				List<TestExecutionVO> listFuncTestExecutedAutomation = getMongoOperation().find(funcTestExecutedAutomation,
						TestExecutionVO.class);

				int iFunctionalTestsExecuted = listFuncTestExecuted.size();
				int iFunctionalAutomationTestsExecuted = listFuncTestExecutedAutomation.size();

				if (iFunctionalTestsExecuted != 0 && iFunctionalAutomationTestsExecuted != 0) {
//					funcAutomationUtilizationPercent = Math.round((iFunctionalAutomationTestsExecuted * 100)
//							/ iFunctionalTestsExecuted);
					
					funcAutomationUtilizationPercent = Math.round(((double)iFunctionalAutomationTestsExecuted * 100)/ ((double)iFunctionalTestsExecuted));
				}
				
				functionalautoutil.add((long)iFunctionalAutomationTestsExecuted);
				functionalautoutil.add((long)iFunctionalTestsExecuted);
				functionalautoutil.add((long)(funcAutomationUtilizationPercent));
				
				
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error("Failed to fetch total UAT Test Case Executed !" + e.getMessage());

				return functionalautoutil;
			}

			return functionalautoutil;
		}

		@SuppressWarnings("unchecked")
		public static List<Long> getRegressionPercent(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
				List<Integer> levelIdList) {
			logger.info("Fetching ALM Functional Test Case Executed..");
			long regressionAutomationUtilizationPercent = 0;
			
			List<Long> regressionautoutil =  new ArrayList<Long>();

			try {
				
				Query regressionTestDesigned = new Query();

				regressionTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
				regressionTestDesigned.addCriteria(Criteria.where("automationType").is("Regression"));

				List<Integer> listregressionTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
						regressionTestDesigned.getQueryObject());

				regressionTestDesigned.addCriteria(Criteria.where("automationStatus").is("Ready"));
				List<Integer> listRegressionAutomationTestDesigned = getMongoOperation().getCollection("ALMTestCases")
						.distinct("testID", regressionTestDesigned.getQueryObject());
				
				int iRegressionTestsDesigned = listRegressionAutomationTestDesigned.size();

				// Used for Utilization

				Query regressionTestExecuted = new Query();
				Query regressionExecutedAutomation = new Query();

				regressionTestExecuted.addCriteria(Criteria.where("levelId").in(levelIdList));
				regressionExecutedAutomation.addCriteria(Criteria.where("levelId").in(levelIdList));

				if (startDate != null || endDate != null) {
					regressionTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
					regressionExecutedAutomation.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
				} else if (dateBefore7Days != null && dates != null) {
					regressionTestExecuted.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
					regressionExecutedAutomation
							.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
				}

				regressionTestExecuted.addCriteria(Criteria.where("testID").in(listregressionTestDesigned));
				regressionExecutedAutomation.addCriteria(Criteria.where("testID").in(listRegressionAutomationTestDesigned));
				
				regressionTestExecuted.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
				regressionExecutedAutomation.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

				List<Integer> listregressionTestExecuted = getMongoOperation().getCollection("ALMTestExecution")
						.distinct("testID", regressionTestExecuted.getQueryObject());

				List<Integer> listregressionTestExecutedAutomation = getMongoOperation().getCollection("ALMTestExecution")
						.distinct("testID", regressionExecutedAutomation.getQueryObject());

				int iRegressionTestsExecuted = listregressionTestExecuted.size();
				int iRegressionAutomationTestsExecuted = listregressionTestExecutedAutomation.size();

				if (iRegressionTestsExecuted != 0 && iRegressionAutomationTestsExecuted != 0) {
					/*regressionAutomationUtilizationPercent = (iRegressionAutomationTestsExecuted * 100)
							/ iRegressionTestsExecuted;*/
					

					//regressionAutomationUtilizationPercent = Math.round(((double)iRegressionAutomationTestsExecuted * 100)/ ((double)iRegressionTestsExecuted));
					
					regressionAutomationUtilizationPercent = Math.round((iRegressionAutomationTestsExecuted * 100)
					/ iRegressionTestsDesigned);
				}

				regressionautoutil.add((long)iRegressionAutomationTestsExecuted);
				regressionautoutil.add((long)iRegressionTestsExecuted);
				regressionautoutil.add(regressionAutomationUtilizationPercent);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error("Failed to fetch total UAT Test Case Executed !" + e.getMessage());

				return regressionautoutil;
			}

			return regressionautoutil;
		}
		
		@SuppressWarnings("unchecked")
		public static List<Long> getUatPercent(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
				List<Integer> levelIdList) {
			logger.info("Fetching ALM UAT Test Case Executed..");

			long uatAutomationUtilizationPercent = 0;
			
			List<Long> UAT = new ArrayList<Long>();

			try {

				Query funcTestExecution = new Query();
				Query funcTestCases = new Query();

				int UATReady = 0;
				int UATcount = 0;

				// ALMTestCase
				// NCount
				funcTestCases.addCriteria(Criteria.where("levelId").in(levelIdList));
				funcTestCases.addCriteria(Criteria.where("automationType").is("UAT").and("automationStatus").is("Ready"));
				List<Integer> lstautomationTestCaseId = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
						funcTestCases.getQueryObject());

				if (startDate != null || endDate != null) {
					funcTestExecution.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
				} else if (dateBefore7Days != null && dates != null) {
					funcTestExecution.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
				}

				funcTestExecution.addCriteria(Criteria.where("testID").in(lstautomationTestCaseId));

				List<Integer> dlistaitomationTestExecution = getMongoOperation().getCollection("ALMTestExecution")
						.distinct("testID", funcTestExecution.getQueryObject());

				UATReady = dlistaitomationTestExecution.size();

				// DCount
				Query dfuncTestExecution = new Query();
				Query dfuncTestCases = new Query();

				dfuncTestCases.addCriteria(Criteria.where("levelId").in(levelIdList));
				dfuncTestCases.addCriteria(Criteria.where("automationType").is("UAT"));
				List<Integer> lstTestCaseId = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
						dfuncTestCases.getQueryObject());

				if (startDate != null || endDate != null) {
					dfuncTestExecution.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
				} else if (dateBefore7Days != null && dates != null) {
					dfuncTestExecution.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
				}

				dfuncTestExecution.addCriteria(Criteria.where("testID").in(lstTestCaseId));

				List<Integer> dlistTestExecution = getMongoOperation().getCollection("ALMTestExecution").distinct("testID",
						dfuncTestExecution.getQueryObject());

				UATcount = dlistTestExecution.size();

				if (UATReady != 0 && UATcount != 0) {
//					uatAutomationUtilizationPercent = Math.round((UATReady * 100 / UATcount));
					uatAutomationUtilizationPercent = Math.round(((double)UATReady * 100)/ ((double)UATcount));
				}
				
				UAT.add((long)UATReady);
				UAT.add((long)UATcount);
				UAT.add(uatAutomationUtilizationPercent);
				

				/*
				 * Query funcTestDesigned = new Query();
				 * 
				 * funcTestDesigned.addCriteria(Criteria.where("levelId").in(
				 * levelIdList));
				 * funcTestDesigned.addCriteria(Criteria.where("automationType").is(
				 * "UAT"));
				 * 
				 * List<Integer> listFuncTestDesigned =
				 * getMongoOperation().getCollection("ALMTestCases").distinct(
				 * "testID", funcTestDesigned.getQueryObject());
				 * 
				 * funcTestDesigned.addCriteria(Criteria.where("automationStatus").
				 * is("Ready")); List<Integer> listFuncAutomationTestDesigned =
				 * getMongoOperation().getCollection("ALMTestCases")
				 * .distinct("testID", funcTestDesigned.getQueryObject());
				 * 
				 * Used for Utilization
				 * 
				 * Query funcTestExecuted = new Query(); Query
				 * funcTestExecutedAutomation = new Query();
				 * 
				 * funcTestExecuted.addCriteria(Criteria.where("levelId").in(
				 * levelIdList));
				 * funcTestExecutedAutomation.addCriteria(Criteria.where("levelId").
				 * in(levelIdList));
				 * 
				 * if (startDate != null || endDate != null) {
				 * funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").
				 * gte(startDate).lte(endDate));
				 * funcTestExecutedAutomation.addCriteria(Criteria.where(
				 * "testExecutionDate").gte(startDate).lte(endDate)); } else if
				 * (dateBefore7Days != null && dates != null) {
				 * funcTestExecuted.addCriteria(Criteria.where("testExecutionDate").
				 * gte(dateBefore7Days).lte(dates)); funcTestExecutedAutomation
				 * .addCriteria(Criteria.where("testExecutionDate").gte(
				 * dateBefore7Days).lte(dates)); }
				 * 
				 * funcTestExecuted.addCriteria(Criteria.where("testID").in(
				 * listFuncTestDesigned));
				 * funcTestExecutedAutomation.addCriteria(Criteria.where("testID").
				 * in(listFuncAutomationTestDesigned));
				 * 
				 * List<Integer> listFuncTestExecuted =
				 * getMongoOperation().getCollection("ALMTestExecution")
				 * .distinct("testID", funcTestExecuted.getQueryObject());
				 * 
				 * List<Integer> listFuncTestExecutedAutomation =
				 * getMongoOperation().getCollection("ALMTestExecution")
				 * .distinct("testID", funcTestExecutedAutomation.getQueryObject());
				 * 
				 * int iUATTestsExecuted = listFuncTestExecuted.size(); int
				 * iUATAutomationTestsExecuted =
				 * listFuncTestExecutedAutomation.size();
				 * 
				 * if (iUATTestsExecuted != 0 && iUATAutomationTestsExecuted != 0) {
				 * uatAutomationUtilizationPercent = (iUATAutomationTestsExecuted /
				 * iUATTestsExecuted) * 100; }
				 */
				
				

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error("Failed to fetch total UAT Test Case Executed !" + e.getMessage());
				return UAT;
			}

			return UAT;
		}
		
		public static List<Long> getDefectDensityrQuery(String dashboardName, String domain, String project, Date startDate,
				Date endDate, Date dateBefore7Days, Date dates, List<Integer> TestExecutionlevelIdList,
				List<Integer> DefectlevelIdList) throws NumberFormatException, BaseException, BadLocationException {
			
			int defdensity = 0;
			long testexecCount = 0;
			long defectCount = 0;
			List<TestExeStatusVO> result = null;
			long denresult = 0;
			
			List<Long> defectdensity = new ArrayList<Long>();

			try {
				
				// Getting Functional Tests from Design (TestCases)
				
				Query funcTestDesigned = new Query();

				funcTestDesigned.addCriteria(Criteria.where("levelId").in(TestExecutionlevelIdList));
				funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

				@SuppressWarnings("unchecked")
				List<Integer> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",funcTestDesigned.getQueryObject());
				
				// Getting Functional Tests from Design (TestCases)

				String query = "{},{_id:0,levelId:1,testID:1}";
				Query queryExe = new BasicQuery(query);
				Query queryDef = new Query();

				queryDef.addCriteria(Criteria.where("levelId").in(DefectlevelIdList));
				queryExe.addCriteria(Criteria.where("levelId").in(TestExecutionlevelIdList));

				if (startDate != null || endDate != null) {
					queryDef.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
					queryExe.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));

				} else if (dateBefore7Days != null && dates != null) {
					queryDef.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
					queryExe.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));

				}

				//Valid Defects
				queryDef.addCriteria(Criteria.where("status").nin("Deferred", "Dropped", "Rejected", "Duplicate"));
				
				
				//Defects of Functional Only
				//110868
				queryDef.addCriteria(Criteria.where("testId").in(listFuncTestDesigned));
				
				defectCount = getMongoOperation().count(queryDef, DefectVO.class);
				
				//Execution of Functional Only			
				queryExe.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));
				
				queryExe.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
				
				testexecCount = getMongoOperation().count(queryExe, TestExecutionVO.class);


				denresult = Math.round(((double)defectCount * 100)/ ((double)testexecCount));
				defdensity = (int) denresult;
				
				defectdensity.add(defectCount);
				defectdensity.add(testexecCount);
				defectdensity.add((long)defdensity);

			} catch (Exception ex) {
				defectdensity.add(defectCount);
				defectdensity.add(testexecCount);
				defectdensity.add((long)defdensity);
			}

			return defectdensity;
		}

		// Defect Density
		
		
}
