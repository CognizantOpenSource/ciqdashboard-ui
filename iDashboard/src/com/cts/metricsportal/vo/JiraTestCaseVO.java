package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraTestCases")
public class JiraTestCaseVO {
	private int testID;
	private int levelId;
	private String _id;
	private String reqId;
	private String testName;
	private String testDescription;
	private String testDesigner;
	private String testType;
	private String testDesignStatus;
	private Date testCreationDate;
	List<LevelItemsVO> duplication = new ArrayList<LevelItemsVO>();
	List<BugsVO> linkedBugs = new ArrayList<BugsVO>();

	// Levis Columns

	// MM DB Columns
	private String prjKey;

	public List<BugsVO> getLinkedBugs() {
		return linkedBugs;
	}

	public void setLinkedBugs(List<BugsVO> linkedBugs) {
		this.linkedBugs = linkedBugs;
	}

	private String prjName;
	private String prjId;
	private int issueID;
	private String issueKey;
	private String issueType;
	private String issueStatus;
	private String issueStatusCategory;
	private String issuePriority;
	private String issueEpic;
	private String issueSprint;
	private Date issueResolved;
	private Date issueSprintStartDate;
	private Date issueSprintEndDate;
	private Date issueUpdated;
	private int storyPoints;
	private Date issueCreated;
	private String canAutomate;
	private int autoCount;
	private int manualCount;

	private String issueAssignee;

	
	public Date getIssueSprintStartDate() {
		return issueSprintStartDate;
	}

	public void setIssueSprintStartDate(Date issueSprintStartDate) {
		this.issueSprintStartDate = issueSprintStartDate;
	}

	public Date getIssueSprintEndDate() {
		return issueSprintEndDate;
	}

	public void setIssueSprintEndDate(Date issueSprintEndDate) {
		this.issueSprintEndDate = issueSprintEndDate;
	}

	public String getPrjKey() {
		return prjKey;
	}

	public void setPrjKey(String prjKey) {
		this.prjKey = prjKey;
	}

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getPrjId() {
		return prjId;
	}

	public void setPrjId(String prjId) {
		this.prjId = prjId;
	}

	public int getIssueID() {
		return issueID;
	}

	public void setIssueID(int issueID) {
		this.issueID = issueID;
	}

	public String getIssueKey() {
		return issueKey;
	}

	public void setIssueKey(String issueKey) {
		this.issueKey = issueKey;
	}

	public String getIssueType() {
		return issueType;
	}

	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}

	public String getIssueStatus() {
		return issueStatus;
	}

	public void setIssueStatus(String issueStatus) {
		this.issueStatus = issueStatus;
	}

	public String getIssueStatusCategory() {
		return issueStatusCategory;
	}

	public void setIssueStatusCategory(String issueStatusCategory) {
		this.issueStatusCategory = issueStatusCategory;
	}

	public String getIssuePriority() {
		return issuePriority;
	}

	public void setIssuePriority(String issuePriority) {
		this.issuePriority = issuePriority;
	}

	public String getIssueEpic() {
		return issueEpic;
	}

	public void setIssueEpic(String issueEpic) {
		this.issueEpic = issueEpic;
	}

	public String getIssueSprint() {
		return issueSprint;
	}

	public void setIssueSprint(String issueSprint) {
		this.issueSprint = issueSprint;
	}

	public Date getIssueResolved() {
		return issueResolved;
	}

	public void setIssueResolved(Date issueResolved) {
		this.issueResolved = issueResolved;
	}

	public Date getIssueUpdated() {
		return issueUpdated;
	}

	public void setIssueUpdated(Date issueUpdated) {
		this.issueUpdated = issueUpdated;
	}

	public int getStoryPoints() {
		return storyPoints;
	}

	public void setStoryPoints(int storyPoints) {
		this.storyPoints = storyPoints;
	}

	public Date getIssueCreated() {
		return issueCreated;
	}

	public void setIssueCreated(Date issueCreated) {
		this.issueCreated = issueCreated;
	}

	public String getCanAutomate() {
		return canAutomate;
	}

	public void setCanAutomate(String canAutomate) {
		this.canAutomate = canAutomate;
	}

	public int getAutoCount() {
		return autoCount;
	}

	public void setAutoCount(int autoCount) {
		this.autoCount = autoCount;
	}

	public int getManualCount() {
		return manualCount;
	}

	public void setManualCount(int manualCount) {
		this.manualCount = manualCount;
	}

	public String getIssueAssignee() {
		return issueAssignee;
	}

	public void setIssueAssignee(String issueAssignee) {
		this.issueAssignee = issueAssignee;
	}

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
		return testDescription.replaceAll("\\<.*?>", "");
	}

	public void setTestDescription(String testDescription) {
		this.testDescription = testDescription;
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

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

}
