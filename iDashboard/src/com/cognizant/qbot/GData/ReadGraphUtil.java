package com.cognizant.qbot.GData;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;
import org.apache.log4j.Logger;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;

import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.service.DictionaryVOList;
import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ReadGraphUtil {
	
	private static String GRAPHDBURL = PropertyManager.getProperty("dbservice", Constants.CONFIGFILE) +
			PropertyManager.getProperty("dbselect", Constants.CONFIGFILE);
	
	static final Logger logger = Logger.getLogger(ReadGraphUtil.class);

	
	public static List<DictionaryVO> mapDictionaryValues(StringEntity query) {
				
		DictionaryVOList dictVOList = new DictionaryVOList();
		
		try {
		String strresp = getStringRespose(query);
		ObjectMapper mapper = new ObjectMapper();
			
			dictVOList = mapper.readValue(strresp, DictionaryVOList.class);
			
		}catch (JsonParseException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}
		catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}
		catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		} 
		
		
		return dictVOList.getResult();

	}
	
	private  static String getStringRespose(StringEntity query) throws ClientProtocolException, IOException {
		
		HttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(
				GRAPHDBURL);
		httpPost.addHeader("content-type", "text/javascript");
		
		
		httpPost.setEntity(query);
		HttpResponse httpResponse = null;
		
		httpResponse = httpClient.execute(httpPost);
		
		StringBuffer sBuffer = processResponse(httpResponse);
		
		String strResponse = sBuffer.toString();

	
		return strResponse;
	}
	
	private static StringBuffer processResponse(HttpResponse response)
			throws IllegalStateException, IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(
				(response.getEntity().getContent())));

		StringBuffer result = new StringBuffer();
		String output;
		while ((output = br.readLine()) != null) {
			result.append(output);
		}

		return result;

	}
	
}

