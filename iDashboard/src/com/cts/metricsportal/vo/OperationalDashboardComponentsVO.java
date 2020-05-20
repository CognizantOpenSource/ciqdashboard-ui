package com.cts.metricsportal.vo;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import com.cts.metricsportal.vo.OperationDashboardDetailsVO;

@Document(collection = "operationalDashboards") 
public class OperationalDashboardComponentsVO {	
	
	private List<OperationDashboardDetailsVO> components = null;
	private List<OperationDashboardDetailsVO> releases = null;

	public List<OperationDashboardDetailsVO> getComponents() {
		return components;
	}

	public void setComponents(List<OperationDashboardDetailsVO> components) {
		this.components = components;
	}

	public List<OperationDashboardDetailsVO> getReleases() {
		return releases;
	}

	public void setReleases(List<OperationDashboardDetailsVO> releases) {
		this.releases = releases;
	}

}
