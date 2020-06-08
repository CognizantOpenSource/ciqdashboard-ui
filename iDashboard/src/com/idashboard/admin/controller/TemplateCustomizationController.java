package com.idashboard.admin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;




import com.cts.metricsportal.vo.AvailableMetricVO;

import com.idashboard.admin.service.TemplateCustomizationService;
import com.idashboard.admin.serviceImpl.TemplateCustomizationServiceImpl;
import com.idashboard.admin.vo.CustomTemplateVO;

@Path("/templatecustomizationcontroller")
public class TemplateCustomizationController {

	TemplateCustomizationService TemplateCustomizationOperation = new TemplateCustomizationServiceImpl();

	@GET
	@Path("/templateDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CustomTemplateVO> getTemplateDetails(@HeaderParam("Authorization") String authString) {

		List<CustomTemplateVO> templateDetails = new ArrayList<CustomTemplateVO>();
		templateDetails = TemplateCustomizationOperation.GetTemplateDetails(authString);
		return templateDetails;
	}

	@GET
	@Path("/getNumberOfTemplate")
	public int getverticaldata() {
		int count = 0;
		count = TemplateCustomizationOperation.GetVerticalData();
		return count;

	}

	@GET
	@Path("/templateNameInOperational")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public long templateNameInOperational(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) {

		long templateList = 0;
		templateList = TemplateCustomizationOperation.GetTemplateNameInOperational(authString, templateName);
		return templateList;

	}

	@GET
	@Path("/deleteTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteTemplateName(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) {
		int deleted = 0;
		deleted = TemplateCustomizationOperation.DeleteTemplate(authString, templateName);
		return deleted;
	}
	
	@GET
	@Path("/customTemplateView")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CustomTemplateVO> getCustomTemplateView(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedcustomtemplate") String selectedcustomtemplate){
		
		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
		customTemplateList= TemplateCustomizationOperation.GetCustomTemplateView(authString, selectedcustomtemplate);
		return customTemplateList;
		
	}
	
	@GET
	@Path("/metricAvailableList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<AvailableMetricVO> getAvailableMetricList(@HeaderParam("Authorization") String authString,
			@QueryParam("jiraMetric") boolean jiraMetric, @QueryParam("almMetric") boolean almMetric){
		
		List<AvailableMetricVO> availableMetric = null;
		availableMetric = TemplateCustomizationOperation.GetAvailableMetricList(authString, jiraMetric, almMetric);
		return availableMetric;
	}
	
	@POST
	@Path("/existTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean templateName(@HeaderParam("Authorization") String authString,
			@QueryParam("selectTemplate") String selectTemplate) {
		
		boolean exist = false;
		exist = TemplateCustomizationOperation.GetExistTemplateName(authString, selectTemplate);
		return exist;
		
	}
	
	@GET
	@Path("/isToolSelectedAlready")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> isToolSelectedAlready(@HeaderParam("Authorization") String authString){
		List<String> toolslist = null;
		toolslist = TemplateCustomizationOperation.GetisToolSelectedAlready(authString);
		return toolslist;
	}
	
	@GET
	@Path("/deleteUnusedTemplateName")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteUnusedTemplateName(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) {
		
			int count = 0;
			count= TemplateCustomizationOperation.DeleteUnusedTemplateName(authString, templateName);
			return count;
		
	}
	
	@POST
	@Path("/saveMetricDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int saveMetricDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedTemplate") String selectedTemplate,
			@QueryParam("selectMetrics") List<String> selectMetrics, @QueryParam("rollingPeriod") String rollingPeriod,
			@QueryParam("isJiratool") boolean isJiratool, @QueryParam("isAlmtool") boolean isAlmtool) {
	
		int count = 0;
		count= TemplateCustomizationOperation.SaveMetricDetails(authString, selectedTemplate, selectMetrics, rollingPeriod, isJiratool, isAlmtool);
		return count;
	}
	
	@POST
	@Path("/updateMetricDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int updateMetricDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedTemplate") String selectedTemplate,
			@QueryParam("selectMetrics") List<String> selectMetrics, @QueryParam("rollingPeriod") String rollingPeriod,
			@QueryParam("isJiratool") boolean isJiratool, @QueryParam("isAlmtool") boolean isAlmtool) {
		
		int count = 0;
		count= TemplateCustomizationOperation.UpdateMetricDetails(authString, selectedTemplate, selectMetrics, rollingPeriod, isJiratool, isAlmtool);
		return count;
	}

}
