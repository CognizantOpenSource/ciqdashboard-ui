package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "operationalDashboards") 
public class OperationalDashboardVO {
	
	private String _id=null;
	private String dashboardName=null;
	private String description=null;
	private String templateName=null;
	private boolean ispublic=false;
	private Date createddate;
	private Date modifieddate;
	
	private List<OperationalDashboardsProjectsVO> projects = new ArrayList<OperationalDashboardsProjectsVO>();
	private List<OperationalDashboardsSprintsVO> sprints = new ArrayList<OperationalDashboardsSprintsVO>();
	private List<OperationalDashboardsEpicsVO> epics = new ArrayList<OperationalDashboardsEpicsVO>();

	private List<OperationalDashboardsVersionsVO> versions = new ArrayList<OperationalDashboardsVersionsVO>();
	private List<OperationalDashboardsCyclesVO> cycles = new ArrayList<OperationalDashboardsCyclesVO>();
	private List<OperationalDashboardsTestRunsVO> testruns = new ArrayList<OperationalDashboardsTestRunsVO>();
	
	// Levis Columns
	
	public Date getCreateddate() {
		return createddate;
	}
	public void setCreateddate(Date createddate) {
		this.createddate = createddate;
	}
	public Date getModifieddate() {
		return modifieddate;
	}
	public void setModifieddate(Date modifieddate) {
		this.modifieddate = modifieddate;
	}
	
	
	
	public List<OperationalDashboardsTestRunsVO> getTestruns() {
		return testruns;
	}
	public void setTestruns(List<OperationalDashboardsTestRunsVO> testruns) {
		this.testruns = testruns;
	}
	public List<OperationalDashboardsProjectsVO> getProjects() {
		return projects;
	}
	public void setProjects(List<OperationalDashboardsProjectsVO> projects) {
		this.projects = projects;
	}
	public List<OperationalDashboardsSprintsVO> getSprints() {
		return sprints;
	}
	public void setSprints(List<OperationalDashboardsSprintsVO> sprints) {
		this.sprints = sprints;
	}
	public List<OperationalDashboardsEpicsVO> getEpics() {
		return epics;
	}
	public void setEpics(List<OperationalDashboardsEpicsVO> epics) {
		this.epics = epics;
	}
	public List<OperationalDashboardsVersionsVO> getVersions() {
		return versions;
	}
	public void setVersions(List<OperationalDashboardsVersionsVO> versions) {
		this.versions = versions;
	}
	public List<OperationalDashboardsCyclesVO> getCycles() {
		return cycles;
	}
	public void setCycles(List<OperationalDashboardsCyclesVO> cycles) {
		this.cycles = cycles;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	private String owner=null;	 
	
	private List<OperationDashboardDetailsVO> releaseSet=new ArrayList<OperationDashboardDetailsVO>();
	
	private List<OperationalDashboardComponentsVO> component = null;
	private OperationalDashboardComponentsVO releases = null;
	
	public String getDashboardName() {
		return dashboardName;
	}
	public void setDashboardName(String dashboardName) {
		this.dashboardName = dashboardName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public List<OperationalDashboardComponentsVO> getComponent() {
		return component;
	}
	public void setComponent(List<OperationalDashboardComponentsVO> component) {
		this.component = component;
	}
	
	public OperationalDashboardComponentsVO getReleases() {
		return releases;
	}
	public void setReleases(OperationalDashboardComponentsVO releases) {
		this.releases = releases;
	}
	public List<OperationDashboardDetailsVO> getReleaseSet() {
		return releaseSet;
	}
	public void setReleaseSet(List<OperationDashboardDetailsVO> releaseSet) {
		this.releaseSet = releaseSet;
	}
	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	
	public boolean isIspublic() {
		return ispublic;
	}
	public void setIspublic(boolean ispublic) {
		this.ispublic = ispublic;
	}
	
}
