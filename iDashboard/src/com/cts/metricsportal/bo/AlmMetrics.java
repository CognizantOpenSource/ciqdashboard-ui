/**
 * Cognizant Technology Solutions
 * 
 * @author 653731 
 */
package com.cts.metricsportal.bo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectTrendVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.ExecutionFuncUtilVO;
import com.cts.metricsportal.vo.ExecutionRegUtilVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.ReqTrendVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TCExecutionOwnerVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestCaseTrendVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExeTrendVO;
import com.cts.metricsportal.vo.TestExecutionVO;

public class AlmMetrics implements ITMMetrics{
	
	DateTimeCalc dateTimeCalc = new DateTimeCalc();
	
	static final Logger logger = Logger.getLogger(AlmMetrics.class);
	
	
	/** This Service will return the total requirement details.
	 * Total Requirement - Date Filter
	 * 
	 *@param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return totalReq
	 * @throws ParseException 
	 */
	public long getRequirementCountFilter(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod)
			throws JsonMappingException, BadLocationException, ParseException {

		long totalreq = 0;
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		// End of the check value

		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,
				projectName);
		
		//List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		
		if(authToken) {
			totalreq = AlmMongoOperations.getRequirementCountFilter(startDate, endDate, dates, dateBefore7Days, levelIdList);
		}
		return totalreq;
		
	}
	
	/** This Service will return the Status Trend chart on load.
	 * 
	 *@param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return trendvoList
	 * @throws ParseException 
	 */
	
	public List<ReqTrendVO> getRequirementTrendChart(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto, String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
		
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName, projectName);
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			 
			ReqTrendVO reqtrendvo = new ReqTrendVO();
			List<ReqTrendVO> trendvolist = new ArrayList<ReqTrendVO>();
				if(authToken){
					List<RequirementStatusVO> result = AlmMongoOperations.getRequirementTrendChart(startDate, endDate, dates, dateBefore7Days, levelIdList);
				
					for (int i = 0; i < result.size(); i++) {
					
						int iBlocked = 0;
						int iFailed = 0;
						int iNotApplicable = 0;
						int iNoRun = 0;
						int iNotCompleted = 0;
						int iNotCovered = 0;
						int iPassed = 0;
						int iNoStatus = 0;

						List<RequirementStatusVO> result1 = null;
						RequirementStatusVO  info = result.get(i);
					
						result1 = AlmMongoOperations.getRequirementTrendChartFinal(startDate, endDate, dates, dateBefore7Days, levelIdList, info);
						Date dateString = result.get(i).getCreationTime();

						reqtrendvo = new ReqTrendVO();
						try {
							for (int j = 0; j < result1.size(); j++) {

								if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.BLOCKED)) {
									iBlocked = result1.get(j).getStatusCnt();
									reqtrendvo.setBlocked(iBlocked);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.FAILED)) {
									iFailed = result1.get(j).getStatusCnt();
									reqtrendvo.setFailed(iFailed);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.NOT_APPLICABLE)) {
									iNotApplicable = result1.get(j).getStatusCnt();
									reqtrendvo.setNotapplicable(iNotApplicable);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.NO_RUN)) {
									iNoRun = result1.get(j).getStatusCnt();
									reqtrendvo.setNorun(iNoRun);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.NOT_COMPLETED)) {
									iNotCompleted = result1.get(j).getStatusCnt();
									reqtrendvo.setNotcompleted(iNotCompleted);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.NOT_COVERED)) {
									iNotCovered = result1.get(j).getStatusCnt();
									reqtrendvo.setNotcovered(iNotCovered);
								}

								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.PASSED)) {
									iPassed = result1.get(j).getStatusCnt();
									reqtrendvo.setPassed(iPassed);
								}
								
								else if (result1.get(j).getStatus().equalsIgnoreCase(IdashboardConstantsUtil.EMPTY)) {
									iNoStatus = result1.get(j).getStatusCnt();
									reqtrendvo.setNostatus(iNoStatus);
								}

							}
					} catch (Exception e) {
						logger.error("exception caught" + e.getMessage());
					}
					Date date = dateString;
					SimpleDateFormat formatter = new SimpleDateFormat(IdashboardConstantsUtil.YYYY_MM_DD);
					String format = formatter.format(date);
					String strExistingFlag = "False";

					for (ReqTrendVO chartVO : trendvolist) {
						String strDate = chartVO.getDate();
						
						if (strDate.equals((format))) {
							chartVO.setBlocked(iBlocked + chartVO.getBlocked());
							chartVO.setFailed(iFailed + chartVO.getFailed());
							chartVO.setNotapplicable(iNotApplicable
									+ chartVO.getNotapplicable());
							chartVO.setNorun(iNoRun + chartVO.getNorun());
							chartVO.setNotcompleted(iNotCompleted
									+ chartVO.getNotcompleted());
							chartVO.setNotcovered(iNotCovered
									+ chartVO.getNotcovered());
							chartVO.setPassed(iPassed + chartVO.getPassed());
							chartVO.setNostatus(iNoStatus + chartVO.getNostatus());

							strExistingFlag = "True";
							break;
						}
					}
					if (strExistingFlag.equalsIgnoreCase(IdashboardConstantsUtil.FALSE)) {
						reqtrendvo.setDate(format);
						reqtrendvo.setMydate(dateString);
						trendvolist.add(reqtrendvo);
					}
				}
				
			}
		return trendvolist;
	}
	
	/** This Service Returns the "Requirement Status" Details in Each Bar.
	 * 
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return dailyStatus
	 * @throws ParseException 
	 */
	public List<RequirementStatusVO> getRequirementBarChart(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
		List<RequirementStatusVO> dailyStatus = null;
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(
				dashboardName, userId, domainName, projectName);
		if(authToken){
			dailyStatus = AlmMongoOperations.getRequirementBarChart(startDate, endDate, dates, dateBefore7Days, levelIdList);
			
		}
		return dailyStatus;
		
	}
	/** This Service will return the Priority details.
	 * 
	 * @param dashboardName
	 * @param domainName
	 * @param projectName
	 * @param vardtfrom
	 * @param vardtto
	 * @param timeperiod
	 * 
	 * @return priorityResult
	 * @throws ParseException 
	 */
	public List<RequirementStatusVO> getRequirementPriorityChartFilter(String authString,String dashboardName,String domainName,String projectName,String vardtfrom,
			String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			
			List<RequirementStatusVO> priorityresult = null;
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName, projectName);
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			if(authToken) {
				priorityresult = AlmMongoOperations.getRequirementPriorityChartFilter(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
		return priorityresult;
	}
	
	public List<RequirmentVO> getRequirementRecords(String authString,int itemsPerPage,int startIndex,String dashboardName,String domainName,
			String projectName,String vardtfrom, String vardtto, String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
			
			List<RequirmentVO> reqAnalysisList = null;
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
		/*
		 * List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(
		 * dashboardName, userId, domainName, projectName);
		 */
			
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			
			if(authToken){
				reqAnalysisList = AlmMongoOperations.getRequirementRecords(startDate, endDate, dates, dateBefore7Days, levelIdList, itemsPerPage, startIndex);
			}
			
			return reqAnalysisList;
	}
	
	public long getRequirementVolatilityFilter(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod)
			throws JsonParseException, JsonMappingException, BadLocationException, ParseException {

		long reqResult = 0;
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(
				dashboardName, userId, domainName, projectName);
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken){
			reqResult = AlmMongoOperations.getRequirementVolatilityFilter(startDate, endDate, dates, dateBefore7Days, levelIdList);
		}
		
		return reqResult;
	}
	
	public long getRequirementLeakFilter(String authString,String dashboardName,String domainName,String projectName, String vardtfrom,String vardtto,String timeperiod
			) throws JsonParseException,JsonMappingException, BadLocationException, ParseException {
		
			long reqLeak = 0;
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName, projectName);
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
				if(authToken){
					reqLeak = AlmMongoOperations.getRequirementLeakFilter(startDate, endDate, dates, dateBefore7Days, levelIdList);
				}
				return reqLeak;
	}
	
	public List<RequirmentVO> getRequirementRecordsAnalyseLevel(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod)
			throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
		List<RequirmentVO> reqAnalyzedataLevel = null;
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,projectName);
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		reqAnalyzedataLevel = AlmMongoOperations.getRequirementRecordsAnalyseLevel(startDate, endDate, dates, dateBefore7Days, levelIdList);
		
		return reqAnalyzedataLevel;
	}
	
	public long getReqCount(String authString,String dashboardName,String domainName,String projectName,String vardtfrom,String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
			long totalReq = 0;
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(
					dashboardName, userId, domainName, projectName);
			if(authToken){
			
				totalReq = AlmMongoOperations.getReqCount(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return totalReq;
	}
	
	public long getSearchPageCount(String authString,String releaseName,int reqID,String reqName,String description,String reqType,String status, String priority,String dashboardName, String domainName,
			String projectName,String vardtfrom,  String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
		long pageCount = 0;
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(
				dashboardName, userId, domainName, projectName);
		
		
		if(authToken){
			pageCount = AlmMongoOperations.getSearchPageCount(releaseName,reqID, reqName, description, reqType, status, priority, startDate, endDate, dates, dateBefore7Days, levelIdList);
		}
		return pageCount;
		
	}
	
	public List<RequirmentVO> getRequirementSearchReq(String authString, String releaseName,int reqID,String reqName,String description,
			String reqType,String status,String priority, int itemsPerPage,int startIndex,String dashboardName,
			String domainName,String projectName, String vardtfrom,  String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
			List<RequirmentVO> searchResult = null;
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName, projectName);
			
			Map<String, String> searchvalues = new HashMap<String, String>();
			
			
			searchvalues.put("releaseName", releaseName);
            searchvalues.put("reqName", reqName);
            searchvalues.put("description", description);
            searchvalues.put("reqType", reqType);
            searchvalues.put("status", status);
            searchvalues.put("priority", priority);
            
            if(authToken)
            {
            	searchResult = AlmMongoOperations.getRequirementSearchReq(reqID, itemsPerPage, startIndex, startDate, endDate, dates, dateBefore7Days, levelIdList, searchvalues);
            }
            return searchResult;	
	}
	
	public List<RequirmentVO> getRecords(String authString,String sortvalue,int itemsPerPage,int startIndex,boolean reverse,
			String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
			JsonMappingException, BadLocationException, ParseException {
			List<RequirmentVO> reqAnalyzedata = null;

			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName, projectName);
				if(authToken){
					reqAnalyzedata = AlmMongoOperations.getRecords(sortvalue, reverse, itemsPerPage, startIndex, startDate, endDate, dates, dateBefore7Days, levelIdList);
				}
				return reqAnalyzedata;
	}
	public long getReqPassCount(String authString,String dashboardName,String domainName,String projectName)
			throws JsonParseException, JsonMappingException, BadLocationException {
		long totalpassreq = 0;
		
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domainName,projectName);
		
		totalpassreq = AlmMongoOperations.getReqPassCount(levelIdList);
		return totalpassreq;
	}
