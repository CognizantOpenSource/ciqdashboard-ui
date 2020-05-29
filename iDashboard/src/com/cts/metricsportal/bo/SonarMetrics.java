package com.cts.metricsportal.bo;

import java.util.ArrayList;
import java.util.List;


import com.cts.metricsportal.dao.SonarMongoOperations;
import com.idashboard.lifecycle.vo.CodeAnalysisHistoryVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ComplexityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_CoverageVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_DuplicationsVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_IssuesVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_MaintainabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ReliabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SecurityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SizeVO;


public class SonarMetrics implements ICCAMMetrics {
	
	@Override
    public List<CodeAnalysis_CoverageVO> getCodeCoverage(String AppName) {

		List<CodeAnalysis_CoverageVO> CodeCoveragelst = new ArrayList<CodeAnalysis_CoverageVO>();
		CodeCoveragelst=SonarMongoOperations.Sonar_ExecuteQuery_GetCoverage(AppName);
    	return CodeCoveragelst;
    }
	
	@Override
    public List<CodeAnalysisHistoryVO> getUnitTest(String AppName) {

		List<CodeAnalysisHistoryVO> UnitTestlst = new ArrayList<CodeAnalysisHistoryVO>();
		UnitTestlst=SonarMongoOperations.Sonar_ExecuteQuery_GetUnitTest(AppName);
    	return UnitTestlst;
    }
	
	@Override
    public List<CodeAnalysis_SizeVO> getSize(String AppName) {

		List<CodeAnalysis_SizeVO> SizeMetricslst = new ArrayList<CodeAnalysis_SizeVO>();
		SizeMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetSizeMetrics(AppName);
    	return SizeMetricslst;
    }
	
	@Override
    public List<CodeAnalysis_ComplexityVO> getComplexity(String AppName) {

		List<CodeAnalysis_ComplexityVO> ComplexityMetricslst = new ArrayList<CodeAnalysis_ComplexityVO>();
		ComplexityMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetComplexityMetrics(AppName);
    	return ComplexityMetricslst;
    }
	
	@Override
    public List<CodeAnalysis_IssuesVO> getissues(String AppName) {

		List<CodeAnalysis_IssuesVO> IssueMetricslst = new ArrayList<CodeAnalysis_IssuesVO>();
		IssueMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetIssueMetrics(AppName);
    	return IssueMetricslst;
    }
	
	@Override
    public List<CodeAnalysis_ReliabilityVO> getreliability(String AppName) {

		List<CodeAnalysis_ReliabilityVO> reliabilityMetricslst = new ArrayList<CodeAnalysis_ReliabilityVO>();
		reliabilityMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetReliabilityMetrics(AppName);
    	return reliabilityMetricslst;
    }
	
	@Override
    public List<CodeAnalysis_SecurityVO> getsecurityanalysis(String AppName) {

		List<CodeAnalysis_SecurityVO> SecurityAnalysisMetricslst = new ArrayList<CodeAnalysis_SecurityVO>();
		SecurityAnalysisMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetSecurityAnalysisMetrics(AppName);
    	return SecurityAnalysisMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_DuplicationsVO> getduplications(String AppName) {

		List<CodeAnalysis_DuplicationsVO> SecurityAnalysisMetricslst = new ArrayList<CodeAnalysis_DuplicationsVO>();
		SecurityAnalysisMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetDuplicationsMetrics(AppName);
    	return SecurityAnalysisMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_MaintainabilityVO> getmaintainability(String AppName) {

		List<CodeAnalysis_MaintainabilityVO> MaintainabilityMetricslst = new ArrayList<CodeAnalysis_MaintainabilityVO>();
		MaintainabilityMetricslst=SonarMongoOperations.Sonar_ExecuteQuery_GetMaintainabilityMetrics(AppName);
    	return MaintainabilityMetricslst;
    }

}
