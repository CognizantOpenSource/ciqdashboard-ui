/**
 * Cognizant Technology Solutions
 *
 */
package com.cts.metricsportal.dao;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.UserProjectVO;
import com.cts.metricsportal.vo.UserVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.query.*;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

public class AdminMongoOperations extends BaseMongoOperation {

	@SuppressWarnings("unchecked")
	public static List<LevelItemsVO> getLevelItems() {

		List<LevelItemsVO> levelDetails = new ArrayList<LevelItemsVO>();
		Query levelquery = new Query();
		try {
			levelDetails = getMongoOperation().find(levelquery,
					LevelItemsVO.class);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return levelDetails;
	}

	@SuppressWarnings("unchecked")
	public static int getUpdateFLag(List<UserProjectVO> testedListLevelID,
			String userId) {

		int count = 0;
		try {
			
			Update update = new Update();

			update.set("selectedProjects", testedListLevelID);

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(userId));

			getMongoOperation().updateFirst(query, update, UserVO.class);
			count = 1;
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return count;
	}

	@SuppressWarnings("unchecked")
	public static List<String> getDistinctDomain() {

		List<String> domain = null;
		try {
			Query almquery = new Query();
			almquery.addCriteria(Criteria.where("SourceTool").is("JIRA"));
			domain = getMongoOperation().getCollection("levelId")
					.distinct("level1", almquery.getQueryObject());
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return domain;
	}
	
	@SuppressWarnings("unchecked")
	public static List<String> getDistinctProject(int i, List<String> domain) {

		List<String> project = null;
		try {
			Query query = new Query();
			query.addCriteria(Criteria.where("SourceTool").is("JIRA"));
			query.addCriteria(Criteria.where("level1").is(domain.get(i)));
			project = getMongoOperation().getCollection("levelId").distinct("level2",
					query.getQueryObject());
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return project;
	}
	
	@SuppressWarnings("unchecked")
	public static List<String> getDistinctRelease(int i, int j, List<String> domain, List<String> project) {

		List<String> release = null;
		try {
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("SourceTool").is("JIRA"));
			query1.addCriteria(Criteria.where("level1").is(domain.get(i)));
			query1.addCriteria(Criteria.where("level2").is(project.get(j)));
			release = getMongoOperation().getCollection("levelId").distinct("level3", query1.getQueryObject());
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return release;
	}
	
	@SuppressWarnings("unchecked")
	public static List<LevelItemsVO> getLevelIdList(int i, int j, int k, List<String> domain, List<String> project, List<String> release) {

		List<LevelItemsVO> levelIdList = null;
		try {
			Query query2 = new Query();
			query2.addCriteria(Criteria.where("SourceTool").is("JIRA"));
			query2.addCriteria(Criteria.where("level1").is(domain.get(i)));
			query2.addCriteria(Criteria.where("level2").is(project.get(j)));
			query2.addCriteria(Criteria.where("level3").is(release.get(k)));

			levelIdList = getMongoOperation().find(query2, LevelItemsVO.class);
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
		}
		return levelIdList;
	}

}
