package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="ethicalHackTrend")
public class EthicalTrendVO
{
  private int count = 0;
  private String division = null;
  private String dataSteward = null;
  private String remediationStatus = null;
  private String severity = null;
  private Date dateCreated = null;
  
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
  
  public String getRemediationStatus()
  {
    return this.remediationStatus;
  }
  
  public void setRemediationStatus(String remediationStatus)
  {
    this.remediationStatus = remediationStatus;
  }
  
  public String getSeverity()
  {
    return this.severity;
  }
  
  public void setSeverity(String severity)
  {
    this.severity = severity;
  }
  
  public Date getDateCreated()
  {
    return this.dateCreated;
  }
  
  public void setDateCreated(Date dateCreated)
  {
    this.dateCreated = dateCreated;
  }
  
  public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
  }
}
