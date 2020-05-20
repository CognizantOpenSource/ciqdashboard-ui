package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "Defects") 
public class DefectAgingVO {

	private String opendate;
	private int urgent;
	private int low;
	private int high;
	private int medium;
	private int veryhigh;
	public String getOpendate() {
		return opendate;
	}
	public void setOpendate(String opendate) {
		this.opendate = opendate;
	}
	public int getUrgent() {
		return urgent;
	}
	public void setUrgent(int urgent) {
		this.urgent = urgent;
	}
	public int getLow() {
		return low;
	}
	public void setLow(int low) {
		this.low = low;
	}
	public int getMedium() {
		return medium;
	}
	public void setMedium(int medium) {
		this.medium = medium;
	}
	public int getVeryhigh() {
		return veryhigh;
	}
	public void setVeryhigh(int veryhigh) {
		this.veryhigh = veryhigh;
	}
	public int getHigh() {
		return high;
	}
	public void setHigh(int high) {
		this.high = high;
	}

	
}
