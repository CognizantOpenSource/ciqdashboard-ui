package com.idashboard.admin.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idashboard.admin.dao.LifeCycleLayOutMongoInterface;
import com.idashboard.common.vo.ToolSelectionVO;

public class LifeCycleLayOutMongoOperationImpl extends BaseMongoOperation implements LifeCycleLayOutMongoInterface {

	static final Logger logger = Logger.getLogger(LifeCycleLayOutMongoOperationImpl.class);

	public int LifeCycleLayout_ExecuteQuery_SaveToolDetails(String authString, String toolsSelected, String template) {
		try {
			
			AuthenticationService UserEncrypt = new AuthenticationService();

			String userId = UserEncrypt.getUser(authString);

			String templatelist[] = template.split(",");

			ToolSelectionVO toolDetails = new ToolSelectionVO();

			ObjectMapper mapper = new ObjectMapper();

			JsonFactory jf = new MappingJsonFactory();

			JsonParser jsonParser = jf.createJsonParser(toolsSelected);

			List<ToolSelectionVO> toolSelection = null;
			TypeReference<List<ToolSelectionVO>> tRef = new TypeReference<List<ToolSelectionVO>>() {
			};

			toolSelection = mapper.readValue(jsonParser, tRef);

			getMongoOperation().dropCollection(ToolSelectionVO.class);

			for (int i = 0; i < toolSelection.size(); i++) {

				toolDetails.setImagePath(toolSelection.get(i).getImagePath());
				toolDetails.setKey(toolSelection.get(i).getKey());
				toolDetails.setLabel(toolSelection.get(i).getLabel());
				toolDetails.setUserId(userId);
				toolDetails.setPosition(toolSelection.get(i).getPosition());
				toolDetails.setTemplate(templatelist[i]);

				getMongoOperation().save(toolDetails, "toolSelection");

			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return 1;
	}
}
