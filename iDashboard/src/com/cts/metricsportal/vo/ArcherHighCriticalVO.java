
package com.cts.metricsportal.vo;

public class ArcherHighCriticalVO
{
  private String businessRiskClass;
  private int count;
  
  public String getBusinessRiskClass()
  {
    return this.businessRiskClass;
  }
  
  public ArcherHighCriticalVO(String businessRiskClass, int count)
  {
    this.businessRiskClass = businessRiskClass;
    this.count = count;
  }
  
  public void setBusinessRiskClass(String businessRiskClass)
  {
    this.businessRiskClass = businessRiskClass;
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