/*
 * ALM Requirements End here
 * @see com.cts.metricsportal.bo.ITMMetrics#getTotalDefectCountFilter(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
 */
	/*
	 * ALM Execution Design here
	 * */
	public long getTotalTestCountFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long testCount =0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken){		
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				testCount = AlmMongoOperations.getTotalTestCountFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			
		}
		return testCount;
	}

	public long getDesignCoverageFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long designcovg=0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				designcovg = AlmMongoOperations.getDesignCoverageFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return designcovg;
	}

	public long getAutoCoverageFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long acresult = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				acresult = AlmMongoOperations.getAutoCoverageFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return acresult;
	}

	public List<TestCaseVO> getRecordsLevel(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseVO> executionAnalyzedataLevel=null;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				executionAnalyzedataLevel = AlmMongoOperations.getRecordsLevelQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		if(executionAnalyzedataLevel != null && !executionAnalyzedataLevel.isEmpty())
			return executionAnalyzedataLevel;
		return executionAnalyzedataLevel;
		
	}
	
	// FunctionalUtilizaitonChart - Trend Grpah
		public List<ExecutionFuncUtilVO> getFunctionalUtilChart(String authString, String dashboardName, String domainName,
				String projectName, String vardtfrom, String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			List<ExecutionFuncUtilVO> result = null;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			// List<String> levelIdList =
			// AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
			// domainName,
			// projectName);

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

			if (operationalAccess) {
				result = AlmMongoOperations.getFunctionalUtilChart(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return result;
		}

		// RegressionUtilizaitonChart - Trend Grpah
		public List<ExecutionRegUtilVO> getRegressionChart(String authString, String dashboardName, String domainName,
				String projectName, String vardtfrom, String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			List<ExecutionRegUtilVO> result = null;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			// List<String> levelIdList =
			// AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
			// domainName,
			// projectName);

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

			if (operationalAccess) {
				result = AlmMongoOperations.getRegressionUtilChart(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return result;
		}


	public List<TestCaseTrendVO> getTestCaseTrendchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseTrendVO> trendvolist=null;
	

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		 if(authToken){
			 try {
				 List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				trendvolist = AlmMongoOperations.getTestCaseTrendchartQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			 
		 }
		 if(trendvolist != null && !trendvolist.isEmpty())
				return trendvolist;
		return trendvolist;
	}

	public List<TestCaseStatusVO> getdesignstatus(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseStatusVO> result=null;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				result = AlmMongoOperations.getdesignstatusQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		if(result != null && !result.isEmpty())
			return result;
	
		return result;
	}

	public List<TestCaseStatusVO> getdesigntype(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseStatusVO> result=null;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
    	if(authToken){
    		try {
    			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				result = AlmMongoOperations.getdesigntypeQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
    	}
    	if(result != null && !result.isEmpty())
			return result;
	
		return result;
    	
	}

	public List<TestCaseStatusVO> getdesignowner(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseStatusVO> result=null;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
	if(authToken){
		try {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
			result = AlmMongoOperations.getdesignownerQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
	}
	if(result != null && !result.isEmpty())
		return result;
	return result;
	
	
	}

	public List<TestCaseVO> getRecordstc(String authString, int itemsPerPage, int startIndex, String dashboardName,
			String domainName, String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<TestCaseVO> desAnalysisList=null;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(authToken){
			try {
				/*
				 * List<String> levelIdList =
				 * AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
				 * projectName); reqAnalysisList =
				 * AlmMongoOperations.getRecordstcQuery(dashboardName, userId, domainName,
				 * projectName, startDate, endDate, dateBefore7Days, dates, itemsPerPage,
				 * startIndex, levelIdList);
				 */
				List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				desAnalysisList = AlmMongoOperations.getRecordstcQuery(dashboardName, userId, domainName, projectName,
						startDate, endDate, dateBefore7Days, dates, itemsPerPage, startIndex, levelIdList);
			
			
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		if(desAnalysisList != null && !desAnalysisList.isEmpty())
			return desAnalysisList;
		return desAnalysisList;
	}

	public long getTotalTestCountinitial(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long testCount =0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			if(authToken){
				try {
				/*List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
						projectName);*/
				List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				testCount = AlmMongoOperations.getTotalTestCountinitialQuery(dashboardName, userId, domainName,
						projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					logger.error(e.getMessage());
				}
			}
			return testCount;
			
	}

	public long getDesignCoverage(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		
		long designcovg=0;
   		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				designcovg = AlmMongoOperations.getDesignCoverageQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return designcovg;
		
	}

	public long getAutoCoverageinitial(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long acresult = 0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(authToken){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName, projectName);
				acresult = AlmMongoOperations.getAutoCoverageinitialQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return acresult;
		
	}
/*
 * Alm Design ends here
 */
	
	/*
	 * Alm Execution Starts here
	 */

	public long getTcCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod)
			throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			long totalTcExeCount=0;
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		// List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,domainName, projectName);
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				
			if(authToken){
				totalTcExeCount = AlmMongoOperations.getTcCount(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return totalTcExeCount;
	}
	
	public long getManualCount(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
		JsonMappingException, BadLocationException, ParseException{
			long totalmanualCount=0;
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
			
			if(authToken){
				totalmanualCount = AlmMongoOperations.getManualCount(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return totalmanualCount;
	}
	
	public long getAutoCount(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,
			String timeperiod) throws JsonParseException, JsonMappingException, BadLocationException, ParseException{
			long totalautoCount=0;
			
			boolean authToken = LayerAccess.authenticateToken(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			List<String> levelIdList = AlmMongoOperations. getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			if(authToken){
				totalautoCount = AlmMongoOperations.getAutoCount(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return totalautoCount;
	}

	public long getTcCoverage(String authString,String dashboardName,String domainName,String projectName,String vardtfrom,String vardtto,String timeperiod) throws JsonParseException,
		JsonMappingException, BadLocationException, ParseException{
		long reqResult =0;
		
		boolean authToken = LayerAccess.authenticateToken(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(authToken) {
			long tcsexecuted = AlmMongoOperations.getTcExec(startDate, endDate, dates, dateBefore7Days, levelIdList);
			long tcsplannedtoexecute = AlmMongoOperations.getTcPlan(startDate, endDate, dates, dateBefore7Days, levelIdList);
			
			 if(tcsexecuted>0 && tcsplannedtoexecute>0)
				 reqResult = tcsexecuted * 100 / tcsplannedtoexecute;
		}
		return reqResult;
	}
	
	public long firstTimePass(String authString, String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
	JsonMappingException, BadLocationException, ParseException{
		long reqResult =0;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		 List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		 if(operationalAccess){
			 //reqResult = AlmMongoOperations.firstTimePass(startDate, endDate, dates, dateBefore7Days, levelIdList);
			 List<Long> reqResultlist = AlmMongoOperations.firstTimePass(startDate, endDate, dates, dateBefore7Days,
						levelIdList);
				reqResult = reqResultlist.get(2);
		 }
		return reqResult;
	}
	
	public long FuncationalAutomation(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod)
			throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
		long reqResult = 0;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
		if (operationalAccess) {
			reqResult = AlmMongoOperations.FuncationalAutomation(startDate, endDate, dates, dateBefore7Days,
					levelIdList);
		}
		return reqResult;
	}
	
	// Regression Automation

		public long RegressionAutomation(String authString, String dashboardName, String domainName, String projectName,
				String vardtfrom, String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			long reqResult = 0;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			if (operationalAccess) {
				reqResult = AlmMongoOperations.RegressionAutomation(startDate, endDate, dates, dateBefore7Days,
						levelIdList);
			}
			return reqResult;
		}

		// End of Regression automation
		
		// UAT Automation

		public long UATAutomation(String authString, String dashboardName, String domainName, String projectName,
				String vardtfrom, String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			long reqResult = 0;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			if (operationalAccess) {
				reqResult = AlmMongoOperations.UATAutomation(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return reqResult;
		}

		// End of UAT Automation
	
	public long errorDiscovery1(String authString,String dashboardName,String domainName,String projectName,String vardtfrom,String vardtto,String timeperiod)throws BadLocationException, ParseException, JsonParseException {
		 	long reqResult = 0;
			
			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			if(operationalAccess){
				reqResult = AlmMongoOperations.errorDiscovery1(startDate, endDate, dates, dateBefore7Days, levelIdList);
			}
			return reqResult;
	}

	 public  List<TestExeStatusVO> getTcExeStatusbarchart(String authString,String dashboardName,String domainName, String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
	 	JsonMappingException, BadLocationException, ParseException{
		List<TestExeStatusVO> result=null;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
					 List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
					 
			 	 if(operationalAccess){
			 		 result = AlmMongoOperations.getTcExeStatusbarchart(startDate, endDate, dates, dateBefore7Days, levelIdList);
			 	 }
				return result;
	 }
	 
	 public  List<TCExecutionOwnerVO> getTcExeOwnerChart(String authString,String dashboardName,String domainName,String projectName,String vardtfrom,String vardtto,String timeperiod) throws JsonParseException,
	 	JsonMappingException, BadLocationException, ParseException{
			 List<TCExecutionOwnerVO> result=null;
			 
			 boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
				String userId = LayerAccess.getUser(authString);
				
				String owner="";
				
				//Check the Dashboard is set as public
				owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
			 List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
			 
			 Date startDate = dateTimeCalc.getStartDate(vardtfrom);
				Date endDate = dateTimeCalc.getEndDate(vardtto);
				Date dates = new Date();
				Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
				
				if(operationalAccess){
					result = AlmMongoOperations.getTcExeOwnerChart(startDate, endDate, dates, dateBefore7Days, levelIdList);
				}
				return result;
	 }
	 
	 public List<TestExeTrendVO> getTestExecutionTrendchart(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonMappingException, BadLocationException, ParseException {
		 List<TestExeTrendVO> trendvolist=null;
		 
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
			
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			if(operationalAccess){
				 List<TestExeStatusVO> result  = AlmMongoOperations.getTestExecutionTrendchart(startDate, endDate, dates, dateBefore7Days, levelIdList);
				 TestExeTrendVO tctrendvo;
				 trendvolist = new ArrayList<TestExeTrendVO>();
				 for (int i = 0; i < result.size(); i++) {
					
					int failedCnt = 0;
					int passedCnt = 0;
					int norunCnt = 0;
					int notcompletedCnt = 0;
					int nostatus = 0;
					int blockedCnt= 0;
					int notapplicableCnt=0;
					
					Date dateString = result.get(i).getTestExecutionDate();
					List<TestExeStatusVO> result1 = AlmMongoOperations.getTestExecutionTrendchartFinal(levelIdList, dateString);
					tctrendvo = new TestExeTrendVO();
					 
					 try{
						 	for (int j = 0; j < result1.size(); j++)
						 	{
						 		if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.FAILED)) {
									failedCnt = result1.get(j).getStatuscount();
									tctrendvo.setFailedCnt(failedCnt);
								} 
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.PASSED)) {
									passedCnt = result1.get(j).getStatuscount();
									tctrendvo.setPassedCnt(passedCnt);
								} 
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.NO_RUN)) {
									norunCnt = result1.get(j).getStatuscount();
									tctrendvo.setNorunCnt(norunCnt);
								} 
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.NOT_COMPLETED)) {
									notcompletedCnt = result1.get(j).getStatuscount();
									tctrendvo.setNotcompletedCnt(notcompletedCnt);
								}
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.EMPTY)) {
									nostatus = result1.get(j).getStatuscount();
									tctrendvo.setNostatus(nostatus);
								} 
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.BLOCKED)) {
									blockedCnt = result1.get(j).getStatuscount();
									tctrendvo.setBlockedCnt(blockedCnt);
								} 
								else if (result1.get(j).getTestExecutionStatus().equalsIgnoreCase(IdashboardConstantsUtil.NOT_APPLICABLE)) {
									notapplicableCnt = result1.get(j).getStatuscount();
									tctrendvo.setNotapplicable(notapplicableCnt);
								}
							}
							
							Date date =  dateString;
							SimpleDateFormat formater = new SimpleDateFormat(IdashboardConstantsUtil.YYYY_MM_DD);
							String format = formater.format(date);			
							
							String strExistingFlag = "False";
							
							for (TestExeTrendVO chartVO : trendvolist)
							{
								String strDate = chartVO.getTestExecutionDate();
								if(strDate.toString().equals((format.toString())))
								{
									chartVO.setFailedCnt(failedCnt+chartVO.getFailedCnt());
									chartVO.setPassedCnt(passedCnt+chartVO.getPassedCnt());
									chartVO.setNorunCnt(norunCnt+chartVO.getNorunCnt());
									chartVO.setNotcompletedCnt(notcompletedCnt+chartVO.getNotcompletedCnt());
									chartVO.setNostatus(nostatus+chartVO.getNostatus());
									chartVO.setBlockedCnt(blockedCnt+chartVO.getBlockedCnt());
									chartVO.setNotapplicable(notapplicableCnt+chartVO.getNotapplicable());
									
									strExistingFlag = "True";
									break;
								}
							}
							
							if (strExistingFlag.equalsIgnoreCase(IdashboardConstantsUtil.FALSE)) {
								tctrendvo.setTestExecutionDate(format);
								tctrendvo.setIsodate(dateString);
								trendvolist.add(tctrendvo);
							}
					}
					catch(Exception e){
						e.printStackTrace();
					}		
				}
					
			}
		return trendvolist;
			 
	 }
	 
	 public List<TestExecutionVO> getExecRecords(String authString,String dashboardName,String domainName, String projectName,String vardtfrom,String vardtto,String timeperiod
				) throws JsonParseException, JsonMappingException, BadLocationException, ParseException{
			List<TestExecutionVO> executionAnalyzedata=null;
			
			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			
			//List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			
			if(operationalAccess) {
				executionAnalyzedata = AlmMongoOperations.getExecRecords(startDate, endDate, dates, dateBefore7Days, levelIdList);
				
			}
			return executionAnalyzedata;
	 }
	 
	 public List<TestExecutionVO> getRecordsTcExe(String authString, int itemsPerPage, int startIndex,
				String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto,
				String timeperiod) throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			List<TestExecutionVO> tcexetabledetails = null;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			/*List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
					projectName);*/
			
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

			if (operationalAccess) {
				tcexetabledetails = AlmMongoOperations.getRecordsTcExe(itemsPerPage, startIndex, startDate, endDate, dates,
						dateBefore7Days, levelIdList);
			}
			return tcexetabledetails;
		}
	 
	 public List<TestExecutionVO> getExecutionRecords(String authString,String sortvalue,int itemsPerPage,int startIndex, boolean reverse, String dashboardName,String domainName,
				 String projectName,String vardtfrom,String vardtto, String timeperiod) throws JsonParseException,JsonMappingException,
				 BadLocationException, ParseException {
		 		List<TestExecutionVO> tcexeAnalyzedata=null;
		 		
		    	boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
				String userId = LayerAccess.getUser(authString);
				
				String owner="";
				
				//Check the Dashboard is set as public
				owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName, projectName);
				
				Date startDate = dateTimeCalc.getStartDate(vardtfrom);
				Date endDate = dateTimeCalc.getEndDate(vardtto);
				Date dates = new Date();
				Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
				
				if(operationalAccess){
					tcexeAnalyzedata = AlmMongoOperations.getExecutionRecords(sortvalue, itemsPerPage, startIndex, reverse, startDate, endDate, dates, dateBefore7Days, levelIdList);
				}
				return tcexeAnalyzedata;
	 }
	 
	 public long getExecutionSearchPageCount(String authString, String releaseName,String cycleName,int testID, String testName, 
				String testType, int testRunID, String testTester, String testExecutionStatus, String dashboardName, String domainName,
				String projectName, String vardtfrom, String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {		
					
			long pageCount=0;
	    	boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);
			
			String owner="";
			
			//Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if(owner != "") {
				userId = owner;
			}
			//End of the check value
			
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

//			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
//					projectName);
			
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			
			Map<String, String> searchvalues = new HashMap<String, String>();
			if (operationalAccess) {
				searchvalues.put("releaseName", releaseName);
				searchvalues.put("cycleName", cycleName);
				searchvalues.put("testName", testName);
				searchvalues.put("testType", testType);
				searchvalues.put("testTester", testTester);
				searchvalues.put("testExecutionStatus", testExecutionStatus);

//				pageCount = AlmMongoOperations.getExecutionSearchPageCount(testID, testName, testDescription, testType,
//						testTester, testExecutionStatus, startDate, endDate, dates, dateBefore7Days, levelIdList,
//						searchvalues);
				
				pageCount = AlmMongoOperations.getExecutionSearchPageCount(startDate, endDate, dates, dateBefore7Days, levelIdList,
						searchvalues);

			}
			return pageCount;
	 }
	 
	 public List<TestExecutionVO> getExecutionSearch(String authString, String releaseName,String cycleName,int testID, String testName, 
				String testType, int testRunID, String testTester, String testExecutionStatus, int itemsPerPage,
				int startIndex, String dashboardName, String domainName, String projectName, String vardtfrom,
				String vardtto, String timeperiod)
				throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
			List<TestExecutionVO> searchResult = null;

			boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
			String userId = LayerAccess.getUser(authString);

			String owner = "";

			// Check the Dashboard is set as public
			owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
			if (owner != "") {
				userId = owner;
			}
			// End of the check value

			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();
			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

//			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domainName,
//					projectName);
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
			
			Map<String, String> searchvalues = new HashMap<String, String>();

			if (operationalAccess) {
				searchvalues.put("releaseName", releaseName);
				searchvalues.put("cycleName", cycleName);
				searchvalues.put("testName", testName);
				searchvalues.put("testType", testType);
				searchvalues.put("testTester", testTester);
				searchvalues.put("testExecutionStatus", testExecutionStatus);

				searchResult = AlmMongoOperations.getExecutionSearch(itemsPerPage, startIndex, startDate, endDate, dates,
						dateBefore7Days, levelIdList, searchvalues);
			}
			return searchResult;

	 }
/*
 * ALM Execution ends here
 * */
	 
	 /*
		 * ALM Defects Starts here
		 * */
	@Override
	public long getTotalDefectCountFilter(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long defCount =0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
			if(operationalAccess){
				try {
					List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
					defCount = AlmMongoOperations.getTotalDefectCountFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					logger.error(e.getMessage());
				}
				
			}
			return defCount;
	}

	public int defectRejectionRateFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		int defRejRate = 0;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

		if (operationalAccess) {
			try {
//				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName,
//						projectName);
				List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				defRejRate = AlmMongoOperations.getdefectRejectionRateFilterQuery(dashboardName, userId, domainName,
						projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
			

		return defRejRate;

	}
	
	public int defectDesnsityFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner = "";

		// Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		int defDensity = 0;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

		if (operationalAccess) {
			try {
//				List<String> DefectlevelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId,
//						domainName, projectName);
				List<Integer> DefectlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				
				
//				List<String> TestExecutionlevelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName,
//						userId, domainName, projectName);
				
				List<Integer> TestExecutionlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				
//				List<String> TestExecutionlevelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName,
//						userId, domainName, projectName);
				
				
				defDensity = AlmMongoOperations.getdefectDensityFilterQuery(dashboardName, userId, domainName,
						projectName, startDate, endDate, dateBefore7Days, dates, TestExecutionlevelIdList,
						DefectlevelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}

		return defDensity;

	}
	

	public List<DefectTrendVO> getDefecttrendchart(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException{
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value


		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		List<DefectTrendVO> trendvolist=null;
		if(operationalAccess){	
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				trendvolist = AlmMongoOperations.getDefecttrendchartQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(trendvolist != null && !trendvolist.isEmpty())
				return trendvolist;
		}		
		
			return trendvolist;		

	}

	public List<DefectStatusVO> getDefectbardashchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<DefectStatusVO> result=null;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				result = AlmMongoOperations.getDefectbardashchartQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(result != null && !result.isEmpty())
				return result;
		}		
		
			return result;		
	}

	public List<DefectStatusVO> getDefectenvchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<DefectStatusVO> result=null;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				result=AlmMongoOperations.getDefectenvchartQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(result != null && !result.isEmpty())
				return result;
			}
		return result;	
	}

	public List<DefectStatusVO> getDefectuserchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<DefectStatusVO> result=null;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				result=AlmMongoOperations.getDefectuserchartQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates,levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(result != null && !result.isEmpty())
			return result;
		}
	return result;
	}

	public List<DefectVO> getRecordsdef(String authString, int itemsPerPage, int startIndex, String dashboardName,
			String domainName, String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<DefectVO> defAnalysisList=null;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				defAnalysisList = AlmMongoOperations.getRecordsdefQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, itemsPerPage, startIndex, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
			if(defAnalysisList != null && !defAnalysisList.isEmpty())
				return defAnalysisList;
		}
		return defAnalysisList;
	}

	public long getTotalDefectCountinitial(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		long defCount =0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				defCount = AlmMongoOperations.getTotalDefectCountinitialQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return defCount;
	
	}

	public int defectRejectionRate(String authString, String dashboardName, String domainName, String projectName) {
		
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		int defRejRate = 0;
		try {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
			defRejRate=AlmMongoOperations.defectRejectionRateQuery(dashboardName, userId, domainName, projectName, levelIdList);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		return defRejRate;
		
	}
	
	public List<DefectVO> getRecords(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		
		//Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if(owner != "") {
			userId = owner;
		}
		//End of the check value
		
		List<DefectVO> srcFileAnalysisList = null;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domainName, projectName);
				srcFileAnalysisList = AlmMongoOperations.getRecordsQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dateBefore7Days, dates,levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		if(srcFileAnalysisList != null && !srcFileAnalysisList.isEmpty())
			return srcFileAnalysisList;
		return srcFileAnalysisList;
	}
	
	public long getTcCountForTable(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod)
			throws JsonParseException, JsonMappingException, BadLocationException, ParseException {
		long totalTcExeCount = 0;

		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		// List<String> levelIdList =
		// AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
		// domainName, projectName);
		List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);

		if (operationalAccess) {
			totalTcExeCount = AlmMongoOperations.getTcCountForTable(startDate, endDate, dates, dateBefore7Days, levelIdList);
		}
		return totalTcExeCount;
	}
	
	
	
	public long getRegressionAutomationFilter(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);

		String owner = "";

		// Check the Dashboard is set as public
		owner = AlmMongoOperations.isDashboardsetpublic(dashboardName);
		if (owner != "") {
			userId = owner;
		}
		// End of the check value

		long acresult = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);

		if (operationalAccess) {
			try {
				/*List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domainName,
						projectName);*/
				List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domainName, projectName);
				acresult = AlmMongoOperations.getRegressionAutomationFilterQuery(dashboardName, userId, domainName,
						projectName, startDate, endDate, dates, dateBefore7Days, levelIdList);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				logger.error(e.getMessage());
			}
		}
		return acresult;
	}

	/*
	 * ALM Defects End here
	 * */
	
}
