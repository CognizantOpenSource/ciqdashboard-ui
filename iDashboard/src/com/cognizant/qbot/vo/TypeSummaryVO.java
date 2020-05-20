package com.cognizant.qbot.vo;

import java.util.List;



public class TypeSummaryVO {

	private String type;
	List<DistributionVO> distributionVOList = null;
	
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<DistributionVO> getDistributionVOList() {
		return distributionVOList;
	}
	public void setDistributionVOList(List<DistributionVO> distributionVOList) {
		this.distributionVOList = distributionVOList;
	}

}
