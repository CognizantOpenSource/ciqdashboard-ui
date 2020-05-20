package com.cognizant.qbot.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.apache.log4j.Logger;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.cognizant.qbot.GData.ReadGraphUtil;
import com.cognizant.qbot.graph.vo.AttributeVO;
import com.cognizant.qbot.graph.vo.FilterVO;
import com.cognizant.qbot.graph.vo.KeySearchNodeVO;
import com.cognizant.qbot.graph.vo.LinkVO;
import com.cognizant.qbot.graph.vo.ObjVO;
import com.cognizant.qbot.util.Constants;
import com.cognizant.qbot.util.PropertyManager;
import com.cognizant.qbot.util.WeightComparator;
import com.cognizant.qbot.vo.AggregationVO;
import com.cognizant.qbot.vo.DependencyVO;
import com.cognizant.qbot.vo.GenAggregationVO;

public class GenKeySearchnodeVO {
	private String BASEQUERYSTART = "g.V(\"";
	private String READLINKRELATIONQUERYA = "\").Out(\"relation\").Has(\"relation\",\"";
	private String READLINKRELATIONQUERYB = "\").As(\"relation\").All();";
	static final Logger logger = Logger.getLogger(GenKeySearchnodeVO.class);

	// private String FINDPRIMARYKEY =
	// "\").In(\"relation\").As(\"findpk\").All();";
	public List<ObjVO> getkeynode(List<ObjVO> vObjList) throws NullPointerException {

		int objweight = vObjList.get(0).getObjweight();
		List<ObjVO> multipleKeyNode = new ArrayList<ObjVO>();
		ObjVO obj = new ObjVO();
		String initial_prim = vObjList.get(0).getPrimKey();
		obj.setPrimKey(vObjList.get(0).getPrimKey());
		obj.setInobjRelList(vObjList.get(0).getInobjRelList());
		obj.setOutobjRelList(vObjList.get(0).getOutobjRelList());
		multipleKeyNode.add(obj);
		int sindex = 1;
		for (int i = sindex; i < vObjList.size(); i++) {
			if (objweight == vObjList.get(i).getObjweight()
					&& !vObjList.get(i).getPrimKey()
							.equalsIgnoreCase(obj.getPrimKey())) {
				obj = new ObjVO();
				objweight = vObjList.get(i).getObjweight();
				obj.setPrimKey(vObjList.get(i).getPrimKey());
				obj.setInobjRelList(vObjList.get(i).getInobjRelList());
				obj.setOutobjRelList(vObjList.get(i).getOutobjRelList());
				multipleKeyNode.add(obj);
			} else if (objweight < vObjList.get(i).getObjweight()) {
				obj = new ObjVO();
				objweight = vObjList.get(i).getObjweight();
				multipleKeyNode.clear();
				obj.setPrimKey(vObjList.get(i).getPrimKey());
				obj.setInobjRelList(vObjList.get(i).getInobjRelList());
				obj.setOutobjRelList(vObjList.get(i).getOutobjRelList());
				multipleKeyNode.add(obj);
			}

		}

		return multipleKeyNode;
	}

	public List<KeySearchNodeVO> generateKeySearchNode(List<ObjVO> vObjList,
			List<ObjVO> metaObjList, List<ObjVO> multipleKeyNode
			) throws NullPointerException {

		KeySearchNodeVO KeySearchNodeVO = null;
		List<KeySearchNodeVO> finalkeyvo = new ArrayList<KeySearchNodeVO>();
		for (ObjVO keynode : multipleKeyNode) {

			KeySearchNodeVO = new KeySearchNodeVO();
			int srchNodeIndex = 1;
			String keyNodeObjStr = keynode.getPrimKey();
			KeySearchNodeVO.setKeyNode(keyNodeObjStr);
			List<AttributeVO> attrVOList = getAttributeList(metaObjList,
					keyNodeObjStr, false, false); // get attributes of groupable
													// false

			List<AttributeVO> attrGroupableVOList = getAttributeList(
					metaObjList, keyNodeObjStr, false, true); // get attributes
																// of groupable
																// true

			/*
			 * List<AttributeVO> filterAttrVOList = getAttributeList(vObjList,
			 * keyNodeObjStr,true,false); List<AttributeVO>
			 * filterGrpableAttrVOList = getAttributeList(vObjList,
			 * keyNodeObjStr,true,true);
			 * 
			 * filterAttrVOList.addAll(filterGrpableAttrVOList);
			 * 
			 * filterAttrVOList =
			 * updatePrimaryKeyFilter(filterAttrVOList,keyNodeObj);
			 * KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);
			 */
			List<AttributeVO> filterAttrVOList = new ArrayList<AttributeVO>();
			List<AttributeVO> filterAttrvalVOList = new ArrayList<AttributeVO>();
			List<AttributeVO> sufilterAttrVOList = new ArrayList<AttributeVO>();
			List<FilterVO> finalrel_filterAttrVOList = new ArrayList<FilterVO>();
			Set<String> filtered_rel = new HashSet<String>();
			Set<String> prim_rel = new HashSet<String>();
			Set<String> relprim_key = new HashSet<String>();
			String valueoutput = "";
			
			FilterVO filtervo = null;
			AttributeVO filtervalattvo = null;
			// List<ObjVO> outrelList =
			// getSearchoutrelList(keynode,outrelobjjSet,vObjList,metaObjList);
			// KeySearchNodeVO.setOutgoingrelations(outrelList);
			for (int j = 0; j < vObjList.size(); j++) {

				ObjVO secNodeObj = vObjList.get(j);
				if (secNodeObj.getPrimKey().equalsIgnoreCase(keyNodeObjStr)) {
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList, secNodeObj.getAttrVOList());
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList, secNodeObj.getGrpableAttrVOList());
					// filterAttrVOList =
					// updatePrimaryKeyFilter(filterAttrVOList,secNodeObj);

				}

				// KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);

				updatefilteredrel(filtered_rel,
						secNodeObj.getGrpableAttrVOList());
				getrelations(prim_rel, keyNodeObjStr, secNodeObj.getPrimKey());
				updateFilterRelList(sufilterAttrVOList,
						secNodeObj.getAttrVOList());
				updateFilterRelList(sufilterAttrVOList,
						secNodeObj.getGrpableAttrVOList());
				filtered_rel.retainAll(prim_rel);

			}

