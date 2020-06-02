package com.idashboard.lifecycle.vo;

import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "LCjenkinsBuild") 
public class BuildJobsVO {
	
	private String jobName;
	private String joburl;
	
	private List<BuildListVO> builds= new ArrayList<BuildListVO>();
	
	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}
	
	public String getJoburl() {
		return joburl;
	}

	public void setJoburl(String joburl) {
		this.joburl = joburl;
	}
	
	public List<BuildListVO> getBuildList() {
		return builds;
	}

	public void setBuildList(List<BuildListVO> buildList) {
		this.builds = buildList;
	}
	

}
