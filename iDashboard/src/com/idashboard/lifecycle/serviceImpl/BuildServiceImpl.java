package com.idashboard.lifecycle.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import com.cts.metricsportal.bo.LayerAccess;

import com.idashboard.lifecycle.dao.JenkinsMongoInterface;
import com.idashboard.lifecycle.daoImpl.JenkinsMongoOperationImpl;
import com.idashboard.lifecycle.service.BuildService;
import com.idashboard.lifecycle.vo.BuildJobsVO;
import com.idashboard.lifecycle.vo.BuildListVO;
import com.idashboard.lifecycle.vo.BuildTotalVO;

public class BuildServiceImpl implements BuildService {

	JenkinsMongoInterface jenkinsOperation = new JenkinsMongoOperationImpl();
	static final Logger logger = Logger.getLogger(BuildServiceImpl.class);
	
	@Override
    public List<BuildTotalVO> getBuildPerDay(String authString, String AppName) {
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
		if (authenticateToken) {
			list=jenkinsOperation.Jenkins_ExecuteQuery_GetBuildPeryDay(AppName);
		}
		return list;
    }

    @Override
    public List<BuildListVO> getLatestBuild(String authString,String AppName) {
    	
    	boolean authenticateToken = LayerAccess.authenticateToken(authString);
    	List<BuildListVO> list = new ArrayList<BuildListVO>();
    	if (authenticateToken) {
    		list=jenkinsOperation.Jenkins_ExecuteQuery_GetLatestBuild(AppName);
    	}
    	
    	return list;
    	
    }

    @Override
    public List<BuildTotalVO> getTotalBuild(String authString, String AppName) {
    	
    	boolean authenticateToken = LayerAccess.authenticateToken(authString);
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	if(authenticateToken) {
    		list=jenkinsOperation.Jenkins_ExecuteQuery_GetTotalBuild(AppName);
    	}
    	
    	return list;
    }
    
    @Override
    public List<BuildTotalVO> getAverageBuildDuration(String authString, String AppName) {
    	boolean authenticateToken = LayerAccess.authenticateToken(authString);
    	
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	if(authenticateToken) {
    		list=jenkinsOperation.Jenkins_ExecuteQuery_GetAverageBuildDuration(AppName);
    	}
    	
    	return list;
    }
    
    @Override
    public List<BuildJobsVO> getBuildJobs(String authString) {
   
    	boolean authenticateToken = LayerAccess.authenticateToken(authString);
    	
    	List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>();
    	if(authenticateToken) {
    		buildJobList=jenkinsOperation.Jenkins_ExecuteQuery_GetBuildJobs();
    	}
    	return buildJobList;
    	
    }
}
