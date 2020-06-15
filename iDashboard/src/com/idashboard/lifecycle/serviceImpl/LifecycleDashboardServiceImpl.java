package com.idashboard.lifecycle.serviceImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.KpiDashboardVO;
import com.cts.metricsportal.vo.KpiMetricListVO;
import com.cts.metricsportal.vo.LCDashboardVO;
import com.cts.metricsportal.vo.ViewProductDetailsVO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idashboard.lifecycle.dao.LifecycleMongoInterface;
import com.idashboard.lifecycle.daoImpl.LifecycleMongoOperationImpl;
import com.idashboard.lifecycle.service.LifecycleDashboardService;

public class LifecycleDashboardServiceImpl implements LifecycleDashboardService {
	
	LifecycleMongoInterface lcOperation = new LifecycleMongoOperationImpl();
	/* Create New Dashboard or Update */
	
	public int saveDashboard(String authString, String dashboardName, String description,
			String dashboardComponent) throws Exception {
		int count = 0;

		// JSON from String to Object
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			count = lcOperation.signup(userId, dashboardName, description, dashboardComponent);
		}
		return count;

	}

	/* Create New Dashboard or Update */
	
	public int saveProdDash(String authString, String relName, List<String> products) throws Exception {
		int count = 0;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			count = lcOperation.saveProdDash(userId, relName, products);
		}
		return count; 

	}

	
	public List<KpiMetricListVO> getKpiMetricList(String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<KpiMetricListVO> kpiMetricList=null;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			kpiMetricList = lcOperation.getKpiMetricList(userId);
		}
		return kpiMetricList;

	}

	/* Create New KPI Dashboard or Update */
	
	public int saveKpiDashboard(String authString, String relName, List<String> products, String fromDate,
			String toDate, boolean ispublic,List<String> selectedKpiItems) throws Exception {
		int count = 0;
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if (authenticateToken) {
			count = lcOperation.saveKpiDashboard(userId, relName, products, fromDate, toDate, ispublic, selectedKpiItems);
		}
		return count;

	}

	/* Update Dashboard or Update */
	
	public int updateproddash(String authString, String relName, String ispublic, List<String> products) throws Exception {
		int count = 0;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = lcOperation.updateproddash(userId, relName, ispublic, products);
		}
		return count;

	}

	/* Update KPI Dashboard or Update */
	
	public int updateKpiDash(String authString, String oldRelName, String relName, List<String> products,
			 String fromDate, boolean ispublic, String toDate) throws Exception {
		int count = 1;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = lcOperation.updateKpiDash(userId, oldRelName, relName, products, fromDate, ispublic, toDate);
		}
		return count;

	}

	/* Updating Dashbaord */
	
	public int updateDashboard( String authString, String dashboardName,  String id, String description, boolean ispublic,
			String dashboardComponent) throws Exception {
		int count = 0;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			// JSON from String to Object
			count = lcOperation.updateDashboard(userId, dashboardName, userId, description, ispublic, dashboardComponent);
		}

		return count;
	}

	/* Deleting User */
	
	public int deleteDashboardInfo(String authString, String id,String dashboardName) throws Exception {
		int count = 0;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		// Delete LC Dashboard
		
		if (authenticateToken) {
			// Remove release dashboard if exists without any products
			count = lcOperation.deleteDashboardInfo(userId, id, dashboardName);
		}
		return count;
	}

	/* Lifecycle Dashboard Table Details */

	
	public List<LCDashboardVO> getTableDetails( String authString,int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<LCDashboardVO> lcdDetails = null;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			lcdDetails = lcOperation.getTableDetails(userId, itemsPerPage, start_index);
		} 
			return lcdDetails;
		

	}

	
	public List<LCDashboardVO> getTablepublicDetails(String authString, int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<LCDashboardVO> lcdpublicDetails = new ArrayList<LCDashboardVO>();
		if (authenticateToken) {
			 lcdpublicDetails = lcOperation.getTablepublicDetails(userId, itemsPerPage, start_index);
		} 
			return lcdpublicDetails;

	}

	
	public long dashboardTableRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			count = lcOperation.dashboardTableRecordsCount(userId) ;
		}
		return count; 
	}

	public long kpiTablepulicRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			
			count = lcOperation.kpiTablepulicRecordsCount(userId);
		}
		return count;
	}

	
	public long kpiTableRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			count = lcOperation.kpiTableRecordsCount(userId);
			return count;
		} else {
			return count;
		}
	}

	
	public long dashboardTablepulicRecordsCount(String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			count = lcOperation.dashboardTablepulicRecordsCount();
		}
		return count;
	}

	
	public List<KpiDashboardVO> getKpipublicTableDetails(String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<KpiDashboardVO> lcdpublicDetails = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			
			lcdpublicDetails = lcOperation.getKpipublicTableDetails();
			return lcdpublicDetails;
		} else {
			return lcdpublicDetails;
		}
	}

	
	public List<ViewProductDetailsVO> getproductTableDetails(String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		List<ViewProductDetailsVO> finalList = null;
		if (authenticateToken) {
			finalList = lcOperation.getproductTableDetails(userId);
			return finalList;
		} else {
			return finalList;
		}
	}


	public String getRelStartDate( String authString,String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		String relStartDate = null;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			relStartDate = lcOperation.getRelStartDate(userId, selected);
		}

		return relStartDate;
	}

	
	public String getispublic(String authString, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String spublic = "";
		if (authenticateToken) {
			 spublic = lcOperation.getispublic(userId, selected);
		}
		return spublic;
	}

	
	public String getRelEndDate(String authString, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String relEndDate = null;

		if (authenticateToken) {
			 relEndDate = lcOperation.getRelEndDate(userId, selected);
		}
		return relEndDate;
	}

	
	public List<ViewProductDetailsVO> updateproductTableDetails(String authString, String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException{
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<ViewProductDetailsVO> finalList= null;
		if (authenticateToken) {
			finalList = lcOperation.updateproductTableDetails(userId, selected);
		} 
		return finalList;
	}

	
	public List<String> getUpdateProdTableDetails(String authString, String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			
			val = lcOperation.getUpdateProdTableDetails(userId, selected);

			return val;
		} else {
			return val;
		}
	}

	
	public List<String> getUpdateKpiTableDetails(String authString,String selected) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			
			val = lcOperation.getUpdateKpiTableDetails(userId, selected);

			return val;
		} else {
			return val;
		}
	}


}
