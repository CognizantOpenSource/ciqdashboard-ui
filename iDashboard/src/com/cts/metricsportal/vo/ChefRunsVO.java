package com.cts.metricsportal.vo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cookbookruns") 
public class ChefRunsVO {

	private String cookbookname;
	private String runSeqId;
	private String runid;
	private String status;
	private String starttime;
	private String endtime;
	private String nodename;
	private Date creationTime;

	public String getRunSeqId() {
		return runSeqId;
	}
	public void setRunSeqId(String runSeqId) {
		this.runSeqId = runSeqId;
	}
	public String getCookbookname() {
		return cookbookname;
	}
	public void setCookbookname(String cookbookname) {
		this.cookbookname = cookbookname;
	}
	public String getRunid() {
		return runid;
	}
	public void setRunid(String runid) {
		this.runid = runid;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStarttime() {
		return starttime;
	}
	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}
	public String getEndtime() {
		return endtime;
	}
	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}
	public String getNodename() {
		return nodename;
	}
	public void setNodename(String nodename) {
		this.nodename = nodename;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}	
	
}
