package com.cts.metricsportal.vo;

public class GlobalViewVO {
	
	
	private String domain;
	private String project;
	private String release;
	private long overallDefectLeakage;
	private long highCriticalDefectLeakage;
	private long automationCoverage;
	private long exePassRate;
	private long errorDiscoveryRate;
	private long firstTimePassRate;
	private long closedDefects;
	private String tool;
	
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public String getProject() {
		return project;
	}
	public void setProject(String project) {
		this.project = project;
	}
	public String getRelease() {
		return release;
	}
	public void setRelease(String release) {
		this.release = release;
	}
	public long getOverallDefectLeakage() {
		return overallDefectLeakage;
	}
	public void setOverallDefectLeakage(long overallDefectLeakage) {
		this.overallDefectLeakage = overallDefectLeakage;
	}
	public long getHighCriticalDefectLeakage() {
		return highCriticalDefectLeakage;
	}
	public void setHighCriticalDefectLeakage(long highCriticalDefectLeakage) {
		this.highCriticalDefectLeakage = highCriticalDefectLeakage;
	}
	public long getAutomationCoverage() {
		return automationCoverage;
	}
	public void setAutomationCoverage(long automationCoverage) {
		this.automationCoverage = automationCoverage;
	}
	
	public long getExePassRate() {
		return exePassRate;
	}
	public void setExePassRate(long exePassRate) {
		this.exePassRate = exePassRate;
	}
	public long getErrorDiscoveryRate() {
		return errorDiscoveryRate;
	}
	public void setErrorDiscoveryRate(long errorDiscoveryRate) {
		this.errorDiscoveryRate = errorDiscoveryRate;
	}
	public long getFirstTimePassRate() {
		return firstTimePassRate;
	}
	public void setFirstTimePassRate(long firstTimePassRate) {
		this.firstTimePassRate = firstTimePassRate;
	}
	public long getClosedDefects() {
		return closedDefects;
	}
	public void setClosedDefects(long closedDefects) {
		this.closedDefects = closedDefects;
	}
	public String getTool() {
		return tool;
	}
	public void setTool(String tool) {
		this.tool = tool;
	}
	
	
	
}
