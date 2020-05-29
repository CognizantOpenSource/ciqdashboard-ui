package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.idashboard.lifecycle.vo.CodeAnalysis_ComplexityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_DuplicationsVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_IssuesVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_MaintainabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ReliabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SecurityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SizeVO;

@Document(collection = "LCsonarCodeQual")
public class CodeAnalysisHistoryVO {
	
	private String date;
	private String newlinestocover;
	private String linestocover;
	
	private String rating;
	private String newrating;
	private String newbugs;
	
	private String new_security_vulnerabilities;
	private String new_security_rating;
	
	
	private CodeAnalysis_ReliabilityVO reliability=new CodeAnalysis_ReliabilityVO();  
	private CodeAnalysis_SecurityVO security=new CodeAnalysis_SecurityVO();
	
	private CodeAnalysis_MaintainabilityVO Maintainability= new CodeAnalysis_MaintainabilityVO();
	private CodeAnalysis_DuplicationsVO Duplications= new CodeAnalysis_DuplicationsVO();
	private CodeAnalysis_SizeVO Size= new CodeAnalysis_SizeVO();
	private CodeAnalysis_ComplexityVO Complexity= new CodeAnalysis_ComplexityVO();
	private CodeAnalysis_IssuesVO Issues= new CodeAnalysis_IssuesVO();
	private CodeAnalysis_CoverageVO Coverage= new CodeAnalysis_CoverageVO();
	

	public String getNewbugs() {
		return newbugs;
	}
	public void setNewbugs(String newbugs) {
		this.newbugs = newbugs;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getNewrating() {
		return newrating;
	}
	public void setNewrating(String newrating) {
		this.newrating = newrating;
	}
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public CodeAnalysis_ReliabilityVO getReliability() {
		return reliability;
	}
	
	public String getNewlinestocover() {
		return newlinestocover;
	}
	public void setNewlinestocover(String newlinestocover) {
		this.newlinestocover = newlinestocover;
	}
	
	public String getLinestocover() {
		return linestocover;
	}
	public void setLinestocover(String linestocover) {
		this.linestocover = linestocover;
	}
	
	public void setReliability(CodeAnalysis_ReliabilityVO reliability) {
		this.reliability = reliability;
	}
	
	public CodeAnalysis_MaintainabilityVO getMaintainability() {
		return Maintainability;
	}
	
	public CodeAnalysis_SecurityVO getSecurity() {
		return security;
	}
	public void setSecurity(CodeAnalysis_SecurityVO security) {
		this.security = security;
	}
	public void setMaintainability(CodeAnalysis_MaintainabilityVO maintainability) {
		Maintainability = maintainability;
	}
	public CodeAnalysis_DuplicationsVO getDuplications() {
		return Duplications;
	}
	public void setDuplications(CodeAnalysis_DuplicationsVO duplications) {
		Duplications = duplications;
	}
	public CodeAnalysis_SizeVO getSize() {
		return Size;
	}
	public void setSize(CodeAnalysis_SizeVO size) {
		Size = size;
	}
	public CodeAnalysis_ComplexityVO getComplexity() {
		return Complexity;
	}
	public void setComplexity(CodeAnalysis_ComplexityVO complexity) {
		Complexity = complexity;
	}
	public CodeAnalysis_IssuesVO getIssues() {
		return Issues;
	}
	public void setIssues(CodeAnalysis_IssuesVO issues) {
		Issues = issues;
	}
	
	public CodeAnalysis_CoverageVO getCoverage() {
		return Coverage;
	}
	public void setCoverage(CodeAnalysis_CoverageVO coverage) {
		Coverage = coverage;
	}
	
	
}