			for (AttributeVO valuefil : filterAttrVOList) {
				if (valuefil.getValueList().contains("")) {

					filtervalattvo = new AttributeVO();
					filtervalattvo.setAttrName(valuefil.getAttrName());
					filtervalattvo.setAttrRelation(valuefil.getAttrRelation());
					filtervalattvo.setValueList(valuefil.getValueList());
					filtervalattvo.setValFlag(valuefil.getValFlag());
					filtervalattvo.setWeightFlag(valuefil.getWeightFlag());
					filterAttrvalVOList.add(filtervalattvo);

				}
			}
			if (filterAttrvalVOList.size() != 0) {

				filterAttrVOList = new ArrayList<AttributeVO>();
				filterAttrVOList.addAll(filterAttrvalVOList);

			}

			
			
			
			//avoiding attributeFilter
			/*for (AttributeVO value : filterAttrVOList) {
				
				for (String val : value.getValueList()) {
					FileIO file = new FileIO();
					String valueFile = file.readFile(PropertyManager
							.getProperty("utilityfile", Constants.CONFIGFILE));
					valueFile = valueFile + "isValueAvailable(\""
							+ value.getAttrRelation() + "\",\"" + val + "\");";
					try {
						valueoutput = CayleyConnection
								.executeQuery(new StringEntity(valueFile));
						try {
							valueoutput = new JSONObject(valueoutput)
									.getJSONArray("result").getString(0);
						} catch (JSONException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
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

					if (valueoutput.equalsIgnoreCase("false")) {
						value.getValueList().remove(val);
					}
				}
			}*/

		
			
			KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);
			
			
			if (filtered_rel.size() != 0 && sufilterAttrVOList.size() != 0) {
				for (AttributeVO filattr : sufilterAttrVOList) {

					filtervo = new FilterVO();
					filtervo.setAttrName(filattr.getAttrName());
					filtervo.setAttrRelation(filattr.getAttrRelation());
					filtervo.setValueList(filattr.getValueList());
					filtervo.setRelationslist(filtered_rel);
					finalrel_filterAttrVOList.add(filtervo);
					sufilterAttrVOList = new ArrayList<AttributeVO>();
					filtered_rel = new HashSet<String>();
					prim_rel = new HashSet<String>();
				}
			}

			if (prim_rel.size() != 0 && filtered_rel.size() == 0) {
				Boolean pk_flag = true;
				for (AttributeVO filattr : sufilterAttrVOList) {
					if (filterAttrVOList.size() != 0) {

						for (AttributeVO keyfil : filterAttrVOList) {
							if (keyfil.getAttrName().equalsIgnoreCase(
									filattr.getAttrName())) {
								pk_flag = false;

							}
						}

						if (finalrel_filterAttrVOList.size() == 0
								&& pk_flag == true) {

							filtervo = new FilterVO();
							filtervo.setAttrName(filattr.getAttrName());
							filtervo.setAttrRelation(filattr.getAttrRelation());
							filtervo.setValueList(filattr.getValueList());
							filtervo.setRelationslist(prim_rel);
							finalrel_filterAttrVOList.add(filtervo);
						}
					} else {

						filtervo = new FilterVO();
						filtervo.setAttrName(filattr.getAttrName());
						filtervo.setAttrRelation(filattr.getAttrRelation());
						filtervo.setValueList(filattr.getValueList());
						filtervo.setRelationslist(prim_rel);
						finalrel_filterAttrVOList.add(filtervo);
					}

				}

			}

			// KeySearchNodeVO.setOutgoingrelations(outrelList);

			KeySearchNodeVO.setRelationsfilter(finalrel_filterAttrVOList);
			for (AttributeVO weightattr : attrVOList) {
				for (AttributeVO filterattr : filterAttrVOList) {
					if (weightattr.getAttrName().equalsIgnoreCase(
							filterattr.getAttrName())) {
						if (filterattr.getValFlag() == "1") {
							weightattr.setWeightFlag("1");
						} else {
							weightattr.setWeightFlag("2");
						}
					}

				}

			}
			for (AttributeVO weightgrpattr : attrGroupableVOList) {
				for (AttributeVO filterattr : filterAttrVOList) {
					if (weightgrpattr.getAttrName().equalsIgnoreCase(
							filterattr.getAttrName())) {

						if (filterattr.getValFlag() == "1") {
							weightgrpattr.setWeightFlag("1");
						} else {
							weightgrpattr.setWeightFlag("2");
						}
					}
				}
			}
			for (FilterVO filrel : finalrel_filterAttrVOList) {

				for (AttributeVO weightgrprelattr : attrGroupableVOList) {
					for (String relapr : filrel.getRelationslist()) {
						if (relapr.equalsIgnoreCase(weightgrprelattr
								.getAttrRelation())) {

							weightgrprelattr.setWeightFlag("2");
						}
					}
				}
			}
			Collections.sort(attrVOList, new WeightComparator()); // sorting
																	// attribute
																	// list
																	// based on
																	// weight
			Collections.sort(attrGroupableVOList, new WeightComparator()); // sorting
																			// groupable
																			// attribute
																			// list
																			// based
																			// on
																			// weight
			KeySearchNodeVO.setKeyAttrList(attrVOList);
			KeySearchNodeVO.setKeyGrpableList(attrGroupableVOList);

			HashMap<String, List<LinkVO>> keyObjRelMap = keynode
					.getInobjRelList();
			Set<String> relObjSet = keyObjRelMap.keySet();
			List<String> filteredLinks = new ArrayList<String>();
			Map<String, Integer> objweightmap = new HashMap<String, Integer>();
			Map<String, Integer> resultEntry = new HashMap<String, Integer>();
			String objKeyName = null;

			int insrchNodeIndex = 1;
			Set<String> filteredLinkSet = new HashSet<String>();

			for (int k = insrchNodeIndex; k < vObjList.size(); k++) {

				ObjVO sNodeObj = vObjList.get(k);

				objKeyName = sNodeObj.getPrimKey();

				int weight = sNodeObj.getObjweight();

				if (relObjSet.contains(objKeyName)) {

					// filteredLinkSet.add(objKeyName);
					if (!objweightmap.containsKey(objKeyName)) {
						objweightmap.put(objKeyName, weight);

					} else {
						if (weight > objweightmap.get(objKeyName)) {
							objweightmap.put(objKeyName, weight);

						}
					}
					Map.Entry<String, Integer> maxEntry = (Entry<String, Integer>) new HashMap<String, Integer>();
					resultEntry = new HashMap<String, Integer>();

					for (Map.Entry<String, Integer> entry : objweightmap
							.entrySet()) {
						if (maxEntry == null
								|| entry.getValue().compareTo(
										maxEntry.getValue()) > 0) {
							maxEntry = entry;
						}
					}
					for (Map.Entry<String, Integer> entry : objweightmap
							.entrySet()) {
						if (entry.getValue().compareTo(maxEntry.getValue()) >= 0) {
							resultEntry.put(entry.getKey(), entry.getValue());
						}
					}
				}

			}
			if (vObjList.size() > 1) {

				if (!relObjSet.contains(objKeyName)) {
					filteredLinks.addAll(relObjSet);
				} else {
					filteredLinkSet.addAll(resultEntry.keySet());
					filteredLinks.addAll(filteredLinkSet);

				}

			}

			if (filteredLinks.size() == 0) {
				filteredLinks.addAll(relObjSet);
			}
			List<ObjVO> searchObjectList = getSearchObjectList(keynode,
					filteredLinks, vObjList, metaObjList, srchNodeIndex);
			for (ObjVO obj : searchObjectList) {
				// System.out.println("gggggggggggggggggggg#################"+obj.getObjLinks());
			}
			KeySearchNodeVO.setLinkObjects(searchObjectList);
