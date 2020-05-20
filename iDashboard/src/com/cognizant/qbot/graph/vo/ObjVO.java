package com.cognizant.qbot.graph.vo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
@JsonInclude(value=Include.NON_NULL)
public class ObjVO implements Comparable,Serializable{
	private String primKey;	
	
	@JsonInclude(value=Include.NON_NULL)
	private List<AttributeVO> attrVOList = null;
	private List<AttributeVO> attrNameList = null;
	private List<AttributeVO> grpableAttrVOList = null;
	
	@JsonInclude(value=Include.NON_NULL)
	private HashMap<String,List<LinkVO>> InobjRelList = null;
	@JsonInclude(value=Include.NON_NULL)
	private HashMap<String,List<LinkVO>> OutobjRelList = null;
	
	
	private List<String> relationslist=null;
	private int objRank;
	
	 @JsonInclude(Include.NON_EMPTY)
	private String primValue = "";
	
	private List<String> objLinks;
	private List<AttributeVO> attrFilterList = null;
	private int objweight=0;
	
		
	public int getObjRank() {
		return objRank;
	}
	
	public void setObjRank(int objRank) {
		this.objRank = objRank;
	}
		
	public String getPrimKey() {
		return primKey;
	}
	public void setPrimKey(String primKey) {
		this.primKey = primKey;
	}
	public List<AttributeVO> getAttrVOList() {
		return attrVOList;
	}
	public void setAttrVOList(List<AttributeVO> attrVOList) {
		this.attrVOList = attrVOList;
	}
		
	public int compareTo(Object compareObj) {		
		// TODO Auto-generated method stub
		int compareRank=((ObjVO)compareObj).objRank;
        /* For Ascending order*/
        return compareRank - this.objRank;
		
	}
	

	

	public String getPrimValue() {
		return primValue;
	}

	public void setPrimValue(String primValue) {
		this.primValue = primValue;
	}
	
	public List<String> getObjLinks() {
		return objLinks;
	}

	public void setObjLinks(List<String> objLinks) {
		this.objLinks = objLinks;
	}

	public List<AttributeVO> getAttrFilterList() {
		return attrFilterList;
	}

	public void setAttrFilterList(List<AttributeVO> attrFilterList) {
		this.attrFilterList = attrFilterList;
	}

	public List<AttributeVO> getGrpableAttrVOList() {
		return grpableAttrVOList;
	}

	public void setGrpableAttrVOList(List<AttributeVO> grpableAttrVOList) {
		this.grpableAttrVOList = grpableAttrVOList;
	}

	public HashMap<String,List<LinkVO>> getOutobjRelList() {
		return OutobjRelList;
	}

	public void setOutobjRelList(HashMap<String,List<LinkVO>> outobjRelList) {
		OutobjRelList = outobjRelList;
	}
	
	public HashMap<String, List<LinkVO>> getInobjRelList() {
		return InobjRelList;
	}

	public void setInobjRelList(HashMap<String, List<LinkVO>> inobjRelList) {
		InobjRelList = inobjRelList;
	}

	public int getObjweight() {
		return objweight;
	}

	public void setObjweight(int objweight) {
		this.objweight = objweight;
	}

	public List<String> getRelationslist() {
		return relationslist;
	}

	public void setRelationslist(List<String> relationslist) {
		this.relationslist = relationslist;
	}

	public List<AttributeVO> getAttrNameList() {
		return attrNameList;
	}

	public void setAttrNameList(List<AttributeVO> attrNameList) {
		this.attrNameList = attrNameList;
	}

}
