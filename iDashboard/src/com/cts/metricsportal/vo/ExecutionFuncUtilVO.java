package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution")
public class ExecutionFuncUtilVO {

	private String testExecutionMonth;
	private Date isoTestExecutionMonth;
	private long funcUtilValue = 0;

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

	public long getFuncUtilValue() {
		return funcUtilValue;
	}

	public void setFuncUtilValue(long funcUtilValue) {
		this.funcUtilValue = funcUtilValue;
	}

	

}
