package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "gitrepoInfo") 
public class GitDataVO {
	
	private String repoName;
	private int fileSize;
	private int branchCount;
	private int releaseCount;
	private int commitsCount;
	private int contributorsCount;
	private int totalPulls;
	private int mergeCount;
	private int totalIssues;
	private int closedIssueCount;
	private int watchersCount;
	private int stargazersCount;
	private List<ContributorsDetailsVO> contributorsDetails;
	private List<CommitDetailsVO> commitDetails;
	
	
	public String getRepoName() {
		return repoName;
	}
	public void setRepoName(String repoName) {
		this.repoName = repoName;
	}
	
	public int getFileSize() {
		return fileSize;
	}
	public void setFileSize(int fileSize) {
		this.fileSize = fileSize;
	}
	public int getBranchCount() {
		return branchCount;
	}
	public void setBranchCount(int branchCount) {
		this.branchCount = branchCount;
	}
	public int getReleaseCount() {
		return releaseCount;
	}
	public void setReleaseCount(int releaseCount) {
		this.releaseCount = releaseCount;
	}
	public int getCommitsCount() {
		return commitsCount;
	}
	public void setCommitsCount(int commitsCount) {
		this.commitsCount = commitsCount;
	}
	public int getContributorsCount() {
		return contributorsCount;
	}
	public void setContributorsCount(int contributorsCount) {
		this.contributorsCount = contributorsCount;
	}
	public int getTotalPulls() {
		return totalPulls;
	}
	public void setTotalPulls(int totalPulls) {
		this.totalPulls = totalPulls;
	}
	public int getMergeCount() {
		return mergeCount;
	}
	public void setMergeCount(int mergeCount) {
		this.mergeCount = mergeCount;
	}
	public int getTotalIssues() {
		return totalIssues;
	}
	public void setTotalIssues(int totalIssues) {
		this.totalIssues = totalIssues;
	}
	public int getClosedIssueCount() {
		return closedIssueCount;
	}
	public void setClosedIssueCount(int closedIssueCount) {
		this.closedIssueCount = closedIssueCount;
	}
	public int getWatchersCount() {
		return watchersCount;
	}
	public void setWatchersCount(int watchersCount) {
		this.watchersCount = watchersCount;
	}
	public int getStargazersCount() {
		return stargazersCount;
	}
	public void setStargazersCount(int stargazersCount) {
		this.stargazersCount = stargazersCount;
	}
	public List<ContributorsDetailsVO> getContributorsDetails() {
		return contributorsDetails;
	}
	public void setContributorsDetails(
			List<ContributorsDetailsVO> contributorsDetails) {
		this.contributorsDetails = contributorsDetails;
	}
	public List<CommitDetailsVO> getCommitDetails() {
		return commitDetails;
	}
	public void setCommitDetails(List<CommitDetailsVO> commitDetails) {
		this.commitDetails = commitDetails;
	}
	
	
}
