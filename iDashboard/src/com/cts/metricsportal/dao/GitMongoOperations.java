/**
 * Cognizant Technology Solutions
 *
 */
package com.cts.metricsportal.dao;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.RepositoryDetailsVO;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.query.*;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;


public class GitMongoOperations extends BaseMongoOperation{
	
	static final Logger logger = Logger.getLogger(GitMongoOperations.class);
	
    private static Query buildQuery_getRepositoryDetails(String user, String repo,String type)
    {
        Query query1 = new Query();
        query1.addCriteria(Criteria.where("gitName").is(user));
        query1.addCriteria(Criteria.where("repositoryDetails.repoName").is(repo));
        query1.addCriteria(Criteria.where("gitType").is(type));
        return query1;
    }
    
    private static Query buildQuery_getGitName(String type) {
    	Query query1 = new Query();
    	query1.addCriteria(Criteria.where("gitType").is(type));
    	//query1.addCriteria(Criteria.where("UserName").is(userName));		
		return query1;
    }
    
    private static Query buildQuery_getGitData(String type, String userName) {
    	Query query1 = new Query();
    	query1.addCriteria(Criteria.where("gitType").is(type));
    	query1.addCriteria(Criteria.where("gitName").is(userName));
		return query1;
    }
    
    private static Query buildQuery_getRepoList(String userName) {
    	Query query1 = new Query();
		query1.addCriteria(Criteria.where("gitName").is(userName));
		return query1;
    }
    
    private static Query buildQuery_getCommits(String user, String repo,String type) {
    	Query query1 = new Query();
		query1.addCriteria(Criteria.where("gitName").is(user));
		query1.addCriteria(Criteria.where("repositoryDetails.repoName").is(repo));
		query1.addCriteria(Criteria.where("gitType").is(type));
		query1.with(new Sort(Direction.ASC, "repositoryDetails.commitDetails.date"));
		return query1;
    }
  
    /**method returns commit users
     * @param user
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getCommitUser(String user, String repo, String type) {
        Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
        List<RepositoryDetailsVO> commituserlist = null;
        try {
            commituserlist = getMongoOperation().find(query1, RepositoryDetailsVO.class);
        } catch (Exception ex) {
        	logger.error("Failed commit user "+ex);
        } 
        return commituserlist;
    }

    /**method returns Git Type
     * @return 
     */
    @SuppressWarnings("unchecked")
	public static List<String> getGitTypes() {
    	
    	List<String> gittypelist = new ArrayList<String>();
    	try {
    		gittypelist = getMongoOperation().getCollection("gitrepoInfo").distinct("gitType");
    	} catch (Exception ex) {
    		logger.error("Failed to fetch git types "+ex);
        } finally {
            

        }
    	return gittypelist;
    }

    /**method gets Git Names
     * @param username
     * @param type
     * 
     * @return List<RepositoryDetailsVO> gitdata
     */
    public static List<RepositoryDetailsVO> getGitName(String type) {
    	Query query1 = buildQuery_getGitName(type);
    	List<RepositoryDetailsVO> gitdata =  new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    		
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
    		
    		logger.error("Failed to fetch Git name"+e);
    	}
    	finally {
            

        }
    	return gitdata;
    	
    }
    
    /**method gets Git data
     * @param username, type
     * 
     * Returns git details 
     */
    public static List<RepositoryDetailsVO> getGitData(String type, String userName) {
    	Query query1 = buildQuery_getGitData(type, userName);
    	List<RepositoryDetailsVO> gitdata =  new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error("Failed to fetch Git Data "+e);
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method Git file size
     * @param username
     * @param repo
     * @param type
     * 
     * Returns git data details
     */
    public static List<RepositoryDetailsVO> getFileSize(String user, String repo, String type){
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error("Failed to fetch File size "+e);
    	}
    	finally {
			
        
    	}
    	return gitdata;
    	
    }
    
    /**method Git repository list
     * @param username
     * 
     * @return List 
     */
    public static List<RepositoryDetailsVO> getRepoList(String userName){
    	Query query1 = buildQuery_getRepoList(userName);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error("Failed to fetch Repo List "+e);
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns commit count
     * @param username
     * @param repo
     * @param type
     * 
     * Returns List of Git details
     */
    public static List<RepositoryDetailsVO> getCommitCount(String user, String repo, String type ){
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error("Failed to fetch commit count "+e);
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns contributor's list
     * @param username
     * @param repo
     * @param type
     * 
     * Returns List of Git details
     */
    public static List<RepositoryDetailsVO> getContributorsList(String user, String repo, String type ){
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns watcher's count
     * @param username
     * @param repo
     * @param type
     * 
     * Returns git data
     */
    public static List<RepositoryDetailsVO> getWatchers(String user, String repo, String type ){
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();;
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns stars count
     * @param username
     * @param repo
     * @param type
     * 
     * Returns git data details
     */
    public static List<RepositoryDetailsVO> getStarsCount(String user, String repo, String type ){
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();;
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns pull request
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getPullRequest(String user, String repo, String type) {
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();;
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns issues
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getIssues(String user, String repo, String type) {
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();;
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
    		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns top contributors
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getTopContributors(String user, String repo, String type) {
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns commit
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getCommits(String user, String repo, String type) {
    	Query query1 = buildQuery_getCommits(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns commit with filter
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getCommitsWithFilter(String user, String repo, String type) {
    	Query query1 = buildQuery_getCommits(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
    
    /**method returns weekly commit
     * @param username
     * @param repo
     * @param type
     * 
     * @return
     */
    public static List<RepositoryDetailsVO> getWeeklyCommits(String user, String repo, String type) {
    	Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    	List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    	
    	try {
    		gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    	} catch(NumberFormatException | BaseException | BadLocationException e) {
		
    		logger.error(e.getMessage());
    	}
    	finally {
			
        
    	}
    	return gitdata;
    }
}
