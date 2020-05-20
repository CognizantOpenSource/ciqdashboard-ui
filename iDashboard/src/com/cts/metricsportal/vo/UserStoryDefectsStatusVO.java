package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "JiraUserstorydefects")
public class UserStoryDefectsStatusVO {
	
	private String storyID;
	private String SprintID;
	public String getSprintID() {
		return SprintID;
	}
	public void setSprintID(String sprintID) {
		SprintID = sprintID;
	}
	private String typecount;
	
	public String getTypecount() {
		return typecount;
	}
	public void setTypecount(String typecount) {
		this.typecount = typecount;
	}
	public String getStoryID() {
		return storyID;
	}
	public void setStoryID(String storyID) {
		this.storyID = storyID;
	}
	public String getDefID() {
		return defID;
	}
	public void setDefID(String defID) {
		this.defID = defID;
	}
	public int getDesignercount() {
		return designercount;
	}
	public void setDesignercount(int designercount) {
		this.designercount = designercount;
	}
	private String defID;
	private int designercount;

}
