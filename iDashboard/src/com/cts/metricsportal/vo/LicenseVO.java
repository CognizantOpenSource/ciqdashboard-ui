package com.cts.metricsportal.vo;

import java.util.Date;
import java.util.List;

public class LicenseVO {
	
	private String user;
	private String macId;
	private Date startDate;
	private Date endDate;
	private String version;
	private List<String> tools;
	
	private boolean macIdVerify;
	private long daysRemaining;
	

	public boolean getisMacIdVerify() {
		return macIdVerify;
	}
	public void setMacIdVerify(boolean macIdVerify) {
		this.macIdVerify = macIdVerify;
	}
	public long getDaysRemaining() {
		return daysRemaining;
	}
	public void setDaysRemaining(long daysRemaining) {
		this.daysRemaining = daysRemaining;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getMacId() {
		return macId;
	}
	public void setMacId(String macId) {
		this.macId = macId;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public List<String> getTools() {
		return tools;
	}
	public void setTools(List<String> tools) {
		this.tools = tools;
	}
	

	
}
