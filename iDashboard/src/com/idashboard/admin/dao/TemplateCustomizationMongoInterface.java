package com.idashboard.admin.dao;

import java.util.List;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import com.cts.metricsportal.vo.AvailableMetricVO;
import com.idashboard.admin.vo.CustomTemplateVO;

public interface TemplateCustomizationMongoInterface {
	
	public List<CustomTemplateVO> TemplateCustomizaiton_ExecQuery_GetTemplateDetails(String authString);
	public int TemplateCustomizaiton_ExecQuery_GetVerticalData();
	public long TemplateCustomizaiton_ExecQuery_TemplateNameInOperational(String authString, String templateName);
	public int TemplateCustomizaiton_ExecQuery_DeleteTemplateName(String authString, String templateName);
	
	public List<CustomTemplateVO> TemplateCustomizaiton_ExecQuery_GetCustomTemplateView(String authString,String selectedcustomtemplate);
	
	public List<AvailableMetricVO> TemplateCustomizaiton_ExecQuery_GetAvailableMetricList(String authString,boolean jiraMetric,  boolean almMetric);

	public boolean TemplateCustomizaiton_ExecQuery_GetExistTemplateName(String authString,String selectTemplate);
	
	public List<String> TemplateCustomizaiton_ExecQuery_isToolSelectedAlready(String authString);
	
	public int TemplateCustomizaiton_ExecQuery_DeleteUnusedTemplateName(String authString,String templateName);
	
	public int TemplateCustomizaiton_ExecQuery_SaveMetricDetails(String authString,String selectedTemplate,List<String> selectMetrics,  String rollingPeriod,boolean isJiratool,  boolean isAlmtool);
	
	public int TemplateCustomizaiton_ExecQuery_UpdateMetricDetails(String authString,String selectedTemplate,List<String> selectMetrics, String rollingPeriod,boolean isJiratool, boolean isAlmtool);
}
