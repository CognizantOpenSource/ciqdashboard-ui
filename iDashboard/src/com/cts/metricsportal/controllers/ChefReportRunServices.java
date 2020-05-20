package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

import javax.naming.NamingException;
import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cognizant.cimesg.accessjl.core.LdapAuthentication;
import com.cts.metricsportal.bo.ChefMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.ChefNodesVO;
import com.cts.metricsportal.vo.ChefRunsNodeVO;
import com.cts.metricsportal.vo.ChefRunsStatusDetailsCountVO;
import com.cts.metricsportal.vo.ChefRunsStatusVO;
import com.cts.metricsportal.vo.ChefRunsTrendVO;
import com.cts.metricsportal.vo.ChefRunsVO;

@Path("/chefRunsServices")
public class ChefReportRunServices {
	static final Logger logger = Logger.getLogger(ChefReportRunServices.class);
	ChefMetrics chefMetrics= new ChefMetrics();
	public boolean authenticate1(String username, String password) {
		
		boolean userDetails = chefMetrics.authenticate1(username, password);
		return userDetails;
		
		
	}
	
	public boolean authenticateInternal(String username, String password)
	{

		// return true;
		
		Properties ldapSettings = new Properties();
		
		try {
			ldapSettings = PropertyManager.getProperties("ldapSettings.properties");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			 logger.error(e.getMessage());
		}
		
		boolean authStatus = false;
		
		// Use the AccessJL library to perform the authentication.
		LdapAuthentication authenticator = new LdapAuthentication(ldapSettings);
		
		// The authenticate method of the AccessJL library performs
		// the actual LDAP authentication.
		try {
			authStatus = authenticator.authenticate(username, password);
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			 logger.error(e.getMessage());
		}
		
		return authStatus;
		
		}

	
	/* Total Runs Count(BA Panel) Starts Here */
	
	// Runs Count - On Load
	/*Metric     : Operational/Report/Total Runs Count
	Rest URL   : rest/defectServices/totalRunsCountinitial
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalRunsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalReportCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		long runsCount = chefMetrics.getTotalReportCount(authString, dashboardName);
		return runsCount;
		
	}	
		
	/* Total Runs Count(BA Panel) Starts Here */
	
	// Runs Count - On Load
	/*Metric     : Operational/Report/Total Runs Count For Cookbook
	Rest URL   : rest/defectServices/totalRunsCountForCookbook
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalRunsCountForCookbook")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalRunsCountForCookbook(@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		long runsCount = chefMetrics.getTotalRunsCountForCookbook(authString, cookbookName, dashboardName);
		return runsCount;
		
	}
	
	
	/* Total Runs Count(BA Panel) Starts Here */
	
	// Runs Count - On Load
	/*Metric     : Operational/Report/Total Runs Count For Cookbook
	Rest URL   : rest/defectServices/totalRunsCountForCookbook
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalRunsCountForCookbookForNode")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalRunsCountForCookbookForNode(@HeaderParam("Authorization") String authString,
			@QueryParam("nodename") String nodeName,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		long runsCount = chefMetrics.getTotalRunsCountForCookbookForNode(nodeName, cookbookName, dashboardName);
		return runsCount;
	}	
		
	/* Total Runs Count(BA Panel) Starts Here */
	
	// Runs Count - On Load
	/*Metric     : Operational/Report/Total Success Runs Count
	Rest URL   : rest/defectServices/totalRunsSuccessCount
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalRunsSuccessCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalRunsSuccessCount(@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		long runsCount = chefMetrics.getTotalRunsSuccessCount(authString, cookbookName, dashboardName);
		return runsCount;
		
		
	}
		
	/* Total Runs Count(BA Panel) Starts Here */
	
