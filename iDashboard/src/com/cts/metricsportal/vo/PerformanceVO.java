package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "perftestInfo") 
public class PerformanceVO {
	
	private String transactionName;
	private String type;
	private List<PerformanceRepoDetailsVO> intervals;
	
	
	
	public String getTransactionName() {
		return transactionName;
	}
	public void setTransactionName(String transactionName) {
		this.transactionName = transactionName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<PerformanceRepoDetailsVO> getIntervals() {
		return intervals;
	}
	public void setIntervals(List<PerformanceRepoDetailsVO> intervals) {
		this.intervals = intervals;
	}
	
}
