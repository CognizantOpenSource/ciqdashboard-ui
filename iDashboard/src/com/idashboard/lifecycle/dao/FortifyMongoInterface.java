package com.idashboard.lifecycle.dao;

import java.util.List;

import com.idashboard.lifecycle.vo.FortifyVO;

public interface FortifyMongoInterface {
	
	public List<String> Fortify_ExecuteQuery_getProjectNames();

	public List<String> Fortify_ExecuteQuery_getVersionDetails(String selectedFortifyProject);

	public List<Integer> Fortify_ExecuteQuery_getFortifyHomeMetrics(String selectedFortifyProject,
			String selectedFortifyVersion);

	public List<FortifyVO> Fortify_ExecuteQuery_getFortifyMetrics(String selectedFortifyProject,
			String selectedFortifyVersion);

	public List<FortifyVO> Fortify_ExecuteQuery_getFortifyLast3VersionChart(String selectedFortifyProject);

	
}
