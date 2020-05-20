package com.cognizant.qbot.nlp;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import opennlp.tools.namefind.NameFinderME;
import opennlp.tools.namefind.NameSample;
import opennlp.tools.namefind.NameSampleDataStream;
import opennlp.tools.namefind.TokenNameFinderModel;
import opennlp.tools.util.ObjectStream;
import opennlp.tools.util.PlainTextByLineStream;
import opennlp.tools.util.Span;
import org.apache.log4j.Logger;

import com.cognizant.qbot.GData.ReadNEROutput;
import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.service.FileIO;
import com.cognizant.qbot.service.NER_VO;

public class NERProcessor 
{
	public static List<DictionaryVO> dictVOItems;
	private static final String MODEL_FILE = "nlp\\qbotModel.bin";
	private static String regex = ""; 
	private static List<String> whiteSpaceWords = null;
	private static List<TokenNameFinderModel> modelList = new ArrayList<TokenNameFinderModel>();
	private final static int TRAINING_LIMIT = 20000;
	private final static boolean useHashMap = false;
	private static Map<String,List<String>> typeMap = null;
	
	
	static final Logger logger = Logger.getLogger(NERProcessor.class);
	
	public static String[] splitInput(String input)
	{
		input = " " + input + " ";
		for(String str:whiteSpaceWords)
		{
			input = input.replaceAll(str, str.replaceAll(" ", "__"));
		}
		logger.error("done splitting");
		return input.replaceAll(" ", " dummyblabla ").split(" ");
	}
	
	public List<NER_VO> findName(String input) throws IOException {
		
		input = input.trim();
		List<NER_VO> nerVOList = new ArrayList<NER_VO>();
		NER_VO nerVO = new NER_VO();
		//System.out.println(whiteSpaceWords);
		/*for(String str:whiteSpaceWords)
		{
			input = input.replaceAll(str, str.replaceAll(" ", "__"));
		}*/
		//String replacesString = input.replaceAll(" ", " . ");
		String []sentence = splitInput(input);//input.replace(" "," . ").split(" ");
		//System.out.println("replaced str "+replacesString);
		logger.error("input "+input);
		//System.out.println("regex "+generateRegex());
		//InputStream is = new FileInputStream(MODEL_FILE);
		//System.out.println(trainedData == null);
		//trainedData = new ByteArrayInputStream("<START:defect> d001 <END> a .".getBytes("UTF-8"));
		//TokenNameFinderModel model = new TokenNameFinderModel(is);
		//is.close();

		/*NameFinderME nameFinder = new NameFinderME(model);
	 
		//String []sentence = input.replaceAll(" ", " . ").split(" ");
	 System.out.println("Sen "+Arrays.asList(sentence));
		Span nameSpans[] = nameFinder.find(sentence);
		System.out.println("\nTotal elements found:"+nameSpans.length+"\n");
		System.out.println("Element\t\tType");
		System.out.println("-------------------------");
		int start,end;
		for(Span s: nameSpans)
		{
			start = s.getStart();
			end = s.getEnd();
			for(int i=start;i<end;i++)
			{
				for(String type : s.getType().split("##_##"))
				{
					nerVO = new NER_VO();
					nerVO.setValue(sentence[i].replaceAll("__", " "));
					nerVO.setType(type.replaceAll("__", " "));
					nerVOList.add(nerVO);
					System.out.println(sentence[i]+"\t\t"+type);
				}
			}
		}
		*/
		
		nerVOList.addAll(getTypes(sentence,modelList));
		return nerVOList;
	}
	
	private static List<NER_VO> getTypes(String[] sentence, List<TokenNameFinderModel> modelList)
	{
		List<NER_VO> nerVOList = new ArrayList<NER_VO>();
		NER_VO nerVO = null;
		List<String> list = new ArrayList<String>();
		if(useHashMap)
		{
			logger.error("Element\t\tType");
			logger.error("-------------------------");
			
			for(String str : sentence)
			{
				list = typeMap.get(str);
				if(list != null)
				{
					for(String type: list)
					{
						nerVO = new NER_VO();
						nerVO.setValue(str.replaceAll("__", " "));						
						nerVO.setType(type.replaceAll("__", " "));
						nerVOList.add(nerVO);
						logger.error(str+"\t\t"+type);
					}
				}
			}
		}
		else
		{
			for(TokenNameFinderModel model : modelList)
			{
				NameFinderME nameFinder = new NameFinderME(model);
				Span nameSpans[] = nameFinder.find(sentence);
				logger.error("\nTotal elements found:"+nameSpans.length+"\n");
				logger.error("Element\t\tType");
				logger.error("-------------------------");
				int start,end;
				for(Span s: nameSpans)
				{
					start = s.getStart();
					end = s.getEnd();
					for(int i=start;i<end;i++)
					{
						for(String type : s.getType().split("##_##"))
						{
							if(!sentence[i].equals("."))
							{
								nerVO = new NER_VO();
								nerVO.setValue(sentence[i].replaceAll("__", " "));
								nerVO.setType(type.replaceAll("__", " "));
								nerVOList.add(nerVO);
								logger.error(sentence[i]+"\t\t"+type);
							}
						}
					}
				}
			}
		}
		
		return nerVOList;
	}
	
