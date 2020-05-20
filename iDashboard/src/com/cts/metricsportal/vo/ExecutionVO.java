package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution") 

public class ExecutionVO {
	private String tcName;
	private String status;
	private int executionTime;
	private String isFailed;
	private int isFailedCount;
	private String project;
	private String release;
	
	
	
	
	public String getTcName() {
		return tcName;
	}
	public void setTcName(String tcName) {
		this.tcName = tcName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getExecutionTime() {
		return executionTime;
	}
	public void setExecutionTime(int executionTime) {
		this.executionTime = executionTime;
	}
	public String getIsFailed() {
		return isFailed;
	}
	public void setIsFailed(String isFailed) {
		this.isFailed = isFailed;
	}
	public int getIsFailedCount() {
		return isFailedCount;
	}
	public void setIsFailedCount(int isFailedCount) {
		this.isFailedCount = isFailedCount;
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

	
}
