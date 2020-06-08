package com.idashboard.admin.dao;

import java.util.List;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import com.idashboard.admin.vo.LicenseVO;



public interface LicenseMongoInterface {

	public List<LicenseVO> License_ExecuteQuery_GetLicenseDetails();
	public boolean License_ExecuteQuery_UpdateLicenseKey(String authString,String licenseKey);
	
}
