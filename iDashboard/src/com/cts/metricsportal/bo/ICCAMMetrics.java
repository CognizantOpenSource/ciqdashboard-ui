package com.cts.metricsportal.bo;
import java.util.List;

import com.idashboard.lifecycle.vo.CodeAnalysisHistoryVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ComplexityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_CoverageVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_DuplicationsVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_IssuesVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_MaintainabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ReliabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SecurityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SizeVO;

interface ICCAMMetrics {

	public List<CodeAnalysis_CoverageVO> getCodeCoverage(String AppName);
	public List<CodeAnalysisHistoryVO> getUnitTest(String AppName);
	
	public List<CodeAnalysis_SizeVO> getSize(String AppName);
	public List<CodeAnalysis_ComplexityVO> getComplexity(String AppName);
	public List<CodeAnalysis_IssuesVO> getissues(String AppName);
	
	public List<CodeAnalysis_ReliabilityVO> getreliability(String AppName);
	public List<CodeAnalysis_SecurityVO> getsecurityanalysis(String AppName);
	public List<CodeAnalysis_DuplicationsVO> getduplications(String AppName);
	public List<CodeAnalysis_MaintainabilityVO> getmaintainability(String AppName);
}

