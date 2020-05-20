package com.cts.metricsportal.vo;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraDefects") 
public class JiraDefectVO {
	private String _id;
	private String defectId;
	private String summary;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();

	private String description;
	private int levelid;
	private String environment;
	private String status;
	private String assignedto;
	private int statuscount;
	private Date issueSprintStartDate;
	private Date issueSprintEndDate;
	private long count =0;
	// Levis columns
	
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	
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
	private String prjKey;
	private String prjName;
	private String levelId;
	private int issueID;
	private String issueKey;
	private String issueType;
	private String issueStatus;
	private String issueStatusCategory;
	private int storyPoints;
	private String issueSprint;
	private Date issueCreated;
	private Date issueUpdated;
	private Date issueResolved;
	private String issueSummary;
	private String issueDescription;
	private String issuePriority;
	private String issueReporter;
	private String issueAssignee;
	private String issueEpic;
	private List<DefectsVersionVO> issueVersion=new ArrayList<DefectsVersionVO>();

	

	public List<DefectsVersionVO> getIssueVersion() {
		return issueVersion;
	}
	public void setIssueVersion(List<DefectsVersionVO> issueVersion) {
		this.issueVersion = issueVersion;
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
	public String getLevelId() {
		return levelId;
	}
	public void setLevelId(String levelId) {
		this.levelId = levelId;
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
	public int getStoryPoints() {
		return storyPoints;
	}
	public void setStoryPoints(int storyPoints) {
		this.storyPoints = storyPoints;
	}
	public String getIssueSprint() {
		return issueSprint;
	}
	public void setIssueSprint(String issueSprint) {
		this.issueSprint = issueSprint;
	}
	public Date getIssueCreated() {
		return issueCreated;
	}
	public void setIssueCreated(Date issueCreated) {
		this.issueCreated = issueCreated;
	}
	public Date getIssueUpdated() {
		return issueUpdated;
	}
	public void setIssueUpdated(Date issueUpdated) {
		this.issueUpdated = issueUpdated;
	}
	public Date getIssueResolved() {
		return issueResolved;
	}
	public void setIssueResolved(Date issueResolved) {
		this.issueResolved = issueResolved;
	}
	public String getIssueSummary() {
		return issueSummary;
	}
	public void setIssueSummary(String issueSummary) {
		this.issueSummary = issueSummary;
	}
	public String getIssueDescription() {
		return issueDescription;
	}
	public void setIssueDescription(String issueDescription) {
		this.issueDescription = issueDescription;
	}
	public String getIssuePriority() {
		return issuePriority;
	}
	public void setIssuePriority(String issuePriority) {
		this.issuePriority = issuePriority;
	}
	public String getIssueReporter() {
		return issueReporter;
	}
	public void setIssueReporter(String issueReporter) {
		this.issueReporter = issueReporter;
	}
	public String getIssueAssignee() {
		return issueAssignee;
	}
	public void setIssueAssignee(String issueAssignee) {
		this.issueAssignee = issueAssignee;
	}
	public String getIssueEpic() {
		return issueEpic;
	}
	public void setIssueEpic(String issueEpic) {
		this.issueEpic = issueEpic;
	}
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
	 
	
	public int getLevelid() {
		return levelid;
	}
	public void setLevelid(int levelid) {
		this.levelid = levelid;
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

	public String getEnvironment() {
		return environment;
	}
	public void setEnvironment(String environment) {
		this.environment = environment;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}

	
}
