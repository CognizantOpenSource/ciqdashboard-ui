package com.idashboard.lifecycle.daoImpl;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;

import com.idashboard.lifecycle.dao.JenkinsMongoInterface;
import com.idashboard.lifecycle.vo.BuildJobsVO;
import com.idashboard.lifecycle.vo.BuildListVO;
import com.idashboard.lifecycle.vo.BuildTotalVO;

public class JenkinsMongoOperationImpl extends BaseMongoOperation implements JenkinsMongoInterface{

		static final Logger logger = Logger.getLogger(JenkinsMongoOperationImpl.class);
			
			// ***************************************************************************************************/
			// Description : Convert the UTC (ISODate) to normal Date form
			// Function Name : ChangeDateformat
			// Input : ISODate as a input parameter
			// Output : Get General Date after conversion 
			// ***************************************************************************************************/

			private static String ChangeDateformat(Date dtparam) throws ParseException {

				String outparam = "";
				DateFormat datenew = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				outparam = datenew.format(dtparam);
				return outparam;

			}

			private static Query Jenkins_BuildQuery_GetBuildJobs() {
				String query = "{},{_id:0)";
				Query query1 = new BasicQuery(query);
				return query1;

			}

			public List<BuildJobsVO> Jenkins_ExecuteQuery_GetBuildJobs() {

				Query query1 = Jenkins_BuildQuery_GetBuildJobs();
				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();

				try {

					buildJobList = getMongoOperation().find(query1, BuildJobsVO.class);
					logger.info("Build Jobs Collection Data Size :" + buildJobList.size());

				} catch (Exception ex) {
					logger.error(ex.getMessage());
				} finally {

				}
				return buildJobList;
			}

			// ***************************************************************************************************/
			// Description : Get the Jenkins Build per day
			// Function Name : Jenkins_ExecuteQuery_GetBuildPeryDay
			// Input : Application Name
			// Output : Get Total Number of Builds for an Application Name
			// ***************************************************************************************************/

			public List<BuildTotalVO> Jenkins_ExecuteQuery_GetBuildPeryDay(String AppName) {

				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
				List<BuildListVO> buildls = new ArrayList<BuildListVO>();

				ArrayList<BuildTotalVO> buildperydayArray = new ArrayList<BuildTotalVO>();
				ArrayList<BuildTotalVO> TotalbuildperdayArray = new ArrayList<BuildTotalVO>();

				if (AppName.isEmpty()) {
					logger.warn(
							" Jenkins_ExecuteQuery_GetBuildPeryDay - ApplicationName is Empty Please Select ApplicationName");
				}

				try {

					long diff;
					double days;
					String cur_date = "";

					Query Qry = new Query();
					Qry.addCriteria(Criteria.where("jobName").is(AppName));
					buildJobList = getMongoOperation().find(Qry, BuildJobsVO.class);

					// Get build List from the buildjobs collection from Mongo DB
					buildls = buildJobList.get(0).getBuildList();

					int successCnt = 0;
					int failureCnt = 0;
					int totalbuild = 0;

					String _cdate = "";
					for (int x = buildls.size() - 1; x >= 0; x--) {

						String dtparsex = ChangeDateformat(buildls.get(x).getEndTime());

						SimpleDateFormat myFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); 
						DateTimeFormatter f = DateTimeFormatter.ofPattern("E MMM dd HH:mm:ss z uuuu").withLocale(Locale.US);

						cur_date = myFormat.format(new Date());

						Date date1 = myFormat.parse(dtparsex);
						Date date2 = myFormat.parse(cur_date);

						diff = date2.getTime() - date1.getTime();
						days = Math.floor((diff / (1000 * 60 * 60 * 24)));

						if (days <= 15) {

							ZonedDateTime zdt = ZonedDateTime.parse(date1.toString(), f);
							LocalDate ld = zdt.toLocalDate();
							DateTimeFormatter fLocalDate = DateTimeFormatter.ofPattern("uuuu-MM-dd");
							_cdate = ld.format(fLocalDate);
							String _sdate = "";

							for (int y = buildls.size() - 1; y >= 0; y--) {

								// Date Conversion
								String dtparsey = ChangeDateformat(buildls.get(y).getEndTime());

								Date date3 = myFormat.parse(dtparsey);
								ZonedDateTime zdt1 = ZonedDateTime.parse(date3.toString(), f);
								LocalDate ld1 = zdt1.toLocalDate();
								DateTimeFormatter fLocalDate1 = DateTimeFormatter.ofPattern("uuuu-MM-dd");
								_sdate = ld1.format(fLocalDate1);

								if (_cdate.equals(_sdate)) {

									if (buildls.get(y).getResult().equalsIgnoreCase("success")) {
										successCnt += 1;
									}

									if (buildls.get(y).getResult().equalsIgnoreCase("failure")
											|| buildls.get(y).getResult().equalsIgnoreCase("aborted")) {
										failureCnt += 1;
									}

								}

							}

							totalbuild = successCnt + failureCnt;

							BuildTotalVO buildperydaylist = new BuildTotalVO();
							buildperydaylist.setEndTime(_cdate);
							buildperydaylist.setFailureCnt(String.valueOf(failureCnt));
							buildperydaylist.setSuccessCnt(String.valueOf(successCnt));
							buildperydaylist.setTotalbuildcount(String.valueOf(totalbuild));

							buildperydayArray.add(buildperydaylist);
							totalbuild = 0;
							successCnt = 0;
							failureCnt = 0;

						}

					}

					String Date = "";
					String sCount = "";
					String fCount = "";
					String tCount = "";
					String pDate = "";

					for (int buildarr = 0; buildarr <= buildperydayArray.size(); buildarr++) {

						Date = buildperydayArray.get(buildarr).getEndTime();

						if (!pDate.equals(Date)) {

							fCount = buildperydayArray.get(buildarr).getFailureCnt();
							sCount = buildperydayArray.get(buildarr).getSuccessCnt();
							tCount = buildperydayArray.get(buildarr).getTotalbuildcount();

							BuildTotalVO updatetotalbuildperdaylist = new BuildTotalVO();
							updatetotalbuildperdaylist.setEndTime(Date);
							updatetotalbuildperdaylist.setFailureCnt(String.valueOf(fCount));
							updatetotalbuildperdaylist.setSuccessCnt(String.valueOf(sCount));
							updatetotalbuildperdaylist.setTotalbuildcount(String.valueOf(tCount));
							TotalbuildperdayArray.add(updatetotalbuildperdaylist);

							pDate = Date;
						}

					}

				} catch (Exception ex) {
					logger.error(ex.getMessage());

				} finally {

				}

