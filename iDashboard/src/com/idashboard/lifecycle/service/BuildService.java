package com.idashboard.lifecycle.service;

import java.util.List;

import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;

public interface BuildService {

	public List<BuildTotalVO> getBuildPerDay(String authString ,String AppName);
	
	public List<BuildListVO> getLatestBuild(String authString ,String AppName);
	
	public List<BuildTotalVO> getTotalBuild(String authString ,String AppName);
	
	public List<BuildTotalVO> getAverageBuildDuration(String authString ,String AppName);
	
	public List<BuildJobsVO> getBuildJobs(String authString);
}
