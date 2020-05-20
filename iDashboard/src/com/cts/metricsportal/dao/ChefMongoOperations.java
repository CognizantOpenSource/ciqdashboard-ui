package com.cts.metricsportal.dao;
	
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.ChefLastRunsOnNodesVO;
import com.cts.metricsportal.vo.ChefNodesVO;
import com.cts.metricsportal.vo.ChefRunsNodeVO;
import com.cts.metricsportal.vo.ChefRunsStatusDetailsCountVO;
import com.cts.metricsportal.vo.ChefRunsStatusVO;
import com.cts.metricsportal.vo.ChefRunsTrendVO;
import com.cts.metricsportal.vo.ChefRunsVO;
import com.cts.metricsportal.vo.UserVO;
	
public class ChefMongoOperations extends BaseMongoOperation {
	static final Logger logger = Logger.getLogger(ChefMongoOperations.class);
	
	public static List<UserVO> authenticate1Query(String username, String password) {
		Query query = new Query();
		query.addCriteria(Criteria.where("userId").is(username));
		query.addCriteria(Criteria.where("password").is(password));
		List<UserVO> userDetails = new ArrayList<UserVO>();

		try {
			userDetails = getMongoOperation().find(query, UserVO.class);
		} catch (NumberFormatException e) {

			logger.error(e.getMessage());
		} catch (BaseException e) {

			logger.error(e.getMessage());
		} catch (BadLocationException e) {

			logger.error(e.getMessage());
		}
		
		return userDetails;
		
	}
	
	public static long getTotalRunsSuccessCountQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
	String query = "{},{_id:0}";
	long runsCount=0;
	
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		query1.addCriteria(Criteria.where("status").is("success"));
		
		runsCount = getMongoOperation().count(query1, ChefRunsVO.class);
		