	public void train(String trainingFile,String type) throws IOException
	{		
		dictVOItems = ReadNEROutput.getNerData();
		whiteSpaceWords = new ArrayList<String>();
		String start = "<START:",end =" <END> a a ",dot=".", id, text, typeStr;
		
List<StringBuilder> trainedStringList = new ArrayList<StringBuilder>();

		StringBuilder trainedString = new StringBuilder();
		logger.error(dictVOItems.size());
		List<String> tempList = new ArrayList<String>();
		typeMap = new HashMap<String,List<String>>();
		for(DictionaryVO dictVO:dictVOItems)
		{
			typeStr = dictVO.getText();
			if(typeStr.contains(" "))
	        {
				whiteSpaceWords.add(typeStr.replaceAll("\\(", "\\\\(").replaceAll("\\)", "\\\\)"));
				typeStr = typeStr.replaceAll(" ", "__");
	        }
			if(typeMap.containsKey(typeStr))
				tempList = typeMap.get(typeStr);
			else
				tempList = new ArrayList<String>();
			
			tempList.add(dictVO.getId());
			typeMap.put(typeStr, tempList);			
		}
		if(!useHashMap)
		{
			Set<String> set = typeMap.keySet();
			logger.error("data size "+set.size());
			int i=1;
			for(String key:set)
			{
				if( i%TRAINING_LIMIT == 0 )
				{
					trainedString.append(dot);
					trainedStringList.add(trainedString);
					trainedString = new StringBuilder();
				}
				id = processArray(typeMap.get(key));
				text = key;
				if(text.contains(" "))
	        	{
					whiteSpaceWords.add(text.replaceAll("\\(", "\\\\(").replaceAll("\\)", "\\\\)"));
	        	}
				trainedString.append(start + id.replaceAll(" ", "__") + "> " + text.replaceAll(" ", "__") + end);
				i++;
			}
			
			/*for(DictionaryVO dictVO:dictVOItems)
			{
				text = dictVO.getText();
				id = dictVO.getId();
				if(dictVO.getText().contains(" "))
	        	{
					whiteSpaceWords.add(text.replaceAll("\\(", "\\\\(").replaceAll("\\)", "\\\\)"));
	        	}
				//trainedList.add(start + dictVO.getId().replaceAll(" ", "__") + "> " + dictVO.getText().replaceAll(" ", "__") + end);
				trainedString.append(start + id.replaceAll(" ", "__") + "> " + text.replaceAll(" ", "__") + end);
			}*/
			trainedString.append(dot);
			trainedStringList.add(trainedString);
			TokenNameFinderModel model = null;
			List<String> trainedList = new ArrayList<String>();
			
			FileIO file = new FileIO();
			trainedList.add(trainedString.toString());
			file.writeFile(trainedList, "trainer.train");
			
			
			trainModel(trainedStringList, type);
			
			/*try {
			  modelOut = new BufferedOutputStream(new FileOutputStream(MODEL_FILE));
			  model.serialize(modelOut);
			} finally {
			  if (modelOut != null) 
			     modelOut.close();      
			}*/
		}
		logger.error("done training");
	}
	
	private static void trainModel(List<StringBuilder> trainedStringList, String type) throws IOException
	{
		TokenNameFinderModel model = null;
		InputStream trainedData = null;
		ObjectStream<String> lineStream = null;
		ObjectStream<NameSample> sampleStream = null;
		for(StringBuilder trainedString : trainedStringList)
		{
			System.gc();
			trainedData = new ByteArrayInputStream(trainedString.toString().getBytes("UTF-8"));
			System.gc();
			//BufferedOutputStream modelOut = null;
			lineStream = new PlainTextByLineStream(trainedData, "UTF-8");
			sampleStream = new NameSampleDataStream(lineStream);

			model = NameFinderME.train("en", type, sampleStream, null, 100, 1);
			modelList.add(model);
		}
	}
	
	private static String processArray(List<String> array)
	{
		String str = "";
		for(String val:array)
			str += val + "##_##";
		return str.substring(0, str.length()-5);
	}
}
