package com.idashboard.lifecycle.service;

import java.util.List;

import com.cts.metricsportal.vo.CommitTrendVO;
import com.cts.metricsportal.vo.ContributorsDetailsVO;
import com.cts.metricsportal.vo.RepositoryDetailsVO;

 

public interface SCMService {
    public long getFileSize(String authString,String user, String repo, String type);

	public List<RepositoryDetailsVO> getGitData(String authString, String type, String userName);

	public List<String> getGitName(String authString, String type);

	public List<String> getGitTypes(String authString);

	public List<String> getGitRepoList(String authString, String userName);

	public long getCommitsCount(String authString, String user, String repo, String type);

	public long getContributors(String authString, String user, String repo, String type);

	public long getWatchers(String authString, String user, String repo, String type);

	public long getStarsCount(String authString, String user, String repo, String type);

	public List<Integer> getPullRequest(String authString, String user, String repo, String type);

	public List<Integer> getIssues(String authString, String user, String repo, String type);

	public List<ContributorsDetailsVO> getTopContributors(String authString, String user, String repo, String type);

	public List<String> getCommitUser(String user, String repo, String type);

	public List<String> getTimePeriod(String authString);

	public List<CommitTrendVO> getCommits(String authString, String user, String repo, String type);

	public List<CommitTrendVO> getCommitsWithFilter(String authString, String user, String repo, String type,
			String committer, String timeperiod);

	public List<CommitTrendVO> getWeeklyCommits(String authString, String user, String repo, String type);

 

}

 

