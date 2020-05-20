/**
 * Cognizant Technology Solutions
 * 
 * @author 653731
 */
package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.lang.invoke.MethodHandles.Lookup;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.ExecutionFuncUtilVO;
import com.cts.metricsportal.vo.ExecutionRegUtilVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TCExecutionOwnerVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestCaseTrendVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.UserStoriesVO;
import com.cts.metricsportal.vo.UserStoryStatusVO;
import com.mongodb.BasicDBObject;
import com.mongodb.CommandResult;
import com.mongodb.DBObject;

public class AlmMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(AlmMongoOperations.class);

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

	public static long getRequirementCountFilter(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		long totalreq = 0;

		logger.info("Fetching ALM Requirement Filter Count..");
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
		}

		query1.addCriteria(Criteria.where("reqType").ne("Folder"));

		try {

			totalreq = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			logger.error("Failed to fetch total Requirement Count " + e.getMessage());
		}

		return totalreq;
	}

	public static List<RequirementStatusVO> getRequirementTrendChart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		List<RequirementStatusVO> result = new ArrayList<RequirementStatusVO>();
		AggregationResults<RequirementStatusVO> groupResults = null;

		logger.info("Fetching ALM Requirement trend chart..");
		try {
			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(startDate).lte(endDate)),
						group("creationTime").count().as("count"),
						project("count").and("creationTime").previousOperation(), sort(Direction.ASC, "creationTime"));

				groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class, RequirementStatusVO.class);

				result = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates)),
						group("creationTime").count().as("count"),
						project("count").and("creationTime").previousOperation(), sort(Direction.ASC, "creationTime"));

				groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class, RequirementStatusVO.class);

				result = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						group("creationTime").count().as("count"),
						project("count").and("creationTime").previousOperation(), sort(Direction.ASC, "creationTime"));

				groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class, RequirementStatusVO.class);

				result = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Trend Chart" + e.getMessage());
		}
		return result;
	}

	public static List<RequirementStatusVO> getRequirementTrendChartFinal(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList, RequirementStatusVO info) {
		List<RequirementStatusVO> result1 = new ArrayList<RequirementStatusVO>();

		try {
			if (startDate != null || endDate != null) {
				Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(startDate).lte(endDate)),
						match(Criteria.where("reqType").ne("Folder")),
						match(Criteria.where("creationTime").is(info.getCreationTime())),
						group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());
				AggregationResults<RequirementStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						RequirmentVO.class, RequirementStatusVO.class);
				result1 = groupResultsFinal.getMappedResults();
			} else {
				Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("reqType").ne("Folder")),
						match(Criteria.where("creationTime").is(info.getCreationTime())),
						group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());
				AggregationResults<RequirementStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						RequirmentVO.class, RequirementStatusVO.class);
				result1 = groupResultsFinal.getMappedResults();
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Trend Chart" + e.getMessage());
		}
		return result1;
	}

	public static List<RequirementStatusVO> getRequirementBarChart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching ALM Requirement Bar chart..");
		List<RequirementStatusVO> dailyStatus = new ArrayList<RequirementStatusVO>();

		try {
			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(startDate).lte(endDate)),
						match(Criteria.where("reqType").ne("Folder")), group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());

				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				dailyStatus = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates)),
						match(Criteria.where("reqType").ne("Folder")), group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());

				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				dailyStatus = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());
				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				dailyStatus = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Bar Chart" + e.getMessage());
		}
		return dailyStatus;
	}

	public static List<RequirementStatusVO> getRequirementPriorityChartFilter(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		List<RequirementStatusVO> priorityresult = new ArrayList<RequirementStatusVO>();
		logger.info("Fetching ALM Requirement Priority chart..");

		try {

			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(startDate).lte(endDate)),
						match(Criteria.where("reqType").ne("Folder")), group("priority").count().as("priorityCnt"),
						project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				priorityresult = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates)),
						match(Criteria.where("reqType").ne("Folder")), group("priority").count().as("priorityCnt"),
						project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				priorityresult = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("reqType").ne("Folder")), group("priority").count().as("priorityCnt"),
						project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
				AggregationResults<RequirementStatusVO> groupResults = getMongoOperation().aggregate(agg,
						RequirmentVO.class, RequirementStatusVO.class);
				priorityresult = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Priorty Chart" + e.getMessage());
		}
		return priorityresult;
	}

	public static List<RequirmentVO> getRequirementRecords(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList, int itemsPerPage, int start_index) {
		logger.info("Fetching ALM Requirement records..");
		List<RequirmentVO> reqAnalysisList = new ArrayList<RequirmentVO>();

		try {
			String query = "{},{_id:0,reqID:1,reqType:1,status:1,priority:1,creationTime:1,lastModified:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}

			query1.addCriteria(Criteria.where("reqType").ne("Folder"));

			if (itemsPerPage != 0) {
				query1.skip(itemsPerPage * (start_index - 1));
				query1.limit(itemsPerPage);
			}
			reqAnalysisList = getMongoOperation().find(query1, RequirmentVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Table Records" + e.getMessage());
		}
		return reqAnalysisList;
	}

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

			query1.addCriteria(Criteria.where("reqType").ne("Folder"));

			long reqModified = getMongoOperation().count(query1, RequirmentVO.class);
			BasicQuery query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null && endDate != null) {
				query2.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			}

			query2.addCriteria(Criteria.where("reqType").ne("Folder"));

			long totalReq = getMongoOperation().count(query2, RequirmentVO.class);
			if (reqModified != 0 && totalReq != 0) {
				// reqResult = reqModified * 100 / totalReq;
				// 1 - (reqModified / totalReq)
				// reqResult = Math.round(((totalReq - reqModified) * 100) /
				// totalReq);
				reqResult = Math.round(((double) (totalReq - reqModified) * 100) / ((double) totalReq));

			} else {
				reqResult = 0;
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Volatility filter" + e.getMessage());
		}
		return reqResult;
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
			query1.addCriteria(Criteria.where("reqType").ne("Folder"));
			reqLeak = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Leak filter" + e.getMessage());
		}
		return reqLeak;
	}

	public static List<RequirmentVO> getRequirementRecordsAnalyseLevel(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching Requirement Analysed Record..");
		List<RequirmentVO> reqAnalyzedataLevel = new ArrayList<RequirmentVO>();

		String query = "{},{_id: 0, reqID: 1, reqName: 1, description: 1, status: 1, priority: 1, reqType: 1, creationTime: 1,lastModified:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		}
		/*
		 * if (dateBefore7Days != null && dates != null) {
		 * query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days
		 * ).lte(dates)); }
		 */

		query1.addCriteria(Criteria.where("reqType").ne("Folder"));

		try {
			reqAnalyzedataLevel = getMongoOperation().find(query1, RequirmentVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {

			logger.error("Failed to fetch Requirement Record Analysis" + e.getMessage());
		}
		return reqAnalyzedataLevel;
	}

	public static long getReqCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Requirement Count..");
		long totalReq = 0;

		try {
			String query = "{},{_id:0,levelId:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}

			query1.addCriteria(Criteria.where("reqType").ne("Folder"));
			totalReq = getMongoOperation().count(query1, RequirmentVO.class);
		}

		catch (NumberFormatException | BaseException | BadLocationException e) {

			logger.error("Failed to fetch Requirement Count" + e.getMessage());
		}
		return totalReq;
	}

	public static long getSearchPageCount(String releaseName, String reqID, String reqName, String description,
			String reqType, String status, String priority, Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		long pageCount = 0;
		Map<String, String> searchvalues = new HashMap<String, String>();

		searchvalues.put("releaseName", releaseName);
		searchvalues.put("reqName", reqName);
		searchvalues.put("description", description);
		searchvalues.put("reqType", reqType);
		searchvalues.put("status", status);
		searchvalues.put("priority", priority);

		String query = "{},{_id: 0, releaseName:1, reqID: 1, reqName: 1, description: 1, status: 1, priority: 1, reqType: 1, creationTime: 1,lastModified:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));

		/*
		 * if (reqID != 0) {
		 * query1.addCriteria(Criteria.where("reqID").is(reqID)); }
		 */

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
		}

		for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

			if (!entry.getValue().equals("undefined")) {
				if (!entry.getValue().equals("null")) {
					query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
				}
			}
		}

		// query1.addCriteria(Criteria.where("reqType").ne("Folder"));

		try {
			pageCount = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			logger.error("Search Page Count Error !" + e.getMessage());
		}
		return pageCount;
	}

	public static List<RequirmentVO> getRequirementSearchReq(String reqID, int itemsPerPage, int start_index,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days, List<Integer> levelIdList,
			Map<String, String> searchvalues) {
		logger.info("ALM Searching keyword..");
		List<RequirmentVO> searchResult = new ArrayList<RequirmentVO>();
		try {
			String query = "{},{_id: 0, reqID: 1, reqName: 1, description: 1, status: 1, priority: 1, reqType: 1, creationTime: 1,lastModified:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			/*
			 * if (reqID != 0) {
			 * query1.addCriteria(Criteria.where("reqID").is(reqID)); }
			 */

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
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

			// query1.addCriteria(Criteria.where("reqType").ne("Folder"));
			// System.out.println(query1);
			searchResult = getMongoOperation().find(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Search Functionality Error !" + e.getMessage());
		}
		return searchResult;

	}

	public static List<RequirmentVO> getRecords(String sortvalue, boolean reverse, int itemsPerPage, int start_index,
			Date startDate, Date endDate, Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("ALM Fetching Records..");
		List<RequirmentVO> reqAnalyzedata = new ArrayList<RequirmentVO>();

		try {

			String query = "{},{_id: 0, reqID: 1, reqName: 1, description: 1, status: 1, priority: 1, reqType: 1, creationTime: 1,lastModified:1}";
			Query query1 = new BasicQuery(query);

			if (reverse == false) {
				query1.addCriteria(Criteria.where("_id").in(levelIdList));
				query1.with(new Sort(Sort.Direction.ASC, sortvalue));
			} else {
				query1.addCriteria(Criteria.where("_id").in(levelIdList));
				query1.with(new Sort(Sort.Direction.DESC, sortvalue));
			}
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("creationTime").gte(dateBefore7Days).lte(dates));
			}

			query1.addCriteria(Criteria.where("reqType").ne("Folder"));

			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			reqAnalyzedata = getMongoOperation().find(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Table Records" + e.getMessage());
		}
		return reqAnalyzedata;
	}

	public static long getReqPassCount(List<String> levelIdList) {
		long totalpassreq = 0;
		try {

			String query = "{},{_id:0,levelId:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("status").is("Passed"));
			totalpassreq = getMongoOperation().count(query1, RequirmentVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Requirement Pass Count" + e.getMessage());
		}
		return totalpassreq;
	}

	public static long getTotalTestCountFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching ALM Total Test Count Filter..");
		long testCount = 0;
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
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
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
			// designcovg = Math.round(designedTcs * 100 / totaltccount);
			designcovg = Math.round(((double) designedTcs * 100) / ((double) totaltccount));
			// System.out.println("cov:::"+designcovg);
		} else {
			designcovg = 0;
		}
		return designcovg;
	}

	public static long getAutoCoverageFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long acresult = 0;

		logger.info("Fetching ALM Auto coverage filter..");
		String query = "{},{_id:0,levelId:1,automationStatus:1}";

		// BasicQuery query1 = new BasicQuery(new BasicDBObject("$where",
		// "this.automationStatus = 'Ready'"));
		BasicQuery query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("automationStatus").in("Ready"));
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
			// acresult = Math.round((autotc * 100) / totaltc);
			acresult = Math.round(((double) autotc * 100) / ((double) totaltc));
		} else {
			acresult = 0;
		}
		return acresult;
	}

	// Regression Automation

	public static long getRegressionAutomationFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long regautoresult = 0;
		long result = 0;

		long testcasecount_n = 0;
		long testcasecount_d = 0;

		Query query = new Query();
		Query query1 = new Query();
		Query query2 = new Query();

		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			query2.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));

		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
			query2.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		}

		query1.addCriteria(Criteria.where("automationStatus").is("Ready").and("automationType").is("Regression"));

		testcasecount_n = getMongoOperation().count(query1, TestCaseVO.class);

		query2.addCriteria(Criteria.where("levelId").in(levelIdList));
		query2.addCriteria(Criteria.where("automationType").is("Regression"));
		testcasecount_d = getMongoOperation().count(query2, TestCaseVO.class);

		/* result = testcasecount_n * 100 / testcasecount_d; */
		if (testcasecount_n != 0 && testcasecount_d != 0) {
			// result = Math.round((testcasecount_n * 100) / testcasecount_d);
			result = Math.round(((double) testcasecount_n * 100) / ((double) testcasecount_d));
		}
		regautoresult = (int) result;

		return regautoresult;
	}

	// End of Regression Automation

	public static List<TestCaseVO> getRecordsLevelQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		List<TestCaseVO> executionAnalyzedataLevel = null;
		logger.info("Fetching ALM Test case Records level. . ");

		String query = "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testDesigner: 1, testType: 1, testDesignStatus: 1, "
				+ "testCreationDate: 1,reqId:1,automationType: 1,automationStatus:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}

		/* query1.addCriteria(Criteria.where("description").ne("")); */

		executionAnalyzedataLevel = getMongoOperation().find(query1, TestCaseVO.class);
		return executionAnalyzedataLevel;

	}

	public static List<TestCaseTrendVO> getTestCaseTrendchartQuery(String dashboardName, String userId,
			String domainName, String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		List<TestCaseTrendVO> trendvolist = null;
		trendvolist = new ArrayList<TestCaseTrendVO>();
		logger.info("Fetching ALM test case Trend chart. . ");
		List<TestCaseStatusVO> result = null;
		result = getResultTestCaseStatus(levelIdList, startDate, endDate, dates, dateBefore7Days);
		for (int i = 0; i < result.size(); i++) {

			int importedCnt = 0;
			int stableCnt = 0;
			int readyCnt = 0;
			int designCnt = 0;
			int repairCnt = 0;
			int nostatus = 0;

			List<TestCaseStatusVO> result1 = new ArrayList<TestCaseStatusVO>();

			if (startDate != null && endDate != null) {

				Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testDesignStatus").ne(null)),
						match(Criteria.where("testCreationDate").gte(startDate).lte(endDate)),
						match(Criteria.where("testCreationDate").is(result.get(i).getTestCreationDate())),
						group("testDesignStatus").count().as("statuscount"),
						project("statuscount").and("testDesignStatus").previousOperation());

				AggregationResults<TestCaseStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						TestCaseVO.class, TestCaseStatusVO.class);

				result1 = groupResultsFinal.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testDesignStatus").ne(null)),
						match(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates)),
						match(Criteria.where("testCreationDate").is(result.get(i).getTestCreationDate())),
						group("testDesignStatus").count().as("statuscount"),
						project("statuscount").and("testDesignStatus").previousOperation());

				AggregationResults<TestCaseStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						TestCaseVO.class, TestCaseStatusVO.class);

				result1 = groupResultsFinal.getMappedResults();
			} else {
				Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testDesignStatus").ne(null)),
						match(Criteria.where("testCreationDate").is(result.get(i).getTestCreationDate())),
						group("testDesignStatus").count().as("statuscount"),
						project("statuscount").and("testDesignStatus").previousOperation());

				AggregationResults<TestCaseStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
						TestCaseVO.class, TestCaseStatusVO.class);

				result1 = groupResultsFinal.getMappedResults();
			}
			Date dateString = result.get(i).getTestCreationDate();
			TestCaseTrendVO tctrendvo = new TestCaseTrendVO();
			tctrendvo = new TestCaseTrendVO();

			for (int j = 0; j < result1.size(); j++) {

				if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("Imported")) {

					importedCnt = result1.get(j).getStatuscount();
					tctrendvo.setImportedCnt(importedCnt);
				} else if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("Stable")) {
					stableCnt = result1.get(j).getStatuscount();
					tctrendvo.setStableCnt(stableCnt);
				} else if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("Design")) {
					designCnt = result1.get(j).getStatuscount();
					tctrendvo.setDesignCnt(designCnt);
				} else if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("Ready")) {
					readyCnt = result1.get(j).getStatuscount();
					tctrendvo.setReadyCnt(readyCnt);
				} else if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("Repair")) {
					repairCnt = result1.get(j).getStatuscount();
					tctrendvo.setRepairCnt(repairCnt);
				} else if (result1.get(j).getTestDesignStatus().equalsIgnoreCase("")) {
					nostatus = result1.get(j).getStatuscount();
					tctrendvo.setNostatus(nostatus);
				}
			}

			Date date = new Date();
			date = dateString;
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			String format = formatter.format(date);

			String strExistingFlag = "False";

			for (TestCaseTrendVO chartVO : trendvolist) {
				String strDate = chartVO.getTestCreationDate();
				if (strDate.toString().equals((format.toString()))) {
					chartVO.setImportedCnt(importedCnt + chartVO.getImportedCnt());
					chartVO.setStableCnt(stableCnt + chartVO.getStableCnt());
					chartVO.setDesignCnt(designCnt + chartVO.getDesignCnt());
					chartVO.setReadyCnt(readyCnt + chartVO.getReadyCnt());
					chartVO.setRepairCnt(repairCnt + chartVO.getRepairCnt());
					chartVO.setNostatus(nostatus + chartVO.getNostatus());
					strExistingFlag = "True";
					break;
				}
			}

			if (strExistingFlag.equalsIgnoreCase("False")) {
				tctrendvo.setTestCreationDate(format);
				tctrendvo.setIsodate(dateString);
				trendvolist.add(tctrendvo);
			}
		}
		return trendvolist;

	}

	private static List<TestCaseStatusVO> getResultTestCaseStatus(List<Integer> levelIdList, Date startDate,
			Date endDate, Date dates, Date dateBefore7Days)
			throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching ALM Test case status..");
		List<TestCaseStatusVO> result = null;
		if (startDate != null && endDate != null) {

			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(startDate).lte(endDate)),
					group("testCreationDate").count().as("count"),
					project("count").and("testCreationDate").previousOperation(),
					sort(Direction.ASC, "testCreationDate"));

			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();

		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates)),
					group("testCreationDate").count().as("count"),
					project("count").and("testCreationDate").previousOperation(),
					sort(Direction.ASC, "testCreationDate"));

			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();

		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("testCreationDate").count().as("count"),
					project("count").and("testCreationDate").previousOperation(),
					sort(Direction.ASC, "testCreationDate"));

			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		}
		return result;

	}

	public static List<TestCaseStatusVO> getdesignstatusQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		List<TestCaseStatusVO> result = null;
		logger.info("Fetching ALM Test case Design - Test Use..");

		if (startDate != null && endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(startDate).lte(endDate)),
					group("automationType").count().as("statuscount"),
					project("statuscount").and("automationType").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates)),
					group("automationType").count().as("statuscount"),
					project("statuscount").and("automationType").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("automationType").count().as("statuscount"),
					project("statuscount").and("automationType").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		}
		return result;
	}

	public static List<TestCaseStatusVO> getdesigntypeQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		List<TestCaseStatusVO> result = null;
		logger.info("Fetching ALM Test Case Design AutomationStatus..");

		if (startDate != null && endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(startDate).lte(endDate)),
					group("automationStatus").count().as("typecount"),
					project("typecount").and("automationStatus").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();

		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates)),
					group("automationStatus").count().as("typecount"),
					project("typecount").and("automationStatus").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("automationStatus").count().as("typecount"),
					project("typecount").and("automationStatus").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		}

		return result;
	}

	public static List<TestCaseStatusVO> getdesignownerQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		List<TestCaseStatusVO> result = null;
		logger.info("Fetching ALM TC Design Owner..");
		if (startDate != null && endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(startDate).lte(endDate)),
					group("testDesigner").count().as("designercount"),
					project("designercount").and("testDesigner").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates)),
					group("testDesigner").count().as("designercount"),
					project("designercount").and("testDesigner").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("testDesigner").count().as("designercount"),
					project("designercount").and("testDesigner").previousOperation());
			AggregationResults<TestCaseStatusVO> groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class,
					TestCaseStatusVO.class);
			result = groupResults.getMappedResults();
		}

		return result;
	}

	public static List<TestCaseVO> getRecordstcQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates, int itemsPerPage,
			int start_index, List<Integer> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		List<TestCaseVO> reqAnalysisList = null;
		logger.info("Fetching ALM Test Case records..");
		// String query =
		// "{},{_id:0,reqID:1,reqType:1,status:1,priority:1,creationTime:1,lastModified:1}";

		String query = "{},{_id:0,releaseName:1,testID:1,testName:1,testCreationDate:1,testDesigner:1,automationType:1,automationStatus:1,testDesignStatus:1}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		if (itemsPerPage != 0) {
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
		}
		reqAnalysisList = getMongoOperation().find(query1, TestCaseVO.class);
		return reqAnalysisList;
	}

	public static long getTotalTestCountinitialQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long TestCount = 0;

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		TestCount = getMongoOperation().count(query1, TestCaseVO.class);

		return TestCount;

	}

	public static long getDesignCoverageQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long designcovg = 0;
		logger.info("Fetching ALM Design Coverage..");

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
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("testCreationDate").gte(dateBefore7Days).lte(dates));
		}
		long totaltccount = getMongoOperation().count(query1, TestCaseVO.class);
		// System.out.println(totaltccount);

		if (totaltccount > 0) {
			// designcovg = Math.round(((designedTcs * 100) / totaltccount));
			designcovg = Math.round(((double) designedTcs * 100) / ((double) totaltccount));
			// System.out.println("cov:::"+designcovg);
		} else {
			designcovg = 0;
		}

		return designcovg;
	}

	public static long getAutoCoverageinitialQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long acresult = 0;
		logger.info("Fetching Auto Test Case Coverage..");
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

	public static long getTcCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Total Test Cases Count..");
		long totalTcExeCount = 0;
		try {
			// String query = "{},{_id:0,levelId:1}";
			// Query query1 = new BasicQuery(query);

			Query query1 = new Query();

			// query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			// List<String> statuslist = new ArrayList<String>();
			// statuslist.add("Passed");
			// statuslist.add("Failed");

			query1.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

			// query1.addCriteria(Criteria.where("testExecutionStatus").in(statuslist));

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			totalTcExeCount = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Count !" + e.getMessage());
		}
		return totalTcExeCount;
	}

	public static long getTcCountForTable(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Total Test Execution Count..");
		long totalTcExeCount = 0;
		try {

			Query query1 = new Query();

			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			totalTcExeCount = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Count !" + e.getMessage());
		}
		return totalTcExeCount;
	}

	public static long getuniqueTcCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Total Test Cases Count..");
		long totaluniqueTcExeCount = 0;
		try {
			String query = "{},{_id:0,levelId:1}";
			Query query1 = new BasicQuery(query);
			// query1.addCriteria(Criteria.where("_id").in(levelIdList));
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));

			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}

			List<Integer> listFuncTestExecuted = getMongoOperation().getCollection("ALMTestExecution")
					.distinct("testID", query1.getQueryObject());
			// totaluniqueTcExeCount = getMongoOperation().count(query1,
			// TestExecutionVO.class);
			totaluniqueTcExeCount = listFuncTestExecuted.size();

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Count !" + e.getMessage());
		}
		return totaluniqueTcExeCount;
	}

	public static long getManualCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching ALM Manual Test Case count..");
		long totalmanualCount = 0;
		try {
			String query = "{},{_id:0,testType:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			query1.addCriteria(Criteria.where("testType").is("MANUAL"));
			totalmanualCount = getMongoOperation().count(query1, TestExecutionVO.class);

			return totalmanualCount;
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Manual Execution Count !" + e.getMessage());
		}
		return totalmanualCount;
	}

	public static long getAutoCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching ALM Auto Test Case count..");
		long totalautoCount = 0;
		try {
			String query = "{},{_id:0,testType:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			query1.addCriteria(Criteria.where("testType").ne("MANUAL"));
			totalautoCount = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch Auto Execution Count !" + e.getMessage());
		}

		return totalautoCount;
	}

	public static long getTcExec(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<String> levelIdList) {
		logger.info("Fetching ALM Total Test Case Executed..");
		long tcsExecuted = 0;

		try {
			Query query1 = new Query();

			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			// query1.addCriteria(Criteria.where("levelId").in(levelIdList));

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

	@SuppressWarnings({ "unused", "unchecked", "null" })
	public static List<Long> firstTimePass(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {

		logger.info("Fetching First Time Pass Rate...");
		long firstTimePassRate = 0;
		List<Long> firstTimePass = new ArrayList<Long>();

		try {

			/* 8th Jan 2020 - Getting Functional Test Cases */

			Query funcTestDesigned = new Query();

			funcTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
			funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

			List<Integer> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
					funcTestDesigned.getQueryObject());

			/* 8th Jan 2020 - Getting Functional Test Cases */

			Query query = new Query().with(new Sort(Sort.Direction.ASC, "testID"))
					.with(new Sort(Sort.Direction.ASC, "testExecutionDate"));

			query.addCriteria(Criteria.where("levelId").in(levelIdList));

			// 8th Jan. 2020 - Filtering Functional Tests
			query.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));

			if (startDate != null || endDate != null) {
				query.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));

			} else if (dateBefore7Days != null && dates != null) {
				query.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}

			/* New Logic */

			query.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

			List<TestExecutionVO> LtExecutionDetails = getMongoOperation().find(query, TestExecutionVO.class);

			int intPassedCount = 0;
			ArrayList<String> ltPassed = new ArrayList<String>();

			String strPrevTestID = "";
			for (TestExecutionVO indvExecutionDetail : LtExecutionDetails) {

				// String strcurTestID =
				// indvExecutionDetail.getTestID().toString();
				String strcurTestID = "" + indvExecutionDetail.getTestID();

				if (!(strcurTestID.equalsIgnoreCase(strPrevTestID))) {
					// if (strcurTestID != strPrevTestID) {
					if (indvExecutionDetail.getTestExecutionStatus() != null) {
						if (indvExecutionDetail.getTestExecutionStatus().toString().equalsIgnoreCase("Passed")) {
							strPrevTestID = strcurTestID;
							if (!ltPassed.contains(strcurTestID)) {
								ltPassed.add(strcurTestID);
							}
							intPassedCount++;
						} else {
							strPrevTestID = strcurTestID;
						}
					} else {
						strPrevTestID = strcurTestID;
					}
				}
			}

			intPassedCount = ltPassed.size();

			List<Integer> LtTestIDs = getMongoOperation().getCollection("ALMTestExecution").distinct("testID",
					query.getQueryObject());

			int intTotalTestsCount = LtTestIDs.size();

			if (intPassedCount > 0 && intTotalTestsCount > 0) {
				// firstTimePassRate = Math.round((intPassedCount * 100) /
				// intTotalTestsCount);
				firstTimePassRate = Math.round(((double) intPassedCount * 100) / ((double) intTotalTestsCount));
			} else {
				firstTimePassRate = 0;
			}

			firstTimePass.add((long) intPassedCount);
			firstTimePass.add((long) intTotalTestsCount);
			firstTimePass.add(firstTimePassRate);

			return firstTimePass;
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch First Time Pass rate !" + e.getMessage());
		}
		return firstTimePass;
	}

	// UAT Automation

	@SuppressWarnings({ "unused", "unchecked" })
	public static long UATAutomation(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {

		logger.info("Fetching UAT Automation..");
		long uatAutomationUtilizationPercent = 0;

		try {
			Query funcTestDesigned = new Query();

			funcTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
			funcTestDesigned.addCriteria(Criteria.where("automationType").is("UAT"));

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

			// List<Integer> listFuncTestExecuted =
			// getMongoOperation().getCollection("ALMTestExecution")
			// .distinct("testID", funcTestExecuted.getQueryObject());
			//
			// List<Integer> listFuncTestExecutedAutomation =
			// getMongoOperation().getCollection("ALMTestExecution")
			// .distinct("testID", funcTestExecutedAutomation.getQueryObject());
			//
			// int iFunctionalTestsExecuted = listFuncTestExecuted.size();
			// int iFunctionalAutomationTestsExecuted =
			// listFuncTestExecutedAutomation.size();

			funcTestExecuted.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
			funcTestExecutedAutomation.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

			List<TestExecutionVO> listFuncTestExecuted = getMongoOperation().find(funcTestExecuted,
					TestExecutionVO.class);
			List<TestExecutionVO> listFuncTestExecutedAutomation = getMongoOperation().find(funcTestExecutedAutomation,
					TestExecutionVO.class);

			int iFunctionalTestsExecuted = listFuncTestExecuted.size();
			int iFunctionalAutomationTestsExecuted = listFuncTestExecutedAutomation.size();

			if (iFunctionalTestsExecuted != 0 && iFunctionalAutomationTestsExecuted != 0) {
				uatAutomationUtilizationPercent = Math.round(
						((double) iFunctionalAutomationTestsExecuted * 100) / ((double) iFunctionalTestsExecuted));
			}

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to fetch total UAT Test Case Executed !" + e.getMessage());
		}

		return uatAutomationUtilizationPercent;

	}

	// End UAT Automation

	// Functional Automation

	@SuppressWarnings({ "unused", "unchecked" })
	public static long FuncationalAutomation(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {

		logger.info("Fetching ALM Functional Test Case Executed..");

		long funcAutomationUtilizationPercent = 0;
		// double DBfuncAutomationUtilizationPercent=0.000;

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

			funcTestExecuted.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
			funcTestExecutedAutomation.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

			List<TestExecutionVO> listFuncTestExecuted = getMongoOperation().find(funcTestExecuted,
					TestExecutionVO.class);
			List<TestExecutionVO> listFuncTestExecutedAutomation = getMongoOperation().find(funcTestExecutedAutomation,
					TestExecutionVO.class);

			int iFunctionalTestsExecuted = listFuncTestExecuted.size();
			int iFunctionalAutomationTestsExecuted = listFuncTestExecutedAutomation.size();

			if (iFunctionalTestsExecuted != 0 && iFunctionalAutomationTestsExecuted != 0) {

				funcAutomationUtilizationPercent = Math.round(
						((double) iFunctionalAutomationTestsExecuted * 100) / ((double) iFunctionalTestsExecuted));
			}

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Fetching ALM Functional Test Case Executed.." + e.getMessage());
		}

		return funcAutomationUtilizationPercent;

	}

	// End of Functional Automation

	// Regression Automation
	@SuppressWarnings({ "unused", "unchecked" }) // seen
	public static long RegressionAutomation(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {

		logger.info("Fetching ALM Regression Automation Test Case Executed..");

		long regressionAutomationUtilizationPercent = 0;

		try {
			Query regressionTestDesigned = new Query();

			regressionTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
			regressionTestDesigned.addCriteria(Criteria.where("automationType").is("Regression"));

			List<Integer> listregressionTestDesigned = getMongoOperation().getCollection("ALMTestCases")
					.distinct("testID", regressionTestDesigned.getQueryObject());

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
				regressionExecutedAutomation
						.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
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

//				regressionAutomationUtilizationPercent = Math.round(
//						((double) iRegressionAutomationTestsExecuted * 100) / ((double) iRegressionTestsExecuted));
				
				regressionAutomationUtilizationPercent = Math.round(
						((double) iRegressionAutomationTestsExecuted * 100) / ((double) iRegressionTestsDesigned));
			}

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error("Failed to Regression Utilization !" + e.getMessage());
			return regressionAutomationUtilizationPercent;
		}

		return regressionAutomationUtilizationPercent;
	}
	// End of Regression Automation

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
			// reqResult = Math.round((errorrate * 100) / tcsplannedtoexecute);
			reqResult = Math.round(((double) errorrate * 100) / ((double) tcsplannedtoexecute));
		}
		return reqResult;

	}

	public static List<TestExeStatusVO> getTcExeStatusbarchart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching ALM Auto Test Case Execution Status Bar..");
		List<TestExeStatusVO> result = new ArrayList<TestExeStatusVO>();

		try {
			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(startDate).lte(endDate)),
						group("testExecutionStatus").count().as("statusCnt"),
						project("statusCnt").and("testExecutionStatus").previousOperation());
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates)),
						group("testExecutionStatus").count().as("statusCnt"),
						project("statusCnt").and("testExecutionStatus").previousOperation());
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						group("testExecutionStatus").count().as("statusCnt"),
						project("statusCnt").and("testExecutionStatus").previousOperation());
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Bar Chart" + e.getMessage());
		}
		return result;
	}

	public static List<TCExecutionOwnerVO> getTcExeOwnerChart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching ALM Auto Test Case Execution Owner Chart..");
		List<TCExecutionOwnerVO> result = new ArrayList<TCExecutionOwnerVO>();

		try {
			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(startDate).lte(endDate)),
						group("testTester").count().as("statusCnt"),
						project("statusCnt").and("testTester").previousOperation());
				AggregationResults<TCExecutionOwnerVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TCExecutionOwnerVO.class);
				result = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates)),
						group("testTester").count().as("statusCnt"),
						project("statusCnt").and("testTester").previousOperation());
				AggregationResults<TCExecutionOwnerVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TCExecutionOwnerVO.class);
				result = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						group("testTester").count().as("statusCnt"),
						project("statusCnt").and("testTester").previousOperation());
				AggregationResults<TCExecutionOwnerVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TCExecutionOwnerVO.class);
				result = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Owner Chart" + e.getMessage());
		}
		return result;
	}

	// FunctionalUtilizationChart - Trend Chart
	@SuppressWarnings("deprecation")
	public static List<ExecutionFuncUtilVO> getFunctionalUtilChart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {

		logger.info("Fetching Functional Utilization Chart..");
		List<ExecutionFuncUtilVO> trendExecutionFuncUtilVO = new ArrayList<ExecutionFuncUtilVO>();

		try {

			if (startDate != null || endDate != null) {

				Date dtlastExecutionDate = null;
				Date dtFirstExecutionDate = null;

				Query qLastExecutionDate = new Query().with(new Sort(Sort.Direction.DESC, "testExecutionDate"));

				qLastExecutionDate.addCriteria(Criteria.where("levelId").in(levelIdList));
				qLastExecutionDate.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));

				List<TestExecutionVO> LastDateExecutionDetails = getMongoOperation().find(qLastExecutionDate,
						TestExecutionVO.class);

				if (LastDateExecutionDetails.size() > 0) {
					dtlastExecutionDate = LastDateExecutionDetails.get(0).getTestExecutionDate();
					dtFirstExecutionDate = LastDateExecutionDetails.get(LastDateExecutionDetails.size() - 1)
							.getTestExecutionDate();
				}

				// long ltime=endDate.getTime()+8*24*60*60*1000;
				// endDate=new Date(ltime);

				Calendar calStartDate = Calendar.getInstance();
				calStartDate.setTime(startDate);
				Calendar calEndDate = Calendar.getInstance();
				calEndDate.setTime(endDate);

				String flgFirstTime = "True";
				int FirstDayOfMonth = 0;
				int LastDayOfMonth = 0;

				// int dayOfMonth = 0;
				// int dayOfYear = 0;

				HashMap<Date, String> dateRange = new HashMap<>();
				Date monthData;

				do {

					monthData = calStartDate.getTime();
					if (flgFirstTime.equalsIgnoreCase("True")) {
						FirstDayOfMonth = calStartDate.get(Calendar.DAY_OF_MONTH);
						flgFirstTime = "False";
					} else {
						FirstDayOfMonth = calStartDate.getActualMinimum(Calendar.DAY_OF_MONTH);
					}
					LastDayOfMonth = calStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);

					// Calendar calTempEndDate = (Calendar)
					// calStartDate.clone();

					Calendar calTempEndDate = Calendar.getInstance(calStartDate.getTimeZone());
					calTempEndDate.setTime(calStartDate.getTime());

					calTempEndDate.set(Calendar.DAY_OF_MONTH, LastDayOfMonth);
					if (calEndDate.after(calTempEndDate)) {

						LastDayOfMonth = calStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);
					} else {
						LastDayOfMonth = calEndDate.get(Calendar.DAY_OF_MONTH);
					}

					dateRange.put(monthData, FirstDayOfMonth + " to " + LastDayOfMonth);

					calStartDate.add(Calendar.MONTH, 1);
					calStartDate.set(Calendar.DAY_OF_MONTH, 1);

					// long value = FuncationalAutomation(startDate, endDate,
					// dates, dateBefore7Days,
					// levelIdList);

				} while (calEndDate.after(calStartDate));

				Map<Date, String> sortedDateRange = sortByValues(dateRange);
				ExecutionFuncUtilVO iExecutionFuncUtilVO;

				// Functional Utilization code

				Date isoTestExecutionMonth = null;
				Calendar calChartMonthDate = null;

				Set<Map.Entry<Date, String>> entrySet = sortedDateRange.entrySet();
				for (Map.Entry<Date, String> iM : entrySet) {

					String strFromTo = iM.getValue();

					String strFromDay = strFromTo.split(" to ")[0];
					int iFromDay = Integer.parseInt(strFromDay);

					String strToDay = strFromTo.split(" to ")[1];
					int iToDay = Integer.parseInt(strToDay);

					Date iMonthData = iM.getKey();

					Calendar calStartMonthDate = Calendar.getInstance();
					calStartMonthDate.setTime(iMonthData);
					calStartMonthDate.set(Calendar.DAY_OF_MONTH, 1);
					calStartMonthDate.add(Calendar.DAY_OF_MONTH, iFromDay - 1);

					Calendar calEndMonthDate = Calendar.getInstance();
					calEndMonthDate.setTime(iMonthData);
					calEndMonthDate.set(Calendar.DAY_OF_MONTH, 1);
					calEndMonthDate.add(Calendar.DAY_OF_MONTH, iToDay); //Fix 13Feb2020
					//calEndMonthDate.add(Calendar.DAY_OF_MONTH, iToDay - 1);					 

					calChartMonthDate = Calendar.getInstance();
					calChartMonthDate.setTime(iMonthData);
					calChartMonthDate.set(Calendar.DAY_OF_MONTH, 1);

					isoTestExecutionMonth = new Date();
					isoTestExecutionMonth = calChartMonthDate.getTime();
					isoTestExecutionMonth.setDate(isoTestExecutionMonth.getDate() - 13);

					Date startMonthDate = calStartMonthDate.getTime();
					Date endMonthDate = calEndMonthDate.getTime();
					
					endMonthDate.setSeconds(endMonthDate.getSeconds() - 1);	//14Feb2020 Fix

					// Functional Utilization code

					// int funcAutomationUtilizationPercent = 0;

					long funcAutomationUtilizationPercent = 0;
					// double DBfuncAutomationUtilizationPercent=0.000;

					try {

						Query funcTestDesigned = new Query();

						funcTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
						funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

						List<Integer> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases")
								.distinct("testID", funcTestDesigned.getQueryObject());

						funcTestDesigned.addCriteria(Criteria.where("automationStatus").is("Ready"));
						List<Integer> listFuncAutomationTestDesigned = getMongoOperation().getCollection("ALMTestCases")
								.distinct("testID", funcTestDesigned.getQueryObject());

						// Used for Utilization

						Query funcTestExecuted = new Query();
						Query funcTestExecutedAutomation = new Query();

						funcTestExecuted.addCriteria(Criteria.where("levelId").in(levelIdList));
						funcTestExecutedAutomation.addCriteria(Criteria.where("levelId").in(levelIdList));

						funcTestExecuted
								.addCriteria(Criteria.where("testExecutionDate").gte(startMonthDate).lte(endMonthDate));
						funcTestExecutedAutomation
								.addCriteria(Criteria.where("testExecutionDate").gte(startMonthDate).lte(endMonthDate));

						funcTestExecuted.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));
						funcTestExecutedAutomation
								.addCriteria(Criteria.where("testID").in(listFuncAutomationTestDesigned));

						funcTestExecuted.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
						funcTestExecutedAutomation
								.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

						List<TestExecutionVO> listFuncTestExecuted = getMongoOperation().find(funcTestExecuted,
								TestExecutionVO.class);
						List<TestExecutionVO> listFuncTestExecutedAutomation = getMongoOperation()
								.find(funcTestExecutedAutomation, TestExecutionVO.class);

						int iFunctionalTestsExecuted = listFuncTestExecuted.size();
						int iFunctionalAutomationTestsExecuted = listFuncTestExecutedAutomation.size();
						
