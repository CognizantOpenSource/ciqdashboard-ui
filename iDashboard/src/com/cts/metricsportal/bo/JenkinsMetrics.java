package com.cts.metricsportal.bo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;
import com.cts.metricsportal.dao.JenkinsMongoOperations;
import com.cts.metricsportal.util.BaseException;


public class JenkinsMetrics implements IBMTMetrics  {
	
	 static final Logger logger = Logger.getLogger(JenkinsMetrics.class);
	
	@Override
    public List<BuildTotalVO> getbuildperday(String AppName) {
        
		
		List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=JenkinsMongoOperations.Jenkins_ExecuteQuery_GetBuildPeryDay(AppName);
    	return list;
    }

    @Override
    public List<BuildListVO> getlatestbuild(String AppName) {
    	
    	
    	List<BuildListVO> list = new ArrayList<BuildListVO>();
    	list=JenkinsMongoOperations.Jenkins_ExecuteQuery_GetLatestBuild(AppName);
    	return list;
    	
    }

    @Override
    public List<BuildTotalVO> gettotalbuild(String AppName) {
    	
    	
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=JenkinsMongoOperations.Jenkins_ExecuteQuery_GetTotalBuild(AppName);
    	return list;
    }
    
    @Override
    public List<BuildTotalVO> getaveragebuildduration(String AppName) {
    	
    	
    	List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
    	list=JenkinsMongoOperations.Jenkins_ExecuteQuery_GetAverageBuildDuration(AppName);
    	return list;
    }
    
    @Override
    public List<BuildJobsVO> getbuildjobs() {
   
    	
    	List<BuildJobsVO> buildJobList = new ArrayList<BuildJobsVO>() ;
    	buildJobList=JenkinsMongoOperations.Jenkins_ExecuteQuery_GetBuildJobs();
    	return buildJobList;
    	
    }
    
    
    
   
    
    
}

