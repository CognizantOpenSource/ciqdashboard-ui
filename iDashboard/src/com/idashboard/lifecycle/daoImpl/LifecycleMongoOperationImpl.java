package com.idashboard.lifecycle.daoImpl;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.ChefRunsVO;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.KpiDashboardVO;
import com.cts.metricsportal.vo.KpiMetricListVO;
import com.cts.metricsportal.vo.KpiSelectedMetricVO;
import com.cts.metricsportal.vo.LCDashboardComponentsVO;
import com.cts.metricsportal.vo.LCDashboardVO;
import com.cts.metricsportal.vo.ProductDashboardVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
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
import com.idashboard.lifecycle.dao.LifecycleMongoInterface;
import com.idashboard.lifecycle.vo.CodeAnalysisVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

public class LifecycleMongoOperationImpl extends BaseMongoOperation implements LifecycleMongoInterface {

	/* Create New Dashboard or Update */
	@Override
	public int signup(String userId, String dashboardName, String description, String dashboardComponent) throws Exception {
		int count = 0;
		ObjectMapper mapper = new ObjectMapper();

		// JSON from String to Object
		LCDashboardComponentsVO compVo = mapper.readValue(dashboardComponent, LCDashboardComponentsVO.class);

		LCDashboardVO dashvo = new LCDashboardVO();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
		Calendar calobj = Calendar.getInstance();
		String createdDt = df.format(calobj.getTime());
		Date createdDate = df.parse(createdDt);
		
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
		
		return count;

	}

	/* Create New Dashboard or Update */
	
