package com.idashboard.lifecycle.vo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCgitrepo") 
public class GitRepositoryVO {
	
	private String dashboardName;
	private String owner;
	private String gitName;
	private String gitType;
	private String password;
	private int followers;
	private int following;
	private Date createdAt;
	private Date updatedAt;
	private int repoCount;
	private List<GitDataVO> repositoryDetails;
	
	
	
	public String getDashboardName() {
		return dashboardName;
	}
	public void setDashboardName(String dashboardName) {
		this.dashboardName = dashboardName;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public int getFollowers() {
		return followers;
	}
	public void setFollowers(int followers) {
		this.followers = followers;
	}
	public int getFollowing() {
		return following;
	}
	public void setFollowing(int following) {
		this.following = following;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public Date getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	public String getGitName() {
		return gitName;
	}
	public void setGitName(String gitName) {
		this.gitName = gitName;
	}
	public String getGitType() {
		return gitType;
	}
	public void setGitType(String gitType) {
		this.gitType = gitType;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getRepoCount() {
		return repoCount;
	}
	public void setRepoCount(int repoCount) {
		this.repoCount = repoCount;
	}
	public List<GitDataVO> getRepositoryDetails() {
		return repositoryDetails;
	}
	public void setRepositoryDetails(List<GitDataVO> repositoryDetails) {
		this.repositoryDetails = repositoryDetails;
	}

	
}
