package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;

public interface ITMMetrics {
	
	public long getRequirementCountFilter(String authString, String dashboardName, String domainName, String projectName, String vardtfrom, String vardtto, String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException ;
	
	public long getRequirementVolatilityFilter(String authString,String dashboardName,String domainName, String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException;
	
	public long getRequirementLeakFilter(String authString,String dashboardName,String domainName,String projectName, String vardtfrom,String vardtto,String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException,BaseException, BadLocationException, ParseException;

	//ALM Metrics
	public long getTotalDefectCountFilter(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public List<DefectStatusVO> getDefectbardashchart(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public long getTotalDefectCountinitial(String authString, String dashboardName, String domainName,
			String projectName, String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public long getTotalTestCountFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public long getDesignCoverageFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public long getAutoCoverageFilter(String authString, String dashboardName, String domainName, String projectName,
			String vardtfrom, String vardtto, String timeperiod) throws ParseException;
	
	public long getTcCount(String authString,String dashboardName,String domainName,String projectName,String vardtfrom, String vardtto,String timeperiod) throws JsonParseException, JsonMappingException,
	IOException,NumberFormatException, BaseException, BadLocationException, ParseException;
	
}
