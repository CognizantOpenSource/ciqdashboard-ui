package com.cognizant.qbot.service;

import java.util.ArrayList;
import java.util.List;

public class DictionaryVO {
	
	private String id;
	private String text;
	private String obj;	
	private String attrname;
	private String relname;
	private boolean groupable;
	private String userdefrelation;
	private String defattr;
	private String mapobj;
	private String maprel;
	private String attrtoobj;
	private String attvals;
	private String outrel;
	private String outrelobj;
	private String relation;
	private String aliasval;
	private String aliastype;
	private String aliasoftype;
	
	
	
	public String getId() {
		return id;
	}
	public String getUserdefrelation() {
		return userdefrelation;
	}
	public void setUserdefrelation(String userdefrelation) {
		this.userdefrelation = userdefrelation;
	}
	public String getDefattr() {
		return defattr;
	}
	public void setDefattr(String defattr) {
		this.defattr = defattr;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getObj() {
		return obj;
	}
	public void setObj(String obj) {
		this.obj = obj;
	}
	
	
	
	public String getMapobj() {
		return mapobj;
	}
	public void setMapobj(String mapobj) {
		this.mapobj = mapobj;
	}
	public String getMaprel() {
		return maprel;
	}
	public void setMaprel(String maprel) {
		this.maprel = maprel;
	}
	public String getAttrtoobj() {
		return attrtoobj;
	}
	public void setAttrtoobj(String attrtoobj) {
		this.attrtoobj = attrtoobj;
	}
	public String getAttvals() {
		return attvals;
	}
	public boolean isGroupable() {
		return groupable;
	}
	public void setGroupable(boolean groupable) {
		this.groupable = groupable;
	}
	public void setAttvals(String attvals) {
		this.attvals = attvals;
	}
	public String getAttrname() {
		return attrname;
	}
	public void setAttrname(String attrname) {
		this.attrname = attrname;
	}
	public String getRelname() {
		return relname;
	}
	public void setRelname(String relname) {
		this.relname = relname;
	}
	
	
	public String getOutrel() {
		return outrel;
	}
	public void setOutrel(String outrel) {
		this.outrel = outrel;
	}
	public String getOutrelobj() {
		return outrelobj;
	}
	public void setOutrelobj(String outrelobj) {
		this.outrelobj = outrelobj;
	}
	public String getRelation() {
		return relation;
	}
	public void setRelation(String relation) {
		this.relation = relation;
	}
	public String getAliasval() {
		return aliasval;
	}
	public void setAliasval(String aliasval) {
		this.aliasval = aliasval;
	}
	public String getAliastype() {
		return aliastype;
	}
	public void setAliastype(String aliastype) {
		this.aliastype = aliastype;
	}
	public String getAliasoftype() {
		return aliasoftype;
	}
	public void setAliasoftype(String aliasoftype) {
		this.aliasoftype = aliasoftype;
	}

	

}