//						System.out.println("----------------------------------");
//						System.out.println("startMonthDate - "+startMonthDate);
//						System.out.println("endMonthDate - "+endMonthDate);
//						System.out.println("iFunctionalAutomationTestsExecuted - "+iFunctionalAutomationTestsExecuted);
//						System.out.println("iFunctionalTestsExecuted - "+iFunctionalTestsExecuted);						
//						System.out.println("----------------------------------");

						if (iFunctionalTestsExecuted != 0 && iFunctionalAutomationTestsExecuted != 0) {

							funcAutomationUtilizationPercent = Math
									.round(((double) iFunctionalAutomationTestsExecuted * 100)
											/ ((double) iFunctionalTestsExecuted));
						}

						iExecutionFuncUtilVO = new ExecutionFuncUtilVO();
						iExecutionFuncUtilVO.setFuncUtilValue(funcAutomationUtilizationPercent);

						iExecutionFuncUtilVO.setIsoTestExecutionMonth(isoTestExecutionMonth);

						SimpleDateFormat formater = new SimpleDateFormat("MMM yyyy");
						String testExecutionMonth = formater.format(isoTestExecutionMonth);
						iExecutionFuncUtilVO.setTestExecutionMonth(testExecutionMonth);						

						if (((dtFirstExecutionDate.getYear()) * 100)
								+ (dtFirstExecutionDate.getMonth() - 1) <= ((isoTestExecutionMonth.getYear()) * 100)
										+ (isoTestExecutionMonth.getMonth())
								&& ((dtlastExecutionDate.getYear()) * 100) + (dtlastExecutionDate.getMonth()
										- 1) >= ((isoTestExecutionMonth.getYear()) * 100)
												+ (isoTestExecutionMonth.getMonth())) {
							trendExecutionFuncUtilVO.add(iExecutionFuncUtilVO);
						}
						

					} catch (NumberFormatException | BaseException | BadLocationException e) {
						logger.error("Calculating Functional Utilization inside Trend chart.." + e.getMessage());
					}

					// Functional Utilization code

				}

				/* Add One Month */

				iExecutionFuncUtilVO = new ExecutionFuncUtilVO();
				iExecutionFuncUtilVO.setFuncUtilValue(0);

				Calendar tempCalEndDate = Calendar.getInstance();
				tempCalEndDate.setTime(endDate);
				tempCalEndDate.add(Calendar.MONTH, 1);
				isoTestExecutionMonth = tempCalEndDate.getTime();

				iExecutionFuncUtilVO.setIsoTestExecutionMonth(isoTestExecutionMonth);
				iExecutionFuncUtilVO.setTestExecutionMonth("dummy");

				trendExecutionFuncUtilVO.add(iExecutionFuncUtilVO);

				/* Add One Month */

			}
		} catch (Exception e) {
			logger.error("Failed to fetch Functional Utilization Chart" + e.getMessage());
		}
		return trendExecutionFuncUtilVO;
	}

	@SuppressWarnings("unchecked")
	private static HashMap sortByValues(HashMap map) {
		List list = new LinkedList(map.entrySet());
		// Defined Custom Comparator here
		Collections.sort(list, new Comparator() {
			public int compare(Object o1, Object o2) {
				return ((Comparable) ((Map.Entry) (o1)).getKey()).compareTo(((Map.Entry) (o2)).getKey());
			}
		});

		// Here I am copying the sorted list in HashMap
		// using LinkedHashMap to preserve the insertion order
		HashMap sortedHashMap = new LinkedHashMap();
		for (Iterator it = list.iterator(); it.hasNext();) {
			Map.Entry entry = (Map.Entry) it.next();
			sortedHashMap.put(entry.getKey(), entry.getValue());
		}
		return sortedHashMap;
	}

	// RegressionUtilizationChart - Trend Chart
	@SuppressWarnings("deprecation")
	public static List<ExecutionRegUtilVO> getRegressionUtilChart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {

		logger.info("Fetching Regression Utilization Chart..");
		List<ExecutionRegUtilVO> trendExecutionRegUtilVO = new ArrayList<ExecutionRegUtilVO>();

		try {
			if (startDate != null || endDate != null) {

				//
				Date dtlastExecutionDate = null;
				Date dtFirstExecutionDate = null;

				Query qLastExecutionDate = new Query().with(new Sort(Sort.Direction.DESC, "testExecutionDate"));

				qLastExecutionDate.addCriteria(Criteria.where("levelId").in(levelIdList));
				qLastExecutionDate.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));

				List<TestExecutionVO> LastDateExecutionDetails = getMongoOperation().find(qLastExecutionDate,
						TestExecutionVO.class);

				if (LastDateExecutionDetails.size() > 0) {
					dtlastExecutionDate = LastDateExecutionDetails.get(0).getTestExecutionDate();
					dtFirstExecutionDate = LastDateExecutionDetails.get(LastDateExecutionDetails.size() - 1)
							.getTestExecutionDate();
				}

				//

				Calendar calStartDate = Calendar.getInstance();
				calStartDate.setTime(startDate);
				Calendar calEndDate = Calendar.getInstance();
				calEndDate.setTime(endDate);

				String flgFirstTime = "True";
				int FirstDayOfMonth = 0;
				int LastDayOfMonth = 0;

				HashMap<Date, String> dateRange = new HashMap<>();
				Date monthData;

				do {

					monthData = calStartDate.getTime();
					if (flgFirstTime.equalsIgnoreCase("True")) {
						FirstDayOfMonth = calStartDate.get(Calendar.DAY_OF_MONTH);
						flgFirstTime = "False";
					} else {
						FirstDayOfMonth = calStartDate.getActualMinimum(Calendar.DAY_OF_MONTH);
					}
					LastDayOfMonth = calStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);

					Calendar calTempEndDate = Calendar.getInstance(calStartDate.getTimeZone());
					calTempEndDate.setTime(calStartDate.getTime());

					calTempEndDate.set(Calendar.DAY_OF_MONTH, LastDayOfMonth);
					if (calEndDate.after(calTempEndDate)) {

						LastDayOfMonth = calStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);
					} else {
						LastDayOfMonth = calEndDate.get(Calendar.DAY_OF_MONTH);
					}

					dateRange.put(monthData, FirstDayOfMonth + " to " + LastDayOfMonth);

					calStartDate.add(Calendar.MONTH, 1);
					calStartDate.set(Calendar.DAY_OF_MONTH, 1);

				} while (calEndDate.after(calStartDate));

				Map<Date, String> sortedDateRange = sortByValues(dateRange);
				ExecutionRegUtilVO iExecutionRegUtilVO;

				// Regression Utilization code

				Date isoTestExecutionMonth = null;
				Calendar calChartMonthDate = null;

				Set<Map.Entry<Date, String>> entrySet = sortedDateRange.entrySet();
				for (Map.Entry<Date, String> iM : entrySet) {

					String strFromTo = iM.getValue();

					String strFromDay = strFromTo.split(" to ")[0];
					int iFromDay = Integer.parseInt(strFromDay);

					String strToDay = strFromTo.split(" to ")[1];
					int iToDay = Integer.parseInt(strToDay);

					Date iMonthData = iM.getKey();

					Calendar calStartMonthDate = Calendar.getInstance();
					calStartMonthDate.setTime(iMonthData);
					calStartMonthDate.set(Calendar.DAY_OF_MONTH, 1);
					calStartMonthDate.add(Calendar.DAY_OF_MONTH, iFromDay - 1);

					Calendar calEndMonthDate = Calendar.getInstance();
					calEndMonthDate.setTime(iMonthData);
					calEndMonthDate.set(Calendar.DAY_OF_MONTH, 1);
					calEndMonthDate.add(Calendar.DAY_OF_MONTH, iToDay);
					// calEndMonthDate.add(Calendar.DAY_OF_MONTH, iToDay - 1); 
					// Fix on 13Feb2020

					calChartMonthDate = Calendar.getInstance();
					calChartMonthDate.setTime(iMonthData);
					calChartMonthDate.set(Calendar.DAY_OF_MONTH, 1);

					isoTestExecutionMonth = new Date();
					isoTestExecutionMonth = calChartMonthDate.getTime();
					isoTestExecutionMonth.setDate(isoTestExecutionMonth.getDate() - 13);

					Date startMonthDate = calStartMonthDate.getTime();
					Date endMonthDate = calEndMonthDate.getTime();
					
					endMonthDate.setSeconds(endMonthDate.getSeconds() - 1);	//14Feb2020 Fix

					// Regression Utilization code

					// int regAutomationUtilizationPercent = 0;

					long regAutomationUtilizationPercent = 0;
					// double DBregAutomationUtilizationPercent=0.000;

					try {

						Query regressionTestDesigned = new Query();

						regressionTestDesigned.addCriteria(Criteria.where("levelId").in(levelIdList));
						regressionTestDesigned.addCriteria(Criteria.where("automationType").is("Regression"));

						List<Integer> listregressionTestDesigned = getMongoOperation().getCollection("ALMTestCases")
								.distinct("testID", regressionTestDesigned.getQueryObject());

						regressionTestDesigned.addCriteria(Criteria.where("automationStatus").is("Ready"));
						List<Integer> listRegressionAutomationTestDesigned = getMongoOperation()
								.getCollection("ALMTestCases")
								.distinct("testID", regressionTestDesigned.getQueryObject());

						int iRegressionTestsDesigned = listRegressionAutomationTestDesigned.size();

						// Used for Utilization

						Query regressionTestExecuted = new Query();
						Query regressionExecutedAutomation = new Query();

						regressionTestExecuted.addCriteria(Criteria.where("levelId").in(levelIdList));
						regressionExecutedAutomation.addCriteria(Criteria.where("levelId").in(levelIdList));

						regressionTestExecuted
								.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endMonthDate));
						regressionExecutedAutomation
								.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endMonthDate));

						regressionTestExecuted.addCriteria(Criteria.where("testID").in(listregressionTestDesigned));
						regressionExecutedAutomation
								.addCriteria(Criteria.where("testID").in(listRegressionAutomationTestDesigned));

						regressionTestExecuted
								.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));
						regressionExecutedAutomation
								.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

						List<Integer> listregressionTestExecuted = getMongoOperation().getCollection("ALMTestExecution")
								.distinct("testID", regressionTestExecuted.getQueryObject());

						List<Integer> listregressionTestExecutedAutomation = getMongoOperation()
								.getCollection("ALMTestExecution")
								.distinct("testID", regressionExecutedAutomation.getQueryObject());

						int iRegressionTestsExecuted = listregressionTestExecuted.size();
						int iRegressionAutomationTestsExecuted = listregressionTestExecutedAutomation.size();
						
