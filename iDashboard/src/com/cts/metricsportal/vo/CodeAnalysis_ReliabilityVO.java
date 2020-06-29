package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class CodeAnalysis_ReliabilityVO {

	private String bugs= null;
	private String reliability_rating= null;
	private String reliability_remediation_effort= null;
	
	private String date="";
	private String new_reliability_rating="";
	private String new_bugs="";
	
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getNew_reliability_rating() {
		return new_reliability_rating;
	}
	public void setNew_reliability_rating(String new_reliability_rating) {
		this.new_reliability_rating = new_reliability_rating;
	}
	public String getNew_bugs() {
		return new_bugs;
	}
	public void setNew_bugs(String new_bugs) {
		this.new_bugs = new_bugs;
	}
	public String getBugs() {
		return bugs;
	}
	public void setBugs(String bugs) {
		this.bugs = bugs;
	}
	public String getReliability_rating() {
		return reliability_rating;
	}
	public void setReliability_rating(String reliability_rating) {
		this.reliability_rating = reliability_rating;
	}
	public String getReliability_remediation_effort() {
		return reliability_remediation_effort;
	}
	public void setReliability_remediation_effort(
			String reliability_remediation_effort) {
		this.reliability_remediation_effort = reliability_remediation_effort;
	}
	
	
}
