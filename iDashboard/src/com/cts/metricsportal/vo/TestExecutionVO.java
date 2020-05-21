package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ALMTestExecution") 
public class TestExecutionVO {

	private String  defectId=null;
	private int levelId;
	private String testID=null;
	private String testName=null;
	private String testDescription=null;
	private String testTester = null;
	private String testType=null;
	private String testDesignStatus=null;
	private String testExecutionStatus=null;
	private Date testCreationDate;
	private Date testExecutionDate;
	private String testModule = null;
	private String testIteration = null;
	private String cycleName =null;
	private int testRunID;
	private String releaseName=null;
	private int count;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();
	
	
	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}
	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	public String getTestTester() {
		return testTester;
	}
	public void setTestTester(String testTester) {
		this.testTester = testTester;
	}
	public String getDefectId() {
		return defectId;
	}
	public void setDefectId(String defectId) {
		this.defectId = defectId;
	}
	
	public String getTestID() {
		return testID;
	}
	public void setTestID(String testID) {
		this.testID = testID;
	}
	public String getTestName() {
		return testName;
	}
	public void setTestName(String testName) {
		this.testName = testName;
	}
	public String getTestDescription() {
		try{
			testDescription.replaceAll("\\<.*?>","");}
			catch(Exception e){
				}
			return testDescription;
	}
	public void setTestDescription(String testDescription) {
		this.testDescription = testDescription;
	}
	
	public String getTestType() {
		return testType;
	}
	public void setTestType(String testType) {
		this.testType = testType;
	}
	public String getTestDesignStatus() {
		return testDesignStatus;
	}
	public void setTestDesignStatus(String testDesignStatus) {
		this.testDesignStatus = testDesignStatus;
	}
	public String getTestExecutionStatus() {
		return testExecutionStatus;
	}
	public void setTestExecutionStatus(String testExecutionStatus) {
		this.testExecutionStatus = testExecutionStatus;
	}
	public Date getTestCreationDate() {
		return testCreationDate;
	}
	public void setTestCreationDate(Date testCreationDate) {
		this.testCreationDate = testCreationDate;
	}
	public Date getTestExecutionDate() {
		return testExecutionDate;
	}
	public void setTestExecutionDate(Date testExecutionDate) {
		this.testExecutionDate = testExecutionDate;
	}
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}
	public String getTestModule() {
		return testModule;
	}
	public void setTestModule(String testModule) {
		this.testModule = testModule;
	}
	public String getTestIteration() {
		return testIteration;
	}
	public void setTestIteration(String testIteration) {
		this.testIteration = testIteration;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
	public String getCycleName() {
		return cycleName;
	}
	public void setCycleName(String cycleName) {
		this.cycleName = cycleName;
	}
	public String getReleaseName() {
		return releaseName;
	}
	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}
	public int getTestRunID() {
		return testRunID;
	}
	public void setTestRunID(int testRunID) {
		this.testRunID = testRunID;
	}
	
	
	
	
	
	
}
