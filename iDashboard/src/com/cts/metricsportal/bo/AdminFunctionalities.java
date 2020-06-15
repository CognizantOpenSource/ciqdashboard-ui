package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.mongodb.core.query.Query;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.dao.AdminMongoOperations;
import com.cts.metricsportal.dao.GitMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.CommitTrendVO;
import com.cts.metricsportal.vo.DomainVO;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.ProjectVO;
import com.cts.metricsportal.vo.ReleaseVO;
import com.cts.metricsportal.vo.UserProjectVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AdminFunctionalities {

	public int saveAdminProjectAccess(String authString, List<String> selectedProjects, String userId) {
		// TODO Auto-generated method stub
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		int count = 0;
		if (adminstatus) {
			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			String listLevelIDString = "[";

			for (int i = 0; i < selectedProjects.size(); i++) {
				listLevelIDString = listLevelIDString + (selectedProjects.get(i));
				if (i != selectedProjects.size() - 1) {
					listLevelIDString = listLevelIDString + ",";
				}
			}

			listLevelIDString = listLevelIDString + "]";

			JsonParser jsonParser = null;
			try {
				jsonParser = jf.createJsonParser(listLevelIDString);
			} catch (com.fasterxml.jackson.core.JsonParseException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			List<UserProjectVO> listLevelID = null;
			TypeReference<List<UserProjectVO>> tRef = new TypeReference<List<UserProjectVO>>() {
			};

			try {
				listLevelID = mapper.readValue(jsonParser, tRef);
			} catch (com.fasterxml.jackson.core.JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (com.fasterxml.jackson.databind.JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// Whitelisting - Security fix for JSON injection

			List<LevelItemsVO> levelDetails = AdminMongoOperations.getLevelItems();

			List<UserProjectVO> testedListLevelID = new ArrayList<UserProjectVO>();

			for (UserProjectVO vo : listLevelID) {
				for (LevelItemsVO lvo : levelDetails) {
					if (vo.getLevel1().equalsIgnoreCase(lvo.getLevel1())
							&& vo.getLevel2().equalsIgnoreCase(lvo.getLevel2())) {
						testedListLevelID.add(vo);
						break;
					}
				}
			}
			
			count = AdminMongoOperations.getUpdateFLag(testedListLevelID, userId);
			return count;
		}
		else{
			return count;
		}
	
	}
	
	public List<DomainVO> getJiraProjectsForAdminAccess(String authString) {
		
		int domainID = 1;
		int projectID = 1;
		int releaseID = 1;
		int levelId = 0;

		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);
		
		List<String> domain = AdminMongoOperations.getDistinctDomain();
		
		List<String> release = new ArrayList<String>();
		List<DomainVO> finalproject = new ArrayList<DomainVO>();
		List<ProjectVO> finalrelease = new ArrayList<ProjectVO>();
		List<ReleaseVO> endjson = new ArrayList<ReleaseVO>();
		ProjectVO selectproject = null;
		if (adminstatus) {
			for (int i = 0; i < domain.size(); i++) {

				DomainVO selectdomain = new DomainVO();
				selectdomain.setLevel1ID("JD" + domainID++);
				selectdomain.setSourceTool("JIRA");
				selectdomain.setLevel1(domain.get(i));
				selectdomain.setSelected(false);
			
				List<String> project = AdminMongoOperations.getDistinctProject(i, domain);
				
				finalrelease = new ArrayList<ProjectVO>();

				for (int j = 0; j < project.size(); j++) {

					selectproject = new ProjectVO();
					selectproject.setLevel2ID("JP" + projectID++);
					selectproject.setLevel2(project.get(j));
					selectproject.setSelected(false);
				
				release = AdminMongoOperations.getDistinctRelease(i,j, domain, project);
				
				endjson = new ArrayList<ReleaseVO>();

				for (int k = 0; k < release.size(); k++) {

					ReleaseVO selectrelease = new ReleaseVO();
					selectrelease.setLevel3ID("JR" + releaseID++);
					selectrelease.setLevel3(release.get(k));
					selectrelease.setSelected(false);
					endjson.add(selectrelease);
					
				List<LevelItemsVO> levelIdList = AdminMongoOperations.getLevelIdList(i,j,k, domain, project, release);
				
				levelId = levelIdList.get(0).getLevelId();
				selectrelease.setLevelId(levelId);
			}
			selectproject.setChildren(endjson);
			finalrelease.add(selectproject);
		}
				
		selectdomain.setChildren(finalrelease);
		finalproject.add(selectdomain);
		}
		return finalproject;
		}
		else {
			return finalproject;
		}
	}
	
	
	
}