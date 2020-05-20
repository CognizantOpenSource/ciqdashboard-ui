package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.text.BadLocationException;

import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.ArtifactsCountVO;
import com.cts.metricsportal.vo.DefectResolutionVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.cts.metricsportal.vo.UserStoriesVO;
import com.mongodb.BasicDBObject;

public class ODALMMongoOperations extends BaseMongoOperation {

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

	public static long getReqCountQuery(String dashboardName, String userId, String domainName, String projectName,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		
	/*	List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);*/
		
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		
		
		long totalreq = 0;
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
		}

		query1.addCriteria(Criteria.where("reqType").ne("Folder"));

		totalreq = getMongoOperation().count(query1, RequirmentVO.class);
		return totalreq;

	}

	public static long getReqVolatilityFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		long reqresult = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);
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

		query1.addCriteria(Criteria.where("reqType").ne("Folder"));

		long reqmodified = getMongoOperation().count(query1, RequirmentVO.class);
		BasicQuery query2 = new BasicQuery(query);
		query2.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null && endDate != null) {
			query2.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		}

		query2.addCriteria(Criteria.where("reqType").ne("Folder"));

		long totalreq = getMongoOperation().count(query2, RequirmentVO.class);
		if (reqmodified != 0 && totalreq != 0) {
			// reqresult = reqmodified * 100 / totalreq;
			// reqresult = Math.round(((totalreq - reqmodified) * 100) /
			// totalreq);
			reqresult = Math.round(((double) (totalreq - reqmodified) * 100) / ((double) totalreq));

		} else {
			reqresult = 0;
		}
		return reqresult;
	}

	public static long getTotalTestCountQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		
		long testCount = 0;
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));			
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));			
		}		
		testCount = getMongoOperation().count(query1, TestCaseVO.class);

		return testCount;
	}

	public static long getDesignCoverageFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		long designcovg = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);
		String TotalQuery = "{},{_id:0,levelId:1,testType:1}";
		Query query = new Query();
		query.addCriteria(
				Criteria.where("reqID").ne("").orOperator(Criteria.where("reqID").ne(IdashboardConstantsUtil.NULL)));
		query.addCriteria(Criteria.where("_id").in(levelIdList));

		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long designedTcs = getMongoOperation().count(query, TestCaseVO.class);

		BasicQuery query1 = new BasicQuery(TotalQuery);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));

		if (startDate != null && endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long totaltccount = getMongoOperation().count(query1, TestCaseVO.class);
		// System.out.println(totaltccount);

		if (totaltccount > 0) {
			// designcovg = Math.round((designedTcs * 100) / totaltccount);
			designcovg = Math.round(((double) designedTcs * 100) / ((double) totaltccount));
			// System.out.println("cov:::"+designcovg);
		} else {
			designcovg = 0;
		}
		return designcovg;

	}

	public static long getExecutionCountQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		// List<String> levelIdList =
		// AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
		// domainName, projectName);

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		long totaltexecount = 0;
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		// query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));

		List<String> statuslist = new ArrayList<String>();
		statuslist.add("Passed");
		statuslist.add("Failed");

		query1.addCriteria(Criteria.where("testExecutionStatus").in(statuslist));

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}

		totaltexecount = getMongoOperation().count(query1, TestExecutionVO.class);
		return totaltexecount;
	}

	public static long getuniqueExecutionCountQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		// List<String> levelIdList =
		// AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
		// domainName, projectName);
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		long totaltexecount = 0;
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		// query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}

		List<Integer> listFuncTestExecuted = getMongoOperation().getCollection("ALMTestExecution").distinct("testID",
				query1.getQueryObject());

		// totaltexecount =
		// getMongoOperation().count(query1,TestExecutionVO.class);
		totaltexecount = listFuncTestExecuted.size();

		return totaltexecount;
	}

	public static long getTcCoverageQuery(String dashboardName, String userId, String domainName, String projectName,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		long reqresult = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
				projectName);
		Query query1 = new Query();
		Query query2 = new Query();

		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query2.addCriteria(Criteria.where("_id").in(levelIdList));

		List<String> statuslist = new ArrayList<String>();
		statuslist.add("Passed");
		statuslist.add("Failed");

		query1.addCriteria(Criteria.where("testExecutionStatus").in(statuslist));

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			query2.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			query2.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}

		long tcsexecuted = getMongoOperation().count(query1, TestExecutionVO.class);
		long tcsplannedtoexecute = getMongoOperation().count(query2, TestExecutionVO.class);

		if (tcsexecuted > 0 && tcsplannedtoexecute > 0) {
			// reqresult = Math.round((tcsexecuted * 100) /
			// tcsplannedtoexecute);
			reqresult = Math.round(((double) tcsexecuted * 100) / ((double) tcsplannedtoexecute));
		} else {
			reqresult = 0;
		}
		return reqresult;
	}

	public static long getTotalDefectCountinitialQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {

		long defCount = 0;

//		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
//				projectName);
		
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		//query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		defCount = getMongoOperation().count(query1, DefectVO.class);
		return defCount;
	}

	public static long defectRejectionRateFilterrQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long defRejRate = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
				projectName);
		long DefecListCount = 0;
		long rejectedCount = 0;

		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}

		query.addCriteria(Criteria.where("status").is("Rejected"));
		rejectedCount = getMongoOperation().count(query, DefectVO.class);

		String queryy = "{},{_id: 1}";
		Query query1 = new BasicQuery(queryy);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null && endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		}

		DefecListCount = getMongoOperation().count(query1, DefectVO.class);
		if (rejectedCount > 0 && DefecListCount > 0) {
			// defRejRate = (int) Math.round((rejectedCount * 100 /
			// DefecListCount));
			defRejRate = Math.round(((double) rejectedCount * 100) / ((double) DefecListCount));
		} else {
			defRejRate = 0;
		}

		// System.out.println("Reject Rate : " + defRejRate);

		return defRejRate;
	}

	public static long getReqPassCountQuery(String dashboardName, String userId, String domainName, String projectName,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long totalpassreq = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("status").is("Passed"));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
		}
		totalpassreq = getMongoOperation().count(query1, RequirmentVO.class);
		return totalpassreq;
	}

	public static long getDesignAutoCoverageQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long acresult = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);
		String query = "{},{_id:0,levelId:1,testType:1}";

		BasicQuery query1 = new BasicQuery(new BasicDBObject("$where", "this.testType != 'MANUAL'"));
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		long autotc = getMongoOperation().count(query1, TestCaseVO.class);

		BasicQuery query2 = new BasicQuery(query);
		query2.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query2.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query2.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		long totaltc = getMongoOperation().count(query2, TestCaseVO.class);

		if (autotc > 0 && totaltc > 0) {
			// acresult = Math.round((autotc * 100) / totaltc);
			acresult = Math.round(((double) autotc * 100) / ((double) totaltc));
		} else {
			acresult = 0;
		}
		return acresult;
	}

	public static long getManualCountQuery(String dashboardName, String userId, String domainName, String projectName,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long totalmanualcount = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
				projectName);

		String query = "{},{_id:0,testType:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}
		query1.addCriteria(Criteria.where("testType").is("MANUAL"));
		totalmanualcount = getMongoOperation().count(query1, TestExecutionVO.class);
		return totalmanualcount;
	}

	public static long getAutoCountQuery(String dashboardName, String userId, String domainName, String projectName,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long totalautocount = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
				projectName);

		String query = "{},{_id:0,testType:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
		}
		query1.addCriteria(Criteria.where("testType").ne("MANUAL"));
		totalautocount = getMongoOperation().count(query1, TestExecutionVO.class);
		return totalautocount;
	}

	public static long getClosedDefectCountQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		long defCloseCount = 0;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
				projectName);

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("status").is("Closed"));

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		defCloseCount = getMongoOperation().count(query1, DefectVO.class);

		// System.out.println("Def Closed Count : " + defCloseCount);
		return defCloseCount;
	}

	public static List<ArtifactsCountVO> getArtifactsCountQuery(String dashboardName, String userId, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {
		List<ArtifactsCountVO> finalresult = null;
		List<String> levelIdListdefect = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
				projectName);
		List<String> levelIdListreq = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);
		ArtifactsCountVO artifactvoreq = new ArtifactsCountVO();
		ArtifactsCountVO artifactvodef = new ArtifactsCountVO();

		finalresult = new ArrayList<ArtifactsCountVO>();

		int urgent = 0;
		int veryhigh = 0;
		int high = 0;
		int medium = 0;
		int low = 0;
		int nopriority = 0;
		String metrics;

		Aggregation aggreq = newAggregation(match(Criteria.where("_id").in(levelIdListreq)),
				group("priority").count().as("priorityCnt"),
				project("priorityCnt").and("priority").previousOperation());
		AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(aggreq, RequirmentVO.class,
				RequirementStatusVO.class);
		List<RequirementStatusVO> resultreq = groupResults.getMappedResults();

		for (int j = 0; j < resultreq.size(); j++) {

			metrics = "Requirements";
			artifactvoreq.setMetrics(metrics);

			if (resultreq.get(j).getPriority().equalsIgnoreCase("")) {
				nopriority = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setNopriority(nopriority);
			} else if (resultreq.get(j).getPriority().equalsIgnoreCase("5-Urgent")) {
				urgent = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setUrgent(urgent);
			} else if (resultreq.get(j).getPriority().equalsIgnoreCase("4-Very High")) {
				veryhigh = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setVeryhigh(veryhigh);
			} else if (resultreq.get(j).getPriority().equalsIgnoreCase("3-High")) {
				high = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setHigh(high);
			} else if (resultreq.get(j).getPriority().equalsIgnoreCase("2-Medium")) {
				medium = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setMedium(medium);
			} else if (resultreq.get(j).getPriority().equalsIgnoreCase("1-Low")) {
				low = resultreq.get(j).getPriorityCnt();
				artifactvoreq.setLow(low);
			}
		}

		Aggregation aggdef = newAggregation(match(Criteria.where("_id").in(levelIdListdefect)),
				group("priority").count().as("priorityCnt"),
				project("priorityCnt").and("priority").previousOperation());
		AggregationResults<DefectStatusVO> groupResultsdef = getMongoOperation().aggregate(aggdef, DefectVO.class,
				DefectStatusVO.class);
		List<DefectStatusVO> resultdef = groupResultsdef.getMappedResults();

		for (int j = 0; j < resultdef.size(); j++) {

			metrics = "Defects";
			artifactvodef.setMetrics(metrics);

			if (resultdef.get(j).getPriority().equalsIgnoreCase("")) {
				System.out.println("empty");
				nopriority = resultdef.get(j).getPriorityCnt();
				// System.out.println(nopriority);
				artifactvodef.setNopriority(nopriority);
			} else if (resultdef.get(j).getPriority().equalsIgnoreCase("5-Urgent")) {
				// System.out.println("5-Urgent");
				urgent = resultdef.get(j).getPriorityCnt();
				// System.out.println(urgent);
				artifactvodef.setUrgent(urgent);
			} else if (resultdef.get(j).getPriority().equalsIgnoreCase("4-Very High")) {
				// System.out.println("4-Very High");
				veryhigh = resultdef.get(j).getPriorityCnt();
				// System.out.println(veryhigh);
				artifactvodef.setVeryhigh(veryhigh);
			} else if (resultdef.get(j).getPriority().equalsIgnoreCase("3-High")) {
				// System.out.println("3-High");
				high = resultdef.get(j).getPriorityCnt();
				// System.out.println(high);
				artifactvodef.setHigh(high);
			} else if (resultdef.get(j).getPriority().equalsIgnoreCase("2-Medium")) {
				// System.out.println("2-Medium");
				medium = resultdef.get(j).getPriorityCnt();
				// System.out.println(medium);
				artifactvodef.setMedium(medium);
			} else if (resultdef.get(j).getPriority().equalsIgnoreCase("1-Low")) {
				// System.out.println("1-Low");
				low = resultdef.get(j).getPriorityCnt();
				// System.out.println(low);
				artifactvodef.setLow(low);
			}
		}

		finalresult.add(artifactvoreq);
		finalresult.add(artifactvodef);

		return finalresult;

	}

	public static List<RequirementStatusVO> getRequirementPiechartFilterQuery(String dashboardName, String userId,
			String domainName, String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);
		List<RequirementStatusVO> priorityresult = null;

		if (startDate != null || endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
					match(Criteria.where("creationTime").gte(startDate).lte(endDate)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
					RequirmentVO.class, RequirementStatusVO.class);
			priorityresult = groupResults.getMappedResults();
		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
					match(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
					RequirmentVO.class, RequirementStatusVO.class);
			priorityresult = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
					RequirmentVO.class, RequirementStatusVO.class);
			priorityresult = groupResults.getMappedResults();
		}
		return priorityresult;

	}

	public static List<DefectResolutionVO> getDefectResolutionTimeQuery(String dashboardName, String userId,
			String domainName, String projectName) throws NumberFormatException, BaseException, BadLocationException {
		List<DefectResolutionVO> defResolTime = null;
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
				projectName);

		defResolTime = new ArrayList<DefectResolutionVO>();
		String query = "{},{_id:0}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		query1.addCriteria(Criteria.where("status").is("Closed"));
		long dateDiff;

		Aggregation agg = newAggregation(match(Criteria.where("_id").in(levelIdList)),
				match(Criteria.where("status").is("Closed")), group("severity").count().as("totSeverityTypecount"),
				project("totSeverityTypecount").and("severity").previousOperation());
		AggregationResults<DefectResolutionVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
				DefectResolutionVO.class);
		List<DefectResolutionVO> sevlist = groupResults.getMappedResults();

		defResolTime = getMongoOperation().find(query1, DefectResolutionVO.class);
		Map<String, Integer> countmap = new HashMap<String, Integer>();
		Map<String, Long> dateDiffMap = new HashMap<String, Long>();
		long temp = 0;
		try {
			for (DefectResolutionVO vo : sevlist) {
				countmap.put(vo.getSeverity(), vo.getTotSeverityTypecount());
			}

			for (DefectResolutionVO vo : defResolTime) {
				temp = 0;
				dateDiff = vo.getCloseddate().getTime() - vo.getOpendate().getTime();

				// long diffSeconds = dateDiff / 1000 % 60;
				/*
				 * long diffMinutes = dateDiff / (60 * 1000) % 60; long
				 * diffHours = dateDiff / (60 * 60 * 1000) % 24;
				 */
				long diffDays = dateDiff / (24 * 60 * 60 * 1000);

				if (dateDiffMap.get(vo.getSeverity()) != null) {

					temp = dateDiffMap.get(vo.getSeverity()) + diffDays;
					dateDiffMap.put(vo.getSeverity(), temp);
				} else {
					dateDiffMap.put(vo.getSeverity(), diffDays);
				}
			}

			defResolTime.clear();
			for (String str : dateDiffMap.keySet()) {

				DefectResolutionVO vo = new DefectResolutionVO();
				vo.setSeverity(str);
				vo.setDefrestime(dateDiffMap.get(str) / countmap.get(str) + "");

				defResolTime.add(vo);
			}
		} catch (Exception e) {
			System.out.println("Exception caught");
		}

		return defResolTime;
	}

}
