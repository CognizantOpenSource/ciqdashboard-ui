package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="archerTrend")
public class ArcherTrendVO
{
  private int count = 0;
  
  public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
  }
  
  private String division = null;
  private String dataSteward = null;
  private String status = null;
  private Date dateCreated = null;
  
  public String getDivision()
  {
    return this.division;
  }
  
  public void setDivision(String division)
  {
    this.division = division;
  }
  
  public Date getDateCreated()
  {
    return this.dateCreated;
  }
  
  public void setDateCreated(Date dateCreated)
  {
    this.dateCreated = dateCreated;
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
}
