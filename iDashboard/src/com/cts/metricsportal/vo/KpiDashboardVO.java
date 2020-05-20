package com.cts.metricsportal.vo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "kpiDashboards") 
public class KpiDashboardVO {
	private String _id=null;
	private String relName=null;
	private List<String> products=null;
	private String owner=null;
	
	private Date createdDate=null;
	
	private Date fromDates;
	private Date toDates;
	private boolean ispublic=false;
	private List<KpiSelectedMetricVO> selectedMetric;
	
	
	public Date getfromDates() {
		return fromDates;
	}
	public void setfromDates(Date fromDates) {
		this.fromDates = fromDates;
	}
	public Date gettoDates() {
		return toDates;
	}
	public void settoDates(Date toDates) {
		this.toDates = toDates;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getRelName() {
		return relName;
	}
	public void setRelName(String relName) {
		this.relName = relName;
	}
	public List<String> getProducts() {
		return products;
	}
	public void setProducts(List<String> products) {
		this.products = products;
	}
	public List<KpiSelectedMetricVO> getSelectedMetric() {
		return selectedMetric;
	}
	public void setSelectedMetric(List<KpiSelectedMetricVO> selectedMetric) {
		this.selectedMetric = selectedMetric;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public boolean isIspublic() {
		return ispublic;
	}
	public void setIspublic(boolean ispublic) {
		this.ispublic = ispublic;
	}
	
}
