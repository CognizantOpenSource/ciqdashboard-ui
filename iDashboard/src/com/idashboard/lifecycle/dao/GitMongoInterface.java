package com.idashboard.lifecycle.dao;

import java.util.List;

import com.idashboard.lifecycle.vo.GitRepositoryVO;

public interface GitMongoInterface {
	 public List<GitRepositoryVO> Git_GetFileSize(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetGitData(String type, String userName);

		public List<GitRepositoryVO> Git_GetGitName(String type);

		public List<String> Git_GetGitTypes();


		public List<GitRepositoryVO> Git_GetContributorsList(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetWatchers(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetStarsCount(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetPullRequest(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetIssues(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetTopContributors(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetCommitUser(String user, String repo, String type);


		public List<GitRepositoryVO> Git_GetCommits(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetWeeklyCommits(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetCommitCount(String user, String repo, String type);

		public List<GitRepositoryVO> Git_GetRepoList(String userName);

}
