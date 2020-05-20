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

	
	/*private int completed=0;
	private int dropped=0;
	private int linnew=0;
	private int readyfortest=0;
	private int inprogress=0;
	private int linopen=0;
	private int assigned=0;
	private int deferred=0;
	private int analyzing=0;*/
	
	 
	
	/*public int getCompleted() {
		return completed;
	}
	public void setCompleted(int completed) {
		this.completed = completed;
	}
	public int getDropped() {
		return dropped;
	}
	public void setDropped(int dropped) {
		this.dropped = dropped;
	}
	public int getLinnew() {
		return linnew;
	}
	public void setLinnew(int linnew) {
		this.linnew = linnew;
	}
	public int getReadyfortest() {
		return readyfortest;
	}
	public void setReadyfortest(int readyfortest) {
		this.readyfortest = readyfortest;
	}
	public int getInprogress() {
		return inprogress;
	}
	public void setInprogress(int inprogress) {
		this.inprogress = inprogress;
	}
	public int getLinopen() {
		return linopen;
	}
	public void setLinopen(int linopen) {
		this.linopen = linopen;
	}
	public int getAssigned() {
		return assigned;
	}
	public void setAssigned(int assigned) {
		this.assigned = assigned;
	}
	public int getDeferred() {
		return deferred;
	}
	public void setDeferred(int deferred) {
		this.deferred = deferred;
	}
	public int getAnalyzing() {
		return analyzing;
	}
	public void setAnalyzing(int analyzing) {
		this.analyzing = analyzing;
	}*/
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