package com.idashboard.lifecycle.serviceImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.cts.metricsportal.bo.LayerAccess;
import com.idashboard.lifecycle.dao.FortifyMongoInterface;
import com.idashboard.lifecycle.daoImpl.FortifyMongoOperationImpl;
import com.idashboard.lifecycle.service.SASTService;
import com.idashboard.lifecycle.vo.CodeAnalysisVO;
import com.idashboard.lifecycle.vo.FortifyVO;

public class SASTServiceImpl implements SASTService{

	FortifyMongoInterface fortifyOperation =new FortifyMongoOperationImpl();
	
	@Override
	public List<String> getFortifyProjectDetails(String authString) {
		
		List<String> projectList = new ArrayList<String>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			projectList = fortifyOperation.Fortify_ExecuteQuery_getProjectNames();
		}
		return projectList;
	}

	@Override
	public List<String> getVersionDetails(String selectedFortifyProject,String authString) {
		
		List<String> versionDetails= null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			versionDetails = fortifyOperation.Fortify_ExecuteQuery_getVersionDetails(selectedFortifyProject);
		}
		
		return versionDetails;
	}
	
	@Override
	public List<Integer> getFortifyHomeMetrics(String selectedFortifyProject, String selectedFortifyVersion, String authString){
		
		List<Integer> getHomeMetrics =null;
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			getHomeMetrics = fortifyOperation.Fortify_ExecuteQuery_getFortifyHomeMetrics(selectedFortifyProject, selectedFortifyVersion);
		}
		return getHomeMetrics;
		
	}

	@Override
	public List<FortifyVO> getFortifyMetrics(String selectedFortifyProject, String selectedFortifyVersion,
			String authString) {
		
		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			fortifyDetails = fortifyOperation.Fortify_ExecuteQuery_getFortifyMetrics(selectedFortifyProject,selectedFortifyVersion);
		}
		return fortifyDetails;
	}

	@Override
	public List<FortifyVO> getFortifyLast3VersionChart(String authString, String selectedFortifyProject) {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			fortifyDetails = fortifyOperation.Fortify_ExecuteQuery_getFortifyLast3VersionChart(selectedFortifyProject);
		}
		Collections.sort(fortifyDetails, new Comparator<FortifyVO>() {
			public int compare(FortifyVO m1, FortifyVO m2) {
				return m1.getVersions().get(0).getVersionCreationDate()
						.compareTo(m2.getVersions().get(0).getVersionCreationDate());
			}
		});
		return fortifyDetails;
	}
}
