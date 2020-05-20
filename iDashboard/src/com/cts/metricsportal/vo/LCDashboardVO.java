package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lifeCycleDashboards") 
public class LCDashboardVO {
	
	private String _id=null;
	private String dashboardName=null;
	private String description=null;
	private Date createdDate=null;
	private boolean ispublic=false;
	
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	private String owner=null;	
	 
	private LCDashboardComponentsVO component=new LCDashboardComponentsVO();
	
	public String getDashboardName() {
		return dashboardName;
	}
	public void setDashboardName(String dashboardName) {
		this.dashboardName = dashboardName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	
	public LCDashboardComponentsVO getComponent() {
		return component;
	}
	public void setComponent(LCDashboardComponentsVO component) {
		this.component = component;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	public boolean isIspublic() {
		return ispublic;
	}
	public void setIspublic(boolean ispublic) {
		this.ispublic = ispublic;
	}
	
	

	
	
	
}
