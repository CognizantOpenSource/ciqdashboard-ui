package com.cognizant.qbot.vo;

import java.util.List;


public class DistributionVO {
	
	
	private String categoryType;
	private List<AttrDistributionVO> categoryVOList = null;
	private String chartType;
	public String getChartType() {
		return chartType;
	}
	public void setChartType(String chartType) {
		this.chartType = chartType;
	}
	public String getCategoryType() {
		return categoryType;
	}
	public void setCategoryType(String categoryType) {
		this.categoryType = categoryType;
	}
	public List<AttrDistributionVO> getCategoryVOList() {
		return categoryVOList;
	}
	public void setCategoryVOList(List<AttrDistributionVO> categoryVOList) {
		this.categoryVOList = categoryVOList;
	}

	

	

	
	

	
	

}
