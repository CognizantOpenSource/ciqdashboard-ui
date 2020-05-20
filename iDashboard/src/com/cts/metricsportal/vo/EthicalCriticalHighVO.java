
package com.cts.metricsportal.vo;

public class EthicalCriticalHighVO
{
  private int count;
  private long severity;
  private String division = null;
  private String remediationStatus=null;
  private String status = null;
  
  public String getStatus() {
	return status;
}

public void setStatus(String status) {
	this.status = status;
}

public String getRemediationStatus() {
	return remediationStatus;
}

public void setRemediationStatus(String remediationStatus) {
	this.remediationStatus = remediationStatus;
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
  
  public long getSeverity()
  {
    return this.severity;
  }
  
  public void setSeverity(long severity)
  {
    this.severity = severity;
  }
  
  public EthicalCriticalHighVO(int count, long severity)
  {
    this.count = count;
    this.severity = severity;
  }
  
  public EthicalCriticalHighVO(int count, String division)
  {
    this.count = count;
    this.division = division;
  }
}
