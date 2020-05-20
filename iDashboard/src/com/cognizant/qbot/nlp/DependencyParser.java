package com.cognizant.qbot.nlp;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.log4j.Logger;

import opennlp.tools.cmdline.parser.ParserTool;
import opennlp.tools.parser.Parse;
import opennlp.tools.parser.Parser;
import opennlp.tools.parser.ParserFactory;
import opennlp.tools.parser.ParserModel;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cognizant.qbot.service.CayleyConnection;
import com.cognizant.qbot.service.FileIO;
import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.cognizant.qbot.vo.AggregationVO;
import com.cognizant.qbot.vo.DependencyVO;

public class DependencyParser
{
	private List<Map<String,List<Parse>>> aggregator = new ArrayList<Map<String,List<Parse>>>();
	private List<Map<String,List<Parse>>> targetAggregator = new ArrayList<Map<String,List<Parse>>>();
	static final Logger logger = Logger.getLogger(DependencyParser.class);
	private static Parser parser;
	//static List<String> comparator = new ArrayList<String>(); 
	static
	{
		logger.error("generating dependencies...");
		ParserModel model = null;
		InputStream modelIn = null;
		modelIn = Thread.currentThread().getContextClassLoader().getResourceAsStream(PropertyManager.getProperty("dependencytrainingfile", Constants.CONFIGFILE));//new FileInputStream(PropertyManager.getProperty("dependencytrainingfile", Constants.CONFIGFILE));//"en-parser-chunking.bin");
		try {
		  model = new ParserModel(modelIn);
		}
		catch (IOException e) {
			logger.error(e.getMessage());
		}
		finally {
		  if (modelIn != null) {
		    try {
		      modelIn.close();
		    }
		    catch (IOException e) {
		    }
		  }
		}
		
		parser = ParserFactory.create(model);
	}
	
