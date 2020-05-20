package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestExecution") 
public class TestExeTrendVO {

	private String testExecutionDate;
	private Date isodate;
	private int failedCnt = 0;
	private int passedCnt = 0;
	private int norunCnt = 0;
	private int notcompletedCnt = 0;
	private int nostatus = 0;
	private int blockedCnt = 0;
	private int notapplicableCnt = 0;
	
	
	
	public String getTestExecutionDate() {
		return testExecutionDate;
	}
	public void setTestExecutionDate(String testExecutionDate) {
		this.testExecutionDate = testExecutionDate;
	}
	
	public Date getIsodate() {
		return isodate;
	}
	public void setIsodate(Date isodate) {
		this.isodate = isodate;
	}
	public int getNotapplicableCnt() {
		return notapplicableCnt;
	}
	public void setNotapplicableCnt(int notapplicableCnt) {
		this.notapplicableCnt = notapplicableCnt;
	}
	public int getFailedCnt() {
		return failedCnt;
	}
	public void setFailedCnt(int failedCnt) {
		this.failedCnt = failedCnt;
	}
	public int getPassedCnt() {
		return passedCnt;
	}
	public void setPassedCnt(int passedCnt) {
		this.passedCnt = passedCnt;
	}
	public int getNorunCnt() {
		return norunCnt;
	}
	public void setNorunCnt(int norunCnt) {
		this.norunCnt = norunCnt;
	}
	public int getNotcompletedCnt() {
		return notcompletedCnt;
	}
	public void setNotcompletedCnt(int notcompletedCnt) {
		this.notcompletedCnt = notcompletedCnt;
	}
	public int getNostatus() {
		return  nostatus ;
	}
	public void setNostatus(int  nostatus ) {
		this. nostatus  =  nostatus ;
	}
	public int getBlockedCnt() {
		return blockedCnt;
	}
	public void setBlockedCnt(int blockedCnt) {
		this.blockedCnt = blockedCnt;
	}
	public int getNotapplicable() {
		return notapplicableCnt;
	}
	public void setNotapplicable(int notapplicableCnt) {
		this.notapplicableCnt = notapplicableCnt;
	}
	
	
	
	
}
