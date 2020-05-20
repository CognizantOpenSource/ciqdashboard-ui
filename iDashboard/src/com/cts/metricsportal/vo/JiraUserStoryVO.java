
/**
 * @author 653731
 *
 */
package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraUserStory") 
public class JiraUserStoryVO {

	
	private int levelId;
	private String prjKey;
	private String prjName;
	private int issueID;
	private String issueKey;
	private String issueType;
	private String storyStatus;
	private String issueStatusCategory;
	private int storyPoints;
	private String SprintID;
	private String storyOwner;

	
	private Date storyLastUpdateDate;
	private Date storyCreationDate;
	private int statusCnt=0;
	private String iteration;
	private String storyID;
	private String storyName;
	private String userStrdescription;
	private int storypointCnt;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();
	
	
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
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
	public String getStoryOwner() {
		return storyOwner;
	}
	public void setStoryOwner(String storyOwner) {
		this.storyOwner = storyOwner;
	}
	public String getIssueType() {
		return issueType;
	}
	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}
	public String getStoryStatus() {
		return storyStatus;
	}
	public void setStoryStatus(String storyStatus) {
		this.storyStatus = storyStatus;
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
	public String getSprintID() {
		return SprintID;
	}
	public void setSprintID(String sprintID) {
		SprintID = sprintID;
	}
	public Date getStoryLastUpdateDate() {
		return storyLastUpdateDate;
	}
	public void setStoryLastUpdateDate(Date storyLastUpdateDate) {
		this.storyLastUpdateDate = storyLastUpdateDate;
	}
	public Date getStoryCreationDate() {
		return storyCreationDate;
	}
	public void setStoryCreationDate(Date storyCreationDate) {
		this.storyCreationDate = storyCreationDate;
	}
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
	public String getIteration() {
		return iteration;
	}
	public void setIteration(String iteration) {
		this.iteration = iteration;
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
	public String getUserStrdescription() {
		return userStrdescription;
	}
	public void setUserStrdescription(String userStrdescription) {
		this.userStrdescription = userStrdescription;
	}
	public int getStorypointCnt() {
		return storypointCnt;
	}
	public void setStorypointCnt(int storypointCnt) {
		this.storypointCnt = storypointCnt;
	}
	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}
	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	
	
	
}