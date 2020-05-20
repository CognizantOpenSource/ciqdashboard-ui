package com.cts.metricsportal.vo;


import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraCycles") 
public class CyclesTrendVO {
	
	private Date isodate;
	private int passStatus = 0;
	private int failStatus = 0;
	private int wipStatus = 0;
	private int blockedStatus = 0;
	private int notexecutedStatus = 0;
	
	public Date getIsodate() {
		return isodate;
	}
	public void setIsodate(Date isodate) {
		this.isodate = isodate;
	}
	public int getPassStatus() {
		return passStatus;
	}
	public void setPassStatus(int passStatus) {
		this.passStatus = passStatus;
	}
	public int getFailStatus() {
		return failStatus;
	}
	public void setFailStatus(int failStatus) {
		this.failStatus = failStatus;
	}
	public int getWipStatus() {
		return wipStatus;
	}
	public void setWipStatus(int wipStatus) {
		this.wipStatus = wipStatus;
	}
	public int getBlockedStatus() {
		return blockedStatus;
	}
	public void setBlockedStatus(int blockedStatus) {
		this.blockedStatus = blockedStatus;
	}
	public int getNotexecutedStatus() {
		return notexecutedStatus;
	}
	public void setNotexecutedStatus(int notexecutedStatus) {
		this.notexecutedStatus = notexecutedStatus;
	}
	
}
