package com.idashboard.common.vo;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "levelId") 
public class LevelItemsVO {
	
	String level1=null;
	String level2=null;
	String level3=null;
	int levelId;
	private String _id;
	
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getLevel1() {
		return level1;
	}
	public void setLevel1(String level1) {
		this.level1 = level1;
	}
	public String getLevel2() {
		return level2;
	}
	public void setLevel2(String level2) {
		this.level2 = level2;
	}
	public String getLevel3() {
		return level3;
	}
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}
	public void setLevel3(String level3) {
		this.level3 = level3;
	}
	
		
}
