package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

public class BugsVO {

	private String  bugID=null;
	private String bugKey=null;
	private String bugStatus=null;
	public String getBugID() {
		return bugID;
	}
	public void setBugID(String bugID) {
		this.bugID = bugID;
	}
	public String getBugKey() {
		return bugKey;
	}
	public void setBugKey(String bugKey) {
		this.bugKey = bugKey;
	}
	public String getBugStatus() {
		return bugStatus;
	}
	public void setBugStatus(String bugStatus) {
		this.bugStatus = bugStatus;
	}
	
	
	
}
