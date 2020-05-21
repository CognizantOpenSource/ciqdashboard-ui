package com.cts.metricsportal.bo;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;

import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.dao.ODALMMongoOperations;
import com.cts.metricsportal.dao.ODJiraMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.JiraRequirementStatusVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;

public class OperationalDashboardJIRAMetrics {
	static final Logger logger = Logger.getLogger(OperationalDashboardJIRAMetrics.class);
	DateTimeCalc dateTimeCalc = new DateTimeCalc();
	
	public long getReqCount(String authString, String dashboardName, String domainName, String projectName) {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long totalreq = 0;

		if (operationalAccess) {
			try {
				
				//Check the Dashboard is set as public
				owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				totalreq = ODJiraMongoOperations.getReqCountQuery(dashboardName, userId, domainName, projectName);
				logger.info("Total Requirement Count:"+totalreq);
			} catch (NumberFormatException | BaseException e) {
				// TODO Auto-generated catch block
				 logger.error(e.getMessage());
			}
		}
		return totalreq;
	}

	public long gettotalStoryCount(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) throws NumberFormatException, BaseException, BadLocationException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long totalStoryPoint = 0;
		List<JiraRequirmentVO> listStories;
		if (operationalAccess) {
			listStories = ODJiraMongoOperations.gettotalStoryListQuery(dashboardName, userId, domainName, projectName, startDate, endDate);
			double dblTotalStoryPoints = 0;
			for (JiraRequirmentVO indvStory : listStories) {
				long indvStoryPoint = indvStory.getStoryPoints();
				dblTotalStoryPoints = dblTotalStoryPoints + indvStoryPoint;
			}

			totalStoryPoint = (long) dblTotalStoryPoints;

		}
		return totalStoryPoint;
	}

	public long getTotalDefectCount(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long totDefCount = 0;
		
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		if (operationalAccess) {
			try {
				totDefCount = ODJiraMongoOperations.getTotalDefectCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate);
			} catch (NumberFormatException | BaseException e) {
				// TODO Auto-generated catch block
				 logger.error(e.getMessage());
			}
			
		}
		return totDefCount;
	}

	public long defectOpenRate(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) {
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		boolean operationalAccess = LayerAccess
				.getOperationalLayerAccess(authString);

		long defecTotCount = 0;
		long openedCount = 0;
		long defOpenRate = 0;

		if (operationalAccess) {
			List<String> levelIdList = null;
			try {
				try {
					levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(
							dashboardName, userId, domainName, projectName);
				} catch (BadLocationException e) {
					// TODO Auto-generated catch block
					logger.error(e.getMessage());
				}
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				 logger.error(e.getMessage());
			} catch (BaseException e) {
				// TODO Auto-generated catch block
				 logger.error(e.getMessage());
			}

			openedCount = ODJiraMongoOperations.getOpenDefectCount(levelIdList, startDate, endDate);
			defecTotCount = ODJiraMongoOperations.getTotalDefectCount(levelIdList, startDate, endDate);

			if (openedCount > 0 && defecTotCount > 0) {
				defOpenRate = (openedCount * 100 / defecTotCount);
			} else {
				defOpenRate = 0;
			}
			
		}
		return defOpenRate;

	}
	
	public long getTotalTestCountinitialdash(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto) {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		long testCount = 0;
		
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		if (operationalAccess) {
			try {
				testCount = ODJiraMongoOperations.getTotalTestCountinitialdashQuery(dashboardName, userId, domainName, projectName, startDate, endDate);
			} catch (NumberFormatException | BaseException e) {
				// TODO Auto-generated catch block
				 logger.error(e.getMessage());
			}
			
	}
		return testCount;
	}

	public long getUserStoryCount(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) {
		long totalUserStories = 0;
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		List<String> levelIdList = null;
		try {
			levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName, projectName);
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BaseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		if(operationalAccess){
			try {
				
				totalUserStories = ODJiraMongoOperations.getUserStoryCountQuery(levelIdList, startDate, endDate);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return totalUserStories;
	}

	public long getuserStorySprintCount(String authString,String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto) {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		Date startDate = null;	Date endDate = null;
		
		try {
			 startDate = dateTimeCalc.getStartDate(vardtfrom);
			 
			 endDate = dateTimeCalc.getEndDate(vardtto);
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long totalUserStoriesSprint = 0;
		List<String> levelIdList = null;
		try {
			levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domainName, projectName);
		} catch (NumberFormatException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BaseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}  //usedlevelId directly, different mongo collection
		
		if(operationalAccess){
			try {
				totalUserStoriesSprint = ODJiraMongoOperations.getuserStorySprintCountQuery(levelIdList, startDate, endDate);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return totalUserStoriesSprint;
	}

}
