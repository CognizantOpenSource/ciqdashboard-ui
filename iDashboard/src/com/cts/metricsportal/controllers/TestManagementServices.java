package com.cts.metricsportal.controllers;



import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

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

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.TestManagementMetrics;
import com.cts.metricsportal.dao.OperationalDAO;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.UserVO;



@Path("/almServicess")
public class TestManagementServices extends BaseMongoOperation {

	
	TestManagementMetrics testManagementMetrics;

	
	
	
	
	
//getting the domain value in drop down 
	@GET
	@Path("/getdomains")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getdomains(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		 testManagementMetrics=new TestManagementMetrics();
		
	
	List<String> domainlist =testManagementMetrics.getdomains(authString);
	
	
		return domainlist;
		
	
	
	}
	//Get Project List Based on domain
	
	@GET
	@Path("/getproject")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getproject(@HeaderParam("Authorization") String authString, @QueryParam("level1") String domainName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		 testManagementMetrics=new TestManagementMetrics();
		 List<String> projectlist =testManagementMetrics.getproject(authString,domainName);
		
		
			return projectlist;
		}
	// Get Release Details

	@GET
	@Path("/getreleaselist")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getlevelrelease(@HeaderParam("Authorization") String authString,
			@QueryParam("domainName") String domainName,
			@QueryParam("projectName") String projectName)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		 testManagementMetrics=new TestManagementMetrics();
		List<String> releasedata =testManagementMetrics.getlevelrelease(authString,domainName,projectName);
		
			return releasedata;	
		
	
		
	}
	
	
	
	
	
//defect by severity chart
	@GET
	@Path("/defectsseveritychartdata")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DefectStatusVO> getDefectenvchart(@HeaderParam("Authorization") String authString,@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName, @QueryParam("releaseName") String releaseName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		
		 testManagementMetrics=new TestManagementMetrics();
		 List<DefectStatusVO> result=testManagementMetrics.getDefectenvchart(authString,domainName,projectName,releaseName);
			return result;	
		
	
	}
	
	
	//test execution pie chart
	@GET
	 @Path("/testcaseExeStatus")
	 @Produces(MediaType.APPLICATION_JSON)
    
	 public  List<TestExeStatusVO> getTcExeStatusbarchart(@HeaderParam("Authorization") String authString,@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName, @QueryParam("releaseName") String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
		 
		testManagementMetrics=new TestManagementMetrics();
		List<TestExeStatusVO> result=testManagementMetrics.getTcExeStatusbarchart(authString,domainName,projectName,releaseName);
		
		return result;
		
	}
	
	// Design By Test Type
	
	@GET
	 @Path("/designtypechartdata")
	 @Produces(MediaType.APPLICATION_JSON)
     
	 public  List<TestCaseStatusVO> getTcExeOwnerChart(@HeaderParam("Authorization") String authString,@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName, @QueryParam("releaseName") String releaseName) throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException{
		 
		testManagementMetrics=new TestManagementMetrics();
		
		List<TestCaseStatusVO> result=TestManagementMetrics.getTcExeOwnerChart(authString,domainName,projectName,releaseName);
		
		
			
	 	
			 
	 
	 		return result;	
	 	}


	


//Requirement By Priority - Funnel Chart
		@GET
		@Path("/reqprioritychartdata")
		@Produces(MediaType.APPLICATION_JSON)
		public List<RequirementStatusVO> getRequirementPiechart(@HeaderParam("Authorization") String authString,@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName, @QueryParam("releaseName") String releaseName) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException,
				BaseException, BadLocationException {
			testManagementMetrics=new TestManagementMetrics();
			
			List<RequirementStatusVO> result = testManagementMetrics.getRequirementPiechart(authString,domainName,projectName,releaseName);
			
				
					return result;	
				
	
		}
		
		
		
		//Requirement By Status - bar Chart
				@GET
				@Path("/reqbarchartdata")
				@Produces(MediaType.APPLICATION_JSON)
				public List<RequirementStatusVO> getRequirementbarchart(@HeaderParam("Authorization") String authString,@QueryParam("domainName") String domainName, @QueryParam("projectName") String projectName, @QueryParam("releaseName") String releaseName) throws JsonParseException,
						JsonMappingException, IOException, NumberFormatException,
						BaseException, BadLocationException {
					testManagementMetrics=new TestManagementMetrics();
					List<RequirementStatusVO> result =getRequirementbarchart(authString,domainName,projectName,releaseName);
						
						return result;
		
				}
				//design status pie chart 
	
	@GET
	 @Path("/designstatuschartdata")
	 @Produces(MediaType.APPLICATION_JSON)
    

	 public  List<TestCaseStatusVO> getDesignStatus(
			@HeaderParam("Authorization") String authString,
			@QueryParam("dashboardName") String dashboardName) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException,
			BaseException, BadLocationException {
		 testManagementMetrics=new TestManagementMetrics();
		 List<TestCaseStatusVO> getdesignstatus=testManagementMetrics.getDesignStatus(authString,dashboardName);
		 return getdesignstatus;
		 
	 	

	 }

	
}
