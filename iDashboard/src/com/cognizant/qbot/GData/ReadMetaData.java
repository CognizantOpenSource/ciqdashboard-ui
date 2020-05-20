package com.cognizant.qbot.GData;


import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.http.entity.StringEntity;
import org.apache.log4j.Logger;

import com.cognizant.qbot.graph.vo.AttributeVO;
import com.cognizant.qbot.graph.vo.LinkVO;
import com.cognizant.qbot.graph.vo.ObjVO;
import com.cognizant.qbot.service.DictionaryVO;


public class ReadMetaData {

	private String READOBJQUERY = "g.V(\"Object\").In(\"of type\").As(\"obj\").All();";
	private String BASEQUERYSTART = "g.V(\"";
	private String READATTRQuery = "\").Out(\"relation\").As(\"relname\").Out(\"relation\").As(\"attrname\").Has(\"is groupable\",\"false\").Out(\"is groupable\").As(\"groupable\").All();";
	private String READGROUPABLEATTRQuery = "\").Out(\"relation\").As(\"relname\").Out(\"relation\").As(\"attrname\").Has(\"is groupable\",\"true\").Out(\"is groupable\").As(\"groupable\").All();";
	private String READLINKOBJQUERY = "\").In(\"relation\").In(\"relation\").As(\"mapobj\").All();";

	private String READLINKRELATIONQUERYA = "\").Out(\"relation\").Has(\"relation\",\"";
	private String READLINKRELATIONQUERYB = "\").As(\"maprel\").All();";
	private String READOutRELATIONQUERY = "\").Out(\"relation\").As(\"outrel\").Out(\"relation\").Has(\"of type\",\"Object\").As(\"outrelobj\").All();";

	private String READATTRVALQUERY = "\").In(\"is a\").As(\"attvals\").All()";
	
	static final Logger logger = Logger.getLogger(ReadMetaData.class);

	public List<ObjVO> readData() {

		List<ObjVO> objVOList = new ArrayList<ObjVO>();
		StringEntity query = null;
		try {
			query = new StringEntity(READOBJQUERY);
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			//e1.printStackTrace();
			logger.error("ReadMetaData UnsupportedEncodingException");
		}

		List<DictionaryVO> dictVOItems = ReadGraphUtil
				.mapDictionaryValues(query);

		for (int i = 0; i < dictVOItems.size(); i++) {

			DictionaryVO dictVO = dictVOItems.get(i);
			ObjVO objVO = new ObjVO();
			objVO.setPrimKey(dictVO.getObj());
			objVOList.add(objVO);
		}

		for (int j = 0; j < objVOList.size(); j++) {

			ObjVO objVO = objVOList.get(j);
			List<AttributeVO> attrVOList = getAttrList(objVO.getPrimKey(),false);
			objVO.setAttrVOList(attrVOList);
		
			List<AttributeVO> grpableAttrVOList = getAttrList(objVO.getPrimKey(),true);
			objVO.setGrpableAttrVOList(grpableAttrVOList);			

			HashMap<String, List<LinkVO>> objLinkList = getObjLinkList(objVO.getPrimKey());
			HashMap<String, List<LinkVO>> outrelmapList = getOutrelobjList(objVO.getPrimKey());
					
			objVO.setInobjRelList(objLinkList);
			objVO.setOutobjRelList(outrelmapList);
			
			objVO.setObjRank(objLinkList.size());

		}

		return objVOList;
	}

