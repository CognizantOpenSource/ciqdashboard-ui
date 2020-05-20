package com.cognizant.qbot.clientservice;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import org.apache.log4j.Logger;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONException;
import org.json.JSONObject;

import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.service.DictionaryVOList;
import com.cognizant.qbot.service.Student;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.json.JSONConfiguration;

public class JerseyClient {
	
	static final Logger logger = Logger.getLogger(JerseyClient.class);

	public static void main(String[] args) throws ClientProtocolException, IOException, JSONException {

		
		HttpClient httpClient = HttpClients.createDefault();		
		HttpPost httpPost = new HttpPost("http://10.219.161.139:64210/api/v1/query/gremlin");				
		httpPost.addHeader("content-type", "text/javascript");
		StringEntity query = new StringEntity("g.V().As(\"text\").Out(\"of type\").All();g.V().As(\"text\").Out(\"is a\").All();");
		httpPost.setEntity(query);
		HttpResponse httpResponse = httpClient.execute(httpPost);
		StringBuffer sBuffer = processResponse(httpResponse);
		String strResponse = sBuffer.toString();
		ObjectMapper mapper = new ObjectMapper();
		DictionaryVOList dictVOList = mapper.readValue(strResponse, DictionaryVOList.class);		
		logger.error("GET Response Status:: "
				+ httpResponse.getStatusLine().getStatusCode());		
		String output="";
	
	}

	private static StringBuffer processResponse(HttpResponse response) throws IllegalStateException, IOException{
		BufferedReader br = new BufferedReader(
                new InputStreamReader((response.getEntity().getContent())));

		StringBuffer result = new StringBuffer();
		String output;		
		while ((output = br.readLine()) != null) {
			result.append(output);
		}
				
		return result;

	}

	
	
}
