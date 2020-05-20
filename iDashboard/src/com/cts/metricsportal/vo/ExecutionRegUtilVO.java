package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution")
public class ExecutionRegUtilVO {

	private String testExecutionMonth;
	private Date isoTestExecutionMonth;
	private long regUtilValue = 0;

	public String getTestExecutionMonth() {
		return testExecutionMonth;
	}

	public void setTestExecutionMonth(String testExecutionMonth) {
		this.testExecutionMonth = testExecutionMonth;
	}

	public Date getIsoTestExecutionMonth() {
		return isoTestExecutionMonth;
	}

	public void setIsoTestExecutionMonth(Date isoTestExecutionMonth) {
		this.isoTestExecutionMonth = isoTestExecutionMonth;
	}

	public long getRegUtilValue() {
		return regUtilValue;
	}

	public void setRegUtilValue(long regUtilValue) {
		this.regUtilValue = regUtilValue;
	}

	
	

}
