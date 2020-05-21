package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "ALMRequirements") 
public class RequirmentVO {
	private String _id;
	private int levelid;
	private int reqID;
	private String reqName;
	private String releaseName;
	private String reqType;
	private String description;
	private String status;
	private Date lastModified;
	private String priority;
	private Date creationTime;
	private long count;
	List<LevelItemsVO> duplication =  new ArrayList<LevelItemsVO>();

	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public List<LevelItemsVO> getDuplication() {
		return duplication;
	}
	public void setDuplication(List<LevelItemsVO> duplication) {
		this.duplication = duplication;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public Date getLastModified() {
		return lastModified;
	}
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	public int getLevelid() {
		return levelid;
	}
	public void setLevelid(int levelid) {
		this.levelid = levelid;
	}
	public int getReqID() {
		return reqID;
	}
	public void setReqID(int reqID) {
		this.reqID = reqID;
	}
	public String getReqName() {
		return reqName;
	}
	public void setReqName(String reqName) {
		this.reqName = reqName;
	}
	public String getReqType() {
		return reqType;
	}
	public void setReqType(String reqType) {
		this.reqType = reqType;
	}
	public String getDescription() {
		try{
			 description.replaceAll("\\<.*?>","");}
			catch(Exception e){
				}
			return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getReleaseName() {
		return releaseName;
	}
	public void setReleaseName(String releaseName) {
		this.releaseName = releaseName;
	}
}
