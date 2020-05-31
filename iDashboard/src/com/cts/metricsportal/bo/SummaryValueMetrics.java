package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.dao.AlmMongoOperations;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.dao.OperationalMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.JiraRequirementStatusVO;
import com.cts.metricsportal.vo.RollupsheetVO;

public class SummaryValueMetrics implements MetricSummary {

	public String getMetricValue(int customTemplateMetricId, String authString, String dashboardName, String domain,
			String project, String vardtfrom, String vardtto, String rollingPeriod, long levelId)
			throws JsonParseException, JsonMappingException, NumberFormatException, BaseException, IOException,
			BadLocationException, ParseException {
		String finalMetricValue = null;
		DateTimeCalc dateTimeCalc = new DateTimeCalc();
		Date startDate = dateTimeCalc.getStartDate(vardtfrom);
		Date endDate = dateTimeCalc.getEndDate(vardtto);
		
		//Change in End Date
		
		Calendar calEndDate = Calendar.getInstance();
		calEndDate.setTime(endDate);		
		calEndDate.add(Calendar.DAY_OF_MONTH, 1);
        
        endDate = calEndDate.getTime();
		
		//Change in End Date
		
		
		Date dates = new Date();
		Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(rollingPeriod);
		String metricValue = null;
		// String userId = LayerAccess.getUser(authString);
		String userId = authString;

		if (customTemplateMetricId == 2001) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domain,
					project);
			long reqResult = OperationalMongoOperations.getRequirementVolatilityFilter(startDate, endDate, dates,
					dateBefore7Days, levelIdList);
			String reqResultPercent = Long.toString(reqResult);
			metricValue = reqResultPercent.concat(" %");
		}
		if (customTemplateMetricId == 2002) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domain,
					project);
			long totalReq = OperationalMongoOperations.getRequirementCountFilter(startDate, endDate, dates,
					dateBefore7Days, levelIdList);
			metricValue = Long.toString(totalReq);
		}

		if (customTemplateMetricId == 2003) {
			long exeCoverage = 0;
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
					project);
			long tcsexecuted = OperationalMongoOperations.getTcExec(startDate, endDate, dates, dateBefore7Days,
					levelIdList);
			long tcsplannedtoexecute = OperationalMongoOperations.getTcPlan(startDate, endDate, dates, dateBefore7Days,
					levelIdList);

			if (tcsexecuted > 0 && tcsplannedtoexecute > 0)
				exeCoverage = tcsexecuted * 100 / tcsplannedtoexecute;
			String exeCoveragePercent = Long.toString(exeCoverage);
			metricValue = exeCoveragePercent.concat(" %");
		}

		if (customTemplateMetricId == 2004) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domain,
					project);
			long designcovg = OperationalMongoOperations.getDesignCoverageFilterQuery(dashboardName, domain, project,
					startDate, endDate, dates, dateBefore7Days, levelIdList);
			String designcovgPercent = Long.toString(designcovg);
			metricValue = designcovgPercent.concat(" %");
		}

		if (customTemplateMetricId == 2005) {
			/*
			 * List<String> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domain,
			 * project); int defRejRate =
			 * OperationalMongoOperations.getdefectRejectionRateFilterQuery(dashboardName,
			 * domain, project, startDate, endDate, dateBefore7Days, dates,levelIdList);
			 * metricValue = Integer.toString(defRejRate);
			 */

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			List<Integer> defRejRate = OperationalMongoOperations.getdefectRejectionRateFilterQuery(dashboardName,
					domain, project, startDate, endDate, dateBefore7Days, dates, levelIdList);
			metricValue = Integer.toString(defRejRate.get(2)).concat(" % ");
		}

		if (customTemplateMetricId == 2007) {
			long openedCount = 0;
			long defecTotCount = 0;
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domain, project);
			openedCount = OperationalMongoOperations.getOpenDefectCount(levelIdList, dashboardName, userId,
					dateBefore7Days, dates);
			defecTotCount = OperationalMongoOperations.getTotalDefectCount(levelIdList, dashboardName, userId,
					dateBefore7Days, dates);
			long bugOpenRate = 0;
			if (openedCount > 0 && defecTotCount > 0) {
				// bugOpenRate = (openedCount * 100 / defecTotCount);
				bugOpenRate = Math.round(((double) openedCount * 100) / ((double) defecTotCount));
			} else {
				bugOpenRate = 0;
			}
			
			metricValue = Long.toString(bugOpenRate) + "%";
		}

		if (customTemplateMetricId == 2009) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdRequirement(dashboardName, userId, domain,
					project);
			long reqLeak = OperationalMongoOperations.getRequirementLeakFilter(startDate, endDate, dates,
					dateBefore7Days, levelIdList);
			metricValue = Long.toString(reqLeak);
		}

		if (customTemplateMetricId == 2010) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domain,
					project);
			long acresult = OperationalMongoOperations.getAutoCoverageFilterQuery(dashboardName, domain, project,
					startDate, endDate, dates, dateBefore7Days, levelIdList);
			String acresultPercent = Long.toString(acresult);
			metricValue = acresultPercent.concat(" %");
		}

		if (customTemplateMetricId == 2012) {
			/*
			 * List<String> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project); long firstPassRate = 0; long tcsexecuted =
			 * OperationalMongoOperations.getTcExec(startDate, endDate, dates,
			 * dateBefore7Days, levelIdList); long tcsplannedtoexecute =
			 * OperationalMongoOperations.getTcPlan(startDate, endDate, dates,
			 * dateBefore7Days, levelIdList);
			 * 
			 * if(tcsexecuted>0 && tcsplannedtoexecute>0) firstPassRate = tcsexecuted * 100
			 * / tcsplannedtoexecute; String firstPassRatePercent =
			 * Long.toString(firstPassRate); metricValue =
			 * firstPassRatePercent.concat(" %");
			 */

			/*
			 * List<String> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */
			long firstPassRate = 0;
			List<Long> firstTimePass = new ArrayList<Long>();

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			firstTimePass = AlmMongoOperations.firstTimePass(startDate, dates, endDate, dateBefore7Days, levelIdList);

			/*
			 * long tcsexecuted = OperationalMongoOperations.getTcExec(startDate, endDate,
			 * dates, dateBefore7Days, levelIdList); long tcsplannedtoexecute =
			 * OperationalMongoOperations.getTcPlan(startDate, endDate, dates,
			 * dateBefore7Days, levelIdList);
			 * 
			 * if (tcsexecuted > 0 && tcsplannedtoexecute > 0) firstPassRate = tcsexecuted *
			 * 100 / tcsplannedtoexecute;
			 */
			String firstPassRatePercent = Long.toString(firstTimePass.get(2));
			metricValue = firstPassRatePercent.concat(" %");
			}
		
		if(customTemplateMetricId == 2013){
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			long errDiscovery = OperationalMongoOperations.errorDiscovery1(startDate, endDate, dates, dateBefore7Days,
					levelIdList);
			String errDiscoveryPercent = Long.toString(errDiscovery);
			metricValue = errDiscoveryPercent.concat(" %");
		}

		if (customTemplateMetricId == 2014) {
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domain, project);
			long bugReopenCount = OperationalMongoOperations.getreopenCountQuery(authString, dashboardName, domain,
					project, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(bugReopenCount);
			}
			
		if(customTemplateMetricId == 2015){
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domain, project);
			long totalUserStoryDefectCount = OperationalMongoOperations.getUserStoryDefectCount(authString,
					dashboardName, domain, project, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(totalUserStoryDefectCount);
			}
			
		if(customTemplateMetricId == 2016){
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domain, project);
			long bugClosedCount = OperationalMongoOperations.getDefClosedCountQuery(authString, dashboardName, domain,
					project, vardtfrom, vardtto, levelIdList);
			metricValue = Long.toString(bugClosedCount);
		}

		if (customTemplateMetricId == 2017) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domain,
					project);
			long defCount = OperationalMongoOperations.getTotalDefectCountFilterQuery(dashboardName, domain, project,
					startDate, endDate, dateBefore7Days, dates, levelIdList);
			metricValue = Long.toString(defCount);
		}

		if (customTemplateMetricId == 2019) {
//			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
//					project);
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			long totalTcExeCount = OperationalMongoOperations.getTcCount(startDate, endDate, dates, dateBefore7Days,
					levelIdList);
			metricValue = Long.toString(totalTcExeCount);
		}

		if (customTemplateMetricId == 2020) {
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domain,
					project);
			long totalUserStories = OperationalMongoOperations.getLifeUserStoryCount(authString, dashboardName, domain,
					project, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(totalUserStories);
		}

		if (customTemplateMetricId == 2021) {
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domain,
					project);
			List<JiraRequirementStatusVO> listStories;
			listStories = OperationalMongoOperations.gettotalStoryListQuery(authString, dashboardName, domain, project,
					dates, dateBefore7Days, levelIdList);
			long totalStoryPoint = 0;
			double dblTotalStoryPoints = 0;
			for (JiraRequirementStatusVO indvStory : listStories) {
				String indvStoryPoint = indvStory.getStoryPoints().toString();
				double dbStoryPoint = Double.parseDouble(indvStoryPoint);
				dblTotalStoryPoints = dblTotalStoryPoints + dbStoryPoint;
			}

			totalStoryPoint = (long) dblTotalStoryPoints;
			metricValue = Long.toString(totalStoryPoint);
		}

		if (customTemplateMetricId == 2022) {
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdDefects(dashboardName, userId, domain, project);
			long totBugsCount = OperationalMongoOperations.getTotalDefectCountQuery(authString, dashboardName, domain,
					project, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(totBugsCount);
		}

		if (customTemplateMetricId == 2023) {
			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domain,
					project);
			long testCount = OperationalMongoOperations.getTotalTestCountFilterQuery(dashboardName, domain, project,
					startDate, endDate, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(testCount);
		}

		if (customTemplateMetricId == 2025) {
			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			long totalIterations = OperationalMongoOperations.getUserStoryIterationCount(levelIdList);
			metricValue = Long.toString(totalIterations);
		}

		if (customTemplateMetricId == 2026) {
			List<String> levelIdList = JiraMetrics.getJiraGlobalLevelIdRequirements(dashboardName, userId, domain,
					project);
			long totalUSBacklog = OperationalMongoOperations.getInitIterationUserStoryBackLogCount(authString,
					dashboardName, domain, project, dates, dateBefore7Days, levelIdList);
			metricValue = Long.toString(totalUSBacklog);
		}

		if (customTemplateMetricId == 2027) {
			/*
			 * List<String> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);

			List<Long> uatPercent = OperationalMongoOperations.getUatPercent(startDate, endDate, dates, dateBefore7Days,
					levelIdList);
			String resultPercent = Long.toString(uatPercent.get(2));
			metricValue = resultPercent.concat(" %");
		}

		if (customTemplateMetricId == 2028) {
			/*
			 * List<String> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);

			List<Long> funcPercent = OperationalMongoOperations.getFunctionalPercent(startDate, dates, endDate,
					dateBefore7Days, levelIdList);
			String resultPercent = Long.toString(funcPercent.get(2));
			metricValue = resultPercent.concat(" %");
		}

		if (customTemplateMetricId == 2029) {
			/*
			 * List<Integer> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */

			List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			List<Long> regPercent = OperationalMongoOperations.getRegressionPercent(startDate, dates, endDate,
					dateBefore7Days, levelIdList);
			String resultPercent = Long.toString(regPercent.get(2));
			metricValue = resultPercent.concat(" %");

		}

		if (customTemplateMetricId == 2030) {
			/*
			 * List<String> DefectlevelIdList =
			 * AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domain,
			 * project); List<String> TestExecutionlevelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */

			List<Integer> DefectlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
			List<Integer> TestExecutionlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain,
					project);

			List<Long> defdensityCount = OperationalMongoOperations.getDefectDensityrQuery(dashboardName, domain,
					project, startDate, endDate, dateBefore7Days, dates, TestExecutionlevelIdList, DefectlevelIdList);

			String resultPercent = Long.toString(defdensityCount.get(2));
			metricValue = resultPercent.concat(" %");
		}

		if (customTemplateMetricId == 2031) {
			/*
			 * List<Integer> levelIdList =
			 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
			 * project);
			 */

			List<String> levelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId, domain,
					project);
			List<Long> regautomationPercent = OperationalMongoOperations.getRegressionAutomationFilterQuery(
					dashboardName, userId, domain, project, startDate, endDate, dateBefore7Days, dates, levelIdList);
			String resultregPercent = Long.toString(regautomationPercent.get(2));
			metricValue = resultregPercent.concat(" %");
		}

		finalMetricValue = metricValue;
		return finalMetricValue;
	}

	public List<RollupsheetVO> getrollupsheetdetails(String userId, String dashboardName, String domain,
			String vardtfrom, String vardtto, String rollingPeriod, List<String> prjlevel)
			throws NumberFormatException, BaseException, BadLocationException, ParseException, IOException {

		List<String> summData = null;
		List<RollupsheetVO> rollupsheetlist = new ArrayList<RollupsheetVO>();

		try {

			DateTimeCalc dateTimeCalc = new DateTimeCalc();
			Date startDate = dateTimeCalc.getStartDate(vardtfrom);
			Date endDate = dateTimeCalc.getEndDate(vardtto);
			Date dates = new Date();

			Calendar c = Calendar.getInstance();

			String pattern = "yyyy-MM-dd";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

			dates = simpleDateFormat.parse(simpleDateFormat.format(c.getTime()));

			c.setTime(dates);
			c.add(Calendar.DATE, 1);
			dates = c.getTime();

			Date dateBefore7Days = dateTimeCalc.getDateForTimeperiod(rollingPeriod);

			for (int m = 0; m < prjlevel.size(); m++) {

				RollupsheetVO rollupsheet = new RollupsheetVO();
				String project;
				project = prjlevel.get(m);

				rollupsheet.setProject(project);

				// Total Execution Count
//				List<String> ExecutionlevelIdList = AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId,
//						domain, project);
				List<Integer> ExecutionlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
				long totalTcExeCount = OperationalMongoOperations.getTcCount(startDate, dates, endDate, dateBefore7Days,
						ExecutionlevelIdList);

				rollupsheet.setField1(Long.toString(totalTcExeCount));

				List<Integer> firstTimepasslevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain,
						project);
				List<Long> firstTimePass = AlmMongoOperations.firstTimePass(startDate, dates, endDate, dateBefore7Days,
						firstTimepasslevelIdList);

				rollupsheet.setField2(firstTimePass.get(0).toString());
				rollupsheet.setField3(firstTimePass.get(1).toString());
				rollupsheet.setField4(firstTimePass.get(2).toString() + "%");

				List<String> DesinglevelIdList = AlmMongoOperations.getGlobalLevelIdDesign(dashboardName, userId,
						domain, project);

				List<Long> regautomationPercent = OperationalMongoOperations.getRegressionAutomationFilterQuery(
						dashboardName, userId, domain, project, startDate, endDate, dateBefore7Days, dates,
						DesinglevelIdList);

				rollupsheet.setField5(regautomationPercent.get(0).toString());
				rollupsheet.setField6(regautomationPercent.get(1).toString());
				rollupsheet.setField7(regautomationPercent.get(2).toString() + "%");

				List<Integer> regressionautoutillevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId,
						domain, project);
				List<Long> funcPercent = OperationalMongoOperations.getFunctionalPercent(startDate, endDate, dates,
						dateBefore7Days, regressionautoutillevelIdList);

				rollupsheet.setField8(funcPercent.get(0).toString());
				rollupsheet.setField9(funcPercent.get(1).toString());
				rollupsheet.setField10(funcPercent.get(2).toString() + "%");

				List<Integer> levelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
				List<Long> regPercent = OperationalMongoOperations.getRegressionPercent(startDate, endDate, dates,
						dateBefore7Days, levelIdList);

				rollupsheet.setField11(regPercent.get(0).toString());
				rollupsheet.setField12(regPercent.get(1).toString());
				rollupsheet.setField13(regPercent.get(2).toString() + "%");

				List<Integer> UATlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain, project);
				List<Long> uatPercent = OperationalMongoOperations.getUatPercent(startDate, dates, endDate,
						dateBefore7Days, UATlevelIdList);

				rollupsheet.setField14(uatPercent.get(0).toString());
				rollupsheet.setField15(uatPercent.get(1).toString());
				rollupsheet.setField16(uatPercent.get(2).toString() + "%");

				// 1-13-2020 code changed
				/*
				 * List<String> defectrejlevelIdListrollup =
				 * AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domain,
				 * project);
				 */

				List<Integer> defectrejlevelIdListrollup = OperationalDAO.getGlobalLevelIds(dashboardName, userId,
						domain, project);

				List<Integer> defRejRaterollup = OperationalMongoOperations.getdefectRejectionRateFilterQuery(
						dashboardName, domain, project, startDate, endDate, dateBefore7Days, dates,
						defectrejlevelIdListrollup);

				rollupsheet.setField17(defRejRaterollup.get(0).toString());
				rollupsheet.setField18(defRejRaterollup.get(1).toString());
				rollupsheet.setField19(defRejRaterollup.get(2).toString() + "%");

				/*
				 * List<String> DefectlevelIdList =
				 * AlmMongoOperations.getGlobalLevelIdDefect(dashboardName, userId, domain,
				 * project); List<String> TestExecutionlevelIdList =
				 * AlmMongoOperations.getGlobalLevelIdExecution(dashboardName, userId, domain,
				 * project);
				 */

				List<Integer> DefectlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain,
						project);
				List<Integer> TestExecutionlevelIdList = OperationalDAO.getGlobalLevelIds(dashboardName, userId, domain,
						project);

				List<Long> defdensityCount = OperationalMongoOperations.getDefectDensityrQuery(dashboardName, domain,
						project, startDate, endDate, dateBefore7Days, dates, TestExecutionlevelIdList,
						DefectlevelIdList);

				rollupsheet.setField20(defdensityCount.get(0).toString());
				rollupsheet.setField21(defdensityCount.get(1).toString());
				rollupsheet.setField22(defdensityCount.get(2).toString() + "%");

				rollupsheetlist.add(rollupsheet);

			}

			return rollupsheetlist;
		} catch (Exception e) {
			return rollupsheetlist;
		}

	}

}
