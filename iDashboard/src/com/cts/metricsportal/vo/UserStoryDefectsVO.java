package com.cts.metricsportal.vo;



import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "JiraUserstorydefects") 
public class UserStoryDefectsVO {
	
	private String storyID;
	
	private String SprintID;
	private String priority;
	private String severity;
	private String defectCreationDate;
	private String defectLastUpdateDate;
	private String status;
	private String defID;
	private String defName;
	private String defDescription;
	private String defPrjName;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();
	
	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}
	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	public String getSprintID() {
		return SprintID;
	}
	public void setSprintID(String sprintID) {
		SprintID = sprintID;
	}
	public String getStoryID() {
		return storyID;
	}
	public void setStoryID(String storyID) {
		this.storyID = storyID;
	}
	public String getDefID() {
		return defID;
	}
	public void setDefID(String defID) {
		this.defID = defID;
	}
	
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public String getDefectCreationDate() {
		return defectCreationDate;
	}
	public void setDefectCreationDate(String defectCreationDate) {
		this.defectCreationDate = defectCreationDate;
	}
	public String getDefectLastUpdateDate() {
		return defectLastUpdateDate;
	}
	public void setDefectLastUpdateDate(String defectLastUpdateDate) {
		this.defectLastUpdateDate = defectLastUpdateDate;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getDefName() {
		return defName;
	}
	public void setDefName(String defName) {
		this.defName = defName;
	}
	public String getDefDescription() {
		return defDescription;
	}
	public void setDefDescription(String defDescription) {
		this.defDescription = defDescription;
	}
	
	
	public String getDefPrjName() {
		return defPrjName;
	}
	public void setDefPrjName(String defPrjName) {
		this.defPrjName = defPrjName;
	}
	
	

}
