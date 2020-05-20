package com.cts.metricsportal.bo;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;

import com.cts.metricsportal.dao.ChefMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.ChefNodesVO;
import com.cts.metricsportal.vo.ChefRunsNodeVO;
import com.cts.metricsportal.vo.ChefRunsStatusDetailsCountVO;
import com.cts.metricsportal.vo.ChefRunsStatusVO;
import com.cts.metricsportal.vo.ChefRunsTrendVO;
import com.cts.metricsportal.vo.ChefRunsVO;
import com.cts.metricsportal.vo.UserVO;

public class ChefMetrics implements IDTMetrics {
	static final Logger logger = Logger.getLogger(ChefMetrics.class);
	
	public long getTotalRunsSuccessCount(String authString, String cookbookName, String dashboardName) {
		long runsCount = 0;
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		if (LCAccess) {
		
			try {
				runsCount = ChefMongoOperations.getTotalRunsSuccessCountQuery(cookbookName);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
			if(runsCount != 0){
			return runsCount;
			}
		} 
		
		return runsCount;
	}
	
	public long getTotalRunsCountForCookbook(String authString, String cookbookName, String dashboardName){
		long runsCount = 0;
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		if (LCAccess) {
		try {
			runsCount = ChefMongoOperations.getTotalRunsCountForCookbookQuery(cookbookName);
			
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(runsCount != 0){
			return runsCount;
			}
		return runsCount;
		
	}

	public long getTotalReportCount(String authString, String dashboardName){
		long runsCount = 0;
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		if(LCAccess){
		try {
		runsCount = ChefMongoOperations.getTotalReportCountQuery();
		
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(runsCount != 0){
			return runsCount;
			}
		return runsCount;
	}
	
	public long getTotalRunsCountForCookbookForNode(String nodeName, String cookbookName, String dashboardName){
		long runsCount = 0;
		try {
			runsCount = ChefMongoOperations.getTotalRunsCountForCookbookForNodeQuery(nodeName, cookbookName);
			
			}   catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		if(runsCount != 0){
			return runsCount;
			}
		return runsCount;
	}
	
	public long getTotalRunsSuccessCountForNode(String nodeName, String cookbookName, String dashboardName){
		long runsCount = 0;
		try {
			runsCount = ChefMongoOperations.getTotalRunsSuccessCountForNodeQuery(nodeName, cookbookName);
			
			}  catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		if(runsCount != 0){
			return runsCount;
			}
		return runsCount;
	}
	
	public List<String> getRecordsRunsCookbookNames(String authString, String dashboardName){
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		List<String> cookbookNamesList=new ArrayList<String>();
		if(LCAccess){
		try {
			cookbookNamesList = ChefMongoOperations.getRecordsRunsCookbookNamesQuery();
			
			}  catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}if(cookbookNamesList != null && !cookbookNamesList.isEmpty()) {
			return cookbookNamesList;
		}
		return cookbookNamesList;
	}
	
	public List<ChefRunsVO> getLastRunDetails(String authString, int itemsPerPage, int start_index, String cookbookName, String dashboardName){
		
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		
		List<ChefRunsVO> lastrunsList = new ArrayList<ChefRunsVO>();	
		if(LCAccess){
		try {
			lastrunsList=ChefMongoOperations.getLastRunDetailsQuery(itemsPerPage, start_index, cookbookName);
			
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(lastrunsList != null && !lastrunsList.isEmpty()) {
			return lastrunsList;
		}
		return lastrunsList;
		
	}
		
	public List<ChefRunsVO> getLastRunDetailsForNode(String authString, String nodeName, String cookbookName, String dashboardName){
		List<ChefRunsVO> lastRunsListForNode=new ArrayList<ChefRunsVO>();
		try {
			lastRunsListForNode=ChefMongoOperations.getLastRunDetailsForNodeQuery(nodeName, cookbookName);
			if(lastRunsListForNode != null && !lastRunsListForNode.isEmpty()) {
			for (ChefRunsVO lastRunDetailsForNode : lastRunsListForNode) {
			String startTimeStr = lastRunDetailsForNode.getStarttime();
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate = null;
			String startTimestamp = "";
			try {
				startDate = formatter.parse(startTimeStr);
			}
			catch (ParseException pe) {
				logger.error("inside /chefGetLastRunDetailsForNode, getLastRunDetailsForNode() Parse Exception Occurred,  startTimeStr = " + startTimeStr);
				startTimestamp = startTimeStr;
				logger.error(pe.getMessage());
			}
			startTimestamp = DateFormat.getDateTimeInstance().format(startDate);
			lastRunDetailsForNode.setStarttime(startTimestamp);
			}
			}
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return lastRunsListForNode;
	}
	
	public List<ChefRunsVO> getLastSuccessfulRunDetails(String authString, int itemsPerPage, int start_index, String cookbookName, String dashboardName){
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		List<ChefRunsVO> lastSuccessfulRunsList = new ArrayList<ChefRunsVO>();
		if(LCAccess){
		try {
			lastSuccessfulRunsList=ChefMongoOperations.getLastRunDetailsQuery(cookbookName);
			
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(lastSuccessfulRunsList != null && !lastSuccessfulRunsList.isEmpty()) {
			return lastSuccessfulRunsList;
		}
		return lastSuccessfulRunsList;
		
	}
	
	public List<ChefRunsVO> getSuccessfulCookbooksRunForNode(String authString, int itemsPerPage, int start_index, String nodeName, String cookbookName, String dashboardName){
		
		List<ChefRunsVO> lastSuccessfulCookbookRunsOnNodesList=new ArrayList<ChefRunsVO>();
		try {
			lastSuccessfulCookbookRunsOnNodesList=ChefMongoOperations.getSuccessfulCookbooksRunForNodeQuery(nodeName, cookbookName);
			
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}		
		if(lastSuccessfulCookbookRunsOnNodesList != null && !lastSuccessfulCookbookRunsOnNodesList.isEmpty()) {
			return lastSuccessfulCookbookRunsOnNodesList;
		}
		return lastSuccessfulCookbookRunsOnNodesList;
	}
	
	public List<ChefRunsVO> getLastSuccessfulRunDetailsForNode(String authString, String nodeName, String cookbookName,
			String dashboardName, String owner) {
		List<ChefRunsVO> lastSuccessfulRunsListForNode = new ArrayList<ChefRunsVO>();
		try {
			lastSuccessfulRunsListForNode = ChefMongoOperations.lastSuccessfulRunsListForNodeQuery(nodeName, cookbookName);
			if(lastSuccessfulRunsListForNode != null && !lastSuccessfulRunsListForNode.isEmpty()) {
			for (ChefRunsVO lastSuccessRunDetailsForNode : lastSuccessfulRunsListForNode) {
			String startTimeStr = lastSuccessRunDetailsForNode.getStarttime();
			DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date startDate = null;
			String startTimestamp = "";
			try {
				startDate = formatter.parse(startTimeStr);
			}
			catch (ParseException pe) {
				startTimestamp = startTimeStr;
				logger.error(pe.getMessage());
			}
			startTimestamp = DateFormat.getDateTimeInstance().format(startDate);
			lastSuccessRunDetailsForNode.setStarttime(startTimestamp);
		}
			}
	}   catch (NumberFormatException | BaseException | BadLocationException e) {
		// TODO Auto-generated catch block
		logger.error(e.getMessage());
	}

		return lastSuccessfulRunsListForNode;

	}
	
	public List<ChefRunsVO> getRecordsRuns(String authString, int itemsPerPage, int start_index, String cookbookName,
			String dashboardName) {
		List<ChefRunsVO> runsList=new ArrayList<ChefRunsVO>();
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		if(LCAccess){
		try {
			runsList=ChefMongoOperations.runsListQuery(itemsPerPage, start_index, cookbookName);
			
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(runsList != null && !runsList.isEmpty()) {
			return runsList;
		}
		return runsList;
	}
	
	public ChefNodesVO getRunNodesRecords(String nodeName, String dashboardName) {
		ChefNodesVO runNodeDetails = new ChefNodesVO();
		try {
			runNodeDetails = ChefMongoOperations.getRunNodesRecordsQuery(nodeName);
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		if(runNodeDetails != null) {
			return runNodeDetails;
		}
		return runNodeDetails;
	}
	
	public List<ChefRunsStatusVO> getRunsbarchart(String cookbookName) {
		List<ChefRunsStatusVO> result = new ArrayList<ChefRunsStatusVO>();
		try {
			result = ChefMongoOperations.getRunsbarchartQuery(cookbookName);
			
		}  catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		if(result != null && !result.isEmpty()) {
			return result;
		}
		return result;
	}
	
	public List<ChefRunsStatusDetailsCountVO> getRunsmultibarchart(String authString, String cookbookName,
			String dashboardName) {
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		List<ChefRunsStatusDetailsCountVO> finalresult = new ArrayList<ChefRunsStatusDetailsCountVO>();
		if(LCAccess){
		try {
			finalresult = ChefMongoOperations.getRunsmultibarchartQuery(cookbookName);
			
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(finalresult != null && !finalresult.isEmpty()) {
			return finalresult;
		}
		return finalresult;
	}
	
	public List<ChefRunsNodeVO> getRunsOnEachNodeChartData(String authString, String cookbookName,
			String dashboardName) {
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);
		List<ChefRunsNodeVO> result=new ArrayList<ChefRunsNodeVO>();
		if(LCAccess){
		try {
			result = ChefMongoOperations.getRunsOnEachNodeChartDataQuery(cookbookName);
			
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(result != null && !result.isEmpty()) {
			return result;
		}
		return result;
		
	}
	
	public List<ChefRunsTrendVO> getRunstrendchart(String authString, String cookbookName, String dashboardName) {
		boolean LCAccess = LayerAccess.getLCLayerAccess(authString);		
		List<ChefRunsTrendVO> trendvolist=new ArrayList<ChefRunsTrendVO>();
		if(LCAccess){
		try {
			trendvolist = ChefMongoOperations.getRunstrendchartQuery(cookbookName);
			
		}   catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		}
		if(trendvolist != null && !trendvolist.isEmpty()) {
			return trendvolist;
		}
		return trendvolist;
		
	}
	
	public boolean authenticate1(String username, String password) {
		List<UserVO> userDetails = ChefMongoOperations.authenticate1Query(username, password);
		if (userDetails.size() == 1) {
			return true;
		} else {
			return false;
		}
	}
	
	
}