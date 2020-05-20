package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "userstorytestcases") 
public class UserStoryTestCasesVO {
	
	private String storyID;
	public String getStoryID() {
		return storyID;
	}
	public void setStoryID(String storyID) {
		this.storyID = storyID;
	}
	public String getTestID() {
		return testID;
	}
	public void setTestID(String testID) {
		this.testID = testID;
	}
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getTestCreationDate() {
		return testCreationDate;
	}
	public void setTestCreationDate(String testCreationDate) {
		this.testCreationDate = testCreationDate;
	}
	public String getTestLastUpdateDate() {
		return testLastUpdateDate;
	}
	public void setTestLastUpdateDate(String testLastUpdateDate) {
		this.testLastUpdateDate = testLastUpdateDate;
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
	private String testID;
	private String testName;
	public String getTestName() {
		return testName;
	}
	public void setTestName(String testName) {
		this.testName = testName;
	}
	public String getTestDescription() {
		return testDescription;
	}
	public void setTestDescription(String testDescription) {
		this.testDescription = testDescription;
	}
	private String testDescription;
	private String projectName;
	private String testCreationDate;
	private String testLastUpdateDate;
	private String status;
	private String priority;
	
	

}