				return TotalbuildperdayArray;
			}

			// ***************************************************************************************************/
			// Description : It list out the last 5 Builds with calculate the days using
			// endTime and CurrentDate
			// Function Name : Jenkins_ExecuteQuery_GetTotalBuild
			// Input : Application Name
			// Output : Get Total Number of Builds for an Application Name
			// ***************************************************************************************************/

			public List<BuildTotalVO> Jenkins_ExecuteQuery_GetTotalBuild(String AppName) {

				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
				List<BuildListVO> buildls = new ArrayList<BuildListVO>();

				ArrayList<BuildTotalVO> buildTotalArray = new ArrayList<BuildTotalVO>();
				ArrayList<BuildTotalVO> TotalbuildArray = new ArrayList<BuildTotalVO>();

				if (AppName.isEmpty()) {
					logger.warn(" Jenkins_ExecuteQuery_GetTotalBuild - ApplicationName is Empty Please Select ApplicationName");
				}

				try {

					long diff;
					double days;
					String cur_date = "";

					Query Qry = new Query();
					Qry.addCriteria(Criteria.where("jobName").is(AppName));
					buildJobList = getMongoOperation().find(Qry, BuildJobsVO.class);

					// Get build List from the buildjobs collection from Mongo DB
					buildls = buildJobList.get(0).getBuildList();

					int successCnt = 0;
					int failureCnt = 0;
					int totalbuild = 0;

					String _cdate = "";
					for (int x = buildls.size() - 1; x >= 0; x--) {

						// Date Conversion
						String dtparsex = ChangeDateformat(buildls.get(x).getEndTime());

						SimpleDateFormat myFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
						DateTimeFormatter f = DateTimeFormatter.ofPattern("E MMM dd HH:mm:ss z uuuu").withLocale(Locale.US);

						cur_date = myFormat.format(new Date());

						Date date1 = myFormat.parse(dtparsex);
						Date date2 = myFormat.parse(cur_date);

						diff = date2.getTime() - date1.getTime();
						days = Math.floor((diff / (1000 * 60 * 60 * 24)));

						if (days <= 15) {

							ZonedDateTime zdt = ZonedDateTime.parse(date1.toString(), f);
							LocalDate ld = zdt.toLocalDate();
							DateTimeFormatter fLocalDate = DateTimeFormatter.ofPattern("uuuu-MM-dd");
							_cdate = ld.format(fLocalDate);
							String _sdate = "";

							for (int y = buildls.size() - 1; y >= 0; y--) {

								// Date Conversion
								String dtparsey = ChangeDateformat(buildls.get(y).getEndTime());

								Date date3 = myFormat.parse(dtparsey);
								ZonedDateTime zdt1 = ZonedDateTime.parse(date3.toString(), f);
								LocalDate ld1 = zdt1.toLocalDate();
								DateTimeFormatter fLocalDate1 = DateTimeFormatter.ofPattern("uuuu-MM-dd");
								_sdate = ld1.format(fLocalDate1);

								if (_cdate.equals(_sdate)) {

									if (buildls.get(y).getResult().equalsIgnoreCase("success")) {
										successCnt += 1;
									}

									if (buildls.get(y).getResult().equalsIgnoreCase("failure")
											|| buildls.get(y).getResult().equalsIgnoreCase("aborted")) {
										failureCnt += 1;
									}

								}

							}

							totalbuild = successCnt + failureCnt;

							BuildTotalVO totalbuildlist = new BuildTotalVO();
							totalbuildlist.setEndTime(_cdate);
							totalbuildlist.setFailureCnt(String.valueOf(failureCnt));
							totalbuildlist.setSuccessCnt(String.valueOf(successCnt));
							totalbuildlist.setTotalbuildcount(String.valueOf(totalbuild));

							buildTotalArray.add(totalbuildlist);
							totalbuild = 0;
							successCnt = 0;
							failureCnt = 0;

						}

					}

					String Date = "";
					String sCount = "";
					String fCount = "";
					String tCount = "";
					String pDate = "";

					for (int buildarr = 0; buildarr <= buildTotalArray.size(); buildarr++) {

						Date = buildTotalArray.get(buildarr).getEndTime();

						if (!pDate.equals(Date)) {

							fCount = buildTotalArray.get(buildarr).getFailureCnt();
							sCount = buildTotalArray.get(buildarr).getSuccessCnt();
							tCount = buildTotalArray.get(buildarr).getTotalbuildcount();

							BuildTotalVO updatetotalbuildlist = new BuildTotalVO();
							updatetotalbuildlist.setEndTime(Date);
							updatetotalbuildlist.setFailureCnt(String.valueOf(fCount));
							updatetotalbuildlist.setSuccessCnt(String.valueOf(sCount));
							updatetotalbuildlist.setTotalbuildcount(String.valueOf(tCount));
							TotalbuildArray.add(updatetotalbuildlist);

							pDate = Date;
						}

					}

				} catch (Exception ex) {
					logger.error(ex.getMessage());
				} finally {

				}
				return TotalbuildArray;
			}

			// ***************************************************************************************************/
			// Description : It list out the last 5 Builds with calculate the days using
			// endTime and CurrentDate
			// Function Name : Jenkins_ExecuteQuery_GetLatestBuild
			// Input : Application Name
			// Output : Latest 5 Builds with BuildNummber and Days
			// ***************************************************************************************************/

			public List<BuildListVO> Jenkins_ExecuteQuery_GetLatestBuild(String AppName) {
				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
				List<BuildListVO> buildls = new ArrayList<BuildListVO>();

				// List<JSONObject> latestbuildlist = new ArrayList<JSONObject>();
				List<BuildListVO> latestbuildls = new ArrayList<BuildListVO>();

				if (AppName.isEmpty()) {
					logger.warn(
							" Jenkins_ExecuteQuery_GetLatestBuild - ApplicationName is Empty Please Select ApplicationName");
				}

				try {

					int noofbuilds = 0;
					String result;
					String buildNumber;
					Date endTime;
					String ndays;
					String buildUrl;

					// Get the Current Date
					String CurrentDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

					Query Qry = new Query();
					Qry.addCriteria(Criteria.where("jobName").is(AppName));
					buildJobList = getMongoOperation().find(Qry, BuildJobsVO.class);

					// Get build List from the buildjobs collection from Mongo DB
					buildls = buildJobList.get(0).getBuildList();

					// Get the latest builds
					noofbuilds = buildls.size() > 5 ? 5 : buildls.size();

					for (int x = noofbuilds - 1; x >= 0; x--) {

						result = buildls.get(x).getResult();
						buildNumber = buildls.get(x).getBuildNumber();
						endTime = buildls.get(x).getEndTime();
						buildUrl = buildls.get(x).getBuildUrl();

						// Date Conversion
						String dtparsex = ChangeDateformat(buildls.get(x).getEndTime());

						// Get the Date Difference from the EndTime of the Job with the
						// Current Date

						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
						Date BuildEndTime = sdf.parse(dtparsex);
						Date TodyDate = sdf.parse(CurrentDate);

						long diffInMillies = Math.abs(TodyDate.getTime() - BuildEndTime.getTime());
						long days = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);

						ndays = String.valueOf(days);

						BuildListVO b = new BuildListVO();
						b.setBuildNumber(buildNumber);
						b.setResult(result);
						b.setEndTime(endTime);
						b.setDuration(ndays);
						b.setBuildUrl(buildUrl);

						latestbuildls.add(b);

					}

				} catch (Exception ex) {
					logger.error(ex.getMessage());
				} finally {

				}
				return latestbuildls;
			}

			// ***************************************************************************************************/
			// Description : Get the Average Duration for the Build
			// Function Name : Jenkins_ExecuteQuery_GetAverageDurationBuild
			// Input : Application Name
			// Output : Average Duration for the builds
			// ***************************************************************************************************/

			public List<BuildTotalVO> Jenkins_ExecuteQuery_GetAverageBuildDuration(String AppName) {

				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
				List<BuildListVO> buildls = new ArrayList<BuildListVO>();

				ArrayList<BuildTotalVO> buildTotaldurationArray = new ArrayList<BuildTotalVO>();
				ArrayList<BuildTotalVO> TotalbuilddurationArray = new ArrayList<BuildTotalVO>();

				if (AppName.isEmpty()) {
					logger.warn(
							" Jenkins_ExecuteQuery_GetAverageBuildDuration - ApplicationName is Empty Please Select ApplicationName");
				}

				try {

					long diff;
					double days;
					String cur_date = "";

					Query Qry = new Query();
					Qry.addCriteria(Criteria.where("jobName").is(AppName));
					buildJobList = getMongoOperation().find(Qry, BuildJobsVO.class);

					// Get build List from the buildjobs collection from Mongo DB
					buildls = buildJobList.get(0).getBuildList();

					int successCnt = 0;
					int failureCnt = 0;
					int totalbuild = 0;

					String _cdate = "";
					Date endTime;
					Date startTime;

					long duration = 0;
					long minutes = 0;
					long diffInSeconds = 0;
					long ddiff = 0;
					double dlduration = 0.0000;
					double chkdur = 0.000;

					for (int x = buildls.size() - 1; x >= 0; x--) {

						// Date Conversion
						String dtparsex = ChangeDateformat(buildls.get(x).getEndTime());

						SimpleDateFormat myFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
						DateTimeFormatter f = DateTimeFormatter.ofPattern("E MMM dd HH:mm:ss z uuuu").withLocale(Locale.US);

						cur_date = myFormat.format(new Date());

						Date date1 = myFormat.parse(dtparsex);
						Date date2 = myFormat.parse(cur_date);

						diff = date2.getTime() - date1.getTime();
						days = Math.floor((diff / (1000 * 60 * 60 * 24)));

						if (days <= 15) {

							endTime = buildls.get(x).getEndTime();
							startTime = buildls.get(x).getStartTime();

							ZonedDateTime zdt = ZonedDateTime.parse(date1.toString(), f);
							LocalDate ld = zdt.toLocalDate();
							DateTimeFormatter fLocalDate = DateTimeFormatter.ofPattern("uuuu-MM-dd");
							_cdate = ld.format(fLocalDate);
							long buildduration=0;
							long avgduration=0;
							int totalbuilds=0;
							int totalbuildduration=0;
							
							// Total Builds
							totalbuilds=buildls.size();

							for (int y = buildls.size() - 1; y >= 0; y--) {
									
									buildduration=Long.parseLong(buildls.get(y).getDuration());
									totalbuildduration += buildduration;

							}
							
							//Calculate Average Duration
							avgduration = totalbuildduration / totalbuilds;
							
							dlduration = (avgduration / 1000);
							chkdur = dlduration / 60;
							chkdur = Double.parseDouble(new DecimalFormat("#.##").format(chkdur));

							BuildTotalVO totalbuilddurationlist = new BuildTotalVO();
							totalbuilddurationlist.setEndTime(_cdate);
							totalbuilddurationlist.setDuration(String.valueOf(chkdur));

							buildTotaldurationArray.add(totalbuilddurationlist);
							minutes = 0;

						}

					}

					String Date = "";
					String totalminutes = "";
					String pDate = "";

					for (int buildarr = 0; buildarr <= buildTotaldurationArray.size(); buildarr++) {

						Date = buildTotaldurationArray.get(buildarr).getEndTime();

						if (!pDate.equals(Date)) {

							totalminutes = buildTotaldurationArray.get(buildarr).getDuration();

							BuildTotalVO updatetotalbuilddurationlist = new BuildTotalVO();
							updatetotalbuilddurationlist.setEndTime(Date);
							updatetotalbuilddurationlist.setDuration(totalminutes);
							TotalbuilddurationArray.add(updatetotalbuilddurationlist);

							pDate = Date;
						}

					}

				} catch (Exception ex) {
					logger.error(ex.getMessage());
				} finally {

				}
				return TotalbuilddurationArray;
			}
			
			public List<BuildJobsVO> buildJobs( String authString) {
				List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
				String query = "{},{_id:0)";
				Query query1 = new BasicQuery(query);
				
					try {
						buildJobList = getMongoOperation().find(query1, BuildJobsVO.class);
					} catch (NumberFormatException | BaseException | BadLocationException e) {
						
						e.printStackTrace();
					}
					return buildJobList;
				
				
			}


		
}
