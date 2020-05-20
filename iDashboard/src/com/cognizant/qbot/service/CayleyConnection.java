package com.cognizant.qbot.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import org.apache.log4j.Logger;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;

public class CayleyConnection 
{	static final Logger logger = Logger.getLogger(CayleyConnection.class);

	public static String executeQuery(String query) throws ClientProtocolException, IOException
	{
		/*HttpClient httpClient = HttpClients.createDefault();
		HttpPost req = new HttpPost(PropertyManager.getProperty("dbservice", Constants.CONFIGFILE) +
				PropertyManager.getProperty("dbselect", Constants.CONFIGFILE));
		req.addHeader("content-type", "text/javascript");
		req.setEntity(query);*/
		
		
		String Sdbservice="";
		String Sdbselect="";
		String url="";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPost req= new HttpPost();
		Sdbservice = PropertyManager.getProperty("dbservice", Constants.CONFIGFILE);
		Sdbselect = PropertyManager.getProperty("dbselect", Constants.CONFIGFILE);
		url=Sdbservice + Sdbselect;
		
		if(url.indexOf(':') != -1) {
			req = new HttpPost(url);
			req.addHeader("content-type", "text/javascript");
			HttpEntity params =new StringEntity(query,"UTF-8");
			req.setEntity(params);
			//req.setEntity(query);
		}

		
		
		HttpResponse resp = httpClient.execute(req);
		
		String output="";
		logger.error(resp.getStatusLine().getStatusCode());
		if(resp.getStatusLine().getStatusCode()==200)
		{
			BufferedReader br = new BufferedReader(null);
			try {
				br = new BufferedReader(new InputStreamReader((resp.getEntity().getContent())));
			} catch (IllegalStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String temp="";
			logger.error("Output from Server .... \n");
			try {
				while ((temp = br.readLine()) != null) {
					output+=temp;
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return output;
	}
	
}