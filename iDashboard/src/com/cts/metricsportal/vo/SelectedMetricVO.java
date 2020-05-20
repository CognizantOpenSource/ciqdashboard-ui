package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customTemplate")
public class SelectedMetricVO {
	private int metricId;
	private String metricName;
	private String entityType;
	private boolean almMetric;
	private boolean jiraMetric;
	private String type = null;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getMetricId() {
		return metricId;
	}
	public void setMetricId(int metricId) {
		this.metricId = metricId;
	}
	public String getMetricName() {
		return metricName;
	}
	public void setMetricName(String metricName) {
		this.metricName = metricName;
	}
	public String getEntityType() {
		return entityType;
	}
	public void setEntityType(String entityType) {
		this.entityType = entityType;
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
	
}
