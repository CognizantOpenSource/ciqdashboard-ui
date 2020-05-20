package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "kpiTemplate")

public class KpiTemplateVO {

	private String relName;
	private List<KpiSelectedMetricVO> selectedMetric;
	
	public String getRelName() {
		return relName;
	}
	public void setRelName(String relName) {
		this.relName = relName;
	}
	public List<KpiSelectedMetricVO> getSelectedMetric() {
		return selectedMetric;
	}
	public void setSelectedMetric(List<KpiSelectedMetricVO> selectedMetric) {
		this.selectedMetric = selectedMetric;
	}
	
	
	
}
