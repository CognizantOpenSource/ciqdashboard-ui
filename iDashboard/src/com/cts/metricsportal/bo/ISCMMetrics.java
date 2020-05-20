/**
 * Cognizant Technology Solutions
 * 
 * @author 653731
 */
package com.cts.metricsportal.bo;

import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.CommitTrendVO;

import java.io.IOException;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

interface  ISCMMetrics {

	/**method returns commit users
     * @param username
     * @param repository
     * @param type
     * 
     * @return 
     */
    public List<String> getCommitUser(String user, String repo,String type);
    
    
    /**method returns git commits
     * @param authString
     * @param user
     * @param repo
     * @param type
     * 
     * @return 
     */
    public List<CommitTrendVO> getCommits(String authString, String user, String repo,String type) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;
    
    
    /**method returns git commits after applying filter
     * @param authString
     * @param user
     * @param repo
     * @param type
     * @param timeperiod
     * 
     * @return
     */
    
    public List<CommitTrendVO> getCommitsWithFilter(String authString,String user, String repo,String type,String committer,String timeperiod) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;
    
    
    /**method returns git commits after applying filter
     * @param authString
     * @param user
     * @param repo
     * @param type
     * @param timeperiod
     * 
     * @return 
     */
    public List<CommitTrendVO> getWeeklyCommits(String authString,String user, String repo,String type) throws JsonParseException,
	JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException;

}