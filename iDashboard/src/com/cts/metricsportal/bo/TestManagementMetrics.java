package com.cts.metricsportal.bo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.HeaderParam;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.dao.GitMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.dao.TestManagementMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.UserVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

public class TestManagementMetrics {

	/**
	 * method returns domainlist
	 * 
	 * @param authString
	 * @return List<String> domainlist
	 */

	public List<String> getdomains(String authString) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<String> domainlist = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			domainlist = TestManagementMongoOperations.getdomains();
		}

		return domainlist;

	}

	/**
	 * method returns projectlist
	 * 
	 * @param authString
	 * @return List<String> projectlist
	 */

	public List<String> getproject(String authString, String domainName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<UserVO> alldetails = null;
		List<String> projectlist = new ArrayList<String>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		alldetails = TestManagementMongoOperations.getproject(domainName);

		if (authenticateToken) {
			for (int j = 0; j < alldetails.get(0).getSelectedProjects().size(); j++) {
				if (alldetails.get(0).getSelectedProjects().get(j).getLevel1().equals(domainName)) {
					projectlist.add(alldetails.get(0).getSelectedProjects().get(j).getLevel2());
				}

			}

			return projectlist;
		} else {
			return projectlist;
		}

	}

	/**
	 * method returns releaseset
	 * 
	 * @param authString
	 * @return List<String> releaseset
	 */
	public List<String> getlevelrelease(String authString, String domainName, String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<String> releasedata = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			releasedata = TestManagementMongoOperations.getlevelrelease(domainName, projectName);
		}

		return releasedata;

	}

	/**
	 * method returns resultsfor defect by status chart
	 * 
	 * @param authString
	 * @return List<DefectStatusVO> result
	 */

	public List<DefectStatusVO> getDefectenvchart(String authString, String domainName, String projectName,
			String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<DefectStatusVO> defectStatusData = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domainName, projectName, releaseName);
		if (authenticateToken) {
			defectStatusData = TestManagementMongoOperations.getDefectenvchart(levelIdList);

		}
		return defectStatusData;

	}

	/**
	 * method returns resultsfor test by status chart
	 * 
	 * @param authString
	 * @return List<TestExeStatusVO> result
	 */

	public List<TestExeStatusVO> getTcExeStatusbarchart(String authString, String domainName, String projectName,
			String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<TestExeStatusVO> testexeData = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domainName, projectName, releaseName);
		if (authenticateToken) {
			testexeData = TestManagementMongoOperations.getTcExeStatusbarchart(levelIdList);

		}
		return testexeData;

	}

	/**
	 * method returns resultsfor design by test type
	 * 
	 * @param authString
	 * @return List<TestCaseStatusVO> result
	 */

	public static List<TestCaseStatusVO> getTcExeOwnerChart(String authString, String domainName, String projectName,
			String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<TestCaseStatusVO> testCaseStatusData = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domainName, projectName, releaseName);
		if (authenticateToken) {
			testCaseStatusData = TestManagementMongoOperations.getTcExeOwnerChart(levelIdList);

		}
		return testCaseStatusData;

	}

	/**
	 * method returns resultsfor requirement by priority chart
	 * 
	 * @param authString
	 * @return List<RequirementStatusVO> result
	 */

	public List<RequirementStatusVO> getRequirementPiechart(String authString, String domainName, String projectName,
			String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<RequirementStatusVO> requirementData = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domainName, projectName, releaseName);
		if (authenticateToken) {
			requirementData = TestManagementMongoOperations.getRequirementPiechart(levelIdList);

		}
		return requirementData;

	}

	/**
	 * method returns resultsfor Requirement By Status
	 * 
	 * @param authString
	 * @return List<RequirementStatusVO> result
	 */

	public List<RequirementStatusVO> getRequirementbarchart(String authString, String domainName, String projectName,
			String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {

		List<RequirementStatusVO> requirementData = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domainName, projectName, releaseName);
		if (authenticateToken) {
			requirementData = TestManagementMongoOperations.getRequirementbarchart(levelIdList);

		}
		return requirementData;

	}

	/**
	 * method returns DesignStatus
	 * 
	 * @param authString
	 * @return List<TestCaseStatusVO> DesignStatuslist
	 */

	public List<TestCaseStatusVO> getDesignStatus(String authString, String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<TestCaseStatusVO> testDesigndata = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			testDesigndata = TestManagementMongoOperations.getDesignStatus(dashboardName);

		}
		return testDesigndata;
	}
}
