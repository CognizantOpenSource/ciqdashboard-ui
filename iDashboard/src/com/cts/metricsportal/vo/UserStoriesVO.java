package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "userstories") 
public class UserStoriesVO {
	
	private String _id;
	private int planEstimate;

	public int getPlanEstimate() {
		return planEstimate;
	}
	public void setPlanEstimate(int planEstimate) {
		this.planEstimate = planEstimate;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	private String status = null;
	
	private int statusCnt=0;
	
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getStoryID() {
		return storyID;
	}
	public void setStoryID(String storyID) {
		this.storyID = storyID;
	}
	public String getStoryName() {
		return storyName;
	}
	public void setStoryName(String storyName) {
		this.storyName = storyName;
	}
	
	public String getStoryOwner() {
		return storyOwner;
	}
	public void setStoryOwner(String storyOwner) {
		this.storyOwner = storyOwner;
	}
	public String getStoryCreationDate() {
		return storyCreationDate;
	}
	public void setStoryCreationDate(String storyCreationDate) {
		this.storyCreationDate = storyCreationDate;
	}
	public String getStoryLastUpdateDate() {
		return storyLastUpdateDate;
	}
	public void setStoryLastUpdateDate(String storyLastUpdateDate) {
		this.storyLastUpdateDate = storyLastUpdateDate;
	}
	public String getProjectURL() {
		return projectURL;
	}
	public void setProjectURL(String projectURL) {
		this.projectURL = projectURL;
	}
	public String getDefect() {
		return defect;
	}
	public void setDefect(String defect) {
		this.defect = defect;
	}
	public String getTestcase() {
		return testcase;
	}
	public void setTestcase(String testcase) {
		this.testcase = testcase;
	}
	

	public String getRelease() {
		return release;
	}
	public void setRelease(String release) {
		this.release = release;
		
	}
	
	public String getIteration() {
		return iteration;
	}
	public void setIteration(String iteration) {
		this.iteration = iteration;
	}
	
	private String projectName;
	private String storyID;
	private String storyName;
	private String userStrdescription;
	private String storyStatus;
	private String SprintID;
	
	  

	public String getSprintID() {
		return SprintID;
	}
	public void setSprintID(String sprintID) {
		SprintID = sprintID;
	}
	public String getStoryStatus() {
		return storyStatus;
	}
	public void setStoryStatus(String storyStatus) {
		this.storyStatus = storyStatus;
	}
	public String getUserStrdescription() {
		return userStrdescription;
	}
	public void setUserStrdescription(String userStrdescription) {
		this.userStrdescription = userStrdescription;
	}

	private String storyOwner;
	private String storyCreationDate;
	private String storyLastUpdateDate;
	private String projectURL;
	private String defect;
	private String testcase;
	private String release;
	private String iteration;
	
	
	
	

}
