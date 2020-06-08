package com.idashboard.admin.serviceImpl;

import com.cts.metricsportal.bo.LayerAccess;
import com.idashboard.admin.dao.LifeCycleLayOutMongoInterface;
import com.idashboard.admin.daoImpl.LifeCycleLayOutMongoOperationImpl;
import com.idashboard.admin.service.LifeCycleLayOutService;



public class LifeCycleLayOutServiceImpl implements LifeCycleLayOutService {
	
	LifeCycleLayOutMongoInterface LifeCycleLayoutOperation = new LifeCycleLayOutMongoOperationImpl();
	
	@Override
	public int SaveToolDetails(String authString,String toolsSelected, String template) {
		
		int count = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (authenticateToken) {
			count = LifeCycleLayoutOperation.LifeCycleLayout_ExecuteQuery_SaveToolDetails(authString, toolsSelected, template);
		}
		return count;
	}

}
