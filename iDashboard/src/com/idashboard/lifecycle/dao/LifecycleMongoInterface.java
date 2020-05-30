package com.idashboard.lifecycle.dao;

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

public interface LifecycleMongoInterface {

	public int signup(String userId, String dashboardName, String description, String dashboardComponent) throws Exception;
	
	
	public int saveProdDash(String userId, String relName, List<String> products) throws Exception;
	
	
	public List<KpiMetricListVO> getKpiMetricList(String userId) throws JsonParseException, JsonMappingException,
	IOException, NumberFormatException, BaseException, BadLocationException;
	
	
	public int saveKpiDashboard(String userId, String relName,List<String> products, String fromDate,
			String toDate, boolean ispublic, List<String> selectedKpiItems) throws Exception;
	
	
	public int updateproddash(String userId, String relName, String ispublic, List<String> products) throws Exception;
	
	
	public int updateKpiDash(String userId, String oldRelName, String relName, List<String> products,
			 String fromDate,  boolean ispublic,  String toDate) throws Exception;
	
	
	public int updateDashboard(String userId, String dashboardName, String id,
			String description, boolean ispublic, String dashboardComponent) throws Exception;
	
	
	public int deleteDashboardInfo(String userId, String id, String dashboardName) throws Exception;
	
	
	public List<LCDashboardVO> getTableDetails(String userId,int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	public List<LCDashboardVO> getTablepublicDetails(String userId, int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	public long dashboardTableRecordsCount(String userId) throws JsonParseException, JsonMappingException,
	IOException, BadLocationException;
	
	
	public long kpiTablepulicRecordsCount(String userId)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	public long kpiTableRecordsCount(String userId)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	public long dashboardTablepulicRecordsCount()
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	public List<KpiDashboardVO> getKpipublicTableDetails()
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	
	public List<ViewProductDetailsVO> getproductTableDetails(String userId)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException;
	
	
	
	public String getRelStartDate(String userId, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public String getispublic(String userId, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public String getRelEndDate(String userId,String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException;
	
	
	
	public List<ViewProductDetailsVO> updateproductTableDetails(String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
	public List<String> getUpdateProdTableDetails(String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
	public List<String> getUpdateKpiTableDetails( String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
	
	public List<String> getMetricList(String userId,String selected) throws JsonParseException, JsonMappingException, IOException,
	NumberFormatException, BaseException, BadLocationException;
	
}
