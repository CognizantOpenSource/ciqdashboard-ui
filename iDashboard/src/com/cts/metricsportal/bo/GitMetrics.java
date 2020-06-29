/**
 * Cognizant Technology Solutions
 * 
 * @author 653731
 */
package com.cts.metricsportal.bo;
import com.cts.metricsportal.dao.GitMongoOperations;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.*;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

public class GitMetrics implements ISCMMetrics{
	
	static final Logger logger = Logger.getLogger(ChefMetrics.class);
	
	 /**method returns commit users
     * @param username
     * @param repository
     * @param type
     * 
     * Returns populated user list
     */
    public List<String> getCommitUser(String user, String repo,String type) {
        return populateUserList(user,repo,type);
    }
    
    /**method returns git types
     * @param authString
     * @return List<String> gittypelist 
     */
    public List<String> getGitTypes(String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
    	
    	List<String> gitTypeList = null;
    	
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken){
			gitTypeList = GitMongoOperations.getGitTypes();
		}
		
		return gitTypeList;
    }
    
    /**method returns git names
     * @param authString
     * @param type
     * @param userName
     * 
     * @return List gitnameList
     */
    public List<String> getGitName(String authString, String type) throws JsonParseException,
				JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> gitNameList = new ArrayList<String>();
		List<RepositoryDetailsVO> gitdata = null;
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getGitName(type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(RepositoryDetailsVO rd : gitdata) {
					gitNameList.add(rd.getGitName());
				}
    		}
		}
		return gitNameList;
	}
	
	/**method return git data
     * @param authString
     * @param type
     * @param userName
     * 
     * @return List 
     */
	public List<RepositoryDetailsVO> getGitData(String authString, String type,String userName) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken)
		gitdata = GitMongoOperations.getGitData(type, userName);
		
		return gitdata;
	}
    
	/**method return git file size
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * @return fileSize
     */
	public long getFileSize(String authString, String user, String repo, String type) {
		List<RepositoryDetailsVO> gitdata = null;
		long fileSize = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getFileSize(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){		
						fileSize = gitdata.get(0).getRepositoryDetails().get(i).getFileSize();
					}
				}
			}
		}
		return fileSize;
	}
	

	/**method returns git repository list
     * @param authString
     * @param userName
     * 
     * @return List repoList
     */
	public List<String> getGitRepoList(String authString, String userName) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		List<String> repoList =  new ArrayList<String>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getRepoList(userName);

			if(gitdata != null && !gitdata.isEmpty()){
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){
					repoList.add(gitdata.get(0).getRepositoryDetails().get(i).getRepoName());
			
				}
			}
		}
		return repoList;
	}

	/**method returns git commits count
     * @param authString
     * @param userName
     * 
     * @return commitCount 
     */
	public long getCommitsCount(String authString, String user, String repo, String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		long commitCount = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getCommitCount(user, repo, type);
		
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						commitCount = gitdata.get(0).getRepositoryDetails().get(i).getCommitsCount() ;
						}
					}
				}
			}
		return commitCount;
	}
	
	/**method returns git Contributor count
     * @param authString
     * @param userName
     * 
     * Returns contributor count
     */
	public long getContributors(String authString, String user, String repo, String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		long contributorCount = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata= GitMongoOperations.getContributorsList(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						contributorCount = gitdata.get(0).getRepositoryDetails().get(i).getContributorsDetails().size();
					}
				}
			}
					
		}
		return contributorCount;
	}
	
	/**method returns git watchers count
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * Returns watchers count
     */
	public long getWatchers(String authString, String user, String repo, String type)throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		long watchers = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata= GitMongoOperations.getWatchers(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						watchers = gitdata.get(0).getRepositoryDetails().get(i).getWatchersCount();
					}
				}
			}
		}
		
		return watchers;
	}
	
	/**method returns git star count
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * Returns starcount
     */
	public long getStarsCount(String authString,String user,String repo,String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
		long starCount = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getStarsCount(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						starCount = gitdata.get(0).getRepositoryDetails().get(i).getStargazersCount();
					}
				}
			}
		}
		return starCount;
	}
	
	/**method returns git pull request
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * Returns pulldetails
     */
	public List<Integer> getPullRequest(String authString,String user,String repo,String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
			List<RepositoryDetailsVO> gitdata = null;
			List<Integer> pullDetails = new ArrayList<Integer>();
			int totalPulls = 0; int mergeCount = 0;
			boolean authenticateToken = LayerAccess.authenticateToken(authString);
			
			if(authenticateToken) {
				gitdata = GitMongoOperations.getPullRequest(user, repo, type);
				
				if(gitdata != null && !gitdata.isEmpty()) {
					for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
						if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
							totalPulls = gitdata.get(0).getRepositoryDetails().get(i).getTotalPulls();
							mergeCount = gitdata.get(0).getRepositoryDetails().get(i).getMergeCount();
					}}
				}
					pullDetails.add(totalPulls);
					pullDetails.add(mergeCount);
			}
			
			return pullDetails;
			
	}
	
	/**method returns git issues
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * @return issue details
     */
	public List<Integer> getIssues(String authString,String user,String repo,String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<Integer> issueDetails = new ArrayList<Integer>();
		List<RepositoryDetailsVO> gitdata = null;
		int totalIssues = 0; int closedIssueCount = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			gitdata = GitMongoOperations.getIssues(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						totalIssues = totalIssues + gitdata.get(0).getRepositoryDetails().get(i).getTotalIssues();
						closedIssueCount = closedIssueCount + gitdata.get(0).getRepositoryDetails().get(i).getClosedIssueCount();
				}}
				
			}
			issueDetails.add(totalIssues);
			issueDetails.add(closedIssueCount);
		}
		return issueDetails;
	}
	
	/**method returns git top contributors
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * Returns final list of contributors
     */
	public List<ContributorsDetailsVO> getTopContributors(String authString,String user,String repo,String type)throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
		List<CommitDetailsVO> topcontributors = new ArrayList<CommitDetailsVO>();
		List<Integer> blackList = new ArrayList<Integer>();
		List<ContributorsDetailsVO> final_List = new ArrayList<ContributorsDetailsVO>();
		int count = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			gitdata = GitMongoOperations.getTopContributors(user, repo, type);
	
		if(gitdata != null && !gitdata.isEmpty()) {
			for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
				if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
					topcontributors.addAll(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails());
				}}
		
				for(int j=0;j<topcontributors.size();j++){
					ContributorsDetailsVO contributors  = new ContributorsDetailsVO();	
					count=1;
					for(int k=(j+1);k<topcontributors.size();k++){
						if(topcontributors.get(j).getName().equalsIgnoreCase(topcontributors.get(k).getName())){
							count++;
							blackList.add(k);
						}
					}
					if(!blackList.contains(j))
					{
						contributors.setLogin(topcontributors.get(j).getName());
						contributors.setContributions(count);
						contributors.setAvatarURL(topcontributors.get(j).getAvatarUrl());
					
						final_List.add(contributors);
					}
				}
			}
		}
		return final_List;
	}
	/**method returns time period
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * @return time period list
     */
	public List<String> getTimePeriod(String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<String> userList = new ArrayList<String>();
		userList.add("Last 15 days");
		userList.add("Last 30 days");
		userList.add("Last 90 days");
		userList.add("Last 180 days");
		userList.add("Last 365 days");
		
		return userList;
		
	}
	/**method returns git commits
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * @return 
     */
	
	public List<CommitTrendVO> getCommits(String authString,String user,String repo,String type) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		List<CommitTrendVO> trendvoList=new ArrayList<CommitTrendVO>();
		List<CommitDetailsVO> commitDetails = new ArrayList<CommitDetailsVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		
		/*Date date=new Date(); //current date
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, -365);
		Date dateBefore7Days = cal.getTime();*/
		
		if(authenticateToken) {
			gitdata = GitMongoOperations.getCommits(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty())
			{
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						commitDetails.addAll(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails());
					}
				
				CommitTrendVO commits = null;
				Date commitdate=null;
				int count;
				List<Integer> blackList = new ArrayList<Integer>();
				for(int j=0; j<commitDetails.size(); j++){
					count=1;
					commits = new CommitTrendVO();
					commitdate = commitDetails.get(j).getDate();
					
					/*if(dateBefore7Days.before(commitdate)){*/
					for(int k=(j+1); k<commitDetails.size(); k++){
						if(commitDetails.get(j).getDate().toString().equalsIgnoreCase(commitDetails.get(k).getDate().toString())){
							count++;
							blackList.add(k);
							
							if(!blackList.contains(j))
							{
								commits.setCommitdate(commitdate);
								commits.setCount(count);
								trendvoList.add(commits);
							}
						}
					
					}
				}
			}
		}
		}
		return trendvoList;
	}
	/**method returns git commits after applying filter
     * @param authString
     * @param user
     * @param repo
     * @param type
     * @param timeperiod
     * 
     * @return
     */
	public List<CommitTrendVO> getCommitsWithFilter(String authString,String user,String repo,String type,String committer,String timeperiod) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = null;
		List<CommitTrendVO> trendvoList=new ArrayList<CommitTrendVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			gitdata = GitMongoOperations.getCommits(user, repo, type);
			
			if(gitdata != null && !gitdata.isEmpty()) {
				Date dateBefore7Days = null;
				
				if(!timeperiod.equalsIgnoreCase("undefined")){	
					int noofdays = 0;
					if(timeperiod.equalsIgnoreCase("Last 15 days")){
						noofdays = 15;
					}
					else if(timeperiod.equalsIgnoreCase("Last 30 days")){
						noofdays = 30;
					}
					else if(timeperiod.equalsIgnoreCase("Last 90 days")){
						noofdays = 90;
					}
					else if(timeperiod.equalsIgnoreCase("Last 180 days")){
						noofdays = 180;
					}
					else if(timeperiod.equalsIgnoreCase("Last 365 days")){
						noofdays = 365;
					}
				Date date=new Date(); //current date
				Calendar cal = Calendar.getInstance();
				cal.setTime(date);
				cal.add(Calendar.DATE, -(noofdays));
				dateBefore7Days = cal.getTime();
				}
				
				List<CommitDetailsVO> commitdetails = new ArrayList<CommitDetailsVO>();
				
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						for(int l=0; l<gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails().size(); l++){
							if(committer.equalsIgnoreCase("undefined")){
						commitdetails.add(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails().get(l));
						}
							else{
								if(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails().get(l).getName().equalsIgnoreCase(committer)){
									commitdetails.add(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails().get(l));
									}						}
					}}}
				
				CommitTrendVO commits = null;
				Date commitdate=null;
				int count;
				List<Integer> blackList = new ArrayList<Integer>();
				for(int j=0; j<commitdetails.size(); j++){
					count=1;
					commits = new CommitTrendVO();
					commitdate = commitdetails.get(j).getDate();
					
					if(dateBefore7Days != null){
					if(dateBefore7Days.before(commitdate)){
							
					for(int k=(j+1); k<commitdetails.size(); k++){
						if(commitdetails.get(j).getDate().toString().equalsIgnoreCase(commitdetails.get(k).getDate().toString())){
							count++;
							blackList.add(k);
					}}
					if(!blackList.contains(j))
					{	
						commits.setCommitdate(commitdate);
						commits.setCount(count);
						trendvoList.add(commits);
					}
					}}
					else{
							for(int k=(j+1); k<commitdetails.size(); k++){
								if(commitdetails.get(j).getDate().toString().equalsIgnoreCase(commitdetails.get(k).getDate().toString())){
									count++;
									blackList.add(k);
								}
							}
							if(!blackList.contains(j))
							{	
								commits.setCommitdate(commitdate);
								commits.setCount(count);
								trendvoList.add(commits);
							}
								
						}
					}
				}
				
			}
		return trendvoList;
	}
	
	/**method returns git commits after applying filter
     * @param authString
     * @param user
     * @param repo
     * @param type
     * @param timeperiod
     * 
     * @return 
     */
	public List<CommitTrendVO> getWeeklyCommits(String authString, String user, String repo, String type)throws JsonParseException,
		JsonMappingException, IOException,NumberFormatException, BaseException, BadLocationException {
		List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
		List<CommitTrendVO> trendvoList=new ArrayList<CommitTrendVO>();
		List<CommitDetailsVO> commitDetails = new ArrayList<CommitDetailsVO>();
		
		Date date=new Date(); //current date
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, -7);
		Date dateBefore7Days = cal.getTime();
		
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if(authenticateToken) {
			gitdata = GitMongoOperations.getCommits(user, repo, type);
			
			logger.error(gitdata.size());
			if(gitdata != null && !gitdata.isEmpty()) {
				for(int i=0; i<gitdata.get(0).getRepositoryDetails().size(); i++){	
					if(gitdata.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
						commitDetails.addAll(gitdata.get(0).getRepositoryDetails().get(i).getCommitDetails());
					}}
				
				
				CommitTrendVO commits = null;
				Date commitdate=null;
				int count;
				List<Integer> blackList = new ArrayList<Integer>();
				for(int j=0; j<commitDetails.size(); j++){
					count=1;
					commits = new CommitTrendVO();

					commitdate = commitDetails.get(j).getDate();
					
					if(dateBefore7Days.before(commitdate)){
								
					for(int k=(j+1); k<commitDetails.size(); k++){
						if(commitDetails.get(j).getDate().toString().equalsIgnoreCase(commitDetails.get(k).getDate().toString())){
							count++;
							blackList.add(k);
						}
					}
					if(!blackList.contains(j))
					{
						commits.setCommitdate(commitdate);
						commits.setCount(count);
						trendvoList.add(commits);
					}
					}
					
				}
			}
		}
				
		return trendvoList;
	}
    private List<String> populateUserList(String user, String repo, String type)
    {
        List<String> userlist = new ArrayList<String>();
        List<RepositoryDetailsVO> commituserlist = GitMongoOperations.getCommitUser(user, repo, type);
        for(int i=0;i<commituserlist.get(0).getRepositoryDetails().size();i++){
            if(commituserlist.get(0).getRepositoryDetails().get(i).getRepoName().equalsIgnoreCase(repo)){
                for(int j=0; j<commituserlist.get(0).getRepositoryDetails().get(i).getCommitDetails().size();j++){
                    userlist.add(commituserlist.get(0).getRepositoryDetails().get(i).getCommitDetails().get(j).getName());
                }}}

        Set<String> hs = new HashSet<String>();
        hs.addAll(userlist);
        userlist.clear();
        userlist.addAll(hs);

        return userlist;
    }
	
  
}

