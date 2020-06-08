package com.idashboard.admin.dao;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

public interface LifeCycleLayOutMongoInterface {
	
	public int LifeCycleLayout_ExecuteQuery_SaveToolDetails(String authString,String toolsSelected,  String template);

}
