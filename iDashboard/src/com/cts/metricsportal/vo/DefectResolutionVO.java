package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "ALMDefects")
public class DefectResolutionVO {
	private String _id;
	private String severity;
	private Date opendate;
	private Date closeddate;
	private String defrestime;
	private int totSeverityTypecount=0;
	
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getDefrestime() {
		return defrestime;
	}
	public void setDefrestime(String defrestime) {
		this.defrestime = defrestime;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public Date getOpendate() {
		return opendate;
	}
	public void setOpendate(Date opendate) {
		this.opendate = opendate;
	}
	public Date getCloseddate() {
		return closeddate;
	}
	public void setCloseddate(Date closeddate) {
		this.closeddate = closeddate;
	}
	public int getTotSeverityTypecount() {
		return totSeverityTypecount;
	}
	public void setTotSeverityTypecount(int totSeverityTypecount) {
		this.totSeverityTypecount = totSeverityTypecount;
	}
	 
	
}
