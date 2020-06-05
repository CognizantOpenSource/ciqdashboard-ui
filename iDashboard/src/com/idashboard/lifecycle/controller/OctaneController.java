package com.idashboard.lifecycle.controller;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
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

import com.cts.metricsportal.util.BaseException;
import com.idashboard.lifecycle.service.OctaneService;
import com.idashboard.lifecycle.serviceImpl.OctaneServiceImpl;
import com.idashboard.lifecycle.vo.OctaneDataVO;

@Path("/octane")
public class OctaneController {

	OctaneService octaneService = new OctaneServiceImpl();

	@GET
	@Path("/octaneprojectdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getOctaneProjectDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> projectcoll = null;

		projectcoll = octaneService.getOctaneProjectDetails(authString);

		return projectcoll;

	}

	@GET
	@Path("/getcurrentsprint")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getOctaneCurrentSprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<String> sprintDetails = octaneService.getOctaneCurrentSprint(authString, dashboardName, workspaceName);

		return sprintDetails;

	}

	@GET
	@Path("/getdaysleftinsprint")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDaysLeftInSprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long daysLeft = 0;
		daysLeft = octaneService.getDaysLeftInSprint(authString, dashboardName, workspaceName);

		return daysLeft;

	}

	@GET
	@Path("/getbacklogcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getBacklogCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long backlogCount = 0;
		backlogCount = octaneService.getBacklogCount(authString, dashboardName, workspaceName);

		return backlogCount;

	}

	@GET
	@Path("/getsprintstatus")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getSprintStatus(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();
		statusList = octaneService.getSprintStatus(authString, dashboardName, workspaceName, sprintSel);
		return statusList;

	}

	@GET
	@Path("/getsprintvelocity")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getSprintVelocity(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();
		statusList = octaneService.getSprintVelocity(authString, dashboardName, workspaceName, sprintSel);
		return statusList;

	}

	@GET
	@Path("/gethourinvested")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getHourInvested(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		List<OctaneDataVO> hourList = new ArrayList<OctaneDataVO>();
		hourList = octaneService.getHourInvested(authString, dashboardName, workspaceName, sprintSel);
		return hourList;

	}

	/* Defects by Severity(Donut Chart) Starts Here */

	// Defects by Severity - On Load
	/*
	 * Metric : Operational/Defect/Defects by Severity Rest URL :
	 * rest/defectServices/defectsseveritychartdata JS File :
	 * WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js JS Function:
	 * $scope.newSeverityChart=function(domain, project,release)
	 */

	@GET
	@Path("/getdefectseveritychart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getOctaneDefectSeveritychart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		List<OctaneDataVO> result = octaneService.getOctaneDefectSeveritychart(authString, dashboardName, workspaceName,
				sprintSel);
		return result;
	}

	@GET
	@Path("/getdefectstatuschart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> getOctaneDefectStatusChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel)
			throws NumberFormatException, BaseException, BadLocationException, ParseException, IOException {
		List<Long> result = octaneService.getOctaneDefectStatusChart(authString, dashboardName, workspaceName,
				sprintSel);
		return result;
	}

	// Defects by Priority - On Load
	/*
	 * Metric : Operational/Defect/Defects by Priority Rest URL :
	 * rest/defectServices/defectsprioritychartdata JS File :
	 * WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js JS Function:
	 * $scope.newPriorityChart=function(domain, project,release)
	 */

	@GET
	@Path("/getdefectprioritychart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OctaneDataVO> getOctaneDefectPrioritychart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("projectName") String workspaceName,
			@QueryParam("selectedSprint") String sprintSel) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		List<OctaneDataVO> result = octaneService.getOctaneDefectPrioritychart(authString, dashboardName, workspaceName,
				sprintSel);
		return result;
	}

}
