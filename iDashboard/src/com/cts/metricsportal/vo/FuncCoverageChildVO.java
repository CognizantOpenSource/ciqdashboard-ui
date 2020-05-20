package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "FunctionalCoverage") 
public class FuncCoverageChildVO {

	private String folderClass;
	private String reqID;
	private String reqName;
	private String codeMappedCoverage;
	private String testCount;
	private String impactedTestCount;
	private String impactedTestPercentage;
	private String functionalImpact;
	
	private String indentation;
	
	private List<FuncCoverageChildVO> children=new ArrayList<FuncCoverageChildVO>();
	
	public String getreqID() {
		return reqID;
	}
	public void setname(String reqID) {
		this.reqID = reqID;
	}
	public String getreqName() {
		return reqName;
	}
	public void setAgent(String reqName) {
		this.reqName = reqName;
	}
	public List<FuncCoverageChildVO> getChildren() {
		return children;
	}
	
	public void setChildren(List<FuncCoverageChildVO> children) {
		this.children = children;
	}
	public String getFolderClass() {
		return folderClass;
	}
	public void setFolderClass(String folderClass) {
		this.folderClass = folderClass;
	}
	public String getCodeMappedCoverage() {
		return codeMappedCoverage;
	}
	public void setCodeMappedCoverage(String codeMappedCoverage) {
		this.codeMappedCoverage = codeMappedCoverage;
	}
	public String getTestCount() {
		return testCount;
	}
	public void setTestCount(String testCount) {
		this.testCount = testCount;
	}
	public String getImpactedTestCount() {
		return impactedTestCount;
	}
	public void setImpactedTestCount(String impactedTestCount) {
		this.impactedTestCount = impactedTestCount;
	}
	public String getImpactedTestPercentage() {
		return impactedTestPercentage;
	}
	public void setImpactedTestPercentage(String impactedTestPercentage) {
		this.impactedTestPercentage = impactedTestPercentage;
	}
	public String getFunctionalImpact() {
		return functionalImpact;
	}
	public void setFunctionalImpact(String functionalImpact) {
		this.functionalImpact = functionalImpact;
	}
	public String getIndentation() {
		return indentation;
	}
	public void setIndentation(String indentation) {
		this.indentation = indentation;
	}
}
