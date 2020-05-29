package com.idashboard.lifecycle.vo;

public class CodeAnalysis_IssuesVO {

	private String violations;
	private String open_issues;
	private String reopened_issues;
	
	private String date;
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getViolations() {
		return violations;
	}
	public void setViolations(String violations) {
		this.violations = violations;
	}
	public String getOpen_issues() {
		return open_issues;
	}
	public void setOpen_issues(String open_issues) {
		this.open_issues = open_issues;
	}
	public String getReopened_issues() {
		return reopened_issues;
	}
	public void setReopened_issues(String reopened_issues) {
		this.reopened_issues = reopened_issues;
	}
	
	
}
