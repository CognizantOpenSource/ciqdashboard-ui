package com.idashboard.lifecycle.service;

import java.util.List;

import com.idashboard.lifecycle.vo.FortifyVO;

public interface SASTService {

	List<String> getFortifyProjectDetails(String authString);

	List<String> getVersionDetails(String selectedFortifyProject, String authString);

	List<Integer> getFortifyHomeMetrics(String selectedFortifyProject, String selectedFortifyVersion,
			String authString);

	List<FortifyVO> getFortifyMetrics(String selectedFortifyProject, String selectedFortifyVersion, String authString);

	List<FortifyVO> getFortifyLast3VersionChart(String authString, String selectedFortifyProject);

	
	
}
