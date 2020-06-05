package com.cts.metricsportal.controllers;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import javax.swing.text.BadLocationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.JenkinsMetrics;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.bo.SonarMetrics;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;
import com.cts.metricsportal.vo.ChefRunsVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.IncidentListVO;
import com.cts.metricsportal.vo.JiraDefectVO;
import com.cts.metricsportal.vo.JiraLifeStatusVO;
import com.cts.metricsportal.vo.JiraRequirmentVO;
import com.cts.metricsportal.vo.KpiDashboardVO;
import com.cts.metricsportal.vo.KpiMetricListVO;
import com.cts.metricsportal.vo.KpiSelectedMetricVO;
import com.cts.metricsportal.vo.LCDashboardComponentsVO;
import com.cts.metricsportal.vo.LCDashboardVO;
import com.cts.metricsportal.vo.ProductDashboardVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.ToolSelectionVO;
import com.cts.metricsportal.vo.UserStoriesIterationVO;
import com.cts.metricsportal.vo.UserStoriesVO;
import com.cts.metricsportal.vo.ViewProductDetailsVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idashboard.lifecycle.vo.CodeAnalysisHistoryVO;
import com.idashboard.lifecycle.vo.CodeAnalysisVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ComplexityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_CoverageVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_DuplicationsVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_IssuesVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_MaintainabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_ReliabilityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SecurityVO;
import com.idashboard.lifecycle.vo.CodeAnalysis_SizeVO;
import com.idashboard.lifecycle.vo.FortifyVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

@Path("/lifeCycleServices")
public class LifeCycleServices extends BaseMongoOperation {
	static final Logger logger = Logger.getLogger(LifeCycleServices.class);

	/* Build Jobs */

	// ***************************************************************************************************/
	// Description : Get the Total builds for an Application Name
	// WebService Name : GetTotalBuilds
	// Input : Authorization and Application Name
	// Output : Total Build List
	// ***************************************************************************************************/

		
	@GET
	@Path("/getbuildperday")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildTotalVO> GetBuildPerDay(@HeaderParam("Authorization") String authString,
			@QueryParam("AppName") String AppName) {

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		JenkinsMetrics jMetrics = new JenkinsMetrics();
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();

		if (authenticateToken) {
			list = jMetrics.getbuildperday(AppName);
			return list;
		} else {
			return list;
		}
	}

	// ***************************************************************************************************/

	// ***************************************************************************************************/
	// Description : Get the Average build Duration for an Application Name
	// WebService Name : GetTotalBuilds
	// Input : Authorization and Application Name
	// Output : Total Build List
	// ***************************************************************************************************/

	@GET
	@Path("/getaveragedurationbuild")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildTotalVO> GetAverageBuildDuration(@HeaderParam("Authorization") String authString,
			@QueryParam("AppName") String AppName) {

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		JenkinsMetrics jMetrics = new JenkinsMetrics();
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();

		if (authenticateToken) {
			list = jMetrics.getaveragebuildduration(AppName);
			return list;
		} else {
			return list;
		}
	}

	// ***************************************************************************************************/

	// ***************************************************************************************************/
	// Description : Get the Total builds for an Application Name
	// WebService Name : GetTotalBuilds
	// Input : Authorization and Application Name
	// Output : Total Build List
	// ***************************************************************************************************/

	@GET
	@Path("/gettotalbuilds")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildTotalVO> GetTotalBuilds(@HeaderParam("Authorization") String authString,
			@QueryParam("AppName") String AppName) {

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		JenkinsMetrics jMetrics = new JenkinsMetrics();
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();

		if (authenticateToken) {
			list = jMetrics.gettotalbuild(AppName);
			return list;
		} else {
			return list;
		}
	}

	// ***************************************************************************************************/
	// Description : It list out the last 5 Builds with calculate the days using
	// endTime and CurrentDate
	// WebService Name : GetLatestBuilds
	// Input : Authorization and Application Name
	// Output : Latest 5 Builds with BuildNummber and Days
	// ***************************************************************************************************/

	@GET
	@Path("/getlatestbuilds")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildListVO> GetLatestBuilds(@HeaderParam("Authorization") String authString,
			@QueryParam("AppName") String AppName) {

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		JenkinsMetrics jMetrics = new JenkinsMetrics();
		List<BuildListVO> list = new ArrayList<BuildListVO>();

		if (authenticateToken) {
			list = jMetrics.getlatestbuild(AppName);
			return list;
		} else {
			return list;
		}
	}

	// ***************************************************************************************************/

	@GET
	@Path("/buildsJobs")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BuildJobsVO> buildJobs(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		if (authenticateToken) {
			buildJobList = getMongoOperation().find(query1, BuildJobsVO.class);
			return buildJobList;
		} else {
			return buildJobList;
		}

	}

	/* Code Analysis */

	// ***************************************************************************************************/
	// Description : To get code coverage Metrics
	// WebService Name : getcoverage
	// Input : Authorization and Project Name
	// Output : Get line of Code, Code Coverage Value in Home Page, In the Main
	// page Using the Data
	// to Draw a Trend Graph, also get the lines of cover and new lines to cover
	// metrics
	// ***************************************************************************************************/

	@GET
	@Path("/getcoverage")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_CoverageVO> getCoverage(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_CoverageVO> codeCoverageList = new ArrayList<CodeAnalysis_CoverageVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		SonarMetrics sMetrics = new SonarMetrics();
		if (authenticateToken) {
			codeCoverageList = sMetrics.getCodeCoverage(ProjectName);
			return codeCoverageList;
		} else {
			return codeCoverageList;
		}
	}

	// ***************************************************************************************************/
	// Description : To get UnitTest Metrics
	// WebService Name : getunittest
	// Input : Authorization and Project Name
	// Output : Get Success Percentage, Test Duration count in the Main page
	// Using the Data
	// to Draw a Unit Test Graph
	// ***************************************************************************************************/