	// Runs Count - On Load
	/*Metric     : Operational/Report/Total Success Runs Count
	Rest URL   : rest/defectServices/totalRunsSuccessCount
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalRunsSuccessCountForNode")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalRunsSuccessCountForNode(@HeaderParam("Authorization") String authString,
			@QueryParam("nodename") String nodeName,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("owner") String owner
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		long runsCount = chefMetrics.getTotalRunsSuccessCountForNode(nodeName, cookbookName, dashboardName);
		return runsCount;
		
	}
	
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefRunsCookbookNames")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getRecordsRunsCookbookNames(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		List<String> cookbookNamesList = chefMetrics.getRecordsRunsCookbookNames(authString, dashboardName);
		return cookbookNamesList;
		
	}
		
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefGetLastRunDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getLastRunDetails(
			@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName
			)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<ChefRunsVO> lastrunsList = chefMetrics.getLastRunDetails(authString, itemsPerPage, start_index, cookbookName, dashboardName);
		return lastrunsList;
		
	}
		
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefGetLastRunDetailsForNode")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getLastRunDetailsForNode(
			@HeaderParam("Authorization") String authString,
			@QueryParam("nodename") String nodeName,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<ChefRunsVO> lastRunsListForNode = chefMetrics.getLastRunDetailsForNode(authString, nodeName, cookbookName, dashboardName);
		return lastRunsListForNode;
		
	}
		
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefGetLastSuccessfulRunDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getLastSuccessfulRunDetails(
			@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		List<ChefRunsVO> lastSuccessfulRunsList = chefMetrics.getLastSuccessfulRunDetails(authString, itemsPerPage, start_index, cookbookName, dashboardName);
		return lastSuccessfulRunsList;
	}
		
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefGetSuccessfulCookbooksRunForNode")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getSuccessfulCookbooksRunForNode(
			@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("nodename") String nodeName,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<ChefRunsVO> lastSuccessfulCookbookRunsOnNodesList = chefMetrics.getSuccessfulCookbooksRunForNode(authString, itemsPerPage, start_index, nodeName, cookbookName, dashboardName);
		return lastSuccessfulCookbookRunsOnNodesList;
	}
	
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefGetLastSuccessfulRunDetailsForNode")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getLastSuccessfulRunDetailsForNode(
			@HeaderParam("Authorization") String authString,
			@QueryParam("nodename") String nodeName,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("owner") String owner)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<ChefRunsVO> lastSuccessfulRunsListForNode = chefMetrics.getLastSuccessfulRunDetailsForNode(authString, nodeName, cookbookName, dashboardName, owner);
		return lastSuccessfulRunsListForNode;

	}	
		
	// Report Details - Pagination */
	/*Metric     : Operational/Report/ReportsRun Details
	Rest URL   : rest/defectServices/defectTableDetails
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.defectTableData = function(start_index)*/

	@GET
	@Path("/chefRunsTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsVO> getRecordsRuns(
			@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		List<ChefRunsVO> runsList = chefMetrics.getRecordsRuns(authString, itemsPerPage, start_index, cookbookName, dashboardName);
		return runsList;

	}	
		
	// Node Table Details - On-load with Sort
	/*Metric     : Operational/Node/Nodes Details
	Rest URL   : rest/defectServices/defectsData 
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: $scope.sortedtable = function(sortvalue,itemsPerPage,start_index,reverse)*/
	@GET
	@Path("/chefGetRunNodesData")
	@Produces(MediaType.APPLICATION_JSON)
	public ChefNodesVO getRunNodesRecords(
			@HeaderParam("Authorization") String authString,
			@QueryParam("nodename") String nodeName,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		ChefNodesVO runNodeDetails = chefMetrics.getRunNodesRecords( nodeName, dashboardName);
		return runNodeDetails;
	}
		
	@GET
	@Path("/runsbarchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsStatusVO> getRunsbarchart(
			@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		
		List<ChefRunsStatusVO> result = chefMetrics.getRunsbarchart( cookbookName);
		return result;
	}
	
	@GET
	@Path("/runsmultibarchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsStatusDetailsCountVO> getRunsmultibarchart(
			@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		
		List<ChefRunsStatusDetailsCountVO> finalresult = chefMetrics.getRunsmultibarchart( authString, cookbookName, dashboardName);
		return finalresult;
	}
		
	@GET
	@Path("/runsOnEachNodeChartData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsNodeVO> getRunsOnEachNodeChartData(
			@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		
		List<ChefRunsNodeVO> result = chefMetrics.getRunsOnEachNodeChartData(authString, cookbookName, dashboardName);
		return result;
	}
		
	// Status Trend - On Load
	/*
	 * Metric : Operational/Requirement/ Requirement Status Trend (Daily Status)
	 * Rest URL : rest/requirementServices/runstrendchartdata JS File :
	 * WebContent
	 * \app\pages\charts\requirements\requirementsdata\RequirementsCtrl.js JS
	 * Function: RequirementsCtrl/ $scope.reqTrendChart=function(domain,
	 * project,release)
	 */
	@GET
	@Path("/runstrendchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ChefRunsTrendVO> getRunstrendchart(
			@HeaderParam("Authorization") String authString,
			@QueryParam("cookbookname") String cookbookName,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		
		List<ChefRunsTrendVO> trendvolist = chefMetrics.getRunstrendchart(authString, cookbookName, dashboardName);
		return trendvolist;
	}
	
}
