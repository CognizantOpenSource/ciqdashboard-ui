package com.cts.metricsportal.vo;

import java.util.Date;

public class JiraReqTrendVO {

	private int done = 0;
	private int toDo = 0;
	private int inProgress = 0;
	private int inTesting = 0;
	private String Date;
	private Date mydate;
	
	
	public int getDone() {
		return done;
	}
	public void setDone(int done) {
		this.done = done;
	}
	public int getToDo() {
		return toDo;
	}
	public void setToDo(int toDo) {
		this.toDo = toDo;
	}
	public int getInProgress() {
		return inProgress;
	}
	public void setInProgress(int inProgress) {
		this.inProgress = inProgress;
	}
	public int getInTesting() {
		return inTesting;
	}
	public void setInTesting(int inTesting) {
		this.inTesting = inTesting;
	}
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

	
	
}
