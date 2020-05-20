package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="qualysVulnerability")
public class QualysVulnerabiltyVO
{
  private int count = 0;
  private String dataSteward = null;
  private String division = null;
  private String slaDate = null;
  private Date dateCreated = null;
  private String title = null;
  private String vulnType = null;
  private String vendor = null;
  private String taxonomyLOB = null;
  private String solution = null;
  private String threatDesc = null;
  private int severity = 0;
  private int timesFound = 0;
  
  public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}



public String getVulnType() {
	return vulnType;
}

public void setVulnType(String vulnType) {
	this.vulnType = vulnType;
}

public String getVendor() {
	return vendor;
}

public void setVendor(String vendor) {
	this.vendor = vendor;
}

public String getTaxonomyLOB() {
	return taxonomyLOB;
}

public void setTaxonomyLOB(String taxonomyLOB) {
	this.taxonomyLOB = taxonomyLOB;
}

public String getSolution() {
	return solution;
}

public void setSolution(String solution) {
	this.solution = solution;
}

public String getThreatDesc() {
	return threatDesc;
}

public void setThreatDesc(String threatDesc) {
	this.threatDesc = threatDesc;
}

public int getSeverity() {
	return severity;
}

public void setSeverity(int severity) {
	this.severity = severity;
}

public int getTimesFound() {
	return timesFound;
}

public void setTimesFound(int timesFound) {
	this.timesFound = timesFound;
}

public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
  }
  
  public String getDataSteward()
  {
    return this.dataSteward;
  }
  
  public void setDataSteward(String dataSteward)
  {
    this.dataSteward = dataSteward;
  }
  
  public String getDivision()
  {
    return this.division;
  }
  
  public void setDivision(String division)
  {
    this.division = division;
  }
  
  public String getSlaDate()
  {
    return this.slaDate;
  }
  
  public void setSlaDate(String slaDate)
  {
    this.slaDate = slaDate;
  }
  
  public Date getDateCreated()
  {
    return this.dateCreated;
  }
  
  public void setDateCreated(Date dateCreated)
  {
    this.dateCreated = dateCreated;
  }
}
