package com.cts.metricsportal.vo;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="ethicalHack")
public class EthicalHacksVO
{
  private String division = null;
  private String dataSteward = null;
  private String remediationStatus = null;
  private long severity = 0L;
  private Date dateCreated = null;
  private String remediationDueDate = null;
  private String exceptionExpirationDate = null;
  private int count = 0;
  private String appMnemonic = null;
  private String taxonomyLOB = null;
  private String lineofBusiness = null;
  private String appOwner = null;
  private String vulnerabilityClass = null;
  private String title = null;
  private String name = null;
  private String actualFixDate = null;
  private String internalExternal = null;
  private String overDue = null;
  private long scanSourceUID = 0L;
  private String description = null;
  private String reTestRequestDate = null;
  private String reTestScheduledDate = null;
  private String currentExceptionID = null;
  private String originalRemediationDueDate = null;
  private String ehITSIRO = null;
  
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
  
  public long getSeverity()
  {
    return this.severity;
  }
  
  public void setSeverity(long severity)
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
  
  public String getRemediationDueDate()
  {
    return this.remediationDueDate;
  }
  
  public void setRemediationDueDate(String remediationDueDate)
  {
    this.remediationDueDate = remediationDueDate;
  }
  
  public String getExceptionExpirationDate()
  {
    return this.exceptionExpirationDate;
  }
  
  public void setExceptionExpirationDate(String exceptionExpirationDate)
  {
    this.exceptionExpirationDate = exceptionExpirationDate;
  }
  
  public int getCount()
  {
    return this.count;
  }
  
  public void setCount(int count)
  {
    this.count = count;
  }
  
  public String getAppMnemonic()
  {
    return this.appMnemonic;
  }
  
  public void setAppMnemonic(String appMnemonic)
  {
    this.appMnemonic = appMnemonic;
  }
  
  public String getTaxonomyLOB()
  {
    return this.taxonomyLOB;
  }
  
  public void setTaxonomyLOB(String taxonomyLOB)
  {
    this.taxonomyLOB = taxonomyLOB;
  }
  
  public String getLineofBusiness()
  {
    return this.lineofBusiness;
  }
  
  public void setLineofBusiness(String lineofBusiness)
  {
    this.lineofBusiness = lineofBusiness;
  }
  
  public String getAppOwner()
  {
    return this.appOwner;
  }
  
  public void setAppOwner(String appOwner)
  {
    this.appOwner = appOwner;
  }
  
  public String getVulnerabilityClass()
  {
    return this.vulnerabilityClass;
  }
  
  public void setVulnerabilityClass(String vulnerabilityClass)
  {
    this.vulnerabilityClass = vulnerabilityClass;
  }
  
  public String getTitle()
  {
    return this.title;
  }
  
  public void setTitle(String title)
  {
    this.title = title;
  }
  
  public String getName()
  {
    return this.name;
  }
  
  public void setName(String name)
  {
    this.name = name;
  }
  
  public String getActualFixDate()
  {
    return this.actualFixDate;
  }
  
  public void setActualFixDate(String actualFixDate)
  {
    this.actualFixDate = actualFixDate;
  }
  
  public String getInternalExternal()
  {
    return this.internalExternal;
  }
  
  public void setInternalExternal(String internalExternal)
  {
    this.internalExternal = internalExternal;
  }
  
  public String getOverDue()
  {
    return this.overDue;
  }
  
  public void setOverDue(String overDue)
  {
    this.overDue = overDue;
  }
  
  public long getScanSourceUID()
  {
    return this.scanSourceUID;
  }
  
  public void setScanSourceUID(long scanSourceUID)
  {
    this.scanSourceUID = scanSourceUID;
  }
  
  public String getDescription()
  {
    return this.description;
  }
  
  public void setDescription(String description)
  {
    this.description = description;
  }
  
  public String getReTestRequestDate()
  {
    return this.reTestRequestDate;
  }
  
  public void setReTestRequestDate(String reTestRequestDate)
  {
    this.reTestRequestDate = reTestRequestDate;
  }
  
  public String getReTestScheduledDate()
  {
    return this.reTestScheduledDate;
  }
  
  public void setReTestScheduledDate(String reTestScheduledDate)
  {
    this.reTestScheduledDate = reTestScheduledDate;
  }
  
  public String getCurrentExceptionID()
  {
    return this.currentExceptionID;
  }
  
  public void setCurrentExceptionID(String currentExceptionID)
  {
    this.currentExceptionID = currentExceptionID;
  }
  
  public String getOriginalRemediationDueDate()
  {
    return this.originalRemediationDueDate;
  }
  
  public void setOriginalRemediationDueDate(String originalRemediationDueDate)
  {
    this.originalRemediationDueDate = originalRemediationDueDate;
  }
  
  public String getEhITSIRO()
  {
    return this.ehITSIRO;
  }
  
  public void setEhITSIRO(String ehITSIRO)
  {
    this.ehITSIRO = ehITSIRO;
  }
}
