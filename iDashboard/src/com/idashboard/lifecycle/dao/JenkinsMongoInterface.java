package com.idashboard.lifecycle.dao;

import java.util.List;

import com.idashboard.lifecycle.vo.BuildJobsVO;
import com.idashboard.lifecycle.vo.BuildListVO;
import com.idashboard.lifecycle.vo.BuildTotalVO;

public interface JenkinsMongoInterface {

	public List<BuildJobsVO> Jenkins_ExecuteQuery_GetBuildJobs();
	
	public List<BuildTotalVO> Jenkins_ExecuteQuery_GetBuildPeryDay(String AppName);
	
	public List<BuildTotalVO> Jenkins_ExecuteQuery_GetTotalBuild(String AppName);
	
	public List<BuildListVO> Jenkins_ExecuteQuery_GetLatestBuild(String AppName);
	
	public List<BuildTotalVO> Jenkins_ExecuteQuery_GetAverageBuildDuration(String AppName);
	
	public List<BuildJobsVO> buildJobs( String authString);
}
