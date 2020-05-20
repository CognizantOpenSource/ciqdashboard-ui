package com.cognizant.qbot.graph.vo;

import java.util.List;

import com.cognizant.qbot.vo.DependencyVO;
import com.cognizant.qbot.vo.GenAggregationVO;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;


@JsonInclude(value=Include.NON_NULL)
public class KeySearchNodeVO {
		
	private String keyNode;
	private List<AttributeVO> keyAttrList;
	private List<AttributeVO> keyGrpableList;
	private List<AttributeVO> keyAttrFilter;
	
	private List<ObjVO> linkObjects;
	private List<ObjVO> Outgoingrelations;
	private List<FilterVO> Relationsfilter;
	private GenAggregationVO aggregation;
	
	public List<AttributeVO> getKeyAttrList() {
		return keyAttrList;
	}

	public void setKeyAttrList(List<AttributeVO> keyAttrList) {
		this.keyAttrList = keyAttrList;
	}

	public List<ObjVO> getLinkObjects() {
		return linkObjects;
	}

	public void setLinkObjects(List<ObjVO> linkObjects) {
		this.linkObjects = linkObjects;
	}

	
	public String getKeyNode() {
		return keyNode;
	}

	public void setKeyNode(String keyNode) {
		this.keyNode = keyNode;
	}


	public List<AttributeVO> getKeyAttrFilter() {
		return keyAttrFilter;
	}

	public void setKeyAttrFilter(List<AttributeVO> keyAttrFilter) {
		this.keyAttrFilter = keyAttrFilter;
	}

	public List<AttributeVO> getKeyGrpableList() {
		return keyGrpableList;
	}

	public void setKeyGrpableList(List<AttributeVO> keyGrpableList) {
		this.keyGrpableList = keyGrpableList;
	}

	public List<ObjVO> getOutgoingrelations() {
		return Outgoingrelations;
	}

	public void setOutgoingrelations(List<ObjVO> outgoingrelations) {
		Outgoingrelations = outgoingrelations;
	}

	public List<FilterVO> getRelationsfilter() {
		return Relationsfilter;
	}

	public void setRelationsfilter(List<FilterVO> relationsfilter) {
		Relationsfilter = relationsfilter;
	}

	public GenAggregationVO getAggregation() {
		return aggregation;
	}

	public void setAggregation(GenAggregationVO aggregation) {
		this.aggregation = aggregation;
	}

	
	


}
