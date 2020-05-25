package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "OctaneDefects") 
public class OctaneDefectVO {

	private String projectId;
	private String defectId;
	private String sprintId;
	private Date creationTime;
	private Date closedOn;
	private Date lastModified;
	private String defectPhaseId;
	private String defectSeverityId;
	private String defectPriorityId;
	private String defectName;
	private Long estimatedHours;
	private Long investedHours;
	
	
	
	public String getDefectId() {
		return defectId;
	}
	public void setDefectId(String defectId) {
		this.defectId = defectId;
	}
	public String getSprintId() {
		return sprintId;
	}
	public void setSprintId(String sprintId) {
		this.sprintId = sprintId;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	public Date getClosedOn() {
		return closedOn;
	}
	public void setClosedOn(Date closedOn) {
		this.closedOn = closedOn;
	}
	public Date getLastModified() {
		return lastModified;
	}
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	public String getDefectName() {
		return defectName;
	}
	public void setDefectName(String defectName) {
		this.defectName = defectName;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getDefectSeverityId() {
		return defectSeverityId;
	}
	public void setDefectSeverityId(String defectSeverityId) {
		this.defectSeverityId = defectSeverityId;
	}
	public String getDefectPhaseId() {
		return defectPhaseId;
	}
	public void setDefectPhaseId(String defectPhaseId) {
		this.defectPhaseId = defectPhaseId;
	}
	public String getDefectPriorityId() {
		return defectPriorityId;
	}
	public void setDefectPriorityId(String defectPriorityId) {
		this.defectPriorityId = defectPriorityId;
	}
	public Long getEstimatedHours() {
		return estimatedHours;
	}
	public void setEstimatedHours(Long estimatedHours) {
		this.estimatedHours = estimatedHours;
	}
	/**
	 * @return the investedHours
	 */
	public Long getInvestedHours() {
		return investedHours;
	}
	/**
	 * @param investedHours the investedHours to set
	 */
	public void setInvestedHours(Long investedHours) {
		this.investedHours = investedHours;
	}
	
	
	
	
}
