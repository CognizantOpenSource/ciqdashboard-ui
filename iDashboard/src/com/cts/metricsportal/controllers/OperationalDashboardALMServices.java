package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.text.ParseException;
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

import com.cts.metricsportal.bo.OperationalDashboardALMMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.ArtifactsCountVO;
import com.cts.metricsportal.vo.DefectResolutionVO;
import com.cts.metricsportal.vo.RequirementStatusVO;

@Path("/operationalDashboardALMServices")
public class OperationalDashboardALMServices {
	OperationalDashboardALMMetrics operationalDbAlmMetrics = new OperationalDashboardALMMetrics();
	/**
	 * Date Filter Code - Starts Here	
	 * @throws ParseException 
	 */	
	// Requirement Count
	/*
	 * Metric : Operational/ Requirement/Total Requirement Count Rest URL :
	 * rest/requirementServices/totalReqCount JS File :
	 * WebContent\app\pages\charts\requirements
	 * $rootScope.totalReqcount=function()
	 */

	@GET
	@Path("/totalReqCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getReqCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,
	BaseException, BadLocationException, ParseException {

		long totalreq = 0;
		totalreq = operationalDbAlmMetrics.getReqCount( authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return totalreq;
	}

	/* Requirement Requirement Volatility(BA Panel) - Date Filter */
	@GET
	@Path("/reqvolaPercentage")
	@Produces(MediaType.APPLICATION_JSON)
	public long getReqVolatilityFilter(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,
	BaseException, BadLocationException, ParseException {

		long reqresult = 0;
		reqresult = operationalDbAlmMetrics.getReqVolatilityFilter( authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return reqresult;
	}

	// Total Test Count - On Load
	/*Metric     : Operational/ Design/Total Test Count
		Rest URL   : rest/testCaseServices/totalTestCountinitial
		JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
		JS Function: TestCasesCtrl / $scope.initialcount = function()*/

	@GET
	@Path("/totalTestCount")
	@Produces(MediaType.APPLICATION_JSON)

	public  long getTotalTestCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,
	BaseException, BadLocationException, ParseException {

		long testCount = 0;
		testCount = operationalDbAlmMetrics.getTotalTestCount( authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return testCount;
	}

	// Test Design Coverage - Date Filter
	/*Metric     : Operational/Design/Test Design Coverage
		 Rest URL   : rest/testCaseServices/designCovFilter 
		 JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
		 JS Function: TestCasesCtrl/  $scope.designCoverageFilter=function()*/

	@GET
	@Path("/designCoverage")
	@Produces(MediaType.APPLICATION_JSON)
	public  long getDesignCoverageFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,					
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,
	BaseException, BadLocationException, ParseException {

		long designcovg=0;
		designcovg = operationalDbAlmMetrics.getDesignCoverageFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return designcovg;
	}

	//Total Execution Count
	@GET
	@Path("/totalExeCount")
	@Produces(MediaType.APPLICATION_JSON)

	public  long getExecutionCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{

		long totaltexecount=0;
		totaltexecount = operationalDbAlmMetrics.getExecutionCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return totaltexecount;
	}
	
	//Total Unique Execution Count
		@GET
		@Path("/totaluniqueExeCount")
		@Produces(MediaType.APPLICATION_JSON)

		public  long getuniqueExecutionCount(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{

			long totaltuniqueexecount=0;
			totaltuniqueexecount = operationalDbAlmMetrics. getuniqueExecutionCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return totaltuniqueexecount;
		}

	// Execution Coverage
	@GET
	@Path("/executionCoverage")
	@Produces(MediaType.APPLICATION_JSON)

	public  long getTcCoverage(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{

		long reqresult =0;
		reqresult = operationalDbAlmMetrics.getTcCoverage(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return reqresult;
	}

	// Defects Count - On Load
	/*Metric     : Operational/Defect/Total Defects Count
		Rest URL   : rest/defectServices/totalDefectCountinitial
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/totalDefCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalDefectCountinitial(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {

		long defCount =0;
		defCount = operationalDbAlmMetrics.getTotalDefectCountinitial(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return defCount;
	}
	// Defect Rejection Rate - Date Filter
	@GET
	@Path("/defRejectRate")
	@Produces(MediaType.APPLICATION_JSON)
	public long defectRejectionRateFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod

			)throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {

		long defRejRate = 0;
		defRejRate = operationalDbAlmMetrics.defectRejectionRateFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return defRejRate;
	}

	
	// Requirement Pass Count - On Load
	/*
	 * Metric : Operational/ Requirement/Total Requirement Count Rest URL :
	 * rest/requirementServices/reqPassedCount JS File :
	 * WebContent\app\pages\charts
	 * \requirements\requirementsdata\RequirementsCtrl.js JS Function:
	 * RequirementsCtrl / $scope.initialreqcount=function()
	 */

	@GET
	@Path("/reqPassCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getReqPassCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,

			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod)
					throws JsonParseException, JsonMappingException, IOException,
					NumberFormatException, BaseException, BadLocationException, ParseException {
		
		long totalpassreq = 0;
		totalpassreq = operationalDbAlmMetrics.getReqPassCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return totalpassreq;
	}

	// Automation Coverage - On Load
    /*Metric     : Operational/Design/Automation Coverage
    Rest URL   : rest/testCaseServices/autoCoverageinitial 
    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
    JS Function: TestCasesCtrl/ $scope.autoCoverage=function()*/

    @GET
	 @Path("/designAutoCoverage")
	 @Produces(MediaType.APPLICATION_JSON)

   public  long getDesignAutoCoverage(@HeaderParam("Authorization") String authString,
  			@QueryParam("dashboardName") String dashboardName,
  			
  			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
  			JsonMappingException, IOException, NumberFormatException,
  			BaseException, BadLocationException, ParseException {
    	
    	long acresult = 0;
    	acresult = operationalDbAlmMetrics.getDesignAutoCoverage(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
    	return acresult;
    }
    
 // Dashboard - Highlights	
	// Execution Manual Count
	@GET
	 @Path("/exeManualCount")
	 @Produces(MediaType.APPLICATION_JSON)

	 public  long getManualCount(@HeaderParam("Authorization") String authString,
			 @QueryParam("dashboardName") String dashboardName,
				
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
		long totalmanualcount=0;  
		totalmanualcount = operationalDbAlmMetrics.getManualCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return totalmanualcount;
	}
	
	// Execution Auto Count
	@GET
	 @Path("/exeAutoCount")
	 @Produces(MediaType.APPLICATION_JSON)

	 public  long getAutoCount(@HeaderParam("Authorization") String authString,
			 @QueryParam("dashboardName") String dashboardName,
				
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
		
		long totalautocount=0;
		totalautocount = operationalDbAlmMetrics.getAutoCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return totalautocount;
	}
	
	// Defects Count - On Load
	/*Metric     : Operational/Defect/Total Defects Count
	Rest URL   : rest/defectServices/totalDefectCountinitial
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.initialcount = function()*/

	@GET
	@Path("/defClosedCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getClosedDefectCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		
		long defCloseCount =0;
		defCloseCount = operationalDbAlmMetrics.getClosedDefectCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return defCloseCount;
	}
	
	/* Artifacts count Starts Here */

	/**
	 * Artifacts Count – On Load Metric : Dashboard/dashboard/Artifacts Count
	 * Rest URL : rest/jsonServices/artifactsCount JS File :
	 * WebContent\app\pages\dashboard\artifactCountCtrl.js JS Function:
	 * artifactCountCtrl/$scope.artifactCountChart=function(domain,
	 * project,release)
	 */
	@GET
	@Path("/artifactsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArtifactsCountVO> getArtifactsCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<ArtifactsCountVO> finalresult = null;
		finalresult = operationalDbAlmMetrics.getArtifactsCount(authString, dashboardName, domainName, projectName);
		return finalresult;
	}
	
	//DEFECT RESOLUTION TIME IN DASHBOARD
		@GET
		@Path("/defectResolutionTime/")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectResolutionVO> getDefectResolutionTime(@HeaderParam("Authorization") String authString,@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			List<DefectResolutionVO> defResolTime=null;
			defResolTime = operationalDbAlmMetrics.getDefectResolutionTime(authString, dashboardName, domainName, projectName);
			return defResolTime;
		}
	/** This Service will return the Priority details.
	 * 
	 * @param dashboardName
	 * @param owner
	 * @param domainName
	 * @param projectName
	 * @return priorityresult
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqprioritychart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirementStatusVO> getRequirementPiechartFilter(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException, ParseException {
		List<RequirementStatusVO> priorityresult = null;
		priorityresult = operationalDbAlmMetrics.getRequirementPiechartFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return priorityresult;
	}
	/**
	 * Date Filter Code - Ends Here	
	 */	
		

}
