package com.idashboard.admin.service;

import java.util.List;

import com.idashboard.admin.vo.LicenseVO;

public interface LicenseService {
	
	public List<LicenseVO> GetLicenseDetails();
	public boolean UpdateLicenseKey(String authString,String licenseKey);

}
