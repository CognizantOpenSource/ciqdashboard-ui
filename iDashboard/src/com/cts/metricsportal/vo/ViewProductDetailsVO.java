package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

public class ViewProductDetailsVO {
	
	private String releaseName=null;
	private String productName=null;
	private long sprintIterations;
	private long sprintUserStories;
	private long gitCommits;
	private long gitContributors;
	private long jenkinspasscount;
	private long jenkinsfailcount;
	private String sonar=null;
	private long defSevHigh = 0;
	private long defSevLow = 0;
	private long exeStatPass = 0;
	private long exeStatFail = 0;
	private long deploymentqapass;
	private long deploymentqafail;
	private long deploymentdevpass;
	private long deploymentdevfail;
	
	
	
	public String getReleaseName() {
		return releaseName;
	}
	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	
	public long getSprintIterations() {
		return sprintIterations;
	}
	public void setSprintIterations(long sprintIterations) {
		this.sprintIterations = sprintIterations;
	}
	public long getSprintUserStories() {
		return sprintUserStories;
	}
	public void setSprintUserStories(long sprintUserStories) {
		this.sprintUserStories = sprintUserStories;
	}
	
	public long getGitCommits() {
		return gitCommits;
	}
	public void setGitCommits(long gitCommits) {
		this.gitCommits = gitCommits;
	}
	public long getGitContributors() {
		return gitContributors;
	}
	public void setGitContributors(long gitContributors) {
		this.gitContributors = gitContributors;
	}
	public long getJenkinspasscount() {
		return jenkinspasscount;
	}
	public void setJenkinspasscount(long jenkinspasscount) {
		this.jenkinspasscount = jenkinspasscount;
	}
	public long getJenkinsfailcount() {
		return jenkinsfailcount;
	}
	public void setJenkinsfailcount(long jenkinsfailcount) {
		this.jenkinsfailcount = jenkinsfailcount;
	}
	public String getSonar() {
		return sonar;
	}
	public void setSonar(String sonar) {
		this.sonar = sonar;
	}
	public long getDeploymentqapass() {
		return deploymentqapass;
	}
	public void setDeploymentqapass(long deploymentqapass) {
		this.deploymentqapass = deploymentqapass;
	}
	public long getDeploymentqafail() {
		return deploymentqafail;
	}
	public void setDeploymentqafail(long deploymentqafail) {
		this.deploymentqafail = deploymentqafail;
	}
	public long getDeploymentdevpass() {
		return deploymentdevpass;
	}
	public void setDeploymentdevpass(long deploymentdevpass) {
		this.deploymentdevpass = deploymentdevpass;
	}
	public long getDeploymentdevfail() {
		return deploymentdevfail;
	}
	public void setDeploymentdevfail(long deploymentdevfail) {
		this.deploymentdevfail = deploymentdevfail;
	}
	public long getDefSevHigh() {
		return defSevHigh;
	}
	public void setDefSevHigh(long defSevHigh) {
		this.defSevHigh = defSevHigh;
	}
	public long getDefSevLow() {
		return defSevLow;
	}
	public void setDefSevLow(long defSevLow) {
		this.defSevLow = defSevLow;
	}
	public long getExeStatPass() {
		return exeStatPass;
	}
	public void setExeStatPass(long exeStatPass) {
		this.exeStatPass = exeStatPass;
	}
	public long getExeStatFail() {
		return exeStatFail;
	}
	public void setExeStatFail(long exeStatFail) {
		this.exeStatFail = exeStatFail;
	}
	

	
}
