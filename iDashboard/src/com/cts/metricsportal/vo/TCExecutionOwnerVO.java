package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution") 
public class TCExecutionOwnerVO {

	private String testTester = null;
	private int statusCnt=0;
	
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
	public String getTestTester() {
		return testTester;
	}
	public void setTestTester(String testTester) {
		this.testTester = testTester;
	}
	
	
}
