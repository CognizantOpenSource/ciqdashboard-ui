package com.idashboard.admin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;


import com.idashboard.admin.service.LicenseService;
import com.idashboard.admin.serviceImpl.LicenseServiceImpl;
import com.idashboard.admin.vo.LicenseVO;


@Path("/Licensecontroller")
public class LicenseController {
	
	//LifeCycleLayOutService LifeCycleLaOutOperation = new LifeCycleLayOutServiceImpl();
	
	LicenseService LicenseOpr = new LicenseServiceImpl();
	
	@GET
	@Path("/licenseDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<LicenseVO> getlicenseDetails() {
		
		List<LicenseVO> readerValues = new ArrayList<LicenseVO>();
		readerValues = LicenseOpr.GetLicenseDetails();
		return readerValues;
		
	}
	
	@GET
	@Path("/updateLicenseKey")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean updateLicenseKey(@HeaderParam("Authorization") String authString,
			@QueryParam("licenseKey") String licenseKey) {
		
		boolean update=false;
		update=LicenseOpr.UpdateLicenseKey(authString, licenseKey);
		return update;
		
	}

}
