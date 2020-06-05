package com.idashboard.lifecycle.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCoctaneUserStory") 
public class OctaneStoryVO {

	
	private String projectName;
	private String creationTime;
	private String releaseId;
	private String sprintId;
	private String description;
	private Long investedHours;
	private String storyId;
	private String storyName;
	private String lastModified;
	private String storyPhaseId;
	private String storyOwnerId;
	private String storyAuthorId;
	private Long storyPoints;
	private String storyTeamId;
	private String storyPriorityId;
	private String storyPriorityType;
	private String blockedReason;
	private Long estimatedHours;
	
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(String creationTime) {
		this.creationTime = creationTime;
	}
	public String getReleaseId() {
		return releaseId;
	}
	public void setReleaseId(String releaseId) {
		this.releaseId = releaseId;
	}
	public String getSprintId() {
		return sprintId;
	}
	public void setSprintId(String sprintId) {
		this.sprintId = sprintId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Long getInvestedHours() {
		return investedHours;
	}
	public void setInvestedHours(Long investedHours) {
		this.investedHours = investedHours;
	}
	public String getStoryId() {
		return storyId;
	}
	public void setStoryId(String storyId) {
		this.storyId = storyId;
	}
	public String getStoryName() {
		return storyName;
	}
	public void setStoryName(String storyName) {
		this.storyName = storyName;
	}
	public String getLastModified() {
		return lastModified;
	}
	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}
	public String getStoryPhaseId() {
		return storyPhaseId;
	}
	public void setStoryPhaseId(String storyPhaseId) {
		this.storyPhaseId = storyPhaseId;
	}
	public String getStoryOwnerId() {
		return storyOwnerId;
	}
	public void setStoryOwnerId(String storyOwnerId) {
		this.storyOwnerId = storyOwnerId;
	}
	public String getStoryAuthorId() {
		return storyAuthorId;
	}
	public void setStoryAuthorId(String storyAuthorId) {
		this.storyAuthorId = storyAuthorId;
	}
	public Long getStoryPoints() {
		return storyPoints;
	}
	public void setStoryPoints(Long storyPoints) {
		this.storyPoints = storyPoints;
	}
	public String getStoryTeamId() {
		return storyTeamId;
	}
	public void setStoryTeamId(String storyTeamId) {
		this.storyTeamId = storyTeamId;
	}
	public String getStoryPriorityId() {
		return storyPriorityId;
	}
	public void setStoryPriorityId(String storyPriorityId) {
		this.storyPriorityId = storyPriorityId;
	}
	public String getStoryPriorityType() {
		return storyPriorityType;
	}
	public void setStoryPriorityType(String storyPriorityType) {
		this.storyPriorityType = storyPriorityType;
	}
	public String getBlockedReason() {
		return blockedReason;
	}
	public void setBlockedReason(String blockedReason) {
		this.blockedReason = blockedReason;
	}
	public Long getEstimatedHours() {
		return estimatedHours;
	}
	public void setEstimatedHours(Long estimatedHours) {
		this.estimatedHours = estimatedHours;
	}
	
	
	
}
