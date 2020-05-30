package com.idashboard.lifecycle.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import com.cts.metricsportal.bo.LayerAccess;
import com.idashboard.lifecycle.dao.SonarMongoInterface;
import com.idashboard.lifecycle.daoImpl.SonarMongoOperationImpl;
import com.idashboard.lifecycle.service.CodeQualityService;
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

public class CodeQualityServiceImpl implements CodeQualityService{
	
	SonarMongoInterface sonarOperation = new SonarMongoOperationImpl();
	
	@Override
	public List<CodeAnalysis_CoverageVO> getCodeCoverage(String AppName, String authString) {
		
		List<CodeAnalysis_CoverageVO> CodeCoveragelst = new ArrayList<CodeAnalysis_CoverageVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			CodeCoveragelst=sonarOperation.Sonar_ExecuteQuery_GetCoverage(AppName);
		}
    	return CodeCoveragelst;
	}

	@Override
	public List<CodeAnalysisHistoryVO> getUnitTest(String AppName, String authString) {
		
		List<CodeAnalysisHistoryVO> UnitTestlst = new ArrayList<CodeAnalysisHistoryVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			UnitTestlst=sonarOperation.Sonar_ExecuteQuery_GetUnitTest(AppName);
		}
    	return UnitTestlst;
	}
	
	@Override
    public List<CodeAnalysis_SizeVO> getSize(String AppName, String authString) {

		List<CodeAnalysis_SizeVO> SizeMetricslst = new ArrayList<CodeAnalysis_SizeVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			SizeMetricslst=sonarOperation.Sonar_ExecuteQuery_GetSizeMetrics(AppName);
		}
    	return SizeMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_ComplexityVO> getComplexity(String AppName, String authString) {

		List<CodeAnalysis_ComplexityVO> ComplexityMetricslst = new ArrayList<CodeAnalysis_ComplexityVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			ComplexityMetricslst=sonarOperation.Sonar_ExecuteQuery_GetComplexityMetrics(AppName);
		}
    	return ComplexityMetricslst;
    }
	
    @Override
    public List<CodeAnalysis_IssuesVO> getissues(String AppName, String authString) {

		List<CodeAnalysis_IssuesVO> IssueMetricslst = new ArrayList<CodeAnalysis_IssuesVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			IssueMetricslst=sonarOperation.Sonar_ExecuteQuery_GetIssueMetrics(AppName);
		}
    	return IssueMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_ReliabilityVO> getreliability(String AppName, String authString) {

		List<CodeAnalysis_ReliabilityVO> reliabilityMetricslst = new ArrayList<CodeAnalysis_ReliabilityVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			reliabilityMetricslst=sonarOperation.Sonar_ExecuteQuery_GetReliabilityMetrics(AppName);
		}
    	return reliabilityMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_SecurityVO> getsecurityanalysis(String AppName,String authString) {

		List<CodeAnalysis_SecurityVO> SecurityAnalysisMetricslst = new ArrayList<CodeAnalysis_SecurityVO>();
		
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			SecurityAnalysisMetricslst=sonarOperation.Sonar_ExecuteQuery_GetSecurityAnalysisMetrics(AppName);
		}
		return SecurityAnalysisMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_DuplicationsVO> getduplications(String AppName, String authString) {

		List<CodeAnalysis_DuplicationsVO> SecurityAnalysisMetricslst = new ArrayList<CodeAnalysis_DuplicationsVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			SecurityAnalysisMetricslst=sonarOperation.Sonar_ExecuteQuery_GetDuplicationsMetrics(AppName);
		}
		return SecurityAnalysisMetricslst;
    }
    
    @Override
    public List<CodeAnalysis_MaintainabilityVO> getmaintainability(String AppName, String authString) {

		List<CodeAnalysis_MaintainabilityVO> MaintainabilityMetricslst = new ArrayList<CodeAnalysis_MaintainabilityVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			MaintainabilityMetricslst=sonarOperation.Sonar_ExecuteQuery_GetMaintainabilityMetrics(AppName);
		}
		return MaintainabilityMetricslst;
    }

    @Override
    public List<CodeAnalysisVO> getCodeAnalysis(String authString){
		
    	List<CodeAnalysisVO> codeAnalysisList = new ArrayList<CodeAnalysisVO>();
    	
    	boolean authenticateToken = LayerAccess.authenticateToken(authString);
    	
    	if(authenticateToken) {
    		codeAnalysisList = sonarOperation.Sonar_ExecuteQuery_GetCodeAnalysisMetrics();
    	}
    	return codeAnalysisList;
    	
    }
}