		return runsCount;
		
			
	}
	
	public static long getTotalRunsCountForCookbookQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException{
		long runsCount=0;
		
			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
			runsCount = getMongoOperation().count(query1, ChefRunsVO.class);
			
			return runsCount;
			
	}
	
	public static long getTotalReportCountQuery() throws NumberFormatException, BaseException, BadLocationException {
		long runsCount=0;
		
			String query = "{},{_id:0}";
			Query query1 = new BasicQuery(query);
			runsCount = getMongoOperation().count(query1, ChefRunsVO.class);
			
			 return runsCount;
			 
	}
	
	public static long getTotalRunsCountForCookbookForNodeQuery(String nodeName, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		long runsCount=0;
		String query = "{},{_id:0}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("nodename").is(nodeName));
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		runsCount = getMongoOperation().count(query1, ChefRunsVO.class);
		
		return runsCount;
		
	}
	
	public static long getTotalRunsSuccessCountForNodeQuery(String nodeName, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		long runsCount =0;
		String query = "{},{_id:0}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("nodename").is(nodeName));
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		query1.addCriteria(Criteria.where("status").is("success"));
		runsCount = getMongoOperation().count(query1, ChefRunsVO.class);
		
		return runsCount;
		
		
	}
	
	public static List<String> getRecordsRunsCookbookNamesQuery() throws NumberFormatException, BaseException, BadLocationException{
		List<String> cookbookNamesList=null;
		
			Query query = new Query();
			cookbookNamesList = getMongoOperation().getCollection("cookbookruns").distinct("cookbookname", query.getQueryObject());
			
			return cookbookNamesList;
			
		
	}
	
	private static List<ChefLastRunsOnNodesVO> getlastrunsNodesListQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException{
		List<ChefLastRunsOnNodesVO> lastrunsNodesList=null;
		Aggregation agg = newAggregation(
				match(Criteria.where("cookbookname").is(cookbookName)),
				group("nodename").max("starttime").as("latestrun"),
				project("latestrun").and("nodename").previousOperation(),
				sort(Sort.Direction.DESC, "latestrun"));
		AggregationResults<ChefLastRunsOnNodesVO> groupResults;
		groupResults = getMongoOperation()
					.aggregate(agg, ChefRunsVO.class, ChefLastRunsOnNodesVO.class);
			lastrunsNodesList = groupResults.getMappedResults();
			
			return lastrunsNodesList;
		
	}
	
	
	public static List<ChefRunsVO> getLastRunDetailsQuery(int itemsPerPage, int start_index, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefLastRunsOnNodesVO> lastrunsNodesList = null;
		List<ChefRunsVO> lastrunsList=new ArrayList<ChefRunsVO>();
		
			lastrunsNodesList = getlastrunsNodesListQuery(cookbookName);
			for (ChefLastRunsOnNodesVO lastrunNodesDetails : lastrunsNodesList) {
				
				String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";
				Query query1 = new BasicQuery(query);
				query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
				query1.addCriteria(Criteria.where("nodename").is(lastrunNodesDetails.getNodename()));
				query1.addCriteria(Criteria.where("starttime").is(lastrunNodesDetails.getLatestrun()));
				ChefRunsVO lastrunOnNode = getMongoOperation().find(query1, ChefRunsVO.class).get(0);
				String startTimeStr = lastrunOnNode.getStarttime();
				DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date startDate = null;
				String startTimestamp = "";
				try {
					startDate = formatter.parse(startTimeStr);
				}
				catch (ParseException pe) {
					startTimestamp = startTimeStr;
				}
				startTimestamp = DateFormat.getDateTimeInstance().format(startDate);
				lastrunOnNode.setStarttime(startTimestamp);
				lastrunsList.add(lastrunOnNode);
				
			}
			
			return lastrunsList;
			
			
		
	}
	
	public static List<ChefRunsVO> getLastRunDetailsForNodeQuery(String nodeName, String cookbookName) throws NumberFormatException, BaseException, BadLocationException{
		List<ChefRunsVO> lastRunsListForNode=null;
		
		String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("nodename").is(nodeName));
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		query1.with(new Sort(Sort.Direction.DESC, "starttime"));	
		query1.limit(5);

		lastRunsListForNode = getMongoOperation().find(query1, ChefRunsVO.class);
			
		return lastRunsListForNode;
		
		}
	
	
	private static List<ChefLastRunsOnNodesVO> lastrunsSuccessNodesListQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException{
		List<ChefLastRunsOnNodesVO> lastrunsSuccessNodesList=null;
		Aggregation agg = newAggregation(
				match(Criteria.where("cookbookname").is(cookbookName)),
				match(Criteria.where("status").is("success")),
				group("nodename").max("starttime").as("latestrun"),
				project("latestrun").and("nodename").previousOperation(),
				//project("status").andInclude("status"),
				sort(Sort.Direction.DESC, "latestrun"));
		AggregationResults<ChefLastRunsOnNodesVO> groupResults = getMongoOperation()
				.aggregate(agg, ChefRunsVO.class, ChefLastRunsOnNodesVO.class);
		lastrunsSuccessNodesList = groupResults.getMappedResults();
		
		return lastrunsSuccessNodesList;
		
		
	}
	
	public static List<ChefRunsVO> getLastRunDetailsQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException{
		List<ChefRunsVO> lastSuccessfulRunsList=new ArrayList<ChefRunsVO>();
		
		List<ChefLastRunsOnNodesVO> lastrunsSuccessNodesList = lastrunsSuccessNodesListQuery(cookbookName);
		for (ChefLastRunsOnNodesVO lastrunNodesDetails : lastrunsSuccessNodesList) {
			
			String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";

			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
			query1.addCriteria(Criteria.where("nodename").is(lastrunNodesDetails.getNodename()));
			query1.addCriteria(Criteria.where("starttime").is(lastrunNodesDetails.getLatestrun()));
			
			ChefRunsVO lastrunOnNode = getMongoOperation().find(query1, ChefRunsVO.class).get(0);
			
			String startTimeStr = lastrunOnNode.getStarttime();
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate = null;
			String startTimestamp = "";
			try {
				startDate = formatter.parse(startTimeStr);
			}
			catch (ParseException pe) {
				System.out.println("inside /chefGetLastSuccessfulRunDetails, getLastSuccessfulRunDetails() Parse Exception Occurred,  startTimeStr = " + startTimeStr);
				startTimestamp = startTimeStr;
			}
			startTimestamp = DateFormat.getDateTimeInstance().format(startDate);
			lastrunOnNode.setStarttime(startTimestamp);
			
			lastSuccessfulRunsList.add(lastrunOnNode);
			
		}
		
		return lastSuccessfulRunsList;
		
	}
	
	private static List<ChefLastRunsOnNodesVO> lastrunsCookbookOnNodesListQuery(String nodeName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefLastRunsOnNodesVO> lastrunsCookbookOnNodesList = null;
		Aggregation agg = newAggregation(
				match(Criteria.where("nodename").is(nodeName)),
				match(Criteria.where("status").is("success")),
				group("cookbookname").max("starttime").as("latestrun"),
				project("latestrun").and("cookbookname").previousOperation(),
				//project("status").andInclude("status"),
				sort(Sort.Direction.DESC, "latestrun"));
		AggregationResults<ChefLastRunsOnNodesVO> groupResults = getMongoOperation()
				.aggregate(agg, ChefRunsVO.class, ChefLastRunsOnNodesVO.class);
		lastrunsCookbookOnNodesList = groupResults.getMappedResults();
		
		return lastrunsCookbookOnNodesList;
	}
	
	public static List<ChefRunsVO> getSuccessfulCookbooksRunForNodeQuery(String nodeName, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefRunsVO> lastSuccessfulCookbookRunsOnNodesList=new ArrayList<ChefRunsVO>();
		List<ChefLastRunsOnNodesVO> lastrunsCookbookOnNodesList=lastrunsCookbookOnNodesListQuery(nodeName);
		
		for (ChefLastRunsOnNodesVO lastrunCookbookOnNodesDetails : lastrunsCookbookOnNodesList) {
			
			String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";

			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("cookbookname").is(lastrunCookbookOnNodesDetails.getCookbookname()));
			query1.addCriteria(Criteria.where("nodename").is(nodeName));
			query1.addCriteria(Criteria.where("starttime").is(lastrunCookbookOnNodesDetails.getLatestrun()));
			
			ChefRunsVO lastCookbookrunOnNode = getMongoOperation().find(query1, ChefRunsVO.class).get(0);
			
			String startTimeStr = lastCookbookrunOnNode.getStarttime();
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate = null;
			String startTimestamp = "";
			try {
				startDate = formatter.parse(startTimeStr);
			}
			catch (ParseException pe) {
				System.out.println("inside /chefGetSuccessfulCookbooksRunForNode, getSuccessfulCookbooksRunForNode() Parse Exception Occurred,  startTimeStr = " + startTimeStr);
				startTimestamp = startTimeStr;
			}
			startTimestamp = DateFormat.getDateTimeInstance().format(startDate);
			lastCookbookrunOnNode.setStarttime(startTimestamp);
			
			lastSuccessfulCookbookRunsOnNodesList.add(lastCookbookrunOnNode);
			
		}
		
		return lastSuccessfulCookbookRunsOnNodesList;
	}
	
	public static List<ChefRunsVO> lastSuccessfulRunsListForNodeQuery(String nodeName, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefRunsVO> lastSuccessfulRunsListForNode=new ArrayList<ChefRunsVO>();
		
		String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("nodename").is(nodeName));
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		query1.addCriteria(Criteria.where("status").is("success"));
		query1.with(new Sort(Sort.Direction.DESC, "starttime"));	
		query1.limit(5);
		lastSuccessfulRunsListForNode = getMongoOperation().find(query1, ChefRunsVO.class);
		
		return lastSuccessfulRunsListForNode;
	}
	
	public static List<ChefRunsVO> runsListQuery(int itemsPerPage, int start_index, String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefRunsVO> runsList=null;
		String query = "{},{_id:0,cookbookname:1,runid:1,status:1,starttime:1,endtime:1,nodename:1}";
		
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("cookbookname").is(cookbookName));
		query1.skip(itemsPerPage * (start_index - 1));
		query1.limit(itemsPerPage);
		runsList = getMongoOperation().find(query1, ChefRunsVO.class);
		
		return runsList;
	}
	
	public static ChefNodesVO getRunNodesRecordsQuery(String nodeName) throws NumberFormatException, BaseException, BadLocationException {
		ChefNodesVO runNodeDetails =null;
		String query = "{},{_id:0,name:1,envname:1,platform:1,hostname:1,local_hostname:1,local_ipv4:1,public_ipv4:1,fqdn:1,uptime:1,idletime:1}";
	    Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("envname").is(nodeName.trim()));
		runNodeDetails = getMongoOperation().find(query1,ChefNodesVO.class).get(0);
		
		return runNodeDetails;
	}
	
	public static List<ChefRunsStatusVO> getRunsbarchartQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefRunsStatusVO> result = null;
		Aggregation agg = newAggregation(
				match(Criteria.where("cookbookname").is(cookbookName)),
				group("status").count().as("statusCnt"),
				project("statusCnt").and("status").previousOperation());
		AggregationResults<ChefRunsStatusVO> groupResults = getMongoOperation()
				.aggregate(agg, ChefRunsStatusVO.class,
						ChefRunsStatusVO.class);
		result = groupResults.getMappedResults();
		
		return result;
	}
	
	public static List<ChefRunsStatusDetailsCountVO> getRunsmultibarchartQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		
		List<ChefRunsStatusDetailsCountVO> finalresult = new ArrayList<ChefRunsStatusDetailsCountVO>();
		
			List<ChefLastRunsOnNodesVO> lastrunsNodesList = null;
			lastrunsNodesList=getlastrunsNodesListQuery(cookbookName);
			Aggregation aggL;
			String nodeName;
			for (ChefLastRunsOnNodesVO lastrunNodesDetails : lastrunsNodesList) {
				nodeName = lastrunNodesDetails.getNodename();
				aggL = newAggregation(
						match(Criteria.where("nodename").is(nodeName)),
						match(Criteria.where("cookbookname").is(cookbookName)),
						group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());
				AggregationResults<ChefRunsStatusVO> groupNodeResults = getMongoOperation()
						.aggregate(aggL, ChefRunsStatusVO.class, ChefRunsStatusVO.class);
				List<ChefRunsStatusVO> nodewiseresults = groupNodeResults.getMappedResults();
				ChefRunsStatusDetailsCountVO runStatusDetailsCount = new ChefRunsStatusDetailsCountVO();
				String metrics;
				ChefRunsStatusVO nodewiseresult;
				int abortedCount;
				int failureCount;
				int successCount;
				
				for (int j = 0; j < nodewiseresults.size(); j++) {
					nodewiseresult = nodewiseresults.get(j);
					metrics = nodeName;
					runStatusDetailsCount.setMetrics(metrics);
					if(nodewiseresult.getStatus().equalsIgnoreCase("aborted")){
						abortedCount = nodewiseresult.getStatusCnt();
						runStatusDetailsCount.setAbortedCount(abortedCount);
					} 
					else if (nodewiseresult.getStatus().equalsIgnoreCase("failure")) {
						failureCount = nodewiseresult.getStatusCnt();
						runStatusDetailsCount.setFailureCount(failureCount);
					} 
					else if (nodewiseresult.getStatus().equalsIgnoreCase("success")) {
						successCount = nodewiseresult.getStatusCnt();
						runStatusDetailsCount.setSuccessCount(successCount);
					}
				}				
				finalresult.add(runStatusDetailsCount);
			}
			
			return finalresult;
	}
	
	public static List<ChefRunsNodeVO> getRunsOnEachNodeChartDataQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		List<ChefRunsNodeVO> result = null;
		
			Aggregation agg = newAggregation(
					match(Criteria.where("cookbookname").is(cookbookName)),
					group("nodename").count().as("nodeCnt"),
					project("nodeCnt").and("nodename").previousOperation(),
					sort(Direction.DESC, "nodeCnt"));
			AggregationResults<ChefRunsNodeVO> groupResults = getMongoOperation()
					.aggregate(agg, ChefRunsVO.class,
							ChefRunsNodeVO.class);
			result = groupResults.getMappedResults();
			
			return result;
		
	}
	
	public static List<ChefRunsTrendVO> getRunstrendchartQuery(String cookbookName) throws NumberFormatException, BaseException, BadLocationException {
		ChefRunsTrendVO runstrendvo =null;
		List<ChefRunsTrendVO> trendvolist = new ArrayList<ChefRunsTrendVO>();
		
			Aggregation agg = newAggregation(
					match(Criteria.where("cookbookname").is(cookbookName)),
					group("creationTime").count().as("count"), 
					project("count").and("creationTime").previousOperation(), 
					sort(Direction.ASC, "creationTime"));
			AggregationResults<ChefRunsStatusVO> groupResults = getMongoOperation()
					.aggregate(agg, ChefRunsVO.class,
							ChefRunsStatusVO.class);
			List<ChefRunsStatusVO> result = groupResults.getMappedResults();
			
			for (int i = 0; i < result.size(); i++) {

				int iSuccess = 0;
				int iFailure = 0;
				int iAborted = 0;
				int iNoStatus = 0;

				List<ChefRunsStatusVO> result1 = new ArrayList<ChefRunsStatusVO>();
				Aggregation agg1 = newAggregation(
						match(Criteria.where("cookbookname").is(cookbookName)),
						match(Criteria.where("creationTime").is(result.get(i).getCreationTime())),
						group("status").count().as("statusCnt"),
						project("statusCnt").and("status").previousOperation());
				AggregationResults<ChefRunsStatusVO> groupResultsFinal = getMongoOperation()
						.aggregate(agg1, ChefRunsVO.class, ChefRunsStatusVO.class);
				
				result1 = groupResultsFinal.getMappedResults();
				Date dateString = result.get(i).getCreationTime();

				runstrendvo = new ChefRunsTrendVO();
				
				try {
					for (int j = 0; j < result1.size(); j++) {
						if (result1.get(j).getStatus().equalsIgnoreCase("Success")) {
							iSuccess = result1.get(j).getStatusCnt();
							runstrendvo.setSuccess(iSuccess);
						}
						else if (result1.get(j).getStatus().equalsIgnoreCase("Failure")) {
							iFailure = result1.get(j).getStatusCnt();
							runstrendvo.setFailure(iFailure);
						}
						else if (result1.get(j).getStatus().equalsIgnoreCase("Aborted")) {
							iAborted = result1.get(j).getStatusCnt();
							runstrendvo.setAborted(iAborted);
						}
						else if (result1.get(j).getStatus().equalsIgnoreCase("")) {
							iNoStatus = result1.get(j).getStatusCnt();
							runstrendvo.setNostatus(iNoStatus);
						}
					}
				} 
				catch (Exception e) {
					System.out.println("exception caught" + e.getMessage());
				}
				Date date = new Date();
				date = dateString;
				SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				String format = formatter.format(date);
				String strExistingFlag = "False";

				for (ChefRunsTrendVO chartVO : trendvolist) {
					String strDate = chartVO.getDate();
					if (strDate.toString().equals((format.toString()))) {
						chartVO.setSuccess(iSuccess + chartVO.getSuccess());
						chartVO.setFailure(iFailure + chartVO.getFailure());
						chartVO.setAborted(iAborted + chartVO.getAborted());
						chartVO.setNostatus(iNoStatus + chartVO.getNostatus());

						strExistingFlag = "True";
						break;
					}
				}
				if (strExistingFlag.equalsIgnoreCase("False")) {
					runstrendvo.setDate(format);
					runstrendvo.setMydate(dateString);
					trendvolist.add(runstrendvo);
				}
			}
			
			return trendvolist;
		
	}
	
	
	
}
	