	@GET
	@Path("/getunittest")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysisHistoryVO> getUnitTest(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysisHistoryVO> UnitTestLst = new ArrayList<CodeAnalysisHistoryVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			UnitTestLst = sMetrics.getUnitTest(ProjectName);
			return UnitTestLst;
		} else {
			return UnitTestLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get Size Metrics
	// WebService Name : getsizemetrics
	// Input : Authorization and Project Name
	// Output : Get Classes,Function and lines Count
	// ***************************************************************************************************/

	@GET
	@Path("/getsizemetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_SizeVO> getSizeMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_SizeVO> SizeMetricsLst = new ArrayList<CodeAnalysis_SizeVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			SizeMetricsLst = sMetrics.getSize(ProjectName);
			return SizeMetricsLst;
		} else {
			return SizeMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get Complexity Metrics
	// WebService Name : getComplexityMetrics
	// Input : Authorization and Project Name
	// Output : Get Complexity,ComplexityFunction and ComplexityClass Count
	// ***************************************************************************************************/

	@GET
	@Path("/getcomplexitymetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_ComplexityVO> getComplexityMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_ComplexityVO> ComplexityMetricsLst = new ArrayList<CodeAnalysis_ComplexityVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			ComplexityMetricsLst = sMetrics.getComplexity(ProjectName);
			return ComplexityMetricsLst;
		} else {
			return ComplexityMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get Issue Metrics
	// WebService Name : getIssueMetrics
	// Input : Authorization and Project Name
	// Output : Get Complexity,ComplexityFunction and ComplexityClass Count
	// ***************************************************************************************************/

	@GET
	@Path("/getissuemetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_IssuesVO> getIssueMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_IssuesVO> IssueMetricsLst = new ArrayList<CodeAnalysis_IssuesVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			IssueMetricsLst = sMetrics.getissues(ProjectName);
			return IssueMetricsLst;
		} else {
			return IssueMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get ReliabilityMetricsLst Metrics
	// WebService Name : getReliabilityMetrics
	// Input : Authorization and Project Name
	// Output : Get ReliabilityMetrics Trend Graph using the response data,
	// NewBugs,Rating and New Rating
	// ***************************************************************************************************/

	@GET
	@Path("/getreliabilitymetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_ReliabilityVO> getReliabilityMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_ReliabilityVO> ReliabilityMetricsLst = new ArrayList<CodeAnalysis_ReliabilityVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			ReliabilityMetricsLst = sMetrics.getreliability(ProjectName);
			return ReliabilityMetricsLst;
		} else {
			return ReliabilityMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get SecurityAnalysis Metrics
	// WebService Name : getSecurityAnalysisMetrics
	// Input : Authorization and Project Name
	// Output : Get getSecurityAnalysisMetrics Trend Graph using the response
	// data, NewVulenerabilities,
	// rating and new rating
	// ***************************************************************************************************/

	@GET
	@Path("/getsecurityanalysis")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_SecurityVO> getSecurityAnalysisMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_SecurityVO> SecurityAnalysisMetricsLst = new ArrayList<CodeAnalysis_SecurityVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			SecurityAnalysisMetricsLst = sMetrics.getsecurityanalysis(ProjectName);
			return SecurityAnalysisMetricsLst;
		} else {
			return SecurityAnalysisMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get Duplications Metrics
	// WebService Name : getDuplicationsMetrics
	// Input : Authorization and Project Name
	// Output : Get duplications metrics Trend Graph using the response
	// data, NewVulenerabilities,
	// file, line and new lines
	// ***************************************************************************************************/

	@GET
	@Path("/getduplications")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_DuplicationsVO> getDuplicationsMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_DuplicationsVO> DuplicationsMetricsLst = new ArrayList<CodeAnalysis_DuplicationsVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			DuplicationsMetricsLst = sMetrics.getduplications(ProjectName);
			return DuplicationsMetricsLst;
		} else {
			return DuplicationsMetricsLst;
		}
	}

	// ***************************************************************************************************/
	// Description : To get Maintainability Metrics
	// WebService Name : getMaintainabilityMetrics
	// Input : Authorization and Project Name
	// Output : Get duplications metrics Trend Graph using the response
	// data, NewVulenerabilities,
	// file, line and new lines
	// ***************************************************************************************************/

	@GET
	@Path("/getmaintainability")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CodeAnalysis_MaintainabilityVO> getMaintainabilityMetrics(
			@HeaderParam("Authorization") String authString, @QueryParam("projectname") String ProjectName) {

		List<CodeAnalysis_MaintainabilityVO> MaintainabilityMetricsLst = new ArrayList<CodeAnalysis_MaintainabilityVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		SonarMetrics sMetrics = new SonarMetrics();

		if (authenticateToken) {
			MaintainabilityMetricsLst = sMetrics.getmaintainability(ProjectName);
			return MaintainabilityMetricsLst;
		} else {
			return MaintainabilityMetricsLst;
		}
	}


	/* Create New Dashboard or Update */
	@POST
	@Path("/saveDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int signup(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("description") String description,
			@QueryParam("components") String dashboardComponent) throws Exception {
		int count = 0;
		ObjectMapper mapper = new ObjectMapper();

		// JSON from String to Object
		LCDashboardComponentsVO compVo = mapper.readValue(dashboardComponent, LCDashboardComponentsVO.class);

		LCDashboardVO dashvo = new LCDashboardVO();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
		Calendar calobj = Calendar.getInstance();
		String createdDt = df.format(calobj.getTime());
		Date createdDate = df.parse(createdDt);
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			dashvo.setDashboardName(dashboardName);
			dashvo.setDescription(description);
			dashvo.setOwner(userId);
			dashvo.setComponent(compVo);
			dashvo.setCreatedDate(createdDate);

			List<LCDashboardVO> dashvoInfo = getMongoOperation().findAll(LCDashboardVO.class);

			for (LCDashboardVO vo : dashvoInfo) {

				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = 1;
					break;
				}
			}
			if (count == 0) {
				getMongoOperation().save(dashvo, "lifeCycleDashboards");
			}
		}
		return count;

	}

	/* Create New Dashboard or Update */
	@POST
	@Path("/saveProductDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveproddash(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products) throws Exception {
		int count = 0;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		ProductDashboardVO dashvo = new ProductDashboardVO();
		if (authenticateToken) {
			dashvo.setRelName(relName);
			dashvo.setProducts(products);
			dashvo.setOwner(userId);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);

			List<ProductDashboardVO> dashvoInfo = getMongoOperation().findAll(ProductDashboardVO.class);

			for (ProductDashboardVO vo : dashvoInfo) {

				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getRelName().equalsIgnoreCase(relName)) {
					count = 1;
					break;
				}
			}

			if (count == 0) {
				getMongoOperation().save(dashvo, "productDashboards");
			}
			return count;
		} else {
			return count;
		}

	}

	@GET
	@Path("/getKpiMetricList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<KpiMetricListVO> getKpiMetricList(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<KpiMetricListVO> kpiMetricList = new ArrayList<KpiMetricListVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		if (authenticateToken) {
			kpiMetricList = getMongoOperation().find(query1, KpiMetricListVO.class);
		}
		return kpiMetricList;

	}

	/* Create New KPI Dashboard or Update */
	@POST
	@Path("/saveKpiDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveKpiDashboard(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products, @QueryParam("fromDate") String fromDate,
			@QueryParam("toDate") String toDate, @QueryParam("ispublic") boolean ispublic,
			@QueryParam("selectKpiItems") List<String> selectedKpiItems) throws Exception {
		int count = 0;
		Date fromDates;
		Date toDates;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		KpiDashboardVO dashvo = new KpiDashboardVO();

		if (authenticateToken) {
			String kpistringitems = "";
			kpistringitems = "" + selectedKpiItems.get(0);

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = new MappingJsonFactory();
			JsonParser jp = jf.createJsonParser(kpistringitems);

			List<KpiSelectedMetricVO> kpiSelection = null;

			TypeReference<List<KpiSelectedMetricVO>> tRef = new TypeReference<List<KpiSelectedMetricVO>>() {
			};

			kpiSelection = mapper.readValue(jp, tRef);

			fromDates = formatter.parse(fromDate);
			dashvo.setRelName(relName);
			dashvo.setProducts(products);
			dashvo.setOwner(userId);
			dashvo.setfromDates(fromDates);
			toDates = formatter.parse(toDate);
			dashvo.settoDates(toDates);
			dashvo.setSelectedMetric(kpiSelection);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);
			dashvo.setIspublic(ispublic);

			List<KpiDashboardVO> dashvoInfo = getMongoOperation().findAll(KpiDashboardVO.class);

			for (KpiDashboardVO vo : dashvoInfo) {

				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getRelName().equalsIgnoreCase(relName)) {
					count = 1;
					break;
				}
			}

			if (count == 0) {
				getMongoOperation().save(dashvo, "kpiDashboards");
			}
			return count;
		} else {
			return count;
		}

	}

	/* Update Dashboard or Update */
	@POST
	@Path("/updateProductDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateproddash(@HeaderParam("Authorization") String authString, @QueryParam("relName") String relName,
			@QueryParam("ispublic") String ispublic, @QueryParam("products") List<String> products) throws Exception {
		int count = 0;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query = new Query();
		query.addCriteria(Criteria.where("relName").is(relName));
		query.addCriteria(Criteria.where("owner").is(userId));
		getMongoOperation().remove(query, ProductDashboardVO.class);

		ProductDashboardVO dashvo = new ProductDashboardVO();
		if (authenticateToken) {
			dashvo.setRelName(relName);
			dashvo.setProducts(products);
			dashvo.setOwner(userId);

			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);

			List<ProductDashboardVO> dashvoInfo = getMongoOperation().findAll(ProductDashboardVO.class);

			for (ProductDashboardVO vo : dashvoInfo) {

				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getRelName().equalsIgnoreCase(relName)) {
					count = 1;
					break;
				}
			}

			if (count == 0) {
				getMongoOperation().save(dashvo, "productDashboards");
			}
			return count;
		} else {
			return count;
		}

	}

	/* Update KPI Dashboard or Update */
	@POST
	@Path("/updateKpiDashboard")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateKpiDash(@HeaderParam("Authorization") String authString,
			@QueryParam("oldRelName") String oldRelName, @QueryParam("relName") String relName,
			@QueryParam("products") List<String> products, @QueryParam("fromDate") String fromDate,
			@QueryParam("ispublic") boolean ispublic, @QueryParam("toDate") String toDate) throws Exception {
		int count = 1;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<String> getselectedMetric = getMetricList(authString, oldRelName);
		List<KpiSelectedMetricVO> selectedMetric = new ArrayList<KpiSelectedMetricVO>();
		KpiSelectedMetricVO kpivo = null;

		for (int i = 0; i < getselectedMetric.size(); i++) {
			kpivo = new KpiSelectedMetricVO();
			kpivo.setMetricName(getselectedMetric.get(i));
			selectedMetric.add(kpivo);
		}

		Query query = new Query();
		query.addCriteria(Criteria.where("relName").is(oldRelName));
		query.addCriteria(Criteria.where("owner").is(userId));
		getMongoOperation().remove(query, KpiDashboardVO.class);
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

		KpiDashboardVO dashvo = new KpiDashboardVO();
		if (authenticateToken) {
			dashvo.setRelName(relName);
			dashvo.setProducts(products);
			dashvo.setOwner(userId);
			Date fromDates = formatter.parse(fromDate);
			dashvo.setfromDates(fromDates);
			Date toDates = formatter.parse(toDate);
			dashvo.settoDates(toDates);
			dashvo.setSelectedMetric(selectedMetric);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);
			dashvo.setIspublic(ispublic);

			getMongoOperation().save(dashvo, "kpiDashboards");
			count = 0;
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
			@QueryParam("description") String description, @QueryParam("ispublic") boolean ispublic,
			@QueryParam("components") String dashboardComponent) throws Exception {
		int count = 0;
		ObjectMapper mapper = new ObjectMapper();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			// JSON from String to Object
			LCDashboardComponentsVO compVo = mapper.readValue(dashboardComponent, LCDashboardComponentsVO.class);
			LCDashboardVO dashvo1 = new LCDashboardVO();

			dashvo1.setDashboardName(dashboardName);
			dashvo1.setDescription(description);
			dashvo1.setOwner(userId);
			dashvo1.setComponent(compVo);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo1.setCreatedDate(createdDate);
			dashvo1.setIspublic(ispublic);

			Query query = new Query();
			query.addCriteria(Criteria.where("_id").is(id));

			Update update = new Update();
			update.set("dashboardName", dashboardName);
			update.set("description", description);
			update.set("owner", userId);
			update.set("component", compVo);
			update.set("createdDate", createdDate);
			update.set("ispublic", ispublic);

			List<LCDashboardVO> getDashDet = getMongoOperation().find(query, LCDashboardVO.class);
			String getDashName = getDashDet.get(0).getDashboardName();

			List<LCDashboardVO> dashvoInfo = getMongoOperation().findAll(LCDashboardVO.class);

			for (LCDashboardVO vo : dashvoInfo) {
				if ((!vo.get_id().equals(id)) && vo.getOwner().equalsIgnoreCase(userId)
						&& vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = 1;
					break;
				}
			}
			if (count == 0) {
				getMongoOperation().updateFirst(query, update, LCDashboardVO.class);

				try {
					Query query1 = new Query();
					query1.addCriteria(Criteria.where("owner").is(userId));

					List<ProductDashboardVO> productdetails = new ArrayList<ProductDashboardVO>();
					productdetails = getMongoOperation().find(query1, ProductDashboardVO.class);
					List<String> productlist = productdetails.get(0).getProducts();

					if (productlist.contains(getDashName)) {
						productlist.remove(getDashName);
						productlist.add(dashboardName);
					}

					Update update1 = new Update();
					update1.set("products", productlist);
					getMongoOperation().updateFirst(query1, update1, ProductDashboardVO.class);

				} catch (Exception e) {
					e.printStackTrace();
				}

			}
		}

		return count;
	}

	/* Deleting User */
	@GET
	@Path("/deleteDashboardInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteDashboardInfo(@HeaderParam("Authorization") String authString, @QueryParam("id") String id,
			@QueryParam("dashboardName") String dashboardName) throws Exception {
		int count = 0;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		// Delete LC Dashboard
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").is(id));
		getMongoOperation().remove(query, LCDashboardVO.class);

		// Delete corresponding products in product dashboard
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("owner").is(userId));
		List<ProductDashboardVO> productDash = getMongoOperation().find(query1, ProductDashboardVO.class);

		Query query5 = new Query();
		query5.addCriteria(Criteria.where("owner").is(userId));
		List<KpiDashboardVO> kpiDash = getMongoOperation().find(query5, KpiDashboardVO.class);

		// List<String> prodList = new ArrayList<String>();
		if (authenticateToken) {
			for (int k = 0; k < productDash.size(); k++) {

				if (productDash.get(k).getProducts().contains(dashboardName)) {
					productDash.get(k).getProducts().remove(dashboardName);

					Query query3 = new Query();
					query3.addCriteria(Criteria.where("owner").is(userId));

					query3.addCriteria(Criteria.where("relName").is(productDash.get(k).getRelName()));
					Update update = new Update();
					update.set("products", productDash.get(k).getProducts());
					getMongoOperation().updateFirst(query3, update, ProductDashboardVO.class);

				}
			}

			for (int k = 0; k < kpiDash.size(); k++) {

				if (kpiDash.get(k).getProducts().contains(dashboardName)) {

					kpiDash.get(k).getProducts().remove(dashboardName);

					Query query6 = new Query();
					query6.addCriteria(Criteria.where("owner").is(userId));

					query6.addCriteria(Criteria.where("relName").is(kpiDash.get(k).getRelName()));
					Update update = new Update();
					update.set("products", kpiDash.get(k).getProducts());
					getMongoOperation().updateFirst(query6, update, KpiDashboardVO.class);

				}
			}

			// Remove release dashboard if exists without any products
			Query query2 = new Query();
			query2.addCriteria(Criteria.where("owner").is(userId));
			List<ProductDashboardVO> productDts = getMongoOperation().find(query1, ProductDashboardVO.class);

			for (int q = 0; q < productDts.size(); q++) {
				if (productDts.get(q).getProducts().size() == 0) {
					Query query4 = new Query();
					query4.addCriteria(Criteria.where("owner").is(userId));
					query4.addCriteria(Criteria.where("relName").is(productDts.get(q).getRelName()));
					getMongoOperation().remove(query4, ProductDashboardVO.class);
				}
			}

			// Remove KPI dashboard if exists without any products
			Query query7 = new Query();
			query7.addCriteria(Criteria.where("owner").is(userId));
			List<KpiDashboardVO> productKpiDts = getMongoOperation().find(query7, KpiDashboardVO.class);

			for (int q = 0; q < productKpiDts.size(); q++) {
				if (productKpiDts.get(q).getProducts().size() == 0) {
					Query query8 = new Query();
					query8.addCriteria(Criteria.where("owner").is(userId));
					query8.addCriteria(Criteria.where("relName").is(productKpiDts.get(q).getRelName()));
					getMongoOperation().remove(query8, KpiDashboardVO.class);
				}
			}

			return count;
		} else {
			return count;
		}
	}

	/* Lifecycle Dashboard Table Details */

	@GET
	@Path("/lifecycleDashboardDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LCDashboardVO> getTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<LCDashboardVO> lcdDetails = new ArrayList<LCDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			lcdDetails = getMongoOperation().find(query1, LCDashboardVO.class);
			return lcdDetails;
		} else {
			return lcdDetails;
		}

	}

	@GET
	@Path("/lifecycleDashboardpublicDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LCDashboardVO> getTablepublicDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		String query = "{},{_id:0}";
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		List<LCDashboardVO> lcdpublicDetails = new ArrayList<LCDashboardVO>();
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("ispublic").is(true));
			query1.with(new Sort(Sort.Direction.DESC, "createddate"));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			lcdpublicDetails = getMongoOperation().find(query1, LCDashboardVO.class);

			return lcdpublicDetails;
		} else {
			return lcdpublicDetails;
		}

	}

	@GET
	@Path("/DashboardDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			count = getMongoOperation().count(query1, LCDashboardVO.class);
			return count;
		} else {
			return count;
		}
	}

	@GET
	@Path("/kpiDetailspulicCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long kpiTablepulicRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			query1.addCriteria(Criteria.where("ispublic").is(true));
			count = getMongoOperation().count(query1, KpiDashboardVO.class);
		}
		return count;
	}

	@GET
	@Path("/kpiDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long kpiTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			count = getMongoOperation().count(query1, KpiDashboardVO.class);
			return count;
		} else {
			return count;
		}
	}

	@GET
	@Path("/DashboardDetailspulicCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTablepulicRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long count = 0;
		if (authenticateToken) {
			query1.addCriteria(Criteria.where("ispublic").is(true));
			count = getMongoOperation().count(query1, LCDashboardVO.class);
		}
		return count;
	}

	@GET
	@Path("/kpipublicDashboardTable")
	@Produces(MediaType.APPLICATION_JSON)
	public List<KpiDashboardVO> getKpipublicTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdpublicDetails = new ArrayList<KpiDashboardVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("ispublic").is(true));
			lcdpublicDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			return lcdpublicDetails;
		} else {
			return lcdpublicDetails;
		}
	}

	@GET
	@Path("/productTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ViewProductDetailsVO> getproductTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));

		List<ProductDashboardVO> productdetails = getMongoOperation().find(query1, ProductDashboardVO.class);

		List<ViewProductDetailsVO> finallist = new ArrayList<ViewProductDetailsVO>();
		if (authenticateToken) {
			for (int h = 0; h < productdetails.size(); h++) {

				List<String> productlist = productdetails.get(h).getProducts();

				if (!productlist.isEmpty()) {
					for (int i = 0; i < productlist.size(); i++) {

						ViewProductDetailsVO prodinfo = new ViewProductDetailsVO();

						prodinfo.setReleaseName(productdetails.get(h).getRelName());
						prodinfo.setProductName(productlist.get(i));

						// Sprint
						long iterations = 0;
						long userstories = 0;
						Query sprintdropquery = new Query();
						sprintdropquery.addCriteria(Criteria.where("dashboardName").is(productlist.get(i)));
						List<LCDashboardVO> selectedsprint = getMongoOperation().find(sprintdropquery,
								LCDashboardVO.class);

						if (!selectedsprint.isEmpty()) {
							String selectedsprintval = selectedsprint.get(0).getComponent().getRallyProject();

							Query sprintquery = new Query();
							sprintquery.addCriteria(Criteria.where("projectName").is(selectedsprintval));

							iterations = getMongoOperation().count(sprintquery, UserStoriesIterationVO.class);

							userstories = getMongoOperation().count(sprintquery, UserStoriesVO.class);

							prodinfo.setSprintIterations(iterations);
							prodinfo.setSprintUserStories(userstories);
						}

						// GitHub

						String gitName = selectedsprint.get(0).getComponent().getGitName();
						String gitType = selectedsprint.get(0).getComponent().getGitType();
						String gitRepo = selectedsprint.get(0).getComponent().getGitRepo();

						Query gitquery = new Query();
						gitquery.addCriteria(Criteria.where("gitName").is(gitName));
						gitquery.addCriteria(Criteria.where("gitType").is(gitType));
						gitquery.addCriteria(Criteria.where("repositoryDetails.repoName").is(gitRepo));

						List<GitRepositoryVO> gitdata = new ArrayList<GitRepositoryVO>();
						long commitcount = 0;
						long contributorcount = 0;

						gitdata = getMongoOperation().find(gitquery, GitRepositoryVO.class);

						if (!gitdata.isEmpty()) {
							for (int j = 0; j < gitdata.get(0).getRepositoryDetails().size(); j++) {
								commitcount = gitdata.get(0).getRepositoryDetails().get(i).getCommitsCount();
								contributorcount = gitdata.get(0).getRepositoryDetails().get(i).getContributorsDetails()
										.size();
							}

							prodinfo.setGitCommits(commitcount);
							prodinfo.setGitContributors(contributorcount);
						}

						// Jenkins

						String selectedjenkinval = selectedsprint.get(0).getComponent().getBuildJobName();
						long passcount = 0;
						long failcount = 0;

						Query jenkinquery = new Query();
						jenkinquery.addCriteria(Criteria.where("jobName").is(selectedjenkinval));
						List<BuildJobsVO> builddetails = getMongoOperation().find(jenkinquery, BuildJobsVO.class);

						if (!builddetails.isEmpty()) {
							for (int k = 0; k < builddetails.get(0).getBuildList().size(); k++) {
								if (builddetails.get(0).getBuildList().get(k).getResult().equalsIgnoreCase("SUCCESS")) {
									passcount++;
								} else {
									failcount++;
								}
							}

							prodinfo.setJenkinspasscount(passcount);
							prodinfo.setJenkinsfailcount(failcount);
						}

						// Sonar

						String selectedsonarval = selectedsprint.get(0).getComponent().getCodeAnalysisProjectName();
						String lineno;

						Query sonarquery = new Query();
						sonarquery.addCriteria(Criteria.where("prjName").is(selectedsonarval));

						List<CodeAnalysisVO> cadetails = getMongoOperation().find(sonarquery, CodeAnalysisVO.class);

						if (!cadetails.isEmpty()) {
							lineno = cadetails.get(0).getHistory().get(0).getSize().getLines();

							prodinfo.setSonar(lineno);
						}

						// Defects and Execution

						String domain = selectedsprint.get(0).getComponent().getDomainName();
						String project = selectedsprint.get(0).getComponent().getProjectName();
						String release = selectedsprint.get(0).getComponent().getReleaseName();
						List<DefectStatusVO> result = null;

						List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domain, project, release);

						Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
								group("severity").count().as("severityCnt"),
								project("severityCnt").and("severity").previousOperation());
						AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg,
								DefectVO.class, DefectStatusVO.class);
						result = groupResults.getMappedResults();

						if (!result.isEmpty()) {
							long sevHigh = 0;
							long sevLow = 0;

							if (result.get(0).getSeverity().equalsIgnoreCase("High")) {
								sevHigh = result.get(0).getSeverityCnt();
							}
							if (result.get(0).getSeverity().equalsIgnoreCase("Low")) {
								sevLow = result.get(0).getSeverityCnt();
							}

							prodinfo.setDefSevHigh(sevHigh);
							prodinfo.setDefSevLow(sevLow);
						}

						List<TestExeStatusVO> resultexe = null;

						Aggregation aggexe = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
								group("testExecutionStatus").count().as("statusCnt"),
								project("statusCnt").and("testExecutionStatus").previousOperation());
						AggregationResults<TestExeStatusVO> groupResultsexe = getMongoOperation().aggregate(aggexe,
								TestExecutionVO.class, TestExeStatusVO.class);
						resultexe = groupResultsexe.getMappedResults();

						if (!resultexe.isEmpty()) {
							long exeStstPass = 0;
							long exeStstFail = 0;

							if (resultexe.get(0).getTestExecutionStatus().equalsIgnoreCase("Passed")) {
								exeStstPass = resultexe.get(0).getStatusCnt();
							}
							if (resultexe.get(0).getTestExecutionStatus().equalsIgnoreCase("Failed")) {
								exeStstFail = resultexe.get(0).getStatusCnt();
							}

							prodinfo.setExeStatPass(exeStstPass);
							prodinfo.setExeStatFail(exeStstFail);
						}

						// Deployment

						String selecteddeployval = selectedsprint.get(0).getComponent().getCookbookName();
						long qapass = 0;
						long qafail = 0;
						long devpass = 0;
						long devfail = 0;

						Query deployquery = new Query();
						deployquery.addCriteria(Criteria.where("cookbookname").is(selecteddeployval));

						List<ChefRunsVO> deploydetails = getMongoOperation().find(deployquery, ChefRunsVO.class);

						if (!deploydetails.isEmpty()) {
							for (int l = 0; l < deploydetails.size(); l++) {
								if (deploydetails.get(l).getNodename().equalsIgnoreCase("QA")) {
									if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
										qapass++;
									} else {
										qafail++;
									}
								}
								if (deploydetails.get(l).getNodename().equalsIgnoreCase("DEV")) {
									if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
										devpass++;
									} else {
										devfail++;
									}
								}
							}

							prodinfo.setDeploymentqapass(qapass);
							prodinfo.setDeploymentqafail(qafail);
							prodinfo.setDeploymentdevpass(devpass);
							prodinfo.setDeploymentdevfail(devfail);
						}

						finallist.add(prodinfo);

					}
				}
			}
			return finallist;
		} else {
			return finallist;
		}
	}

	@GET
	@Path("/getRelStartDate")
	@Produces(MediaType.TEXT_XML)
	public String getRelStartDate(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		String relStartDate = null;
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			Date vardtfrom = productdetails.get(0).getfromDates();
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			relStartDate = formatter.format(vardtfrom);
		}

		return relStartDate;
	}

	@GET
	@Path("/getispublic")
	@Produces(MediaType.TEXT_PLAIN)
	public String getispublic(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		boolean ispublic = false;
		String spublic = "";
		if (authenticateToken) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			ispublic = productdetails.get(0).isIspublic();
			spublic = String.valueOf(ispublic);
			return spublic;
		}
		return spublic;
	}

	@GET
	@Path("/getRelEndDate")
	@Produces(MediaType.TEXT_XML)
	public String getRelEndDate(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String relEndDate = null;

		if (authenticateToken) {
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			Date vardtTo = productdetails.get(0).gettoDates();
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			relEndDate = formatter.format(vardtTo);
			return relEndDate;
		}
		return relEndDate;
	}

	@GET
	@Path("/updateProductTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ViewProductDetailsVO> updateproductTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<ProductDashboardVO> productdetails = getMongoOperation().find(query1, ProductDashboardVO.class);

		List<ViewProductDetailsVO> finallist = new ArrayList<ViewProductDetailsVO>();
		if (authenticateToken) {
			for (int h = 0; h < productdetails.size(); h++) {

				List<String> productlist = productdetails.get(h).getProducts();

				if (!productlist.isEmpty()) {
					for (int i = 0; i < productlist.size(); i++) {

						ViewProductDetailsVO prodinfo = new ViewProductDetailsVO();

						prodinfo.setReleaseName(productdetails.get(h).getRelName());
						prodinfo.setProductName(productlist.get(i));

						// Sprint
						long iterations = 0;
						long userstories = 0;
						Query sprintdropquery = new Query();
						sprintdropquery.addCriteria(Criteria.where("dashboardName").is(productlist.get(i)));
						List<LCDashboardVO> selectedsprint = getMongoOperation().find(sprintdropquery,
								LCDashboardVO.class);

						if (!selectedsprint.isEmpty()) {
							String selectedsprintval = selectedsprint.get(0).getComponent().getRallyProject();

							Query sprintquery = new Query();
							sprintquery.addCriteria(Criteria.where("projectName").is(selectedsprintval));

							iterations = getMongoOperation().count(sprintquery, UserStoriesIterationVO.class);

							userstories = getMongoOperation().count(sprintquery, UserStoriesVO.class);

							prodinfo.setSprintIterations(iterations);
							prodinfo.setSprintUserStories(userstories);
						}

						// GitHub

						String gitName = selectedsprint.get(0).getComponent().getGitName();
						String gitType = selectedsprint.get(0).getComponent().getGitType();
						String gitRepo = selectedsprint.get(0).getComponent().getGitRepo();

						Query gitquery = new Query();
						gitquery.addCriteria(Criteria.where("gitName").is(gitName));
						gitquery.addCriteria(Criteria.where("gitType").is(gitType));
						gitquery.addCriteria(Criteria.where("repositoryDetails.repoName").is(gitRepo));

						List<GitRepositoryVO> gitdata = new ArrayList<GitRepositoryVO>();
						long commitcount = 0;
						long contributorcount = 0;

						gitdata = getMongoOperation().find(gitquery, GitRepositoryVO.class);

						if (!gitdata.isEmpty()) {
							for (int j = 0; j < gitdata.get(0).getRepositoryDetails().size(); j++) {
								commitcount = gitdata.get(0).getRepositoryDetails().get(i).getCommitsCount();
								contributorcount = gitdata.get(0).getRepositoryDetails().get(i).getContributorsDetails()
										.size();
							}

							prodinfo.setGitCommits(commitcount);
							prodinfo.setGitContributors(contributorcount);
						}

						// Jenkins

						String selectedjenkinval = selectedsprint.get(0).getComponent().getBuildJobName();
						long passcount = 0;
						long failcount = 0;

						Query jenkinquery = new Query();
						jenkinquery.addCriteria(Criteria.where("jobName").is(selectedjenkinval));
						List<BuildJobsVO> builddetails = getMongoOperation().find(jenkinquery, BuildJobsVO.class);

						if (!builddetails.isEmpty()) {
							for (int k = 0; k < builddetails.get(0).getBuildList().size(); k++) {
								if (builddetails.get(0).getBuildList().get(k).getResult().equalsIgnoreCase("SUCCESS")) {
									passcount++;
								} else {
									failcount++;
								}
							}

							prodinfo.setJenkinspasscount(passcount);
							prodinfo.setJenkinsfailcount(failcount);
						}

						// Sonar

						String selectedsonarval = selectedsprint.get(0).getComponent().getCodeAnalysisProjectName();
						String lineno;

						Query sonarquery = new Query();
						sonarquery.addCriteria(Criteria.where("prjName").is(selectedsonarval));

						List<CodeAnalysisVO> cadetails = getMongoOperation().find(sonarquery, CodeAnalysisVO.class);

						if (!cadetails.isEmpty()) {
							lineno = cadetails.get(0).getHistory().get(0).getSize().getLines();

							prodinfo.setSonar(lineno);
						}

						// Defects and Execution

						String domain = selectedsprint.get(0).getComponent().getDomainName();
						String project = selectedsprint.get(0).getComponent().getProjectName();
						String release = selectedsprint.get(0).getComponent().getReleaseName();
						List<DefectStatusVO> result = null;

						List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domain, project, release);

						Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
								group("severity").count().as("severityCnt"),
								project("severityCnt").and("severity").previousOperation());
						AggregationResults<DefectStatusVO> groupResults = getMongoOperation().aggregate(agg,
								DefectVO.class, DefectStatusVO.class);
						result = groupResults.getMappedResults();

						if (!result.isEmpty()) {
							long sevHigh = 0;
							long sevLow = 0;

							if (result.get(0).getSeverity().equalsIgnoreCase("High")) {
								sevHigh = result.get(0).getSeverityCnt();
							}
							if (result.get(0).getSeverity().equalsIgnoreCase("Low")) {
								sevLow = result.get(0).getSeverityCnt();
							}

							prodinfo.setDefSevHigh(sevHigh);
							prodinfo.setDefSevLow(sevLow);
						}

						List<TestExeStatusVO> resultexe = null;

						Aggregation aggexe = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
								group("testExecutionStatus").count().as("statusCnt"),
								project("statusCnt").and("testExecutionStatus").previousOperation());
						AggregationResults<TestExeStatusVO> groupResultsexe = getMongoOperation().aggregate(aggexe,
								TestExecutionVO.class, TestExeStatusVO.class);
						resultexe = groupResultsexe.getMappedResults();

						if (!resultexe.isEmpty()) {
							long exeStstPass = 0;
							long exeStstFail = 0;

							if (resultexe.get(0).getTestExecutionStatus().equalsIgnoreCase("Passed")) {
								exeStstPass = resultexe.get(0).getStatusCnt();
							}
							if (resultexe.get(0).getTestExecutionStatus().equalsIgnoreCase("Failed")) {
								exeStstFail = resultexe.get(0).getStatusCnt();
							}

							prodinfo.setExeStatPass(exeStstPass);
							prodinfo.setExeStatFail(exeStstFail);
						}

						// Deployment

						String selecteddeployval = selectedsprint.get(0).getComponent().getCookbookName();
						long qapass = 0;
						long qafail = 0;
						long devpass = 0;
						long devfail = 0;

						Query deployquery = new Query();
						deployquery.addCriteria(Criteria.where("cookbookname").is(selecteddeployval));

						List<ChefRunsVO> deploydetails = getMongoOperation().find(deployquery, ChefRunsVO.class);

						if (!deploydetails.isEmpty()) {
							for (int l = 0; l < deploydetails.size(); l++) {
								if (deploydetails.get(l).getNodename().equalsIgnoreCase("QA")) {
									if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
										qapass++;
									} else {
										qafail++;
									}
								}
								if (deploydetails.get(l).getNodename().equalsIgnoreCase("DEV")) {
									if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
										devpass++;
									} else {
										devfail++;
									}
								}
							}

							prodinfo.setDeploymentqapass(qapass);
							prodinfo.setDeploymentqafail(qafail);
							prodinfo.setDeploymentdevpass(devpass);
							prodinfo.setDeploymentdevfail(devfail);
						}

						finallist.add(prodinfo);

					}
				}
			}
			return finallist;
		} else {
			return finallist;
		}
	}

	@GET
	@Path("/updateProdTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getUpdateProdTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<ProductDashboardVO> lcdDetails = new ArrayList<ProductDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, ProductDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;
		} else {
			return val;
		}
	}

	@GET
	@Path("/updateKpiTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getUpdateKpiTableDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;
		} else {
			return val;
		}
	}

	@GET
	@Path("/getMetricList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getMetricList(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<KpiSelectedMetricVO> val = null;
		List<String> selMetricList = new ArrayList<String>();
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			val = lcdDetails.get(0).getSelectedMetric();
			for (int i = 0; i < val.size(); i++) {
				String metName = val.get(i).getMetricName();
				selMetricList.add(metName);
			}

		}
		return selMetricList;
	}

	@GET
	@Path("/productDashboardTable")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ProductDashboardVO> getProdTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<ProductDashboardVO> lcdDetails = new ArrayList<ProductDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("owner").is(userId));

			// query1.addCriteria(Criteria.where("relName").is(relName));

			lcdDetails = getMongoOperation().find(query1, ProductDashboardVO.class);

			return lcdDetails;
		} else {
			return lcdDetails;
		}
	}

	@GET
	@Path("/kpiDashboardTable")
	@Produces(MediaType.APPLICATION_JSON)
	public List<KpiDashboardVO> getKpiTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("owner").is(userId));

			// query1.addCriteria(Criteria.where("relName").is(relName));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);

			return lcdDetails;
		} else {
			return lcdDetails;
		}
	}

	@GET
	@Path("/productPopupDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getproductPopupDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("relName") String relName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<ProductDashboardVO> lcdDetails = new ArrayList<ProductDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(relName));

			lcdDetails = getMongoOperation().find(query1, ProductDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;
		} else {
			return val;
		}
	}

	@GET
	@Path("/kpiPopupDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getKpiPopupDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("relName") String relName) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<String> val = null;
		if (authenticateToken) {
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(relName));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;
		} else {
			return val;
		}
	}

	/* Deleting Dashboard */
	@GET
	@Path("/deleteRelDashboardInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteRelDashboardInfo(@HeaderParam("Authorization") String authString, @QueryParam("id") String id)
			throws Exception {
		int count = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			Query query = new Query();
			query.addCriteria(Criteria.where("_id").is(id));
			getMongoOperation().remove(query, ProductDashboardVO.class);
			return count;
		} else {
			return count;
		}
	}

	/* Deleting KPI Dashboard */
	@GET
	@Path("/deleteKpiDashboardInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteKpiDashboardInfo(@HeaderParam("Authorization") String authString, @QueryParam("id") String id)
			throws Exception {
		int count = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			Query query = new Query();
			query.addCriteria(Criteria.where("_id").is(id));
			getMongoOperation().remove(query, KpiDashboardVO.class);
			return count;
		} else {
			return count;
		}
	}

	/* Get Redirect details from product dashboard page */
	@GET
	@Path("/redirectDashboard")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LCDashboardVO> redirectDashboard(@QueryParam("dashName") String dashName,
			@HeaderParam("Authorization") String authString) throws Exception {
		List<LCDashboardVO> lcdDetails = new ArrayList<LCDashboardVO>();

		Query query = new Query();
		query.addCriteria(Criteria.where("dashboardName").is(dashName));
		lcdDetails = getMongoOperation().find(query, LCDashboardVO.class);

		return lcdDetails;
	}

	@GET
	@Path("/getSelectedLCTools")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ToolSelectionVO> getSelectedLCTools(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ToolSelectionVO> tools = new ArrayList<ToolSelectionVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		query1.with(new Sort(Sort.Direction.ASC, "position"));
		if (authenticateToken) {
			tools = getMongoOperation().find(query1, ToolSelectionVO.class);

			return tools;

		} else {
			return tools;
		}

	}

	@GET
	@Path("/getSprintCountRally")
	@Produces(MediaType.APPLICATION_JSON)
	public long getSprintCount(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long sprCount = 0;
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			List<String> sprintList = new ArrayList<String>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			List<String> rallyProjects = new ArrayList<String>();
			for (int i = 0; i < selectedDashboards.size(); i++) {
				String rallyProj = selectedDashboards.get(i).getComponent().getRallyProject();
				rallyProjects.add(rallyProj);
			}

			Query sprintquery = new Query();
			sprintquery.addCriteria(Criteria.where("projectName").in(rallyProjects));
			sprintquery.addCriteria(Criteria.where("creationDate").gte(relStDt));
			sprintquery.addCriteria(Criteria.where("endDate").lte(relEndDt));
			sprintList = getMongoOperation().getCollection("projectiterations").distinct("iterationName",
					sprintquery.getQueryObject());

			sprCount = sprintList.size();

		}
		return sprCount;

	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/getkpisprintcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getJiraSprintCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		long sprintCount = 0;

		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		String query = "{},{_id:0}";
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		List<String> distinctsprint = new ArrayList<String>();
		List<String> finalsprintlist = new ArrayList<String>();

		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			List<String> jiraProjects = new ArrayList<String>();
			for (int i = 0; i < selectedDashboards.size(); i++) {
				String jiraProj = selectedDashboards.get(i).getComponent().getJiraProject();
				jiraProjects.add(jiraProj);
			}

			Query sprintquery = new Query();
			sprintquery.addCriteria(Criteria.where("prjName").in(jiraProjects));
			sprintquery.addCriteria(Criteria.where("issueSprintEndDate").gte(relStDt).lte(relEndDt));

			distinctsprint = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
					sprintquery.getQueryObject());

			for (int i = 0; i < distinctsprint.size(); i++) {
				if (!distinctsprint.get(i).equalsIgnoreCase("") && !distinctsprint.get(i).equalsIgnoreCase("Backlog")) {
					finalsprintlist.add(distinctsprint.get(i));
				}
			}

			sprintCount = finalsprintlist.size();
		}

		return sprintCount;

	}

	@GET
	@Path("/getUserStoryCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getUserStoryCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long usrStoryCount = 0;
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			List<String> jiraProjects = new ArrayList<String>();
			for (int i = 0; i < selectedDashboards.size(); i++) {
				String jiraProj = selectedDashboards.get(i).getComponent().getJiraProject();
				jiraProjects.add(jiraProj);
			}
			Query sprintquery = new Query();
			sprintquery.addCriteria(Criteria.where("prjName").in(jiraProjects));
			sprintquery.addCriteria(Criteria.where("issueUpdated").gte(relStDt).lte(relEndDt));
			sprintquery.addCriteria(Criteria.where("issueType").is("Story"));
			sprintquery.addCriteria(Criteria.where("issueStatus").ne("Done"));
			usrStoryCount = getMongoOperation().count(sprintquery, JiraRequirmentVO.class);

		}
		return usrStoryCount;

	}

	/* Git Commit Count */

	// ***************************************************************************************************/
	// Description : Get the Total commit Count for a Git name, Repository name
	// WebService Name : git_repoinfo
	// Input : Authorization and selected Name
	// Output : Total commitCount
	// ***************************************************************************************************/

	@GET
	@Path("/getCommitCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getCommitCount(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		long commitCount = 0;

		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class); // return only
																										// 1
																										// item
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		Date commitDate = null;

		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String gitName = selectedDashboards.get(i).getComponent().getGitName();
				String gitType = selectedDashboards.get(i).getComponent().getGitType();
				String gitRepo = selectedDashboards.get(i).getComponent().getGitRepo();

				Query gitquery = new Query();
				gitquery.addCriteria(Criteria.where("gitName").is(gitName));
				gitquery.addCriteria(Criteria.where("gitType").is(gitType));
				gitquery.addCriteria(Criteria.where("repositoryDetails.repoName").is(gitRepo));

				List<GitRepositoryVO> gitdata = new ArrayList<GitRepositoryVO>();

				gitdata = getMongoOperation().find(gitquery, GitRepositoryVO.class);

				if (!gitdata.isEmpty()) {
					for (int repo = 0; repo < gitdata.get(0).getRepositoryDetails().size(); repo++) {
						for (int comm = 0; comm < gitdata.get(0).getRepositoryDetails().get(repo).getCommitDetails()
								.size(); comm++) {
							if (gitdata.get(0).getRepositoryDetails().get(repo).getRepoName()
									.equalsIgnoreCase(gitRepo)) {

								commitDate = gitdata.get(0).getRepositoryDetails().get(repo).getCommitDetails()
										.get(comm).getDate();

								if (commitDate.after(relStDt) && commitDate.before(relEndDt)) {
									commitCount++;
								}
							}
						}
					}
				}

			}

		}
		return commitCount;
	}

	@GET
	@Path("/getContributorCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getContributorCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {

		long contributorCount = 0;

		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class); // return
																										// only
																										// 1
																										// item
		List<String> products = productdetails.get(0).getProducts();
		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String gitName = selectedDashboards.get(i).getComponent().getGitName();
				String gitType = selectedDashboards.get(i).getComponent().getGitType();
				String gitRepo = selectedDashboards.get(i).getComponent().getGitRepo();

				Query gitquery = new Query();
				gitquery.addCriteria(Criteria.where("gitName").is(gitName));
				gitquery.addCriteria(Criteria.where("gitType").is(gitType));
				gitquery.addCriteria(Criteria.where("repositoryDetails.repoName").is(gitRepo));

				List<GitRepositoryVO> gitdata = new ArrayList<GitRepositoryVO>();

				gitdata = getMongoOperation().find(gitquery, GitRepositoryVO.class);

				if (!gitdata.isEmpty()) {
					for (int j = 0; j < gitdata.get(0).getRepositoryDetails().size(); j++) {
						if (gitdata.get(0).getRepositoryDetails().get(j).getRepoName().equalsIgnoreCase(gitRepo)) {
							contributorCount += gitdata.get(0).getRepositoryDetails().get(j).getContributorsCount();
						}
					}

				}

			}

		}
		return contributorCount;
	}

	@GET
	@Path("/getDefectsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDefectsCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		long defCount = 0;
		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				long defectCountList = 0;
				String domain = selectedDashboards.get(i).getComponent().getDomainName();
				String project = selectedDashboards.get(i).getComponent().getProjectName();
				String release = selectedDashboards.get(i).getComponent().getReleaseName();
				List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domain, project, release);

				Query query3 = new Query();
				query3.addCriteria(Criteria.where("levelId").in(levelIdList));
				query3.addCriteria(Criteria.where("opendate").gte(relStDt).lte(relEndDt));

				defectCountList = getMongoOperation().count(query3, DefectVO.class);
				defCount = defectCountList + defCount;
			}

		}
		return defCount;

	}

	@GET
	@Path("/getExecPassPercent")
	@Produces(MediaType.APPLICATION_JSON)
	public long getExecPassPercent(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		long exeCount = 0;
		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				long exeCountList = 0;
				String domain = selectedDashboards.get(i).getComponent().getDomainName();
				String project = selectedDashboards.get(i).getComponent().getProjectName();
				String release = selectedDashboards.get(i).getComponent().getReleaseName();
				List<DefectStatusVO> result = null;

				List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domain, project, release);

				Query query3 = new Query();
				query3.addCriteria(Criteria.where("levelId").in(levelIdList));
				query3.addCriteria(Criteria.where("testExecutionDate").gte(relStDt).lte(relEndDt));

				exeCountList = getMongoOperation().count(query3, TestExecutionVO.class);
				exeCount = exeCountList + exeCount;
			}

		}
		return exeCount;

	}

	@GET
	@Path("/getEnvironmentsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getEnvironmentsCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		
		long envCount = 0;
		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String selecteddeployval = selectedDashboards.get(i).getComponent().getCookbookName();
				Query deployquery = new Query();
				deployquery.addCriteria(Criteria.where("cookbookname").is(selecteddeployval));

				List<ChefRunsVO> deploydetails = getMongoOperation().find(deployquery, ChefRunsVO.class);
				envCount = deploydetails.size();
			}

		}
		return envCount;

	}

	@GET
	@Path("/getQaCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> getQaCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		List<Long> productInfo = new ArrayList<Long>();

		if (authenticateToken) {
			long qapass = 0;
			long qafail = 0;
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String selecteddeployval = selectedDashboards.get(i).getComponent().getCookbookName();
				Query deployquery = new Query();
				deployquery.addCriteria(Criteria.where("cookbookname").is(selecteddeployval));
				deployquery.addCriteria(Criteria.where("creationTime").gte(relStDt).lte(relEndDt));
				List<ChefRunsVO> deploydetails = getMongoOperation().find(deployquery, ChefRunsVO.class);
				if (!deploydetails.isEmpty()) {
					for (int l = 0; l < deploydetails.size(); l++) {
						if (deploydetails.get(l).getNodename().equalsIgnoreCase("QA")) {
							if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
								qapass++;
							} else {
								qafail++;
							}
						}
					}
				}

			}
			productInfo.add(qapass);
			productInfo.add(qafail);
		}
		return productInfo;

	}

	@GET
	@Path("/getDevCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> getDevCount(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		List<Long> productInfo = new ArrayList<Long>();
		if (authenticateToken) {
			long devpass = 0;
			long devfail = 0;
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String selecteddeployval = selectedDashboards.get(i).getComponent().getCookbookName();
				Query deployquery = new Query();
				deployquery.addCriteria(Criteria.where("cookbookname").is(selecteddeployval));
				deployquery.addCriteria(Criteria.where("creationTime").gte(relStDt).lte(relEndDt));
				List<ChefRunsVO> deploydetails = getMongoOperation().find(deployquery, ChefRunsVO.class);
				if (!deploydetails.isEmpty()) {
					for (int l = 0; l < deploydetails.size(); l++) {
						if (deploydetails.get(l).getNodename().equalsIgnoreCase("DEV")) {
							if (deploydetails.get(l).getStatus().equalsIgnoreCase("success")) {
								devpass++;
							} else {
								devfail++;
							}
						}
					}
				}

			}
			productInfo.add(devpass);
			productInfo.add(devfail);
		}
		return productInfo;

	}

	@GET
	@Path("/getlinesofcode")
	@Produces(MediaType.APPLICATION_JSON)
	public long getLinesofCode(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {

		long linesofCode = 0;

		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		SimpleDateFormat sdf = new SimpleDateFormat(IdashboardConstantsUtil.YYYY_MM_DD);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class); // return only 1
																										// item
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				String selectedsonarval = selectedDashboards.get(i).getComponent().getCodeAnalysisProjectName();

				Query sonarquery = new Query();
				sonarquery.addCriteria(Criteria.where("prjName").is(selectedsonarval));

				List<CodeAnalysisVO> cadetails = getMongoOperation().find(sonarquery, CodeAnalysisVO.class);

				int maxIndex = 0;
				Date histDate = new Date();
				Date maxDate = sdf.parse(cadetails.get(0).getHistory().get(0).getDate()); //

				if (!cadetails.isEmpty()) {

					for (int j = 1; j < cadetails.get(0).getHistory().size(); j++) {
						histDate = sdf.parse(cadetails.get(0).getHistory().get(j).getDate());

						// get the latest history 'date' in the list
						if (histDate != null && histDate.compareTo(maxDate) >= 0) {
							maxDate = histDate;
							maxIndex = j;
						}
					}
					if (histDate.after(relStDt) && histDate.before(relEndDt)) {
						linesofCode += Long.parseLong(cadetails.get(0).getHistory().get(maxIndex).getSize().getLines());
					}
				}
			}

		}
		return linesofCode;
	}

	@GET
	@Path("/getdeploymentdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> getDeploymentdata(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {

		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class); // return only 1
																										// item

		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();

		List<Long> productInfo = new ArrayList<Long>();
		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();
			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));
			long passcount = 0;
			long failcount = 0;
			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);
			for (int j = 0; j < selectedDashboards.size(); j++) {
				String selectedjenkinval = selectedDashboards.get(j).getComponent().getBuildJobName();
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
				Query deployquery = new Query();
				for (int i = 0; i < selectedDashboards.size(); i++) {

					Query jenkinquery = new Query();
					jenkinquery.addCriteria(Criteria.where("jobName").is(selectedjenkinval));
					// jenkinquery.addCriteria(Criteria.where("builds.timeStamp").gte(relStDt).lte(relEndDt));
					List<BuildJobsVO> builddetails = getMongoOperation().find(jenkinquery, BuildJobsVO.class);
					List<BuildListVO> builds = builddetails.get(0).getBuildList();

					if (!builds.isEmpty()) {
						for (int k = 0; k < builds.size(); k++) {
							Date startTime = builds.get(i).getStartTime();
							Date endTime = builds.get(i).getEndTime();
							// String startDate = formatter.format(startTime);
							// String endDate = formatter.format(endTime);

							// Date startTim = formatter.parse(startDate);
							// Date endTim = formatter.parse(endDate);
							if (startTime.after(relStDt) && endTime.before(relEndDt)) {
								if (builds.get(i).getResult().equalsIgnoreCase("SUCCESS")) {
									passcount++;
								} else {
									failcount++;
								}
							}
						}

					}
				}
			}
			productInfo.add(passcount);
			productInfo.add(failcount);
		}
		return productInfo;
	}

	@GET
	@Path("/getDepSpeedMax")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDepSpeedMax(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long maxDepTime = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			List<Long> maxTimeList = new ArrayList<Long>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);

			for (int i = 0; i < selectedDashboards.size(); i++) {

				String buildJob = selectedDashboards.get(i).getComponent().getBuildJobName();
				Query query3 = new Query();
				query3.addCriteria(Criteria.where("jobName").is(buildJob));
				List<BuildListVO> buildsListDetails = null;
				List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
				buildsListDetails = buildsList.get(0).getBuildList();
				for (int j = 0; j < buildsListDetails.size(); j++) {
					String result = buildsListDetails.get(j).getResult();
					Date startTime = buildsListDetails.get(j).getStartTime();
					String startDate = formatter.format(startTime);
					Date endTime = buildsListDetails.get(j).getEndTime();
					if (startDate.equals(todayDate) && result.equalsIgnoreCase(IdashboardConstantsUtil.SUCCESS)) {

						long duration = endTime.getTime() - startTime.getTime();
						long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(duration);
						// long diffInMinutes =
						// TimeUnit.MILLISECONDS.toSeconds(duration);
						if (diffInMinutes != 0) {
							maxTimeList.add(diffInMinutes);
						}

					}

				}

			}
			if (!maxTimeList.isEmpty()) {
				maxDepTime = Collections.max(maxTimeList);
			}
		}
		return maxDepTime;

	}

	@GET
	@Path("/getDepSpeedMin")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDepSpeedMin(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long minDepTime = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			List<Long> maxTimeList = new ArrayList<Long>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);

			for (int i = 0; i < selectedDashboards.size(); i++) {

				String buildJob = selectedDashboards.get(i).getComponent().getBuildJobName();
				Query query3 = new Query();
				query3.addCriteria(Criteria.where("jobName").is(buildJob));
				List<BuildListVO> buildsListDetails = null;
				List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
				buildsListDetails = buildsList.get(0).getBuildList();
				for (int j = 0; j < buildsListDetails.size(); j++) {
					String result = buildsListDetails.get(j).getResult();
					Date startTime = buildsListDetails.get(j).getStartTime();
					String startDate = formatter.format(startTime);
					Date endTime = buildsListDetails.get(j).getEndTime();

					if (startDate.equals(todayDate) && result.equalsIgnoreCase(IdashboardConstantsUtil.SUCCESS)) {

						long duration = endTime.getTime() - startTime.getTime();
						long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(duration);
						// long diffInMinutes =
						// TimeUnit.MILLISECONDS.toSeconds(duration);
						if (diffInMinutes != 0) {
							maxTimeList.add(diffInMinutes);
						}
					}

				}

			}
			if (maxTimeList.size() != 0) {
				minDepTime = Collections.min(maxTimeList);
			}
		}
		return minDepTime;

	}

	@GET
	@Path("/getDepSpeedAvg")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDepSpeedAvg(@HeaderParam("Authorization") String authString, @QueryParam("selected") String selected)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long avgDepTime = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			List<Long> maxTimeList = new ArrayList<Long>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);

			for (int i = 0; i < selectedDashboards.size(); i++) {

				String buildJob = selectedDashboards.get(i).getComponent().getBuildJobName();
				Query query3 = new Query();
				query3.addCriteria(Criteria.where("jobName").is(buildJob));
				List<BuildListVO> buildsListDetails = null;
				List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
				buildsListDetails = buildsList.get(0).getBuildList();
				for (int j = 0; j < buildsListDetails.size(); j++) {
					String result = buildsListDetails.get(j).getResult();
					Date startTime = buildsListDetails.get(j).getStartTime();
					String startDate = formatter.format(startTime);

					Date endTime = buildsListDetails.get(j).getEndTime();
					if (startDate.equals(todayDate) && result.equalsIgnoreCase(IdashboardConstantsUtil.SUCCESS)) {

						long duration = endTime.getTime() - startTime.getTime();
						long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(duration);
						// long diffInMinutes =
						// TimeUnit.MILLISECONDS.toSeconds(duration);
						if (diffInMinutes != 0) {
							maxTimeList.add(diffInMinutes);
						}
					}

				}

			}
			long avgSum = 0;
			for (long maxTimList : maxTimeList) {
				avgSum += maxTimList;
			}
			try {
				if (!maxTimeList.isEmpty())
					avgDepTime = avgSum / maxTimeList.size();

			} catch (Exception Ex) {

			}
		}
		return avgDepTime;

	}

	@GET
	@Path("/getDepSpeedAvgWeekly")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDepSpeedAvgWeekly(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long weeklyAvgDepTime = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			List<Long> maxTimeList = new ArrayList<Long>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);
			int noofdays = 6;
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);
			Date dates = formatter.parse(todayDate);// current date
			Calendar cal1 = Calendar.getInstance();
			cal1.setTime(dates);
			cal1.set(Calendar.HOUR_OF_DAY, 23);
			cal1.set(Calendar.MINUTE, 59);
			cal1.set(Calendar.SECOND, 59);
			Date currentDate = cal1.getTime();

			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			cal.add(Calendar.DATE, -(noofdays));
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 1);
			Date dateBefore7Days = cal.getTime();
			// String currentDate = form.format(dates);
			// String before7Days = form.format(dates);
			for (int i = 0; i < selectedDashboards.size(); i++) {

				String buildJob = selectedDashboards.get(i).getComponent().getBuildJobName();
				Query query3 = new Query();
				query3.addCriteria(Criteria.where("jobName").is(buildJob));
				List<BuildListVO> buildsListDetails = null;
				List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
				buildsListDetails = buildsList.get(0).getBuildList();
				for (int j = 0; j < buildsListDetails.size(); j++) {
					String result = buildsListDetails.get(j).getResult();
					Date startTime = buildsListDetails.get(j).getStartTime();
					String startDate = formatter.format(startTime);
					Date currentStartTime = formatter.parse(startDate);

					Date endTime = buildsListDetails.get(j).getEndTime();

					if (currentStartTime.after(dateBefore7Days) && (currentStartTime.before(currentDate))
							&& result.equalsIgnoreCase(IdashboardConstantsUtil.SUCCESS)) {

						long duration = endTime.getTime() - startTime.getTime();
						long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(duration);
						// long diffInMinutes =
						// TimeUnit.MILLISECONDS.toSeconds(duration);

						if (diffInMinutes != 0) {
							maxTimeList.add(diffInMinutes);
						}
					}

				}

			}
			long avgSum = 0;
			for (long maxTimList : maxTimeList) {
				avgSum += maxTimList;
			}
			try {
				if (!maxTimeList.isEmpty())
					weeklyAvgDepTime = avgSum / maxTimeList.size();
			} catch (Exception Ex) {

			}
		}
		return weeklyAvgDepTime;

	}

	@GET
	@Path("/gettotaldeployment")
	@Produces(MediaType.APPLICATION_JSON)
	public long getTotalDeployment(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long totalDeployment = 0;

		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

			Date ldt = new Date();
			String todayDate = formatter.format(ldt);

			List<String> buildJobList = new ArrayList<String>();
			List<String> finalbuildjob = new ArrayList<String>();

			// String currentDate = form.format(dates);
			// String before7Days = form.format(dates);
			for (int i = 0; i < selectedDashboards.size(); i++) {

				// remove duplicate build jobs- consider a job only once.
				String build_job = null;
				buildJobList.add(selectedDashboards.get(i).getComponent().getBuildJobName());

				for (String x : buildJobList) {
					if (!finalbuildjob.contains(x)) {
						finalbuildjob.add(x);
						build_job = x;
					}
				}

				if (build_job != null) {
					Query query3 = new Query();
					query3.addCriteria(Criteria.where("jobName").is(build_job));
					List<BuildListVO> buildsListDetails = null;
					List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
					buildsListDetails = buildsList.get(0).getBuildList();
					for (int j = 0; j < buildsListDetails.size(); j++) {

						String result = buildsListDetails.get(j).getResult();
						Date startTime = buildsListDetails.get(j).getStartTime();
						String startDate = formatter.format(startTime);

						// String startDate = formatter.format(startTime);
						// Date currentStartDate = formatter.parse(startDate);
						if (startDate.equals(todayDate)) {
							totalDeployment++;

						}

					}
				}

			}
		}

		return totalDeployment;

	}

	@GET
	@Path("/getweeklydeployment")
	@Produces(MediaType.APPLICATION_JSON)
	public long getWeeklyDeployment(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long weekDeployment = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);
			int noofdays = 6;
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);
			Date dates = formatter.parse(todayDate);// current date
			Calendar cal1 = Calendar.getInstance();
			cal1.setTime(dates);
			cal1.set(Calendar.HOUR_OF_DAY, 23);
			cal1.set(Calendar.MINUTE, 59);
			cal1.set(Calendar.SECOND, 59);
			Date currentDate = cal1.getTime();

			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			cal.add(Calendar.DATE, -(noofdays));
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 1);
			Date dateBefore7Days = cal.getTime();
			// String currentDate = form.format(dates);
			// String before7Days = form.format(dates);

			List<String> buildJobList = new ArrayList<String>();
			List<String> finalbuildjob = new ArrayList<String>();

			for (int i = 0; i < selectedDashboards.size(); i++) {

				// remove duplicate build jobs- consider a job only once.
				String build_job = null;
				buildJobList.add(selectedDashboards.get(i).getComponent().getBuildJobName());

				for (String x : buildJobList) {
					if (!finalbuildjob.contains(x)) {
						finalbuildjob.add(x);
						build_job = x;
					}
				}

				if (build_job != null) {
					Query query3 = new Query();
					query3.addCriteria(Criteria.where("jobName").is(build_job));
					List<BuildListVO> buildsListDetails = null;
					List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
					buildsListDetails = buildsList.get(0).getBuildList();

					for (int j = 0; j < buildsListDetails.size(); j++) {
						String result = buildsListDetails.get(j).getResult();
						Date startTime = buildsListDetails.get(j).getStartTime();
						String startDate = formatter.format(startTime);
						Date currentStartTime = formatter.parse(startDate);
						Date endTime = buildsListDetails.get(j).getEndTime();

						if (currentStartTime.after(dateBefore7Days) && (currentStartTime.before(currentDate))
								&& (endTime.before(currentDate))
								&& result.equalsIgnoreCase(IdashboardConstantsUtil.SUCCESS)) {

							weekDeployment++;
						}

					}
				}

			}

		}
		return weekDeployment;

	}

	@GET
	@Path("/getdeploymentfailure")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDeploymentFailure(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long deploymentFailed = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

			Date ldt = new Date();
			String todayDate = formatter.format(ldt);

			List<String> buildJobList = new ArrayList<String>();
			List<String> finalbuildjob = new ArrayList<String>();

			for (int i = 0; i < selectedDashboards.size(); i++) {

				// remove duplicate build jobs- consider a job only once.
				String build_job = null;
				buildJobList.add(selectedDashboards.get(i).getComponent().getBuildJobName());

				for (String x : buildJobList) {
					if (!finalbuildjob.contains(x)) {
						finalbuildjob.add(x);
						build_job = x;
					}
				}

				if (build_job != null) {
					Query query3 = new Query();
					query3.addCriteria(Criteria.where("jobName").is(build_job));
					List<BuildListVO> buildsListDetails = null;
					List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
					buildsListDetails = buildsList.get(0).getBuildList();

					for (int j = 0; j < buildsListDetails.size(); j++) {
						String result = buildsListDetails.get(j).getResult();
						Date startTime = buildsListDetails.get(j).getStartTime();
						String startDate = formatter.format(startTime);

						if (startDate.equals(todayDate) && result.equalsIgnoreCase(IdashboardConstantsUtil.FAILURE)) {

							deploymentFailed++;
						}

					}
				}

			}

		}
		return deploymentFailed;

	}

	@GET
	@Path("/getweeklydeploymentfailure")
	@Produces(MediaType.APPLICATION_JSON)
	public long getWeeklyDeploymentFailure(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException, ParseException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long weekDeploymentFailed = 0;

		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);
			int noofdays = 6;
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date ldt = new Date();
			String todayDate = formatter.format(ldt);
			Date dates = formatter.parse(todayDate);// current date
			Calendar cal1 = Calendar.getInstance();
			cal1.setTime(dates);
			cal1.set(Calendar.HOUR_OF_DAY, 23);
			cal1.set(Calendar.MINUTE, 59);
			cal1.set(Calendar.SECOND, 59);
			Date currentDate = cal1.getTime();

			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			cal.add(Calendar.DATE, -(noofdays));
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 1);
			Date dateBefore7Days = cal.getTime();

			List<String> buildJobList = new ArrayList<String>();
			List<String> finalbuildjob = new ArrayList<String>();

			for (int i = 0; i < selectedDashboards.size(); i++) {

				// remove duplicate build jobs- consider a job only once.
				String build_job = null;
				buildJobList.add(selectedDashboards.get(i).getComponent().getBuildJobName());

				for (String x : buildJobList) {
					if (!finalbuildjob.contains(x)) {
						finalbuildjob.add(x);
						build_job = x;
					}
				}

				if (build_job != null) {
					Query query3 = new Query();
					query3.addCriteria(Criteria.where("jobName").is(build_job));
					List<BuildListVO> buildsListDetails = null;
					List<BuildJobsVO> buildsList = getMongoOperation().find(query3, BuildJobsVO.class);
					buildsListDetails = buildsList.get(0).getBuildList();

					for (int j = 0; j < buildsListDetails.size(); j++) {
						String result = buildsListDetails.get(j).getResult();
						Date startTime = buildsListDetails.get(j).getStartTime();
						String startDate = formatter.format(startTime);
						Date endTime = buildsListDetails.get(j).getEndTime();

						if (startTime.after(dateBefore7Days) && (startTime.before(currentDate))
								&& (endTime.before(currentDate))
								&& result.equalsIgnoreCase(IdashboardConstantsUtil.FAILURE)) {

							weekDeploymentFailed++;
						}

					}
				}

			}

		}
		return weekDeploymentFailed;

	}

	@GET
	@Path("/getAutoTestPassPercent")
	@Produces(MediaType.APPLICATION_JSON)
	public long getAutoTestPassPercent(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		long exeTotCount = 0;
		long autoExeCount = 0;
		long autoTestPassPercent = 0;
		if (authenticateToken) {

			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			for (int i = 0; i < selectedDashboards.size(); i++) {
				long exeCountList = 0;
				String domain = selectedDashboards.get(i).getComponent().getDomainName();
				String project = selectedDashboards.get(i).getComponent().getProjectName();
				String release = selectedDashboards.get(i).getComponent().getReleaseName();
				List<DefectStatusVO> result = null;

				try {
					List<Integer> levelIdList = OperationalDAO.getALMLevelIds(domain, project, release);

					Query query3 = new Query();
					query3.addCriteria(Criteria.where("levelId").in(levelIdList));
					query3.addCriteria(Criteria.where("testExecutionDate").gte(relStDt).lte(relEndDt));
					query3.addCriteria(Criteria.where("testType").ne("MANUAL"));
					exeCountList = getMongoOperation().count(query3, TestExecutionVO.class);
					autoExeCount = exeCountList + autoExeCount;
					logger.error(autoExeCount);
					Query query4 = new Query();
					query4.addCriteria(Criteria.where("levelId").in(levelIdList));
					query4.addCriteria(Criteria.where("testExecutionDate").gte(relStDt).lte(relEndDt));

					long exeTotCountList = getMongoOperation().count(query4, TestExecutionVO.class);
					exeTotCount = exeTotCount + exeTotCountList;

					autoTestPassPercent = (autoExeCount * 100 / exeTotCount);
				} catch (ArithmeticException e) {

				}

			}

		}

		return autoTestPassPercent;

	}

	@GET
	@Path("/getDeploymentSize")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDeploymentSize(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		long depCount = 0;
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		List<String> products = productdetails.get(0).getProducts();
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		if (authenticateToken) {
			List<LCDashboardVO> selectedDashboards = new ArrayList<LCDashboardVO>();

			Query query2 = new BasicQuery(query);
			query2.addCriteria(Criteria.where("dashboardName").in(products));
			query2.addCriteria(Criteria.where("owner").is(userId));

			selectedDashboards = getMongoOperation().find(query2, LCDashboardVO.class);

			List<String> jiraProjects = new ArrayList<String>();
			for (int i = 0; i < selectedDashboards.size(); i++) {
				String jiraProj = selectedDashboards.get(i).getComponent().getJiraProject();
				jiraProjects.add(jiraProj);
			}

			Query sprintquery = new Query();
			sprintquery.addCriteria(Criteria.where("prjName").in(jiraProjects));
			sprintquery.addCriteria(Criteria.where("issueUpdated").gte(relStDt).lte(relEndDt));
			sprintquery.addCriteria(Criteria.where("issueStatus").is("Done"));
			sprintquery.addCriteria(Criteria.where("issueType").is("Story"));
			depCount = getMongoOperation().count(sprintquery, JiraRequirmentVO.class);

		}
		return depCount;

	}

	@GET
	@Path("/getincidentresolved")
	@Produces(MediaType.APPLICATION_JSON)
	public long getIncidentResolvedSLA(@HeaderParam("Authorization") String authString,
			@QueryParam("selected") String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		AuthenticationService authenticationService = new AuthenticationService();
		String userId = authenticationService.getUser(authString);
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		String met = "met";
		long totIncident = 0;
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
		Date relStDt = productdetails.get(0).getfromDates();
		Date relEndDt = productdetails.get(0).gettoDates();
		if (authenticateToken) {

			Query query2 = new Query();
			query2.addCriteria(Criteria.where("slaResponse").is(met));
			query2.addCriteria(Criteria.where("reportedDate").gte(relStDt).lte(relEndDt));

			totIncident = getMongoOperation().count(query2, IncidentListVO.class);

		}
		return totIncident;

	}

	/*
	 * 
	 */
	@GET
	@Path("/jiraprojectdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getprojectDetails(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> projectcoll = null;

		AuthenticationService authenticationService = new AuthenticationService();
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);

		if (authenticateToken) {
			projectcoll = getMongoOperation().getCollection("JiraRequirements").distinct("prjName");

			// System.out.println("projectDetails>>>>>4444::::" + projectcoll);
		}

		return projectcoll;

	}

	@GET
	@Path("/fortifyprojectdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getFortifyProjectDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<String> projectcoll = null;

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);

		if (authenticateToken) {
			projectcoll = getMongoOperation().getCollection("fortifyDetails").distinct("projectName");
		}

		return projectcoll;

	}

	@GET
	@Path("/fortifyversiondetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getFortifyVersionDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> versioncoll = null;

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);

		Query query1 = new Query();
		query1.addCriteria(Criteria.where("projectName").in(selectedFortifyProject));

		if (authenticateToken) {
			versioncoll = getMongoOperation().getCollection("fortifyDetails").distinct("versions.versionId",
					query1.getQueryObject());
		}

		return versioncoll;

	}

	@GET
	@Path("/fortifyHomeMetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Integer> getFortifyHomeMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject,
			@QueryParam("selectedFortifyVersion") String selectedFortifyVersion) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<Integer> fortifyHomeDetails = new ArrayList<Integer>();

		if (authenticateToken) {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));
			query1.addCriteria(Criteria.where("versions.versionId").is(selectedFortifyVersion));

			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);

			int totalScans = 0;
			int files = 0;
			int numFilesWithIssues = 0;

			if (fortifyDetails.size() != 0) {
				for (int i = 0; i < fortifyDetails.get(0).getVersions().size(); i++) {
					if (fortifyDetails.get(0).getVersions().get(i).getVersionId()
							.equalsIgnoreCase(selectedFortifyVersion)) {

						totalScans = fortifyDetails.get(0).getVersions().get(i).getTotalScans();
						files = fortifyDetails.get(0).getVersions().get(i).getFILES();
						numFilesWithIssues = fortifyDetails.get(0).getVersions().get(i).getNumFilesWithIssues();
					}

				}
			}
			fortifyHomeDetails.add(totalScans);
			fortifyHomeDetails.add(files);
			fortifyHomeDetails.add(numFilesWithIssues);

		}
		return fortifyHomeDetails;

	}

	@GET
	@Path("/fortifyMetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<FortifyVO> getFortifyMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject,
			@QueryParam("selectedFortifyVersion") String selectedFortifyVersion) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));
			query1.addCriteria(Criteria.where("versions.versionId").is(selectedFortifyVersion));

			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);
		}

		return fortifyDetails;

	}

	@GET
	@Path("/fortifyLast3VersionChart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<FortifyVO> getFortifyLast3VersionChart(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));

			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);

			Collections.sort(fortifyDetails, new Comparator<FortifyVO>() {
				public int compare(FortifyVO m1, FortifyVO m2) {
					return m1.getVersions().get(0).getVersionCreationDate()
							.compareTo(m2.getVersions().get(0).getVersionCreationDate());
				}
			});
		}

		return fortifyDetails;

	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/getuserstoryactivesprint")
	@Produces(MediaType.TEXT_XML)
	public String getUserStoryActiveSprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String activeSprint = null;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {

			// get Today's date DD-MM-YYYT00:00:00Z

			Date currentDate = new Date();
			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 1);
			Date todayDate = cal.getTime();

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("prjName").in(userStrproject));
			query1.addCriteria(Criteria.where("issueSprintStartDate").lte(todayDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").gte(todayDate));

			// get distinct issueSprintName
			List<String> allSprint = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
					query1.getQueryObject());

			if (!allSprint.isEmpty()) {
				activeSprint = allSprint.get(0);

			}
		}

		return activeSprint;

	}

	@GET
	@Path("/getdaysleftinsprint")
	@Produces(MediaType.APPLICATION_JSON)
	public long getDaysLeftInSprint(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long daysLeft = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {

			List<JiraRequirmentVO> allSprint = null;
			// get Today's date DD-MM-YYYT00:00:00Z

			Date currentDate = new Date();
			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 1);
			Date todayDate = cal.getTime();

			Query query1 = new Query();
			query1.addCriteria(Criteria.where("prjName").in(userStrproject));
			query1.addCriteria(Criteria.where("issueSprintStartDate").lte(todayDate));
			query1.addCriteria(Criteria.where("issueSprintEndDate").gte(todayDate));

			try {
				// get distinct issueSprintName
				allSprint = getMongoOperation().find(query1, JiraRequirmentVO.class);
				Date daysleft = allSprint.get(0).getIssueSprintEndDate();

				daysLeft = daysleft.getTime() - todayDate.getTime(); // in millisec

			} catch (IndexOutOfBoundsException e) {
				e.printStackTrace();
			}

		}

		daysLeft = daysLeft / (24 * 60 * 60 * 1000); // in days

		return daysLeft;

	}

	@GET
	@Path("/getsprintstatus")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> getSprintStatus(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<Long> longList = new ArrayList<Long>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {

			String sprintName = getUserStoryActiveSprint(authString, dashboardName, userStrproject);
			if (sprintName != null) {
				Query query1 = new Query();
				query1.addCriteria(Criteria.where("prjName").in(userStrproject));
				query1.addCriteria(Criteria.where("issueSprint").is(sprintName));
				query1.addCriteria(Criteria.where("issueType").is("Story"));
				query1.addCriteria(Criteria.where("issueStatus").is("Done"));

				long completed = getMongoOperation().count(query1, JiraRequirmentVO.class);

				Query query2 = new Query();
				query2.addCriteria(Criteria.where("prjName").in(userStrproject));
				query2.addCriteria(Criteria.where("issueSprint").is(sprintName));
				query2.addCriteria(Criteria.where("issueType").is("Story"));
				query2.addCriteria(Criteria.where("issueStatus").is("In Progress"));

				long progress = getMongoOperation().count(query2, JiraRequirmentVO.class);

				Query query3 = new Query();
				query3.addCriteria(Criteria.where("prjName").in(userStrproject));
				query3.addCriteria(Criteria.where("issueSprint").is(sprintName));
				query3.addCriteria(Criteria.where("issueType").is("Story"));
				query3.addCriteria(Criteria.where("issueStatus").is("To Do"));

				long todo = getMongoOperation().count(query3, JiraRequirmentVO.class);

				longList.add(completed);
				longList.add(progress);
				longList.add(todo);
			}

		}
		return longList;

	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/getjirasprintcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getSprintCompleted(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long sprintCount = 0;

		List<String> distinctsprint = new ArrayList<String>();
		List<String> finalsprintlist = new ArrayList<String>();
		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		// get Today's date DD-MM-YYYT00:00:00Z

		Date currentDate = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(currentDate);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 1);
		Date todayDate = cal.getTime();

		if (authenticateToken) {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("issueSprintStartDate").lte(todayDate));
			distinctsprint = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprint",
					query1.getQueryObject());

			for (int i = 0; i < distinctsprint.size(); i++) {
				if (!distinctsprint.get(i).equalsIgnoreCase("") && !distinctsprint.get(i).equalsIgnoreCase("Backlog")) {
					finalsprintlist.add(distinctsprint.get(i));
				}
			}

			sprintCount = finalsprintlist.size();
		}

		return sprintCount;

	}

	@GET
	@Path("/getbacklogcount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getBacklogCount(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		long backlogCount = 0;

		Query query1 = new Query();
		query1.addCriteria(Criteria.where("prjName").in(userStrproject));
		query1.addCriteria(Criteria.where("issueSprint").is(""));

		backlogCount = getMongoOperation().count(query1, JiraRequirmentVO.class);

		return backlogCount;

	}

	@GET
	@Path("/getsprintdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Date> getSprintDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		// get Today's date DD-MM-YYYT00:00:00Z

		Date currentDate = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(currentDate);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 1);
		Date todayDate = cal.getTime();

		Query currSprint = new Query();
		currSprint.addCriteria(Criteria.where("prjName").in(userStrproject));
		currSprint.addCriteria(Criteria.where("issueSprintStartDate").lte(todayDate));
		List<Date> enddateList = getMongoOperation().getCollection("JiraRequirements").distinct("issueSprintEndDate",
				currSprint.getQueryObject());

		enddateList.remove(null);

		Collections.sort(enddateList);

		return enddateList;

	}

	@GET
	@Path("/velocityChart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraLifeStatusVO> getVelocityBarChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject,
			@QueryParam("jiraSelectedSprint") String jiraDays) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		long jiraStoryCount = 0;

		List<JiraLifeStatusVO> storyCountList = new ArrayList<JiraLifeStatusVO>();

		JiraLifeStatusVO storyCount = null;
		List<Date> sprintdatelist = getSprintDetails(authString, dashboardName, userStrproject);
		int listSize = sprintdatelist.size();

		List<Date> sprintlist = new ArrayList<Date>();
		sprintlist.add(sprintdatelist.get(listSize - 1)); // currentSprint
		sprintlist.add(sprintdatelist.get(listSize - 2)); // Last sprint
		sprintlist.add(sprintdatelist.get(listSize - 3)); // second last sprint
		sprintlist.add(sprintdatelist.get(listSize - 4)); // third last sprint

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		if (authenticateToken) {

			if (jiraDays.equalsIgnoreCase("current")) {
				storyCount = new JiraLifeStatusVO();

				Query query0 = new Query();
				query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(0)));
				query0.addCriteria(Criteria.where("prjName").in(userStrproject));

				String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0).getIssueSprint();

				Query query1 = new Query();
				query1.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(0)));
				query1.addCriteria(Criteria.where("issueType").is("Story"));
				query1.addCriteria(Criteria.where("prjName").in(userStrproject));
				query1.addCriteria(Criteria.where("issueStatus").is("Done"));

				jiraStoryCount = getMongoOperation().count(query1, JiraRequirmentVO.class);

				storyCount.setSprintName(sprintName);
				storyCount.setStoryCompleted(jiraStoryCount);
				storyCountList.add(storyCount);

			}

			else if (jiraDays.equalsIgnoreCase("last")) {

				for (int i = 1; i < 2; i++) {
					storyCount = new JiraLifeStatusVO();

					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query query2 = new Query();
					query2.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query2.addCriteria(Criteria.where("issueType").is("Story"));
					query2.addCriteria(Criteria.where("prjName").in(userStrproject));
					query2.addCriteria(Criteria.where("issueStatus").is("Done"));

					jiraStoryCount = getMongoOperation().count(query2, JiraRequirmentVO.class);

					storyCount.setSprintName(sprintName);
					storyCount.setStoryCompleted(jiraStoryCount);

					storyCountList.add(storyCount);
				}
			} else if (jiraDays.equalsIgnoreCase("lastthree")) {

				for (int i = 1; i < 4; i++) {
					storyCount = new JiraLifeStatusVO();

					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query query2 = new Query();
					query2.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query2.addCriteria(Criteria.where("issueType").is("Story"));
					query2.addCriteria(Criteria.where("prjName").in(userStrproject));
					query2.addCriteria(Criteria.where("issueStatus").is("Done"));

					jiraStoryCount = getMongoOperation().count(query2, JiraRequirmentVO.class);

					storyCount.setSprintName(sprintName);
					storyCount.setStoryCompleted(jiraStoryCount);
					storyCountList.add(storyCount);
				}
			}
		}

		return storyCountList;
	}

	@GET
	@Path("/issuesbyprioritybar")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraLifeStatusVO> getIssuesByPriorityBar(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject,
			@QueryParam("jiraSelectedSprint") String jiraDays) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		long high = 0;
		long medium = 0;
		long low = 0;
		long vhigh = 0;
		long highCurrentSprint = 0;
		long mediumCurrentSprint = 0;
		long lowCurrentSprint = 0;
		long vhighCurrentSprint = 0;

		List<JiraLifeStatusVO> issuePriority = new ArrayList<JiraLifeStatusVO>();
		JiraLifeStatusVO bugCount = null;

		List<Date> sprintdatelist = getSprintDetails(authString, dashboardName, userStrproject);
		int listSize = sprintdatelist.size();

		Date currentSprintEndDate = sprintdatelist.get(listSize - 1);

		List<Date> sprintlist = new ArrayList<Date>();
		sprintlist.add(sprintdatelist.get(listSize - 1)); // currentSprint
		sprintlist.add(sprintdatelist.get(listSize - 2)); // Last sprint
		sprintlist.add(sprintdatelist.get(listSize - 3)); // second last sprint
		sprintlist.add(sprintdatelist.get(listSize - 4)); // third last sprint
		sprintlist.add(sprintdatelist.get(listSize - 5)); // fourth last
		sprintlist.add(sprintdatelist.get(listSize - 6)); // fifth last

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {

			if (jiraDays.equalsIgnoreCase("current")) {
				// get Sprint Name first
				Query query0 = new Query();
				query0.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprintEndDate));
				query0.addCriteria(Criteria.where("prjName").in(userStrproject));

				String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0).getIssueSprint();

				// get Count
				Query query1 = new Query();
				query1.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprintEndDate));
				query1.addCriteria(Criteria.where("prjName").in(userStrproject));
				query1.addCriteria(Criteria.where("issueType").is("Bug"));
				query1.addCriteria(Criteria.where("issuePriority").is("High"));
				highCurrentSprint = getMongoOperation().count(query1, JiraDefectVO.class);

				Query query2 = new Query();
				query2.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprintEndDate));
				query2.addCriteria(Criteria.where("prjName").in(userStrproject));
				query2.addCriteria(Criteria.where("issueType").is("Bug"));
				query2.addCriteria(Criteria.where("issuePriority").is("Medium"));
				mediumCurrentSprint = getMongoOperation().count(query2, JiraDefectVO.class);

				Query query3 = new Query();
				query3.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprintEndDate));
				query3.addCriteria(Criteria.where("prjName").in(userStrproject));
				query3.addCriteria(Criteria.where("issueType").is("Bug"));
				query3.addCriteria(Criteria.where("issuePriority").is("Low"));
				lowCurrentSprint = getMongoOperation().count(query3, JiraDefectVO.class);

				Query query4 = new Query();
				query4.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprintEndDate));
				query4.addCriteria(Criteria.where("prjName").in(userStrproject));
				query4.addCriteria(Criteria.where("issueType").is("Bug"));
				query4.addCriteria(Criteria.where("issuePriority").is("Highest"));
				vhighCurrentSprint = getMongoOperation().count(query4, JiraDefectVO.class);
				bugCount = new JiraLifeStatusVO();

				bugCount.setSprintName(sprintName);
				bugCount.setVhighCount(vhighCurrentSprint);
				bugCount.setHighCount(highCurrentSprint);
				bugCount.setMediumCount(mediumCurrentSprint);
				bugCount.setLowCount(lowCurrentSprint);

				issuePriority.add(bugCount);
			}

			else if (jiraDays.equalsIgnoreCase("last")) {

				for (int i = 1; i < 2; i++) {
					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query query1 = new Query();
					query1.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query1.addCriteria(Criteria.where("prjName").in(userStrproject));
					query1.addCriteria(Criteria.where("issueType").is("Bug"));
					query1.addCriteria(Criteria.where("issuePriority").is("High"));
					high = getMongoOperation().count(query1, JiraDefectVO.class);

					Query query2 = new Query();
					query2.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query2.addCriteria(Criteria.where("prjName").in(userStrproject));
					query2.addCriteria(Criteria.where("issueType").is("Bug"));
					query2.addCriteria(Criteria.where("issuePriority").is("Medium"));
					medium = getMongoOperation().count(query2, JiraDefectVO.class);

					Query query3 = new Query();
					query3.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query3.addCriteria(Criteria.where("prjName").in(userStrproject));
					query3.addCriteria(Criteria.where("issueType").is("Bug"));
					query3.addCriteria(Criteria.where("issuePriority").is("Low"));
					low = getMongoOperation().count(query3, JiraDefectVO.class);

					Query query4 = new Query();
					query4.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query4.addCriteria(Criteria.where("prjName").in(userStrproject));
					query4.addCriteria(Criteria.where("issueType").is("Bug"));
					query4.addCriteria(Criteria.where("issuePriority").is("Highest"));
					vhigh = getMongoOperation().count(query4, JiraDefectVO.class);

					bugCount = new JiraLifeStatusVO();

					bugCount.setSprintName(sprintName);
					bugCount.setVhighCount(vhigh);
					bugCount.setHighCount(high);
					bugCount.setMediumCount(medium);
					bugCount.setLowCount(low);

					issuePriority.add(bugCount);
				}

			} else if (jiraDays.equalsIgnoreCase("lastthree")) {

				for (int i = 1; i < 4; i++) {
					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query query1 = new Query();
					query1.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query1.addCriteria(Criteria.where("prjName").in(userStrproject));
					query1.addCriteria(Criteria.where("issueType").is("Bug"));
					query1.addCriteria(Criteria.where("issuePriority").is("High"));
					high = getMongoOperation().count(query1, JiraDefectVO.class);

					Query query2 = new Query();
					query2.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query2.addCriteria(Criteria.where("prjName").in(userStrproject));
					query2.addCriteria(Criteria.where("issueType").is("Bug"));
					query2.addCriteria(Criteria.where("issuePriority").is("Medium"));
					medium = getMongoOperation().count(query2, JiraDefectVO.class);

					Query query3 = new Query();
					query3.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query3.addCriteria(Criteria.where("prjName").in(userStrproject));
					query3.addCriteria(Criteria.where("issueType").is("Bug"));
					query3.addCriteria(Criteria.where("issuePriority").is("Low"));
					low = getMongoOperation().count(query3, JiraDefectVO.class);

					Query query4 = new Query();
					query4.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query4.addCriteria(Criteria.where("prjName").in(userStrproject));
					query4.addCriteria(Criteria.where("issueType").is("Bug"));
					query4.addCriteria(Criteria.where("issuePriority").is("Highest"));
					vhigh = getMongoOperation().count(query4, JiraDefectVO.class);
					bugCount = new JiraLifeStatusVO();

					bugCount.setSprintName(sprintName);
					bugCount.setVhighCount(vhigh);
					bugCount.setHighCount(high);
					bugCount.setMediumCount(medium);
					bugCount.setLowCount(low);

					issuePriority.add(bugCount);
				}

			}

		}
		return issuePriority;
	}

	@GET
	@Path("/storybugreportchart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JiraLifeStatusVO> getStoryBugReportChart(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject,
			@QueryParam("jiraSelectedSprint") String jiraDays) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {

		long jiraStoryCnt = 0;
		long jiraBugCnt = 0;

		List<JiraLifeStatusVO> countList = new ArrayList<JiraLifeStatusVO>();

		JiraLifeStatusVO reportCount = null;
		List<Date> sprintdatelist = getSprintDetails(authString, dashboardName, userStrproject);
		int listSize = sprintdatelist.size();

		List<Date> sprintlist = new ArrayList<Date>();
		sprintlist.add(sprintdatelist.get(listSize - 1)); // currentSprint
		sprintlist.add(sprintdatelist.get(listSize - 2)); // Last sprint
		sprintlist.add(sprintdatelist.get(listSize - 3)); // second last sprint
		sprintlist.add(sprintdatelist.get(listSize - 4)); // third last sprint

		boolean authenticateToken = LayerAccess.getOperationalLayerAccess(authString);
		if (authenticateToken) {

			if (jiraDays.equalsIgnoreCase("current")) {
				reportCount = new JiraLifeStatusVO();

				Query query0 = new Query();
				query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(0)));
				query0.addCriteria(Criteria.where("prjName").in(userStrproject));

				String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0).getIssueSprint();

				Query stryCnt = new Query();
				stryCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(0)));
				stryCnt.addCriteria(Criteria.where("issueType").is("Story"));
				stryCnt.addCriteria(Criteria.where("prjName").in(userStrproject));

				jiraStoryCnt = getMongoOperation().count(stryCnt, JiraRequirmentVO.class);

				Query bugCnt = new Query();
				bugCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(0)));
				bugCnt.addCriteria(Criteria.where("prjName").in(userStrproject));
				bugCnt.addCriteria(Criteria.where("issueType").is("Bug"));
				jiraBugCnt = getMongoOperation().count(bugCnt, JiraDefectVO.class);

				reportCount.setSprintName(sprintName);
				reportCount.setStoryCompleted(jiraStoryCnt);
				reportCount.setTotalBug(jiraBugCnt);
				reportCount.setHighCount(0);
				reportCount.setLowCount(0);
				reportCount.setMediumCount(0);
				reportCount.setVhighCount(0);
				countList.add(reportCount);

			}

			else if (jiraDays.equalsIgnoreCase("last")) {

				for (int i = 1; i < 2; i++) {
					reportCount = new JiraLifeStatusVO();

					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query stryCnt = new Query();
					stryCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					stryCnt.addCriteria(Criteria.where("issueType").is("Story"));
					stryCnt.addCriteria(Criteria.where("prjName").in(userStrproject));

					jiraStoryCnt = getMongoOperation().count(stryCnt, JiraRequirmentVO.class);

					Query bugCnt = new Query();
					bugCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					bugCnt.addCriteria(Criteria.where("prjName").in(userStrproject));
					bugCnt.addCriteria(Criteria.where("issueType").is("Bug"));
					jiraBugCnt = getMongoOperation().count(bugCnt, JiraDefectVO.class);

					reportCount.setSprintName(sprintName);
					reportCount.setStoryCompleted(jiraStoryCnt);
					reportCount.setTotalBug(jiraBugCnt);
					reportCount.setHighCount(0);
					reportCount.setLowCount(0);
					reportCount.setMediumCount(0);
					reportCount.setVhighCount(0);
					countList.add(reportCount);
				}
			} else if (jiraDays.equalsIgnoreCase("lastthree")) {

				for (int i = 1; i < 4; i++) {
					reportCount = new JiraLifeStatusVO();

					Query query0 = new Query();
					query0.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					query0.addCriteria(Criteria.where("prjName").in(userStrproject));

					String sprintName = getMongoOperation().find(query0, JiraRequirmentVO.class).get(0)
							.getIssueSprint();

					Query stryCnt = new Query();
					stryCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					stryCnt.addCriteria(Criteria.where("issueType").is("Story"));
					stryCnt.addCriteria(Criteria.where("prjName").in(userStrproject));

					jiraStoryCnt = getMongoOperation().count(stryCnt, JiraRequirmentVO.class);

					Query bugCnt = new Query();
					bugCnt.addCriteria(Criteria.where("issueSprintEndDate").is(sprintlist.get(i)));
					bugCnt.addCriteria(Criteria.where("prjName").in(userStrproject));
					bugCnt.addCriteria(Criteria.where("issueType").is("Bug"));
					jiraBugCnt = getMongoOperation().count(bugCnt, JiraDefectVO.class);

					reportCount.setSprintName(sprintName);
					reportCount.setStoryCompleted(jiraStoryCnt);
					reportCount.setTotalBug(jiraBugCnt);
					reportCount.setHighCount(0);
					reportCount.setLowCount(0);
					reportCount.setMediumCount(0);
					reportCount.setVhighCount(0);
					countList.add(reportCount);
				}
			}

		}

		return countList;
	}

	@GET
	@Path("/jiracreatedissue")
	@Produces({ "application/json" })
	public List<JiraLifeStatusVO> getCreatedIssue(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName, @QueryParam("userStrproject") String userStrproject,
			@QueryParam("jiraSelectedSprint") String jiraDays) throws JsonParseException, JsonMappingException,
			IOException, NumberFormatException, BaseException, BadLocationException {
		long totalBugCnt = 0;
		long resolvedBugCnt = 0;
		long unresolvedBugCnt = 0;

		List<JiraLifeStatusVO> countList = new ArrayList<JiraLifeStatusVO>();

		JiraLifeStatusVO cntObj = null;
		List<Date> sprintdatelist = getSprintDetails(authString, dashboardName, userStrproject);
		int listSize = sprintdatelist.size();
		Date currentSprint = sprintdatelist.get(listSize - 1);

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {

			Query tbugCnt = new Query();
			tbugCnt.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprint));
			tbugCnt.addCriteria(Criteria.where("issueType").is("Bug"));
			tbugCnt.addCriteria(Criteria.where("prjName").in(userStrproject));

			totalBugCnt = getMongoOperation().count(tbugCnt, JiraDefectVO.class);

			Query resolvedCnt = new Query();
			resolvedCnt.addCriteria(Criteria.where("issueSprintEndDate").is(currentSprint));
			resolvedCnt.addCriteria(Criteria.where("prjName").in(userStrproject));
			resolvedCnt.addCriteria(Criteria.where("issueType").is("Bug"));
			resolvedCnt.addCriteria(Criteria.where("issueStatusCategory").is("Done"));
			resolvedBugCnt = getMongoOperation().count(resolvedCnt, JiraDefectVO.class);

			unresolvedBugCnt = (totalBugCnt - resolvedBugCnt);

			cntObj = new JiraLifeStatusVO();
			cntObj.setUnresolvedBug(unresolvedBugCnt);
			cntObj.setResolvedBug(resolvedBugCnt);
		}
		countList.add(cntObj);

		/*
		 * List<Date> sprintdatelist = getSprintDetails(authString, dashboardName,
		 * userStrproject); int listSize = sprintdatelist.size();
		 * 
		 * Date curentdate = sprintdatelist.get(listSize-1);
		 * AggregationResults<JiraDefectVO> groupResults = null; List<JiraDefectVO>
		 * qualysdata = new ArrayList();
		 * 
		 * List<JiraLifeStatusVO> trendvolist = null; AuthenticationService
		 * authenticationService = new AuthenticationService();
		 * 
		 * trendvolist = new ArrayList<JiraLifeStatusVO>();
		 * 
		 * Aggregation agg =
		 * newAggregation(match(Criteria.where("issueSprintEndDate").in(
		 * curentdate)),match(Criteria.where("prjName").is(userStrproject)),
		 * group("issueCreated").count().as("count"),
		 * project("count").and("issueCreated").previousOperation(), sort(Direction.ASC,
		 * "issueCreated"));
		 * 
		 * groupResults = getMongoOperation().aggregate(agg, JiraDefectVO.class,
		 * JiraDefectVO.class);
		 * 
		 * qualysdata = groupResults.getMappedResults(); for (int i = 0; i <
		 * qualysdata.size(); i++) { Date dateString =
		 * ((JiraDefectVO)qualysdata.get(i)).getIssueCreated(); long count =
		 * ((JiraDefectVO)qualysdata.get(i)).getCount();
		 * 
		 * 
		 * SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd"); String str =
		 * formatter.format(dateString);
		 * 
		 * JiraLifeStatusVO tctrendvo = new JiraLifeStatusVO();
		 * trendvolist.add(tctrendvo); }
		 * 
		 * return trendvolist;
		 */
		return countList;
	}

}