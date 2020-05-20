package com.cts.metricsportal.vo;

public class ArtifactsCountVO {
	
	private String metrics;
	private int urgent = 0;
	private int veryhigh = 0;
	private int high = 0;
	private int medium = 0;
	private int low = 0;
	private int nopriority = 0;
	
	
	
	public String getMetrics() {
		return metrics;
	}
	public void setMetrics(String metrics) {
		this.metrics = metrics;
	}
	public int getUrgent() {
		return urgent;
	}
	public void setUrgent(int urgent) {
		this.urgent = urgent;
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
	public int getMedium() {
		return medium;
	}
	public void setMedium(int medium) {
		this.medium = medium;
	}
	public int getLow() {
		return low;
	}
	public void setLow(int low) {
		this.low = low;
	}
	public int getNopriority() {
		return nopriority;
	}
	public void setNopriority(int nopriority) {
		this.nopriority = nopriority;
	}
	

	

	
	
}
