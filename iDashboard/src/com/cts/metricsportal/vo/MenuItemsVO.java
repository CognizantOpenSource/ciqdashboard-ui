package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "menuItems") 
public class MenuItemsVO {
	
	private String role=null;
	private String menuType=null;
	List<MenuListVO> menuList =null;
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getMenuType() {
		return menuType;
	}
	public void setMenuType(String menuType) {
		this.menuType = menuType;
	}
	public List<MenuListVO> getMenuList() {
		return menuList;
	}
	public void setMenuList(List<MenuListVO> menuList) {
		this.menuList = menuList;
	}
	 
	

}
