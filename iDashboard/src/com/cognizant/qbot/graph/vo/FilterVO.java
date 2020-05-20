package com.cognizant.qbot.graph.vo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
@JsonInclude(value=Include.NON_NULL)
public class FilterVO implements Comparable,Serializable{
	private String attrName;
	private String attrRelation;
	private Set<String> valueList;
	private Set<String> relationslist=null;
	public int compareTo(Object arg0) {
		// TODO Auto-generated method stub
		return 0;
	}
	public String getAttrName() {
		return attrName;
	}
	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}
	public String getAttrRelation() {
		return attrRelation;
	}
	public void setAttrRelation(String attrRelation) {
		this.attrRelation = attrRelation;
	}
	
	public Set<String> getRelationslist() {
		return relationslist;
	}
	public void setRelationslist(Set<String> relationslist) {
		this.relationslist = relationslist;
	}
	public Set<String> getValueList() {
		return valueList;
	}
	public void setValueList(Set<String> valueList) {
		this.valueList = valueList;
	}
	
	
}
