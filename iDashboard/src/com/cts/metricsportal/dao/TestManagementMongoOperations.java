package com.cts.metricsportal.dao;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectStatusVO;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.RequirementStatusVO;
import com.cts.metricsportal.vo.RequirmentVO;
import com.cts.metricsportal.vo.TestCaseStatusVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExeStatusVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.cts.metricsportal.vo.UserVO;
import com.idashboard.lifecycle.vo.GitRepositoryVO;

public class TestManagementMongoOperations extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(TestManagementMongoOperations.class);

	// method to get the domain list
	@SuppressWarnings("unchecked")
	public static List<String> getdomains() {
		List<String> domainlist = new ArrayList<String>();

		Query domainquery = new Query();
		/* domainquery.addCriteria(Criteria.where("userId").is(userId)); */
		try {
			domainlist = getMongoOperation().getCollection("userInfo").distinct("selectedProjects.level1",
					domainquery.getQueryObject());
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error("Failed to fetch domain list " + e);

		}
		return domainlist;
	}

	// method to get the project list

	public static List<UserVO> getproject(String domainName) {
		List<UserVO> alldetails = new ArrayList<UserVO>();
		Query query = new Query();

		try {
			alldetails = getMongoOperation().find(query, UserVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error("Failed to fetch project list " + e);

		}
		return alldetails;

	}

	// method to get release set

	@SuppressWarnings("unchecked")
	public static List<String> getlevelrelease(String domainName, String projectName) {
		List<String> releasedata = new ArrayList<String>();

		Query query = new Query();
		query.addCriteria(Criteria.where("level1").in(domainName));
		query.addCriteria(Criteria.where("level2").in(projectName));

		try {
			releasedata = getMongoOperation().getCollection("levelId").distinct("level3", query.getQueryObject());
		}

		catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error("Failed to release domain list " + e);

		}
		return releasedata;

	}

	// query to get defect by status graph
	public static List<DefectStatusVO> getDefectenvchart(List<Integer> levelIdList) {
		List<DefectStatusVO> result = null;
		Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
				group("severity").count().as("severityCnt"),
				project("severityCnt").and("severity").previousOperation());
		AggregationResults<DefectStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, DefectVO.class, DefectStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		result = groupResults.getMappedResults();
		return result;

	}

	// test execution pie chart
	public static List<TestExeStatusVO> getTcExeStatusbarchart(List<Integer> levelIdList) {
		List<TestExeStatusVO> result = null;
		Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
				group("testExecutionStatus").count().as("statusCnt"),
				project("statusCnt").and("testExecutionStatus").previousOperation());

		AggregationResults<TestExeStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, TestExecutionVO.class, TestExeStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		result = groupResults.getMappedResults();
		return result;

	}

	// Design By Test Type
	public static List<TestCaseStatusVO> getTcExeOwnerChart(List<Integer> levelIdList) {
		List<TestCaseStatusVO> result = null;
		Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
				group("testType").count().as("typecount"), project("typecount").and("testType").previousOperation());
		AggregationResults<TestCaseStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class, TestCaseStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		result = groupResults.getMappedResults();
		return result;

	}

	// Requirement By Priority - Funnel Chart
	public static List<RequirementStatusVO> getRequirementPiechart(List<Integer> levelIdList) {
		List<RequirementStatusVO> result = null;
		Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
				group("priority").count().as("priorityCnt"), project("priorityCnt").and("priority").previousOperation(),
				sort(Direction.DESC, "priorityCnt"));
		AggregationResults<RequirementStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class, RequirementStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		result = groupResults.getMappedResults();
		return result;

	}

	// Requirement By status - bar Chart
	public static List<RequirementStatusVO> getRequirementbarchart(List<Integer> levelIdList) {
		List<RequirementStatusVO> result = null;
		Aggregation agg = newAggregation(match(Criteria.where("levelId").in(levelIdList)),
				group("status").count().as("statusCnt"), project("statusCnt").and("status").previousOperation());
		AggregationResults<RequirementStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, RequirmentVO.class, RequirementStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		result = groupResults.getMappedResults();
		return result;

	}

	public static List<TestCaseStatusVO> getDesignStatus(String type) {

		List<TestCaseStatusVO> testDesigndata = new ArrayList<TestCaseStatusVO>();
		Aggregation agg = newAggregation(group("testDesignStatus").count().as("statuscount"),
				project("statuscount").and("testDesignStatus").previousOperation());
		AggregationResults<TestCaseStatusVO> groupResults = null;
		try {
			groupResults = getMongoOperation().aggregate(agg, TestCaseVO.class, TestCaseStatusVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			// TODO Auto-generated catch block
			logger.error(e.getMessage());

		}
		testDesigndata = groupResults.getMappedResults();
		return testDesigndata;

	}
}
