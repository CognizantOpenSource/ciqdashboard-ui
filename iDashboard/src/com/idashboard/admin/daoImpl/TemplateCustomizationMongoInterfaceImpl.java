package com.idashboard.admin.daoImpl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.AvailableMetricVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.ToolSelectionVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idashboard.admin.dao.TemplateCustomizationMongoInterface;
import com.idashboard.admin.vo.CustomTemplateVO;
import com.idashboard.admin.vo.SelectedMetricVO;

public class TemplateCustomizationMongoInterfaceImpl extends BaseMongoOperation
		implements TemplateCustomizationMongoInterface {

	static final Logger logger = Logger.getLogger(TemplateCustomizationMongoInterfaceImpl.class);

	public List<CustomTemplateVO> TemplateCustomizaiton_ExecQuery_GetTemplateDetails(String authString) {

		List<CustomTemplateVO> templateDetails = new ArrayList<CustomTemplateVO>();
		try {

			String query = "{},{_id:0}";
			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);
			boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

			if (adminstatus) {
				Query query1 = new BasicQuery(query);
				query1.addCriteria(Criteria.where("role").is("admin"));
				query1.with(new Sort(Sort.Direction.DESC, "createdDate"));

				templateDetails = getMongoOperation().find(query1, CustomTemplateVO.class);

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return templateDetails;
	}

	public int TemplateCustomizaiton_ExecQuery_GetVerticalData() {
		int verticallist = 0;
		try {

			String numberOfTemplate = null;
			if (numberOfTemplate == null) {

				numberOfTemplate = PropertyManager.getProperty("NumberOfTemplate",
						"properties/admintemplate.properties");

			}

			verticallist = Integer.parseInt(numberOfTemplate);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return verticallist;
	}

	public long TemplateCustomizaiton_ExecQuery_TemplateNameInOperational(String authString, String templateName) {

		long templateList = 0;
		try {

			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(templateName));
			templateList = getMongoOperation().count(query, OperationalDashboardVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return templateList;
	}

	public int TemplateCustomizaiton_ExecQuery_DeleteTemplateName(String authString, String templateName) {

		int count = 0;

		try {

			List<String> templateList = new ArrayList<String>();

			Query query = new Query();
			Query query1 = new Query();
			// templateList =
			// getMongoOperation().getCollection("operationalDashboards").distinct("templateName");
			// if(templateList.contains(templateName)){

			query.addCriteria(Criteria.where("templateName").is(templateName));
			getMongoOperation().remove(query, CustomTemplateVO.class);

			List<OperationalDashboardVO> operationaldb = new ArrayList<OperationalDashboardVO>();

			query1.addCriteria(Criteria.where("templateName").is(templateName));
			Update update = new Update();
			update.set("templateName", "");
			getMongoOperation().updateMulti(query1, update, OperationalDashboardVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public List<CustomTemplateVO> TemplateCustomizaiton_ExecQuery_GetCustomTemplateView(String authString,
			String selectedcustomtemplate) {

		List<CustomTemplateVO> customTemplateList = new ArrayList<CustomTemplateVO>();

		try {

			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(selectedcustomtemplate));
			try {
				customTemplateList = getMongoOperation().find(query, CustomTemplateVO.class);

			} catch (NumberFormatException | BaseException | BadLocationException e) {

				e.printStackTrace();
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return customTemplateList;
	}

	public List<AvailableMetricVO> TemplateCustomizaiton_ExecQuery_GetAvailableMetricList(String authString,
			boolean jiraMetric, boolean almMetric) {

		List<AvailableMetricVO> availableMetric = null;

		try {
			availableMetric = new ArrayList<AvailableMetricVO>();
			if (jiraMetric || almMetric) {
				Query query = new Query();
				query = new Query(new Criteria().orOperator(Criteria.where("almMetric").is(almMetric),
						Criteria.where("jiraMetric").is(jiraMetric)));

				availableMetric = getMongoOperation().find(query, AvailableMetricVO.class);
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return availableMetric;
	}

	public boolean TemplateCustomizaiton_ExecQuery_GetExistTemplateName(String authString, String selectTemplate) {

		boolean exist = false;
		try {

			Query query = new Query();

			query.addCriteria(Criteria.where("templateName").is(selectTemplate));

			List<CustomTemplateVO> userInfo = getMongoOperation().find(query, CustomTemplateVO.class);
			if (userInfo.size() > 0) {
				exist = true;
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return exist;
	}

	public List<String> TemplateCustomizaiton_ExecQuery_isToolSelectedAlready(String authString) {

		List<String> toolLabel = new ArrayList<String>();
		try {
			Query query1 = new Query();
			List<ToolSelectionVO> toolDetails = new ArrayList<ToolSelectionVO>();

			toolDetails = getMongoOperation().findAll(ToolSelectionVO.class);
			for (int i = 0; i < toolDetails.size(); i++) {
				String label = toolDetails.get(i).getLabel();
				toolLabel.add(label);
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return toolLabel;
	}

	public int TemplateCustomizaiton_ExecQuery_DeleteUnusedTemplateName(String authString, String templateName) {

		int count = 0;
		try {

			Query query = new Query();
			query.addCriteria(Criteria.where("templateName").is(templateName));
			getMongoOperation().remove(query, CustomTemplateVO.class);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int TemplateCustomizaiton_ExecQuery_SaveMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool) {

		int count = 0;
		try {

			String newtempId = "";

			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = new MappingJsonFactory();

			String listMetricString = "";
			List<SelectedMetricVO> listMetrics = null;
			TypeReference<List<SelectedMetricVO>> tRef = new TypeReference<List<SelectedMetricVO>>() {
			};
			for (int i = 0; i < selectMetrics.size(); i++) {
				listMetricString = listMetricString + (selectMetrics.get(i));
				JsonParser jsonParser = jf.createJsonParser(listMetricString);
				if (i != selectMetrics.size() - 1) {
					listMetricString = listMetricString + ",";
				}
				listMetrics = mapper.readValue(jsonParser, tRef);
			}

			listMetricString = listMetricString + "";

			// generate template ID

			Query query = new Query();
			query.limit(1);
			query.with(new Sort(Sort.Direction.DESC, "templateId"));

			List<CustomTemplateVO> fetchres = getMongoOperation().find(query, CustomTemplateVO.class);
			if (!fetchres.isEmpty()) {
				String tempId = fetchres.get(0).getTemplateId();
				tempId = tempId.substring(1);
				int tempnum = Integer.parseInt(tempId);
				tempnum += 1;

				newtempId = "T" + tempnum;

			} else {
				newtempId = "T1001";
			}

			CustomTemplateVO dashvo = new CustomTemplateVO();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
			Calendar calobj = Calendar.getInstance();
			String createdDt = df.format(calobj.getTime());
			Date createdDate = df.parse(createdDt);
			dashvo.setCreatedDate(createdDate);
			dashvo.setRole("admin");
			dashvo.setTemplateId(newtempId);
			dashvo.setTemplateName(selectedTemplate);
			dashvo.setSelectedMetrics(listMetrics);

			dashvo.setAlmtool(isAlmtool);
			dashvo.setJiratool(isJiratool);
			dashvo.setUserId(userId);
			dashvo.setRollingPeriod(rollingPeriod);

			getMongoOperation().save(dashvo, "customTemplate");

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return count;
	}

	public int TemplateCustomizaiton_ExecQuery_UpdateMetricDetails(String authString, String selectedTemplate,
			List<String> selectMetrics, String rollingPeriod, boolean isJiratool, boolean isAlmtool) {

		int count = 0;

		try {
			AuthenticationService UserEncrypt = new AuthenticationService();
			String userId = UserEncrypt.getUser(authString);

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory jf = new MappingJsonFactory();

			String listMetricString = "";
			List<SelectedMetricVO> listMetrics = null;
			TypeReference<List<SelectedMetricVO>> tRef = new TypeReference<List<SelectedMetricVO>>() {
			};
			for (int i = 0; i < selectMetrics.size(); i++) {
				listMetricString = listMetricString + (selectMetrics.get(i));
				JsonParser jsonParser = jf.createJsonParser(listMetricString);
				if (i != selectMetrics.size() - 1) {
					listMetricString = listMetricString + ",";
				}
				listMetrics = mapper.readValue(jsonParser, tRef);
			}

			listMetricString = listMetricString + "";

			// generate template ID

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));
			query.addCriteria(Criteria.where("role").is("admin"));
			query.addCriteria(Criteria.where("templateName").is(selectedTemplate));

			Update update = new Update();
			update.set("rollingPeriod", rollingPeriod);
			update.set("isJiratool", isJiratool);
			update.set("isAlmtool", isAlmtool);
			update.set("selectedMetrics", listMetrics);
			getMongoOperation().updateFirst(query, update, CustomTemplateVO.class);
			
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return count;
	}
}
