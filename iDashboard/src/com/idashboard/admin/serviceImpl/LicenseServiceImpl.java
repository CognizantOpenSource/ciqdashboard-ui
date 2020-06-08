package com.idashboard.admin.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import com.idashboard.admin.dao.LicenseMongoInterface;
import com.idashboard.admin.daoImpl.LicenseMongoInterfaceImpl;
import com.idashboard.admin.service.LicenseService;
import com.idashboard.admin.vo.LicenseVO;

public class LicenseServiceImpl implements LicenseService {
	
	LicenseMongoInterface LicenseOperation = new LicenseMongoInterfaceImpl();
	
	public List<LicenseVO> GetLicenseDetails(){
		
		List<LicenseVO> readerValues = new ArrayList<LicenseVO>();
		readerValues = LicenseOperation.License_ExecuteQuery_GetLicenseDetails();
		return readerValues;
	}
	
	public boolean UpdateLicenseKey(String authString,String licenseKey) {
		
		boolean update=false;
		update=LicenseOperation.License_ExecuteQuery_UpdateLicenseKey(authString, licenseKey);
		return update;
	}

}