GenAggregationVO ag=new GenAggregationVO();
			KeySearchNodeVO.setAggregation(ag);
			finalkeyvo.add(KeySearchNodeVO);

		}
		return finalkeyvo;
	}

	public List<KeySearchNodeVO> generateKeySearchNodewithagg(
			List<ObjVO> vObjList, List<ObjVO> metaObjList,
			List<ObjVO> multipleKeyNode, GenAggregationVO aggregation) throws NullPointerException {

		KeySearchNodeVO KeySearchNodeVO = null;
		List<KeySearchNodeVO> finalkeyvo = new ArrayList<KeySearchNodeVO>();
		for (ObjVO keynode : multipleKeyNode) {
			if (keynode.getPrimKey().equalsIgnoreCase(aggregation.getTarget())) {
				KeySearchNodeVO = new KeySearchNodeVO();
				int srchNodeIndex = 1;
				String keyNodeObjStr = keynode.getPrimKey();
				KeySearchNodeVO.setKeyNode(keyNodeObjStr);
				List<AttributeVO> attrVOList = getAttributeList(metaObjList,
						keyNodeObjStr, false, false); // get attributes of
														// groupable false

				List<AttributeVO> attrGroupableVOList = getAttributeList(
						metaObjList, keyNodeObjStr, false, true); // get
																	// attributes
																	// of
																	// groupable
																	// true

				/*
				 * List<AttributeVO> filterAttrVOList =
				 * getAttributeList(vObjList, keyNodeObjStr,true,false);
				 * List<AttributeVO> filterGrpableAttrVOList =
				 * getAttributeList(vObjList, keyNodeObjStr,true,true);
				 * 
				 * filterAttrVOList.addAll(filterGrpableAttrVOList);
				 * 
				 * filterAttrVOList =
				 * updatePrimaryKeyFilter(filterAttrVOList,keyNodeObj);
				 * KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);
				 */
				List<AttributeVO> filterAttrVOList = new ArrayList<AttributeVO>();
				List<AttributeVO> sufilterAttrVOList = new ArrayList<AttributeVO>();
				List<FilterVO> finalrel_filterAttrVOList = new ArrayList<FilterVO>();
				Set<String> filtered_rel = new HashSet<String>();
				Set<String> prim_rel = new HashSet<String>();
				Set<String> relprim_key = new HashSet<String>();

				FilterVO filtervo = null;
				// List<ObjVO> outrelList =
				// getSearchoutrelList(keynode,outrelobjjSet,vObjList,metaObjList);
				// KeySearchNodeVO.setOutgoingrelations(outrelList);
				for (int j = 0; j < vObjList.size(); j++) {

					ObjVO secNodeObj = vObjList.get(j);
					if (secNodeObj.getPrimKey().equalsIgnoreCase(keyNodeObjStr)) {
						filterAttrVOList = updateFilterAttributeList(
								filterAttrVOList, secNodeObj.getAttrVOList());
						filterAttrVOList = updateFilterAttributeList(
								filterAttrVOList,
								secNodeObj.getGrpableAttrVOList());
						// filterAttrVOList =
						// updatePrimaryKeyFilter(filterAttrVOList,secNodeObj);

					}
					KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);

					updatefilteredrel(filtered_rel,
							secNodeObj.getGrpableAttrVOList());
					getrelations(prim_rel, keyNodeObjStr,
							secNodeObj.getPrimKey());
					updateFilterRelList(sufilterAttrVOList,
							secNodeObj.getAttrVOList());
					updateFilterRelList(sufilterAttrVOList,
							secNodeObj.getGrpableAttrVOList());
					filtered_rel.retainAll(prim_rel);

				}

				if (filtered_rel.size() != 0 && sufilterAttrVOList.size() != 0) {
					for (AttributeVO filattr : sufilterAttrVOList) {

						filtervo = new FilterVO();
						filtervo.setAttrName(filattr.getAttrName());
						filtervo.setAttrRelation(filattr.getAttrRelation());
						filtervo.setValueList(filattr.getValueList());
						filtervo.setRelationslist(filtered_rel);
						finalrel_filterAttrVOList.add(filtervo);
						sufilterAttrVOList = new ArrayList<AttributeVO>();
						filtered_rel = new HashSet<String>();
						prim_rel = new HashSet<String>();
					}
				}

				if (prim_rel.size() != 0 && filtered_rel.size() == 0) {
					Boolean pk_flag = true;
					for (AttributeVO filattr : sufilterAttrVOList) {
						if (filterAttrVOList.size() != 0) {

							for (AttributeVO keyfil : filterAttrVOList) {
								if (keyfil.getAttrName().equalsIgnoreCase(
										filattr.getAttrName())) {
									pk_flag = false;

								}
							}

							if (finalrel_filterAttrVOList.size() == 0
									&& pk_flag == true) {

								filtervo = new FilterVO();
								filtervo.setAttrName(filattr.getAttrName());
								filtervo.setAttrRelation(filattr
										.getAttrRelation());
								filtervo.setValueList(filattr.getValueList());
								filtervo.setRelationslist(prim_rel);
								finalrel_filterAttrVOList.add(filtervo);
							}
						} else {

							filtervo = new FilterVO();
							filtervo.setAttrName(filattr.getAttrName());
							filtervo.setAttrRelation(filattr.getAttrRelation());
							filtervo.setValueList(filattr.getValueList());
							filtervo.setRelationslist(prim_rel);
							finalrel_filterAttrVOList.add(filtervo);
						}

					}

				}

				// KeySearchNodeVO.setOutgoingrelations(outrelList);

				KeySearchNodeVO.setRelationsfilter(finalrel_filterAttrVOList);
				for (AttributeVO weightattr : attrVOList) {
					for (AttributeVO filterattr : filterAttrVOList) {
						if (weightattr.getAttrName().equalsIgnoreCase(
								filterattr.getAttrName())) {
							if (filterattr.getValFlag() == "1") {
								weightattr.setWeightFlag("1");
							} else {
								weightattr.setWeightFlag("2");
							}
						}

					}

				}
				for (AttributeVO weightgrpattr : attrGroupableVOList) {
					for (AttributeVO filterattr : filterAttrVOList) {
						if (weightgrpattr.getAttrName().equalsIgnoreCase(
								filterattr.getAttrName())) {
							if (filterattr.getValFlag() == "1") {
								weightgrpattr.setWeightFlag("1");
							} else {
								weightgrpattr.setWeightFlag("2");
							}
						}
					}
				}
				for (FilterVO filrel : finalrel_filterAttrVOList) {
					// System.out.println("fillllllllllllll"+filrel.getRelationslist());
					for (AttributeVO weightgrprelattr : attrGroupableVOList) {
						for (String relapr : filrel.getRelationslist()) {
							if (relapr.equalsIgnoreCase(weightgrprelattr
									.getAttrRelation())) {
								// System.out.println("weightgrpattr.getAttrRelation()"+weightgrprelattr.getAttrRelation());
								weightgrprelattr.setWeightFlag("2");
							}
						}
					}
				}
				Collections.sort(attrVOList, new WeightComparator()); // sorting
																		// attribute
																		// list
																		// based
																		// on
																		// weight
				Collections.sort(attrGroupableVOList, new WeightComparator()); // sorting
																				// groupable
																				// attribute
																				// list
																				// based
																				// on
																				// weight
				KeySearchNodeVO.setKeyAttrList(attrVOList);
				KeySearchNodeVO.setKeyGrpableList(attrGroupableVOList);

				HashMap<String, List<LinkVO>> keyObjRelMap = keynode
						.getInobjRelList();
				Set<String> relObjSet = keyObjRelMap.keySet();
				List<String> filteredLinks = new ArrayList<String>();
				Map<String, Integer> objweightmap = new HashMap<String, Integer>();
				Map<String, Integer> resultEntry = new HashMap<String, Integer>();
				String objKeyName = null;

				int insrchNodeIndex = 1;
				Set<String> filteredLinkSet = new HashSet<String>();

				for (int k = insrchNodeIndex; k < vObjList.size(); k++) {

					ObjVO sNodeObj = vObjList.get(k);

					objKeyName = sNodeObj.getPrimKey();

					int weight = sNodeObj.getObjweight();

					if (relObjSet.contains(objKeyName)) {

						// filteredLinkSet.add(objKeyName);
						if (!objweightmap.containsKey(objKeyName)) {
							objweightmap.put(objKeyName, weight);

						} else {
							if (weight > objweightmap.get(objKeyName)) {
								objweightmap.put(objKeyName, weight);

							}
						}
						Map.Entry<String, Integer> maxEntry = (Entry<String, Integer>) new HashMap<String, Integer>(); 
						resultEntry = new HashMap<String, Integer>();

						for (Map.Entry<String, Integer> entry : objweightmap
								.entrySet()) {
							if (maxEntry == null
									|| entry.getValue().compareTo(
											maxEntry.getValue()) > 0) {
								maxEntry = entry;
							}
						}
						for (Map.Entry<String, Integer> entry : objweightmap
								.entrySet()) {
							if (entry.getValue().compareTo(maxEntry.getValue()) >= 0) {
								resultEntry.put(entry.getKey(),
										entry.getValue());
							}
						}
					}

				}
				if (vObjList.size() > 1) {

					if (!relObjSet.contains(objKeyName)) {
						filteredLinks.addAll(relObjSet);
					} else {
						filteredLinkSet.addAll(resultEntry.keySet());
						filteredLinks.addAll(filteredLinkSet);

					}

				}

				if (filteredLinks.size() == 0) {
					filteredLinks.addAll(relObjSet);
				}
				List<ObjVO> searchObjectList = getSearchObjectList(keynode,
						filteredLinks, vObjList, metaObjList, srchNodeIndex);

				KeySearchNodeVO.setLinkObjects(searchObjectList);

				KeySearchNodeVO.setAggregation(aggregation);
				finalkeyvo.add(KeySearchNodeVO);

			}

		}
		return finalkeyvo;
	}

	public List<KeySearchNodeVO> generateKeySearchNode1(List<ObjVO> vObjList,
			List<ObjVO> metaObjList, List<ObjVO> multipleKeyNode) throws NullPointerException{

		KeySearchNodeVO KeySearchNodeVO = null;
		List<KeySearchNodeVO> finalkeyvo = new ArrayList<KeySearchNodeVO>();
		for (ObjVO keynode : multipleKeyNode) {

			KeySearchNodeVO = new KeySearchNodeVO();
			int srchNodeIndex = 1;
			String keyNodeObjStr = keynode.getPrimKey();
			KeySearchNodeVO.setKeyNode(keyNodeObjStr);
			List<AttributeVO> attrVOList = getAttributeList(metaObjList,
					keyNodeObjStr, false, false); // get attributes of groupable
													// false

			List<AttributeVO> attrGroupableVOList = getAttributeList(
					metaObjList, keyNodeObjStr, false, true); // get attributes
																// of groupable
																// true

			/*
			 * List<AttributeVO> filterAttrVOList = getAttributeList(vObjList,
			 * keyNodeObjStr,true,false); List<AttributeVO>
			 * filterGrpableAttrVOList = getAttributeList(vObjList,
			 * keyNodeObjStr,true,true);
			 * 
			 * filterAttrVOList.addAll(filterGrpableAttrVOList);
			 * 
			 * filterAttrVOList =
			 * updatePrimaryKeyFilter(filterAttrVOList,keyNodeObj);
			 * KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);
			 */
			List<AttributeVO> filterAttrVOList = new ArrayList<AttributeVO>();
			List<AttributeVO> sufilterAttrVOList = new ArrayList<AttributeVO>();
			List<FilterVO> finalrel_filterAttrVOList = new ArrayList<FilterVO>();
			Set<String> filtered_rel = new HashSet<String>();
			Set<String> prim_rel = new HashSet<String>();

			FilterVO filtervo = null;
			// List<ObjVO> outrelList =
			// getSearchoutrelList(keynode,outrelobjjSet,vObjList,metaObjList);
			// KeySearchNodeVO.setOutgoingrelations(outrelList);
			for (int j = 0; j < vObjList.size(); j++) {

				ObjVO secNodeObj = vObjList.get(j);
				if (secNodeObj.getPrimKey().equalsIgnoreCase(keyNodeObjStr)) {
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList, secNodeObj.getAttrVOList());
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList, secNodeObj.getGrpableAttrVOList());
					// filterAttrVOList =
					// updatePrimaryKeyFilter(filterAttrVOList,secNodeObj);

				}

				for (int e = 0; e < filterAttrVOList.size(); e++) {
					if (filterAttrVOList.get(e).getValFlag() == "1") {
						filterAttrVOList.get(e).setWeightFlag("2");
					} else {
						filterAttrVOList.get(e).setWeightFlag("1");
					}

				}
				KeySearchNodeVO.setKeyAttrFilter(filterAttrVOList);
				updatefilteredrel(filtered_rel,
						secNodeObj.getGrpableAttrVOList());
				getrelations(prim_rel, keyNodeObjStr, secNodeObj.getPrimKey());
				updateFilterRelList(sufilterAttrVOList,
						secNodeObj.getAttrVOList());
				updateFilterRelList(sufilterAttrVOList,
						secNodeObj.getGrpableAttrVOList());
				filtered_rel.retainAll(prim_rel);
				if (filtered_rel.size() != 0 && sufilterAttrVOList.size() != 0) {
					for (AttributeVO filattr : sufilterAttrVOList) {

						filtervo = new FilterVO();
						filtervo.setAttrName(filattr.getAttrName());
						filtervo.setAttrRelation(filattr.getAttrRelation());
						filtervo.setValueList(filattr.getValueList());
						filtervo.setRelationslist(filtered_rel);
						finalrel_filterAttrVOList.add(filtervo);
						sufilterAttrVOList = new ArrayList<AttributeVO>();
						filtered_rel = new HashSet<String>();
						prim_rel = new HashSet<String>();
					}
				}
				if (prim_rel.size() != 0 && filtered_rel.size() == 0) {
					if (!keyNodeObjStr
							.equalsIgnoreCase(secNodeObj.getPrimKey())) {
						for (AttributeVO filattr : sufilterAttrVOList) {

							filtervo = new FilterVO();
							filtervo.setAttrName(filattr.getAttrName());
							filtervo.setAttrRelation(filattr.getAttrRelation());
							filtervo.setValueList(filattr.getValueList());
							filtervo.setRelationslist(prim_rel);
							finalrel_filterAttrVOList.add(filtervo);
						}
					}
				}
			}

			// KeySearchNodeVO.setOutgoingrelations(outrelList);
			// KeySearchNodeVO.setRelationsfilter(finalrel_filterAttrVOList);
			for (AttributeVO weightattr : attrVOList) {
				for (AttributeVO filterattr : filterAttrVOList) {
					if (weightattr.getAttrName().equalsIgnoreCase(
							filterattr.getAttrName())) {
						if (filterattr.getValFlag() == "1") {
							weightattr.setWeightFlag("1");
						} else {
							weightattr.setWeightFlag("2");
						}
					}

				}

			}
			for (AttributeVO weightgrpattr : attrGroupableVOList) {
				for (AttributeVO filterattr : filterAttrVOList) {
					if (weightgrpattr.getAttrName().equalsIgnoreCase(
							filterattr.getAttrName())) {
						if (filterattr.getValFlag() == "1") {
							weightgrpattr.setWeightFlag("1");
						} else {
							weightgrpattr.setWeightFlag("2");
						}
					}
				}
			}

			Collections.sort(attrVOList, new WeightComparator()); // sorting
																	// attribute
																	// list
																	// based on
																	// weight
			List<AttributeVO> attrweightfilterList = new ArrayList<AttributeVO>();
			for (AttributeVO attrList : attrVOList) {
				AttributeVO attfil = new AttributeVO();

				if (attrList.getWeightFlag() == "2") {
					attfil.setAttrName(attrList.getAttrName());
					attfil.setAttrRelation(attrList.getAttrRelation());
					attfil.setValFlag(attrList.getValFlag());
					attfil.setWeightFlag(attrList.getWeightFlag());

					attfil.getAttrName();
					attfil.getAttrRelation();
					attfil.getValFlag();
					attfil.getWeightFlag();

					attrweightfilterList.add(attfil);
					KeySearchNodeVO.setKeyAttrList(attrweightfilterList);
				} else {

					KeySearchNodeVO.setKeyAttrList(attrweightfilterList);
				}
			}

			Collections.sort(attrGroupableVOList, new WeightComparator()); // sorting
																			// groupable
																			// attribute
																			// list
																			// based
																			// on
																			// weight
			List<AttributeVO> grpableattrweightfilterList = new ArrayList<AttributeVO>();
			for (AttributeVO attrgroupableList : attrGroupableVOList) {
				AttributeVO grpableattrList = new AttributeVO();

				if (attrgroupableList.getWeightFlag() == "2") {
					grpableattrList
							.setAttrName(attrgroupableList.getAttrName());
					grpableattrList.setAttrRelation(attrgroupableList
							.getAttrRelation());
					grpableattrList.setValFlag(attrgroupableList.getValFlag());
					grpableattrList.setWeightFlag(attrgroupableList
							.getWeightFlag());

					grpableattrList.getAttrName();
					grpableattrList.getAttrRelation();
					grpableattrList.getValFlag();
					grpableattrList.getWeightFlag();

					grpableattrweightfilterList.add(grpableattrList);
					KeySearchNodeVO
							.setKeyGrpableList(grpableattrweightfilterList);
				} else {

					KeySearchNodeVO
							.setKeyGrpableList(grpableattrweightfilterList);
				}
			}

			HashMap<String, List<LinkVO>> keyObjRelMap = keynode
					.getInobjRelList();
			Set<String> relObjSet = keyObjRelMap.keySet();
			List<String> filteredLinks = new ArrayList<String>();
			Map<String, Integer> objweightmap = new HashMap<String, Integer>();
			Map<String, Integer> resultEntry = new HashMap<String, Integer>();
			String objKeyName = null;

			int insrchNodeIndex = 1;
			Set<String> filteredLinkSet = new HashSet<String>();

			for (int k = insrchNodeIndex; k < vObjList.size(); k++) {

				ObjVO sNodeObj = vObjList.get(k);

				objKeyName = sNodeObj.getPrimKey();

				int weight = sNodeObj.getObjweight();

				if (relObjSet.contains(objKeyName)) {

					// filteredLinkSet.add(objKeyName);
					if (!objweightmap.containsKey(objKeyName)) {
						objweightmap.put(objKeyName, weight);

					} else {
						if (weight > objweightmap.get(objKeyName)) {
							objweightmap.put(objKeyName, weight);

						}
					}
					Map.Entry<String, Integer> maxEntry = (Entry<String, Integer>) new HashMap<String, Integer>();
					resultEntry = new HashMap<String, Integer>();

					for (Map.Entry<String, Integer> entry : objweightmap
							.entrySet()) {
						if (maxEntry == null
								|| entry.getValue().compareTo(
										maxEntry.getValue()) > 0) {
							maxEntry = entry;
						}
					}
					for (Map.Entry<String, Integer> entry : objweightmap
							.entrySet()) {
						if (entry.getValue().compareTo(maxEntry.getValue()) >= 0) {
							resultEntry.put(entry.getKey(), entry.getValue());
						}
					}
				}

			}
			if (vObjList.size() > 1) {

				if (!relObjSet.contains(objKeyName)) {
					filteredLinks.addAll(relObjSet);
				} else {
					filteredLinkSet.addAll(resultEntry.keySet());
					filteredLinks.addAll(filteredLinkSet);

				}

			}

			if (filteredLinks.size() == 0) {
				filteredLinks.addAll(relObjSet);
			}
			List<ObjVO> searchObjectList = getSearchObjectList(keynode,
					filteredLinks, vObjList, metaObjList, srchNodeIndex);
			if (!(multipleKeyNode.size() > 1)) {
				// KeySearchNodeVO.setLinkObjects(searchObjectList);
			} else {
				searchObjectList = new ArrayList<ObjVO>();
				// KeySearchNodeVO.setLinkObjects(searchObjectList);
			}
			finalkeyvo.add(KeySearchNodeVO);
		}
		return finalkeyvo;
	}

	private void getrelations(Set<String> prim_rel, String first_prim,
			String second_prim) {

		try {
			StringEntity queryRelations = new StringEntity(BASEQUERYSTART
					+ first_prim + READLINKRELATIONQUERYA + second_prim
					+ READLINKRELATIONQUERYB);

			List<DictionaryVO> prim_relations = ReadGraphUtil
					.mapDictionaryValues(queryRelations);

			if (prim_relations != null) {
				for (DictionaryVO linkRelation : prim_relations) {
					prim_rel.add(linkRelation.getRelation());
				}
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private List<AttributeVO> getAttributeList(List<ObjVO> mObjList,
			String objKey, boolean filterFlag, boolean grpableFlag) {

		List<AttributeVO> attrVOList = null;
		for (ObjVO objVO : mObjList) {
			if (objVO.getPrimKey().equalsIgnoreCase(objKey)) {
				if (!grpableFlag) { // if grpableFlag is false, add attribute
									// list
					attrVOList = objVO.getAttrVOList();
				} else { // if grpableFlag is true, add groupable attribute list
					attrVOList = objVO.getGrpableAttrVOList();
				}
				if (filterFlag) {
					attrVOList = getFilteredAttributeList(attrVOList);
				}

				break;
			}
		}
		return attrVOList;

	}

	private List<AttributeVO> getFilteredAttributeList(
			List<AttributeVO> attrVOList) {

		List<AttributeVO> fAttrVOList = new ArrayList<AttributeVO>();

		for (AttributeVO attrVO : attrVOList) {
			if (attrVO.getAttrFlag().equalsIgnoreCase("1")) {
				AttributeVO nAttrVO = new AttributeVO();
				nAttrVO.setAttrName(attrVO.getAttrName());
				nAttrVO.setAttrRelation(attrVO.getAttrRelation());

				Set<String> valueStrList = new HashSet<String>();
				valueStrList.add(attrVO.getAttrValue());

				nAttrVO.setValueList(valueStrList);
				fAttrVOList.add(nAttrVO);
			}
		}

		return fAttrVOList;

	}

	private List<ObjVO> getSearchoutrelList(ObjVO keyNodeObj,
			Set<String> outrelobjjSet, List<ObjVO> vObjList,
			List<ObjVO> metaObjList) {
		List<ObjVO> outrelobjList = new ArrayList<ObjVO>();
		HashMap<String, List<LinkVO>> outrelObjMap = keyNodeObj
				.getOutobjRelList();
		List<String> outdefaultfilteredobjrelations = null;
		List<String> outdefaultdefilteredobjrelations = null;
		List<String> outfilteredobjrelations = new ArrayList<String>();
		List<String> outdefilteredobjrelations = new ArrayList<String>();
		int srchNodeIndex = 1;
		for (String objLink : outrelobjjSet) {
			outdefaultfilteredobjrelations = new ArrayList<String>();
			outdefaultdefilteredobjrelations = new ArrayList<String>();
			ObjVO objVO = new ObjVO();
			List<LinkVO> linkVOList = outrelObjMap.get(objLink);
			for (LinkVO linkVO : linkVOList) {

				String linkType = linkVO.getLinkName();
				if (linkVO.getLinkFlag().equalsIgnoreCase("1")) {
					outdefaultfilteredobjrelations.add(linkType);
				} else {
					outdefaultdefilteredobjrelations.add(linkType);
				}

			}

			if (outdefaultfilteredobjrelations.size() == 0) {
				outdefaultfilteredobjrelations
						.addAll(outdefaultdefilteredobjrelations);
			}
			for (int j = srchNodeIndex; j < vObjList.size(); j++) {

				ObjVO secNodeObj = vObjList.get(j);
				HashMap<String, List<LinkVO>> firstoutrelObjMap = secNodeObj
						.getOutobjRelList();
				Set<String> firstoutrelobjjSet = firstoutrelObjMap.keySet();
				for (String firstobjLink : firstoutrelobjjSet) {

					if (objLink.equalsIgnoreCase(firstobjLink)) {
						List<LinkVO> firstlinkVOList = firstoutrelObjMap
								.get(firstobjLink);
						objVO.setPrimKey(firstobjLink);
						for (LinkVO linkVO : firstlinkVOList) {
							String linkType = linkVO.getLinkName();
							if (linkVO.getLinkFlag().equalsIgnoreCase("1")) {
								outfilteredobjrelations.add(linkType);
							} else {
								outdefilteredobjrelations.add(linkType);
							}
						}

						if (outfilteredobjrelations.size() == 0) {
							outfilteredobjrelations
									.addAll(outdefilteredobjrelations);
						}
						objVO.setObjLinks(outfilteredobjrelations);
					}
				}
				srchNodeIndex = srchNodeIndex + 1;
			}

			if (srchNodeIndex == 1) {
				objVO.setPrimKey(objLink);
				objVO.setObjLinks(outdefaultfilteredobjrelations);
			}
			outrelobjList.add(objVO);
		}

		return outrelobjList;

	}

	private List<ObjVO> getSearchObjectList(ObjVO keyNodeObj,
			List<String> filteredLinks, List<ObjVO> vObjList,
			List<ObjVO> metaObjList, int srchNdIndex) {

		List<ObjVO> searchObjList = new ArrayList<ObjVO>();
		List<ObjVO> linkObjList = new ArrayList<ObjVO>();
		HashMap<String, List<LinkVO>> linkObjMap = keyNodeObj.getInobjRelList();

		List<String> crtfilteredLinkTypes = new ArrayList<String>();
		List<String> filteredLinkTypes = new ArrayList<String>();

		for (String objLink : filteredLinks) {

			ObjVO objVO = new ObjVO();

			List<LinkVO> linkVOList = linkObjMap.get(objLink);

			int inusrchNodeIndex = 1;
			for (int k = inusrchNodeIndex; k < vObjList.size(); k++) {
				ObjVO sNodeObj = vObjList.get(k);

				HashMap<String, List<LinkVO>> innlinkObjMap = sNodeObj
						.getInobjRelList();

				if (sNodeObj.getInobjRelList().size() != 0) {

					List<LinkVO> innlinkVOList = innlinkObjMap.get(objLink);
					if (innlinkVOList != null)
						crtfilteredLinkTypes = processLinkType(innlinkVOList);
					else {
						filteredLinkTypes = processLinkType(linkVOList);
					}
				} else {

					filteredLinkTypes = processLinkType(linkVOList);
				}

			}

			// System.out.println("filter$$$$$$$$$$$$$$"+filteredLinkTypes);
			// System.out.println("crt^^^^^^^^"+crtfilteredLinkTypes);
			if (crtfilteredLinkTypes.size() == 0) {
				// System.out.println("equal; to zero");
				objVO.setPrimKey(objLink);
				objVO.setObjLinks(filteredLinkTypes);
			} else {
				// System.out.println("equal; to zero else");
				objVO.setPrimKey(objLink);
				objVO.setObjLinks(crtfilteredLinkTypes);
			}
			/*for (int v = 0; v < vObjList.size(); v++) {
				logger.error("vo size@@@@@@@@@@@@@@" + vObjList.size()
						+ vObjList.get(v).getPrimKey());
			}*/

			if (vObjList.size() == 1) {
				// System.out.println("size 111111111111");

				filteredLinkTypes = processLinkType(linkVOList);
				objVO.setPrimKey(objLink);
				objVO.setObjLinks(filteredLinkTypes);
			}
			// System.out.println("linkkkkkkkkkkkkk"+objVO.getObjLinks());
			/*
			 * List<String> filteredLinkTypes = processLinkType(linkVOList);
			 * objVO.setObjLinks(filteredLinkTypes);
			 */

			List<AttributeVO> linkAttrVOList = getAttributeList(metaObjList,
					objLink, false, false); // get attribute list for groupable
											// false
			objVO.setAttrVOList(linkAttrVOList);

			// add the attributes in link objects which are having groupable
			// value as true only

			List<AttributeVO> linkGrpableAttrVOList = getAttributeList(
					metaObjList, objLink, false, true); // get attribute list
														// for groupable true
			objVO.setGrpableAttrVOList(linkGrpableAttrVOList);

			List<AttributeVO> filterAttrVOList = new ArrayList<AttributeVO>();

			for (int k = srchNdIndex; k < vObjList.size(); k++) {
				ObjVO searchFilterObj = vObjList.get(k);
				if (searchFilterObj.getPrimKey().equalsIgnoreCase(objLink)) {
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList,
							searchFilterObj.getGrpableAttrVOList());
					filterAttrVOList = updateFilterAttributeList(
							filterAttrVOList, searchFilterObj.getAttrVOList());

					// filterAttrVOList =
					// updatePrimaryKeyFilter(filterAttrVOList,searchFilterObj);
				}
			}

			objVO.setAttrFilterList(filterAttrVOList);

			searchObjList.add(objVO);
		}
		for (ObjVO templinklist : searchObjList) {
			ObjVO obj = new ObjVO();
			if (!templinklist.getPrimKey().equalsIgnoreCase(
					keyNodeObj.getPrimKey())) {
				obj.setPrimKey(templinklist.getPrimKey());
				obj.setAttrVOList(templinklist.getAttrVOList());
				obj.setGrpableAttrVOList(templinklist.getGrpableAttrVOList());
				obj.setAttrFilterList(templinklist.getAttrFilterList());
				obj.setObjLinks(templinklist.getObjLinks());
				linkObjList.add(obj);
			}
		}
		return linkObjList;
	}

	private List<String> processLinkType(List<LinkVO> linkVOList) {
		List<String> filteredLinkTypes = new ArrayList<String>();
		List<String> defFilteredLinkTypes = new ArrayList<String>();

		for (LinkVO linkVO : linkVOList) {

			String linkType = linkVO.getLinkName();
			if (linkVO.getLinkFlag().equalsIgnoreCase("1")) {
				filteredLinkTypes.add(linkType);
			} else {
				defFilteredLinkTypes.add(linkType);
			}
		}

		if (filteredLinkTypes.size() == 0) {

			filteredLinkTypes.addAll(defFilteredLinkTypes);
		}

		return filteredLinkTypes;
	}

	private List<AttributeVO> updateFilterAttributeList(
			List<AttributeVO> filterAttrVOList, List<AttributeVO> attrVOList) {

		for (AttributeVO attrVO : attrVOList) {

			if (attrVO.getAttrFlag().equalsIgnoreCase("1")) {

				String attrName = attrVO.getAttrName();

				int attrFilterPrescenseIndex = getAttrFilterIndex(
						filterAttrVOList, attrName);
				if (attrFilterPrescenseIndex == -1) {
					if (!attrName.equalsIgnoreCase("User")) {
						AttributeVO iAttrVO = new AttributeVO();
						iAttrVO.setAttrName(attrName);
						iAttrVO.setAttrRelation(attrVO.getAttrRelation());
						iAttrVO.setAttrFlag(attrVO.getAttrFlag());
						iAttrVO.setValFlag(attrVO.getValFlag());

						Set<String> valueStrList = new HashSet<String>();
						valueStrList.add(attrVO.getAttrValue());

						iAttrVO.setValueList(valueStrList);

						filterAttrVOList.add(iAttrVO);
					}
				} else {

					AttributeVO iAttrVO = filterAttrVOList
							.get(attrFilterPrescenseIndex);
					Set<String> valueStrList = iAttrVO.getValueList();
					valueStrList.add(attrVO.getAttrValue());
					filterAttrVOList.get(attrFilterPrescenseIndex)
							.setValueList(valueStrList);
				}

			}
		}

		return filterAttrVOList;
	}

	private List<AttributeVO> updateFilterRelList(
			List<AttributeVO> filterAttrVOList, List<AttributeVO> attrVOList) {

		for (AttributeVO attrVO : attrVOList) {

			if (attrVO.getAttrFlag().equalsIgnoreCase("1")) {

				String attrName = attrVO.getAttrName();

				int attrFilterPrescenseIndex = getAttrFilterIndex(
						filterAttrVOList, attrName);
				if (attrFilterPrescenseIndex == -1) {

					AttributeVO iAttrVO = new AttributeVO();
					iAttrVO.setAttrName(attrName);
					iAttrVO.setAttrRelation(attrVO.getAttrRelation());
					iAttrVO.setAttrFlag(attrVO.getAttrFlag());
					iAttrVO.setValFlag(attrVO.getValFlag());

					Set<String> valueStrList = new HashSet<String>();

					if (!attrVO.getAttrValue().equalsIgnoreCase("")) {
						valueStrList.add(attrVO.getAttrValue());

						iAttrVO.setValueList(valueStrList);
						filterAttrVOList.clear();

						filterAttrVOList.add(iAttrVO);
					}

				} else {

					AttributeVO iAttrVO = filterAttrVOList
							.get(attrFilterPrescenseIndex);
					Set<String> valueStrList = iAttrVO.getValueList();
					valueStrList.add(attrVO.getAttrValue());
					filterAttrVOList.get(attrFilterPrescenseIndex)
							.setValueList(valueStrList);
				}

			}
		}

		return filterAttrVOList;
	}

	private void updatefilteredrel(Set<String> filtered_rel,
			List<AttributeVO> grpableAttrVOList) {
		for (AttributeVO attrVO : grpableAttrVOList) {
			if (attrVO.getAttrFlag().equalsIgnoreCase("1")) {
				String relname = attrVO.getAttrRelation();
				filtered_rel.add(relname);

			}
		}
		// TODO Auto-generated method stub

	}

	public int getAttrFilterIndex(List<AttributeVO> fAttrVOList,
			String attrName) {
		int attrFilterIndex = -1;
		for (int i = 0; i < fAttrVOList.size(); i++) {
			AttributeVO attrVO = fAttrVOList.get(i);
			if (attrVO.getAttrName().equalsIgnoreCase(attrName)) {
				attrFilterIndex = i;
			}
		}
		return attrFilterIndex;
	}

	/*
	 * private List<AttributeVO> updatePrimaryKeyFilter(List<AttributeVO>
	 * fAttrVOList,ObjVO objVO){
	 * 
	 * if(!objVO.getPrimValue().equalsIgnoreCase("")){ int primKeyFlag = 0;
	 * for(int j=0;j<fAttrVOList.size();j++){ AttributeVO attrVO =
	 * fAttrVOList.get(j);
	 * if(attrVO.getAttrName().equalsIgnoreCase("prim_key")){ List<String>
	 * keyValues = fAttrVOList.get(j).getValueList();
	 * keyValues.add(objVO.getPrimValue());
	 * fAttrVOList.get(j).setValueList(keyValues); primKeyFlag=1; break; } }
	 * if(primKeyFlag==0){ AttributeVO primAttrVO = new AttributeVO();
	 * primAttrVO.setAttrName("prim_key"); List<String> keyValues = new
	 * ArrayList<String>(); keyValues.add(objVO.getPrimValue());
	 * primAttrVO.setValueList(keyValues); fAttrVOList.add(primAttrVO); } }
	 * return fAttrVOList; }
	 */
}