package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.CyclesTrendVO;
import com.cts.metricsportal.vo.DefectChartVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DomainVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraUserStoryStatusVO;
import com.cts.metricsportal.vo.JiraUserStoryVO;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.ProjectVO;
import com.cts.metricsportal.vo.ReleaseVO;
import com.cts.metricsportal.vo.UserStoryDefectsStatusVO;
import com.cts.metricsportal.vo.UserStoryTrendVO;
import com.cts.metricsportal.vo.UserVO;

public class JiraMetrics {

	static final Logger logger = Logger.getLogger(JiraMetrics.class);
	DateTimeCalc dateTimeCalc = new DateTimeCalc();

	public List<DomainVO> getJiraOperationDashboard(String authString) {

		String userId = LayerAccess.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		List<UserVO> allinfolist = new ArrayList<UserVO>();

		allinfolist = JiraMongoOperations.getAllInfoList(userId);

		List<String> domainlist = new ArrayList<String>();

		// domain
		for (int q = 0; q < allinfolist.get(0).getSelectedProjects().size(); q++) {
			if (allinfolist.get(0).getSelectedProjects().get(q).getSourceTool().equalsIgnoreCase("JIRA")) {
				domainlist.add(allinfolist.get(0).getSelectedProjects().get(q).getLevel1());
			}
		}

		Set<String> domainset = new HashSet<String>(domainlist);
		List<String> domain = new ArrayList<String>(domainset);
		// end of domain

		// project
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;

		if (authenticateToken) {

			for (int i = 0; i < domain.size(); i++) {
				List<String> projectlist = new ArrayList<String>();
				for (int s = 0; s < allinfolist.get(0).getSelectedProjects().size(); s++) {
					if (allinfolist.get(0).getSelectedProjects().get(s).getLevel1().equals(domain.get(i))) {
						if (allinfolist.get(0).getSelectedProjects().get(s).getSourceTool().equalsIgnoreCase("JIRA")) {
							projectlist.add(allinfolist.get(0).getSelectedProjects().get(s).getLevel2());
						}
					}

				}

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("JD" + domainID++);
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSelected(false);
				selectdomain.setSourceTool("JIRA");
				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < projectlist.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("JP" + projectID++);
					selectproject.setLevel2(projectlist.get(j));
					selectproject.setSelected(false);

					release = JiraMongoOperations.getReleaseList(i, j, domain, projectlist);
					endjson = new ArrayList<ReleaseVO>();

					for (int k = 0; k < release.size(); k++) {

						ReleaseVO selectrelease = new ReleaseVO();
						selectrelease.setLevel3ID("JR" + releaseID++);
						selectrelease.setLevel3(release.get(k));
						selectrelease.setSelected(false);
						endjson.add(selectrelease);

						List<LevelItemsVO> levelIdList = JiraMongoOperations.getlevelIdList(i, j, k, domain,
								projectlist, release);

						levelId = levelIdList.get(0).getLevelId();
						selectrelease.setLevelId(levelId);
					}
					selectproject.setChildren(endjson);
					finalrelease.add(selectproject);

				}
				selectdomain.setChildren(finalrelease);
				finalproject.add(selectdomain);
			}
			return finalproject;
		} else {
			return finalproject;
		}
	}

	// For Metrics screen

	public List<String> getProjectList(String authString, String dashboardName, String domainName, String projectName) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> prolist = null;
		List<String> levelIdList;
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value
		
		if (operationalAccess) {

			List<JiraDefectVO> idlist = new ArrayList<JiraDefectVO>();
			try {
				levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
				idlist = JiraMongoOperations.getProjectList(levelIdList);
				List<String> projectlist = new ArrayList<String>();

				for (int i = 0; i < idlist.size(); i++) {
					for (int j = 0; j < levelIdList.size(); j++) {
						if (idlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
							projectlist.add(idlist.get(i).getPrjName());
						}
					}
				}
				Set<String> hSet = new HashSet<String>(projectlist);
				prolist = new ArrayList<String>(hSet);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}

		}
		return prolist;
	}

	public List<String> getVersionList(String authString, String dashboardName, String domainName, String projectName) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> versionList = null;
		List<String> levelIdList;
		
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				versionList = JiraMongoOperations.getVersionList(levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return versionList;
	}

	public long getTotExecutionCount(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) throws ParseException {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		long totExeCount = 0;
		List<String> levelIdList;
		
		Date startDate = null;	Date endDate = null;
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		
			 endDate = dateTimeCalc.getEndDate(vardtto);
		

		if (operationalAccess) {
			try {
				String owner = "";

				// Check the Dashboard is set as public
				owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
				if (owner != "") {
					userId = owner;
				}
				// End of the check value
				
				
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				totExeCount = JiraMongoOperations.getTotExecutionCount(levelIdList, startDate, endDate);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return totExeCount;
	}

	public List<String> getCycleList(String authString, String dashboardName, String domainName, String projectName) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> cycleList = null;
		List<String> levelIdList;

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				cycleList = JiraMongoOperations.getCycleList(levelIdList, dashboardName, userId);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return cycleList;
	}

	public HashMap<String, String> getTestsCreatedVsExecuted(String authString, String dashboardName, String domainName,
			String projectName, String selectedproject) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		HashMap<String, String> testsCreatedVsExecuted = new HashMap<String, String>();
		List<String> levelIdList;
		
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				testsCreatedVsExecuted = JiraMongoOperations.getTestsCreatedVsExecuted(levelIdList, selectedproject,
						userId);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return testsCreatedVsExecuted;
	}

	public HashMap<String, String> getBugsdetectedcountbyprojects(String authString, String dashboardName,
			String domainName, String projectName, String selectedproject, String vardtfrom, String vardtto) throws ParseException {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		HashMap<String, String> testsCreatedVsExecuted = new HashMap<String, String>();
		List<String> levelIdList;
		
		Date startDate = null;
		Date endDate = null;
		
		
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
			 endDate = dateTimeCalc.getEndDate(vardtto);
		

		if (operationalAccess) {
			try {
				
				String owner = "";

				// Check the Dashboard is set as public
				owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
				if (owner != "") {
					userId = owner;
				}
				// End of the check value
				
				levelIdList = getJiraGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				testsCreatedVsExecuted = JiraMongoOperations.getBugsdetectedcountbyprojects(levelIdList,
						selectedproject, userId, startDate, endDate);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return testsCreatedVsExecuted;
	}

	public long getTestExecutionCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		long testsCreatedVsExecuted = 0;
		List<String> levelIdList;
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				testsCreatedVsExecuted = JiraMongoOperations.getTestExecutionCount(levelIdList, userId, vardtfrom,
						vardtto);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return testsCreatedVsExecuted;
	}

	public HashMap<String, String> getRatioOfTestCaseFails(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		HashMap<String, String> ratiooftestcasefails = new HashMap<String, String>();
		List<String> levelIdList;
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				ratiooftestcasefails = JiraMongoOperations.getRatioOfTestCaseFails(dashboardName, levelIdList, userId,
						vardtfrom, vardtto);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return ratiooftestcasefails;
	}

	public List<CyclesTrendVO> getexepassfailtrendchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<CyclesTrendVO> ratiooftestcasefails = new ArrayList<CyclesTrendVO>();
		List<String> levelIdList;
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				ratiooftestcasefails = JiraMongoOperations.getexepassfailtrendchart(dashboardName, levelIdList, userId,
						vardtfrom, vardtto);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return ratiooftestcasefails;
	}

	public long getDefClosedCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto) throws NumberFormatException, BaseException, BadLocationException {
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		long defTestExecutionCount = 0;

		if (operationalAccess) {

			List<String> levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
			defTestExecutionCount = JiraMongoOperations.getDefClosedCountQuery(authString, userId, dashboardName,
					domainName, projectName, vardtfrom, vardtto, levelIdList);

		}
		return defTestExecutionCount;
	}

	public long getreopentCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto) throws NumberFormatException, BaseException, BadLocationException {
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		long defreopenCount = 0;
		List<String> levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
		if (operationalAccess) {
			defreopenCount = JiraMongoOperations.getreopenCountQuery(authString, userId, dashboardName, domainName,
					projectName, vardtfrom, vardtto, levelIdList);
		}
		return defreopenCount;
	}

	public List<DefectStatusVO> getpassfailtrendchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto)
			throws NumberFormatException, BaseException, BadLocationException, ParseException {

		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		List<DefectStatusVO> finalresult = new ArrayList<DefectStatusVO>();

		long diff = 0;
		long noOfDays = 0;


		 Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		 Date endDate = dateTimeCalc.getEndDate(vardtto);
	

		diff = endDate.getTime() - startDate.getTime();
		noOfDays = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

		List<String> levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);

		if (operationalAccess) {

			List<String> prolist = new ArrayList<String>();
			prolist = JiraMongoOperations.getprolistQuery(dashboardName, userId);

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = JiraMongoOperations.getsprintlistQuery(dashboardName, userId);

			List<String> epiclist = new ArrayList<String>();
			epiclist = JiraMongoOperations.getepiclistQuery(dashboardName, userId);

			List<JiraDefectVO> closedList = new ArrayList<JiraDefectVO>();
			closedList = JiraMongoOperations.getclosedListQuery(prolist, sprintlist, epiclist, levelIdList, startDate,
					endDate);

			List<JiraDefectVO> openedList = new ArrayList<JiraDefectVO>();
			openedList = JiraMongoOperations.getopenedListQuery(prolist, sprintlist, epiclist, levelIdList, startDate,
					endDate);
			for (int i = 0; i < noOfDays; i++) {

				Calendar today = Calendar.getInstance();
				today.setTime(startDate);
				today.add(Calendar.DATE, i);
				Date adaybefore = today.getTime();

				DefectStatusVO tcfinal = new DefectStatusVO();
				int Closed = 0;
				int Open = 0;

				for (int j = 0; j < closedList.size(); j++) {
					if (closedList.get(j).getIssueCreated().getDate() == adaybefore.getDate()
							&& (closedList.get(j).getIssueCreated().getMonth() + 1) == (adaybefore.getMonth() + 1)
							&& (closedList.get(j).getIssueCreated().getYear() + 1900) == (adaybefore.getYear()
									+ 1900)) {
						Closed++;
					}
				}

				for (int j = 0; j < openedList.size(); j++) {
					if (openedList.get(j).getIssueCreated().getDate() == adaybefore.getDate()
							&& (openedList.get(j).getIssueCreated().getMonth() + 1) == (adaybefore.getMonth() + 1)
							&& (openedList.get(j).getIssueCreated().getYear() + 1900) == (adaybefore.getYear()
									+ 1900)) {
						Open++;
					}
				}

				String cdate = adaybefore.getDate() + "/" + (adaybefore.getMonth() + 1) + "/"
						+ (adaybefore.getYear() + 1900);
				DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
				Date datecreated = null;

				try {
					datecreated = df.parse(cdate);
				} catch (java.text.ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				tcfinal.setClosed(Closed);
				tcfinal.setOpen(Open);
				tcfinal.setIsodate(datecreated);

				finalresult.add(tcfinal);
			}

		}

		if (finalresult != null && !finalresult.isEmpty())
			return finalresult;
		return finalresult;

	}

	public List<DefectChartVO> getdefectStatusChart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto)
			throws NumberFormatException, BaseException, BadLocationException, ParseException {
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();


		 Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		 Date endDate = dateTimeCalc.getEndDate(vardtto);
	
		if (operationalAccess) {
			List<String> levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();
			reqlist = JiraMongoOperations.getReqListQuery(levelIdList);
			List<String> statuslist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();

			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						
						statlist.add(reqlist.get(i).getIssueStatus()); 
						
					}
				}
			}
			Set<String> hSet = new HashSet<String>(statlist);
			statuslist = new ArrayList<String>(hSet);
			/*
			 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
			 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			 */
			List<String> prolist = new ArrayList<String>();
			prolist = JiraMongoOperations.getprolistQuery(dashboardName, userId);

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = JiraMongoOperations.getsprintlistQuery(dashboardName, userId);

			List<String> epiclist = new ArrayList<String>();
			epiclist = JiraMongoOperations.getepiclistQuery(dashboardName, userId);

			List<JiraDefectVO> defectPriority = new ArrayList<JiraDefectVO>();
			defectPriority = JiraMongoOperations.getDefectPriorityQuery(prolist, sprintlist, epiclist, levelIdList,
					startDate, endDate);
			for (int i = 0; i < statuslist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String Status = statuslist.get(i);

				for (int j = 0; j < defectPriority.size(); j++) {
					if (defectPriority.get(j).getIssueStatus().equalsIgnoreCase(Status)) {
						Count++;
					}
				}
				vo.setValue(Status);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		}
		if (finalresult != null && !finalresult.isEmpty())
			return finalresult;
		return finalresult;

	}

	public List<DefectChartVO> getdefectsOpenStatusPriority(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto)
			throws NumberFormatException, BaseException, BadLocationException, ParseException {
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		List<DefectChartVO> finalresult = new ArrayList<DefectChartVO>();


		 Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		 Date endDate = dateTimeCalc.getEndDate(vardtto);
	
		if (operationalAccess) {
			List<String> levelIdList = getJiraGlobalLevelIdDefects(dashboardName, userId, domainName, projectName);
			List<JiraDefectVO> reqlist = new ArrayList<JiraDefectVO>();
			reqlist = JiraMongoOperations.getReqListQuery(levelIdList);
			List<String> prioritylist = new ArrayList<String>();
			List<String> statlist = new ArrayList<String>();
			for (int i = 0; i < reqlist.size(); i++) {
				for (int j = 0; j < levelIdList.size(); j++) {
					if (reqlist.get(i).get_id().equalsIgnoreCase(levelIdList.get(j))) {
						statlist.add(reqlist.get(i).getIssuePriority());
					}
				}

			}
			Set<String> hSet = new HashSet<String>(statlist);
			prioritylist = new ArrayList<String>(hSet);
			// query.addCriteria(Criteria.where("issueStatus").ne("Closed"));

			/*
			 * diff =endDate.getTime()- startDate.getTime(); noOfDays =
			 * TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			 */
			List<String> prolist = new ArrayList<String>();
			prolist = JiraMongoOperations.getprolistQuery(dashboardName, userId);

			List<String> sprintlist = new ArrayList<String>();
			sprintlist = JiraMongoOperations.getsprintlistQuery(dashboardName, userId);

			List<String> epiclist = new ArrayList<String>();
			epiclist = JiraMongoOperations.getepiclistQuery(dashboardName, userId);

			List<JiraDefectVO> defectPriority = new ArrayList<JiraDefectVO>();
			defectPriority = JiraMongoOperations.getdefectsOpenStatusPriorityQuery(prolist, sprintlist, epiclist,
					levelIdList, startDate, endDate);
			for (int i = 0; i < prioritylist.size(); i++) {

				DefectChartVO vo = new DefectChartVO();
				int Count = 0;
				String priority = prioritylist.get(i);

				for (int j = 0; j < defectPriority.size(); j++) {
					if (defectPriority.get(j).getIssuePriority().equalsIgnoreCase(priority)) {
						Count++;
					}
				}
				vo.setValue(priority);
				vo.setCount(Count);

				finalresult.add(vo);
			}
		}
		return finalresult;

	}

	public List<JiraUserStoryStatusVO> getUserStoryOwner(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		List<JiraUserStoryStatusVO> result = null;

		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);

		if (operationalAccess) {
			result = JiraMongoOperations.getUserStoryOwner(levelIdList);
		}
		return result;

	}

	public long getUserStoryCount(String authString, String dashboardName, String domainName, String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStories = 0;

		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);

		if (operationalAccess) {
			totalUserStories = JiraMongoOperations.getUserStoryCount(levelIdList);
		}
		return totalUserStories;

	}

	public List<UserStoryDefectsStatusVO> getUserStoryDef(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		List<UserStoryDefectsStatusVO> result = null;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryDefQuery(dashboardName, userId,
				domainName, projectName);
		if (operationalAccess) {
			result = JiraMongoOperations.getUserStoryDef(levelIdList);
		}
		return result;
	}

	public long getLifeUserStoryCount(String authString, String dashboardName, String domainName, String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStories = 0;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (operationalAccess) {
			totalUserStories = JiraMongoOperations.getLifeUserStoryCount(levelIdList);
		}

		return totalUserStories;
	}

	public long getUserStoryIterationCount(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		long totalUserStoriesSprint = 0;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName); // usedlevelId
																														// directly,
																														// different
																														// mongo
																														// collection

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		if (operationalAccess) {
			totalUserStoriesSprint = JiraMongoOperations.getUserStoryIterationCount(levelIdList);
		}
		return totalUserStoriesSprint;
	}

	public long getInitIterationUserStoryBackLogCount(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		long totalUserStoriesBacklog = 0;
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (operationalAccess) {
			String hasChildren = "false";
			String backlogStr = "true";

			Map<String, String> searchvalues = new HashMap<String, String>();
			searchvalues.put("hasChildren", hasChildren);
			searchvalues.put("backlogStr", backlogStr);
			searchvalues.put("prjName", projectName);

			totalUserStoriesBacklog = JiraMongoOperations.getInitIterationUserStoryBackLogCount(searchvalues);
		}
		return totalUserStoriesBacklog;
	}

	public long getUserStoryDefectCount(String authString, String dashboardName, String domainName, String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long totalUserStoryDefectCount = 0;
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryDefQuery(dashboardName, userId,
				domainName, projectName);

		if (operationalAccess) {
			totalUserStoryDefectCount = JiraMongoOperations.getUserStoryDefectCount(levelIdList);
		}
		return totalUserStoryDefectCount;
	}

	public List<UserStoryTrendVO> getUserStoryTrendChart(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<UserStoryTrendVO> trendvolist = null;
		UserStoryTrendVO userStoryTrendVO = new UserStoryTrendVO();
		trendvolist = new ArrayList<UserStoryTrendVO>();

		List<JiraUserStoryStatusVO> result = null;

		if (operationalAccess || authenticateToken) {
			result = JiraMongoOperations.getUserStoryTrendChart(levelIdList);

			for (int i = 0; i < result.size(); i++) {

				int iCompleted = 0;
				int iDefined = 0;
				int iinProgress = 0;

				List<JiraUserStoryStatusVO> result1 = new ArrayList<JiraUserStoryStatusVO>();
				Date dateString = result.get(i).getStoryCreationDate();

				result1 = JiraMongoOperations.getUserStoryTrendChartFinal(levelIdList, dateString);

				userStoryTrendVO = new UserStoryTrendVO();
				try {
					for (int j = 0; j < result1.size(); j++) {
						if (result1.get(j).getStoryStatus().equalsIgnoreCase(IdashboardConstantsUtil.IN_PROGRESS)) {
							iinProgress = result1.get(j).getStatusCnt();
							userStoryTrendVO.setInprogress(iinProgress);
						}

						else if (result1.get(j).getStoryStatus().equalsIgnoreCase(IdashboardConstantsUtil.COMPLETED)) {
							iCompleted = result1.get(j).getStatusCnt();
							userStoryTrendVO.setCompleted(iCompleted);
						}

						else if (result1.get(j).getStoryStatus().equalsIgnoreCase(IdashboardConstantsUtil.DEFINED)) {
							iDefined = result1.get(j).getStatusCnt();
							userStoryTrendVO.setDefined(iDefined);

						}

					}
				} catch (Exception e) {
					logger.error("exception caught" + e.getMessage());
				}
				Date date = new Date();
				date = dateString;
				SimpleDateFormat formatter = new SimpleDateFormat(IdashboardConstantsUtil.YYYY_MM_DD);
				String format = formatter.format(date);
				String strExistingFlag = "False";

				for (UserStoryTrendVO chartVO : trendvolist) {
					String strDate = chartVO.getDate();

					if (strDate.equals((format))) {

						chartVO.setDefined(iDefined + chartVO.getDefined());
						chartVO.setInprogress(iinProgress + chartVO.getInprogress());
						chartVO.setCompleted(iCompleted + chartVO.getCompleted());
						strExistingFlag = "True";
						break;
					}
				}
				if (strExistingFlag.equalsIgnoreCase(IdashboardConstantsUtil.FALSE)) {
					userStoryTrendVO.setDate(format);
					userStoryTrendVO.setMydate(dateString);
					trendvolist.add(userStoryTrendVO);
				}
			}
		}
		return trendvolist;
	}

	public List<JiraUserStoryStatusVO> getUserStorybyStatusChartData(String authString, String dashboardName,
			String domainName, String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<JiraUserStoryStatusVO> result = null;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (operationalAccess) {
			result = JiraMongoOperations.getUserStorybyStatusChartData(levelIdList);
		}
		return result;
	}

	public List<JiraUserStoryStatusVO> getDesignType(String authString, String dashboardName, String domainName,
			String projectName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		List<JiraUserStoryStatusVO> result = null;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);

		if (operationalAccess) {
			result = JiraMongoOperations.getDesignType(levelIdList);
		}
		return result;
	}

	public List<JiraUserStoryStatusVO> getUserStoryFunnelchart(String authString, String dashboardName,
			String domainName, String projectName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		List<JiraUserStoryStatusVO> result = null;
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);

		if (operationalAccess) {
			result = JiraMongoOperations.getUserStoryFunnelchart(levelIdList);
		}
		return result;
	}

	public List<JiraUserStoryVO> getRecordsReq(String authString, int itemsPerPage, int start_index,
			String dashboardName, String domainName, String projectName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<JiraUserStoryVO> userStoryAnalysisList = null;
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = JiraMongoOperations.getJiraGlobalLevelIdUserStoryQuery(dashboardName, userId,
				domainName, projectName);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (operationalAccess) {
			userStoryAnalysisList = JiraMongoOperations.getRecordsReq(itemsPerPage, start_index, levelIdList);
		}
		return userStoryAnalysisList;
	}

	public long getUserStorySearchPageCount(String authString, String dashboardName, String domainName,
			String projectName, String storyID, String storyName, String userStrdescription, String storyOwner)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long pageCount = 0;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);

		if (operationalAccess) {
			if ("".equals(storyOwner)) {
				storyOwner = "null";
			}
			Map<String, String> searchvalues = new HashMap<String, String>();

			userStrdescription = (userStrdescription == null) ? "null" : userStrdescription;
			searchvalues.put("storyID", storyID);
			searchvalues.put("storyName", storyName);
			searchvalues.put("userStrdescription", userStrdescription);
			searchvalues.put("storyOwner", storyOwner);
			searchvalues.put("prjName", projectName);

			pageCount = JiraMongoOperations.getUserStorySearchPageCount(searchvalues);

		}
		return pageCount;
	}

	public List<JiraUserStoryVO> getSearchUserStory(String authString, String dashboardName, String domainName,
			String projectName, String storyID, String storyName, String userStrdescription, String storyOwner,
			int itemsPerPage, int startIndex) {

		List<JiraUserStoryVO> searchResult = null;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		if (operationalAccess) {

			userStrdescription = (userStrdescription == null) ? "null" : userStrdescription;
			if ("".equals(storyOwner)) {
				storyOwner = "null";
			}

			Map<String, String> searchValues = new HashMap<String, String>();
			searchValues.put("storyID", storyID);
			searchValues.put("storyName", storyName);
			searchValues.put("userStrdescription", userStrdescription);
			searchValues.put("storyOwner", storyOwner);
			searchValues.put("prjName", projectName);

			searchResult = JiraMongoOperations.getSearchUserStory(itemsPerPage, startIndex, searchValues);
		}
		return searchResult;
	}

	public static List<String> getJiraGlobalLevelIdRequirements(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);
		List<String> levellist = new ArrayList<String>();
		levellist = JiraMongoOperations.getJiraGlobalLevelIdRequirementsQuery(levelIdList);
		return levellist;

	}

	public static List<String> getJiraGlobalLevelIdDesign(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);
		List<String> levellist = new ArrayList<String>();
		levellist = JiraMongoOperations.getJiraGlobalLevelIdDesignQuery(levelIdList);
		return levellist;

	}

	public static List<String> getJiraGlobalLevelIdDefects(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		List<Integer> levelIdList;
		levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);
		List<String> levellist = null;
		levellist = JiraMongoOperations.getJiraGlobalLevelIdsDefectsQuery(levelIdList);

		return levellist;
	}

	public static List<String> getJiraGlobalLevelIdExecution(String dashboardName, String owner, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		List<Integer> levelIdList;
		levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, owner, domainName, projectName);
		List<String> levellist = null;
		levellist = JiraMongoOperations.getJiraGlobalLevelIdsExecutionQuery(levelIdList);

		return levellist;
	}

	public static List<Date> getdefaultdate(String authString, String dashboardName, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<Date> finalDateList = new ArrayList<Date>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdExecution(dashboardName, userId, domainName,
				projectName);

		finalDateList = JiraMongoOperations.getdefaultdate(levelIdList, dashboardName, userId);

		return finalDateList;
	}
	
	public static List<Date> getOnLoaddate(String authString, String dashboardName, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<Date> finalDateList = new ArrayList<Date>();

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdExecution(dashboardName, userId, domainName,
				projectName);

		finalDateList = JiraMongoOperations.getOnLoaddate(levelIdList, dashboardName, userId);

		return finalDateList;
	}
	
	public static String getRollingPeriod(String authString, String dashboardName, String domainName,
			String projectName) throws NumberFormatException, BaseException, BadLocationException {

		String owner="";
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}


		// End of the check value

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		String rollingPeriod;

		List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDesign(dashboardName, userId, domainName,
				projectName);

		rollingPeriod = JiraMongoOperations.getRollingPeriod(levelIdList, dashboardName, userId);

		return rollingPeriod;
	}

	public List<String> getVersionListSel(String authString, String dashboardName, String domainName,
			String projectName, String dfromval, String dtoval) {
		String userId = LayerAccess.getUser(authString);
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		List<String> versionList = null;
		List<String> levelIdList;
		
		String owner = "";

		// Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		if (operationalAccess) {
			try {
				levelIdList = getJiraGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				versionList = JiraMongoOperations.getVersionListSel(levelIdList, dfromval, dtoval);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}

		return versionList;
	}

}