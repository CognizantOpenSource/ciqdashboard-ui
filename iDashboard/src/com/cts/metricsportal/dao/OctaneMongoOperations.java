package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.OctaneDataVO;
import com.cts.metricsportal.vo.OctaneDefectVO;
import com.cts.metricsportal.vo.OctaneDetailsVO;
import com.cts.metricsportal.vo.OctaneStoryVO;

public class OctaneMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(OctaneMongoOperations.class);
	
	@SuppressWarnings("unchecked")
	public static List<String> getOctaneProjectDetails() throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException {
		List<String> projectcoll = null;

			projectcoll = getMongoOperation().getCollection("OctaneUserStory").distinct("projectName");

		return projectcoll;
	}
	
	public static List<String> getOctaneSprint(String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			List<String> sprintDetails = new ArrayList<String>();

			if(workspaceName != null && (!workspaceName.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED)))
			{
				//get Today's date DD-MM-YYYT00:00:00Z
				
				
				Date currentDate = new Date();
				Calendar cal = Calendar.getInstance();
				cal.setTime(currentDate);
				cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0); cal.set(Calendar.SECOND, 1);
				Date todayDate = cal.getTime();
				
				Query query1 = new Query();
				query1.addCriteria(Criteria.where("projectName").in(workspaceName));
				query1.addCriteria(Criteria.where("startDate").lte(todayDate));
				query1.addCriteria(Criteria.where("endDate").gte(todayDate));
				
				
				//get distinct issueSprintName
				List<String> allSprint = getMongoOperation().getCollection("OctaneSprint").distinct("sprintId", query1.getQueryObject());
				
				
				if(!allSprint.isEmpty())
				{
					Query query2 = new Query();
					query2.addCriteria(Criteria.where("sprintName").in(allSprint));
					
					List<String> allRelease = getMongoOperation().getCollection("OctaneSprint").distinct("releaseId", query1.getQueryObject());
					
					sprintDetails.add(allSprint.get(0));
					sprintDetails.add(allRelease.get(0));
					
				}
			}
			

		return sprintDetails;
	}
	
	@SuppressWarnings("unchecked")
	public static List<String> getOctaneSprintDetails(String workspaceName) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
		List<String> sprintDetails = new ArrayList<String>();
		List<OctaneDetailsVO> sprintdet = new ArrayList<OctaneDetailsVO>();
		Date currentDate = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(currentDate);
		cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0); cal.set(Calendar.SECOND, 1);
		Date todayDate = cal.getTime();
		
		if(workspaceName != null && (!workspaceName.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED)))
		{
			Query currSprint = new Query();
			currSprint.addCriteria(Criteria.where("projectName").in(workspaceName));
			currSprint.addCriteria(Criteria.where("startDate").lte(todayDate));
			List<Date> startdateList = getMongoOperation().getCollection("OctaneSprint").distinct("startDate",currSprint.getQueryObject());
			startdateList.remove(null);
			
			Collections.sort(startdateList);
			
			int listSize = startdateList.size();
			
			if(listSize>0)
			{
				List<Date> listDetails = new ArrayList<Date>();
				
				listDetails.add(startdateList.get(listSize-1));
				listDetails.add(startdateList.get(listSize-2));
				listDetails.add(startdateList.get(listSize-3));
				listDetails.add(startdateList.get(listSize-4));
				
				
				Query query0 = new Query();
				query0.addCriteria(Criteria.where("projectName").in(workspaceName));
				query0.addCriteria(Criteria.where("startDate").in(listDetails));
				query0.with(new Sort(Sort.Direction.ASC,"startDate"));
				
				//sprintDetails = getMongoOperation().getCollection("OctaneSprint").distinct("sprintId",query0.getQueryObject());
				sprintdet = getMongoOperation().find(query0, OctaneDetailsVO.class);
				//sprintdetails in reverse order --> last, secondLast, thirdLast
				sprintDetails.add(0, sprintdet.get(3).getSprintId());
				sprintDetails.add(1, sprintdet.get(2).getSprintId());
				sprintDetails.add(2, sprintdet.get(1).getSprintId());
				sprintDetails.add(3, sprintdet.get(0).getSprintId());
			}
			
			
		}
		return sprintDetails;
	}
	
	public static List<String> getOctaneCurrentSprint(String workspaceName) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
		List<String> sprintName = new ArrayList<String>();

		if(workspaceName != null && (!workspaceName.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED)))
		{
			String currentSprintId = getOctaneSprint(workspaceName).get(0);
		
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("projectName").in(workspaceName));
			query1.addCriteria(Criteria.where("sprintId").is(currentSprintId));
		
			sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", query1.getQueryObject());
		
		}
	
		return sprintName;
	}
	public static long getDaysLeftInSprint(String dashboardName,String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			long daysLeft = 0;
			
			if(workspaceName != null && (!workspaceName.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED)))
			{
				List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
				
				Query query1 = new Query();
				query1.addCriteria(Criteria.where("projectName").in(workspaceName));
				query1.addCriteria(Criteria.where("sprintId").is(sprintDetailsList.get(0)));
		
				try {
					//get distinct sprintName
					List<Date> sprintEndDate = getMongoOperation().getCollection("OctaneSprint").distinct("endDate", query1.getQueryObject());
					Date daysleft = sprintEndDate.get(0);
					Date todayDate = new Date();
					daysLeft = daysleft.getTime()-todayDate.getTime();  //in millisec
				}
				catch(IndexOutOfBoundsException e)
				{
					e.printStackTrace();
				}
				
			}
			return daysLeft = daysLeft/(24 * 60 * 60 * 1000);
			

	}
	public static long getBacklogCount(String dashboardName,String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			long backlogCount = 0;
			
			if(workspaceName != null && (!workspaceName.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED)))
			{
				//get current Sprint Info
				String currentSprint = getOctaneSprint(workspaceName).get(0);
				String currentRelease = getOctaneSprint(workspaceName).get(1);
				
				Query query0 = new Query();
				query0.addCriteria(Criteria.where("projectName").in(workspaceName));
				query0.addCriteria(Criteria.where("sprintId").is(currentSprint));
				query0.addCriteria(Criteria.where("releaseId").is(currentRelease));
			
					
				long backlogUser = getMongoOperation().count(query0, OctaneStoryVO.class);
				long backlogDefect = getMongoOperation().count(query0, OctaneDefectVO.class);
				
				backlogCount = backlogUser+backlogDefect;
			}
			
			return backlogCount;

	}
	
	@SuppressWarnings("unchecked")
	public static List<OctaneDataVO> getSprintStatus(String dashboardName, String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		
				int k =0; int j=0;
				long done =0; long inprogress =0; long todo =0;
				OctaneDataVO dataObj =null;
				List<OctaneDataVO> statusdet= new ArrayList<OctaneDataVO>(); 
			
				List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
				
				if(sprintSelected.equalsIgnoreCase("current"))
				{
					j=0; k=1;
				}
				else if(sprintSelected.equalsIgnoreCase("lasttwo"))
				{
					j=1; k=3;
				}
				
				else if(sprintSelected.equalsIgnoreCase("lastthree"))
				{
					j=1; k=4;	
				}
				
				for(int i=j; i<k; i++)
				{
					dataObj = new OctaneDataVO();
					
					//get Sprint Name First
					Query sname = new Query();
					sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					sname.addCriteria(Criteria.where("projectName").in(workspaceName));
					List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
					
					Query query0 = new Query();
					query0.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					query0.addCriteria(Criteria.where("projectName").in(workspaceName));
					query0.addCriteria(Criteria.where("storyPhaseId").is("phase.story.done"));
					done = getMongoOperation().count(query0, OctaneStoryVO.class);
					
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					query1.addCriteria(Criteria.where("projectName").in(workspaceName));
					query1.addCriteria(Criteria.where("storyPhaseId").is("phase.story.inprogress"));
					inprogress = getMongoOperation().count(query1, OctaneStoryVO.class);
					
					Query query2 = new Query();
					query2.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					query2.addCriteria(Criteria.where("projectName").in(workspaceName));
					query2.addCriteria(Criteria.where("storyPhaseId").is("phase.story.new"));
					todo = getMongoOperation().count(query2, OctaneStoryVO.class);
					
					dataObj.setSprintName(sprintName.get(0));
					dataObj.setStoryCompleted(done);
					dataObj.setStoryInprogress(inprogress);
					dataObj.setStoryTodo(todo);
					
					statusdet.add(dataObj);
				}
		
				return statusdet;
	}
	
	@SuppressWarnings("unchecked")
	public static List<OctaneDataVO> getSprintVelocity(String dashboardName,
			String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
				
				int k =0; int j=0;
				List<OctaneStoryVO> totalStoryPoint = null;
				List<OctaneStoryVO> doneStoryPoint = null;
				long plannedStorypoint = 0; long completedStorypoint =0;
				
				OctaneDataVO dataObj =null;
				List<OctaneDataVO> velList= new ArrayList<OctaneDataVO>(); 
			
				List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
				
				if(sprintSelected.equalsIgnoreCase("current"))
				{
					j=0; k=1;
				}
				else if(sprintSelected.equalsIgnoreCase("lasttwo"))
				{
					j=1; k=3;
				}
				
				else if(sprintSelected.equalsIgnoreCase("lastthree"))
				{
					j=1; k=4;	
				}
				
				for(int i=j; i<k; i++)
				{
					dataObj = new OctaneDataVO();
					
					//get Sprint Name First
					Query sname = new Query();
					sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					sname.addCriteria(Criteria.where("projectName").in(workspaceName));
					List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
					
					Query query0 = new Query();
					query0.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					query0.addCriteria(Criteria.where("projectName").in(workspaceName));
					totalStoryPoint = getMongoOperation().find(query0, OctaneStoryVO.class);
					
					for(OctaneStoryVO tsp :totalStoryPoint)
					{
						if(tsp.getStoryPoints() != null)
						plannedStorypoint += tsp.getStoryPoints();
					}
					
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
					query1.addCriteria(Criteria.where("projectName").in(workspaceName));
					query1.addCriteria(Criteria.where("storyPhaseId").is("phase.story.done"));
					doneStoryPoint = getMongoOperation().find(query1, OctaneStoryVO.class);
					
					for(OctaneStoryVO dsp : doneStoryPoint)
					{
						if(dsp.getStoryPoints() != null)
						completedStorypoint += dsp.getStoryPoints();
					}
					
					dataObj.setSprintName(sprintName.get(0));
					dataObj.setPlannedStorypoint(plannedStorypoint);
					dataObj.setCompletedStorypoint(completedStorypoint);
					
					velList.add(dataObj);
				}
				return velList;
	}
	
	@SuppressWarnings("unchecked")
	public static List<OctaneDataVO> getHourInvested(String dashboardName, String workspaceName, String sprintSelected) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	{
		int k =0; int j=0;
		List<OctaneStoryVO> storyHours = null;
		List<OctaneDefectVO> defectHours = null;
		long totalhours = 0;
		
		OctaneDataVO dataObj =null;
		List<OctaneDataVO> hoursList= new ArrayList<OctaneDataVO>(); 
	
		List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
		
		if(sprintSelected.equalsIgnoreCase("current"))
		{
			j=0; k=1;
		}
		else if(sprintSelected.equalsIgnoreCase("lasttwo"))
		{
			j=1; k=3;
		}
		
		else if(sprintSelected.equalsIgnoreCase("lastthree"))
		{
			j=1; k=4;	
		}
		
		for(int i=j; i<k; i++)
		{
			dataObj = new OctaneDataVO();
			
			//get Sprint Name First
			Query sname = new Query();
			sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			sname.addCriteria(Criteria.where("projectName").in(workspaceName));
			List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
			
			Query query0 = new Query();
			query0.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query0.addCriteria(Criteria.where("projectName").in(workspaceName));
			storyHours = getMongoOperation().find(query0, OctaneStoryVO.class);
			
			for(OctaneStoryVO tsp :storyHours)
			{
				if(tsp.getInvestedHours() != null)
					totalhours += tsp.getInvestedHours();
			}
			
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query1.addCriteria(Criteria.where("projectName").in(workspaceName));
			defectHours = getMongoOperation().find(query1, OctaneDefectVO.class);
			
			for(OctaneDefectVO tsp :defectHours)
			{
				if(tsp.getInvestedHours() != null)
					totalhours += tsp.getInvestedHours();
			}
			
			dataObj.setSprintName(sprintName.get(0));
			dataObj.setInvestedHours(totalhours);
			
			hoursList.add(dataObj);
		}
		return hoursList;
	}
	
	public static long getOctaneDefectCount(String dashboardName, String userId,
			String workspaceName, String OctaneSprintId) throws NumberFormatException, BaseException, BadLocationException {
		long defCount=0;
		logger.info("Fetching Octane Defect Count Filter..");
		
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("projectName").in(workspaceName));
		query1.addCriteria(Criteria.where("sprintId").in(OctaneSprintId));
			
		defCount = getMongoOperation().count(query1, OctaneDefectVO.class);
		return defCount;
	}

