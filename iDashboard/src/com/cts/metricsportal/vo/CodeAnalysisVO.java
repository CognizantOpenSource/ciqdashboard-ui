package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class CodeAnalysisVO {
	
	private String prjName;
	private String prjKey;
	private String new_bugs;
	private String new_reliability_rating;
	private String new_vulnerabilities;
	private String new_security_rating;
	private String new_code_smells;
	private String new_maintainability_rating;    
	private String new_technical_debt;
	private String new_lines_to_cover;
	private String new_duplicated_lines;
	private String linesofCode;
	
	private List<CodeAnalysisHistoryVO> history= new ArrayList<CodeAnalysisHistoryVO>();
	

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getPrjKey() {
		return prjKey;
	}

	public void setPrjKey(String prjKey) {
		this.prjKey = prjKey;
	}

	public String getNew_bugs() {
		return new_bugs;
	}

	public void setNew_bugs(String new_bugs) {
		this.new_bugs = new_bugs;
	}

	public String getNew_reliability_rating() {
		return new_reliability_rating;
	}

	public void setNew_reliability_rating(String new_reliability_rating) {
		this.new_reliability_rating = new_reliability_rating;
	}	
	
	
	public String getNew_vulnerabilities() {
		return new_vulnerabilities;
	}

	public void setNew_vulnerabilities(String new_vulnerabilities) {
		this.new_vulnerabilities = new_vulnerabilities;
	}

	public String getNew_security_rating() {
		return new_security_rating;
	}

	public void setNew_security_rating(String new_security_rating) {
		this.new_security_rating = new_security_rating;
	}

	public String getNew_code_smells() {
		return new_code_smells;
	}

	public void setNew_code_smells(String new_code_smells) {
		this.new_code_smells = new_code_smells;
	}

	public String getNew_maintainability_rating() {
		return new_maintainability_rating;
	}

	public void setNew_maintainability_rating(String new_maintainability_rating) {
		this.new_maintainability_rating = new_maintainability_rating;
	}

	public String getNew_technical_debt() {
		return new_technical_debt;
	}

	public void setNew_technical_debt(String new_technical_debt) {
		this.new_technical_debt = new_technical_debt;
	}

	public String getNew_lines_to_cover() {
		return new_lines_to_cover;
	}

	public void setNew_lines_to_cover(String new_lines_to_cover) {
		this.new_lines_to_cover = new_lines_to_cover;
	}

	public String getNew_duplicated_lines() {
		return new_duplicated_lines;
	}

	public void setNew_duplicated_lines(String new_duplicated_lines) {
		this.new_duplicated_lines = new_duplicated_lines;
	}

	public String getLinesofCode() {
		return linesofCode;
	}

	public void setLinesofCode(String linesofCode) {
		this.linesofCode = linesofCode;
	}

	public List<CodeAnalysisHistoryVO> getHistory() {
		return history;
	}

	public void setHistory(List<CodeAnalysisHistoryVO> history) {
		this.history = history;
	}
	
	
	

	
	
	
	
	
}
