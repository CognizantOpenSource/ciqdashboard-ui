package com.cts.metricsportal.dao;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;
import com.cts.metricsportal.vo.CodeAnalysisHistoryVO;
import com.cts.metricsportal.vo.CodeAnalysisVO;
import com.cts.metricsportal.vo.CodeAnalysis_ComplexityVO;
import com.cts.metricsportal.vo.CodeAnalysis_CoverageVO;
import com.cts.metricsportal.vo.CodeAnalysis_DuplicationsVO;
import com.cts.metricsportal.vo.CodeAnalysis_IssuesVO;
import com.cts.metricsportal.vo.CodeAnalysis_MaintainabilityVO;
import com.cts.metricsportal.vo.CodeAnalysis_ReliabilityVO;
import com.cts.metricsportal.vo.CodeAnalysis_SecurityVO;
import com.cts.metricsportal.vo.CodeAnalysis_SizeVO;

public class SonarMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(SonarMongoOperations.class);

	// ***************************************************************************************************/
	// Description : Get Sonar coverage and No.Of lines,Lines to Cover and New
	// Lines to cover.
	// Function Name : Sonar_ExecuteQuery_GetCoverage
	// Input : Application Name
	// Output : Get Total Number of lines and Coverage Percentage for an
	// Application Name
	// ***************************************************************************************************/

	public static List<CodeAnalysis_CoverageVO> Sonar_ExecuteQuery_GetCoverage(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_CoverageVO CoverageMetricslst = new CodeAnalysis_CoverageVO();
		List<CodeAnalysis_CoverageVO> CoverageMetricslst_updatelist = new ArrayList<CodeAnalysis_CoverageVO>();


		try {

			int CAHistorylen = 0;
			String date = "";
			String linesofcode = "";
			String newlinestocover = "";
			

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn("Sonar_ExecuteQuery_GetCoverage - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();
			
			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				CoverageMetricslst = CodeAnalysisHistoryList.get(cahis).getCoverage();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					newlinestocover=CodeAnalysisList.get(0).getNew_lines_to_cover();
					linesofcode = CodeAnalysisHistoryList.get(cahis).getSize().getLines();
					
					CoverageMetricslst.setDate(date);
					CoverageMetricslst.setNew_lines_to_cover(newlinestocover);
					CoverageMetricslst.setLines(linesofcode);
					
				}
				CoverageMetricslst_updatelist.add(CoverageMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return CoverageMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get UnitTest Metrics
	// WebService Name : Sonar_ExecuteQuery_GetUnitTest
	// Input : Authorization and Project Name
	// Output : Get Success Percentage, Test Duration count in the Main page
	// Using the Data
	// to Draw a Unit Test Graph
	// ***************************************************************************************************/

	public static List<CodeAnalysisHistoryVO> Sonar_ExecuteQuery_GetUnitTest(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		ArrayList<CodeAnalysisHistoryVO> UnitTestresultList = new ArrayList<CodeAnalysisHistoryVO>();

		try {

			int CAHistorylen = 0;
			String test = "";
			String date = "";
			String testexecutiontime = "";
			String testsuccessdensity = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn("Sonar_ExecuteQuery_GetUnitTest - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();

			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				date = CodeAnalysisHistoryList.get(cahis).getDate();
				test = CodeAnalysisHistoryList.get(cahis).getCoverage().getTests();
				testexecutiontime = CodeAnalysisHistoryList.get(cahis).getCoverage().getTest_execution_time();
				testsuccessdensity = CodeAnalysisHistoryList.get(cahis).getCoverage().getTest_success_density();

				CodeAnalysisHistoryVO UnitTestreslst = new CodeAnalysisHistoryVO();
				UnitTestreslst.getCoverage().setTests(test);
				UnitTestreslst.setDate(date);
				UnitTestreslst.getCoverage().setTest_execution_time(testexecutiontime);
				UnitTestreslst.getCoverage().setTest_success_density(testsuccessdensity);
				UnitTestresultList.add(UnitTestreslst);

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return UnitTestresultList;
	}

	// ***************************************************************************************************/
	// Description : To get Size Metrics
	// WebService Name : Sonar_ExecuteQuery_GetSizeMetrics
	// Input : Authorization and Project Name
	// Output : Get the Class,Function and lines Count
	// ***************************************************************************************************/

	public static List<CodeAnalysis_SizeVO> Sonar_ExecuteQuery_GetSizeMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_SizeVO SizeMetricslst = new CodeAnalysis_SizeVO();
		List<CodeAnalysis_SizeVO> SizeMetricslst_updatelist = new ArrayList<CodeAnalysis_SizeVO>();


		try {

			int CAHistorylen = 0;
			String classes = "";
			String functions = "";
			String lines = "";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetSizeMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();
			
			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				SizeMetricslst = CodeAnalysisHistoryList.get(cahis).getSize();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					SizeMetricslst.setDate(date);
				}
				SizeMetricslst_updatelist.add(SizeMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return SizeMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get Complexity Metrics
	// WebService Name : Sonar_ExecuteQuery_GetComplexityMetrics
	// Input : Authorization and Project Name
	// Output : Get the Complexity, Class Complexity,and Function Complexity
	// Count
	// ***************************************************************************************************/

	public static List<CodeAnalysis_ComplexityVO> Sonar_ExecuteQuery_GetComplexityMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_ComplexityVO ComplexityMetricslst = new CodeAnalysis_ComplexityVO();
		List<CodeAnalysis_ComplexityVO> ComplexityMetricslst_updatelist = new ArrayList<CodeAnalysis_ComplexityVO>();

		try {

			int CAHistorylen = 0;
			String complexity = "";
			String classes = "";
			String functions = "";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetComplexityMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();

			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				ComplexityMetricslst = CodeAnalysisHistoryList.get(cahis).getComplexity();
				for (int sec = 0; sec < CAHistorylen; sec++) {

					date = CodeAnalysisHistoryList.get(cahis).getDate();
					ComplexityMetricslst.setDate(date);
				}
				ComplexityMetricslst_updatelist.add(ComplexityMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return ComplexityMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get Issue Metrics
	// WebService Name : Sonar_ExecuteQuery_GetIssueMetrics
	// Input : Authorization and Project Name
	// Output : Get the Issue,OpeIssue and Re-OpenIssue Count
	// ***************************************************************************************************/

	public static List<CodeAnalysis_IssuesVO> Sonar_ExecuteQuery_GetIssueMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_IssuesVO IssueMetricslst = new CodeAnalysis_IssuesVO();
		List<CodeAnalysis_IssuesVO> IssueMetricslst_updatelist = new ArrayList<CodeAnalysis_IssuesVO>();

		try {

			int CAHistorylen = 0;
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetIssueMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();
			
			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				IssueMetricslst = CodeAnalysisHistoryList.get(cahis).getIssues();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					IssueMetricslst.setDate(date);
				}
				IssueMetricslst_updatelist.add(IssueMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return IssueMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get Reliability Metrics
	// WebService Name : Sonar_ExecuteQuery_GetIssueMetrics
	// Input : Authorization and Project Name
	// Output : Get the Issue,OpeIssue and Re-OpenIssue Count
	// ***************************************************************************************************/

	public static List<CodeAnalysis_ReliabilityVO> Sonar_ExecuteQuery_GetReliabilityMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_ReliabilityVO ReliabilityMetricslst = new CodeAnalysis_ReliabilityVO();
		List<CodeAnalysis_ReliabilityVO> ReliabilityMetricslst_updatelist = new ArrayList<CodeAnalysis_ReliabilityVO>();

		try {

			int CAHistorylen = 0;
			String newbugs = "";
			String bugs = "";
			String rating = "";
			String newrating = "";
			String remediationeffort = "";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetReliabilityMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();
			
			
			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				ReliabilityMetricslst = CodeAnalysisHistoryList.get(cahis).getReliability();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					newbugs = CodeAnalysisList.get(0).getNew_bugs();
					newrating = CodeAnalysisList.get(0).getNew_reliability_rating();
					

					ReliabilityMetricslst.setDate(date);
					ReliabilityMetricslst.setNew_bugs(newbugs);
					ReliabilityMetricslst.setNew_reliability_rating(newrating);
				}
				ReliabilityMetricslst_updatelist.add(ReliabilityMetricslst);
			}
			

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return ReliabilityMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get SecurityAnalysis Metrics
	// WebService Name : Sonar_ExecuteQuery_GetSecurityAnalysisMetrics
	// Input : Authorization and Project Name
	// Output : Get the Trend Graph Using data, New Vulnerabilities,Rating and
	// new Rating
	// ***************************************************************************************************/

	public static List<CodeAnalysis_SecurityVO> Sonar_ExecuteQuery_GetSecurityAnalysisMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_SecurityVO SecurityAnalysisMetricslst = new CodeAnalysis_SecurityVO();
		List<CodeAnalysis_SecurityVO> SecurityAnalysisMetricslst_updatelist = new ArrayList<CodeAnalysis_SecurityVO>();

		try {

			int CAHistorylen = 0;
			String vulnerabilities = "";
			String newsecurityrating = "";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetSecurityAnalysisMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();

			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				SecurityAnalysisMetricslst = CodeAnalysisHistoryList.get(cahis).getSecurity();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					vulnerabilities = CodeAnalysisList.get(0).getNew_vulnerabilities();
					newsecurityrating = CodeAnalysisList.get(0).getNew_security_rating();

					SecurityAnalysisMetricslst.setDate(date);
					SecurityAnalysisMetricslst.setNew_vulnerabilities(vulnerabilities);
					SecurityAnalysisMetricslst.setNew_security_rating(newsecurityrating);
				}
				SecurityAnalysisMetricslst_updatelist.add(SecurityAnalysisMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return SecurityAnalysisMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get Duplications Metrics
	// WebService Name : Sonar_ExecuteQuery_GetDuplicationsMetrics
	// Input : Authorization and Project Name
	// Output : Get the Trend Graph Using data, File, lines and
	// new lines
	// ***************************************************************************************************/

	public static List<CodeAnalysis_DuplicationsVO> Sonar_ExecuteQuery_GetDuplicationsMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_DuplicationsVO DuplicationsMetricslst = new CodeAnalysis_DuplicationsVO();
		List<CodeAnalysis_DuplicationsVO> DuplicationsMetricslst_updatelist = new ArrayList<CodeAnalysis_DuplicationsVO>();

		try {

			int CAHistorylen = 0;
			String newduplicated = "";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetDuplicationsMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();

			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				DuplicationsMetricslst = CodeAnalysisHistoryList.get(cahis).getDuplications();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					newduplicated = CodeAnalysisList.get(0).getNew_duplicated_lines();

					DuplicationsMetricslst.setDate(date);
					DuplicationsMetricslst.setNew_duplicated_lines(newduplicated);

				}
				DuplicationsMetricslst_updatelist.add(DuplicationsMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return DuplicationsMetricslst_updatelist;
	}

	// ***************************************************************************************************/
	// Description : To get Maintainability Metrics
	// WebService Name : Sonar_ExecuteQuery_GetMaintainabilityMetrics
	// Input : Authorization and Project Name
	// Output : Get the Trend Graph Using code smells,technical debt,and maintainability rating 
	// 
	// ***************************************************************************************************/

	public static List<CodeAnalysis_MaintainabilityVO> Sonar_ExecuteQuery_GetMaintainabilityMetrics(String AppName) {

		List<CodeAnalysisVO> CodeAnalysisList = new ArrayList<CodeAnalysisVO>();
		List<CodeAnalysisHistoryVO> CodeAnalysisHistoryList = new ArrayList<CodeAnalysisHistoryVO>();

		// From History need to get the Security Data
		CodeAnalysis_MaintainabilityVO MaintainabilityMetricslst = new CodeAnalysis_MaintainabilityVO();
		List<CodeAnalysis_MaintainabilityVO> MaintainabilityMetricslst_updatelist = new ArrayList<CodeAnalysis_MaintainabilityVO>();

		try {

			int CAHistorylen = 0;
			String newcodesmells = "";
			String newtechdebt="";
			String newmaintainabilityrating="";
			String date = "";

			Query Qry = new Query();

			if (AppName.isEmpty()) {
				logger.warn(
						"Sonar_ExecuteQuery_GetMaintainabilityMetrics - ApplicationName is Empty Please Select ApplicationName");
			}

			Qry.addCriteria(Criteria.where("prjName").is(AppName));
			CodeAnalysisList = getMongoOperation().find(Qry, CodeAnalysisVO.class);

			// Get History List from the ca_details collection from Mongo DB
			CodeAnalysisHistoryList = CodeAnalysisList.get(0).getHistory();
			CAHistorylen = CodeAnalysisHistoryList.size();

			for (int cahis = 0; cahis < CAHistorylen; cahis++) {
				MaintainabilityMetricslst = CodeAnalysisHistoryList.get(cahis).getMaintainability();
				for (int sec = 0; sec < CAHistorylen; sec++) {
					
					date = CodeAnalysisHistoryList.get(cahis).getDate();
					newcodesmells = CodeAnalysisList.get(0).getNew_code_smells();
					newtechdebt =CodeAnalysisList.get(0).getNew_technical_debt();
					newmaintainabilityrating= CodeAnalysisList.get(0).getNew_maintainability_rating();

					MaintainabilityMetricslst.setDate(date);
					MaintainabilityMetricslst.setNew_code_smells(newcodesmells);
					MaintainabilityMetricslst.setNew_technical_debt(newtechdebt);
					MaintainabilityMetricslst.setNew_maintainability_rating(newmaintainabilityrating);
					

				}
				MaintainabilityMetricslst_updatelist.add(MaintainabilityMetricslst);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {

		}

		return MaintainabilityMetricslst_updatelist;
	}

}
