package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cookbookruns") 
public class ChefRunsStatusVO {
	private long count;
	private String status = null;
	private int statusCnt=0;
	private Date creationTime;

	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	
}
