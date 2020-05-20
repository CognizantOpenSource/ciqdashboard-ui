package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cookbookruns") 
public class ChefLastRunsOnNodesVO {
	private long count;
	private String nodename;
	private String cookbookname;
	private String latestrun;
	private String status;
	private Date creationTime;

	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getNodename() {
		return nodename;
	}
	public void setNodename(String nodename) {
		this.nodename = nodename;
	}
	public String getCookbookname() {
		return cookbookname;
	}
	public void setCookbookname(String cookbookname) {
		this.cookbookname = cookbookname;
	}
	public String getLatestrun() {
		return latestrun;
	}
	public void setLatestrun(String latestrun) {
		this.latestrun = latestrun;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	
}
