package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class CodeAnalysis_SecurityVO {
	
	private String vulnerabilities;
	private String security_rating;
	private String security_remediation_effort;
	
	// Parent Data
	private String date;
	private String new_vulnerabilities;
	private String new_security_rating;
	
	
	public String getVulnerabilities() {
		return vulnerabilities;
	}
	public void setVulnerabilities(String vulnerabilities) {
		this.vulnerabilities = vulnerabilities;
	}
	public String getSecurity_rating() {
		return security_rating;
	}
	public void setSecurity_rating(String security_rating) {
		this.security_rating = security_rating;
	}
	public String getSecurity_remediation_effort() {
		return security_remediation_effort;
	}
	public void setSecurity_remediation_effort(String security_remediation_effort) {
		this.security_remediation_effort = security_remediation_effort;
	}
	
	// Parent Data
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getNew_vulnerabilities() {
		return new_vulnerabilities;
	}
	public void setNew_vulnerabilities(String new_vulnerabilities) {
		this.new_vulnerabilities = new_vulnerabilities;
	}
	public String getNew_security_rating() {
		return new_security_rating;
	}
	public void setNew_security_rating(String new_security_rating) {
		this.new_security_rating = new_security_rating;
	}
	
	
	
	
	
	
	
}
