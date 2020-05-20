package com.cts.metricsportal.vo;

import java.util.Date;

public class EthicalStatusTrendVO
{
  private int noAction = 0;
  private int inRetest = 0;
  private int exceptionComplete = 0;
  private int mitigationInProgress = 0;
  private int New = 0;
  private int scheduledforIRMRetest = 0;
  private int movedtoRiskExceptionProcess = 0;
  private String Date;
  private Date mydate;
  
  public int getNoAction()
  {
    return this.noAction;
  }
  
  public void setNoAction(int noAction)
  {
    this.noAction = noAction;
  }
  
  public int getInRetest()
  {
    return this.inRetest;
  }
  
  public void setInRetest(int inRetest)
  {
    this.inRetest = inRetest;
  }
  
  public int getExceptionComplete()
  {
    return this.exceptionComplete;
  }
  
  public void setExceptionComplete(int exceptionComplete)
  {
    this.exceptionComplete = exceptionComplete;
  }
  
  public int getMitigationInProgress()
  {
    return this.mitigationInProgress;
  }
  
  public void setMitigationInProgress(int mitigationInProgress)
  {
    this.mitigationInProgress = mitigationInProgress;
  }
  
  public int getNew()
  {
    return this.New;
  }
  
  public void setNew(int new1)
  {
    this.New = new1;
  }
  
  public int getScheduledforIRMRetest()
  {
    return this.scheduledforIRMRetest;
  }
  
  public void setScheduledforIRMRetest(int scheduledforIRMRetest)
  {
    this.scheduledforIRMRetest = scheduledforIRMRetest;
  }
  
  public int getMovedtoRiskExceptionProcess()
  {
    return this.movedtoRiskExceptionProcess;
  }
  
  public void setMovedtoRiskExceptionProcess(int movedtoRiskExceptionProcess)
  {
    this.movedtoRiskExceptionProcess = movedtoRiskExceptionProcess;
  }
  
  public String getDate()
  {
    return this.Date;
  }
  
  public void setDate(String date)
  {
    this.Date = date;
  }
  
  public Date getMydate()
  {
    return this.mydate;
  }
  
  public void setMydate(Date mydate)
  {
    this.mydate = mydate;
  }
}
