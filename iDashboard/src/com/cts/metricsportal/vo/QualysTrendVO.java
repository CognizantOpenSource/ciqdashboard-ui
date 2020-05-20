package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="qualysVulnerabilityTrend")
public class QualysTrendVO
{
  private String division = null;
  private String pkConcat = null;
  private String slaDate = null;
  private int severity = 0;
  private int  priority = 0;
  
  private int count = 0;
  private Date dateCreated = null;
public String getDivision() {
	return division;
}
public void setDivision(String division) {
	this.division = division;
}
public String getPkConcat() {
	return pkConcat;
}
public void setPkConcat(String pkConcat) {
	this.pkConcat = pkConcat;
}
public String getSlaDate() {
	return slaDate;
}
public void setSlaDate(String slaDate) {
	this.slaDate = slaDate;
}
public int getSeverity() {
	return severity;
}
public void setSeverity(int severity) {
	this.severity = severity;
}
public int getPriority() {
	return priority;
}
public void setPriority(int priority) {
	this.priority = priority;
}
public int getCount() {
	return count;
}
public void setCount(int count) {
	this.count = count;
}
public Date getDateCreated() {
	return dateCreated;
}
public void setDateCreated(Date dateCreated) {
	this.dateCreated = dateCreated;
}
  
  
  
}