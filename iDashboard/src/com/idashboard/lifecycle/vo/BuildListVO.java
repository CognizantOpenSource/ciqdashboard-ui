package com.idashboard.lifecycle.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCjenkinsBuild") 
public class BuildListVO {
	
	private String buildNumber;
	private Date timeStamp;
	private Date startTime;
	private Date endTime;
	private String duration;
	private String result;
	private String buildUrl; 
	
	private String successCnt;
	private String failureCnt;
	private String totalbuildcount;
	
	

	public String getBuildNumber() {
		return buildNumber;
	}

		public void setBuildNumber(String buildNumber) {
		this.buildNumber = buildNumber;
	}
	
	public Date getTimestamp() {
		return timeStamp;
	}

	public void setTimestamp(Date timeStamp) {
		this.timeStamp = timeStamp;
	}
	
	public String getSuccessCnt() {
		return successCnt;
	}

	public void setSuccessCnt(String successCnt) {
		this.successCnt = successCnt;
	}

	public String getFailureCnt() {
		return failureCnt;
	}

	public void setFailureCnt(String failureCnt) {
		this.failureCnt = failureCnt;
	}

	public String getTotalbuildcount() {
		return totalbuildcount;
	}

	public void setTotalbuildcount(String totalbuildcount) {
		this.totalbuildcount = totalbuildcount;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	
	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}
	
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
	
	public String getBuildUrl() {
		return buildUrl;
	}

	public void setBuildUrl(String buildUrl) {
		this.buildUrl = buildUrl;
	}

}
