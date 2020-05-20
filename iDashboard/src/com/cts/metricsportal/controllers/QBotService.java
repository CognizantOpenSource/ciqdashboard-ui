package com.cts.metricsportal.controllers;


import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.apache.log4j.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.DatatypeConverter;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.util.Version;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cognizant.qbot.GData.ReadMetaData;
import com.cognizant.qbot.GData.ReadNEROutput;
import com.cognizant.qbot.graph.vo.AttributeVO;
import com.cognizant.qbot.graph.vo.KeySearchNodeVO;
import com.cognizant.qbot.graph.vo.ObjVO;
import com.cognizant.qbot.nlp.DependencyParser;
import com.cognizant.qbot.nlp.NER;
import com.cognizant.qbot.service.CayleyConnection;
import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.service.FileIO;
import com.cognizant.qbot.service.GenKeySearchnodeVO;
import com.cognizant.qbot.service.NER_VO;
import com.cognizant.qbot.spellchecker.SpellCheckBuilder;
import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.cognizant.qbot.utils.DeepCloner;
import com.cognizant.qbot.vo.DependencyVO;
import com.cognizant.qbot.vo.GenAggregationVO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
//import com.cognizant.qbot.util.SpellCheck;
//import org.apache.el.parser.ParseException;

@Path("/qbotServices")
public class QBotService {	
	static List<ObjVO> objList = null;
	static ReadNEROutput readNEROutput = null;
	static final Logger logger = Logger.getLogger(QBotService.class);


    static final File LUCENE_INDEX_DIR = new File("lucene");
    static final StandardAnalyzer ANALYZER = new StandardAnalyzer(Version.LUCENE_30);
    private final int SUGGESTIONS_LIMIT = 5;
    private int offset=0;
    private static final int LIMIT = 750;
    
    private static SpellCheckBuilder spellCheckBuilder = null;
    private String timeKeeper;
    //NERProcessor ner = new NERProcessor();
    private NER ner = new NER();
    int objLength;
    
