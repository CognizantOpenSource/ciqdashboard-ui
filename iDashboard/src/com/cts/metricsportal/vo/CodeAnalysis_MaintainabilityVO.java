package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class CodeAnalysis_MaintainabilityVO {
	
	private String code_smells;
	private String sqale_index;
	private String sqale_debt_ratio;
	private String sqale_rating;
	
	private String date;
	private String new_code_smells;
	private String new_technical_debt;
	private String new_maintainability_rating;
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getNew_code_smells() {
		return new_code_smells;
	}
	public void setNew_code_smells(String new_code_smells) {
		this.new_code_smells = new_code_smells;
	}
	public String getNew_technical_debt() {
		return new_technical_debt;
	}
	public void setNew_technical_debt(String new_technical_debt) {
		this.new_technical_debt = new_technical_debt;
	}
	public String getNew_maintainability_rating() {
		return new_maintainability_rating;
	}
	public void setNew_maintainability_rating(String new_maintainability_rating) {
		this.new_maintainability_rating = new_maintainability_rating;
	}
	public String getCode_smells() {
		return code_smells;
	}
	public void setCode_smells(String code_smells) {
		this.code_smells = code_smells;
	}
	public String getSqale_index() {
		return sqale_index;
	}
	public void setSqale_index(String sqale_index) {
		this.sqale_index = sqale_index;
	}
	public String getSqale_debt_ratio() {
		return sqale_debt_ratio;
	}
	public void setSqale_debt_ratio(String sqale_debt_ratio) {
		this.sqale_debt_ratio = sqale_debt_ratio;
	}
	public String getSqale_rating() {
		return sqale_rating;
	}
	public void setSqale_rating(String sqale_rating) {
		this.sqale_rating = sqale_rating;
	}
	
	

}
