package com.cts.metricsportal.vo;

import java.util.Date;

public class ReqTrendVO {

	private String Date;
	private Date mydate;
	private int failed = 0;
	private int notcovered = 0;
	private int passed = 0;
	private int norun = 0;
	private int notcompleted = 0;
	private int notapplicable = 0;
	private int blocked = 0;
	private int nostatus = 0;
	public String getDate() {
		return Date;
	}
	public void setDate(String date) {
		Date = date;
	}
	
	public Date getMydate() {
		return mydate;
	}
	public void setMydate(Date mydate) {
		this.mydate = mydate;
	}
	public int getBlocked() {
		return blocked;
	}
	public void setBlocked(int blocked) {
		this.blocked = blocked;
	}
	public int getNotapplicable() {
		return notapplicable;
	}
	public void setNotapplicable(int notapplicable) {
		this.notapplicable = notapplicable;
	}
	public int getFailed() {
		return failed;
	}
	public void setFailed(int failed) {
		this.failed = failed;
	}
	public int getNotcovered() {
		return notcovered;
	}
	public void setNotcovered(int notcovered) {
		this.notcovered = notcovered;
	}
	public int getPassed() {
		return passed;
	}
	public void setPassed(int passed) {
		this.passed = passed;
	}
	public int getNorun() {
		return norun;
	}
	public void setNorun(int norun) {
		this.norun = norun;
	}
	public int getNotcompleted() {
		return notcompleted;
	}
	public void setNotcompleted(int notcompleted) {
		this.notcompleted = notcompleted;
	}
	public int getNostatus() {
		return  nostatus ;
	}
	public void setNostatus(int  nostatus ) {
		this. nostatus  =  nostatus ;
	}
	public void setDate(Date date2) {
		// TODO Auto-generated method stub
		
	}
	
	
}
