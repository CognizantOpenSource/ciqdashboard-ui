package com.cts.metricsportal.vo;

public class OctaneDataVO {

	private String sprintName;
	private String sprintId;
	private long storyCompleted;
	private long storyInprogress;
	private long storyTodo;
	private long plannedStorypoint;
	private long completedStorypoint;
	private long investedHours;
	private long defUrgent;
	private long defVery;
	private long defHigh;
	private long defMedium;
	private long defLow;
	
	private long priorUrgent;
	private long priorVhigh;
	private long priorHigh;
	
	public String getSprintName() {
		return sprintName;
	}
	public void setSprintName(String sprintName) {
		this.sprintName = sprintName;
	}
	public String getSprintId() {
		return sprintId;
	}
	public void setSprintId(String sprintId) {
		this.sprintId = sprintId;
	}
	public long getStoryCompleted() {
		return storyCompleted;
	}
	public void setStoryCompleted(long storyCompleted) {
		this.storyCompleted = storyCompleted;
	}
	public long getStoryInprogress() {
		return storyInprogress;
	}
	public void setStoryInprogress(long storyInprogress) {
		this.storyInprogress = storyInprogress;
	}
	public long getStoryTodo() {
		return storyTodo;
	}
	public void setStoryTodo(long storyTodo) {
		this.storyTodo = storyTodo;
	}
	public long getCompletedStorypoint() {
		return completedStorypoint;
	}
	public void setCompletedStorypoint(long completedStorypoint) {
		this.completedStorypoint = completedStorypoint;
	}
	public long getPlannedStorypoint() {
		return plannedStorypoint;
	}
	public void setPlannedStorypoint(long plannedStorypoint) {
		this.plannedStorypoint = plannedStorypoint;
	}
	public long getInvestedHours() {
		return investedHours;
	}
	public void setInvestedHours(long investedHours) {
		this.investedHours = investedHours;
	}
	public long getDefUrgent() {
		return defUrgent;
	}
	public void setDefUrgent(long defUrgent) {
		this.defUrgent = defUrgent;
	}
	public long getDefVery() {
		return defVery;
	}
	public void setDefVery(long defVery) {
		this.defVery = defVery;
	}
	public long getDefMedium() {
		return defMedium;
	}
	public void setDefMedium(long defMedium) {
		this.defMedium = defMedium;
	}
	public long getDefHigh() {
		return defHigh;
	}
	public void setDefHigh(long defHigh) {
		this.defHigh = defHigh;
	}
	public long getDefLow() {
		return defLow;
	}
	public void setDefLow(long defLow) {
		this.defLow = defLow;
	}
	public long getPriorUrgent() {
		return priorUrgent;
	}
	public void setPriorUrgent(long priorUrgent) {
		this.priorUrgent = priorUrgent;
	}
	
	public long getPriorHigh() {
		return priorHigh;
	}
	public void setPriorHigh(long priorHigh) {
		this.priorHigh = priorHigh;
	}
	public long getPriorVhigh() {
		return priorVhigh;
	}
	public void setPriorVhigh(long priorVhigh) {
		this.priorVhigh = priorVhigh;
	}
	
}
