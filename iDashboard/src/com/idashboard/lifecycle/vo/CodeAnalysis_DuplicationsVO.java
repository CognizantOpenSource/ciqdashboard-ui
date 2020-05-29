package com.idashboard.lifecycle.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCsonarCodeQual")
public class CodeAnalysis_DuplicationsVO {
	
	private String duplicated_files;
	private String duplicated_lines;
	
	private String date;
	private String new_duplicated_lines;
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getNew_duplicated_lines() {
		return new_duplicated_lines;
	}
	public void setNew_duplicated_lines(String new_duplicated_lines) {
		this.new_duplicated_lines = new_duplicated_lines;
	}
	public String getDuplicated_files() {
		return duplicated_files;
	}
	public void setDuplicated_files(String duplicated_files) {
		this.duplicated_files = duplicated_files;
	}
	public String getDuplicated_lines() {
		return duplicated_lines;
	}
	public void setDuplicated_lines(String duplicated_lines) {
		this.duplicated_lines = duplicated_lines;
	}
	
	

}
