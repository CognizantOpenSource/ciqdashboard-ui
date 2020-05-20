package com.cts.metricsportal.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.swing.text.BadLocationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.DatatypeConverter;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.OperationalDashboardsCyclesVO;
import com.cts.metricsportal.vo.OperationalDashboardsEpicsVO;
import com.cts.metricsportal.vo.OperationalDashboardsProjectsVO;
import com.cts.metricsportal.vo.OperationalDashboardsSprintsVO;
import com.cts.metricsportal.vo.OperationalDashboardsTestRunsVO;
import com.cts.metricsportal.vo.OperationalDashboardsVersionsVO;
import com.cts.metricsportal.vo.UserVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;




@Path("/levelItemServices")
public class LevelItemServices extends BaseMongoOperation{
	
	@GET
    @Path("/getLevel1")
    @Produces(MediaType.APPLICATION_JSON)
 
    public  List<LevelItemsVO> getLevel1() throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
		 
		 String query = "{},{_id:0,level1:1,level2:0,level3:0}";
	     Query query1 = new BasicQuery(query);	
		 List<LevelItemsVO> levelList =  getMongoOperation().find(query1, LevelItemsVO.class);	 		 		
		 return levelList;	 	
	}
	
	@GET
    @Path("/getLevel2")
    @Produces(MediaType.APPLICATION_JSON)
 
    public  List<LevelItemsVO> getLevel2(@QueryParam("level1") String level1) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
		 
		 String query = "{},{_id:0}";
		 		
	     Query query1 = new BasicQuery(query);
	 	 query1.addCriteria(Criteria.where("level1").is(level1));		
		 List<LevelItemsVO> levelList =  getMongoOperation().find(query1, LevelItemsVO.class);	 		 		
		 return levelList;	 	
	}
	
	@GET
    @Path("/getLevel3")
    @Produces(MediaType.APPLICATION_JSON)
 
    public  List<LevelItemsVO> getLevel2(@QueryParam("level1") String level1, @QueryParam("level2") String level2) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
		 
		 String query = "{},{_id:0}";
		 		
	     Query query1 = new BasicQuery(query);	 	 
	 	 query1.addCriteria(Criteria.where("level1").is(level1).andOperator(
                Criteria.where("level2").is(level2)));
		 List<LevelItemsVO> levelList =  getMongoOperation().find(query1, LevelItemsVO.class);	 		 		
		 return levelList;	 	
	}
	
	

	/* Updating Dashbaord */
	@POST
	@Path("/updateSelectedProjects")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int setSelectedProjects(@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName,
			@QueryParam("projects") List<String> projects) throws Exception {
		
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);

		int count = 0;

		ObjectMapper mapper = new ObjectMapper();

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		// listLevelIDString = listLevelIDString + selectedproject;

		if(projects.get(0).toString().equalsIgnoreCase("-"))
		{
			
		}else
		{		
			for (int i = 0; i < projects.size(); i++) {
				listLevelIDString = listLevelIDString + "{\"" + "prjName\"" + ":\"" + (projects.get(i)) + "\"}";
				if (i != projects.size() - 1) {
					listLevelIDString = listLevelIDString + ",";
				}
			}
		}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationalDashboardsProjectsVO> listLevelID = null;
		TypeReference<List<OperationalDashboardsProjectsVO>> tRef = new TypeReference<List<OperationalDashboardsProjectsVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		dashvo1.setDashboardName(dashboardName);
		dashvo1.setOwner(userId);
		dashvo1.setProjects(listLevelID);

		Query query = new Query();

		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query.addCriteria(Criteria.where("owner").is(userId));

		Update update = new Update();
		update.set("dashboardName", dashboardName);
		update.set("owner", userId);
		update.set("projects", listLevelID);

		List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

		for (OperationalDashboardVO vo : dashvoInfo) {
			if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
				count = count + 1;

			}
		}
		if (count == 1) {
			getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
		}

		return count;
	}
	
	@POST
	@Path("/updateSelectedSprints")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int setSelectedSprints(@HeaderParam("Authorization") String authString, @QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("sprints") List<String> sprints) throws Exception {

		int count = 0;

		ObjectMapper mapper = new ObjectMapper();

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		if(sprints.get(0).toString().equalsIgnoreCase("-"))
		{
			
		}else
		{

		for (int i = 0; i < sprints.size(); i++) {
			listLevelIDString = listLevelIDString + "{\"" + "sprintName\"" + ":\"" + (sprints.get(i)) + "\"}";
			if (i != sprints.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationalDashboardsSprintsVO> listLevelID = null;
		TypeReference<List<OperationalDashboardsSprintsVO>> tRef = new TypeReference<List<OperationalDashboardsSprintsVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		dashvo1.setDashboardName(dashboardName);
		dashvo1.setOwner(owner);
		dashvo1.setSprints(listLevelID);

		Query query = new Query();

		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query.addCriteria(Criteria.where("owner").is(owner));

		Update update = new Update();
		update.set("dashboardName", dashboardName);
		update.set("owner", owner);
		update.set("sprints", listLevelID);

		List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

		for (OperationalDashboardVO vo : dashvoInfo) {
			if (vo.getOwner().equalsIgnoreCase(owner) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
				count = count + 1;

			}
		}
		if (count == 1) {
			getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
		}

		return count;
	}
	
	@POST
	@Path("/updateSelectedEpics")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int setSelectedEpics(@HeaderParam("Authorization") String authString, @QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("epics") List<String> epics) throws Exception {

		int count = 0;

		ObjectMapper mapper = new ObjectMapper();

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		if(epics.get(0).toString().equalsIgnoreCase("-"))
		{
			
		}else
		{

		for (int i = 0; i < epics.size(); i++) {
			listLevelIDString = listLevelIDString + "{\"" + "epicName\"" + ":\"" + (epics.get(i)) + "\"}";
			if (i != epics.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationalDashboardsEpicsVO> listLevelID = null;
		TypeReference<List<OperationalDashboardsEpicsVO>> tRef = new TypeReference<List<OperationalDashboardsEpicsVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		dashvo1.setDashboardName(dashboardName);
		dashvo1.setOwner(owner);
		dashvo1.setEpics(listLevelID);

		Query query = new Query();

		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query.addCriteria(Criteria.where("owner").is(owner));

		Update update = new Update();
		update.set("dashboardName", dashboardName);
		update.set("owner", owner);
		update.set("epics", listLevelID);

		List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

		for (OperationalDashboardVO vo : dashvoInfo) {
			if (vo.getOwner().equalsIgnoreCase(owner) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
				count = count + 1;

			}
		}
		if (count == 1) {
			getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
		}

		return count;
	}
	
	@POST
	@Path("/updateSelectedVersions")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int setSelectedVersions(@HeaderParam("Authorization") String authString, @QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("versions") List<String> versions) throws Exception {

		int count = 0;

		ObjectMapper mapper = new ObjectMapper();

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		if(versions.get(0).toString().equalsIgnoreCase("-"))
		{
			
		}else
		{

		for (int i = 0; i < versions.size(); i++) {
			listLevelIDString = listLevelIDString + "{\"" + "versionName\"" + ":\"" + (versions.get(i)) + "\"}";
			if (i != versions.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationalDashboardsVersionsVO> listLevelID = null;
		TypeReference<List<OperationalDashboardsVersionsVO>> tRef = new TypeReference<List<OperationalDashboardsVersionsVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		dashvo1.setDashboardName(dashboardName);
		dashvo1.setOwner(owner);
		dashvo1.setVersions(listLevelID);

		Query query = new Query();

		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query.addCriteria(Criteria.where("owner").is(owner));

		Update update = new Update();
		update.set("dashboardName", dashboardName);
		update.set("owner", owner);
		update.set("versions", listLevelID);

		List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

		for (OperationalDashboardVO vo : dashvoInfo) {
			if (vo.getOwner().equalsIgnoreCase(owner) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
				count = count + 1;

			}
		}
		if (count == 1) {
			getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
		}

		return count;
	}

	@POST
	@Path("/updateSelectedCycles")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int setSelectedCycles(@HeaderParam("Authorization") String authString, @QueryParam("dashboardName") String dashboardName, @QueryParam("owner") String owner,
			@QueryParam("cycles") List<String> cycles) throws Exception {

		int count = 0;

		ObjectMapper mapper = new ObjectMapper();

		JsonFactory jf = new MappingJsonFactory();

		String listLevelIDString = "[";

		if(cycles.get(0).toString().equalsIgnoreCase("-"))
		{
			
		}else
		{

		for (int i = 0; i < cycles.size(); i++) {
			listLevelIDString = listLevelIDString + "{\"" + "cycleName\"" + ":\"" + (cycles.get(i)) + "\"}";
			if (i != cycles.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}}

		listLevelIDString = listLevelIDString + "]";

		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);

		List<OperationalDashboardsCyclesVO> listLevelID = null;
		TypeReference<List<OperationalDashboardsCyclesVO>> tRef = new TypeReference<List<OperationalDashboardsCyclesVO>>() {
		};

		listLevelID = mapper.readValue(jsonParser, tRef);

		OperationalDashboardVO dashvo1 = new OperationalDashboardVO();

		dashvo1.setDashboardName(dashboardName);
		dashvo1.setOwner(owner);
		dashvo1.setCycles(listLevelID);

		Query query = new Query();

		query.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query.addCriteria(Criteria.where("owner").is(owner));

		Update update = new Update();
		update.set("dashboardName", dashboardName);
		update.set("owner", owner);
		update.set("cycles", listLevelID);

		List<OperationalDashboardVO> dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);

		for (OperationalDashboardVO vo : dashvoInfo) {
			if (vo.getOwner().equalsIgnoreCase(owner) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
				count = count + 1;

			}
		}
		if (count == 1) {
			getMongoOperation().updateFirst(query, update, OperationalDashboardVO.class);
		}

		return count;
	}

	
	}
	
     
     
 



