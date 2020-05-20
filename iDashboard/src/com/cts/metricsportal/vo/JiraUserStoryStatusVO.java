/**
 * @author Adhish 653731
 */
package com.cts.metricsportal.vo;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "JiraUserStory")
public class JiraUserStoryStatusVO {


	
		
	  private String storyOwner;
	  private int ownercount;
	  private Date storyCreationDate;
	  private int statusCnt=0;
	  private int priorityCnt=0;
	  private int sumct=0;

	  private String projectName;
	  private String prjName;

	  private String SprintID;

	  private String iteration;
	  private int typecount;
	  
	  private String storyStatus;
	  private int levelId;
	  

	public String getStoryStatus() {
		return storyStatus;
	}
	public void setStoryStatus(String storyStatus) {
		this.storyStatus = storyStatus;
	}
	public String getStoryOwner() {
		return storyOwner;
	}
	public void setStoryOwner(String storyOwner) {
		this.storyOwner = storyOwner;
	}
	public int getOwnercount() {
		return ownercount;
	}
	public void setOwnercount(int ownercount) {
		this.ownercount = ownercount;
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
	public int getPriorityCnt() {
		return priorityCnt;
	}
	public void setPriorityCnt(int priorityCnt) {
		this.priorityCnt = priorityCnt;
	}
	public int getSumct() {
		return sumct;
	}
	public void setSumct(int sumct) {
		this.sumct = sumct;
	}
	public String getProjectName() {
		return projectName;
	}
	  public String getPrjName() {
		return prjName;
	}
	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getSprintID() {
		return SprintID;
	}
	public void setSprintID(String sprintID) {
		SprintID = sprintID;
	}
	public String getIteration() {
		return iteration;
	}
	public void setIteration(String iteration) {
		this.iteration = iteration;
	}
	public int getTypecount() {
		return typecount;
	}
	public void setTypecount(int typecount) {
		this.typecount = typecount;
	}
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}
	  
}
