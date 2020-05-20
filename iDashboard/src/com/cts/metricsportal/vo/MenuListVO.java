package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "menuItems") 
public class MenuListVO {

	private String name=null;
	private String title=null;
	private int level=0;
	private int order=0;
	private String icon=null;
	private String stateRef=null;
	List<SubMenuVO> subMenu=null;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getStateRef() {
		return stateRef;
	}
	public void setStateRef(String stateRef) {
		this.stateRef = stateRef;
	}
	public List<SubMenuVO> getSubMenu() {
		return subMenu;
	}
	public void setSubMenu(List<SubMenuVO> subMenu) {
		this.subMenu = subMenu;
	}
	 
	
	
	
 }
