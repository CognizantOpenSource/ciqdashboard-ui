package com.idashboard.lifecycle.service;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.util.BaseException;
import com.idashboard.lifecycle.vo.OctaneDataVO;

public interface OctaneService {

	List<String> getOctaneProjectDetails(String authString) throws JsonParseException, JsonMappingException, NumberFormatException, BaseException, IOException, BadLocationException;

	public List<String> getOctaneCurrentSprint(String authString,String dashboardName,String workspaceName) throws IOException, BadLocationException;

	long getDaysLeftInSprint(String authString, String dashboardName, String workspaceName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	long getBacklogCount(String authString, String dashboardName, String workspaceName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getSprintStatus(String authString, String dashboardName, String workspaceName, String sprintSel) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getSprintVelocity(String authString, String dashboardName, String workspaceName,
			String sprintSel) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getHourInvested(String authString, String dashboardName, String workspaceName, String sprintSel) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getOctaneDefectSeveritychart(String authString, String dashboardName, String workspaceName,
			String sprintSel) throws ParseException, JsonParseException, JsonMappingException, IOException;

	List<Long> getOctaneDefectStatusChart(String authString, String dashboardName, String workspaceName,
			String sprintSel) throws ParseException, JsonMappingException, IOException;

	List<OctaneDataVO> getOctaneDefectPrioritychart(String authString, String dashboardName, String workspaceName,
			String sprintSel) throws ParseException, JsonParseException, JsonMappingException, IOException, BadLocationException;
}
