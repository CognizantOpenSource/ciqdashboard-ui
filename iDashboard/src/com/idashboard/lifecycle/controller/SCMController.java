package com.idashboard.lifecycle.controller;

import java.io.IOException;
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

import com.cts.metricsportal.bo.GitMetrics;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.CommitTrendVO;
import com.cts.metricsportal.vo.ContributorsDetailsVO;
import com.idashboard.lifecycle.service.SCMService;
import com.idashboard.lifecycle.serviceImpl.SCMServiceImpl;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

 
@Path("/scmcontroller")
public class SCMController {
	
    SCMService scmService = new SCMServiceImpl();
    
    @GET
	@Path("/getGitTypes")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitTypes(@HeaderParam("Authorization") String authString
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> gitTypeList = scmService.getGitTypes(authString);
		
		return gitTypeList;
	}	

    
    
    
    @GET
	@Path("/getGitDashboardNames")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitName(@HeaderParam("Authorization") String authString,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			List<String> gitNameList = scmService.getGitName(authString, type);
			
			return gitNameList;
	}
    
    
    
    @GET
	@Path("/getGitDashboardDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<GitRepositoryVO> getGitData(
			@HeaderParam("Authorization") String authString,
			@QueryParam("type") String type,
			@QueryParam("UserName") String UserName
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<GitRepositoryVO> gitdata = scmService.getGitData(authString, type, UserName);
			
			return gitdata;
	}
    
    
    
    @GET
	@Path("/getRepoList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitRepoList(
			@HeaderParam("Authorization") String authString,
			@QueryParam("UserName") String UserName
			
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<String> repoList =  scmService.getGitRepoList(authString, UserName);
			
			return repoList;
			
	}
    
    @GET
    @Path("/getFileSize")
    @Produces(MediaType.APPLICATION_JSON)
    public long getFileSize(
            @HeaderParam("Authorization") String authString,
            @QueryParam("user") String user,
            @QueryParam("repo") String repo,
            @QueryParam("type") String type
            ) throws JsonParseException,
            JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
    	
    			return scmService.getFileSize(authString, user, repo, type);
        
            }
    
    @GET
	@Path("/CommitCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getCommitsCount(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			long commitCount = 0;
			commitCount = scmService.getCommitsCount(authString, user, repo, type);
			
			return commitCount;	
	}	
    
    
    
	@GET
	@Path("/ContributorsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getContributors(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			long contributorCount = 0;
				contributorCount = scmService.getContributors(authString, user, repo, type);
			
			return contributorCount;
	}
	
	
	@GET
	@Path("/WatchersCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long getWatchers(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			long watchers = 0;
				watchers = scmService.getWatchers(authString, user, repo, type);
			
			return watchers;
			
	}	
	
	
	
	@GET
	@Path("/StarsCount")
	@Produces(MediaType.APPLICATION_JSON) //changed method name
	public long getStarsCount(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			long stars = scmService.getStarsCount(authString, user, repo, type);
			
			return stars;
	}
	
	
	
	@GET
	@Path("/pullrequest")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Integer> pullRequest(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			List<Integer> pullDetails = scmService.getPullRequest(authString, user, repo, type);
			
			return pullDetails;
			
		}
	
	
	
	@GET
	@Path("/Issues")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Integer> getIssues(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<Integer> issueDetails = scmService.getIssues(authString, user, repo, type);
			
			return issueDetails;
	}
	
	
	
	@GET
	@Path("/topcontributors")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ContributorsDetailsVO> getTopContributors(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<ContributorsDetailsVO> finalList = scmService.getTopContributors(authString, user, repo, type);
			
			return finalList;
	}
	
	
	
	@GET
	@Path("/getCommitUser")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getCommitUser(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
				
		        List<String> userList = scmService.getCommitUser(user,repo,type);
		        
		        return userList;
		
	}	
	
	
	
	
	@GET
	@Path("/getTimePeriod")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getTimePeriod(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<String> userList = scmService.getTimePeriod(authString);
				
			return userList;
	}
	
	
	
	
	@GET
	@Path("/commits")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CommitTrendVO> getCommits(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<CommitTrendVO> trendvoList = scmService.getCommits(authString,user, repo, type);
			
			return trendvoList;
			
	}
	
	
	
	
	@GET
	@Path("/commitswithfilter")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CommitTrendVO> getCommitsWithFilter(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type,
			@QueryParam("committer") String committer,
			@QueryParam("timeperiod") String timeperiod
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<CommitTrendVO> trendvoList = scmService.getCommitsWithFilter(authString, user, repo, type, committer, timeperiod);
			
			return trendvoList;
	}
	
	
	
	
	@GET
	@Path("/weeklycommits")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CommitTrendVO> getWeeklyCommits(
			@HeaderParam("Authorization") String authString,
			@QueryParam("user") String user,
			@QueryParam("repo") String repo,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			
			List<CommitTrendVO> trendvoList= scmService.getWeeklyCommits(authString, user, repo, type);

			return trendvoList;
	}	

	
}
