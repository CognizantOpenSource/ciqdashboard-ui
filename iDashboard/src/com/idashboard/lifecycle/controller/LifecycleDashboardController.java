package com.idashboard.lifecycle.controller;

import java.io.IOException;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.KpiDashboardVO;
import com.cts.metricsportal.vo.KpiMetricListVO;
import com.cts.metricsportal.vo.LCDashboardVO;
import com.cts.metricsportal.vo.ViewProductDetailsVO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idashboard.lifecycle.service.LifecycleDashboardService;
import com.idashboard.lifecycle.serviceImpl.LifecycleDashboardServiceImpl;

public class LifecycleDashboardController {
	
	LifecycleDashboardService lcDashService = new LifecycleDashboardServiceImpl();

	@POST
	@Path("/saveDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveDashboard(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("description") String description,
			@QueryParam("components") String dashboardComponent) throws Exception {
		 
		return lcDashService.saveDashboard(authString, dashboardName, description, dashboardComponent);
		
		

	}

	/* Create New Dashboard or Update */
	
	@POST
	@Path("/saveProductDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveproddash(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products)throws Exception {
		
			return lcDashService.saveProdDash(authString, relName, products);
		

	}

	@GET
	@Path("/getKpiMetricList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<KpiMetricListVO> getKpiMetricList(@HeaderParam("Authorization") String authString)
		throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
		BadLocationException {
		
		return lcDashService.getKpiMetricList(authString);
		

	}

	/* Create New KPI Dashboard or Update */
	@POST
	@Path("/saveKpiDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveKpiDashboard(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products, @QueryParam("fromDate") String fromDate,
			@QueryParam("toDate") String toDate, @QueryParam("ispublic") boolean ispublic,
			@QueryParam("selectKpiItems") List<String> selectedKpiItems) throws Exception {
		
			return lcDashService.saveKpiDashboard(authString, relName, products, fromDate, toDate, ispublic, selectedKpiItems);
		

	}

	/* Update Dashboard or Update */
	@POST
	@Path("/updateProductDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateproddash(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("ispublic") String ispublic, @QueryParam("products") List<String> products) throws Exception {
		
		return lcDashService.updateproddash(authString, relName, ispublic, products);

	}

	/* Update KPI Dashboard or Update */
	
	@POST
	@Path("/updateKpiDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateKpiDash(@HeaderParam("Authorization") String authString,
			@QueryParam("oldRelName") String oldRelName, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products, @QueryParam("fromDate") String fromDate,
			@QueryParam("ispublic") boolean ispublic, @QueryParam("toDate") String toDate) throws Exception {
		
		return lcDashService.updateKpiDash(authString, oldRelName, relName, products, fromDate, ispublic, toDate);
		

	}

	/* Updating Dashbaord */
	@POST
	@Path("/updateDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateDashboard(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("_id") String id,
			@QueryParam("description") String description, @QueryParam("ispublic") boolean ispublic,
			@QueryParam("components") String dashboardComponent) throws Exception {
		
			// JSON from String to Object
			return lcDashService.updateDashboard(authString, dashboardName, authString, description, ispublic, dashboardComponent);
		
	}

	/* Deleting User */
	
	@GET
	@Path("/deleteDashboardInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteDashboardInfo(@HeaderParam("Authorization") String authString, @QueryParam("id") String id,
			@QueryParam("dashboardName") String dashboardName) throws Exception {
		
			// Remove release dashboard if exists without any products
		return lcDashService.deleteDashboardInfo(authString, id, dashboardName);
		
	}

	/* Lifecycle Dashboard Table Details */

	@GET
	@Path("/lifecycleDashboardDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LCDashboardVO> getTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		return lcDashService.getTableDetails(authString, itemsPerPage, start_index);
		
			
		

	}

	@GET
	@Path("/lifecycleDashboardpublicDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LCDashboardVO> getTablepublicDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		
		return lcDashService.getTablepublicDetails(authString, itemsPerPage, start_index);
		
			

	}

	
	@GET
	@Path("/DashboardDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
		return lcDashService.dashboardTableRecordsCount(authString); 
	}

	@GET
	@Path("/kpiDetailspulicCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long kpiTablepulicRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		 
		return lcDashService.kpiTablepulicRecordsCount(authString);
		
		
	}

	

	@GET
	@Path("/kpiDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long kpiTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
			return lcDashService.kpiTableRecordsCount(authString);
			 
		
	}

	

	@GET
	@Path("/DashboardDetailspulicCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTablepulicRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
			return lcDashService.dashboardTablepulicRecordsCount(authString);
		
	}

	

	@GET
	@Path("/kpipublicDashboardTable")
	@Produces(MediaType.APPLICATION_JSON)
	public List<KpiDashboardVO> getKpipublicTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		return lcDashService.getKpipublicTableDetails(authString);
	}

	
	@GET
	@Path("/productTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ViewProductDetailsVO> getproductTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		
			return lcDashService.getproductTableDetails(authString);
		
	}


	@GET
	@Path("/getRelStartDate")
	@Produces(MediaType.TEXT_XML)
	public String getRelStartDate(@HeaderParam("Authorization") String authString,
		@QueryParam("selected") String selected)
		throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
			return lcDashService.getRelStartDate(authString, selected);
		
	}

	
	@GET
	@Path("/getispublic")
	@Produces(MediaType.TEXT_PLAIN)
	public String getispublic(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
			 return lcDashService.getispublic(authString, selected);
		
	}

	@GET
	@Path("/getRelEndDate")
	@Produces(MediaType.TEXT_XML)
	public String getRelEndDate(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
		return lcDashService.getRelEndDate(authString, selected);
		
	}

	
	@GET
	@Path("/updateProductTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ViewProductDetailsVO> updateproductTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException{
		
		return lcDashService.updateproductTableDetails(authString, selected);
		 
		 
	}

	
	@GET
	@Path("/updateProdTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getUpdateProdTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		return lcDashService.getUpdateProdTableDetails(authString, selected);

	}

	
	@GET
	@Path("/updateKpiTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getUpdateKpiTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		return lcDashService.getUpdateKpiTableDetails(authString, selected);

		
	}

}
