package com.idashboard.common.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "toolSelection") 
public class ToolSelectionVO {

	private String userId;
	private String label;
	private String imagePath;
	private String key;
	private String template;
	private int position;

	
	
	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}
	
	

}
