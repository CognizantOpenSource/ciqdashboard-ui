package com.idashboard.lifecycle.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.util.BaseException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idashboard.lifecycle.service.CodeQualityService;
import com.idashboard.lifecycle.service.SASTService;
import com.idashboard.lifecycle.serviceImpl.CodeQualityServiceImpl;
import com.idashboard.lifecycle.serviceImpl.SASTServiceImpl;
import com.idashboard.lifecycle.vo.FortifyVO;

@Path("/SASTController")
public class SASTController {
	
	
	SASTService sastService = new SASTServiceImpl();
	
	
	@GET
	@Path("/fortifyprojectdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getFortifyProjectDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<String> projectcoll = null;

		projectcoll = sastService.getFortifyProjectDetails(authString);
		
		return projectcoll;

	}


	@GET
	@Path("/fortifyversiondetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getFortifyVersionDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> versioncoll = null;
		
		versioncoll = sastService.getVersionDetails(selectedFortifyProject,authString);
		return versioncoll;

	}

	@GET
	@Path("/fortifyHomeMetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Integer> getFortifyHomeMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject,
			@QueryParam("selectedFortifyVersion") String selectedFortifyVersion) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		
		List<Integer> fortifyHomeDetails = new ArrayList<Integer>();
		fortifyHomeDetails = sastService.getFortifyHomeMetrics(selectedFortifyProject,selectedFortifyVersion,authString);
		
		return fortifyHomeDetails;

	}
		
	@GET
	@Path("/fortifyMetrics")
	@Produces(MediaType.APPLICATION_JSON)
	public List<FortifyVO> getFortifyMetrics(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject,
			@QueryParam("selectedFortifyVersion") String selectedFortifyVersion) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		
		fortifyDetails = sastService.getFortifyMetrics(selectedFortifyProject,selectedFortifyVersion,authString);
		
		return fortifyDetails;

	}
	
	@GET
	@Path("/fortifyLast3VersionChart")
	@Produces(MediaType.APPLICATION_JSON)
	public List<FortifyVO> getFortifyLast3VersionChart(@HeaderParam("Authorization") String authString,
			@QueryParam("selectedFortifyProject") String selectedFortifyProject) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();

		fortifyDetails = sastService.getFortifyLast3VersionChart(authString, selectedFortifyProject);
		return fortifyDetails;

	}

	
	
	
}
