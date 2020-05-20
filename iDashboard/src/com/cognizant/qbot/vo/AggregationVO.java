package com.cognizant.qbot.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class AggregationVO 
{
	@JsonInclude(value=Include.NON_NULL)
	private String operation;
	@JsonInclude(value=Include.NON_NULL)
	private String object;
	@JsonInclude(value=Include.NON_DEFAULT)
	private int number;
	
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public String getObject() {
		return object;
	}
	public void setObject(String object) {
		this.object = object;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	
	
}
