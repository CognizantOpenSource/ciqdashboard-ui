package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
public class DefectStatusVO {

	private String status =null;
	private int count;
	private String priority=null;
	private int priorityCnt=0;
	private String severity = null;
	private int severityCnt=0;
	private String assignedto;
	private int usercount;
	private Date opendate;
	private Date closeddate;
	private int statuscount;
	private int severitycount;
	
	private int closed;
	private int open;
	private Date isodate;

	 
	
	public int getClosed() {
		return closed;
	}
	public void setClosed(int closed) {
		this.closed = closed;
	}
	public int getOpen() {
		return open;
	}
	public void setOpen(int open) {
		this.open = open;
	}
	public Date getIsodate() {
		return isodate;
	}
	public void setIsodate(Date isodate) {
		this.isodate = isodate;
	}
	public int getSeveritycount() {
		return severitycount;
	}
	public void setSeveritycount(int severitycount) {
		this.severitycount = severitycount;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public int getSeverityCnt() {
		return severityCnt;
	}
	public void setSeverityCnt(int severityCnt) {
		this.severityCnt = severityCnt;
	}
	public int getStatuscount() {
		return statuscount;
	}
	public void setStatuscount(int statuscount) {
		this.statuscount = statuscount;
	}
	
 
	public Date getCloseddate() {
		return closeddate;
	}
	public void setCloseddate(Date closeddate) {
		this.closeddate = closeddate;
	}
	public Date getOpendate() {
		return opendate;
	}
	public void setOpendate(Date opendate) {
		 
	 	 	
		this.opendate = opendate;
	}
	 
	 
	public String getAssignedto() {
		return assignedto;
	}
	public void setAssignedto(String assignedto) {
		this.assignedto = assignedto;
	}
	public int getUsercount() {
		return usercount;
	}
	public void setUsercount(int usercount) {
		this.usercount = usercount;
	}
	 
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	
	public int getPriorityCnt() {
		return priorityCnt;
	}
	public void setPriorityCnt(int priorityCnt) {
		this.priorityCnt = priorityCnt;
	}
	
	
}