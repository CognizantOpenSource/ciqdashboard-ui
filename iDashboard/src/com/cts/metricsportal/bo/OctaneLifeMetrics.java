package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.dao.OctaneMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.OctaneDataVO;

public class OctaneLifeMetrics {

DateTimeCalc dateTimeCalc = new DateTimeCalc();
	
	static final Logger logger = Logger.getLogger(OctaneLifeMetrics.class);
	
	 
	 /*
		 * Octane Defects Starts here
		 * */
	
	public List<String> getOctaneProjectDetails(String authString) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException {
		List<String> projectcoll = null;

		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if(authenticateToken){
			projectcoll = OctaneMongoOperations.getOctaneProjectDetails();

		}

		return projectcoll;

	}
	
	public List<String> getOctaneCurrentSprint(String authString,String dashboardName,String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			List<String> sprintDetails = null;
			
			boolean authenticateToken = LayerAccess.authenticateToken(authString);

			 if(authenticateToken){
				 sprintDetails  = OctaneMongoOperations.getOctaneCurrentSprint(workspaceName);
			 }
			return sprintDetails;
				
		}

	public long getDaysLeftInSprint(String authString,String dashboardName,String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			long daysLeft = 0;
			
			boolean authenticateToken = LayerAccess.authenticateToken(authString);
			 
			 if(authenticateToken){
				 daysLeft = OctaneMongoOperations.getDaysLeftInSprint(dashboardName, workspaceName);
			 }

			return daysLeft;
	}
	
	public long getBacklogCount(String authString,String dashboardName,String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			long backlogCount = 0;
			
			AuthenticationService UserEncrypt = new AuthenticationService();
			boolean authenticateToken = LayerAccess.authenticateToken(authString);
			
			 if(authenticateToken){
				 backlogCount = OctaneMongoOperations.getBacklogCount(dashboardName, workspaceName);
			 }
			 return backlogCount;
			
	}
	
	public List<OctaneDataVO> getSprintStatus(String authString,String dashboardName,
			String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();
			
			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			boolean authenticateToken = LayerAccess.authenticateToken(authString);
			 
			 if(authenticateToken){
				 statusList = OctaneMongoOperations.getSprintStatus(dashboardName, workspaceName, sprintSelected);
			 }
			return statusList;
	}
	
	public List<OctaneDataVO> getSprintVelocity(String authString,String dashboardName,
			String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
				List<OctaneDataVO> velocityList = new ArrayList<OctaneDataVO>();
				
				AuthenticationService UserEncrypt = new AuthenticationService();
				boolean authenticateToken = LayerAccess.authenticateToken(authString);
				 
				 if(authenticateToken){
					 velocityList = OctaneMongoOperations.getSprintVelocity(dashboardName, workspaceName, sprintSelected);
				 }
				return velocityList;
		}
	
	public List<OctaneDataVO> getHourInvested(String authString,String dashboardName,
	String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		
		List<OctaneDataVO> hourList = new ArrayList<OctaneDataVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		 
		 if(authenticateToken){
			 hourList = OctaneMongoOperations.getHourInvested(dashboardName, workspaceName, sprintSelected);
		 }
		return hourList;
	}
	
	public long getOctaneDefectCount(String authString, String dashboardName, String workspaceName, String OctaneSprintId) throws ParseException {
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		
		long defCount =0;
		
			if(authenticateToken){
				try {
					
					defCount = OctaneMongoOperations.getOctaneDefectCount(dashboardName, userId, workspaceName, OctaneSprintId);
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					logger.error(e.getMessage());
				}
				
			}
			return defCount;
	}
	

	/*public List<DefectTrendVO> getDefecttrendchart(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException{
		
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		List<DefectTrendVO> trendvolist=null;
		if(authenticateToken){	
			try {
				
				trendvolist = OctaneMongoOperations.getDefecttrendchartQuery(dashboardName, userId, workspaceName, OctaneSprintId);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(trendvolist != null && !trendvolist.isEmpty())
				return trendvolist;
		}		
		
			return trendvolist;		

	}*/

	public List<OctaneDataVO> getOctaneDefectSeveritychart(String authString, String dashboardName, String workspaceName, String sprintSelected) throws ParseException, JsonParseException, JsonMappingException, IOException {
		
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		List<OctaneDataVO> result=null;

		if(authenticateToken){
			try {
				
				result = OctaneMongoOperations.getOctaneDefectSeveritychart(dashboardName, userId, workspaceName, sprintSelected);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			
		}		
		
			return result;	
	}

	public List<Long> getOctaneDefectStatusChart(String authString, String dashboardName, String workspaceName, String OctaneSprintId) throws ParseException,
	JsonMappingException, IOException {
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		List<Long> result=null;

		if(authenticateToken){
			try {
				
				result=OctaneMongoOperations.getOctaneDefectStatusChart(dashboardName, userId, workspaceName, OctaneSprintId);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(result != null && !result.isEmpty())
				return result;
			}
		return result;	
	}

public List<OctaneDataVO> getOctaneDefectPrioritychart(String authString, String dashboardName, String workspaceName, String sprintSelected) throws ParseException, JsonParseException, JsonMappingException, IOException {
		
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		List<OctaneDataVO> result=null;

		if(authenticateToken){
			try {
				
				result = OctaneMongoOperations.getOctaneDefectPrioritychart(dashboardName, userId, workspaceName, sprintSelected);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			
		}		
		
			return result;	
	}
}
