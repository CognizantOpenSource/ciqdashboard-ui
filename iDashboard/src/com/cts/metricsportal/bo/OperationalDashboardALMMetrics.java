package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.ODALMMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.ArtifactsCountVO;
import com.cts.metricsportal.vo.DefectResolutionVO;
import com.cts.metricsportal.vo.RequirementStatusVO;

public class OperationalDashboardALMMetrics {
	DateTimeCalc dateTimeCalc = new DateTimeCalc();
	
	
	public long getReqCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner ="";
		long totalreq = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
				try {
					
					//Check the Dashboard is set as public
					owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
					if(owner != "") {
						userId = owner;
					}
					//End of the check value
					
					totalreq =  ODALMMongoOperations.getReqCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
			
			return totalreq;
			
	}

	public long getReqVolatilityFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner ="";
		
		long reqresult = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				reqresult =  ODALMMongoOperations.getReqVolatilityFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
	}	
		return reqresult;
		
	}

	public long getTotalTestCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner ="";
		
		long testCount =0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				testCount = ODALMMongoOperations.getTotalTestCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return testCount;
	}

	public long getDesignCoverageFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner = "";
		
		long designcovg=0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				designcovg = ODALMMongoOperations.getDesignCoverageFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
					
		}
		return designcovg;
	}

	public long getExecutionCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner ="";
		long totaltexecount=0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				
				totaltexecount = ODALMMongoOperations.getExecutionCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return totaltexecount;
		
	}

	public long getTcCoverage(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long reqresult =0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				reqresult = ODALMMongoOperations.getTcCoverageQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return reqresult;
	 
	}

	public long getTotalDefectCountinitial(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner ="";
		long defCount =0;
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
			if(operationalAccess ){
				try {
					
					//Check the Dashboard is set as public
					owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
					if(owner != "") {
						userId = owner;
					}
					//End of the check value
					
					defCount = ODALMMongoOperations.getTotalDefectCountinitialQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		return defCount;
	}

	public int defectRejectionRateFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		int defRejRate = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){	
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				defRejRate = ODALMMongoOperations.defectRejectionRateFilterrQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return defRejRate;
	}

	
	public long getReqPassCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner = "";
		long totalpassreq = 0;

		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				totalpassreq = ODALMMongoOperations.getReqPassCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return totalpassreq;
	}

	public long getDesignAutoCoverage(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long acresult = 0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				acresult = ODALMMongoOperations.getDesignAutoCoverageQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return acresult;
	}

	public long getManualCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long totalmanualcount=0;  
		
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				totalmanualcount = ODALMMongoOperations.getManualCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return totalmanualcount;
	}

	public long getAutoCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long totalautocount=0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				totalautocount = ODALMMongoOperations.getAutoCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return totalautocount;
	}

	public long getClosedDefectCount(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		long defCloseCount =0;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				defCloseCount = ODALMMongoOperations.getClosedDefectCountQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return defCloseCount;
	}

	public List<ArtifactsCountVO> getArtifactsCount(String authString, String dashboardName, String domainName,
			String projectName) {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		List<ArtifactsCountVO> finalresult = null;
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				finalresult = ODALMMongoOperations.getArtifactsCountQuery(dashboardName, userId, domainName, projectName);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return finalresult;
		
	}

	public List<RequirementStatusVO> getRequirementPiechartFilter(String authString, String dashboardName,
			String domainName, String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException {
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		List<RequirementStatusVO> priorityresult = null;
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(timeperiod);
		if(operationalAccess){
			try {
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				priorityresult = ODALMMongoOperations.getRequirementPiechartFilterQuery(dashboardName, userId, domainName, projectName, startDate, endDate, dates, dateBefore7Days);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(priorityresult != null && !priorityresult.isEmpty())
			return priorityresult;
		return priorityresult;
	}

	public List<DefectResolutionVO> getDefectResolutionTime(String authString, String dashboardName, String domainName,
			String projectName) {
		List<DefectResolutionVO> defResolTime=null;
		boolean operationalAccess = LayerAccess.getOperationalLayerAccess(authString);
		String userId = LayerAccess.getUser(authString);
		String owner="";
		if(operationalAccess){
			try {
				
				
				//Check the Dashboard is set as public
				owner = ODALMMongoOperations.isDashboardsetpublic(dashboardName);
				if(owner != "") {
					userId = owner;
				}
				//End of the check value
				
				defResolTime = ODALMMongoOperations. getDefectResolutionTimeQuery(dashboardName, userId,domainName,projectName);
			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if(defResolTime != null && !defResolTime.isEmpty())
			return defResolTime;
		return defResolTime;
	}
}
