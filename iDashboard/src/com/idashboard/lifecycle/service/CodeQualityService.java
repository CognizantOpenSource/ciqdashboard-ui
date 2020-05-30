package com.idashboard.lifecycle.service;

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

public interface CodeQualityService {

	List<CodeAnalysis_CoverageVO> getCodeCoverage(String AppName, String authString);

	List<CodeAnalysisHistoryVO> getUnitTest(String AppName, String authString);
	
	List<CodeAnalysis_SizeVO> getSize(String AppName, String authString);
	
	List<CodeAnalysis_ComplexityVO> getComplexity(String AppName, String authString);
	
	List<CodeAnalysis_IssuesVO> getissues(String AppName, String authString);
	
	List<CodeAnalysis_ReliabilityVO> getreliability(String AppName, String authString);

	List<CodeAnalysis_SecurityVO> getsecurityanalysis(String AppName, String authString);

	List<CodeAnalysis_DuplicationsVO> getduplications(String AppName, String authString);

	List<CodeAnalysis_MaintainabilityVO> getmaintainability(String AppName, String authString);

	List<CodeAnalysisVO> getCodeAnalysis(String authString);
	

}
