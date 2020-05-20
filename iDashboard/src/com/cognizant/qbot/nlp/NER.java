package com.cognizant.qbot.nlp;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cognizant.qbot.service.CayleyConnection;
import com.cognizant.qbot.service.DictionaryVOList;
import com.cognizant.qbot.service.FileIO;
import com.cognizant.qbot.service.NERListVO;
import com.cognizant.qbot.service.NERVO;
import com.cognizant.qbot.service.NER_VO;
import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class NER
{	static final Logger logger = Logger.getLogger(NER.class);

	public List<NER_VO> findName(String input)
	{
		ObjectMapper mapper = new ObjectMapper();
		String output = readData(input);
		JSONObject obj = null;
		JSONArray array = null;
		try {
			obj = new JSONObject(output);
			array = obj.getJSONArray("result").getJSONArray(0);
			obj = new JSONObject();
			obj.append("result", array);
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		List<NERVO> typeList = null;
		NERListVO nerlist = null;
		try {
			//typeList = mapper.readValue(array.toString(), new TypeReference<List<NERVO>>() {});
			nerlist = mapper.readValue(obj.toString(), NERListVO.class);
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		typeList = nerlist.getResult().get(0);
		NER_VO nerVO = null;
		List<NER_VO> nerVOList = new ArrayList<NER_VO>();
		List<String> list = null;

		for(NERVO ner : typeList)
		{
			list = ner.getType();
			for(String type: list)
			{
				nerVO = new NER_VO();
				nerVO.setValue(ner.getKey());						
				nerVO.setType(type);
				nerVOList.add(nerVO);
				logger.error(ner.getKey()+"\t\t"+type);
			}
		}
		
		return nerVOList;
	}
	
	private String readData(String input)
	{
		FileIO file = new FileIO();
		String rawQuery = file.readFile(PropertyManager.getProperty("nerqueryfile", Constants.CONFIGFILE));
		rawQuery+="NER(\""+input+"\");";
		
		String output = null;
		try {
			output = CayleyConnection.executeQuery(rawQuery);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return output;
	}
}
