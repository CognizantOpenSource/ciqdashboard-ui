package com.idashboard.lifecycle.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.cts.metricsportal.bo.JenkinsMetrics;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;
import com.idashboard.lifecycle.dao.BuildMongoOperation;

public class BuildServiceImpl implements BuildService {

	BuildMongoOperation buildOperation = new BuildMongoOperation();
	static final Logger logger = Logger.getLogger(JenkinsMetrics.class);
	
	@Override
    public List<BuildTotalVO> getBuildPerDay(String AppName) {
        
		
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=buildOperation.Jenkins_ExecuteQuery_GetBuildPeryDay(AppName);
    	return list;
    }

    @Override
    public List<BuildListVO> getLatestBuild(String AppName) {
    	
    	
    	List<BuildListVO> list = new ArrayList<BuildListVO>();
    	list=buildOperation.Jenkins_ExecuteQuery_GetLatestBuild(AppName);
    	return list;
    	
    }

    @Override
    public List<BuildTotalVO> getTotalBuild(String AppName) {
    	
    	
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=buildOperation.Jenkins_ExecuteQuery_GetTotalBuild(AppName);
    	return list;
    }
    
    @Override
    public List<BuildTotalVO> getAverageBuildDuration(String AppName) {
    	
    	
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=buildOperation.Jenkins_ExecuteQuery_GetAverageBuildDuration(AppName);
    	return list;
    }
    
    @Override
    public List<BuildJobsVO> getBuildJobs() {
   
    	
    	List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
    	buildJobList=buildOperation.Jenkins_ExecuteQuery_GetBuildJobs();
    	return buildJobList;
    	
    }
    
}
