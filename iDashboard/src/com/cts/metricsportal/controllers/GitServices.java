/**
 * Cognizant Technology Solutions
 * 
 */
package com.cts.metricsportal.controllers;

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

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.CommitTrendVO;
import com.cts.metricsportal.vo.ContributorsDetailsVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;
// New Approach 
import com.cts.metricsportal.bo.GitMetrics;

@Path("/gitServices")
public class GitServices extends BaseMongoOperation {

	GitMetrics gitmetrics;
	
	@GET
	@Path("/getGitTypes")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitTypes(@HeaderParam("Authorization") String authString
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		gitmetrics = new GitMetrics();
		List<String> gitTypeList = gitmetrics.getGitTypes(authString);
		
		return gitTypeList;
	}	

	
	@GET
	@Path("/getGitDashboardNames")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitName(@HeaderParam("Authorization") String authString,
			@QueryParam("type") String type
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			gitmetrics = new GitMetrics();
			List<String> gitNameList = gitmetrics.getGitName(authString, type);
			
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
			gitmetrics = new GitMetrics();
			List<GitRepositoryVO> gitdata = gitmetrics.getGitData(authString, type, UserName);
			
			return gitdata;
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
			gitmetrics = new GitMetrics();
			long fileSize = 0;
			fileSize = gitmetrics.getFileSize(authString, user, repo, type);
			
			return fileSize;
		
			}

	
	@GET
	@Path("/getRepoList")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getGitRepoList(
			@HeaderParam("Authorization") String authString,
			@QueryParam("UserName") String UserName
			
			) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			gitmetrics = new GitMetrics();
			List<String> repoList =  gitmetrics.getGitRepoList(authString, UserName);
			
			return repoList;
			
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
			gitmetrics = new GitMetrics();
			long commitCount = 0;
			commitCount = gitmetrics.getCommitsCount(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			long contributorCount = 0;
			contributorCount = gitmetrics.getContributors(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			long watchers = 0;
			watchers = gitmetrics.getWatchers(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			long stars = gitmetrics.getStarsCount(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			List<Integer> pullDetails = gitmetrics.getPullRequest(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			List<Integer> issueDetails = gitmetrics.getIssues(authString, user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			List<ContributorsDetailsVO> finalList = gitmetrics.getTopContributors(authString, user, repo, type);
			
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
				gitmetrics = new GitMetrics();
		        List<String> userList = gitmetrics.getCommitUser(user,repo,type);
		        
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
			gitmetrics = new GitMetrics();
			List<String> userList = gitmetrics.getTimePeriod(authString);
				
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
			gitmetrics = new GitMetrics();
			List<CommitTrendVO> trendvoList = gitmetrics.getCommits(authString,user, repo, type);
			
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
			gitmetrics = new GitMetrics();
			List<CommitTrendVO> trendvoList = gitmetrics.getCommitsWithFilter(authString, user, repo, type, committer, timeperiod);
			
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
			gitmetrics = new GitMetrics();
			List<CommitTrendVO> trendvoList= gitmetrics.getWeeklyCommits(authString, user, repo, type);

			return trendvoList;
	}	
	
}