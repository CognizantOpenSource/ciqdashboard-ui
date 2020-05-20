package com.cognizant.qbot.GData;


import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.http.entity.StringEntity;
import com.cognizant.qbot.graph.vo.AttributeVO;
import com.cognizant.qbot.graph.vo.LinkVO;
import com.cognizant.qbot.graph.vo.ObjVO;
import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.service.NER_VO;
import com.cognizant.qbot.utils.DeepCloner;
import org.apache.log4j.Logger;



public class ReadNEROutput {
	
	
	
	//private final static String NERQUERY = "var a=g.V().As(\"text\").Out(\"of type\").TagArray();a.forEach(function(d){	g.Emit(d); 	g.V(d.text).As(\"id\").In(\"is a\").As(\"text\").All();});";
	private static final String NERQUERY = "g.V().As(\"text\").Out(\"of type\").All();g.V().As(\"text\").Out(\"is a\").All();";
	private String GRAPHDBURL = "http://127.0.0.1:64210//api/v1/query/gremlin";
	private String BASEQUERYSTART = "g.V(\"";
	private String ALIASVALQUERY ="\").In(\"alias\").As(\"aliasval\").All();";
	private String ALIASTYPEISAQUERY ="\").Out(\"is a\").As(\"aliastype\").All();";
	private String ALIASTYPEOFQUERY ="\").Out(\"of type\").As(\"aliasoftype\").All();";
	
	static final Logger logger = Logger.getLogger(ReadNEROutput.class);

	
	public static List<DictionaryVO> getNerData()
	{
		StringEntity query=null;
		try {
			query = new StringEntity(NERQUERY);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
			//e.printStackTrace();
		}
		List<DictionaryVO> dictVOItems  = ReadGraphUtil.mapDictionaryValues(query);
		return dictVOItems;
	}
	
	
/*	public ExactDictionaryChunker createDictionaryChunker(){
		
		StringEntity query=null;
		ExactDictionaryChunker dictionaryChunkerFF = null;
		try {
        	query = new StringEntity(NERQUERY);
			List<DictionaryVO> dictVOItems  = ReadGraphUtil.mapDictionaryValues(query);
		
            MapDictionary<String> dictionary = new MapDictionary<String>();
            
            for(int i=0;i<dictVOItems.size();i++){
                 DictionaryVO dictVO = dictVOItems.get(i);
                 dictionary.addEntry(new DictionaryEntry<String>(dictVO.getText(),dictVO.getId(),CHUNK_SCORE));                         
            }
                    
            dictionaryChunkerFF
            	= new ExactDictionaryChunker(dictionary,
                     IndoEuropeanTokenizerFactory.INSTANCE,
                     true,false);
          

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return dictionaryChunkerFF;
				
	}
		
public List<NER_VO> chunk(ExactDictionaryChunker chunker, String text) {
        
        List<NER_VO> nerVOList = new ArrayList<NER_VO>();
        
        Chunking chunking = chunker.chunk(text);
      
        for (Chunk chunk : chunking.chunkSet()) {
        	NER_VO nerVO = new NER_VO();
            nerVO.setStart(chunk.start());
            nerVO.setEnd(chunk.end());
            String phrase = text.substring(nerVO.getStart(),nerVO.getEnd());
            nerVO.setValue(phrase);
            nerVO.setType(chunk.type());
            nerVOList.add(nerVO);
            //getobjects(nerVOList,);
        }        
        return nerVOList;
    }*/

public List<ObjVO> getobjects(List<NER_VO> nerVOList, List<ObjVO> metaObjList)
{
	
	List<ObjVO> objVOList = new ArrayList<ObjVO>();
	for(NER_VO nervo:nerVOList)
	{
		StringEntity valquery = null;
		StringEntity isatypequery = null;
		StringEntity oftypequery = null;
		//ObjVO objVO = null;
	
		if(nervo.getType().equalsIgnoreCase("Alias"))
		{
			
			try {
				valquery = new StringEntity(BASEQUERYSTART+nervo.getValue()+ALIASVALQUERY);
				
				List<DictionaryVO> aliasval = ReadGraphUtil.mapDictionaryValues(valquery);
				if(aliasval!=null)
				{
				for (int i = 0; i < aliasval.size(); i++) {
					
					DictionaryVO dictvalVO = aliasval.get(i);
					nervo.setValue(dictvalVO.getAliasval());
					
					isatypequery=new StringEntity(BASEQUERYSTART+nervo.getValue()+ALIASTYPEISAQUERY);
					List<DictionaryVO> aliastype = ReadGraphUtil.mapDictionaryValues(isatypequery);
					oftypequery=new StringEntity(BASEQUERYSTART+nervo.getValue()+ALIASTYPEOFQUERY);
					List<DictionaryVO> aliasoftype = ReadGraphUtil.mapDictionaryValues(oftypequery);
					if(aliastype!=null)
					{
					for (int j = 0; j < aliastype.size(); j++) {
						DictionaryVO dicttypeVO = aliastype.get(i);
						nervo.setType(dicttypeVO.getAliastype());
						
						
					}
					}
					if(aliasoftype!=null)
					{
					for (int j = 0; j < aliasoftype.size(); j++) {
						DictionaryVO dicttypeVO = aliasoftype.get(i);
						nervo.setType(dicttypeVO.getAliasoftype());
					
					}
					}
				}
			}
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				//e.printStackTrace();
				logger.error(e.getMessage());
			}
		}
		if(nervo.getType().equalsIgnoreCase("Object"))
		{	
			
			for(ObjVO mObjVO:metaObjList){
				if(mObjVO.getPrimKey().equalsIgnoreCase(nervo.getValue())){
					ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);	
					//objVO.setObjFlag("1");
					objVO.setObjweight(99);
					objVOList.add(objVO);
					break;
				}
			}								
		}
		else if(nervo.getType().equalsIgnoreCase("relation")){
			
			for(ObjVO mObjVO:metaObjList){
			HashMap<String, List<LinkVO>> mObjRelMap = mObjVO.getOutobjRelList();
			HashMap<String, List<LinkVO>> InmObjRelMap = mObjVO.getInobjRelList();
			Iterator it = mObjRelMap.entrySet().iterator();
			Iterator Init = InmObjRelMap.entrySet().iterator();
		    while (it.hasNext()) {
		        Map.Entry linkObjPair = (Map.Entry)it.next();
		        String linkObjName = (String) linkObjPair.getKey();
		        List<LinkVO> linkVOList = (List<LinkVO>) linkObjPair.getValue();
		        for (int i=0;i<linkVOList.size();i++) {
		        	LinkVO linkVO = linkVOList.get(i);
		            String linkName = linkVO.getLinkName();
		          
		            if(linkName.equalsIgnoreCase(nervo.getValue())){
		            	
		            	ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);	
		            	objVO.getOutobjRelList().get(linkObjName).get(i).setLinkFlag("1");	
		            	objVO.setObjweight(5);
		            	objVOList.add(objVO);
		            	break;
		            }
		            
		        }
		    }
		    while (Init.hasNext()) {
		        Map.Entry InlinkObjPair = (Map.Entry)Init.next();
		        String InlinkObjName = (String) InlinkObjPair.getKey();
		        List<LinkVO> InlinkVOList = (List<LinkVO>) InlinkObjPair.getValue();
		        for (int i=0;i<InlinkVOList.size();i++) {
		        	LinkVO linkVO = InlinkVOList.get(i);
		            String InlinkName = linkVO.getLinkName();
		          
		            if(InlinkName.equalsIgnoreCase(nervo.getValue())){
		            	
		            	ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);	
		            	objVO.getInobjRelList().get(InlinkObjName).get(i).setLinkFlag("1");	
		            	objVO.setObjweight(5);
		            	objVOList.add(objVO);
		            	break;
		            }
		            
		        }
		    }
		    List<AttributeVO> attrVOList = mObjVO.getAttrVOList();
			int attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getValue(), true);
								
