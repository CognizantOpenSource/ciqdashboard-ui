package com.cognizant.qbot.clientservice;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;

import com.cognizant.qbot.service.DictionaryVO;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonReader {

	public static void main(String[] args) {
		JsonReader obj = new JsonReader();
		obj.run();
	}
	
	static final Logger logger = Logger.getLogger(JsonReader.class);

	private void run() {
		ObjectMapper mapper = new ObjectMapper();

		try {
			
			// Convert JSON string to Object
			String jsonInString = "{\"value\":\"1000\",\"object\":\"7500\"}";
			DictionaryVO dictVO = mapper.readValue(jsonInString, DictionaryVO.class);
			logger.error(dictVO);

			//Pretty print
			

		} catch (JsonGenerationException e) {
			//e.printStackTrace();
			logger.error(e.getMessage());
		} catch (JsonMappingException e) {
			//e.printStackTrace();
			logger.error(e.getMessage());
		} catch (IOException e) {
			//e.printStackTrace();
			logger.error(e.getMessage());
		}
	}

}