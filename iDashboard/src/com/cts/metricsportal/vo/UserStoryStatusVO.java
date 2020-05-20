package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userstories")
public class UserStoryStatusVO {
	
  private String storyOwner ;
  private int ownercount;
  private Date storyCreationDate;
  private int statusCnt=0;
  private int priorityCnt=0;
  private int sumct=0;
  
 

public int getSumct() {
	return sumct;
}

public void setSumct(int sumct) {
	this.sumct = sumct;
}

public int getPriorityCnt() {
	return priorityCnt;
}

public void setPriorityCnt(int priorityCnt) {
	this.priorityCnt = priorityCnt;
}

public int getStatusCnt() {
	return statusCnt;
}

public void setStatusCnt(int statusCnt) {
	this.statusCnt = statusCnt;
}

public Date getStoryCreationDate() {
	return storyCreationDate;
}

public void setStoryCreationDate(Date storyCreationDate) {
	this.storyCreationDate = storyCreationDate;
}

public int getOwnercount() {
	return ownercount;
}

public void setOwnercount(int ownercount) {
	this.ownercount = ownercount;
}

private String storyStatus;
  public String getStoryStatus() {
	return storyStatus;
}

public void setStoryStatus(String storyStatus) {
	this.storyStatus = storyStatus;
}

private String projectName;
private String SprintID;

private String iteration;



  public String getIteration() {
	return iteration;
}

public void setIteration(String iteration) {
	this.iteration = iteration;
}

public String getSprintID() {
	return SprintID;
}

public void setSprintID(String sprintID) {
	SprintID = sprintID;
}

private int typecount;
  

public int getTypecount() {
	return typecount;
}

public void setTypecount(int typecount) {
	this.typecount = typecount;
}

public String getProjectName() {
	return projectName;
}

public void setProjectName(String projectName) {
	this.projectName = projectName;
}


public String getStoryOwner() {
	return storyOwner;
}

public void setStoryOwner(String storyOwner) {
	this.storyOwner = storyOwner;
}

}
