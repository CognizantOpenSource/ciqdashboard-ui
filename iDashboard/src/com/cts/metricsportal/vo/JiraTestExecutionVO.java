package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraCycles")
public class JiraTestExecutionVO {

	private String prjId = null;
	private int levelId;
	private String _id = null;
	private String prjKey = null;
	private String prjName = null;
	private String versionId = null;
	private String versionName = null;
	private String cycleId = null;
	private String cycleName = null;
	private String issueKey;
	private String issueSummary;
	private String issueComponent = null;
	private String issueLabel = null;
	private String executedBy;
	private int issueID;
	private Date createdDate;
	private Date executedOn;
	List<LevelItemsVO> duplication = new ArrayList<LevelItemsVO>();
	List<BugsVO> bugs = new ArrayList<BugsVO>();

	public String getPrjId() {
		return prjId;
	}

	public void setPrjId(String prjId) {
		this.prjId = prjId;
	}

	public int getLevelId() {
		return levelId;
	}

	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
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

	public String getVersionId() {
		return versionId;
	}

	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}

	public String getVersionName() {
		return versionName;
	}

	public void setVersionName(String versionName) {
		this.versionName = versionName;
	}

	public String getCycleId() {
		return cycleId;
	}

	public void setCycleId(String cycleId) {
		this.cycleId = cycleId;
	}

	public String getCycleName() {
		return cycleName;
	}

	public void setCycleName(String cycleName) {
		this.cycleName = cycleName;
	}

	public String getIssueKey() {
		return issueKey;
	}

	public void setIssueKey(String issueKey) {
		this.issueKey = issueKey;
	}

	public String getIssueSummary() {
		return issueSummary;
	}

	public void setIssueSummary(String issueSummary) {
		this.issueSummary = issueSummary;
	}

	public String getIssueComponent() {
		return issueComponent;
	}

	public void setIssueComponent(String issueComponent) {
		this.issueComponent = issueComponent;
	}

	public String getIssueLabel() {
		return issueLabel;
	}

	public void setIssueLabel(String issueLabel) {
		this.issueLabel = issueLabel;
	}

	public String getExecutedBy() {
		return executedBy;
	}

	public void setExecutedBy(String executedBy) {
		this.executedBy = executedBy;
	}

	public int getIssueID() {
		return issueID;
	}

	public void setIssueID(int issueID) {
		this.issueID = issueID;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getExecutedOn() {
		return executedOn;
	}

	public void setExecutedOn(Date executedOn) {
		this.executedOn = executedOn;
	}

	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}

	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}

	public List<BugsVO> getBugs() {
		return bugs;
	}

	public void setBugs(List<BugsVO> bugs) {
		this.bugs = bugs;
	}

}
