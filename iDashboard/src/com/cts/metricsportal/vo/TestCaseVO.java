package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "ALMTestCases") 
public class TestCaseVO {
	private int testID;
	private int levelId;
	private String reqId;
	private String testName;
	// private String testDescription;
	private String description;
	private String testDesigner;
	private String testType;
	private String testDesignStatus;
	private Date testCreationDate;

	private String automationType;
	private String automationStatus;
	private String releaseName;

	List<LevelItemsVO> duplication = new ArrayList<LevelItemsVO>();

	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}

	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	public int getTestID() {
		return testID;
	}

	public void setTestID(int testID) {
		this.testID = testID;
	}

	public String getReqID() {
		return reqId;
	}

	public void setReqID(String reqId) {
		this.reqId = reqId;
	}
	
	public int getLevelId() {
		return levelId;
	}

	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}

	

	public String getReqId() {
		return reqId;
	}

	public void setReqId(String reqId) {
		this.reqId = reqId;
	}

	

	public String getTestDescription() {
		try {
			description.replaceAll("\\<.*?>", "");
		} catch (Exception e) {
		}
		return description;
	}

	public void setTestDescription(String testDescription) {
		this.description = testDescription;
	}

	public String getTestDesignStatus() {
		return testDesignStatus;
	}

	public void setTestDesignStatus(String testDesignStatus) {
		this.testDesignStatus = testDesignStatus;
	}

	public String getTestType() {
		return testType;
	}

	public void setTestType(String testType) {
		this.testType = testType;
	}

	public String getTestDesigner() {
		return testDesigner;
	}

	public void setTestDesigner(String testDesigner) {
		this.testDesigner = testDesigner;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}
    
	public Date getTestCreationDate() {
		return testCreationDate;
	}

	public void setTestCreationDate(Date testCreationDate) {
		this.testCreationDate = testCreationDate;
	}

	public String getAutomationType() {
		return automationType;
	}

	public void setAutomationType(String automationType) {
		this.automationType = automationType;
	}

	public String getAutomationStatus() {
		return automationStatus;
	}

	public void setAutomationStatus(String automationStatus) {
		this.automationStatus = automationStatus;
	}

	public String getReleaseName() {
		return releaseName;
	}

	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}

}
