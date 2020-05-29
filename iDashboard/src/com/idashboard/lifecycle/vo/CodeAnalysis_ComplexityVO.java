package com.idashboard.lifecycle.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCsonarCodeQual")
public class CodeAnalysis_ComplexityVO {
	private String complexity;
	private String class_complexity;
	private String function_complexity;
	
	private String date;
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getComplexity() {
		return complexity;
	}
	public void setComplexity(String complexity) {
		this.complexity = complexity;
	}
	public String getClass_complexity() {
		return class_complexity;
	}
	public void setClass_complexity(String class_complexity) {
		this.class_complexity = class_complexity;
	}
	public String getFunction_complexity() {
		return function_complexity;
	}
	public void setFunction_complexity(String function_complexity) {
		this.function_complexity = function_complexity;
	}
	
	

}
