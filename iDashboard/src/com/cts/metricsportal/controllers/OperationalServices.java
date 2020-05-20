package com.cts.metricsportal.controllers;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Set;

import javax.swing.text.BadLocationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.AlmMetrics;
import com.cts.metricsportal.bo.DateTimeCalc;
import com.cts.metricsportal.bo.JiraMetrics;
import com.cts.metricsportal.bo.OperationalBO;
import com.cts.metricsportal.bo.OperationalDashboardJIRAMetrics;
import com.cts.metricsportal.bo.SummaryValueMetrics;
import com.cts.metricsportal.dao.JiraMongoOperations;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.dao.OperationalMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.CustomTemplateVO;
import com.cts.metricsportal.vo.OperationDashboardDetailsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.RollupsheetVO;
import com.cts.metricsportal.vo.SelectedMetricVO;
import com.cts.metricsportal.vo.SummaryMetricVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@Path("/operationalServices")
public class OperationalServices extends BaseMongoOperation {

	/* Create New Dashboard or Update */
	@POST
	@Path("/saveDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int savedashboard(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("description") String description,
			@QueryParam("ispublic") boolean ispublic, @QueryParam("templateName") String templateName,
			@QueryParam("components") List<String> releases) throws Exception {
		int count = 0;

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			OperationalBO operationalBO = new OperationalBO();
			return operationalBO.saveDashboard(userId, dashboardName, description, templateName, ispublic, releases);
		}
		return count;

	}

	/* Updating Dashbaord */
	@POST
	@Path("/updateDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateDashboard(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("_id") String id,
			@QueryParam("description") String description, @QueryParam("templateName") String templateName,
			@QueryParam("ispublic") boolean ispublic, @QueryParam("components") List<String> releases)
			throws Exception {
		int count = 0;
		ObjectMapper mapper = new ObjectMapper();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		for (int i = 0; i < releases.size(); i++) {
			listLevelIDString = listLevelIDString + (releases.get(i));
			if (i != releases.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationDashboardDetailsVO> listLevelID = null;
		TypeReference<List<OperationDashboardDetailsVO>> tRef = new TypeReference<List<OperationDashboardDetailsVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		if (operationalAccess) {

			dashvo1.setDashboardName(dashboardName);
			dashvo1.setDescription(description);
			dashvo1.setOwner(userId);
			dashvo1.setTemplateName(templateName);
			dashvo1.setReleaseSet(listLevelID);
			dashvo1.setIspublic(ispublic);

			Calendar cal = Calendar.getInstance();
			Date modifieddate = cal.getTime();

			dashvo1.setModifieddate(modifieddate);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").is(id));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("description", description);
			update.set("owner", userId);
			update.set("templateName", templateName);
			update.set("releaseSet", listLevelID);
			update.set("ispublic", ispublic);
			update.set("modifieddate", modifieddate);

			List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

			for (OperationalDashboardVO vo : dashvoInfo) {
				if ((!vo.get_id().equals(id)) && vo.getOwner().equalsIgnoreCase(userId)
						&& vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = 1;
					break;
				}
			}
			if (count == 0) {
				getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
			}

			return count;
		} else {
			return count;
		}

	}

	/* Deleting User */
	@GET
	@Path("/deleteDashboardInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteDashboardInfo(@HeaderParam("Authorization") String authString, @QueryParam("id") String id,
			@QueryParam("owner") String owner) throws Exception {
		int count = 0;
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			Query query = new Query();
			query.addCriteria(Criteria.where("_id").is(id));
			getMongoOperation().remove(query, OperationalDashboardVO.class);
			return count;
		} else {
			return count;
		}
	}

	/* Lifecycle Dashboard Table Details */

	@GET
	@Path("/operationalDashboardDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OperationalDashboardVO> getTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		String query = "{},{_id:0}";
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		List<OperationalDashboardVO> OperationaldDetails = new ArrayList<OperationalDashboardVO>();
		if (operationalAccess) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.with(new Sort(Sort.Direction.DESC, "createddate"));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			OperationaldDetails = getMongoOperation().find(query1, OperationalDashboardVO.class);

			return OperationaldDetails;
		} else {
			return OperationaldDetails;
		}

	}

	@GET
	@Path("/operationalDashboardpublicDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OperationalDashboardVO> getTablepublicDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		String query = "{},{_id:0}";
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		List<OperationalDashboardVO> OperationaldDetails = new ArrayList<OperationalDashboardVO>();
		if (operationalAccess) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("ispublic").is(true));
			query1.with(new Sort(Sort.Direction.DESC, "createddate"));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			OperationaldDetails = getMongoOperation().find(query1, OperationalDashboardVO.class);

			return OperationaldDetails;
		} else {
			return OperationaldDetails;
		}

	}

	@GET
	@Path("/DashboardDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		long count = 0;
		if (operationalAccess) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			count = getMongoOperation().count(query1, OperationalDashboardVO.class);
		}
		return count;
	}

	@GET
	@Path("/DashboardDetailspulicCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTablepulicRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		long count = 0;
		if (operationalAccess) {
			query1.addCriteria(Criteria.where("ispublic").is(true));
			count = getMongoOperation().count(query1, OperationalDashboardVO.class);

		}
		return count;
	}

	@GET
	@Path("/getInfo")
	@Produces(MediaType.APPLICATION_JSON)
	public List<OperationalDashboardVO> getdashboardinfo(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		List<OperationalDashboardVO> dashboardinfo = new ArrayList<OperationalDashboardVO>();

		if (operationalAccess) {
			query1.addCriteria(Criteria.where("dashboardName").is(dashboardName));
			query1.addCriteria(Criteria.where("owner").is(userId));
			dashboardinfo = getMongoOperation().find(query1, OperationalDashboardVO.class);

			return dashboardinfo;
		} else {
			return dashboardinfo;
		}

	}

	@GET
	@Path("/globalView")
	@Produces(MediaType.APPLICATION_JSON)
	public List<SummaryMetricVO> getGlobalViewDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("templateName") String templateName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException, ParseException {

		String dashboardowner = "";
		List<SummaryMetricVO> finalResult = new ArrayList<SummaryMetricVO>();

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		Query query = new Query();
		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));

		// Check the Dashboard is set as public
		dashboardowner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (dashboardowner != "") {
			owner = dashboardowner;
			userId = dashboardowner;
		}
		// End of the check value

		query.addCriteria(Criteria.where("owner").is(owner));
		List<OperationalDashboardVO> dashboardinfo = getMongoOperation().find(query, OperationalDashboardVO.class);

		if (operationalAccess) {

			List<SelectedMetricVO> customTemplateMetricList = new ArrayList<SelectedMetricVO>();
			int[] customTemplateMetricId = new int[8];
			List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("templateName").is(templateName));

			try {
				customTemplateList = getMongoOperation().find(query1, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String rollingPeriod = customTemplateList.get(0).getRollingPeriod();
			if (customTemplateList != null) {
				customTemplateMetricList = customTemplateList.get(0).getSelectedMetrics();
				for (int j = 0; j < customTemplateMetricList.size(); j++) {
					int metricId = customTemplateMetricList.get(j).getMetricId();
					customTemplateMetricId[j] = metricId;

				}
				List<String> projectLevel = OperationalMongoOperations.getGlobalLevelProjects(dashboardName, owner);
				
				
				for (int m = 0; m < projectLevel.size(); m++) {
					for (int i = 0; i < dashboardinfo.get(0).getReleaseSet().size(); i++) {
						if (projectLevel.get(m)
								.equalsIgnoreCase(dashboardinfo.get(0).getReleaseSet().get(i).getLevel2())) {
							SummaryValueMetrics summaryValueMetrics = new SummaryValueMetrics();
							SummaryMetricVO finalInfo = new SummaryMetricVO();
							String tool = dashboardinfo.get(0).getReleaseSet().get(i).getSourceTool();
							String domain = dashboardinfo.get(0).getReleaseSet().get(i).getLevel1();
							String project = dashboardinfo.get(0).getReleaseSet().get(i).getLevel2();
							String release = dashboardinfo.get(0).getReleaseSet().get(i).getLevel3();
							long levelId = dashboardinfo.get(0).getReleaseSet().get(i).getLevelId();

							finalInfo.setTool(tool);
							finalInfo.setDomain(domain);
							finalInfo.setProject(project);
							finalInfo.setRelease(release);
							finalInfo.setLevelId(levelId);

							String metricValue1 = summaryValueMetrics.getMetricValue(customTemplateMetricId[0], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric1(metricValue1);
							String metricValue2 = summaryValueMetrics.getMetricValue(customTemplateMetricId[1], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric2(metricValue2);
							String metricValue3 = summaryValueMetrics.getMetricValue(customTemplateMetricId[2], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric3(metricValue3);
							String metricValue4 = summaryValueMetrics.getMetricValue(customTemplateMetricId[3], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric4(metricValue4);
							String metricValue5 = summaryValueMetrics.getMetricValue(customTemplateMetricId[4], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric5(metricValue5);
							String metricValue6 = summaryValueMetrics.getMetricValue(customTemplateMetricId[5], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric6(metricValue6);
							String metricValue7 = summaryValueMetrics.getMetricValue(customTemplateMetricId[6], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric7(metricValue7);
							String metricValue8 = summaryValueMetrics.getMetricValue(customTemplateMetricId[7], userId,
									dashboardName, domain, project, vardtfrom, vardtto, rollingPeriod, levelId);
							finalInfo.setMetric8(metricValue8);
							finalResult.add(finalInfo);
							break;
						}
					}

				}

			}

		}
		return finalResult;

	}
	
	//Rollup Sheet
	
	@GET
	@Path("/rollupsheet")
	@Produces(MediaType.APPLICATION_JSON)
	public List<RollupsheetVO> getrollupsheetDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("templateName") String templateName, @QueryParam("vardtfrom") String vardtfrom,
			@QueryParam("vardtto") String vardtto)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException, ParseException {
		
		List<String> sumdata=null;
		List<RollupsheetVO> rollupsheetlist =null;
		String dashboardowner = "";
		int isSheetprepared = 0;
		List<SummaryMetricVO> finalResult = new ArrayList<SummaryMetricVO>();

		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		Query query = new Query();
		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));

		// Check the Dashboard is set as public
		dashboardowner = JiraMongoOperations.isDashboardsetpublic(dashboardName);
		if (dashboardowner != "") {
			owner = dashboardowner;
			userId = dashboardowner;
		}
		// End of the check value

		query.addCriteria(Criteria.where("owner").is(owner));
		List<OperationalDashboardVO> dashboardinfo = getMongoOperation().find(query, OperationalDashboardVO.class);

		if (operationalAccess) {

			List<String> projectLevel = OperationalMongoOperations.getGlobalLevelProjects(dashboardName, owner);
			
						
			List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("templateName").is(templateName));

			try {
				customTemplateList = getMongoOperation().find(query1, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String rollingPeriod = customTemplateList.get(0).getRollingPeriod();
			
			String domainname= dashboardinfo.get(0).getReleaseSet().get(0).getLevel1();
			SummaryValueMetrics summaryValueMetrics1 = new SummaryValueMetrics();
			rollupsheetlist=summaryValueMetrics1.getrollupsheetdetails(userId,  dashboardName,  domainname,vardtfrom,  vardtto,  rollingPeriod, projectLevel);
			
	
		}
		return rollupsheetlist;

	}
	
	//End of Rollup Sheet
	
	

	@GET
	@Path("/templateList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> gettemplateList(@HeaderParam("Authorization") String authString) {

		List<CustomTemplateVO> templateList = new ArrayList<CustomTemplateVO>();
		;
		List<String> templateNameList = new ArrayList<String>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			Query query = new Query();
			try {
				templateList = getMongoOperation().find(query, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			for (int i = 0; i < templateList.size(); i++) {
				templateNameList.add(templateList.get(i).getTemplateName());
			}

		}
		return templateNameList;

	}

	@GET
	@Path("/customTemplateView")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CustomTemplateVO> getCustomTemplateView(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedcustomtemplate") String selectedcustomtemplate) {

		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
		;
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(selectedcustomtemplate));
			try {
				customTemplateList = getMongoOperation().find(query, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		return customTemplateList;

	}

	@GET
	@Path("/summaryTableMetricTitle")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getSummaryTableMetricTitle(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("templateName") String templateName) {

		List<SelectedMetricVO> customTemplateMetricList = new ArrayList<SelectedMetricVO>();
		List<String> customTemplateMetricName = new ArrayList<String>();
		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(templateName));

			try {
				customTemplateList = getMongoOperation().find(query, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if (customTemplateList != null) {
				customTemplateMetricList = customTemplateList.get(0).getSelectedMetrics();
				customTemplateMetricName.add(IdashboardConstantsUtil.PROJECT);
				for (int i = 0; i < customTemplateMetricList.size(); i++) {
					String metricName = customTemplateMetricList.get(i).getMetricName();
					customTemplateMetricName.add(metricName);

				}
			}
		}
		return customTemplateMetricName;

	}

	@GET
	@Path("/getRollingPeriod")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getRollingPeriod(@HeaderParam("Authorization") String authString,
			@QueryParam("templateName") String templateName) {
		List<String> rollingPeriodTem = new ArrayList<String>();
		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		if (operationalAccess) {
			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(templateName));
			try {
				customTemplateList = getMongoOperation().find(query, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		for (int i = 0; i < customTemplateList.size(); i++) {
			rollingPeriodTem.add(customTemplateList.get(i).getRollingPeriod());
		}

		return rollingPeriodTem;

	}

	@GET
	@Path("/selectednoofdays")
	@Produces(MediaType.APPLICATION_JSON)
	public int getselectednoofdays(@QueryParam("rollingPeriod") String rollingPeriod) {

		int noofdays = 0;
		if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_7_DAYS)) {
			noofdays = 7;
		}
		if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_15_DAYS)) {
			noofdays = 15;
		}
		if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_30_DAYS)) {
			noofdays = 30;
		} else if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_60_DAYS)) {
			noofdays = 60;
		} else if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_90_DAYS)) {
			noofdays = 90;
		} else if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_180_DAYS)) {
			noofdays = 180;
		} else if (rollingPeriod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_365_DAYS)) {
			noofdays = 365;
		}

		return noofdays;

	}
	
	

}