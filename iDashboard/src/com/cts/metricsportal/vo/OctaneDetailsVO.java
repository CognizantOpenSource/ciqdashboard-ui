package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "OctaneSprint") 
public class OctaneDetailsVO {

	private String sprintId;
	private String sprintName;
	private Date createdDate;
	private Date startDate;
	private Date lastModified;
	private Date endDate;
	private int workingDays;
	private int numberOfRemainingWorkDays;
	private String releaseId;
	
	
	public OctaneDetailsVO(String sprintId, String sprintName,
			Date createdDate, Date startDate, Date lastModified, Date endDate,
			int workingDays,
			int numberOfRemainingWorkDays, String releaseId) {
		
		this.sprintId = sprintId;
		this.sprintName = sprintName;
		this.createdDate = createdDate;
		this.startDate = startDate;
		this.lastModified = lastModified;
		this.endDate = endDate;
		this.workingDays = workingDays;
		this.numberOfRemainingWorkDays = numberOfRemainingWorkDays;
		this.releaseId = releaseId;
	}


	public String getSprintId() {
		return sprintId;
	}


	public void setSprintId(String sprintId) {
		this.sprintId = sprintId;
	}


	public String getSprintName() {
		return sprintName;
	}


	public void setSprintName(String sprintName) {
		this.sprintName = sprintName;
	}


	public Date getCreatedDate() {
		return createdDate;
	}


	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Date getLastModified() {
		return lastModified;
	}


	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public int getWorkingDays() {
		return workingDays;
	}


	public void setWorkingDays(int workingDays) {
		this.workingDays = workingDays;
	}


	public int getNumberOfRemainingWorkDays() {
		return numberOfRemainingWorkDays;
	}


	public void setNumberOfRemainingWorkDays(int numberOfRemainingWorkDays) {
		this.numberOfRemainingWorkDays = numberOfRemainingWorkDays;
	}


	public String getReleaseId() {
		return releaseId;
	}


	public void setReleaseId(String releaseId) {
		this.releaseId = releaseId;
	}
	
	
	
}
