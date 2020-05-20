
package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "metricList") 
public class AvailableMetricVO {
	
	 private String metricName=null;
	
	 boolean almMetric=false;
	 boolean jiraMetric=false;
	 private int metricId= 0;
	 private String entityType=null;
	 private String type=null;
	 
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	public String getMetricName() {
		return metricName;
	}
	public void setMetricName(String metricName) {
		this.metricName = metricName;
	}
	public boolean isAlmMetric() {
		return almMetric;
	}
	public void setAlmMetric(boolean almMetric) {
		this.almMetric = almMetric;
	}
	public boolean isJiraMetric() {
		return jiraMetric;
	}
	public void setJiraMetric(boolean jiraMetric) {
		this.jiraMetric = jiraMetric;
	}
	
	public int getMetricId() {
		return metricId;
	}
	public void setMetricId(int metricId) {
		this.metricId = metricId;
	}
	public String getEntityType() {
		return entityType;
	}
	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}
	 
}