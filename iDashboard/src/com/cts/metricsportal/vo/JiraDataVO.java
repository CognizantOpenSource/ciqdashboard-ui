package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jiraData") 
public class JiraDataVO {
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getRelease() {
		return release;
	}
	public void setRelease(String release) {
		this.release = release;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getLevelId() {
		return levelId;
	}
	public void setLevelId(String levelId) {
		this.levelId = levelId;
	}
	public String getPrjName() {
		return prjName;
	}
	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}
	public Date getSprint_start_date() {
		return sprint_start_date;
	}
	public void setSprint_start_date(Date sprint_start_date) {
		this.sprint_start_date = sprint_start_date;
	}
	public Date getSprint_end_date() {
		return sprint_end_date;
	}
	public void setSprint_end_date(Date sprint_end_date) {
		this.sprint_end_date = sprint_end_date;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSprint() {
		return sprint;
	}
	public void setSprint(String sprint) {
		this.sprint = sprint;
	}
	public String getUserstory() {
		return userstory;
	}
	public void setUserstory(String userstory) {
		this.userstory = userstory;
	}
	private String _id;
	private String release;
	private String status;
	private String levelId;
	private String prjName;
	private Date sprint_start_date;
	private Date sprint_end_date;
	private String type;
	private String sprint;
	private String userstory;

}
