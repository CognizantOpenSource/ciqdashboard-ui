package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution") 

public class TestExeStatusVO {
	private String testExecutionStatus;
	private int statusCnt=0;
	private int statuscount;
	private Date testExecutionDate;

	
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
	public String getTestExecutionStatus() {
		return testExecutionStatus;
	}
	public void setTestExecutionStatus(String testExecutionStatus) {
		this.testExecutionStatus = testExecutionStatus;
	}
	public int getStatuscount() {
		return statuscount;
	}
	public void setStatuscount(int statuscount) {
		this.statuscount = statuscount;
	}
	public Date getTestExecutionDate() {
		return testExecutionDate;
	}
	public void setTestExecutionDate(Date testExecutionDate) {
		this.testExecutionDate = testExecutionDate;
	}
	 
}
