package com.cts.metricsportal.vo;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "ReportData")
public class TDMDataVO{
	private String _id;
	private String vertical;
	private String customer;
	private String geo;
	private String typeOfSupport;
	private String verticalPOC;
	private String coETrack;
	private String comments;
	private String highImpactContribution;
	private String month;
	private String emailCommunicationDates;
	private String supportGroup;
	private String solutionTrack;
	  private int count = 0;
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getVertical() {
		return vertical;
	}
	public void setVertical(String vertical) {
		this.vertical = vertical;
	}
	public String getCustomer() {
		return customer;
	}
	public void setCustomer(String customer) {
		this.customer = customer;
	}
	public String getGeo() {
		return geo;
	}
	public void setGeo(String geo) {
		this.geo = geo;
	}
	public String getTypeOfSupport() {
		return typeOfSupport;
	}
	public void setTypeOfSupport(String typeOfSupport) {
		this.typeOfSupport = typeOfSupport;
	}
	public String getVerticalPOC() {
		return verticalPOC;
	}
	public void setVerticalPOC(String verticalPOC) {
		this.verticalPOC = verticalPOC;
	}
	public String getCoETrack() {
		return coETrack;
	}
	public void setCoETrack(String coETrack) {
		this.coETrack = coETrack;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getHighImpactContribution() {
		return highImpactContribution;
	}
	public void setHighImpactContribution(String highImpactContribution) {
		this.highImpactContribution = highImpactContribution;
	}
	public String getMonth() {
		return month;
	}
	public void setMonth(String month) {
		this.month = month;
	}
	public String getEmailCommunicationDates() {
		return emailCommunicationDates;
	}
	public void setEmailCommunicationDates(String emailCommunicationDates) {
		this.emailCommunicationDates = emailCommunicationDates;
	} ;
	
	public String getSupportGroup() {
		return supportGroup;
	}
	public void setSupportGroup(String supportGroup) {
		this.supportGroup = supportGroup;
	}
	public String getSolutionTrack() {
		return solutionTrack;
	}
	public void setSolutionTrack(String solutionTrack) {
		this.solutionTrack = solutionTrack;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	


}