package com.cts.metricsportal.vo;


import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lifeCycleDashboards")
public class LCDashboardComponentsVO {

	private String buildJobName;
	private String codeAnalysisProjectName;
	private String gitName;
	private String gitType;
	private String gitRepo;
	private String domainName;
	private String projectName;
	private String releaseName;
	private String transactionName;
	private String rallyProject;
	private String jiraProject;
	private String cookbookName;
	
	public String getBuildJobName() {
		return buildJobName;
	}

	public void setBuildJobName(String buildjobName) {
		this.buildJobName = buildjobName;
	}

	public String getCodeAnalysisProjectName() {
		return codeAnalysisProjectName;
	}

	public void setCodeAnalysisProjectName(String codeAnalysisProjectName) {
		this.codeAnalysisProjectName = codeAnalysisProjectName;
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

	public String getGitRepo() {
		return gitRepo;
	}

	public void setGitRepo(String gitRepo) {
		this.gitRepo = gitRepo;
	}

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getReleaseName() {
		return releaseName;
	}

	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}

	public String getTransactionName() {
		return transactionName;
	}

	public void setTransactionName(String transactionName) {
		this.transactionName = transactionName;
	}

	public String getRallyProject() {
		return rallyProject;
	}

	public void setRallyProject(String rallyProject) {
		this.rallyProject = rallyProject;
	}

	public String getCookbookName() {
		return cookbookName;
	}

	public void setCookbookName(String cookbookName) {
		this.cookbookName = cookbookName;
	}

	public String getJiraProject() {
		return jiraProject;
	}

	public void setJiraProject(String jiraProject) {
		this.jiraProject = jiraProject;
	}

	
	
}
