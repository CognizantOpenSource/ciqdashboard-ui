package com.idashboard.lifecycle.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.BuildJobsVO;
import com.cts.metricsportal.vo.BuildListVO;
import com.cts.metricsportal.vo.BuildTotalVO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.idashboard.lifecycle.service.BuildService;
import com.idashboard.lifecycle.serviceImpl.BuildServiceImpl;

@Path("/buildcontroller")
public class BuildController {
	
	BuildService buildService = new BuildServiceImpl();

	// ***************************************************************************************************/
		// Description : Get the Total builds for an Application Name
		// WebService Name : GetTotalBuilds
		// Input : Authorization and Application Name
		// Output : Total Build List
		// ***************************************************************************************************/

		@GET
		@Path("/getbuildperday")
		@Produces(MediaType.APPLICATION_JSON)
		public List<BuildTotalVO> getBuildPerDay(@HeaderParam("Authorization") String authString,
				@QueryParam("AppName") String AppName) {

			List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
				list = buildService.getBuildPerDay(authString, AppName);
				return list;
		}

		// ***************************************************************************************************/

		// ***************************************************************************************************/
		// Description : Get the Average build Duration for an Application Name
		// WebService Name : GetTotalBuilds
		// Input : Authorization and Application Name
		// Output : Total Build List
		// ***************************************************************************************************/

		@GET
		@Path("/getaveragedurationbuild")
		@Produces(MediaType.APPLICATION_JSON)
		public List<BuildTotalVO> getAverageBuildDuration(@HeaderParam("Authorization") String authString,
				@QueryParam("AppName") String AppName) {

			List<BuildTotalVO> list = new ArrayList<BuildTotalVO>();
				list = buildService.getAverageBuildDuration(authString, AppName);
				return list;
			 
		}

		// ***************************************************************************************************/

		// ***************************************************************************************************/
		// Description : Get the Total builds for an Application Name
		// WebService Name : GetTotalBuilds
		// Input : Authorization and Application Name
		// Output : Total Build List
		// ***************************************************************************************************/

		@GET
		@Path("/gettotalbuilds")
		@Produces(MediaType.APPLICATION_JSON)
		public List<BuildTotalVO> getTotalBuilds(@HeaderParam("Authorization") String authString,
				@QueryParam("AppName") String AppName) {
			
			return buildService.getTotalBuild(authString, AppName);
				 
			 
		}

		// ***************************************************************************************************/
		// Description : It list out the last 5 Builds with calculate the days using
		// endTime and CurrentDate
		// WebService Name : GetLatestBuilds
		// Input : Authorization and Application Name
		// Output : Latest 5 Builds with BuildNummber and Days
		// ***************************************************************************************************/

		@GET
		@Path("/getlatestbuilds")
		@Produces(MediaType.APPLICATION_JSON)
		public List<BuildListVO> getLatestBuilds(@HeaderParam("Authorization") String authString,
				@QueryParam("AppName") String AppName) {

			return buildService.getLatestBuild(authString, AppName);
				 
			
		}

		// ***************************************************************************************************/

		@GET
		@Path("/buildsJobs")
		@Produces(MediaType.APPLICATION_JSON)
		public List<BuildJobsVO> buildJobs(@HeaderParam("Authorization") String authString) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			List<BuildJobsVO> buildJobList;
				buildJobList = buildService.getBuildJobs(authString);
			
			return buildJobList;

		}
}
