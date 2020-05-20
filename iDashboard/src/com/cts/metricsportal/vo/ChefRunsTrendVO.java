package com.cts.metricsportal.vo;

import java.util.Date;

public class ChefRunsTrendVO {

	private String Date;
	private Date mydate;
	private int success = 0;
	private int failure = 0;
	private int aborted = 0;
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
	public int getSuccess() {
		return success;
	}
	public void setSuccess(int success) {
		this.success = success;
	}
	public int getFailure() {
		return failure;
	}
	public void setFailure(int failure) {
		this.failure = failure;
	}
	public int getAborted() {
		return aborted;
	}
	public void setAborted(int aborted) {
		this.aborted = aborted;
	}
	public int getNostatus() {
		return nostatus;
	}
	public void setNostatus(int nostatus) {
		this.nostatus = nostatus;
	}

}
