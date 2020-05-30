package com.idashboard.lifecycle.service;

import java.io.IOException;
import java.util.List;

import javax.swing.text.BadLocationException;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.KpiDashboardVO;
import com.cts.metricsportal.vo.KpiMetricListVO;
import com.cts.metricsportal.vo.LCDashboardVO;
import com.cts.metricsportal.vo.ViewProductDetailsVO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public interface LifecycleDashboardService {


	public int saveDashboard(String authString, String dashboardName, String description, String dashboardComponent) throws Exception;
	
	
	public int saveProdDash(String authString, String relName, List<String> products) throws Exception;
	
	
	public List<KpiMetricListVO> getKpiMetricList(String authString) throws JsonParseException, JsonMappingException,
	IOException, NumberFormatException, BaseException, BadLocationException;
	
	
	public int saveKpiDashboard(String authString, String relName,List<String> products, String fromDate,
			String toDate, boolean ispublic, List<String> selectedKpiItems) throws Exception;
	
	
	public int updateproddash(String authString, String relName, String ispublic, List<String> products) throws Exception;
	
	
	public int updateKpiDash(String authString, String oldRelName, String relName, List<String> products,
			 String fromDate,  boolean ispublic,  String toDate) throws Exception;
	
	
	public int updateDashboard(String authString, String dashboardName, String id,
			String description, boolean ispublic, String dashboardComponent) throws Exception;
	
	
	public int deleteDashboardInfo(String authString, String id, String dashboardName) throws Exception;
	
	
	public List<LCDashboardVO> getTableDetails(String authString,int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	public List<LCDashboardVO> getTablepublicDetails(String authString, int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	public long dashboardTableRecordsCount(String authString) throws JsonParseException, JsonMappingException,
	IOException, BadLocationException;
	
	
	public long kpiTablepulicRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	public long kpiTableRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	public long dashboardTablepulicRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	public List<KpiDashboardVO> getKpipublicTableDetails(String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	
	public List<ViewProductDetailsVO> getproductTableDetails(String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	
	public String getRelStartDate(String authString, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public String getispublic(String authString, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public String getRelEndDate(String authString,String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public List<ViewProductDetailsVO> updateproductTableDetails(String authString, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
	public List<String> getUpdateProdTableDetails(String authString, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
	public List<String> getUpdateKpiTableDetails( String authString, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
}
