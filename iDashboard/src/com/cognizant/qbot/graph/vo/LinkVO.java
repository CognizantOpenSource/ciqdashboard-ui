package com.cognizant.qbot.graph.vo;

import java.io.Serializable;


public class LinkVO implements Serializable {
	
	private String linkName;
	private String linkFlag = "0";
	
	
	public String getLinkName() {
		return linkName;
	}
	public void setLinkName(String linkName) {
		this.linkName = linkName;
	}
	public String getLinkFlag() {
		return linkFlag;
	}
	public void setLinkFlag(String linkFlag) {
		this.linkFlag = linkFlag;
	}
		

}
