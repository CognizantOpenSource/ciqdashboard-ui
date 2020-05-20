package com.cts.metricsportal.vo;

import java.util.Date;

public class TestCaseTrendVO {
	
	private String testCreationDate;
	private long count;
	private Date isodate;
	private int importedCnt = 0;
	private int stableCnt = 0;
	private int readyCnt = 0;
	private int designCnt = 0;
	private int repairCnt = 0;
	private int nostatus = 0;
	
	
	public Date getIsodate() {
		return isodate;
	}
	public void setIsodate(Date isodate) {
		this.isodate = isodate;
	}
	public String getTestCreationDate() {
		return testCreationDate;
	}
	public void setTestCreationDate(String testCreationDate) {
		this.testCreationDate = testCreationDate;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public int getImportedCnt() {
		return importedCnt;
	}
	public void setImportedCnt(int importedCnt) {
		this.importedCnt = importedCnt;
	}
	public int getStableCnt() {
		return stableCnt;
	}
	public void setStableCnt(int stableCnt) {
		this.stableCnt = stableCnt;
	}
	public int getReadyCnt() {
		return readyCnt;
	}
	public void setReadyCnt(int readyCnt) {
		this.readyCnt = readyCnt;
	}
	public int getDesignCnt() {
		return designCnt;
	}
	public void setDesignCnt(int designCnt) {
		this.designCnt = designCnt;
	}
	public int getRepairCnt() {
		return repairCnt;
	}
	public void setRepairCnt(int repairCnt) {
		this.repairCnt = repairCnt;
	}
	public int getNostatus() {
		return  nostatus ;
	}
	public void setNostatus(int  nostatus ) {
		this. nostatus  =  nostatus ;
	}
	
	

}
