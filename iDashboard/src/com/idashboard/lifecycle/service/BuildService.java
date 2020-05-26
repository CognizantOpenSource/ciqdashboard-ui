package com.idashboard.lifecycle.service;

import java.util.List;

import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;

public interface BuildService {

	public List<BuildTotalVO> getBuildPerDay(String AppName);
	
	public List<BuildListVO> getLatestBuild(String AppName);
	
	public List<BuildTotalVO> getTotalBuild(String AppName);
	
	public List<BuildTotalVO> getAverageBuildDuration(String AppName);
	
	public List<BuildJobsVO> getBuildJobs();
}
