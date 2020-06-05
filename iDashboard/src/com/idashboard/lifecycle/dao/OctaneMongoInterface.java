package com.idashboard.lifecycle.dao;

import java.io.IOException;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.util.BaseException;
import com.idashboard.lifecycle.vo.OctaneDataVO;

public interface OctaneMongoInterface {

	List<String> getOctaneProjectDetails() throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<String> getOctaneCurrentSprint(String workspaceName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getOctaneDefectPrioritychart(String dashboardName, String userId, String workspaceName,
			String sprintSelected) throws NumberFormatException, BaseException, BadLocationException, JsonParseException, JsonMappingException, IOException;

	List<Long> getOctaneDefectStatusChart(String dashboardName, String userId, String workspaceName,
			String octaneSprintId) throws NumberFormatException, BaseException, BadLocationException, JsonParseException, JsonMappingException, IOException;

	List<OctaneDataVO> getOctaneDefectSeveritychart(String dashboardName, String userId, String workspaceName,
			String sprintSelected) throws NumberFormatException, BaseException, BadLocationException, JsonParseException, JsonMappingException, IOException;

	long getOctaneDefectCount(String dashboardName, String userId, String workspaceName, String octaneSprintId) throws NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getHourInvested(String dashboardName, String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getSprintVelocity(String dashboardName, String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	List<OctaneDataVO> getSprintStatus(String dashboardName, String workspaceName, String sprintSelected) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	long getBacklogCount(String dashboardName, String workspaceName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

	long getDaysLeftInSprint(String dashboardName, String workspaceName) throws JsonParseException, JsonMappingException, NumberFormatException, BaseException, IOException, BadLocationException;

}
