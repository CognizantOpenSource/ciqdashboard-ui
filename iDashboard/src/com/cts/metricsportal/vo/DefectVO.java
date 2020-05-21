package com.cts.metricsportal.vo;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ALMDefects") 
public class DefectVO {
	private String _id;
	private String defectId;
	private String summary;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	private String description;
	private int levelid;
	private String environment;
	private String defectType;
	private String priority;
	private String status;
	private String assignedto;
	private String severity;
	private Date opendate;
	private Date closeddate;
	private int statuscount;
	
	private String releaseName;
	private String cycleName;
	
	private String testId;
	List<Integer> atestId =  new ArrayList<Integer>();


	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}
	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	public int getStatuscount() {
		return statuscount;
	}
	public void setStatuscount(int statuscount) {
		this.statuscount = statuscount;
	}
	public String getAssignedto() {
		return assignedto;
	}
	public void setAssignedto(String assignedto) {
		this.assignedto = assignedto;
	}
	 
	public Date getOpendate() {
		return opendate;
	}
	public void setOpendate(Date opendate) {
		this.opendate = opendate;
	}
	
	public Date getCloseddate() {
		//System.out.println("closeddate"+closeddate);
		return closeddate;
	}
	public void setCloseddate(Date closeddate) {
		this.closeddate = closeddate;
	}
	public int getLevelid() {
		return levelid;
	}
	public void setLevelid(int levelid) {
		this.levelid = levelid;
	}
	
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	
	public String getDescription() {
		try{
		 description.replaceAll("\\<.*?>","");}
		catch(Exception e){
			}
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDefectId() {
		return defectId;
	}
	public void setDefectId(String defectId) {
		this.defectId = defectId;
	}

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	
	public String getEnvironment() {
		return environment;
	}
	public void setEnvironment(String environment) {
		this.environment = environment;
	}
	public String getDefectType() {
		return defectType;
	}
	public void setDefectType(String defectType) {
		this.defectType = defectType;
	}
	
	public String getReleaseName() {
		return releaseName;
	}
	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}
	public String getCycleName() {
		return cycleName;
	}
	public void setCycleName(String cycleName) {
		this.cycleName = cycleName;
	}
	
	public String getTestId() {
		testId=testId.replace("[", "").replace("]", "");
		return testId;
	}
	public void setTestId(String testId) {
		this.testId = testId;
	}

	
}
