package com.cts.metricsportal.vo;


public class JiraLifeStatusVO {

	private String sprintName;
	private long vhighCount;
	private long highCount;
	private long mediumCount;
	private long lowCount;
	private long storyCompleted;
	private long totalBug;
	private long resolvedBug;
	private long unresolvedBug;
	
	public JiraLifeStatusVO()
	{
		
	}

	public long getVhighCount() {
		return vhighCount;
	}

	public void setVhighCount(long vhighCount) {
		this.vhighCount = vhighCount;
	}

	public long getHighCount() {
		return highCount;
	}

	public void setHighCount(long highCount) {
		this.highCount = highCount;
	}

	public long getMediumCount() {
		return mediumCount;
	}

	public void setMediumCount(long mediumCount) {
		this.mediumCount = mediumCount;
	}

	public long getLowCount() {
		return lowCount;
	}

	public void setLowCount(long lowCount) {
		this.lowCount = lowCount;
	}

	public String getSprintName() {
		return sprintName;
	}

	public void setSprintName(String sprintName) {
		this.sprintName = sprintName;
	}

	public long getStoryCompleted() {
		return storyCompleted;
	}

	public void setStoryCompleted(long storyCompleted) {
		this.storyCompleted = storyCompleted;
	}

	public long getTotalBug() {
		return totalBug;
	}

	public void setTotalBug(long totalBug) {
		this.totalBug = totalBug;
	}

	public long getResolvedBug() {
		return resolvedBug;
	}

	public void setResolvedBug(long resolvedBug) {
		this.resolvedBug = resolvedBug;
	}

	public long getUnresolvedBug() {
		return unresolvedBug;
	}

	public void setUnresolvedBug(long unresolvedBug) {
		this.unresolvedBug = unresolvedBug;
	}

	
}
