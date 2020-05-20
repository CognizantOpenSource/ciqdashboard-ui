package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "ALMSource") 
public class ALMdetailsVO {
	 

	 private String  instanceName=null;
	 private String  serverUrl=null;
	 private String  userId=null;
	 private String  password=null;
	 private List<DomainProjectVO> selectedFields= null;
     public String getInstanceName() {
		return instanceName;
	}
	public void setInstanceName(String instanceName) {
		this.instanceName = instanceName;
	}
	public String getServerUrl() {
		return serverUrl;
	}
	public void setServerUrl(String serverUrl) {
		this.serverUrl = serverUrl;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public List<DomainProjectVO> getSelectedFields() {
		return selectedFields;
	}
	public void setSelectedFields(List<DomainProjectVO> selectedFields) {
		this.selectedFields = selectedFields;
	}
	
	
	
}

