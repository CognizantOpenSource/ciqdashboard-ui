package com.idashboard.lifecycle.controller;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idashboard.lifecycle.service.CodeQualityService;
import com.idashboard.lifecycle.serviceImpl.CodeQualityServiceImpl;
import com.idashboard.lifecycle.vo.CodeAnalysisHistoryVO;
import com.idashboard.lifecycle.vo.CodeAnalysisVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ComplexityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_CoverageVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_DuplicationsVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_IssuesVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_MaintainabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ReliabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SecurityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SizeVO;

@Path("/codequality")
public class CodeQualityController {
	
	CodeQualityService codequalityService = new CodeQualityServiceImpl();
	
	/* Code Analysis */

	// ***************************************************************************************************/
	// Description : To get code coverage Metrics
	// WebService Name : getcoverage
	// Input : Authorization and Project Name
	// Output : Get line of Code, Code Coverage Value in Home Page, In the Main
	// page Using the Data
	// to Draw a Trend Graph, also get the lines of cover and new lines to cover
	// metrics
	// ***************************************************************************************************/

	@GET
	@Path("/getcoverage")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_CoverageVO> getCoverage(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_CoverageVO> codeCoverageList = new ArrayList<CodeAnalysis_CoverageVO>();

		codeCoverageList = codequalityService.getCodeCoverage(ProjectName, authString);
		return codeCoverageList;
		
	}
	
	// ***************************************************************************************************/
	// Description : To get UnitTest Metrics
	// WebService Name : getunittest
	// Input : Authorization and Project Name
	// Output : Get Success Percentage, Test Duration count in the Main page
	// Using the Data
	// to Draw a Unit Test Graph
	// ***************************************************************************************************/

	@GET
	@Path("/getunittest")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysisHistoryVO> getUnitTest(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysisHistoryVO> UnitTestLst = new ArrayList<CodeAnalysisHistoryVO>();

		UnitTestLst = codequalityService.getUnitTest(ProjectName, authString);
		return UnitTestLst;
			
	}
	
	// ***************************************************************************************************/
		// Description : To get Size Metrics
		// WebService Name : getsizemetrics
		// Input : Authorization and Project Name
		// Output : Get Classes,Function and lines Count
		// ***************************************************************************************************/

		@GET
		@Path("/getsizemetrics")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_SizeVO> getSizeMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_SizeVO> SizeMetricsLst = new ArrayList<CodeAnalysis_SizeVO>();

			SizeMetricsLst = codequalityService.getSize(ProjectName, authString);
			return SizeMetricsLst;
			
		}
		
		// ***************************************************************************************************/
		// Description : To get Complexity Metrics
		// WebService Name : getComplexityMetrics
		// Input : Authorization and Project Name
		// Output : Get Complexity,ComplexityFunction and ComplexityClass Count
		// ***************************************************************************************************/

		@GET
		@Path("/getcomplexitymetrics")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_ComplexityVO> getComplexityMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_ComplexityVO> ComplexityMetricsLst = new ArrayList<CodeAnalysis_ComplexityVO>();
			
			ComplexityMetricsLst = codequalityService.getComplexity(ProjectName, authString);
			return ComplexityMetricsLst;
			
		}
		
		// ***************************************************************************************************/
		// Description : To get Issue Metrics
		// WebService Name : getIssueMetrics
		// Input : Authorization and Project Name
		// Output : Get Complexity,ComplexityFunction and ComplexityClass Count
		// ***************************************************************************************************/

		@GET
		@Path("/getissuemetrics")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_IssuesVO> getIssueMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_IssuesVO> IssueMetricsLst = new ArrayList<CodeAnalysis_IssuesVO>();

			IssueMetricsLst = codequalityService.getissues(ProjectName, authString);
			return IssueMetricsLst;
			
		}
		
		// ***************************************************************************************************/
		// Description : To get ReliabilityMetricsLst Metrics
		// WebService Name : getReliabilityMetrics
		// Input : Authorization and Project Name
		// Output : Get ReliabilityMetrics Trend Graph using the response data,
		// NewBugs,Rating and New Rating
		// ***************************************************************************************************/

		@GET
		@Path("/getreliabilitymetrics")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_ReliabilityVO> getReliabilityMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_ReliabilityVO> ReliabilityMetricsLst = new ArrayList<CodeAnalysis_ReliabilityVO>();
			
			ReliabilityMetricsLst = codequalityService.getreliability(ProjectName,authString);
			return ReliabilityMetricsLst;
			
		}
		
		// ***************************************************************************************************/
		// Description : To get SecurityAnalysis Metrics
		// WebService Name : getSecurityAnalysisMetrics
		// Input : Authorization and Project Name
		// Output : Get getSecurityAnalysisMetrics Trend Graph using the response
		// data, NewVulenerabilities,
		// rating and new rating
		// ***************************************************************************************************/

		@GET
		@Path("/getsecurityanalysis")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_SecurityVO> getSecurityAnalysisMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_SecurityVO> SecurityAnalysisMetricsLst = new ArrayList<CodeAnalysis_SecurityVO>();

			SecurityAnalysisMetricsLst = codequalityService.getsecurityanalysis(ProjectName,authString);
			return SecurityAnalysisMetricsLst;
			
		}
		
		// ***************************************************************************************************/
		// Description : To get Duplications Metrics
		// WebService Name : getDuplicationsMetrics
		// Input : Authorization and Project Name
		// Output : Get duplications metrics Trend Graph using the response
		// data, NewVulenerabilities,
		// file, line and new lines
		// ***************************************************************************************************/

		@GET
		@Path("/getduplications")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_DuplicationsVO> getDuplicationsMetrics(@HeaderParam("Authorization") String authString,
				@QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_DuplicationsVO> DuplicationsMetricsLst = new ArrayList<CodeAnalysis_DuplicationsVO>();

			DuplicationsMetricsLst = codequalityService.getduplications(ProjectName,authString);
			return DuplicationsMetricsLst;
			
		}

		// ***************************************************************************************************/
		// Description : To get Maintainability Metrics
		// WebService Name : getMaintainabilityMetrics
		// Input : Authorization and Project Name
		// Output : Get duplications metrics Trend Graph using the response
		// data, NewVulenerabilities,
		// file, line and new lines
		// ***************************************************************************************************/

		@GET
		@Path("/getmaintainability")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysis_MaintainabilityVO> getMaintainabilityMetrics(
				@HeaderParam("Authorization") String authString, @QueryParam("projectname") String ProjectName) {

			List<CodeAnalysis_MaintainabilityVO> MaintainabilityMetricsLst = new ArrayList<CodeAnalysis_MaintainabilityVO>();

			MaintainabilityMetricsLst = codequalityService.getmaintainability(ProjectName,authString);
			return MaintainabilityMetricsLst;
			
		}

		
		@GET
		@Path("/ca_detail")
		@Produces(MediaType.APPLICATION_JSON)
		public List<CodeAnalysisVO> codeAnalysis(@HeaderParam("Authorization") String authString) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BadLocationException {
		List<CodeAnalysisVO> codeAnalysisList = new ArrayList<CodeAnalysisVO>();
			

		codeAnalysisList = codequalityService.getCodeAnalysis(authString);
		return codeAnalysisList;

		}
}
