package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ALMRequirements") 
public class RequirementStatusVO {

	private long count;
	private String reqCriticality = null;
	private int reqCriticalityCnt=0;
	private String priority = null;
	private int priorityCnt=0;
	private String status = null;
	private int statusCnt=0;
	private Date creationTime;
	
	//Levis DB Columns
			private String prjKey;
			private String prjName;
			private int issueID;
			private String issueKey;
			private String issueType;
			private String issueStatus;
			private String issueStatusCategory;
			private String storyPoints;	
			private String issueEpic;
			private String issueSprint;
			private Date issueUpdated;
			private Date issueResolved;
			private Date issueCreated;
			private String issuePriority;
	
	
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
			public String getStoryPoints() {
				return storyPoints;
			}
			public void setStoryPoints(String storyPoints) {
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
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getReqCriticality() {
		return reqCriticality;
	}
	public void setReqCriticality(String reqCriticality) {
		this.reqCriticality = reqCriticality;
	}
	public int getReqCriticalityCnt() {
		return reqCriticalityCnt;
	}
	public void setReqCriticalityCnt(int reqCriticalityCnt) {
		this.reqCriticalityCnt = reqCriticalityCnt;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public int getPriorityCnt() {
		return priorityCnt;
	}
	public void setPriorityCnt(int priorityCnt) {
		this.priorityCnt = priorityCnt;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getStatusCnt() {
		return statusCnt;
	}
	public void setStatusCnt(int statusCnt) {
		this.statusCnt = statusCnt;
	}
		
	
	
}