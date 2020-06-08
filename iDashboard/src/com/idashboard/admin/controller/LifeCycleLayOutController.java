package com.idashboard.admin.controller;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.idashboard.admin.service.LifeCycleLayOutService;
import com.idashboard.admin.serviceImpl.LifeCycleLayOutServiceImpl;

@Path("/lifecyclelayoutcontroller")
public class LifeCycleLayOutController {
	
	LifeCycleLayOutService LifeCycleLaOutOperation = new LifeCycleLayOutServiceImpl();

	@GET
	@Path("/saveToolDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public int getsaveToolDetails(@HeaderParam("Authorization") String authString,
			@QueryParam("toolsSelected") String toolsSelected, @QueryParam("template") String template) {
		
		int Count = 0;
		Count = LifeCycleLaOutOperation.SaveToolDetails(authString, toolsSelected, template);
		return Count;

	}

}
