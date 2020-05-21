package com.cts.metricsportal.vo;

import java.util.Date;

public class TestCaseStatusVO {

	private String testDesignStatus;
	private int statuscount;
	private String testType;
	private int typecount;
	private String testDesigner;
	private int designercount;
	private Date testCreationDate;
	
	
	public Date getTestCreationDate() {
		return testCreationDate;
	}
	public void setTestCreationDate(Date testCreationDate) {
		this.testCreationDate = testCreationDate;
	}
	public String getTestDesignStatus() {
		return testDesignStatus;
	}
	public void setTestDesignStatus(String testDesignStatus) {
		this.testDesignStatus = testDesignStatus;
	}
	public int getStatuscount() {
		return statuscount;
	}
	public void setStatuscount(int statuscount) {
		this.statuscount = statuscount;
	}
	public String getTestType() {
		return testType;
	}
	public void setTestType(String testType) {
		this.testType = testType;
	}
	public int getTypecount() {
		return typecount;
	}
	public void setTypecount(int typecount) {
		this.typecount = typecount;
	}
	public String getTestDesigner() {
		return testDesigner;
	}
	public void setTestDesigner(String testDesigner) {
		this.testDesigner = testDesigner;
	}
	public int getDesignercount() {
		return designercount;
	}
	public void setDesignercount(int designercount) {
		this.designercount = designercount;
	}
	
	
}
