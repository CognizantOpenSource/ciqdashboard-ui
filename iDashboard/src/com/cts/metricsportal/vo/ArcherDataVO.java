package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="archer")
public class ArcherDataVO
{
  private String division = null;
  private String dataSteward = null;
  private String status = null;
  private String riskLevel = null;
  private String riskClassification = null;
  private String expirationDate = null;
  private Date dateCreated = null;
  private String businessRisk = null;
  private int count = 0;
  private String businessImpact = null;
  private String type = null;
  private String applicationName = null;
  private String description = null;
  private String title = null;
  
  
  public String getBusinessImpact() {
	return businessImpact;
}

public void setBusinessImpact(String businessImpact) {
	this.businessImpact = businessImpact;
}

public String getType() {
	return type;
}

public void setType(String type) {
	this.type = type;
}

public String getApplicationName() {
	return applicationName;
}

public void setApplicationName(String applicationName) {
	this.applicationName = applicationName;
}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}

public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
  }
  
  public String getDivision()
  {
    return this.division;
  }
  
  public void setDivision(String division)
  {
    this.division = division;
  }
  
  public String getDataSteward()
  {
    return this.dataSteward;
  }
  
  public void setDataSteward(String dataSteward)
  {
    this.dataSteward = dataSteward;
  }
  
  public String getStatus()
  {
    return this.status;
  }
  
  public void setStatus(String status)
  {
    this.status = status;
  }
  
  public String getRiskLevel()
  {
    return this.riskLevel;
  }
  
  public void setRiskLevel(String riskLevel)
  {
    this.riskLevel = riskLevel;
  }
  
  public String getRiskClassification()
  {
    return this.riskClassification;
  }
  
  public void setRiskClassification(String riskClassification)
  {
    this.riskClassification = riskClassification;
  }
  
  public String getExpirationDate()
  {
    return this.expirationDate;
  }
  
  public void setExpirationDate(String expirationDate)
  {
    this.expirationDate = expirationDate;
  }
  
  public Date getDateCreated()
  {
    return this.dateCreated;
  }
  
  public void setDateCreated(Date dateCreated)
  {
    this.dateCreated = dateCreated;
  }
  
  public String getBusinessRisk()
  {
    return this.businessRisk;
  }
  
  public void setBusinessRisk(String businessRisk)
  {
    this.businessRisk = businessRisk;
  }
}
