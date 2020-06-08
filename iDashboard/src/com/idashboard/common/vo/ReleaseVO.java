package com.idashboard.common.vo;

import java.util.ArrayList;
import java.util.List;

public class ReleaseVO {
	
	private String level3;
	private String level3ID;
	

	private int levelId;
	private boolean selected;
	private List <String> children= new ArrayList <String>();

	

	public String getLevel3() {
		return level3;
	}

	public void setLevel3(String level3) {
		this.level3 = level3;
	}

	public String getLevel3ID() {
		return level3ID;
	}

	public void setLevel3ID(String level3id) {
		level3ID = level3id;
	}

	public List<String> getChildren() {
		return children;
	}

	public void setChildren(List<String> children) {
		this.children = children;
	}

	public int getLevelId() {
		return levelId;
	}

	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
}