//						System.out.println("----------------------------------");
//						System.out.println("startMonthDate - "+startMonthDate);
//						System.out.println("endMonthDate - "+endMonthDate);
//						System.out.println("iRegressionAutomationTestsExecuted - "+iRegressionAutomationTestsExecuted);
//						System.out.println("iRegressionTestsExecuted - "+iRegressionTestsExecuted);						
//						System.out.println("----------------------------------");

						if (iRegressionTestsExecuted != 0 && iRegressionAutomationTestsExecuted != 0) {

//							regAutomationUtilizationPercent = Math
//									.round(((double) iRegressionAutomationTestsExecuted * 100)
//											/ ((double) iRegressionTestsExecuted));
							
							regAutomationUtilizationPercent = Math
									.round(((double) iRegressionAutomationTestsExecuted * 100)
											/ ((double) iRegressionTestsDesigned));							
							
						}

						iExecutionRegUtilVO = new ExecutionRegUtilVO();
						iExecutionRegUtilVO.setRegUtilValue(regAutomationUtilizationPercent);

						iExecutionRegUtilVO.setIsoTestExecutionMonth(isoTestExecutionMonth);

						SimpleDateFormat formater = new SimpleDateFormat("MMM yyyy");
						String testExecutionMonth = formater.format(isoTestExecutionMonth);
						iExecutionRegUtilVO.setTestExecutionMonth(testExecutionMonth);

						if (((dtFirstExecutionDate.getYear()) * 100)
								+ (dtFirstExecutionDate.getMonth() - 1) <= ((isoTestExecutionMonth.getYear()) * 100)
										+ (isoTestExecutionMonth.getMonth())
								&& ((dtlastExecutionDate.getYear()) * 100) + (dtlastExecutionDate.getMonth()
										- 1) >= ((isoTestExecutionMonth.getYear()) * 100)
												+ (isoTestExecutionMonth.getMonth())) {
							trendExecutionRegUtilVO.add(iExecutionRegUtilVO);
						}

						// if(dtlastExecutionDate.getMonth()-1>=isoTestExecutionMonth.getMonth()
						// &&
						// dtlastExecutionDate.getYear()>=isoTestExecutionMonth.getYear()
						// &&
						// dtFirstExecutionDate.getMonth()-1<=isoTestExecutionMonth.getMonth()
						// &&
						// dtFirstExecutionDate.getYear()<=isoTestExecutionMonth.getYear())
						// {
						// trendExecutionRegUtilVO.add(iExecutionRegUtilVO);
						// }

					} catch (NumberFormatException | BaseException | BadLocationException e) {
						logger.error("Calculating Regression Utilization inside Trend chart.." + e.getMessage());
					}

					// Regression Utilization code

				}

				/* Add One Month */

				iExecutionRegUtilVO = new ExecutionRegUtilVO();
				iExecutionRegUtilVO.setRegUtilValue(0);

				Calendar tempCalEndDate = Calendar.getInstance();
				tempCalEndDate.setTime(endDate);
				tempCalEndDate.add(Calendar.MONTH, 1);
				isoTestExecutionMonth = tempCalEndDate.getTime();

				iExecutionRegUtilVO.setIsoTestExecutionMonth(isoTestExecutionMonth);
				iExecutionRegUtilVO.setTestExecutionMonth("dummy");

				trendExecutionRegUtilVO.add(iExecutionRegUtilVO);

				/* Add One Month */

			}
		} catch (Exception e) {
			logger.error("Failed to fetch Regression Utilization Chart" + e.getMessage());
		}
		return trendExecutionRegUtilVO;

	}

	public static List<TestExeStatusVO> getTestExecutionTrendchart(Date startDate, Date endDate, Date dates,
			Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching ALM Auto Test Case Execution Trend Chart..");
		List<TestExeStatusVO> result = new ArrayList<TestExeStatusVO>();
		try {
			if (startDate != null || endDate != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(startDate).lte(endDate)),
						group("testExecutionDate").count().as("count"),
						project("count").and("testExecutionDate").previousOperation(),
						sort(Direction.ASC, "testExecutionDate"));
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			} else if (dateBefore7Days != null && dates != null) {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						match(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates)),
						group("testExecutionDate").count().as("count"),
						project("count").and("testExecutionDate").previousOperation(),
						sort(Direction.ASC, "testExecutionDate"));
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			} else {
				Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
						group("testExecutionDate").count().as("count"),
						project("count").and("testExecutionDate").previousOperation(),
						sort(Direction.ASC, "testExecutionDate"));
				AggregationResults<TestExeStatusVO> groupResults = getMongoOperation().aggregate(agg,
						TestExecutionVO.class, TestExeStatusVO.class);
				result = groupResults.getMappedResults();
			}
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Trend Chart" + e.getMessage());
		}

		return result;
	}

	public static List<TestExeStatusVO> getTestExecutionTrendchartFinal(List<Integer> levelIdList, Date dateString) {
		List<TestExeStatusVO> result1 = new ArrayList<TestExeStatusVO>();
		try {
			Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("testExecutionDate").is(dateString)),
					group("testExecutionStatus").count().as("statuscount"),
					project("statuscount").and("testExecutionStatus").previousOperation());

			AggregationResults<TestExeStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1,
					TestExecutionVO.class, TestExeStatusVO.class);

			result1 = groupResultsFinal.getMappedResults();

		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Trend Chart" + e.getMessage());
		}

		return result1;
	}

	public static List<TestExecutionVO> getExecRecords(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList) {
		logger.info("Fetching ALM Test Case Execution records..");
		List<TestExecutionVO> executionAnalyzedata = new ArrayList<TestExecutionVO>();
		try {
			String query = "{},{_id: 0,levelId:1}";

			Query query1 = new BasicQuery(query);
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
			executionAnalyzedata = getMongoOperation().find(query1, TestExecutionVO.class);
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Execution records" + e.getMessage());
		}
		return executionAnalyzedata;
	}

	public static List<TestExecutionVO> getRecordsTcExe(int itemsPerPage, int start_index, Date startDate, Date endDate,
			Date dates, Date dateBefore7Days, List<Integer> levelIdList) {
		logger.info("Fetching ALM Test Case Execution records..");
		List<TestExecutionVO> tcexetabledetails = new ArrayList<TestExecutionVO>();
		try {

			String query = "{},{_id:0,releaseName:1,cycleName:1,testRunID:1,testID:1,testName:1,testTester:1,testType:1,testExecutionDate:1,testExecutionStatus:1}";

			Query query1 = new BasicQuery(query);

			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			if (itemsPerPage != 0) {
				query1.skip(itemsPerPage * (start_index - 1));
				query1.limit(itemsPerPage);
			}

			// BasicDBObject evalDB=new BasicDBObject ();
			// evalDB.append("$eval",
			// "executionTable(5631287,ISODate('2018-12-01T00:00:00.000Z'),ISODate('2020-01-01T00:00:00.000Z'))");
			// CommandResult cr=getMongoOperation().executeCommand(evalDB);
			// Map x=(Map) cr.get("result");

			//

			// LookupOperation lookupp =
			// LookupOperation.newLookup().from("ALMTestCases").localField("testID")
			// .foreignField("testID").as("xyz");
			//
			// Aggregation agg =
			// newAggregation(lookupp,match(Criteria.where("levelId").in(levelIdList)),
			// match(Criteria.where("testExecutionDate").gte(startDate).lte(endDate)),project("xyz").getFields().getField("testID"));
			//
			//
			// AggregationResults<TestExecutionVO> sample =
			// getMongoOperation().aggregate(agg, "ALMTestExecution",
			// TestExecutionVO.class);

			// AggregationResults<DefectStatusVO> groupResults =
			// getMongoOperation().aggregate(agg, DefectVO.class,
			// DefectStatusVO.class);
			//
			// result = groupResults.getMappedResults();
			//
			// LookupOperation lookupp =
			// LookupOperation.newLookup().from("levelId").localField("levelId")
			// .foreignField("levelId").as("duplication");
			//

			tcexetabledetails = getMongoOperation().find(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Table Records" + e.getMessage());
		}
		return tcexetabledetails;
	}

	public static List<TestExecutionVO> getExecutionRecords(String sortvalue, int itemsPerPage, int start_index,
			boolean reverse, Date startDate, Date endDate, Date dates, Date dateBefore7Days, List<String> levelIdList) {
		logger.info("Fetching ALM Test Case Execution sorted records..");
		List<TestExecutionVO> tcexeAnalyzedata = new ArrayList<TestExecutionVO>();
		try {
			String query = "{},{_id:0,defectId:1,testID:1,testName:1,testDescription:1,testTester:1,testType:1,testDesignStatus:1,testCreationDate:1,testExecutionStatus:1,testExecutionDate:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("_id").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			if (reverse == false) {
				query1.with(new Sort(Sort.Direction.ASC, sortvalue));
			} else {
				query1.with(new Sort(Sort.Direction.DESC, sortvalue));
			}
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			tcexeAnalyzedata = getMongoOperation().find(query1, TestExecutionVO.class);
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed to fetch Test Case Execution Analysed Data" + e.getMessage());
		}
		return tcexeAnalyzedata;
	}

	public static long getExecutionSearchPageCount(Date startDate, Date endDate, Date dates, Date dateBefore7Days,
			List<Integer> levelIdList, Map<String, String> searchvalues) {

		logger.info("Searching Test Case Execution records..");
		long pageCount = 0;

		try {
			String query = "{},{_id: 0, levelId:1, releaseName:1,cycleName:1,testRunID:1,testID:1,testName:1,testTester:1,testType:1,testExecutionDate:1,testExecutionStatus:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}

			// if (testID != 0) {
			// query1.addCriteria(Criteria.where("testID").is(testID));
			// }

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			pageCount = getMongoOperation().count(query1, TestExecutionVO.class);

		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed Execution Search page Count ! " + e.getMessage());
		}
		return pageCount;
	}

	public static List<TestExecutionVO> getExecutionSearch(int itemsPerPage, int start_index, Date startDate,
			Date endDate, Date dates, Date dateBefore7Days, List<Integer> levelIdList,
			Map<String, String> searchvalues) {

		List<TestExecutionVO> searchResult = new ArrayList<TestExecutionVO>();
		try {
			String query = "{},{_id: 0, levelId:1, releaseName:1,cycleName:1,testRunID:1,testID:1,testName:1,testTester:1,testType:1,testExecutionDate:1,testExecutionStatus:1}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("levelId").in(levelIdList));
			if (startDate != null || endDate != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(startDate).lte(endDate));
			} else if (dateBefore7Days != null && dates != null) {
				query1.addCriteria(Criteria.where("testExecutionDate").gte(dateBefore7Days).lte(dates));
			}
			// if (testID != 0) {
			// query1.addCriteria(Criteria.where("testID").is(testID));
			// }

			for (Map.Entry<String, String> entry : searchvalues.entrySet()) {

				if (!entry.getValue().equals("undefined")) {
					if (!entry.getValue().equals("null")) {
						query1.addCriteria(Criteria.where(entry.getKey()).regex(entry.getValue(), "i"));
					}
				}
			}
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
			searchResult = getMongoOperation().find(query1, TestExecutionVO.class);
		} catch (NumberFormatException | BadLocationException e) {
			logger.error("Failed Execution Search " + e.getMessage());
		}
		return searchResult;
	}

	public static long getTotalDefectCountFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		long defCount = 0;
		logger.info("Fetching ALM Defect Count Filter..");
		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));

		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		defCount = getMongoOperation().count(query1, DefectVO.class);
		return defCount;
	}

	public static int getdefectRejectionRateFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		logger.info("Fetching ALM Defect Rejection rate");

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
			defRejRate = (int) Math.round(((double) totalQARejectedDefects * 100) / ((double) totalQADefects));
		} else {
			defRejRate = 0;
		}
		return defRejRate;
	}

	// Defect Density getdefectDensityFilterQuery

	public static int getdefectDensityFilterQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> TestExecutionlevelIdList, List<Integer> DefectlevelIdList)
			throws NumberFormatException, BaseException, BadLocationException {

		int defdensity = 0;
		long testexecCount = 0;
		long defectCount = 0;
		List<TestExeStatusVO> result = null;
		long denresult = 0;

		try {

			// Getting Functional Tests from Design (TestCases)

			Query funcTestDesigned = new Query();

			funcTestDesigned.addCriteria(Criteria.where("levelId").in(TestExecutionlevelIdList));
			funcTestDesigned.addCriteria(Criteria.where("automationType").is("Functional"));

			@SuppressWarnings("unchecked")
			List<Double> listFuncTestDesigned = getMongoOperation().getCollection("ALMTestCases").distinct("testID",
					funcTestDesigned.getQueryObject());

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

			// Valid Defects
			queryDef.addCriteria(Criteria.where("status").nin("Deferred", "Dropped", "Rejected", "Duplicate"));

			// Defects of Functional Only

			queryDef.addCriteria(Criteria.where("testId").in(listFuncTestDesigned));

			defectCount = getMongoOperation().count(queryDef, DefectVO.class);

			// Execution of Functional Only
			queryExe.addCriteria(Criteria.where("testID").in(listFuncTestDesigned));
			//
			// DBObject statusQuery = new BasicDBObject("testID",
			// listFuncTestDesigned);
			// Criteria elemMatchQuery = new BasicDBObject("$elemMatch",
			// statusQuery);
			//
			// queryExe.addCriteria(Criteria.where("testID").elemMatch(elemMatchQuery);
			queryExe.addCriteria(Criteria.where("testExecutionStatus").in("Passed", "Failed"));

			testexecCount = getMongoOperation().count(queryExe, TestExecutionVO.class);
			// List<TestExecutionVO> listFuncTestExecuted =
			// getMongoOperation().find(queryExe,
			// TestExecutionVO.class);
			//
			// for(int tst=0;tst<listFuncTestExecuted.size();tst++)
			// {
			// if(!listFuncTestDesigned.contains(listFuncTestExecuted.get(tst).getTestID())){
			//
			//
			// System.out.println(listFuncTestExecuted.get(tst).getTestID());
			// }
			// }

			denresult = Math.round(((double) defectCount * 100) / ((double) testexecCount));
			defdensity = (int) denresult;

		} catch (Exception ex) {
			defdensity = 0;
		}

		return defdensity;
	}

	// End of Defect Density

	public static List<DefectTrendVO> getDefecttrendchartQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		logger.info("Fetching ALM Defect Count Trend Chart..");

		List<DefectTrendVO> trendvolist = null;

		trendvolist = new ArrayList<DefectTrendVO>();

		List<DefectStatusVO> result = null;

		if (startDate != null || endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(startDate).lte(endDate)),
					group("opendate").count().as("count"), project("count").and("opendate").previousOperation(),
					sort(Direction.ASC, "opendate"));

			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);

			result = groupResults.getMappedResults();
		}

		else if (dateBefore7Days != null && dates != null) {

			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(dateBefore7Days).lte(dates)),
					group("opendate").count().as("count"), project("count").and("opendate").previousOperation(),
					sort(Direction.ASC, "opendate"));

			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);

			result = groupResults.getMappedResults();
		} else {

			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("opendate").count().as("count"), project("count").and("opendate").previousOperation(),
					sort(Direction.ASC, "opendate"));

			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);

			result = groupResults.getMappedResults();
		}

		for (int i = 0; i < result.size(); i++) {

			/*
			 * int newCnt = 0; int openCnt = 0; int closedCnt = 0; int fixedCnt
			 * = 0; int rejectedCnt = 0; int reopenCnt=0; int readyCnt=0; int
			 * nostatusCnt=0;
			 */

			int newCnt = 0;
			int openCnt = 0;

			int completed_cnt = 0;
			int dropped_cnt = 0;
			int linnew_cnt = 0;
			int redyfortest_cnt = 0;
			int inprogress_cnt = 0;
			int open_cnt = 0;
			int assigned_cnt = 0;
			int deferred_cnt = 0;
			int analyzing_cnt = 0;
			int nostatusCnt = 0;

			List<DefectStatusVO> result1 = new ArrayList<DefectStatusVO>();
			Aggregation agg1 = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").is(result.get(i).getOpendate())),
					group("status").count().as("statuscount"),
					project("statuscount").and("status").previousOperation());

			AggregationResults<DefectStatusVO> groupResultsFinal = getMongoOperation().aggregate(agg1, DefectVO.class,
					DefectStatusVO.class);

			result1 = groupResultsFinal.getMappedResults();

			Date dateString = result.get(i).getOpendate();

			DefectTrendVO deftrendvo = new DefectTrendVO();

			for (int j = 0; j < result1.size(); j++) {

				/*
				 * if (result1.get(j).getStatus().equalsIgnoreCase("Closed")) {
				 * closedCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setClosedDefects(closedCnt); } else if
				 * (result1.get(j).getStatus().equalsIgnoreCase("Open")) {
				 * openCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setOpenDefects(openCnt); } else if
				 * (result1.get(j).getStatus().equalsIgnoreCase("Fixed")) {
				 * fixedCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setFixedDefects(fixedCnt); } else if
				 * (result1.get(j).getStatus() .equalsIgnoreCase("Rejected")) {
				 * rejectedCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setRejectedDefects(rejectedCnt); } else if
				 * (result1.get(j).getStatus().equalsIgnoreCase("New")) { newCnt
				 * = result1.get(j).getStatuscount();
				 * deftrendvo.setNewDefects(newCnt); } else if
				 * (result1.get(j).getStatus().equalsIgnoreCase("Reopen")) {
				 * reopenCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setReopenDefects(reopenCnt); }else if
				 * (result1.get(j).getStatus().equalsIgnoreCase("ReadyforQA")) {
				 * readyCnt = result1.get(j).getStatuscount();
				 * deftrendvo.setReadyQA(readyCnt);
				 */
				if (result1.get(j).getStatus().equalsIgnoreCase("Completed")) {
					completed_cnt = result1.get(j).getStatuscount();
					deftrendvo.setCompleted(completed_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("New")) {
					newCnt = result1.get(j).getStatuscount();
					deftrendvo.setNewDefects(newCnt);
					/*
					 * linnew_cnt = result1.get(j).getStatuscount();
					 * deftrendvo.setNewDefects(linnew_cnt);
					 */
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Open")) {
					/*
					 * open_cnt = result1.get(j).getStatuscount();
					 * deftrendvo.setNewDefects(open_cnt);
					 */
					openCnt = result1.get(j).getStatuscount();
					deftrendvo.setOpenDefects(openCnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Dropped")) {
					dropped_cnt = result1.get(j).getStatuscount();
					deftrendvo.setDropped(dropped_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Ready for Test")) {
					redyfortest_cnt = result1.get(j).getStatuscount();
					deftrendvo.setReadyfortest(redyfortest_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("In Progress")) {
					inprogress_cnt = result1.get(j).getStatuscount();
					deftrendvo.setInprogress(inprogress_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Assigned")) {
					assigned_cnt = result1.get(j).getStatuscount();
					deftrendvo.setAssigned(assigned_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Deferred")) {
					deferred_cnt = result1.get(j).getStatuscount();
					deftrendvo.setDeferred(deferred_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("Analyzing")) {
					analyzing_cnt = result1.get(j).getStatuscount();
					deftrendvo.setAnalyzing(analyzing_cnt);
				} else if (result1.get(j).getStatus().equalsIgnoreCase("")) {
					nostatusCnt = result1.get(j).getStatuscount();
					deftrendvo.setNostatus(nostatusCnt);
				}
			}

			Date date = new Date();
			date = dateString;
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			String format = formatter.format(date);

			String strExistingFlag = "False";

			for (DefectTrendVO chartVO : trendvolist) {
				String strDate = chartVO.getDate();
				if (strDate.toString().equals((format.toString()))) {
					/*
					 * chartVO.setNewDefects(newCnt + chartVO.getNewDefects());
					 * chartVO.setOpenDefects(openCnt +
					 * chartVO.getOpenDefects());
					 * chartVO.setClosedDefects(closedCnt +
					 * chartVO.getClosedDefects());
					 * chartVO.setFixedDefects(fixedCnt +
					 * chartVO.getFixedDefects());
					 * chartVO.setRejectedDefects(rejectedCnt +
					 * chartVO.getRejectedDefects());
					 * chartVO.setReopenDefects(reopenCnt +
					 * chartVO.getReopenDefects()); chartVO.setReadyQA(readyCnt
					 * + chartVO.getReadyQA());
					 */

					/*
					 * chartVO.setLinnew(linnew_cnt + chartVO.getLinnew());
					 * chartVO.setLinopen(open_cnt + chartVO.getLinopen());
					 */

					chartVO.setNewDefects(newCnt + chartVO.getNewDefects());
					chartVO.setOpenDefects(openCnt + chartVO.getOpenDefects());

					chartVO.setNostatus(nostatusCnt + chartVO.getNostatus());
					chartVO.setCompleted(completed_cnt + chartVO.getCompleted());
					chartVO.setDropped(dropped_cnt + chartVO.getDropped());
					chartVO.setReadyfortest(redyfortest_cnt + chartVO.getReadyfortest());
					chartVO.setInprogress(inprogress_cnt + chartVO.getInprogress());
					chartVO.setAssigned(assigned_cnt + chartVO.getAssigned());
					chartVO.setDeferred(deferred_cnt + chartVO.getDeferred());
					chartVO.setAnalyzing(analyzing_cnt + chartVO.getAnalyzing());

					strExistingFlag = "True";
					break;
				}
			}

			if (strExistingFlag.equalsIgnoreCase("False")) {
				deftrendvo.setDate(format);
				deftrendvo.setIsodate(dateString);
				trendvolist.add(deftrendvo);
			}

		}
		return trendvolist;
	}

	public static List<DefectStatusVO> getDefectbardashchartQuery(String dashboardName, String userId,
			String domainName, String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		logger.info("Fetching ALM Defect Bar Chart.");
		List<DefectStatusVO> result = null;
		if (startDate != null || endDate != null) {

			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(startDate).lte(endDate)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(dateBefore7Days).lte(dates)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("priority").count().as("priorityCnt"),
					project("priorityCnt").and("priority").previousOperation(), sort(Direction.ASC, "priority"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		}

		return result;
	}

	public static List<DefectStatusVO> getDefectenvchartQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching ALM Defect Severity..");
		List<DefectStatusVO> result = null;
		if (startDate != null || endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(startDate).lte(endDate)),
					group("severity").count().as("severityCnt"),
					project("severityCnt").and("severity").previousOperation(), sort(Direction.ASC, "severity"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		}

		else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(dateBefore7Days).lte(dates)),
					group("severity").count().as("severityCnt"),
					project("severityCnt").and("severity").previousOperation(), sort(Direction.ASC, "severity"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("severity").count().as("severityCnt"),
					project("severityCnt").and("severity").previousOperation(), sort(Direction.ASC, "severity"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		}
		return result;
	}

	public static List<DefectStatusVO> getDefectuserchartQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		List<DefectStatusVO> result = null;
		logger.info("Fetching ALM Defect User Chart..");
		if (startDate != null || endDate != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(startDate).lte(endDate)),
					group("assignedto").count().as("usercount"),
					project("usercount").and("assignedto").previousOperation());
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		} else if (dateBefore7Days != null && dates != null) {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					match(Criteria.where("opendate").gte(dateBefore7Days).lte(dates)),
					group("assignedto").count().as("usercount"),
					project("usercount").and("assignedto").previousOperation());
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		} else {
			Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
					group("assignedto").count().as("usercount"),
					project("usercount").and("assignedto").previousOperation());
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg, DefectVO.class,
					DefectStatusVO.class);
			result = groupResults.getMappedResults();
		}
		return result;

	}

	public static List<DefectVO> getRecordsdefQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates, int itemsPerPage,
			int start_index, List<Integer> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		List<DefectVO> defAnalysisList = null;

		String query = "{},{_id:0,defectID:1,detectedBy:1,status:1,assignedBy:1,assignedTo:1,detectedPhase:1,priority:1,severity:1,module:1,defectAge:1}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		if (itemsPerPage != 0) {
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);
		}
		defAnalysisList = getMongoOperation().find(query1, DefectVO.class);
		return defAnalysisList;
	}

	public static long getTotalDefectCountinitialQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {

		logger.info("Fetching ALM Total Defect Count..");
		long defCount = 0;

		String query = "{},{_id:0,levelId:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		defCount = getMongoOperation().count(query1, DefectVO.class);

		return defCount;
	}

	public static int defectRejectionRateQuery(String dashboardName, String userId, String domainName,
			String projectName, List<String> levelIdList)
			throws NumberFormatException, BaseException, BadLocationException {
		int defRejRate = 0;
		logger.info("Fetching ALM Defect rejection rate..");
		long DefecListCount = 0;
		long rejectedCount = 0;
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").in(levelIdList));
		query.addCriteria(Criteria.where("status").is("Rejected"));
		rejectedCount = getMongoOperation().count(query, DefectVO.class);

		String queryy = "{},{_id: 1}";
		Query query1 = new BasicQuery(queryy);
		query1.addCriteria(Criteria.where("_id").in(levelIdList));
		DefecListCount = getMongoOperation().count(query1, DefectVO.class);
		if (rejectedCount > 0 && DefecListCount > 0) {
			// defRejRate = (int) Math.round(((rejectedCount * 100) /
			// DefecListCount));
			defRejRate = (int) Math.round(((double) rejectedCount * 100) / ((double) DefecListCount));
		} else {
			defRejRate = 0;
		}

		return defRejRate;
	}

	public static List<DefectVO> getRecordsQuery(String dashboardName, String userId, String domainName,
			String projectName, Date startDate, Date endDate, Date dateBefore7Days, Date dates,
			List<Integer> levelIdList) throws NumberFormatException, BaseException, BadLocationException {
		List<DefectVO> srcFileAnalysisList = new ArrayList<DefectVO>();

		logger.info("Fetching ALM Defect records..");
		String query = "{},{_id: 0, defectId: 1, assignedto: 1, summary: 1, status: 1, priority: 1, severity: 1}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("levelId").in(levelIdList));
		if (startDate != null || endDate != null) {
			query1.addCriteria(Criteria.where("opendate").gte(startDate).lte(endDate));
		} else if (dateBefore7Days != null && dates != null) {
			query1.addCriteria(Criteria.where("opendate").gte(dateBefore7Days).lte(dates));
		}
		srcFileAnalysisList = getMongoOperation().find(query1, DefectVO.class);
		return srcFileAnalysisList;

	}

	public static List<String> getGlobalLevelIdRequirement(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching Global LevelId ALM Requirement..");
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<RequirmentVO> reqList = null;
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("reqID").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("reqID", "$reqID").append("_id", "$_id")).as("duplication"));

		reqList = getMongoOperation().aggregate(agg, "ALMRequirements", RequirmentVO.class).getMappedResults();

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;
	}

	public static List<String> getGlobalLevelIdDefect(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching Global LevelId ALM Defect..");
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<DefectVO> reqList = null;
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("defectId").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("defectId", "$defectId").append("_id", "$_id")).as("duplication"));

		reqList = getMongoOperation().aggregate(agg, "ALMDefects", DefectVO.class).getMappedResults();

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
		return levellist;

	}

	public static List<String> getGlobalLevelIdDesign(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {
		logger.info("Fetching Global LevelId ALM Design..");
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<TestCaseVO> reqList = null;
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("testID").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("testID", "$testID").append("_id", "$_id")).as("duplication"));

		reqList = getMongoOperation().aggregate(agg, "ALMTestCases", TestCaseVO.class).getMappedResults();

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}

		return levellist;
	}

	public static List<String> getGlobalLevelIdExecution(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		logger.info("Fetching Global LevelId ALM Execution..");

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);

		List<TestExecutionVO> reqList = null;
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup().from("levelId").localField("levelId")
				.foreignField("levelId").as("duplication");

		MatchOperation match = new MatchOperation(Criteria.where("duplication.levelId").in(levelIdList));

		GroupOperation group = new GroupOperation(Fields.fields("testID").and("duplication.level2"));

		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.push(new BasicDBObject("testID", "$testID").append("_id", "$_id")).as("duplication"));

		reqList = getMongoOperation().aggregate(agg, "ALMTestExecution", TestExecutionVO.class).getMappedResults();

		for (int i = 0; i < reqList.size(); i++) {
			levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}

		return levellist;
	}
}
