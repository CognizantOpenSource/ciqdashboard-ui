package com.idashboard.admin.service;

import java.util.List;

import com.cts.metricsportal.vo.AvailableMetricVO;
import com.idashboard.admin.vo.CustomTemplateVO;

public interface TemplateCustomizationService {
		
	public List<CustomTemplateVO> GetTemplateDetails(String authString);
	public int GetVerticalData();
	
	public long GetTemplateNameInOperational(String authString, String templateName);
	public int DeleteTemplate(String authString, String templateName);
	
	public List<CustomTemplateVO> GetCustomTemplateView(String authString,String selectedcustomtemplate);
	
	public List<AvailableMetricVO> GetAvailableMetricList(String authString,boolean jiraMetric,  boolean almMetric);
	
	public boolean GetExistTemplateName(String authString,String selectTemplate);
	
	public List<String> GetisToolSelectedAlready(String authString);
	
	public int DeleteUnusedTemplateName(String authString, String templateName); 
	
	public int SaveMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool);
	
	public int UpdateMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool);
		
}