	public int saveProdDash(String userId, String relName, List<String> products) throws Exception {
		int count = 0;
		
		ProductDashboardVO dashvo = new ProductDashboardVO();
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
		

	}

	
	public List<KpiMetricListVO> getKpiMetricList(String userId)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0)";
		Query query1 = new BasicQuery(query);
		
		return getMongoOperation().find(query1, KpiMetricListVO.class);
	 

	}

	/* Create New KPI Dashboard or Update */
	
	public int saveKpiDashboard(String userId, String relName,List<String> products, String fromDate,
			String toDate, boolean ispublic, List<String> selectedKpiItems) throws Exception {
		int count = 0;
		Date fromDates;
		Date toDates;
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		KpiDashboardVO dashvo = new KpiDashboardVO();

		
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
		

	}

	/* Update Dashboard or Update */
	
	public int updateproddash(String userId, String relName, String ispublic, List<String> products) throws Exception {
		int count = 0;

		Query query = new Query();
		query.addCriteria(Criteria.where("relName").is(relName));
		query.addCriteria(Criteria.where("owner").is(userId));
		getMongoOperation().remove(query, ProductDashboardVO.class);

		ProductDashboardVO dashvo = new ProductDashboardVO();
		
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
		

	}

	/* Update KPI Dashboard or Update */
	
	public int updateKpiDash(String userId, String oldRelName, String relName, List<String> products,
			 String fromDate,  boolean ispublic,  String toDate) throws Exception {
		int count = 1;

		List<String> getselectedMetric = getMetricList(userId, oldRelName);
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
		
		return count;

	}

	/* Updating Dashbaord */
	
	public int updateDashboard(String userId, String dashboardName, String id,
			String description, boolean ispublic, String dashboardComponent) throws Exception {
		int count = 0;
		ObjectMapper mapper = new ObjectMapper();

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
		

		return count;
	}

	/* Deleting User */
	
	public int deleteDashboardInfo(String userId, String id, String dashboardName) throws Exception {
		int count = 0;
		
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
		
	}

	/* Lifecycle Dashboard Table Details */

	public List<LCDashboardVO> getTableDetails(String userId,int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<LCDashboardVO> lcdDetails = new ArrayList<LCDashboardVO>();
		
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			lcdDetails = getMongoOperation().find(query1, LCDashboardVO.class);
			return lcdDetails;
		

	}

	
	public List<LCDashboardVO> getTablepublicDetails(String userId, int itemsPerPage, int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		String query = "{},{_id:0}";

		List<LCDashboardVO> lcdpublicDetails = new ArrayList<LCDashboardVO>();
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("ispublic").is(true));
			query1.with(new Sort(Sort.Direction.DESC, "createddate"));
			query1.skip(itemsPerPage * (start_index - 1));
			query1.limit(itemsPerPage);

			lcdpublicDetails = getMongoOperation().find(query1, LCDashboardVO.class);

			return lcdpublicDetails;
		

	}

	public long dashboardTableRecordsCount(String userId) throws JsonParseException, JsonMappingException,
		IOException, BadLocationException {
		Query query1 = new Query();
		
		long count = 0;
			query1.addCriteria(Criteria.where("owner").is(userId));
			count = getMongoOperation().count(query1, LCDashboardVO.class);
			return count;
		
	}

	
	public long kpiTablepulicRecordsCount(String userId)throws JsonParseException, JsonMappingException,
		IOException, BadLocationException {
		Query query1 = new Query();
		long count = 0;
		
			query1.addCriteria(Criteria.where("ispublic").is(true));
			count = getMongoOperation().count(query1, KpiDashboardVO.class);
		
		return count;
	}

	
	public long kpiTableRecordsCount(String userId)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		
		long count = 0;
			query1.addCriteria(Criteria.where("owner").is(userId));
			count = getMongoOperation().count(query1, KpiDashboardVO.class);
			return count;
		
	}

	
	public long dashboardTablepulicRecordsCount()
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		long count = 0;
	
			query1.addCriteria(Criteria.where("ispublic").is(true));
			count = getMongoOperation().count(query1, LCDashboardVO.class);
		
		return count;
	}

	
	public List<KpiDashboardVO> getKpipublicTableDetails()
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdpublicDetails = new ArrayList<KpiDashboardVO>();
			Query query1 = new BasicQuery(query);
			query1.with(new Sort(Sort.Direction.DESC, "createdDate"));
			query1.addCriteria(Criteria.where("ispublic").is(true));
			lcdpublicDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			return lcdpublicDetails;
		
	}

	
	public List<ViewProductDetailsVO> getproductTableDetails(String userId)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		String query = "{},{_id:0}";

		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));

		List<ProductDashboardVO> productdetails = getMongoOperation().find(query1, ProductDashboardVO.class);

		List<ViewProductDetailsVO> finallist = new ArrayList<ViewProductDetailsVO>();
		
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
		
	}

	
	public String getRelStartDate(String userId, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		String relStartDate = null;
		
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			Date vardtfrom = productdetails.get(0).getfromDates();
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			relStartDate = formatter.format(vardtfrom);
		

		return relStartDate;
	}

	
	public String getispublic(String userId, String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		
		boolean ispublic = false;
		String spublic = "";
		
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			ispublic = productdetails.get(0).isIspublic();
			spublic = String.valueOf(ispublic);
		
		return spublic;
	}

	
	public String getRelEndDate(String userId,String selected)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		
		String relEndDate = null;

			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));
			List<KpiDashboardVO> productdetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			Date vardtTo = productdetails.get(0).gettoDates();
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
			relEndDate = formatter.format(vardtTo);
			return relEndDate;
		
	}

	
	public List<ViewProductDetailsVO> updateproductTableDetails(String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		
		Query query1 = new BasicQuery(query);
		query1.addCriteria(Criteria.where("owner").is(userId));
		query1.addCriteria(Criteria.where("relName").is(selected));

		List<ProductDashboardVO> productdetails = getMongoOperation().find(query1, ProductDashboardVO.class);

		List<ViewProductDetailsVO> finallist = new ArrayList<ViewProductDetailsVO>();
		
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
		
	}

	
	public List<String> getUpdateProdTableDetails(String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<ProductDashboardVO> lcdDetails = new ArrayList<ProductDashboardVO>();
		
		List<String> val = null;
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, ProductDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;
		
	}

	
	public List<String> getUpdateKpiTableDetails( String userId, String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		List<String> val = null;
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			val = lcdDetails.get(0).getProducts();

			return val;	
	}
	
	public List<String> getMetricList(String userId,String selected) throws JsonParseException, JsonMappingException, IOException,
			NumberFormatException, BaseException, BadLocationException {
		String query = "{},{_id:0}";
		List<KpiDashboardVO> lcdDetails = new ArrayList<KpiDashboardVO>();
		
		List<KpiSelectedMetricVO> val = null;
		List<String> selMetricList = new ArrayList<String>();
		
			Query query1 = new BasicQuery(query);
			query1.addCriteria(Criteria.where("owner").is(userId));
			query1.addCriteria(Criteria.where("relName").is(selected));

			lcdDetails = getMongoOperation().find(query1, KpiDashboardVO.class);
			val = lcdDetails.get(0).getSelectedMetric();
			for (int i = 0; i < val.size(); i++) {
				String metName = val.get(i).getMetricName();
				selMetricList.add(metName);
			}

		
		return selMetricList;
	}


}
