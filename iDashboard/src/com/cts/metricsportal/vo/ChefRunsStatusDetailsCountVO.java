package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cookbookruns") 
public class ChefRunsStatusDetailsCountVO {

	private String metrics;
	private int abortedCount = 0;
	private int failureCount = 0;
	private int successCount = 0;

	public String getMetrics() {
		return metrics;
	}
	public void setMetrics(String metrics) {
		this.metrics = metrics;
	}
	public int getAbortedCount() {
		return abortedCount;
	}
	public void setAbortedCount(int abortedCount) {
		this.abortedCount = abortedCount;
	}
	public int getFailureCount() {
		return failureCount;
	}
	public void setFailureCount(int failureCount) {
		this.failureCount = failureCount;
	}
	public int getSuccessCount() {
		return successCount;
	}
	public void setSuccessCount(int successCount) {
		this.successCount = successCount;
	}
	
}
