package com.idashboard.admin.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.AvailableMetricVO;
import com.idashboard.admin.daoImpl.TemplateCustomizationMongoInterfaceImpl;
import com.idashboard.admin.service.TemplateCustomizationService;
import com.idashboard.admin.vo.CustomTemplateVO;

public class TemplateCustomizationServiceImpl implements TemplateCustomizationService {

	TemplateCustomizationMongoInterfaceImpl TemplateOperation = new TemplateCustomizationMongoInterfaceImpl();

	@Override
	public List<CustomTemplateVO> GetTemplateDetails(String authString) {

		List<CustomTemplateVO> templateDetails = new ArrayList<CustomTemplateVO>();
		templateDetails = TemplateOperation.TemplateCustomizaiton_ExecQuery_GetTemplateDetails(authString);
		return templateDetails;

	}

	@Override
	public int GetVerticalData() {
		int verticallist = 0;
		verticallist = TemplateOperation.TemplateCustomizaiton_ExecQuery_GetVerticalData();
		return verticallist;

	}

	@Override
	public long GetTemplateNameInOperational(String authString, String templateName) {
		long templatelist = 0;
		templatelist = TemplateOperation.TemplateCustomizaiton_ExecQuery_TemplateNameInOperational(authString, templateName);
		return templatelist;

	}
	
	@Override
	public int DeleteTemplate(String authString, String templateName) {
		
		int count=0;
		count=TemplateOperation.TemplateCustomizaiton_ExecQuery_DeleteTemplateName(authString, templateName);
		return count;
	}
	
	@Override
	public List<CustomTemplateVO> GetCustomTemplateView(String authString,String selectedcustomtemplate){
		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
		customTemplateList=TemplateOperation.TemplateCustomizaiton_ExecQuery_GetCustomTemplateView(authString, selectedcustomtemplate);
		return customTemplateList;
	}
	
	@Override
	public List<AvailableMetricVO> GetAvailableMetricList(String authString,boolean jiraMetric,  boolean almMetric){
		
		List<AvailableMetricVO> availableMetric = null;
		availableMetric = TemplateOperation.TemplateCustomizaiton_ExecQuery_GetAvailableMetricList(authString, jiraMetric, almMetric);
		return availableMetric;
	}
	
	@Override
	public boolean GetExistTemplateName(String authString,String selectTemplate) {
		boolean exist = false;
		exist = TemplateOperation.TemplateCustomizaiton_ExecQuery_GetExistTemplateName(authString, selectTemplate);
		return exist;
	}
	
	@Override
	public List<String> GetisToolSelectedAlready(String authString){
		List<String> toolslist = null;
		toolslist = TemplateOperation.TemplateCustomizaiton_ExecQuery_isToolSelectedAlready(authString);
		return toolslist;
	}
	
	@Override
	public int DeleteUnusedTemplateName(String authString, String templateName) {
		int count = 0;
		count= TemplateOperation.TemplateCustomizaiton_ExecQuery_DeleteUnusedTemplateName(authString, templateName);
		return count;
	}
	
	@Override
	public int SaveMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool) {
		
		int count = 0;
		count= TemplateOperation.TemplateCustomizaiton_ExecQuery_SaveMetricDetails(authString, selectedTemplate, selectMetrics, rollingPeriod, isJiratool, isAlmtool);
		return count;
	}
	
	@Override
	public int UpdateMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool) {
		
		int count = 0;
		count= TemplateOperation.TemplateCustomizaiton_ExecQuery_UpdateMetricDetails(authString, selectedTemplate, selectMetrics, rollingPeriod, isJiratool, isAlmtool);
		return count;
	}
	

}
