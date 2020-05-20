package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "build_jobs") 
public class BuildTotalVO {
	
	private String endTime;
	private String successCnt;
	private String failureCnt;
	private String totalbuildcount;
	private String duration;
	
	
	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
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
	
	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

}
