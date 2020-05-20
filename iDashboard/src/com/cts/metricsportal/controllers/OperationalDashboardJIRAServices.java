package com.cts.metricsportal.controllers;

import java.io.IOException;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.bo.OperationalDashboardJIRAMetrics;
import com.cts.metricsportal.util.BaseException;

@Path("/operationalDashboardJiraServices")
public class OperationalDashboardJIRAServices {
	OperationalDashboardJIRAMetrics operationalDbJiraMetrics = new OperationalDashboardJIRAMetrics();

	// Levis Dashboard code starts here
	@GET
	@Path("/totalreqCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getReqCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long totalreq = 0;
		totalreq = operationalDbJiraMetrics.getReqCount(authString, dashboardName, domainName, projectName);
		return totalreq;
	}

	@GET
	@Path("/totStoryPointCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long gettotalStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalStoryPoint = 0;
		totalStoryPoint = operationalDbJiraMetrics.gettotalStoryCount(authString, dashboardName, domainName,
				projectName, vardtfrom, vardtto);
		return totalStoryPoint;

	}

	@GET
	@Path("/totDefCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalDefectCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totDefCount = 0;
		totDefCount = operationalDbJiraMetrics.getTotalDefectCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto);
		return totDefCount;

	}

	@GET
	@Path("/defectOpenRate")
	@Produces(MediaType.APPLICATION_JSON)
	public long defectOpenRate(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long defOpenRate = 0;
		defOpenRate = operationalDbJiraMetrics.defectOpenRate(authString, dashboardName, domainName, projectName, vardtfrom, vardtto);
		return defOpenRate;

	}

	// Dashboard Test case count
	@GET
	@Path("/totalTestCountinitialdash")
	@Produces(MediaType.APPLICATION_JSON)

	public long getTotalTestCountinitialdash(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long testCount = 0;
		testCount = operationalDbJiraMetrics.getTotalTestCountinitialdash(authString, dashboardName, domainName,
				projectName, vardtfrom, vardtto);
		return testCount;

	}

	// Levis Dashboard code ends here
	// User Story Count from Rally
	/*
	 * Metric : lifecycle/User Stories/ User story count Rest URL :
	 * rest/RallyServices/userStoryCount : WebContent JS File: UserStoryCtrl.js
	 * JS Function: UserStoryCtrl/ initialUserStorycount=function()
	 */

	@GET
	@Path("/userStoryCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long totalUserStories = 0;
		totalUserStories = operationalDbJiraMetrics.getUserStoryCount(authString, dashboardName, domainName,
				userStrproject, vardtfrom, vardtto);
		return totalUserStories;
	}

	// User Story Sprint Count
	/*
	 * Metric : lifecycle/User Stories/ User story sprint count Rest URL :
	 * rest/RallyServices/userStorySprintCount : WebContent JS File:
	 * UserStoryCtrl.js JS Function: UserStoryCtrl/
	 * initUserStorySprintCount=function()
	 */

	@GET
	@Path("/userStorySprintCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getuserStorySprintCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("userStrproject") String userStrproject, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long totalUserStoriesSprint = 0;
		totalUserStoriesSprint = operationalDbJiraMetrics.getuserStorySprintCount(authString, dashboardName, domainName,
				userStrproject, vardtfrom, vardtto);
		return totalUserStoriesSprint;
	}

}
