/**
 * Cognizant Technology Solutions
 * 
 * @author 
 */
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

import com.cts.metricsportal.bo.AlmMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.ExecutionFuncUtilVO;
import com.cts.metricsportal.vo.ExecutionRegUtilVO;
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


@Path("/almMetricsServices")
public class AlmServices{

	AlmMetrics almMetrics = null;
	
	
	/** This Service will return the total requirement details.
	 * Total Requirement - Date Filter
	 * 
	 *@param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return totalReq
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqCountFilter")
	@Produces(MediaType.APPLICATION_JSON)
	public long getRequirementCountFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException {
			long totalReq = 0;
			almMetrics = new AlmMetrics();
			totalReq = almMetrics.getRequirementCountFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		
			return totalReq;
		
	}
	/** This Service will return the Status Trend chart on load.
	 * Rest URL : rest/requirementServices/requirementtrendchartdata JS File.
	 * 
	 *@param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return trendvoList
	 * @throws ParseException 
	 */
	@GET
	@Path("/requirementtrendchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ReqTrendVO> getRequirementTrendChart(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<ReqTrendVO> trendvoList = almMetrics.getRequirementTrendChart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
					
			return trendvoList;
	}
	
	/** This Service Returns the "Requirement Status" Details in Each Bar.
	 * 
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return dailyStatus
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqstatuschartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirementStatusVO> getRequirementBarChart(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<RequirementStatusVO> dailyStatus = almMetrics.getRequirementBarChart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
				
				return dailyStatus;
		}
	
	/** This Service will return the Priority details.
	 * 
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return priorityResult
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqprioritychartfilter")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirementStatusVO> getRequirementPriorityChartFilter(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		List<RequirementStatusVO> priorityResult = almMetrics.getRequirementPriorityChartFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return priorityResult;	
	}
	
	/** This Service will return the table details.
	 * 
	 * @param itemsPerpage
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return reqAnalysisList
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getRecordsAlmRequirement(
		@HeaderParam("Authorization") String authString,
		@QueryParam("itemsPerPage") int itemsPerPage,
		@QueryParam("start_index") int start_index,
		@QueryParam("dashboardName") String dashboardName,
		@QueryParam("domainName") String domainName,
		@QueryParam("projectName") String projectName,
		@QueryParam("vardtfrom") String vardtfrom, 
		@QueryParam("vardtto") String vardtto,
		@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		List<RequirmentVO> reqAnalysisList = almMetrics.getRequirementRecords(authString, itemsPerPage, start_index, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		
		return reqAnalysisList;
}


	/** This Service will return the Requirement Volatility - Date Filter details.
	 * 
	 * @param itemsPerpage
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return reqResult
	 * @throws ParseException 
	 */
	@GET
	@Path("/reqvolatilityfilter")
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
			almMetrics = new AlmMetrics();
			long reqResult = almMetrics.getRequirementVolatilityFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);

			return reqResult;

	}
	
	/* Requirement Requirement Volatility(BA Panel) Ends Here */

	
	/** This Service will return the Requirement Leakage- Date Filter details.
	 * 
	 * @param itemsPerpage
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return reqLeak
	 * @throws ParseException 
	 */

	@GET
	@Path("/reqleakfilter")
	@Produces(MediaType.APPLICATION_JSON)
	public long getReqLeakFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			long reqLeak = almMetrics.getRequirementLeakFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqLeak;
		
	}
	
	// analyse button

	@GET
	@Path("/requirementsDataAnalyseLevel")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getRecordsAnalyseLevel(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			)
			throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<RequirmentVO> reqAnalyzedataLevel = almMetrics.getRequirementRecordsAnalyseLevel(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqAnalyzedataLevel;
		
	}

	// Requirement Count paginate
	/*
	 * Metric : Operational/ Requirement/Total Requirement Count Rest URL :
	 * rest/requirementServices/totalReqCount JS File :
	 * WebContent\app\pages\charts\requirements
	 * \requirementsdata\RequirementsCtrl.js JS Function: RequirementsCtrl /
	 * .initialReqcountpaginate()
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
			almMetrics = new AlmMetrics();
			totalreq = almMetrics.getReqCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return totalreq;
		
	}
	
	// Pagination count for Requirements data table search box for
		// string(without level Id filter)

		/*
		 * Metric : Operational/Requirements/ Requirements Details Rest URL :
		 * rest/requirementServices/searchpagecount JS File :
		 * WebContent\app\pages\charts
		 * \requirements\requirementsdata\RequirementsCtrl.js JS Function:
		 * RequirementsCtrl/$scope.searchable =
		 * function(start_index,searchField,searchText)
		 */

	@GET
	@Path("/searchpagecount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getSearchPageCount(@HeaderParam("Authorization") String authString,
			@QueryParam("reqID") String reqID,
			@QueryParam("releaseName") String releaseName,
			@QueryParam("reqName") String reqName,
			@QueryParam("description") String description,
			@QueryParam("reqType") String reqType,
			@QueryParam("status") String status,
			@QueryParam("priority") String priority,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException, ParseException {
			long pageCount = 0;
			almMetrics = new AlmMetrics();
			pageCount = almMetrics.getSearchPageCount(authString, releaseName, reqID, reqName, description, reqType, status, priority, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
				
			return pageCount;
		}
	
	@GET
	@Path("/searchRequirements")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getsearchreq(
			@HeaderParam("Authorization") String authString,
			@QueryParam("releaseName") String releaseName,
			@QueryParam("reqID") String reqID,
			@QueryParam("reqName") String reqName,
			@QueryParam("description") String description,
			@QueryParam("reqType") String reqType,
			@QueryParam("status") String status,
			@QueryParam("priority") String priority,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException, ParseException {
			List<RequirmentVO> searchResult = null;
			almMetrics = new AlmMetrics();
			searchResult = almMetrics.getRequirementSearchReq(authString, releaseName, reqID, reqName, description, reqType, status, priority, itemsPerPage, start_index, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return searchResult;
	}
	
	
		/**  Requirements Table Details - On-load with Sort
		 * Metric : Operational/Requirement/ Requirement Details Rest URL :
		 * rest/requirementServices/requirementsData JS File :
		 * WebContent\app\pages\charts
		 * \requirements\requirementsdata\RequirementsCtrl.js JS Function:
		 * RequirementsCtrl/$scope.sortedtable =
		 * function(sortvalue,itemsPerPage,start_index,reverse)
		 */
	@GET
	@Path("/requirementsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RequirmentVO> getRecords(
			@HeaderParam("Authorization") String authString,
			@QueryParam("sortvalue") String sortvalue,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("reverse") boolean reverse,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException, ParseException {
			List<RequirmentVO> reqAnalyzedata = null;			
			almMetrics = new AlmMetrics();
			
			reqAnalyzedata = almMetrics.getRecords(authString, sortvalue, itemsPerPage, start_index, reverse, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqAnalyzedata;
		
		}
		

		/** Requirement Passed Count - On Load
		 * Metric : Operational/ Requirement/Total Requirement Count Rest URL :
		 * rest/requirementServices/reqPassedCount JS File :
		 * WebContent\app\pages\charts
		 * \requirements\requirementsdata\RequirementsCtrl.js JS Function:
		 * RequirementsCtrl / $scope.initialreqcount=function()
		 */

		@GET
		@Path("/reqPassedCount")
		@Produces(MediaType.APPLICATION_JSON)
		public long getReqPassCount(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName)
				throws JsonParseException, JsonMappingException, IOException,
				NumberFormatException, BaseException, BadLocationException {
				long totalpassReq = 0;
				almMetrics = new AlmMetrics();
				totalpassReq = almMetrics.getReqPassCount(authString, dashboardName, domainName, projectName);
			
				return totalpassReq;
			
		}

	
	
/*
 * ****************************************************************************************ALM Execution Starts Here****************************************************************************************************
 */
		@GET
		@Path("/tcexeCount")
		@Produces(MediaType.APPLICATION_JSON)
		public long getTcCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			long totalTcExeCount=0;
			almMetrics = new AlmMetrics();
			totalTcExeCount = almMetrics.getTcCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return totalTcExeCount;
	}
		
		@GET
		@Path("/tcexeCountForTable")
		@Produces(MediaType.APPLICATION_JSON)
		public long getTcCountForTable(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			long totalTcExeCount=0;
			almMetrics = new AlmMetrics();
			totalTcExeCount = almMetrics.getTcCountForTable(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return totalTcExeCount;
	}
		
		@GET
		@Path("/tcuniqueexeCount")
		@Produces(MediaType.APPLICATION_JSON)
		public long getuniqueTcCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			long totaluniqueTcExeCount=0;
			almMetrics = new AlmMetrics();
			totaluniqueTcExeCount = almMetrics.getuniqueTcCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return totaluniqueTcExeCount;
	}
		
		
		@GET
		@Path("/tcmanualCount")
		@Produces(MediaType.APPLICATION_JSON)
		public long getManualCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			long totalmanualCount=0;  
			almMetrics = new AlmMetrics();
			totalmanualCount = almMetrics.getManualCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return totalmanualCount;
		 }
		
		@GET
		 @Path("/tcautoCount")
		 @Produces(MediaType.APPLICATION_JSON)
		public long getAutoCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			long totalautoCount=0;
			almMetrics = new AlmMetrics();
			totalautoCount = almMetrics.getAutoCount(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return totalautoCount;
			
		 }
		
		
		// Execution Coverage
		@GET
		@Path("/tccoverage")
		@Produces(MediaType.APPLICATION_JSON)
		public  long getTcCoverage(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqResult =0;
			reqResult = almMetrics.getTcCoverage(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			 
			return reqResult;
		
		}
		
		@GET
		@Path("/firstTimePass")
		@Produces(MediaType.APPLICATION_JSON)

	   public long firstTimePass(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqresult =0;
			reqresult = almMetrics.firstTimePass(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqresult; 	 

		}
		
		// UAT Automation
		
		@GET
		@Path("/UATAutomation")
		@Produces(MediaType.APPLICATION_JSON)

	   public long UATAutomation(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqresult =0;
			reqresult = almMetrics.UATAutomation(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqresult; 	 

		}
		
		// End of UAT Automation
		
		// Functional Automation
		
		@GET
		@Path("/FuncationalAutomation")
		@Produces(MediaType.APPLICATION_JSON)

	   public long FuncationalAutomation(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqresult =0;
			reqresult = almMetrics.FuncationalAutomation(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqresult; 	 

		}
		
		// End of Functional Automation
		
		//Regression Automation
		@GET
		@Path("/RegressionAutomation")
		@Produces(MediaType.APPLICATION_JSON)

	   public long RegressionAutomation(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqresult =0;
			reqresult = almMetrics.RegressionAutomation(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return reqresult; 	 

		}
		
		// end of Regression Automation
		
		@GET
		@Path("/errorDiscovery")
		@Produces(MediaType.APPLICATION_JSON)
		public  long errorDiscovery1(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			long reqResult =0;
			reqResult = almMetrics.errorDiscovery1(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			 return reqResult;
		}
		
		
		@GET
		@Path("/testcaseExeStatus")
		@Produces(MediaType.APPLICATION_JSON)
	    public  List<TestExeStatusVO> getTcExeStatusbarchart(@HeaderParam("Authorization") String authString,
	    	@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<TestExeStatusVO> result=almMetrics.getTcExeStatusbarchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return result;	 
		 	 
		}
		

		@GET
		@Path("/testOwnerChart")
		@Produces(MediaType.APPLICATION_JSON)
	    public  List<TCExecutionOwnerVO> getTcExeOwnerChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<TCExecutionOwnerVO> result=almMetrics.getTcExeOwnerChart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			 	
			return result;
		}
		
		// FunctionalUtil - Trend Grpah
		@GET
		@Path("/FunctionalUtilChart")
		@Produces(MediaType.APPLICATION_JSON)
	    public  List<ExecutionFuncUtilVO> getFunctionalUtilChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<ExecutionFuncUtilVO> result=almMetrics.getFunctionalUtilChart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			 	
			return result;
		}
		
		// RegressionUtil - Trend Grpah
				@GET
				@Path("/RegressionUtilChart")
				@Produces(MediaType.APPLICATION_JSON)
			    public  List<ExecutionRegUtilVO> getRegressionUtilChart(@HeaderParam("Authorization") String authString,
					@QueryParam("dashboardName") String dashboardName,
					@QueryParam("domainName") String domainName,
					@QueryParam("projectName") String projectName,
					@QueryParam("vardtfrom") String vardtfrom, 
					@QueryParam("vardtto") String vardtto,
					@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
					almMetrics = new AlmMetrics();
					List<ExecutionRegUtilVO> result=almMetrics.getRegressionChart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
					 	
					return result;
				}
		
		// Execution Trend Chart
		@GET
		@Path("/executiontrendchartdata")
		@Produces(MediaType.APPLICATION_JSON)
	   public List<TestExeTrendVO> getTestExecutionTrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<TestExeTrendVO> trendvolist= almMetrics.getTestExecutionTrendchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
				return trendvolist;
		}
		
		@GET
		@Path("/executionData")
		@Produces(MediaType.APPLICATION_JSON)
		public List<TestExecutionVO> getExecRecords(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<TestExecutionVO> executionAnalyzedata = almMetrics.getExecRecords(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		
			return executionAnalyzedata;

	}
		
		// Execution Details Table Count - On Load
		/*Metric     : Operational/Execution/ Execution Details
		* Rest URL   : rest/testExecutionServices/tcexeTableDetails
		* JS File    : WebContent\app\pages\charts\testexecution\testexecutiondata\TestExecutionCtrl.js
		* JS Function: TestExecutionCtrl/ $scope.tcexeTableData = function (start_index)*/
		@GET
		@Path("/tcexeTableDetails")
		@Produces(MediaType.APPLICATION_JSON)
		 
		public  List<TestExecutionVO> getRecordsTcExe(@HeaderParam("Authorization") String authString,@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException{
			almMetrics = new AlmMetrics();
			List<TestExecutionVO> tcexetabledetails= almMetrics.getRecordsTcExe(authString, itemsPerPage, start_index, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			return tcexetabledetails;	
			
			}
		
		// Execution Table Details - On-load with Sort
		/*Metric     : Operational/Execution/Execution Details
		Rest URL   : rest/testExecutionServices/testexeData 
		JS File    : WebContent\app\pages\charts\testexecution\testexecutiondata\TestExecutionCtrl.js
		JS Function: $scope.sortedtable = function(sortvalue,itemsPerPage,start_index,reverse)*/
	   @GET
	   @Path("/testexeData")
	   @Produces(MediaType.APPLICATION_JSON)
		public List<TestExecutionVO> getExecutionRecords(@HeaderParam("Authorization") String authString,@QueryParam("sortvalue") String sortvalue,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("reverse") boolean reverse,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		   	almMetrics = new AlmMetrics();
	    	List<TestExecutionVO> tcexeAnalyzedata= almMetrics.getExecutionRecords(authString, sortvalue, itemsPerPage, start_index, reverse, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	    		
			return tcexeAnalyzedata;	
		
	    	}
	   
	   @GET
		@Path("/searchpagecountexe")
		@Produces(MediaType.APPLICATION_JSON)
		public long getExecutionSearchPageCount(@HeaderParam("Authorization") String authString,
			@QueryParam("releaseName") String releaseName,
			@QueryParam("cycleName") String cycleName,
			@QueryParam("testID") int testID,
			@QueryParam("testName") String testName,			
			@QueryParam("testType") String testType,
			@QueryParam("testRunID") int testRunID,
			@QueryParam("testTester") String testTester,
			@QueryParam("testExecutionStatus") String testExecutionStatus,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		   	almMetrics = new AlmMetrics();
		   	
//			long pagecount=almMetrics.getExecutionSearchPageCount(authString, testID, testName, testDescription, testType, testTester, testExecutionStatus,
//					dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			
			long pagecount=almMetrics.getExecutionSearchPageCount(authString, releaseName,cycleName, testID,  testName, testType, testRunID, testTester, testExecutionStatus,
					dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);

			return pagecount;	
			
			
		}
	   @GET
		@Path("/searchExe")
		@Produces(MediaType.APPLICATION_JSON)
	   public List<TestExecutionVO> getExecutionSearch(@HeaderParam("Authorization") String authString,
		    @QueryParam("releaseName") String releaseName,
			@QueryParam("cycleName") String cycleName,
			@QueryParam("testID") int testID,
			@QueryParam("testName") String testName,			
			@QueryParam("testType") String testType,
			@QueryParam("testRunID") int testRunID,
			@QueryParam("testTester") String testTester,
			@QueryParam("testExecutionStatus") String testExecutionStatus,
			@QueryParam("itemsPerPage") int itemsPerPage,
			@QueryParam("start_index") int start_index,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		   	almMetrics = new AlmMetrics();
		   	List<TestExecutionVO> searchresult= almMetrics.getExecutionSearch(authString, releaseName,cycleName, testID,  testName, testType, testRunID, testTester, testExecutionStatus, itemsPerPage, start_index,
		   			dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		   
			return searchresult;	
		
		}
	 
	   //Analyse Popup Button
	   /* 	@GET
	    	@Path("/executionData")
	    	@Produces(MediaType.APPLICATION_JSON)
	    	public List<TestExecutionVO> getRecords(@HeaderParam("Authorization") String authString,
	    			 @QueryParam("dashboardName") String dashboardName,
	    			@QueryParam("domainName") String domainName,
	   			@QueryParam("projectName") String projectName,
	    				@QueryParam("owner") String owner) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
	    		boolean authenticateresult=authenticateUser(authString);
	    		List<TestExecutionVO> executionAnalyzedata=null;
	    		if(authenticateresult)
	    		{
	    			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, owner, domainName, projectName);
	    			String query = "{},{_id: 0, testID: 1, testName: 1, testDescription: 1, testTester: 1, testType: 1, testExecutionStatus: 1, testExecutionDate: 1}";

	    		Query query1 = new BasicQuery(query);
	    		query1.addCriteria(Criteria.where("_id").in(levelIdList));
	    		 executionAnalyzedata = getMongoOperation().find(query1,
	    				TestExecutionVO.class);
	    		return executionAnalyzedata;
	    		}else{
	    		return executionAnalyzedata;
	    		}
	    }	*/
/*
 *  **************************************************************************ALM Design Starts Here********************************************************************************************************
 */
	 //Total Test Count - Date Filter
	/*	Metric     : Operational/ Design/Total Test Count
				Rest URL   : rest/testCaseServices/totalTestCountFilter
				JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
			 JS Function: TestCasesCtrl / $scope.testCountFilter = function()*/

		@GET
		@Path("/totalTestCountFilter")
		@Produces(MediaType.APPLICATION_JSON)

		public  long getTotalTestCountFilter(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			long testCount =0;
			testCount = almMetrics.getTotalTestCountFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return testCount;
		}
		
		// Test Design Coverage - Date Filter
	/*	Metric     : Operational/Design/Test Design Coverage
		 Rest URL   : rest/testCaseServices/designCovFilter 
			 JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	JS Function: TestCasesCtrl/  $scope.designCoverageFilter=function()*/

		@GET
		@Path("/designCovFilter")
		@Produces(MediaType.APPLICATION_JSON)
		public  long getDesignCoverageFilter(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,

				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			long designcovg=0;
			designcovg = almMetrics.getDesignCoverageFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return designcovg;

		}


		// Automation Coverage - Date Filter
		/*Metric     : Operational/Design/Automation Coverage
			 Rest URL   : rest/testCaseServices/autoCovFilter 
			 JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
			 JS Function: TestCasesCtrl/ $scope.autoCoverageFilter=function()
*/
		@GET
		@Path("/autoCovFilter")
		@Produces(MediaType.APPLICATION_JSON)

		public  long getAutoCoverageFilter(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			long acresult = 0;
			acresult = almMetrics.getAutoCoverageFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return acresult;
		}

		// Regression Automation 
		
		@GET
		@Path("/regressionautoFilter")
		@Produces(MediaType.APPLICATION_JSON)

		public  long getRegressionAutomationFilter(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			long acresult = 0;
			acresult = almMetrics.getRegressionAutomationFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return acresult;
		}
		
		// End of Regression automation

		//Analyse Button 

		@GET
		@Path("/designDataLevel")
		@Produces(MediaType.APPLICATION_JSON)
		public List<TestCaseVO> getRecordsLevel(
				@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod
				)
						throws JsonParseException, JsonMappingException, IOException,
						NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<TestCaseVO> executionAnalyzedataLevel=null;
			executionAnalyzedataLevel = almMetrics.getRecordsLevel(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return executionAnalyzedataLevel;
		}
		
		/**
		 * Date Filter Code Ends Here
		 * @throws ParseException 
		 */

		//Design Status Trend - On Load
		/*Metric     : Operational/Design/ Design Status Trend (Daily Status)
	Rest URL   : rest/testCaseServices/tctrendchartdata 
	JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	JS Function: TestCasesCtrl/ $scope.TCTrendChart=function(domain, project,release)
*/
		@GET
		@Path("/tctrendchartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<TestCaseTrendVO> getTestCaseTrendchart(
				@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<TestCaseTrendVO> trendvolist=null;
			trendvolist = almMetrics.getTestCaseTrendchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return trendvolist;
		}

		//Design Count by Status
	/*	Metric     : Operational/Design/ Design Count by Status
		 Rest URL   : rest/testCaseServices/designstatuschartdata
		 JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
		 JS Function: TestCasesCtrl/ $scope.newStatusChart=function(domain, project,release)
*/
		@GET
		@Path("/designstatuschartdata")
		@Produces(MediaType.APPLICATION_JSON)


		public  List<TestCaseStatusVO> getdesignstatus(
				@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName ,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		JsonMappingException, IOException, NumberFormatException,
		BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<TestCaseStatusVO> result=null;
			result = almMetrics.getdesignstatus(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return result;
		}
		
		 //Design Count by Test Type 
	    /*Metric     : Operational/Design/Design Count by Test Type
	    Rest URL   : rest/testCaseServices/designtypechartdata
	    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	    JS Function: TestCasesCtrl/  $scope.newTypeChart=function(domain, project,release)
*/
	    @GET
		 @Path("/designtypechartdata")
		 @Produces(MediaType.APPLICATION_JSON)
	    public  List<TestCaseStatusVO> getdesigntype(
		 			@HeaderParam("Authorization") String authString,
		 			@QueryParam("dashboardName") String dashboardName,
		 			@QueryParam("domainName") String domainName,
					@QueryParam("projectName") String projectName ,@QueryParam("vardtfrom") String vardtfrom, 
					@QueryParam("vardtto") String vardtto,
					@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		 			JsonMappingException, IOException, NumberFormatException,
		 			BaseException, BadLocationException, ParseException {
	    	almMetrics = new AlmMetrics();
	   	 	List<TestCaseStatusVO> result=null;
	   	 	result = almMetrics.getdesigntype(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	   	 	return result;
	    }
	    
	    // Design Count by Owner - BAR CHART
	/*    Metric     : Operational/Design/ Design Count by Owner
	    Rest URL   : rest/testCaseServices/designownerchartdata
	    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	    JS Function: TestCasesCtrl/ $scope.newOwnerCountChart=function(domain, project,release)
*/
	    @GET
		 @Path("/designownerchartdata")
		 @Produces(MediaType.APPLICATION_JSON)
	     

		 public  List<TestCaseStatusVO> getdesignowner(
		 			@HeaderParam("Authorization") String authString,
		 			@QueryParam("dashboardName") String dashboardName,
		 			@QueryParam("domainName") String domainName,
					@QueryParam("projectName") String projectName,
					@QueryParam("vardtfrom") String vardtfrom, 
					@QueryParam("vardtto") String vardtto,
					@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
		 			JsonMappingException, IOException, NumberFormatException,
		 			BaseException, BadLocationException, ParseException {
	    	almMetrics = new AlmMetrics();
	    	List<TestCaseStatusVO> result=null;
	    	result = almMetrics.getdesignowner(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	    	return result;
	    }
	 // Design Details - On Load
	/*    Metric     : Operational/Design/ Design Details
	    Rest URL   : rest/testCaseServices/tcTableDetails
	    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	    JS Function: TestCasesCtrl/ $scope.tcTableData = function(start_index)
*/
	    @GET
		 @Path("/tcTableDetails")
		 @Produces(MediaType.APPLICATION_JSON)

		 public  List<TestCaseVO> getRecordstc(
				@HeaderParam("Authorization") String authString,
				@QueryParam("itemsPerPage") int itemsPerPage,
				@QueryParam("start_index") int start_index,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException,
				BaseException, BadLocationException, ParseException {
	    	almMetrics = new AlmMetrics();
	    	List<TestCaseVO> reqAnalysisList=null;
	    	reqAnalysisList = almMetrics.getRecordstc(authString, itemsPerPage, start_index, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	    	return reqAnalysisList;
	    }
	    
	 // Total Test Count - On Load
	 /*	Metric     : Operational/ Design/Total Test Count
	 	Rest URL   : rest/testCaseServices/totalTestCountinitial
	 	JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	     JS Function: TestCasesCtrl / $scope.initialcount = function()*/

	 	@GET
	     @Path("/totalTestCountinitial")
	     @Produces(MediaType.APPLICATION_JSON)
	  
	     public  long getTotalTestCountinitial(@HeaderParam("Authorization") String authString,
	 			@QueryParam("dashboardName") String dashboardName,
	 			@QueryParam("domainName") String domainName,
	 			@QueryParam("projectName") String projectName,
	 			@QueryParam("vardtfrom") String vardtfrom, 
	 			@QueryParam("vardtto") String vardtto,
	 			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	 			JsonMappingException, IOException, NumberFormatException,
	 			BaseException, BadLocationException, ParseException {
	 			almMetrics = new AlmMetrics();
	 			long testCount =0;
	 			testCount = almMetrics.getTotalTestCountinitial(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	 			return testCount;
	 	}
	 	
	 // Test Design Coverage
	 /*   Metric     : Operational/Design/Test Design Coverage
	    Rest URL   : rest/testCaseServices/designCoverage 
	    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	    JS Function: TestCasesCtrl/  $scope.designCoverage=function()
*/
	    @GET
	   	@Path("/designCoverage")
	   	@Produces(MediaType.APPLICATION_JSON)
	       public  long getDesignCoverage(@HeaderParam("Authorization") String authString,
	   			@QueryParam("dashboardName") String dashboardName,
	   			@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	   			JsonMappingException, IOException, NumberFormatException,
	   			BaseException, BadLocationException, ParseException {
	       	
	       	almMetrics = new AlmMetrics();
	       	long designcovg=0;
	       	designcovg = almMetrics.getDesignCoverage(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return designcovg;
	    }
	    
	 // Automation Coverage - On Load
	   /* Metric     : Operational/Design/Automation Coverage
	    Rest URL   : rest/testCaseServices/autoCoverageinitial 
	    JS File    : WebContent\app\pages\charts\testcases\testcasesdata\TestCasesCtrl.js
	    JS Function: TestCasesCtrl/ $scope.autoCoverage=function()
*/
	    @GET
		 @Path("/autoCoverageinitial")
		 @Produces(MediaType.APPLICATION_JSON)

	   public  long getAutoCoverageinitial(@HeaderParam("Authorization") String authString,
	  			@QueryParam("dashboardName") String dashboardName,
	  			@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
	  			JsonMappingException, IOException, NumberFormatException,
	  			BaseException, BadLocationException, ParseException {
	    	
	    	almMetrics = new AlmMetrics();
	    	long acresult = 0;
	    	acresult = almMetrics.getAutoCoverageinitial(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
	    	return acresult;
	    }
	   
	 
/*
 * **************************************************************************************ALM Defects Starts Here**********************************************************************************************************************
 */
	   
	// Total Defects Count - Date Filter 

	@GET
	@Path("/totalDefectCountFilter")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalDefectCountFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		long defCount=almMetrics.getTotalDefectCountFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return defCount;
		
	}
	
	// Defect Rejection Rate - Date Filter
	@GET
	@Path("/defectRejRateFilter")
	@Produces(MediaType.APPLICATION_JSON)
	public int defectRejectionRateFilter(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod
			
			)throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		int defRejRate=almMetrics.defectRejectionRateFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return defRejRate;
		
	}
	
	// Defect Density
	
	// Defect Rejection Rate - Date Filter
		@GET
		@Path("/defectdensityFilter")
		@Produces(MediaType.APPLICATION_JSON)
		public int defectDensityFilter(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod
				
				)throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			int defRejRate=almMetrics.defectDesnsityFilter(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return defRejRate;
			
		}
	
	
	// End of Defect Density
	
/* Defect Status Trend(Trend Graph) Starts Here */
	
	// Defect Status Trend - On Load
	/*Metric     : Operational/Defect/ Defect Status Trend (Daily Status)
	Rest URL   : rest/defectServices/ defecttrendchartdata
	JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
	JS Function: defectsCtrl/ $scope.defectTrendChart*/

	@GET
	@Path("/defecttrendchartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectTrendVO> getDefecttrendchart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName,
			@QueryParam("vardtfrom") String vardtfrom, 
			@QueryParam("vardtto") String vardtto,
			@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		List<DefectTrendVO> trendvolist=almMetrics.getDefecttrendchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return trendvolist;
		
	}
	
	// Defects by Priority - On Load
		/*Metric     : Operational/Defect/Defects by Priority
		Rest URL   : rest/defectServices/defectsprioritychartdata
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: $scope.newPriorityChart=function(domain, project,release)*/

		@GET
		@Path("/defectsprioritychartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectStatusVO> getDefectbardashchart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<DefectStatusVO> result=almMetrics.getDefectbardashchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return result;
		}
			
		/* Defects by Severity(Donut Chart) Starts Here */
		
		// Defects by Severity - On Load
		/*Metric     : Operational/Defect/Defects by Severity
		Rest URL   : rest/defectServices/defectsseveritychartdata
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: $scope.newSeverityChart=function(domain, project,release)*/

		@GET
		@Path("/defectsseveritychartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectStatusVO> getDefectenvchart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<DefectStatusVO> result=almMetrics.getDefectenvchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return result;
		}
		
		// Defects Assigned To - On Load
		/*Metric     : Operational/Defect/Defects Assigned To
		Rest URL   : rest/defectServices/defectownerchartdata
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: $scope.newOwnerChart=function(domain, project,release)*/

		@GET
		@Path("/defectownerchartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectStatusVO> getDefectuserchart(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<DefectStatusVO> result=almMetrics.getDefectuserchart(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return result;
		}
	
		// Defect Details - Pagination */
		/*Metric     : Operational/Defect/Defects Details
		Rest URL   : rest/defectServices/defectTableDetails
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: $scope.defectTableData = function(start_index)*/

		@GET
		@Path("/defectTableDetails")
		@Produces(MediaType.APPLICATION_JSON)
		public List<DefectVO> getRecordsdef(
				@HeaderParam("Authorization") String authString,
				@QueryParam("itemsPerPage") int itemsPerPage,
				@QueryParam("start_index") int start_index,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName,
				@QueryParam("vardtfrom") String vardtfrom, 
				@QueryParam("vardtto") String vardtto,
				@QueryParam("timeperiod") String timeperiod)
				throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
			almMetrics = new AlmMetrics();
			List<DefectVO> defAnalysisList = almMetrics.getRecordsdef(authString, itemsPerPage, start_index, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return defAnalysisList;
		}
		
		//Slideshow function for defects
		
		/* Total Defects Count(BA Panel) Starts Here */
		
		// Defects Count - On Load
		/*Metric     : Operational/Defect/Total Defects Count
		Rest URL   : rest/defectServices/totalDefectCountinitial
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: defectsCtrl/ $scope.initialcount = function()*/

		@GET
		@Path("/totalDefectCountinitial")
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
			almMetrics = new AlmMetrics();
			long defCount=almMetrics.getTotalDefectCountinitial(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
			return defCount;
		}
			
		/* Defect Rejection Rate(BA Panel) Starts Here */
		
		// Defect Rejection Rate - On Load
		/*Metric     : Operational/Defect/Defect Rejection Rate
		Rest URL   : rest/defectServices/defectRejectionRate
		JS File    : WebContent\app\pages\charts\defects\defectsdata\defectsCtrl.js
		JS Function: defectsCtrl/ $scope.defectrejrate=function()*/

		@GET
		@Path("/defectRejectionRate")
		@Produces(MediaType.APPLICATION_JSON)
		public int defectRejectionRate(@HeaderParam("Authorization") String authString,
				@QueryParam("dashboardName") String dashboardName,
				@QueryParam("domainName") String domainName,
				@QueryParam("projectName") String projectName)throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			almMetrics = new AlmMetrics();
			int defRejRate = almMetrics.defectRejectionRate( authString, dashboardName, domainName, projectName);
			return defRejRate;
		}
			
		
	
	@GET
	@Path("/defectsdataforpopup")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectVO> getRecords(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto, @QueryParam("timeperiod") String timeperiod)
					throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
					BadLocationException, ParseException {
		almMetrics = new AlmMetrics();
		List<DefectVO> srcFileAnalysisList = null;
		srcFileAnalysisList = almMetrics.getRecords(authString, dashboardName, domainName, projectName, vardtfrom, vardtto, timeperiod);
		return srcFileAnalysisList;
	}

}
