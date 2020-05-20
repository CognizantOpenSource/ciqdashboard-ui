package com.cognizant.qbot.vo;

import java.util.List;



public class AttrDistributionVO {
	
	private String distributionType;
	private List<AttributeVO> attributeVOList = null;
	
	public String getDistributionType() {
		return distributionType;
	}
	public void setDistributionType(String distributionType) {
		this.distributionType = distributionType;
	}
	public List<AttributeVO> getAttributeVOList() {
		return attributeVOList;
	}
	public void setAttributeVOList(List<AttributeVO> attributeVOList) {
		this.attributeVOList = attributeVOList;
	}
		
	

}
