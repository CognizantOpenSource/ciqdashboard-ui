package com.cts.metricsportal.vo;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cookbookruns") 
public class ChefRunsNodeVO {
	private long count;
	private String nodename = null;
	private int nodeCnt=0;
	private Date creationTime;
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getNodename() {
		return nodename;
	}
	public void setNodename(String nodename) {
		this.nodename = nodename;
	}
	public int getNodeCnt() {
		return nodeCnt;
	}
	public void setNodeCnt(int nodeCnt) {
		this.nodeCnt = nodeCnt;
	}
	public Date getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
}
