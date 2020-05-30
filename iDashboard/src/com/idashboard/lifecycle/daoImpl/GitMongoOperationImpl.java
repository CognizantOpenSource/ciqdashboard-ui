package com.idashboard.lifecycle.daoImpl;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.RepositoryDetailsVO;
import com.idashboard.lifecycle.dao.GitMongoInterface;

 

public class GitMongoOperationImpl extends BaseMongoOperation implements GitMongoInterface {
    
    static final Logger logger = Logger.getLogger(GitMongoOperationImpl.class);
    
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
    
    public List<RepositoryDetailsVO> Git_GetFileSize(String user, String repo, String type){
    Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
    List<RepositoryDetailsVO> gitdata = new ArrayList<RepositoryDetailsVO>();
    
    try {
        gitdata = getMongoOperation().find(query1, RepositoryDetailsVO.class);
    } catch(NumberFormatException | BaseException | BadLocationException e) {
    
        logger.error("Failed to fetch File size "+e);
    }
       return gitdata;
    }

   
   
  
    /**method returns commit users
     * @param user
     * @param repo
     * @param type
     * 
     * @return
     */
    public List<RepositoryDetailsVO> Git_GetCommitUser(String user, String repo, String type) {
        Query query1 = buildQuery_getRepositoryDetails(user, repo, type);
        List<RepositoryDetailsVO> commitUserList = null;
        try {
        	commitUserList = getMongoOperation().find(query1, RepositoryDetailsVO.class);
        } catch (Exception ex) {
        	logger.error("Failed commit user "+ex);
        } 
        return commitUserList;
    }

    /**method returns Git Type
     * @return 
     */
    @SuppressWarnings("unchecked")
	public List<String> Git_GetGitTypes() {
    	
    	List<String> gitTypeList = new ArrayList<String>();
    	try {
    		gitTypeList = getMongoOperation().getCollection("gitrepoInfo").distinct("gitType");
    	} catch (Exception ex) {
    		logger.error("Failed to fetch git types "+ex);
        } finally {
            

        }
    	return gitTypeList;
    }

    /**method gets Git Names
     * @param username
     * @param type
     * 
     * @return List<RepositoryDetailsVO> gitdata
     */
    public List<RepositoryDetailsVO> Git_GetGitName(String type) {
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
    public List<RepositoryDetailsVO> Git_GetGitData(String type, String userName) {
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
    
  
    /**method Git repository list
     * @param username
     * 
     * @return List 
     */
    public List<RepositoryDetailsVO> getRepoList(String userName){
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
    public List<RepositoryDetailsVO> Git_GetCommitCount(String user, String repo, String type ){
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
    public List<RepositoryDetailsVO> Git_GetContributorsList(String user, String repo, String type ){
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
    
    public List<RepositoryDetailsVO> Git_GetRepoList(String userName){
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
    
    /**method returns watcher's count
     * @param username
     * @param repo
     * @param type
     * 
     * Returns git data
     */
    public List<RepositoryDetailsVO> Git_GetWatchers(String user, String repo, String type ){
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
    public List<RepositoryDetailsVO> Git_GetStarsCount(String user, String repo, String type ){
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
    public List<RepositoryDetailsVO> Git_GetPullRequest(String user, String repo, String type) {
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
    public List<RepositoryDetailsVO> Git_GetIssues(String user, String repo, String type) {
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
    public List<RepositoryDetailsVO> Git_GetTopContributors(String user, String repo, String type) {
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
    public List<RepositoryDetailsVO> Git_GetCommits(String user, String repo, String type) {
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
    public List<RepositoryDetailsVO> Git_GetCommitsWithFilter(String user, String repo, String type) {
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
    public List<RepositoryDetailsVO> Git_GetWeeklyCommits(String user, String repo, String type) {
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



