package com.idashboard.lifecycle.serviceImpl;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.util.BaseException;
import com.idashboard.lifecycle.dao.OctaneMongoInterface;
import com.idashboard.lifecycle.daoImpl.OctaneMongoOperationImpl;
import com.idashboard.lifecycle.service.OctaneService;
import com.idashboard.lifecycle.vo.OctaneDataVO;

public class OctaneServiceImpl implements OctaneService {

	static final Logger logger = Logger.getLogger(OctaneServiceImpl.class);
	OctaneMongoInterface octaneMongoOperation = new OctaneMongoOperationImpl();

	public List<String> getOctaneProjectDetails(String authString) throws JsonParseException, JsonMappingException,
			NumberFormatException, BaseException, IOException, BadLocationException {
		List<String> projectcoll = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			projectcoll = octaneMongoOperation.getOctaneProjectDetails();

		}

		return projectcoll;

	}

	public List<String> getOctaneCurrentSprint(String authString, String dashboardName, String workspaceName) throws IOException, BadLocationException {
		List<String> sprintDetails = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			try {
				sprintDetails = octaneMongoOperation.getOctaneCurrentSprint(workspaceName);
			} catch (NumberFormatException | BaseException e) {
				e.printStackTrace();
			}
		}
		return sprintDetails;

	}

	public long getDaysLeftInSprint(String authString, String dashboardName, String workspaceName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long daysLeft = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			daysLeft = octaneMongoOperation.getDaysLeftInSprint(dashboardName, workspaceName);
		}

		return daysLeft;
	}

	public long getBacklogCount(String authString, String dashboardName, String workspaceName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long backlogCount = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			backlogCount = octaneMongoOperation.getBacklogCount(dashboardName, workspaceName);
		}
		return backlogCount;

	}

	public List<OctaneDataVO> getSprintStatus(String authString, String dashboardName, String workspaceName,
			String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		List<OctaneDataVO> statusList = new ArrayList<OctaneDataVO>();

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			statusList = octaneMongoOperation.getSprintStatus(dashboardName, workspaceName, sprintSelected);
		}
		return statusList;
	}

	public List<OctaneDataVO> getSprintVelocity(String authString, String dashboardName, String workspaceName,
			String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		List<OctaneDataVO> velocityList = new ArrayList<OctaneDataVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			velocityList = octaneMongoOperation.getSprintVelocity(dashboardName, workspaceName, sprintSelected);
		}
		return velocityList;
	}

	public List<OctaneDataVO> getHourInvested(String authString, String dashboardName, String workspaceName,
			String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<OctaneDataVO> hourList = new ArrayList<OctaneDataVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			hourList = octaneMongoOperation.getHourInvested(dashboardName, workspaceName, sprintSelected);
		}
		return hourList;
	}

	public long getOctaneDefectCount(String authString, String dashboardName, String workspaceName,
			String OctaneSprintId) throws ParseException, BadLocationException {
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		long defCount = 0;

		if (authenticateToken) {
			try {

				defCount = octaneMongoOperation.getOctaneDefectCount(dashboardName, userId, workspaceName,
						OctaneSprintId);
			} catch (NumberFormatException | BaseException e) {
				logger.error(e.getMessage());
			}

		}
		return defCount;
	}

	/*
	 * public List<DefectTrendVO> getDefecttrendchart(String authString, String
	 * dashboardName, String domainName, String projectName, String vardtfrom,
	 * String vardtto, String timeperiod) throws ParseException{
	 * 
	 * boolean authenticateToken =
	 * LayerAccess.getOperationalLayerAccess(authString); String userId =
	 * LayerAccess.getUser(authString);
	 * 
	 * List<DefectTrendVO> trendvolist=null; if(authenticateToken){ try {
	 * 
	 * trendvolist = OctaneMongoOperations.getDefecttrendchartQuery(dashboardName,
	 * userId, workspaceName, OctaneSprintId); } catch (NumberFormatException |
	 * BaseException | BadLocationException e) { logger.error(e.getMessage()); }
	 * if(trendvolist != null && !trendvolist.isEmpty()) return trendvolist; }
	 * 
	 * return trendvolist;
	 * 
	 * }
	 */

	public List<OctaneDataVO> getOctaneDefectSeveritychart(String authString, String dashboardName,
			String workspaceName, String sprintSelected){

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		List<OctaneDataVO> result = null;

		if (authenticateToken) {
			try {

				result = octaneMongoOperation.getOctaneDefectSeveritychart(dashboardName, userId, workspaceName,
						sprintSelected);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return result;
	}

	public List<Long> getOctaneDefectStatusChart(String authString, String dashboardName, String workspaceName,
			String OctaneSprintId) throws ParseException, JsonMappingException, IOException {
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		List<Long> result = null;

		if (authenticateToken) {
			try {

				result = octaneMongoOperation.getOctaneDefectStatusChart(dashboardName, userId, workspaceName,
						OctaneSprintId);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if (result != null && !result.isEmpty())
				return result;
		}
		return result;
	}

	public List<OctaneDataVO> getOctaneDefectPrioritychart(String authString, String dashboardName,
			String workspaceName, String sprintSelected)
			throws ParseException, JsonParseException, JsonMappingException, IOException, BadLocationException {

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		List<OctaneDataVO> result = null;

		if (authenticateToken) {
			try {

				result = octaneMongoOperation.getOctaneDefectPrioritychart(dashboardName, userId, workspaceName,
						sprintSelected);
			} catch (NumberFormatException | BaseException e) {
				logger.error(e.getMessage());
			}

		}

		return result;
	}

}
