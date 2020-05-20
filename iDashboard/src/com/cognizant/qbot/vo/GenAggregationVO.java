package com.cognizant.qbot.vo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
@JsonInclude(value=Include.NON_NULL)
public class GenAggregationVO 
{
	private String target;
	private AggregationVO mainAggregation=new AggregationVO();
	private List<AggregationVO> subAggregation=new ArrayList<AggregationVO>();
	
	
	
	public List<AggregationVO> getSubAggregation() {
		return subAggregation;
	}
	public void setSubAggregation(List<AggregationVO> subAggregation) {
		this.subAggregation = subAggregation;
	}
	
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public AggregationVO getMainAggregation() {
		return mainAggregation;
	}
	public void setMainAggregation(AggregationVO mainAggregation) {
		this.mainAggregation = mainAggregation;
	}
	
	
	
	
}
