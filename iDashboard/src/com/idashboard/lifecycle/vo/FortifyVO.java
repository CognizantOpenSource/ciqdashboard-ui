package com.idashboard.lifecycle.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "LCfortifyDetails") 
public class FortifyVO {

	private String  projectName=null;
	private String projectDescription=null;
	private Date creationDate;
	List <FortifyVersionsVO> versions = new ArrayList<FortifyVersionsVO>();
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getProjectDescription() {
		return projectDescription;
	}
	public void setProjectDescription(String projectDescription) {
		this.projectDescription = projectDescription;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public List<FortifyVersionsVO> getVersions() {
		return versions;
	}
	public void setVersions(List<FortifyVersionsVO> versions) {
		this.versions = versions;
	}
	
}