/*	public static List<DefectTrendVO> getDefecttrendchartQuery(String dashboardName, String userId, String workspaceName, String OctaneSprintId) throws NumberFormatException, BaseException, BadLocationException {
		
		logger.info("Fetching ALM Defect Count Trend Chart..");
				
		
		return trendvolist;
	}
*/
	public static List<OctaneDataVO> getOctaneDefectSeveritychart(String dashboardName, String userId, String workspaceName, String sprintSelected) throws NumberFormatException, BaseException,
	BadLocationException, JsonParseException, JsonMappingException, IOException {
		
		logger.info("Fetching Octane Defect Severity Chart.");
		List<OctaneDataVO> result= new ArrayList<OctaneDataVO>();
		
		int k =0; int j=0;
		
		
		OctaneDataVO dataObj =null;
	
		List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
		
		if(sprintSelected.equalsIgnoreCase("current"))
		{
			j=0; k=1;
		}
		else if(sprintSelected.equalsIgnoreCase("lasttwo"))
		{
			j=1; k=3;
		}
		
		else if(sprintSelected.equalsIgnoreCase("lastthree"))
		{
			j=1; k=4;	
		}
		
		for(int i=j; i<k; i++)
		{
			dataObj = new OctaneDataVO();
			
			//get Sprint Name First
			Query sname = new Query();
			sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			sname.addCriteria(Criteria.where("projectName").in(workspaceName));
			List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
			
			Query query0 = new Query();
			query0.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query0.addCriteria(Criteria.where("projectName").in(workspaceName));
			query0.addCriteria(Criteria.where("defectSeverityId").is( "list_node.severity.urgent")); 
			long defUrgent = getMongoOperation().count(query0, OctaneDefectVO.class);
			
			
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query1.addCriteria(Criteria.where("projectName").in(workspaceName));
			query1.addCriteria(Criteria.where("defectSeverityId").is( "list_node.severity.very_high")); 
			long defVeryHigh = getMongoOperation().count(query1, OctaneDefectVO.class);
			
			Query query2 = new Query();
			query2.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query2.addCriteria(Criteria.where("projectName").in(workspaceName));
			query2.addCriteria(Criteria.where("defectSeverityId").is( "list_node.severity.high")); 
			long defHigh = getMongoOperation().count(query2, OctaneDefectVO.class);
			
			Query query3 = new Query();
			query3.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query3.addCriteria(Criteria.where("projectName").in(workspaceName));
			query3.addCriteria(Criteria.where("defectSeverityId").is( "list_node.severity.medium")); 
			long defMed = getMongoOperation().count(query3, OctaneDefectVO.class);
			
			Query query4 = new Query();
			query4.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query4.addCriteria(Criteria.where("projectName").in(workspaceName));
			query4.addCriteria(Criteria.where("defectSeverityId").is( "list_node.severity.low")); 
			long defLow = getMongoOperation().count(query4, OctaneDefectVO.class);
			
			dataObj.setSprintName(sprintName.get(0));
			dataObj.setDefUrgent(defUrgent);
			dataObj.setDefVery(defVeryHigh);
			dataObj.setDefHigh(defHigh);
			dataObj.setDefMedium(defMed);
			dataObj.setDefLow(defLow);
			
			result.add(dataObj);
		}
					
				/*Aggregation agg = newAggregation(
						match(Criteria.where("projectName").in(workspaceName)),
						match(Criteria.where("sprintId").in(sprintDetailsList.get(0))),
						group("defectPriorityId").count().as("priorityCnt"),
						project("priorityCnt").and("defectPriorityId").previousOperation(),sort(Direction.ASC, "defectPriorityId"));
				AggregationResults<DefectStatusVO> groupResults = getMongoOperation()
						.aggregate(agg, OctaneDefectVO.class, DefectStatusVO.class);
				result = groupResults.getMappedResults();*/
				
			
			return result;
		}

	public static List<Long> getOctaneDefectStatusChart(String dashboardName, String userId, String workspaceName, String sprintSelected) throws NumberFormatException,
	BaseException, BadLocationException, JsonParseException, JsonMappingException, IOException {
		logger.info("Fetching Octane Defect Status..");
		List<Long> result= new ArrayList<Long>();
		
		int k =0; int j=0;
		long defClosed =0;
		long defOpen = 0;
		long defNew =0;
		
		List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
		
		if(sprintSelected.equalsIgnoreCase("current"))
		{
			j=0; k=1;
		}
		else if(sprintSelected.equalsIgnoreCase("lasttwo"))
		{
			j=1; k=3;
		}
		
		else if(sprintSelected.equalsIgnoreCase("lastthree"))
		{
			j=1; k=4;	
		}
		
		for(int i=j; i<k; i++)
		{
			
			//get Sprint Name First
			Query sname = new Query();
			sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			sname.addCriteria(Criteria.where("projectName").in(workspaceName));
			List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
			
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query1.addCriteria(Criteria.where("projectName").in(workspaceName));
			query1.addCriteria(Criteria.where("defectPhaseId").is("phase.defect.closed")); 
			defClosed+= getMongoOperation().count(query1, OctaneDefectVO.class);
			
			Query query2 = new Query();
			query2.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query2.addCriteria(Criteria.where("projectName").in(workspaceName));
			query2.addCriteria(Criteria.where("defectPhaseId").is("phase.defect.open")); 
			defOpen+= getMongoOperation().count(query2, OctaneDefectVO.class);
			
			Query query3 = new Query();
			query3.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query3.addCriteria(Criteria.where("projectName").in(workspaceName));
			query3.addCriteria(Criteria.where("defectPhaseId").is("phase.defect.new")); 
			 defNew+= getMongoOperation().count(query3, OctaneDefectVO.class);
			
			
		}
		result.add(defClosed);
		result.add(defOpen);
		result.add(defNew);
			/*Aggregation agg = newAggregation(
					match(Criteria.where("projectName").in(workspaceName)),
					match(Criteria.where("sprintId").in(OctaneSprintId)),
					group("defectSeverityId").count().as("severityCnt"),
					project("severityCnt").and("defectSeverityId").previousOperation(),sort(Direction.ASC, "defectSeverityId"));
			AggregationResults<DefectStatusVO> groupResults = getMongoOperation()
					.aggregate(agg, OctaneDefectVO.class, DefectStatusVO.class);
			result = groupResults.getMappedResults();*/
		
	return result;
	}

	public static List<DefectStatusVO> getDefectuserchartQuery(String dashboardName, String userId, String workspaceName, String OctaneSprintId) throws NumberFormatException, BaseException, BadLocationException {
		List<DefectStatusVO> result=null;
		logger.info("Fetching ALM Defect User Chart..");
	  
				  Aggregation agg = newAggregation(
							match(Criteria.where("projectName").in(workspaceName)),
							group("assignedto").count().as("usercount"),
							project("usercount").and("assignedto").previousOperation());
						AggregationResults<DefectStatusVO> groupResults = getMongoOperation()
								.aggregate(agg, DefectVO.class, DefectStatusVO.class);
						 result = groupResults.getMappedResults();
				  
			  return result;
			
	}

	public static List<OctaneDataVO> getOctaneDefectPrioritychart(String dashboardName, String userId, String workspaceName, String sprintSelected) throws NumberFormatException, BaseException,
	BadLocationException, JsonParseException, JsonMappingException, IOException {
		
		logger.info("Fetching Octane Defect Priority Chart.");
		List<OctaneDataVO> result= new ArrayList<OctaneDataVO>();
		
		int k =0; int j=0;
		
		
		OctaneDataVO dataObj =null;
	
		List<String> sprintDetailsList = getOctaneSprintDetails(workspaceName);
		
		if(sprintSelected.equalsIgnoreCase("current"))
		{
			j=0; k=1;
		}
		else if(sprintSelected.equalsIgnoreCase("lasttwo"))
		{
			j=1; k=3;
		}
		
		else if(sprintSelected.equalsIgnoreCase("lastthree"))
		{
			j=1; k=4;	
		}
		
		for(int i=j; i<k; i++)
		{
			dataObj = new OctaneDataVO();
			
			//get Sprint Name First
			Query sname = new Query();
			sname.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			sname.addCriteria(Criteria.where("projectName").in(workspaceName));
			List<String> sprintName = getMongoOperation().getCollection("OctaneSprint").distinct("sprintName", sname.getQueryObject());
			
			Query query0 = new Query();
			query0.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query0.addCriteria(Criteria.where("projectName").in(workspaceName));
			query0.addCriteria(Criteria.where("defectPriorityId").is("list_node.priority.urgent")); 
			long priorUrgent = getMongoOperation().count(query0, OctaneDefectVO.class);
			
			
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query1.addCriteria(Criteria.where("projectName").in(workspaceName));
			query1.addCriteria(Criteria.where("defectPriorityId").is("list_node.priority.very_high")); 
			long priorVhigh = getMongoOperation().count(query1, OctaneDefectVO.class);
			
			Query query2 = new Query();
			query2.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query2.addCriteria(Criteria.where("projectName").in(workspaceName));
			query2.addCriteria(Criteria.where("defectPriorityId").is( "list_node.priority.high")); 
			long priorHigh = getMongoOperation().count(query2, OctaneDefectVO.class);
			
			/*Query query3 = new Query();
			query3.addCriteria(Criteria.where("sprintId").in(sprintDetailsList.get(i)));
			query3.addCriteria(Criteria.where("projectName").in(workspaceName));
			query3.addCriteria(Criteria.where("defectSeverityId").is( "list_node.priority.medium")); 
			long defMed = getMongoOperation().count(query3, OctaneDefectVO.class);*/
			
			
			
			dataObj.setSprintName(sprintName.get(0));
			dataObj.setPriorUrgent(priorUrgent);
			dataObj.setPriorVhigh(priorVhigh);
			dataObj.setPriorHigh(priorHigh);
			
			result.add(dataObj);
		}
					
			
			return result;
	}
}
