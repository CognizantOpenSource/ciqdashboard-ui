package com.idashboard.lifecycle.dao;

import java.util.List;

import com.cts.metricsportal.vo.RepositoryDetailsVO;

public interface GitMongoInterface {
	 public List<RepositoryDetailsVO> Git_GetFileSize(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetGitData(String type, String userName);

		public List<RepositoryDetailsVO> Git_GetGitName(String type);

		public List<String> Git_GetGitTypes();


		public List<RepositoryDetailsVO> Git_GetContributorsList(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetWatchers(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetStarsCount(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetPullRequest(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetIssues(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetTopContributors(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetCommitUser(String user, String repo, String type);


		public List<RepositoryDetailsVO> Git_GetCommits(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetWeeklyCommits(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetCommitCount(String user, String repo, String type);

		public List<RepositoryDetailsVO> Git_GetRepoList(String userName);

}
