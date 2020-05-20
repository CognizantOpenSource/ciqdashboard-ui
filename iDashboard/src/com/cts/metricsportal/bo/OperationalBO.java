package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.swing.text.BadLocationException;

import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.OperationDashboardDetailsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

public class OperationalBO{
	
	public int saveDashboard(String userId, String dashboardName, String description, String templateName, boolean ispublic, List<String> releases)
			throws JsonParseException, IOException, NumberFormatException, BaseException, BadLocationException, ParseException {
		ObjectMapper mapper = new ObjectMapper();
		JsonFactory jf = new MappingJsonFactory();
		String listLevelIDString = "[";
		for (int i = 0; i < releases.size(); i++) {
			listLevelIDString = listLevelIDString + (releases.get(i));
			if (i != releases.size() - 1) {
				listLevelIDString = listLevelIDString + ",";
			}
		}
		
		Calendar cal = Calendar.getInstance();
		Date createddate = cal.getTime();
		
		
		
		
		listLevelIDString = listLevelIDString + "]";
		JsonParser jsonParser = jf.createJsonParser(listLevelIDString);
		List<OperationDashboardDetailsVO> listLevelID = null;
		TypeReference<List<OperationDashboardDetailsVO>> tRef = new TypeReference<List<OperationDashboardDetailsVO>>() {};
		listLevelID = mapper.readValue(jsonParser, tRef);
		OperationalDashboardVO dashvo = new OperationalDashboardVO();
		dashvo.setDashboardName(dashboardName);
		dashvo.setDescription(description);
		dashvo.setOwner(userId);
		dashvo.setTemplateName(templateName);
		dashvo.setIspublic(ispublic);
		dashvo.setReleaseSet(listLevelID);
		dashvo.setCreateddate(createddate);
		dashvo.setModifieddate(createddate);
		Update update = new Update();
		update.inc("seq", 1);
		update.set("ispublic", ispublic);
		OperationalDAO operationalDAO = new OperationalDAO();
		return operationalDAO.saveDashboard(userId,dashboardName, description, dashvo);
		
		
	}

}
