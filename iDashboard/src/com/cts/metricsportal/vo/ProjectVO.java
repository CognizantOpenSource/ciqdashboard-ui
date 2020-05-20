package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

public class ProjectVO {
	
	private String level2=null;
	private String level2ID = null;
	
	
	
	private boolean selected;
	private List<ReleaseVO> children = new ArrayList <ReleaseVO>();
	
	
	
	public String getLevel2() {
		return level2;
	}
	public void setLevel2(String level2) {
		this.level2 = level2;
	}
	public String getLevel2ID() {
		return level2ID;
	}
	public void setLevel2ID(String level2id) {
		level2ID = level2id;
	}
	public List<ReleaseVO> getChildren() {
		return children;
	}
	public void setChildren(List<ReleaseVO> children) {
		this.children = children;
	}
	public boolean isSelected() {
		return selected;
	}
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
	
	
	

	
}
