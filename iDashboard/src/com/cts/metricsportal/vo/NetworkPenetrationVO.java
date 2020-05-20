package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="networkPenetration")
public class NetworkPenetrationVO
{
  private String division = null;
  private String dataSteward = null;
  private String status = null;
  private long severity = 0L;
  private int count = 0;
  private String slaDate = null;
  private Date dateCreated = null;
  private String type = null;
  private String businessImpact = null;
  private String source = null;
  private String category = null;
  private String title = null;
  
  public String getType() {
	return type;
}

public void setType(String type) {
	this.type = type;
}

public String getBusinessImpact() {
	return businessImpact;
}

public void setBusinessImpact(String businessImpact) {
	this.businessImpact = businessImpact;
}

public String getSource() {
	return source;
}

public void setSource(String source) {
	this.source = source;
}

public String getCategory() {
	return category;
}

public void setCategory(String category) {
	this.category = category;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
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
  
  public long getSeverity()
  {
    return this.severity;
  }
  
  public void setSeverity(long severity)
  {
    this.severity = severity;
  }
  
  public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
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
