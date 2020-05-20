package com.cts.metricsportal.vo;


import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "projectiterations") 
public class UserStoriesIterationVO {
	
	String iterationName;
	public String getIterationName() {
		return iterationName;
	}
	public void setIterationName(String iterationName) {
		this.iterationName = iterationName;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	String projectName;
	Date creationDate;
	Date endDate;
	
	
	
	

}