	static  {		
		
		ReadMetaData readMetaData = new ReadMetaData();
		objList = readMetaData.readData();
		Collections.sort(objList);
		readNEROutput = new ReadNEROutput();
		spellCheckBuilder = new SpellCheckBuilder();
		
		spellCheckBuilder.trainSpellChecker();
		
		
		/*try {
			t = new Trainer();
			t.train("nlp\\qbot\\qbot.train",null);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/

	}
	
	@GET
	@Path("/checkQbotHome")
	public String checkQbotHome(@HeaderParam("Authorization") String authString) {
		
		String status = null;
		
		// check service
		
		return status;
	}


	@GET
	@Path("/spellcheck/{text}")
	public String spellChecker(@PathParam("text") String text) {
		
		String[] splitip = text.split(" ");
		text = "";
		for(String str:splitip)
		{
			text+=spellCheckBuilder.printSuggestions(str)+" ";
		}
		//System.out.println("splchck out....."+text);
		text=text.substring(0, text.length()-1);
		return text;
	}
	
	@GET
	@Path("/predict/{input}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response predict(@PathParam("input") String input)
	{ 
		//input = new String(DatatypeConverter.parseBase64Binary(input));
		Locale.setDefault(new Locale("en", "US", "WIN")); 
		List<DictionaryVO> dictVOItems= SpellCheckBuilder.dictVOItems;
		String text = "";
		String rawInput = input;
		//TypeAheadPredictionVO suggestions1 = new TypeAheadPredictionVO();
		//List<PredictedValuesVO> predictedValues = new ArrayList<PredictedValuesVO>();
		//PredictedValuesVO value;
		Set<String> suggestions=new HashSet<String>();
		int i=0;
		do
		{
			input = input.trim();
			i=0;
			while((i<dictVOItems.size())&&(suggestions.size()<=SUGGESTIONS_LIMIT))
			{
				text = dictVOItems.get(i).getId();
				if(input.length()<=text.length())
					if((text.toLowerCase().startsWith(input.toLowerCase()))&&(input.equalsIgnoreCase(text.substring(0,input.length()))))
					{
						//value = new PredictedValuesVO();
						//value.setKey(text);
						//predictedValues.add(value);
						suggestions.add(rawInput + text.substring(input.length(), text.length()));
					}
				i++;
			}
			if(input.indexOf(" ")>=0)
				input = input.substring(input.indexOf(" "),input.length());
		}while(input.indexOf(" ")>=0);
		
		//suggestions1.setPredictedValues(predictedValues);
//		return suggestions;
		
		return Response.status(Response.Status.OK)// Response.Status.OK: 200
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .entity(suggestions).build(); 
	}
	
	
	@GET
	@Path("/ner/{text}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response nerClassifier(@PathParam("text") String text) {
		   System.out.println("Encoded Value"+text);
			//text = URLDecoder.decode(text, "UTF-8");
			//text = new String(text, "UTF-8"); 
			//text= new String(text.getBytes("ISO-8859-1"));
	          text = new String(DatatypeConverter.parseBase64Binary(text));

			//text=	java.net.URLDecoder.decode(text, "UTF-8");
	          logger.error("Decoded Value"+text);
		
		List<NER_VO> nerVOList = null;
		//System.out.println("Ner val : "+nerVOList.get(0).getType());
	timeKeeper = "Start time : "+new Date().toString();
	/*try {
			text = SpellCheck.correctSpelling(Arrays.asList(text.split(" ")));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}*/
	
		String givenText, correctedText;
		
		//for fine tuning dependency parser
		text = text.replaceAll("atleast", "minimum");
		text = text.replaceAll("atmost", "maximum");
		text = text.replaceAll("maximum of", "maximum");
		text = text.replaceAll("minimum of", "minimum");
		text=  text.replaceAll("( )+", " ");
		
		givenText = text;
		logger.error("givenText"+givenText);
		text = new QBotService().spellChecker(text);
		logger.error("spellChecker"+text);
		correctedText = text;
		
        Boolean tstflag = null;
		Boolean aggflag = null;
		/*DependencyParser depparser=new DependencyParser();
		DependencyVO aggregation=depparser.parse(text);

	GenAggregationVO gen_aggregation=new GenAggregationVO();

		text = aggregation.getGivenSentence();
		
		GenAggregationVO gen_aggregation1=new GenAggregationVO();

		if(aggregation.getMainAggregation().size()!=0 && aggregation.getSubAggregation().size()!=0)
		{
			aggflag=true;
			gen_aggregation1.setTarget(aggregation.getTarget());
			if(aggregation.getMainAggregation().size()!=0)
			{
				gen_aggregation1.setMainAggregation(aggregation.getMainAggregation().get(0));
			}
		
			gen_aggregation1.setSubAggregation(aggregation.getSubAggregation());
		}
		else
		{
			aggflag=false;
		}*/
		nerVOList = ner.findName(text);
		List<ObjVO> multipleKeyNode=null;
		List<ObjVO> tempmultipleKeyNode=new ArrayList<ObjVO>();
		List<String> dymlist=new ArrayList<String>();
		List<String> add_val=new ArrayList<String>();
		Set<String> newList = new HashSet<String>();
		List<String> templist=new ArrayList<String>();
		List<List<String>> m_list=new ArrayList<List<String>>() ;

	
		//text = spellCheckBuilder.printSuggestions(text);
		//nerVOList = readNEROutput.chunk(dictionaryChunkerFF, text);
		List<ObjVO> jObjList = (List<ObjVO>) DeepCloner.deepClone(objList);	
		List<ObjVO> iObjList = readNEROutput.getobjects(nerVOList, jObjList);
		List<ObjVO> iObjList_final = new ArrayList<ObjVO>();
		GenKeySearchnodeVO genkeysearchnode=new GenKeySearchnodeVO();
		for(NER_VO ner: nerVOList)
		{
			if(ner.getType().equalsIgnoreCase("Attribute"))
			{
				if(iObjList.size()!=0)
				{
					for(ObjVO obj1:iObjList)
					{
						obj1.getAttrVOList().addAll(obj1.getGrpableAttrVOList());
						 int attrFilterPrescenseIndex =genkeysearchnode.getAttrFilterIndex(obj1.getAttrVOList(), ner.getValue());
						if(attrFilterPrescenseIndex ==-1)
						{
							iObjList_final.add(obj1);
						}
					}
					for(ObjVO ee:iObjList_final)
					{
						iObjList.remove(ee);
					}
					
				}
			}
		}
	
		
	timeKeeper += "\nTime after performing NER and spellchecker : "+new Date().toString();
		//Collections.sort(iObjList);
		jObjList = null;
		jObjList = (List<ObjVO>) DeepCloner.deepClone(objList);
		String json = "";
		
		List<KeySearchNodeVO> keySearchNodeVO = null;
		if(iObjList.size()!=0){
			
 multipleKeyNode=genkeysearchnode.getkeynode(iObjList);
	
		
			for(NER_VO ner:nerVOList)
			{
				for(ObjVO key:multipleKeyNode)
				{
					if(!ner.getValue().equalsIgnoreCase(key.getPrimKey()))
					{
						tstflag=false;
						if(!ner.getType().equalsIgnoreCase("relation"))
						{
							newList.add(ner.getValue());
						}
						
					}
					else
					{
						tstflag=true;
					}
				}
			}
		if(tstflag== false)
		{
			
			ObjVO obj=new ObjVO();
			obj.setPrimKey(multipleKeyNode.get(0).getPrimKey());
			obj.setInobjRelList(multipleKeyNode.get(0).getInobjRelList());
			obj.setOutobjRelList(multipleKeyNode.get(0).getOutobjRelList());
			for(ObjVO keynode:multipleKeyNode)
			{
				
				ObjVO tempobj=new ObjVO();
				if(!keynode.getPrimKey().equalsIgnoreCase(multipleKeyNode.get(0).getPrimKey()))
				{
				tempobj.setPrimKey(keynode.getPrimKey());
				tempobj.setAttrVOList(keynode.getAttrVOList());
				tempobj.setGrpableAttrVOList(keynode.getGrpableAttrVOList());
				tempobj.setInobjRelList(keynode.getInobjRelList());
				tempobj.setOutobjRelList(keynode.getOutobjRelList());
				tempmultipleKeyNode.add(tempobj);
				
				}
			}
			multipleKeyNode.clear();
			multipleKeyNode.add(obj);
			
		}
		/*if(aggflag ==true)
		{
			keySearchNodeVO = genkeysearchnode.generateKeySearchNodewithagg(iObjList,jObjList,multipleKeyNode,gen_aggregation1);
		}*/
			
		/*else
		{*/
			
			keySearchNodeVO = genkeysearchnode.generateKeySearchNode(iObjList,jObjList,multipleKeyNode);
			
		//}
	
 			try {
 				ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
				json = ow.writeValueAsString(keySearchNodeVO);
				
			} 
 			catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
 			
		}
	timeKeeper += "\nTime after generating input json : "+new Date().toString();
		String objects = "{\"result\":null}", output = "{\"result\":null}";
		if(json.trim().length()>0)
		{
			FileIO file = new FileIO();
			try{
			    PrintWriter writer = new PrintWriter("D:/Myjsonfile.json", "UTF-8");
			    writer.println(json);
			    writer.close();
			} catch (IOException e) {
			   // do something
				logger.error(e);
			}		
			String rawFile = file.readFile(PropertyManager.getProperty("getobjects", Constants.CONFIGFILE));
			
			rawFile = rawFile + "getObjects("+json+");";
			
			try {
				
				objects = CayleyConnection.executeQuery(rawFile);
				//System.out.println("out...///"+output);
			} catch (ClientProtocolException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
			} catch (UnsupportedEncodingException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
			} catch (IOException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
			}
			JSONArray mainJSON = new JSONArray();
			JSONArray tempJSON = new JSONArray();
			JSONArray op = new JSONArray();
			
			try {
				
				objects = new JSONObject(objects).getJSONArray("result").getJSONObject(0).toString();
				
			} catch (JSONException e2) {
				// TODO Auto-generated catch block
				e2.printStackTrace();
			}
			rawFile = file.readFile(PropertyManager.getProperty("d3queryfile", Constants.CONFIGFILE));
			String query = "";
			int obtainedObjects = 0;
			
			
			try {
				do
				{	
					query = rawFile + "getData("+json+","+objects+","+offset+","+LIMIT+");";
					
					offset= offset+LIMIT;
					//tempJSON = new JSONObject();
				JSONArray loopJSONArray= new JSONArray(); 
					output = CayleyConnection.executeQuery(query);
					
						if(output!=null && output!="")
						{
							try {
								tempJSON=new JSONObject(output).getJSONArray("result").getJSONObject(0).getJSONArray("output");
								//tempJSON=new JSONObject(output).getJSONArray("result");
								obtainedObjects = new JSONObject(output).getJSONArray("result").getJSONObject(0).getInt("len");
								
							} catch (JSONException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							for(int i=0;i<tempJSON.length();i++)
							{
							//loop st
							/*try {
							tempJSON = loopJSONArray.getJSONObject(i);
							if(op.length()==0)
								mainJSON = new JSONObject();
							else
								for(int j=0;j<op.length();j++)
								{
									Iterator it = tempJSON.keys();
									List<String> keysList = new ArrayList<String>();
									while(it.hasNext()) {
									    keysList.add((String) it.next());
									}
									for(String key : keysList)
									{
										if(op.getJSONObject(j).has(key))
											mainJSON = op.getJSONObject(j);
									}
								}
							
							} catch (JSONException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}*/
						
						//System.out.println("tmp***"+tempJSON);
					
					
					try {
						if(!(mainJSON.length() > i))
							mainJSON.put(new JSONObject());
						append(tempJSON.getJSONObject(i),mainJSON.getJSONObject(i));
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					try {
						if(!mainJSON.getJSONObject(i).has("summary"))
							mainJSON.getJSONObject(i).put("summary", new JSONObject());
						append(tempJSON.getJSONObject(i).getJSONObject("summary"),mainJSON.getJSONObject(i).getJSONObject("summary"));
					} catch (JSONException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					/*JSONObject jsonObj = null;
					System.out.println(output);
					try {
						jsonObj = new JSONObject(output);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					System.out.println(jsonObj);
					try {
						obtainedObjects = (int) jsonObj.get("len");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					*/
					//loop end
					//op.put(mainJSON);
							}
				}	
			}while(obtainedObjects == LIMIT);
				output = mainJSON.toString();
				if(output.length()>0)
				{
				//output = output.substring(0, output.length()-1);
				
				output = "{\"result\":" + output;
				output += ",\"Given_String\":\""+givenText+"\"";
				//output += ",\"Did_you_mean\":[]"; //dummy value
				output += ",\"Corrected_String\":\""+correctedText+"\""; 
				} 
				JSONObject didobj=new JSONObject();
				JSONArray ja = new JSONArray();
				List<String> fin=new ArrayList<String>();
				Set<String> finalset=new HashSet<String>();
				List<String> finallist=new ArrayList<String>();
				
				if(tstflag== false)
				{
					
					for(int ix=0;ix<tempmultipleKeyNode.size();ix++)
					{
						dymlist.add(tempmultipleKeyNode.get(ix).getPrimKey());
						
					}
				
					for(int d=0;d<dymlist.size();d++)
					{
						templist=new ArrayList<String>(newList);
						templist.add(dymlist.get(d));	
						m_list.add(templist);
					}
				
					String str=null;
					for(int ii=0;ii<m_list.size();ii++)
					{
						str="";
						for(int jj=0;jj<m_list.get(ii).size();jj++)
						{
							 str+=" "+m_list.get(ii).get(jj);
						}
						 fin.add(str);
					}
					
					finalset.addAll(fin);
					finallist.addAll(finalset);
					if(finallist.size()!=0)
					{
						try {
							for(int jj=0;jj<finallist.size();jj++)
							{
								didobj=new JSONObject();
								didobj.put("val", finallist.get(jj));
								ja.put(didobj);
							}
						
							output += ",\"Did_you_mean\":"+ja+"}"; 
						} catch (JSONException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					
					}
					
				}
				if(tstflag== true || finallist.size()==0)
				{
					output += ",\"Did_you_mean\":"+ja+"}";  
				}
				} 
			catch (ClientProtocolException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	
		}
	timeKeeper += "\nTime after getting output from cayley : "+new Date().toString();
	logger.error(timeKeeper);
		

		try{
		    PrintWriter writer = new PrintWriter("Myjsonfile.json", "UTF-8");
		    writer.println(json);
		    writer.close();
		} catch (IOException e) {
		   // do something
			logger.error(e);
		}		

		return Response.status(Response.Status.OK)// Response.Status.OK: 200
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .entity(output).build(); 
		}
	public static JSONObject append(JSONObject lTempJSON,JSONObject mainJSON)
	{
		JSONObject tempJSON = null;
		try {
			tempJSON = new JSONObject(lTempJSON.toString());
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		tempJSON.remove("len");
		tempJSON.remove("summary");
		JSONArray tmpJsonArr= new JSONArray();
		JSONArray mainJsonArr= new JSONArray();
		String mainJsonStr, tmpJsonStr;
		JSONArray resultJson= null;
		 String AttributesData = null;
		String tKey = null;
		JSONObject objkey=new JSONObject();
		
		Iterator keysToCopyIterator = tempJSON.keys();
		List<String> keysList = new ArrayList<String>();
		while(keysToCopyIterator.hasNext()) {
			tKey = (String) keysToCopyIterator.next();
		    keysList.add(tKey);
		}
		keysList.remove("summary");
		logger.error(("keyss&&&&&&&"+keysList));
		logger.error("size "+keysList.size());
		for(String key:keysList)
		{
			if(!mainJSON.has(key))
			{
				try {
					objkey= tempJSON.getJSONObject(key);
					mainJSON.put(key, objkey);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			} else
			{
				try {
					logger.error("key "+key);
					tmpJsonArr= tempJSON.getJSONObject(key).getJSONArray("AttributesData");
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				try {
					mainJsonArr= mainJSON.getJSONObject(key).getJSONArray("AttributesData");
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				mainJsonStr = mainJsonArr.toString();
				logger.error("m "+mainJsonStr);
				tmpJsonStr = tmpJsonArr.toString();
				if(mainJsonArr.length() == 0)
					mainJsonStr = tmpJsonStr;
				else if(tmpJsonArr.length() != 0)
					mainJsonStr = "[" + mainJsonStr.substring(1, mainJsonStr.length()-1) + "," + tmpJsonStr.substring(1, tmpJsonStr.length()-1) + "]";
				logger.error("t "+tmpJsonStr);
			try {
				mainJsonArr = new JSONArray(mainJsonStr);
				logger.error("r "+mainJsonStr);
				mainJSON.getJSONObject(key).put("AttributesData", mainJsonArr);
				logger.error(mainJSON.getJSONObject(key).getJSONArray("AttributesData").length());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			logger.error("main js "+mainJSON);
			/*try {
				mainJSON.put("arrayname", mainJsonArr);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			*/
			}
		}
		return mainJSON;
	}
	@GET
	@Path("/ner1/{text}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response nerClassifier1(@PathParam("text") String text) {
		List<NER_VO> nerVOList = null;
		//System.out.println("Ner val : "+nerVOList.get(0).getType());
	timeKeeper = "Start time : "+new Date().toString();
	/*try {
			text = SpellCheck.correctSpelling(Arrays.asList(text.split(" ")));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}*/
	
		String givenText = text;
		text = new QBotService().spellChecker(text);
		
		nerVOList = ner.findName(text);
		//text = spellCheckBuilder.printSuggestions(text);
		//nerVOList = readNEROutput.chunk(dictionaryChunkerFF, text);
		List<ObjVO> jObjList = (List<ObjVO>) DeepCloner.deepClone(objList);	
		List<ObjVO> iObjList = readNEROutput.getobjects(nerVOList, jObjList);
	timeKeeper += "\nTime after performing NER and spellchecker : "+new Date().toString();
		//Collections.sort(iObjList);
		jObjList = null;
		jObjList = (List<ObjVO>) DeepCloner.deepClone(objList);
		String json = "";
		
		List<KeySearchNodeVO> keySearchNodeVO = null;
		if(iObjList.size()!=0){
			GenKeySearchnodeVO genkeysearchnode=new GenKeySearchnodeVO();
			List<ObjVO> multipleKeyNode=genkeysearchnode.getkeynode(iObjList);
			keySearchNodeVO = genkeysearchnode.generateKeySearchNode1(iObjList,jObjList,multipleKeyNode);
 			try {
 				ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
				json = ow.writeValueAsString(keySearchNodeVO);
				
			} 
 			catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
 			
		}
	timeKeeper += "\nTime after generating input json : "+new Date().toString();
		String output = "{\"result\":null}";
		if(json.trim().length()>0)
		{
			FileIO file = new FileIO();
			String rawQuery = file.readFile(PropertyManager.getProperty("chatbotqueryfile", Constants.CONFIGFILE));
			rawQuery+="getData("+json+");";
			logger.error(rawQuery);
			
			try {
				output = CayleyConnection.executeQuery(rawQuery);
				if(output.length()>0)
				{
				output = output.substring(0, output.length()-1);
				output += ",\"Given_String\":\""+givenText+"\"";
				output += ",\"Did_you_mean\":[]"; //dummy value
				output += ",\"Corrected_String\":\""+text+"\"}"; 
				} 
			}catch (ClientProtocolException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (UnsupportedEncodingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	timeKeeper += "\nTime after getting output from cayley : "+new Date().toString();
	logger.error(timeKeeper);
	logger.error("output "+output);
		try{

		    PrintWriter writer = new PrintWriter("Myjsonfile.json", "UTF-8");
		    writer.println(json);
		    writer.close();
		} catch (IOException e) {
		   // do something
			logger.error(e);
		}		
		return Response.status(Response.Status.OK)// Response.Status.OK: 200
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
                .entity(output).build(); 
	}
	}

