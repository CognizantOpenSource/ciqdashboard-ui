package com.cts.metricsportal.vo;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class Ca_detailVO {
	
	private String name;
	private String version;
	private String technicalDebt;
	private String linesofCode;

	private List<Ca_ComplexityVO> Complexity= new ArrayList<Ca_ComplexityVO>();
	private List<Ca_CoverageVO> Coverage= new ArrayList<Ca_CoverageVO>();
	private List<Ca_SizeVO> Size= new ArrayList<Ca_SizeVO>();
	private List<Ca_ReliabilityVO> Reliability= new ArrayList<Ca_ReliabilityVO>();
	private List<Ca_SecurityVO> Security= new ArrayList<Ca_SecurityVO>();
	private List<Ca_MaintainabilityVO> Maintainability= new ArrayList<Ca_MaintainabilityVO>();
	private List<Ca_DuplicationsVO> Duplications= new ArrayList<Ca_DuplicationsVO>();
	private List<Ca_IssuesVO> Issues= new ArrayList<Ca_IssuesVO>();
	private List<Ca_UnitTestsVO> UnitTests= new ArrayList<Ca_UnitTestsVO>();
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getTechnicalDebt() {
		return technicalDebt;
	}
	public void setTechnicalDebt(String technicalDebt) {
		this.technicalDebt = technicalDebt;
	}
	public String getLinesofCode() {
		return linesofCode;
	}
	public void setLinesofCode(String linesofCode) {
		this.linesofCode = linesofCode;
	}
	public List<Ca_ComplexityVO> getComplexity() {
		return Complexity;
	}
	public void setComplexity(List<Ca_ComplexityVO> complexity) {
		Complexity = complexity;
	}
	public List<Ca_CoverageVO> getCoverage() {
		return Coverage;
	}
	public void setCoverage(List<Ca_CoverageVO> coverage) {
		Coverage = coverage;
	}
	public List<Ca_SizeVO> getSize() {
		return Size;
	}
	public void setSize(List<Ca_SizeVO> size) {
		Size = size;
	}
	public List<Ca_ReliabilityVO> getReliability() {
		return Reliability;
	}
	public void setReliability(List<Ca_ReliabilityVO> reliability) {
		Reliability = reliability;
	}
	public List<Ca_SecurityVO> getSecurity() {
		return Security;
	}
	public void setSecurity(List<Ca_SecurityVO> security) {
		Security = security;
	}
	public List<Ca_MaintainabilityVO> getMaintainability() {
		return Maintainability;
	}
	public void setMaintainability(List<Ca_MaintainabilityVO> maintainability) {
		Maintainability = maintainability;
	}
	public List<Ca_DuplicationsVO> getDuplications() {
		return Duplications;
	}
	public void setDuplications(List<Ca_DuplicationsVO> duplications) {
		Duplications = duplications;
	}
	public List<Ca_IssuesVO> getIssues() {
		return Issues;
	}
	public void setIssues(List<Ca_IssuesVO> issues) {
		Issues = issues;
	}
	public List<Ca_UnitTestsVO> getUnitTests() {
		return UnitTests;
	}
	public void setUnitTests(List<Ca_UnitTestsVO> unitTests) {
		UnitTests = unitTests;
	}	
}
