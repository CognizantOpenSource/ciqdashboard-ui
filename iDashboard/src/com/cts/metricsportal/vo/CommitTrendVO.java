package com.cts.metricsportal.vo;

import java.util.Date;

public class CommitTrendVO {
	private Date commitdate;
	private Date startdate;
	private int count;
	
	public CommitTrendVO(Date startdate, int count)
	  {
	    this.startdate = startdate;
	    this.count = count;
	  }
	public CommitTrendVO() {
		// TODO Auto-generated constructor stub
	}

	  public Date getCommitdate() {
		return commitdate;
	}
	public void setCommitdate(Date commitdate) {
		this.commitdate = commitdate;
	}
	public Date getStartdate() {
		return startdate;
	}
	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
	  
	  
	 
}
