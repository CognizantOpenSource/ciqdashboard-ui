package com.cts.metricsportal.bo;

import java.util.List;

//Deployment Tool Metrics
public interface IDTMetrics {
	
	public boolean authenticate1(String username, String password);
	public long getTotalRunsSuccessCount(String authString, String cookbookName, String dashboardName);
	public long getTotalRunsCountForCookbook(String authString, String cookbookName, String dashboardName);
	public long getTotalReportCount(String authString, String dashboardName);
	public long getTotalRunsCountForCookbookForNode(String nodeName, String cookbookName, String dashboardName);
	public long getTotalRunsSuccessCountForNode(String nodeName, String cookbookName, String dashboardName);
	public List<String> getRecordsRunsCookbookNames(String authString, String dashboardName);
	
	
}
