package com.cognizant.qbot.vo;

import java.util.List;

public class DependencyVO 
{
	private String target;
	private String givenSentence;
	private List<AggregationVO> mainAggregation;
	private List<AggregationVO> subAggregation;
	private List<String> otherNoun;
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public String getGivenSentence() {
		return givenSentence;
	}
	public void setGivenSentence(String givenSentence) {
		this.givenSentence = givenSentence;
	}
	public List<String> getOtherNoun() {
		return otherNoun;
	}
	public void setOtherNoun(List<String> otherNoun) {
		this.otherNoun = otherNoun;
	}
	public List<AggregationVO> getSubAggregation() {
		return subAggregation;
	}
	public void setSubAggregation(List<AggregationVO> subAggregation) {
		this.subAggregation = subAggregation;
	}
	public List<AggregationVO> getMainAggregation() {
		return mainAggregation;
	}
	public void setMainAggregation(List<AggregationVO> mainAggregation) {
		this.mainAggregation = mainAggregation;
	}
	
	
}
