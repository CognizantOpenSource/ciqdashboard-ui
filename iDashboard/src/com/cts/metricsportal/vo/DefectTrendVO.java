package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
public class DefectTrendVO {

	private String Date;
	private int newDefects=0;
	private int closedDefects=0;
	private int openDefects=0;
	private int reopenDefects=0;
	private int fixedDefects=0;
	private int rejectedDefects=0;
	private int readyQA=0;
	private int nostatus = 0;
	
	private Date isodate;
	private int totalcount;
	
	private int completed=0;
	private int dropped=0;
	private int linnew=0;
	private int readyfortest=0;
	private int inprogress=0;
	private int linopen=0;
	private int assigned=0;
	private int deferred=0;
	private int analyzing=0;
	
	public int getCompleted() {
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
	}
	
	public Date getIsodate() {
		return isodate;
	}
	public void setIsodate(Date isodate) {
		this.isodate = isodate;
	}
	public int getTotalcount() {
		return totalcount;
	}
	public void setTotalcount(int totalcount) {
		this.totalcount = totalcount;
	}
	public String getDate() {
		return Date;
	}
	public void setDate(String date) {
		Date = date;
	}
	public int getNewDefects() {
		return newDefects;
	}
	public void setNewDefects(int newDefects) {
		this.newDefects = newDefects;
	}
	public int getClosedDefects() {
		return closedDefects;
	}
	public void setClosedDefects(int closedDefects) {
		this.closedDefects = closedDefects;
	}
	public int getOpenDefects() {
		return openDefects;
	}
	public void setOpenDefects(int openDefects) {
		this.openDefects = openDefects;
	}
	public int getReopenDefects() {
		return reopenDefects;
	}
	public void setReopenDefects(int reopenDefects) {
		this.reopenDefects = reopenDefects;
	}
	public int getFixedDefects() {
		return fixedDefects;
	}
	public void setFixedDefects(int fixedDefects) {
		this.fixedDefects = fixedDefects;
	}
	public int getRejectedDefects() {
		return rejectedDefects;
	}
	public void setRejectedDefects(int rejectedDefects) {
		this.rejectedDefects = rejectedDefects;
	}
	public int getNostatus() {
		return  nostatus ;
	}
	public void setNostatus(int  nostatus ) {
		this. nostatus  =  nostatus ;
	}
	public int getReadyQA() {
		return  readyQA ;
	}
	public void setReadyQA(int  readyQA ) {
		this. readyQA  =  readyQA ;
	}

	
}
