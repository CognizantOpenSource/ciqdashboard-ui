package com.cognizant.qbot.graph.vo;

import java.io.Serializable;
import java.util.List;
import java.util.Set;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;


public class AttributeVO implements Serializable{
	private String attrName;
	private boolean isGroupable;
	private String attrRelation;
	
	@JsonInclude(value=Include.NON_NULL)
	private Set<String> valueList;
	
	 @JsonInclude(Include.NON_EMPTY)
	private String attrValue = "";
	private String attrFlag = "0";
	private String weightFlag = "0";
	private String ValFlag = "0";
	public String getAttrName() {
		return attrName;
	}	
	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}
		
	
	public Set<String> getValueList() {
		return valueList;
	}
	public void setValueList(Set<String> valueList) {
		this.valueList = valueList;
	}
	public String getAttrValue() {
		return attrValue;
	}
	public void setAttrValue(String attrValue) {
		this.attrValue = attrValue;
	}
	public String getAttrFlag() {
		return attrFlag;
	}
	public void setAttrFlag(String attrFlag) {
		this.attrFlag = attrFlag;
	}
	public boolean isGroupable() {
		return isGroupable;
	}
	public void setGroupable(boolean isGroupable) {
		this.isGroupable = isGroupable;
	}
	public String getAttrRelation() {
		return attrRelation;
	}
	public void setAttrRelation(String attrRelation) {
		this.attrRelation = attrRelation;
	}
	public String getWeightFlag() {
		return weightFlag;
	}
	public void setWeightFlag(String weightFlag) {
		this.weightFlag = weightFlag;
	}
	public String getValFlag() {
		return ValFlag;
	}
	public void setValFlag(String valFlag) {
		ValFlag = valFlag;
	}
	
	
	

}
