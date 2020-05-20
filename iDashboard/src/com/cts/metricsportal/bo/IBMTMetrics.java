package com.cts.metricsportal.bo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;

interface IBMTMetrics {
	
	//Map<String, String> fieldValuePairMap = new HashMap<String, String>();

	public List<BuildTotalVO> getbuildperday(String AppName);
	public List<BuildListVO> getlatestbuild(String AppName);
	public List<BuildTotalVO> gettotalbuild(String AppName);
	public List<BuildTotalVO> getaveragebuildduration(String AppName);
	public List<BuildJobsVO> getbuildjobs();
	
	
	
	
}
