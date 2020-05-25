package com.cts.metricsportal.controllers;


import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.AlmMetrics;
import com.cts.metricsportal.bo.OctaneLifeMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.OctaneDataVO;
import com.cts.metricsportal.vo.ReqTrendVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TCExecutionOwnerVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestCaseTrendVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExeTrendVO;
import com.cts.metricsportal.vo.TestExecutionVO;


@Path("/OctaneLifeCycleServices")
public class OctaneLifeCycleServices{

	OctaneLifeMetrics octaneMetrics = null;
	

	@GET
	@Path("/octaneprojectdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getOctaneProjectDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<String> projectcoll = null;
		octaneMetrics = new OctaneLifeMetrics();
		projectcoll = octaneMetrics.getOctaneProjectDetails(authString);


		return projectcoll;

	}
	
	@GET
	@Path("/getcurrentsprint")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getOctaneCurrentSprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("projectName") String workspaceName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
			octaneMetrics = new OctaneLifeMetrics();
			List<String> sprintDetails = octaneMetrics.getOctaneCurrentSprint(authString, dashboardName, workspaceName);
				

		return sprintDetails;

	}
	
	@GET
	@Path("/getdaysleftinsprint")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDaysLeftInSprint(@HeaderParam("Authorization") String authString,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("projectName") String workspaceName) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
			long daysLeft = 0;
			octaneMetrics = new OctaneLifeMetrics();
			daysLeft = octaneMetrics.getDaysLeftInSprint(authString, dashboardName, workspaceName);
			
		return daysLeft;

	}
	
	@GET
	@Path("/getbacklogcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getBacklogCount(@HeaderParam("Authorization") String authString,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("projectName") String workspaceName) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
		long backlogCount = 0;
		octaneMetrics = new OctaneLifeMetrics();
		backlogCount = octaneMetrics.getBacklogCount(authString, dashboardName, workspaceName);
		
		return backlogCount;

	}
	
	@GET
	@Path("/getsprintstatus")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getSprintStatus(@HeaderParam("Authorization") String authString,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("projectName") String workspaceName,
		@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
			List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();
			octaneMetrics = new OctaneLifeMetrics();
			statusList = octaneMetrics.getSprintStatus(authString, dashboardName, workspaceName, sprintSel);
			return statusList;
			
	}
	

	@GET
	@Path("/getsprintvelocity")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getSprintVelocity(@HeaderParam("Authorization") String authString,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("projectName") String workspaceName,
		@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
			List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();
			octaneMetrics = new OctaneLifeMetrics();
			statusList = octaneMetrics.getSprintVelocity(authString, dashboardName, workspaceName, sprintSel);
			return statusList;
			
	}
	
	@GET
	@Path("/gethourinvested")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getHourInvested(@HeaderParam("Authorization") String authString,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("projectName") String workspaceName,
		@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException, IOException,
		NumberFormatException, BaseException, BadLocationException {
			List<OctaneDataVO> hourList = new ArrayList<OctaneDataVO>();
			octaneMetrics = new OctaneLifeMetrics();
			hourList = octaneMetrics.getHourInvested(authString, dashboardName, workspaceName, sprintSel);
			return hourList;
			
	}
	

	/* Defects by Severity(Donut Chart) Starts Here */
	
	// Defects by Severity - On Load
	/*Metric     : Operational/Defect/Defects by Severity
	Rest URL   : rest/defectServices/defectsseveritychartdata
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.newSeverityChart=function(domain, project,release)*/

		@GET
		@Path("/getdefectseveritychart")
		@Produces(MediaType.APPLICATION_JSON)
		public List<OctaneDataVO> getOctaneDefectSeveritychart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("projectName") String workspaceName,
				@QueryParam("selectedSprint") String sprintSel)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			octaneMetrics = new OctaneLifeMetrics();
			List<OctaneDataVO> result=octaneMetrics.getOctaneDefectSeveritychart(authString, dashboardName, workspaceName, sprintSel);
			return result;
		}
			
		
		@GET
		@Path("/getdefectstatuschart")
		@Produces(MediaType.APPLICATION_JSON)
		public List<Long> getOctaneDefectStatusChart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("projectName") String workspaceName,
				@QueryParam("selectedSprint") String sprintSel) throws NumberFormatException, BaseException, BadLocationException, ParseException, IOException {
			octaneMetrics = new OctaneLifeMetrics();
			List<Long> result=octaneMetrics.getOctaneDefectStatusChart(authString, dashboardName, workspaceName, sprintSel);
			return result;
		}
		
		// Defects by Priority - On Load
				/*Metric     : Operational/Defect/Defects by Priority
				Rest URL   : rest/defectServices/defectsprioritychartdata
				JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
				JS Function: $scope.newPriorityChart=function(domain, project,release)*/

		@GET
		@Path("/getdefectprioritychart")
		@Produces(MediaType.APPLICATION_JSON)
		public List<OctaneDataVO> getOctaneDefectPrioritychart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("projectName") String workspaceName,
				@QueryParam("selectedSprint") String sprintSel)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			octaneMetrics = new OctaneLifeMetrics();
			List<OctaneDataVO> result=octaneMetrics.getOctaneDefectPrioritychart(authString, dashboardName, workspaceName, sprintSel);
			return result;
		}
	

}
