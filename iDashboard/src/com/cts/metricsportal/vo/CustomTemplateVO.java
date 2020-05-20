package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customTemplate") 
public class CustomTemplateVO {
	
	private String userId=null;
	private String role=null;
	private String templateId=null;
	private String templateName=null;
	private String  rollingPeriod=null;
	private Date createdDate=null;

	boolean isJiratool=false;
	boolean  isAlmtool =false;
	
	private List<SelectedMetricVO> selectedMetrics= null;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getTemplateId() {
		return templateId;
	}
	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}
	
	
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	public String getRollingPeriod() {
		return rollingPeriod;
	}
	public void setRollingPeriod(String rollingPeriod) {
		this.rollingPeriod = rollingPeriod;
	}
	
	public boolean isJiratool() {
		return isJiratool;
	}
	public void setJiratool(boolean isJiratool) {
		this.isJiratool = isJiratool;
	}
	
	public boolean isAlmtool() {
		return isAlmtool;
	}
	public void setAlmtool(boolean isAlmtool) {
		this.isAlmtool = isAlmtool;
	}
	
	public List<SelectedMetricVO> getSelectedMetrics() {
		return selectedMetrics;
	}
	public void setSelectedMetrics(List<SelectedMetricVO> selectedMetrics) {
		this.selectedMetrics = selectedMetrics;
	}
	
	
}