	private List<AttributeVO> getAttrList(String objPrimKey,boolean groupableFlag) {

		List<AttributeVO> attrVOList = new ArrayList<AttributeVO>();

		String query;
		
		if(groupableFlag){
			query = READGROUPABLEATTRQuery;
		}else{
			query = READATTRQuery;
		}
		
		try {
			StringEntity queryattr = new StringEntity(BASEQUERYSTART+ objPrimKey + query);
					

			List<DictionaryVO> dictVOItems = ReadGraphUtil.mapDictionaryValues(queryattr);
					
			if (dictVOItems != null) {
				for (DictionaryVO dicattr : dictVOItems) {
					AttributeVO attvo = new AttributeVO();
					attvo.setAttrName(dicattr.getAttrname());
					attvo.setAttrRelation(dicattr.getRelname());
					attvo.setGroupable(dicattr.isGroupable());
					
						/*if(attvo.isGroupable()){						
							List<String> attvalues = getAttrVal(attvo.getAttrName());
							attvo.setValueList(attvalues);
						}*/
						
				
					attrVOList.add(attvo);
					
				}
			}

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}

		return attrVOList;

	}
	/*private List<AttributeVO> getgroupableAttrList(String objPrimKey) {

		List<AttributeVO> attrVOList = new ArrayList<AttributeVO>();

		try {
			StringEntity queryattr = new StringEntity(BASEQUERYSTART+ objPrimKey + READGROUPABLEATTRQuery);
					

			List<DictionaryVO> dictVOItems = ReadGraphUtil.mapDictionaryValues(queryattr);
					
			if (dictVOItems != null) {
				for (DictionaryVO dicattr : dictVOItems) {
					AttributeVO attvo = new AttributeVO();
					attvo.setAttrName(dicattr.getUserattr());
				
					System.out.println("groupattrVOList"+attvo.getAttrName());
					attvo.setGroupable(dicattr.isGroupable());
					
						List<String> attvalues = getAttrVal(attvo.getAttrName());
						attvo.setValueList(attvalues);
						
				
					attrVOList.add(attvo);
					
				}
			}

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return attrVOList;

	}*/

	private List<String> getAttrVal(String attrName) {
		List<String> attval = new ArrayList<String>();
		// TODO Auto-generated method stub
		try {
			
			StringEntity queryattrval = new StringEntity(BASEQUERYSTART	+ attrName + READATTRVALQUERY);
				
			List<DictionaryVO> dictVOItems = ReadGraphUtil.mapDictionaryValues(queryattrval);
				
			for (DictionaryVO dicattr : dictVOItems) {
				attval.add(dicattr.getAttvals());
			}
				
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}
		return attval;
	}

	private HashMap<String, List<LinkVO>> getObjLinkList(String objPrimKey) {

		HashMap<String, List<LinkVO>> objRelMap = new HashMap<String, List<LinkVO>>();

		try {

			StringEntity queryLink = new StringEntity(BASEQUERYSTART+ objPrimKey + READLINKOBJQUERY);
					
			List<DictionaryVO> linkMap = ReadGraphUtil.mapDictionaryValues(queryLink);
					
			if (linkMap != null) {
				for (DictionaryVO linkObj : linkMap) {

					List<LinkVO> linkObjRelations = new ArrayList<LinkVO>();
					String mappedObj = linkObj.getMapobj();
					
					StringEntity queryMapRelations = new StringEntity(BASEQUERYSTART + mappedObj+ READLINKRELATIONQUERYA + objPrimKey
							+ READLINKRELATIONQUERYB);
					
					List<DictionaryVO> linkRelations = ReadGraphUtil.mapDictionaryValues(queryMapRelations);
							

					if (linkRelations != null) {

						for (DictionaryVO linkRel : linkRelations) {

							LinkVO linkVO = new LinkVO();
							linkVO.setLinkName(linkRel.getMaprel());
							linkObjRelations.add(linkVO);							
						}
					}
				
					objRelMap.put(mappedObj, linkObjRelations);

				}

			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}

		return objRelMap;

	}
	
	private HashMap<String, List<LinkVO>> getOutrelobjList(String objPrimKey) {
		HashMap<String, List<LinkVO>> outrelobjMap = new HashMap<String, List<LinkVO>>();
		List<LinkVO> outrelmapRelations = null;
		LinkVO linkVO =null;
		String outobj=null;
		try {
			StringEntity queryoutrel = new StringEntity(BASEQUERYSTART+ objPrimKey + READOutRELATIONQUERY);
			List<DictionaryVO> outrellink = ReadGraphUtil.mapDictionaryValues(queryoutrel);
			if (outrellink != null) {
				for (DictionaryVO outrelObj : outrellink) {
					
					outobj=outrelObj.getOutrelobj();
					
					if(!outrelobjMap.containsKey(outobj))
					{
						outrelmapRelations = new ArrayList<LinkVO>();
					}
					else
					{
						outrelmapRelations=outrelobjMap.get(outobj);
					}
					
					linkVO = new LinkVO();
					linkVO.setLinkName(outrelObj.getOutrel());
					outrelmapRelations.add(linkVO);
					outrelobjMap.put(outobj, outrelmapRelations);
				}
				
				
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			logger.error(e.getMessage());
		}
		return outrelobjMap;
		
	
	}
	

}

