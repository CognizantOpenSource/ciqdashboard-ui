package com.cognizant.qbot.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import org.apache.log4j.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.cognizant.qbot.vo.AttrDistributionVO;
import com.cognizant.qbot.vo.AttributeVO;
import com.cognizant.qbot.vo.DistributionVO;
import com.cognizant.qbot.vo.QBot_VO;
import com.cognizant.qbot.vo.TypeSummaryVO;

@Path("/jsonServices")
public class JsonDataService {
	
	static final Logger logger = Logger.getLogger(JsonDataService.class);

	 @GET
	    @Path("/print/{keyword}")
	    @Produces(MediaType.APPLICATION_JSON)
	    public QBot_VO sayPlainTextHello( @PathParam("keyword") String keyword) {
		 
		 List<String> words = null;
		 String finalkeyword = "";
		 
		 StringBuffer sb = new StringBuffer();
		 	TypeSummaryVO typeSummaryVO = null;
		 	List<TypeSummaryVO> typeSummaryList = null;
	    	DistributionVO distributionVO = null;
	    	List<DistributionVO> distributionVOList = null;
	    	AttrDistributionVO attriDistvo= null;	
	    	List<AttrDistributionVO> attriDistVOList = null;
	    	QBot_VO qbotVO = new QBot_VO();
	    	AttributeVO attrVO = null; 
	    	List<AttributeVO> attrVOList = new ArrayList<AttributeVO>();
	    	
	    	
			FileIO file = new FileIO();
			String rawQuery = file.readFile(PropertyManager.getProperty("queryfile", Constants.CONFIGFILE));
			
			
			rawQuery+="getMultiData('"+finalkeyword+"')";
			//System.out.println(rawQuery);
		    /*StringEntity query = null;
			try {
				query = new StringEntity(rawQuery);
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}*/
			String output = "";
			String query = null;
			query=rawQuery;
			try {
				output = CayleyConnection.executeQuery(query);
			} catch (ClientProtocolException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			logger.error(output);
			JSONObject json=null;
			JSONObject tempJson=null, attJson=null, distJson=null, relJson=null;
			try {
				json = new JSONObject(output);
				json = json.getJSONArray("result").getJSONObject(0);
				tempJson = json.getJSONObject("aggregate");
				Iterator keys = tempJson.keys(); //TC, defect
				Iterator distKeys, attKeys, summaryKeys, relKeys;
				String keyString, distKeyString, attKeyString, summaryKeyString, relKeyString;
				String value;
				attrVOList = new ArrayList<AttributeVO>();
				
				qbotVO = new QBot_VO();
				summaryKeys = json.getJSONObject("summary").keys();
				while(summaryKeys.hasNext())
				{
					attrVO = new AttributeVO();
					summaryKeyString = (String) summaryKeys.next();
					attrVO.setKey(summaryKeyString);
					attrVO.setValue(json.getJSONObject("summary").get(summaryKeyString).toString());
					
					attrVOList.add(attrVO);
				}
				
				qbotVO.setAttributes(attrVOList);
				
				typeSummaryList = new ArrayList<TypeSummaryVO>();
				attrVOList = new ArrayList<AttributeVO>();
				
				
				while(keys.hasNext())
				{
					typeSummaryVO = new TypeSummaryVO();
					attriDistVOList = new ArrayList<AttrDistributionVO>();
					distributionVOList = new ArrayList<DistributionVO>();
					
					keyString = (String) keys.next();
					distJson = tempJson.getJSONObject(keyString);
					distJson = distJson.getJSONObject("distribution");
					distKeys = distJson.keys(); //created by, detected by
					while(distKeys.hasNext())
					{
						distributionVO = new DistributionVO();
						
						distKeyString = (String) distKeys.next();
						relJson = distJson.getJSONObject(distKeyString);
						relKeys = relJson.keys();
						while(relKeys.hasNext())
						{
							relKeyString = (String) relKeys.next(); //Priority, Severity
							
							attriDistvo = new AttrDistributionVO();
							attrVOList = new ArrayList<AttributeVO>();
							
							attJson = relJson.getJSONObject(relKeyString);
							attKeys = attJson.keys(); //High, Low..
							while(attKeys.hasNext())
							{
								attrVO = new AttributeVO();
								
								attKeyString = (String) attKeys.next();
								value = attJson.get(attKeyString).toString();
								
								attrVO.setKey(attKeyString);
								attrVO.setValue(value);
								
								attrVOList.add(attrVO);		
							}
							
							attriDistvo.setDistributionType(relKeyString);
							attriDistvo.setAttributeVOList(attrVOList);
							attriDistVOList.add(attriDistvo); //[{key:high,val:8},...]
						}
						distributionVO.setCategoryVOList(attriDistVOList); //distributionVOList
						distributionVO.setCategoryType(distKeyString);
						distributionVOList.add(distributionVO); //[priority:[...],severity:[...]]
					}
					typeSummaryVO.setType(keyString);
					typeSummaryVO.setDistributionVOList(distributionVOList);
					typeSummaryList.add(typeSummaryVO);
				}
				
				
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				logger.error("exception "+e);
				e.printStackTrace();
			}
			
			
			
			qbotVO.setTypeSummaryVOList(typeSummaryList);
	    	
	    	return qbotVO;
	    	
	    }
	 
	 public static QBot_VO setObjects(String output)
	 {
		 TypeSummaryVO typeSummaryVO = null;
		 	List<TypeSummaryVO> typeSummaryList = null;
	    	DistributionVO distributionVO = null;
	    	List<DistributionVO> distributionVOList = null;
	    	AttrDistributionVO attriDistvo= null;	
	    	List<AttrDistributionVO> attriDistVOList = null;
	    	QBot_VO qbotVO = new QBot_VO();
	    	AttributeVO attrVO = null; 
	    	List<AttributeVO> attrVOList = new ArrayList<AttributeVO>();
		 JSONObject json=null;
			JSONObject tempJson=null, attJson=null, distJson=null, relJson=null;
			try {
				json = new JSONObject(output);
				json = json.getJSONArray("result").getJSONObject(0);
				tempJson = json.getJSONObject("aggregate");
				Iterator keys = tempJson.keys(); //TC, defect
				Iterator distKeys, attKeys, summaryKeys, relKeys;
				String keyString, distKeyString, attKeyString, summaryKeyString, relKeyString;
				String value;
				attrVOList = new ArrayList<AttributeVO>();
				
				qbotVO = new QBot_VO();
				summaryKeys = json.getJSONObject("summary").keys();
				while(summaryKeys.hasNext())
				{
					attrVO = new AttributeVO();
					summaryKeyString = (String) summaryKeys.next();
					attrVO.setKey(summaryKeyString);
					attrVO.setValue(json.getJSONObject("summary").get(summaryKeyString).toString());
					
					attrVOList.add(attrVO);
				}
				
				qbotVO.setAttributes(attrVOList);
				
				typeSummaryList = new ArrayList<TypeSummaryVO>();
				attrVOList = new ArrayList<AttributeVO>();
				
				
				while(keys.hasNext())
				{
					typeSummaryVO = new TypeSummaryVO();
					
					distributionVOList = new ArrayList<DistributionVO>();
					
					keyString = (String) keys.next();
					distJson = tempJson.getJSONObject(keyString);
					distJson = distJson.getJSONObject("distribution");
					distKeys = distJson.keys(); //created by, detected by
					while(distKeys.hasNext())
					{
						distributionVO = new DistributionVO();
						attriDistVOList = new ArrayList<AttrDistributionVO>();
						
						distKeyString = (String) distKeys.next();
						relJson = distJson.getJSONObject(distKeyString);
						relKeys = relJson.keys();
						while(relKeys.hasNext())
						{
							relKeyString = (String) relKeys.next(); //Priority, Severity
							
							attriDistvo = new AttrDistributionVO();
							attrVOList = new ArrayList<AttributeVO>();
							
							attJson = relJson.getJSONObject(relKeyString);
							attKeys = attJson.keys(); //High, Low..
							while(attKeys.hasNext())
							{
								attrVO = new AttributeVO();
								
								attKeyString = (String) attKeys.next();
								value = attJson.get(attKeyString).toString();
								
								attrVO.setKey(attKeyString);
								attrVO.setValue(value);
								
								attrVOList.add(attrVO);		
							}
							
							attriDistvo.setDistributionType(relKeyString);
							attriDistvo.setAttributeVOList(attrVOList);
							attriDistVOList.add(attriDistvo); //[{key:high,val:8},...]
						}
						distributionVO.setCategoryVOList(attriDistVOList); //distributionVOList
						distributionVO.setCategoryType(distKeyString);
						distributionVOList.add(distributionVO); //[priority:[...],severity:[...]]
					}
					typeSummaryVO.setType(keyString);
					typeSummaryVO.setDistributionVOList(distributionVOList);
					typeSummaryList.add(typeSummaryVO);
				}
				
				
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				logger.error("exception "+e);
				e.printStackTrace();
			}
			
			
			
			qbotVO.setTypeSummaryVOList(typeSummaryList);
	    	
	    	return qbotVO;
	 }
	 
	
}