	private JSONObject isAvailable(String word)
	{
		String output = readData(word);
		JSONObject obj = null;
		try {
			obj = new JSONObject(output);
			obj = obj.getJSONArray("result").getJSONObject(0);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		
		return obj;
	}
	
	public DependencyVO parse(String sentence)
	{
		//System.out.println("Parser");
		String givenSentence = sentence;
		List<String> nounString = new ArrayList<String>();
		DependencyVO dependency = new DependencyVO();
		AggregationVO agg = new AggregationVO();
		List<AggregationVO> aggList = new ArrayList<AggregationVO>();
		Parse topParses[] = ParserTool.parseLine(sentence, parser, 1);
		List<List<Parse>> target = new ArrayList<List<Parse>>();
		List<Parse> noun = new ArrayList<Parse>();
		for (Parse p : topParses)
		{
			//p.show();
			//p.getChildren()[0].show();
			//System.out.println("given text : "+sentence);
			p.show();
			try {
				target = findTarget(p.getChildren()[0]);
				if(target == null)
					target = new ArrayList<List<Parse>>();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
			try{
				dependency.setTarget(appendString(target.get(0)));
				noun = getAllNoun(p);
			}
			catch(Exception e)
			{
				logger.error("no target found");
			}
			//System.out.println("Target index: "+p.getChildren()[0].indexOf(target.get(0).get(0)));
			getComparator(p);
			//System.out.println("aggregator "+aggregator);
			//System.out.println("target aggregator "+targetAggregator);
			for(List<Parse> removeList : target)
				for(Parse removeObj : removeList)
					noun.remove(removeObj);
			
			List<Parse> tempList = new ArrayList<Parse>();
			int number=-1;
			

			for(Map<String, List<Parse>> map : targetAggregator)
			{
				for(String key : map.keySet())
				{
					agg = new AggregationVO();
					agg.setOperation(key);
					tempList.addAll(map.get(key));
					if(tempList.size()>0)
						number = parseNumber(tempList.get(0).getCoveredText());
					if(number != -1)
					{
						agg.setNumber(number);
						tempList.remove(0);
						givenSentence = givenSentence.replaceFirst(String.valueOf(number), "");
					}
					else
					{
						agg.setNumber(1);
					}
					
					agg.setObject(appendString(tempList));
					aggList.add(agg);
					for(Parse value : map.get(key))
						noun.remove(value);
				}
			}
			
			dependency.setMainAggregation(aggList);
			
			tempList = new ArrayList<Parse>();
			aggList = new ArrayList<AggregationVO>();
			for(Map<String, List<Parse>> map : aggregator)
			{
				for(String key : map.keySet())
				{
					agg = new AggregationVO();
					agg.setOperation(key);
					tempList.addAll(map.get(key));
					if(tempList.size()>0)
						number = parseNumber(tempList.get(0).getCoveredText());
					if(number != -1)
					{
						agg.setNumber(number);
						tempList.remove(0);
						givenSentence = givenSentence.replaceFirst(String.valueOf(number), "");
					}
					else
					{
						agg.setNumber(1);
					}
					agg.setObject(appendString(tempList));
					aggList.add(agg);
					for(Parse value : map.get(key))
						noun.remove(value);
				}
			}
			
			dependency.setSubAggregation(aggList);
			
			
			dependency.setGivenSentence(givenSentence);
			
			
			for(Parse n : noun)
				nounString.add(n.toString());
			
			dependency.setOtherNoun(nounString);
			
			//System.out.println("noun "+noun);
			
			
			//p.show();
			//comparator = new ArrayList<>();
			
			//parent = p.getParent().getChildren();
			
			
			/*for(Parse child: p.getChildren()[0].getChildren())
			{
				child.show();
				//System.out.println(child.getChildCount()+" ---");
			}*/
		}
		//System.out.println(comparator);
		return dependency;
	 
	}
	
	private String appendString(List<Parse> list)
	{
		String str = "";
		
		for(Parse element : list)
		{
			str += element + " ";
		}
		
		if(list.size()==0)
			return "";
		return str.substring(0, str.length()-1);
	}
	
	private Parse moveDown(Parse p,boolean isForward)
	{
		//if(p.getChildren()[0].getChildCount() == 0)
		Parse[] children;
		if(isLeaf(p))
			return p;
		else
		{
			children = p.getChildren();
			if(isForward)
				return moveDown(children[0],isForward);
			else
				return moveDown(children[children.length-1],isForward);
		}
	}
	
	public Parse getImmediateNoun(Parse p)
	{
		List<Parse> siblings = getSiblings(p, false);
		int index = siblings.indexOf(p);
		if(index+1 == siblings.size())
			return null;
		if(isNoun(siblings.get(index+1)))
			return siblings.get(index+1);
		return null;
	}
	
	
	public Parse getNumber(Parse p,boolean isForward)
	{
		if(p == null)
			return null;
		
		List<Parse> siblings = getSiblings(p, false);
		
		int index = siblings.indexOf(p);
		int nextIndex;
		
		if(isForward)
			nextIndex = index + 1;
		else
			nextIndex = index - 1;
		
		if((nextIndex ==  siblings.size())||(nextIndex < 0))
			return getNumber(p.getParent(),isForward);
		Parse searchNode = null;
		searchNode = moveDown(siblings.get(nextIndex),isForward);
		//searchNode.show();
		if(searchNode == null)
			return getNumber(p.getParent(),isForward);
		
		siblings = getSiblings(searchNode, false);
		index = siblings.indexOf(searchNode);
		
		if(isForward)
			siblings = siblings.subList(index, siblings.size());
		else
		{
			siblings = siblings.subList(0, index+1);
			Collections.reverse(siblings);
		}
		Parse temp = null;
		
		for(Parse child : siblings)
		{
			
			//child.getChildren()[0].getChildren()[0].show();
			//System.out.println(child.getChildCount());
			if(!isLeaf(child))
			{
				
				temp = moveDown(child,isForward);
			}
			if(((temp != null)&&(isNumber(temp))))
				return temp;
			else if((temp != null)&&(isNoun(temp)))
				return null;
			
			if((isNumber(child)))
				return child;
			
			if((isNoun(child)||isPronoun(child))&&(!child.getCoveredText().equalsIgnoreCase("number")))
				return null;
			
		}
		
		return getNumber(p.getParent(),isForward);
	}
	
	//updated func
	public List<Parse> getNextNoun(Parse p)
	{
		if(p == null)
			return null;
		
		List<Parse> children = new ArrayList<Parse>();
		children.addAll(getSucceedingChildren(p));	
		
		children = children.subList(1, children.size());
		
		List<Parse> nounList = new ArrayList<Parse>();
		for(Parse child : children)
		{
			if(isNoun(child))
				nounList = getImmediateNounList(child);
			if(nounList.size() != 0)
				break;
		}
		
		return nounList;
		/*List<Parse> siblings = getSiblings(p, false);
		
		int index = siblings.indexOf(p);
		
		if(index+1 ==  siblings.size())
			return getNextNoun(p.getParent());
		
		Parse searchNode = moveDown(siblings.get(index+1),true);
		
		//searchNode.show();
		if(searchNode == null)
			return getNextNoun(p.getParent());
		
		siblings = getSiblings(searchNode, false);
		index = siblings.indexOf(searchNode);

		siblings = siblings.subList(index, siblings.size());
		Parse temp = null;
		List<Parse> tempChildren = null;
		
		for(Parse child : siblings)
		{
			
			//child.getChildren()[0].getChildren()[0].show();
			//System.out.println(child.getChildCount());
			if(!isLeaf(child))
				temp = moveDown(child,true);
			if((temp != null)&&(isNoun(temp)||isPronoun(temp))&&(!temp.getCoveredText().equalsIgnoreCase("number")))
				return temp;
			
			if((isNoun(child)||isPronoun(child))&&(!child.getCoveredText().equalsIgnoreCase("number")))
				return child;
			
			if(temp!=null)
			{
				tempChildren = getSiblings(temp, false);
				index = tempChildren.indexOf(temp);
				siblings.
			}
				---
			temp=null;
		}
		
		return getNextNoun(p.getParent());*/
	}
	
	public void getComparator(Parse p)
	{
		Parse tempObj = null;
		List<Parse> temp = new ArrayList<Parse>();
		Map<String,List<Parse>> tempMap = new HashMap<String, List<Parse>>();
		
		if((p.getCoveredText().equalsIgnoreCase("top")||(p.getCoveredText().equalsIgnoreCase("bottom")))&&(p.getChildCount() != 0))
		{
			temp = new ArrayList<Parse>();
			tempMap = new HashMap<String, List<Parse>>();
			tempObj = getImmediateNumber(p);
			
			if(tempObj != null)
				temp.add(tempObj);
			else
				tempObj = p;
			//getNounFromDB(tempObj, temp);
			temp.addAll(getNextNoun(tempObj));
			//temp.add(tempObj);
			//temp.addAll(getImmediateNounList(tempObj));
			/*tempObj = getImmediateNoun(tempObj);
			if(tempObj != null)
				temp.add(tempObj);*/
			tempMap.put(p.getCoveredText(), temp);
			targetAggregator.add(tempMap);
		}
		else if(isAdjective(p))
		{
			tempObj = getNumber(p,true);
			
			if(tempObj != null)
				temp.add(tempObj);
			else
			{
				tempObj = getNumber(p,false);
				if(tempObj != null)
					temp.add(tempObj);
				else
					tempObj = p;
			}
			
			temp.addAll(getNextNoun(p));
			/*do
			{
				if(tempObj != null)
					tempObj = getImmediateNoun(tempObj);
				temp.add(tempObj);
			}while(tempObj != null);
			
			temp.remove(temp.size()-1);*/
			tempMap.put(p.getCoveredText(), temp);
			aggregator.add(tempMap);
			return;
		}
		
			
		
		for (Parse child : p.getChildren())
			getComparator(child);
	}
	
	public Parse getImmediateNumber(Parse p)
	{
		List<Parse> siblings = getSiblings(p, false);
		int index = siblings.indexOf(p);
		if(index+1 == siblings.size())
			return null;
		if(isNumber(siblings.get(index+1)))
			return siblings.get(index+1);
		return null;
	}
	
	public List<Parse> getAllNoun(Parse p) 
	{
		List<Parse> noun = new ArrayList<Parse>();
		if(isNoun(p)||isPronoun(p))
			noun.add(p);
		
		for(Parse child : p.getChildren())
			noun.addAll(getAllNoun(child));
		return noun;
	}
	
	public List<Parse> getImmediateNounList(Parse p)
	{
		//Parse immediateTarget = null;
		List<Parse> targetList = new ArrayList<Parse>();
		
		//immediateTarget = getImmediateNoun(p);
		getImmediateNounFromDB(p,targetList);
		
		return targetList;
	}
	
	public List<Parse> findConjunctionNodes(Parse p) throws JSONException
	{
		List<Parse> targetList = new ArrayList<Parse>();
		List<Parse> siblings = getSiblings(p, false);
		int index = siblings.indexOf(p);
		if(index+1 == siblings.size())
			return targetList;
		
		p = siblings.get(index+1);
		if(isConjunction(p))
		{
			targetList = getImmediateNounList(p);
		}
		
		return targetList;
	}
	
	
	public List<List<Parse>> findTarget(Parse p) throws JSONException
	{
		List<Parse> targetList = new ArrayList<Parse>();
		List<List<Parse>> mainTargetList = new ArrayList<List<Parse>>();
		if(isNoun(p)&&(!(p.getCoveredText().equalsIgnoreCase("top"))&&(!(p.getCoveredText().equalsIgnoreCase("bottom")))))
		{
			//adding values from db to targetlist
			getImmediateNounFromDB(p,targetList);
			mainTargetList.add(targetList);
			
			/*targetList.add(p);
			targetList.addAll(getImmediateNounList(p));
			mainTargetList.add(targetList);
			tempList = findConjunctionNodes(p);
			while(tempList.size() != 0)
			{
				mainTargetList.add(tempList);
				tempList = findConjunctionNodes(tempList.get(tempList.size()-1));
			}*/
			/*targetList.add(p);
			immediateTarget = getImmediateNoun(p);
			while(immediateTarget != null)
			{
				obj = isAvailable(targetList.toString().substring(1, targetList.toString().length()-1).replaceAll(","," ") + " " + immediateTarget.getCoveredText());
				if(obj.getBoolean("isWholeWord"))
				{
					targetList.add(immediateTarget);
					immediateTarget = getImmediateNoun(immediateTarget);
					tempList = targetList;		//keeping track
				}
				else if(obj.getBoolean("isTokenizer"))
				{
					targetList.add(immediateTarget);
					immediateTarget = getImmediateNoun(immediateTarget);
				}
				else
				{
					if(tempList.size() != 0)
						targetList = tempList;
					break;
				}
			}*/
			
			if(targetList.size() != 0)
				return mainTargetList;
		}
		for(Parse child : p.getChildren())
		{
			if(isWhPhrase(child)||isPronounPhase(child)||isNoun(child)||isNounPhase(child)||isClause(child))
			{
				mainTargetList = findTarget(child);
				if(mainTargetList != null)
					return mainTargetList;
			}
			
		}
		
		return null;
	}
	
	private List<Parse> getSucceedingSiblings(Parse p, boolean omitCurrentNode)
	{
		List<Parse> siblings = getSiblings(p, false);
		int index = siblings.indexOf(p);
		if(omitCurrentNode)
			index++;
		return siblings.subList(index, siblings.size());
	}

	public List<Parse> getSucceedingLeaves(Parse p)
	{
		List<Parse> siblings = getSucceedingSiblings(p,false);
		//getSiblings(p, false);
		/*int index = siblings.indexOf(p);
		siblings = siblings.subList(index, siblings.size());*/
		
		siblings.addAll(getSucceedingSiblings(p.getParent(),true));
		//if(getSucceedingSiblings(p.getParent(), true).size()==0)
			
		
		return siblings;
	}
	
	public List<Parse> getSiblings(Parse p, boolean omitCurrentNode)
	{
		List<Parse> siblings = new ArrayList<Parse>();
		Parse parent = p.getParent();
		if(parent == null)
		{
			if(omitCurrentNode)
				return null;
			else
			{
				siblings.add(p);
				return siblings;
			}
		}		
		siblings = new ArrayList<Parse>(Arrays.asList(p.getParent().getChildren()));
		if(omitCurrentNode)
			siblings.remove(p);
		return siblings;
	}
	
	public boolean isLeaf(Parse p)
	{
		try{
			Parse dummy = p.getChildren()[0].getChildren()[0];
			return false;
		}
		catch(ArrayIndexOutOfBoundsException ex)
		{
			return true;
		}
	}
	
	public Set<Parse> getSucceedingChildren(Parse p)
	{
		Set<Parse> children = new LinkedHashSet<Parse>();
		List<Parse> siblings = null, tempChildren = null;
		
		siblings = getSucceedingLeaves(p);
		
		for(Parse child : siblings)
		{
			if(isLeaf(child))
				children.add(child);
			else
			{
				tempChildren = new ArrayList<Parse>(Arrays.asList(child.getChildren()));//getSiblings(child, false);
				for(Parse tempChild : tempChildren)
				{
					children.addAll(getSucceedingChildren(tempChild));
				}
			}
				
		}
		
		return children;
	}
	
	public boolean isWhPhrase(Parse p)
	{
		return ((p.getType().equals("WHNP"))||(p.getType().equals("WHPP")));
	}
	
	public boolean isClause(Parse p)
	{
		return ((p.getType().equals("S"))||(p.getType().equals("SBAR"))||(p.getType().equals("SBARQ"))||(p.getType().equals("SINV"))||(p.getType().equals("SQ")));
	}
	
	public boolean isNounPhase(Parse p)
	{
		return ((p.getType().equals("NP"))||(p.getType().equals("NAC"))||(p.getType().equals("NX")));
	}
	
	public boolean isPronoun(Parse p)
	{
		return ((p.getType().equals("PRP"))||(p.getType().equals("PRP$")));
	}
	
	public boolean isPronounPhase(Parse p)
	{
		return ((p.getType().equals("PP"))||(p.getType().equals("PP$")));
	}
	
	public boolean isNoun(Parse p)
	{
		return ((p.getType().equals("NN"))||(p.getType().equals("NNS"))||(p.getType().equals("NNP"))||(p.getType().equals("NNPS")));
	}
	
	public boolean isAdjective(Parse p)
	{
		return ((p.getType().equals("JJR"))||(p.getType().equals("JJ"))||(p.getType().equals("RBR")));
	}
	
	public boolean isConjunction(Parse p)
	{
		return p.getType().equals("CC");
	}
	
	public boolean isNumber(Parse p)
	{
		return p.getType().equals("CD");
	}
	
	public int parseNumber(String str)
	{
		try{
		int number = Integer.parseInt(str);
		return number;
		}
		catch(Exception e)
		{
			return -1;
		}
	}
	
	private static String readData(String input)
	{
		FileIO file = new FileIO();
		String rawQuery = file.readFile(PropertyManager.getProperty("utilityfile", Constants.CONFIGFILE));
		rawQuery+="isAvailable(\""+input+"\");";
		
		String output = null;
		try {
			output = CayleyConnection.executeQuery(rawQuery);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		return output;
	}
	
	public List<Parse> getImmediateNounFromDB(Parse immediateTarget,List<Parse> targetList)
	{
		JSONObject obj = null;
		List<Parse> tempList = new ArrayList<Parse>();
		
		while(immediateTarget != null)
		{
			if(targetList.size()==0)
				obj = isAvailable( immediateTarget.getCoveredText());
			else
				obj = isAvailable(targetList.toString().substring(1, targetList.toString().length()-1).replaceAll(","," ") + " " + immediateTarget.getCoveredText());
			try {
				if(obj.getBoolean("isWholeWord"))
				{
					targetList.add(immediateTarget);
					immediateTarget = getImmediateNoun(immediateTarget);
					tempList.addAll(targetList);		//keeping track
				}
				else if(obj.getBoolean("isTokenizer"))
				{
					targetList.add(immediateTarget);
					immediateTarget = getImmediateNoun(immediateTarget);
				}
				else
				{
					if(tempList.size() != 0)
						targetList = tempList;
					break;
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}
		
		return targetList;
	}
}
