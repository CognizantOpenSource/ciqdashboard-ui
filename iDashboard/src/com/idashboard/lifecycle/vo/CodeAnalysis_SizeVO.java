package com.idashboard.lifecycle.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCsonarCodeQual")
public class CodeAnalysis_SizeVO {
	
	private String files;
	private String classes;
	private String functions;
	private String lines;
	
	private String date;
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getFiles() {
		return files;
	}
	public void setFiles(String files) {
		this.files = files;
	}
	public String getClasses() {
		return classes;
	}
	public void setClasses(String classes) {
		this.classes = classes;
	}
	public String getFunctions() {
		return functions;
	}
	public void setFunctions(String functions) {
		this.functions = functions;
	}
	public String getLines() {
		return lines;
	}
	public void setLines(String lines) {
		this.lines = lines;
	}
	
	
	
}