			if(attrPresCheckIndex !=-1){
				ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);																											
				objVO.getAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
				objVO.setObjweight(5);
				objVOList.add(objVO);
				break;	
			}
						
			attrVOList = mObjVO.getGrpableAttrVOList();
			attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getValue(), true);			
			
			if(attrPresCheckIndex !=-1){
				ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);																											
				objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
				objVO.setObjweight(5);
				objVOList.add(objVO);
				break;	
			}									
			
			}
		}
		else if(nervo.getType().equalsIgnoreCase("attribute")){
		
			for(ObjVO mObjVO:metaObjList){
				List<AttributeVO> attrVOList = mObjVO.getAttrVOList();
				int attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getValue(), false);
				
				if(attrPresCheckIndex !=-1){
					ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);																											
					objVO.getAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
					objVO.getAttrVOList().get(attrPresCheckIndex).setValFlag("0");
					objVO.setObjweight(10);
					objVOList.add(objVO);
						continue;
				}	
				
				if(attrPresCheckIndex==-1){
					attrVOList = mObjVO.getGrpableAttrVOList();
					attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getValue(), false);	
				}
				if(attrPresCheckIndex !=-1){
					ObjVO objVO = (ObjVO) DeepCloner.deepClone(mObjVO);																											
					objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
					objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setValFlag("0");
					objVO.setObjweight(10);
					objVOList.add(objVO);
						
				}				
			}	
		}
		else
		{			
			for(ObjVO nObjVO:metaObjList){
				List<AttributeVO> attrVOList = nObjVO.getAttrVOList();
				int attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getType(), false);
				
								
				if(attrPresCheckIndex !=-1){
					ObjVO objVO = (ObjVO) DeepCloner.deepClone(nObjVO);															
					objVO.getAttrVOList().get(attrPresCheckIndex).setAttrValue(nervo.getValue());									
					objVO.getAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
					objVO.getAttrVOList().get(attrPresCheckIndex).setValFlag("1");
					objVO.setObjweight(20);
					objVOList.add(objVO);
			
				}
				attrVOList = nObjVO.getGrpableAttrVOList();
				attrPresCheckIndex = attrListPresenceCheck(attrVOList, nervo.getType(), false);	
			
				if(attrPresCheckIndex !=-1){
					ObjVO objVO = (ObjVO) DeepCloner.deepClone(nObjVO);															
					objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setAttrValue(nervo.getValue());									
					objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setAttrFlag("1");
					objVO.getGrpableAttrVOList().get(attrPresCheckIndex).setValFlag("1");
					objVO.setObjweight(20);
					objVOList.add(objVO);
				
				}
							
				}
					
				}			
		
	}		
	

	return objVOList;
	
	
	}
		
	private int attrListPresenceCheck(List<AttributeVO> attrList,String attrChkValue,boolean relationFlag){
		
		for(int j=0;j<attrList.size();j++){
			AttributeVO attrVO = attrList.get(j);
			String attrToCheck;
				if(relationFlag){
					attrToCheck = attrVO.getAttrRelation();
				}else{
					attrToCheck = attrVO.getAttrName();
				}
				
				if(attrToCheck.equalsIgnoreCase(attrChkValue)){
					return j;				
				}
		}
		
		return -1;
	}

	}
