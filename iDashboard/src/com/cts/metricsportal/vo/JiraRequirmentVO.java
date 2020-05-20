package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraRequirements")
public class JiraRequirmentVO {
	private String _id;
	private int levelid;
	private int reqID;
	private String prjId;
	private String reqName;
	private String reqType;
	private String description;
	private String status;
	private Date lastModified;
	private String priority;
	private Date creationTime;
	private long count;
	List<LevelItemsVO> duplication = new ArrayList<LevelItemsVO>();
	private Date issueSprintStartDate;
	private Date issueSprintEndDate;

	// Levis Columns
	
	//MM DB Columns
		private int levelId;
		private String prjKey;
		private String prjName;
		private int issueID;
		private String issueKey;
		private String issueType;
		private String issueStatus;
		private String issueStatusCategory;
		private int storyPoints;	
		private String issueEpic;
		private String issueSprint;
		private Date issueUpdated;
		private Date issueResolved;
		private Date issueCreated;
		private String issuePriority;
		private int storypointCnt;
		
		private String issueAssignee;

		private int statusCnt=0;
	
	public String getPrjId() {
		return prjId;
	}

	public void setPrjId(String prjId) {
		this.prjId = prjId;
	}

	public int getStatusCnt() {
		return statusCnt;
	}

	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
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

	public Date getIssueCreated() {
		return issueCreated;
	}

	public void setIssueCreated(Date issueCreated) {
		this.issueCreated = issueCreated;
	}

	public String getIssuePriority() {
		return issuePriority;
	}

	public void setIssuePriority(String issuePriority) {
		this.issuePriority = issuePriority;
	}

	public int getStorypointCnt() {
		return storypointCnt;
	}

	public void setStorypointCnt(int storypointCnt) {
		this.storypointCnt = storypointCnt;
	}

	public String getIssueAssignee() {
		return issueAssignee;
	}

	public void setIssueAssignee(String issueAssignee) {
		this.issueAssignee = issueAssignee;
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

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}

	public Date getCreationTime() {
		return creationTime;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public Date getLastModified() {
		return lastModified;
	}

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	public int getLevelid() {
		return levelid;
	}

	public void setLevelid(int levelid) {
		this.levelid = levelid;
	}

	public int getReqID() {
		return reqID;
	}

	public void setReqID(int reqID) {
		this.reqID = reqID;
	}

	public String getReqName() {
		return reqName;
	}

	public void setReqName(String reqName) {
		this.reqName = reqName;
	}

	public String getReqType() {
		return reqType;
	}

	public void setReqType(String reqType) {
		this.reqType = reqType;
	}

	public String getDescription() {
		return description.replaceAll("\\<.*?>", "");
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getLevelId() {
		return levelId;
	}

	public void setLevelId(int levelId) {
		this.levelId = levelId;
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
}
