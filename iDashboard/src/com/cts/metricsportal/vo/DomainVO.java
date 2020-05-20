package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "levelId") 
public class DomainVO {
	
	
	private String level1=null;
	private String level1ID = null;
	private String sourceTool = null;
	private boolean selected ;
	private List<ProjectVO> children = new ArrayList <ProjectVO>();
	
	
	
	
	public String getLevel1() {
		return level1;
	}
	public void setLevel1(String level1) {
		this.level1 = level1;
	}
	public String getLevel1ID() {
		return level1ID;
	}
	public void setLevel1ID(String level1id) {
		level1ID = level1id;
	}
	public List<ProjectVO> getChildren() {
		return children;
	}
	public void setChildren(List<ProjectVO> children) {
		this.children = children;
	}
	public boolean isSelected() {
		return selected;
	}
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	public String getSourceTool() {
		return sourceTool;
	}
	public void setSourceTool(String sourceTool) {
		this.sourceTool = sourceTool;
	}
	
}
