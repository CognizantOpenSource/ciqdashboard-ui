package com.idashboard.lifecycle.dao;

import java.util.List;

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

public interface SonarMongoInterface {

	List<CodeAnalysis_CoverageVO> Sonar_ExecuteQuery_GetCoverage(String AppName);
	
	List<CodeAnalysisHistoryVO> Sonar_ExecuteQuery_GetUnitTest(String AppName);
	
	List<CodeAnalysis_SizeVO> Sonar_ExecuteQuery_GetSizeMetrics(String AppName);
	
	List<CodeAnalysis_ComplexityVO> Sonar_ExecuteQuery_GetComplexityMetrics(String AppName);
	
	List<CodeAnalysis_IssuesVO> Sonar_ExecuteQuery_GetIssueMetrics(String AppName);
	
	List<CodeAnalysis_ReliabilityVO> Sonar_ExecuteQuery_GetReliabilityMetrics(String AppName);

	List<CodeAnalysis_SecurityVO> Sonar_ExecuteQuery_GetSecurityAnalysisMetrics(String AppName);
	
	List<CodeAnalysis_DuplicationsVO> Sonar_ExecuteQuery_GetDuplicationsMetrics(String AppName);

	List<CodeAnalysis_MaintainabilityVO> Sonar_ExecuteQuery_GetMaintainabilityMetrics(String appName);

	List<CodeAnalysisVO> Sonar_ExecuteQuery_GetCodeAnalysisMetrics();
	
}
