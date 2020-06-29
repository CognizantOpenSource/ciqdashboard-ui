package com.cts.metricsportal.dao;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.DefectVO;
import com.cts.metricsportal.vo.LevelItemsVO;
import com.cts.metricsportal.vo.OperationalDashboardVO;
import com.cts.metricsportal.vo.TestCaseVO;
import com.cts.metricsportal.vo.TestExecutionVO;
import com.mongodb.BasicDBObject;

public class OperationalDAO extends BaseMongoOperation {
	
	static final Logger logger = Logger.getLogger(OperationalDAO.class);
	
	public int saveDashboard(String userId, String dashboardName, String description, OperationalDashboardVO dashvo){
		int count = 0;
		List<OperationalDashboardVO> dashvoInfo;
		try {
			dashvoInfo = getMongoOperation().findAll(OperationalDashboardVO.class);
			for (OperationalDashboardVO vo : dashvoInfo) {

				if (vo.getOwner().equalsIgnoreCase(userId) && vo.getDashboardName().equalsIgnoreCase(dashboardName)) {
					count = 1;
					break;
				} 
			}
			if (count == 0) {
				try {
					getMongoOperation().save(dashvo, "operationalDashboards");
				} catch (NumberFormatException | BaseException | BadLocationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (NumberFormatException | BaseException | BadLocationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		return count;
	}

/**
 * Returns levelId corresponding to the dashboardName, domainName and projectName
 * @param dashboardName
 * @param owner
 * @param domainName
 * @param projectName
 * 
 * 
 * @returns levelidlist
 */
	public static List<Integer> getGlobalLevelIds(String dashboardName,String owner, String domainName,String projectName) {

		/*if(level1.equalsIgnoreCase("")){
			return null;//return empty value when level1 value is empty
		}*/		
		List<OperationalDashboardVO> operational = new ArrayList<OperationalDashboardVO>();
		List<Integer> levelidlist= new ArrayList<Integer>();
		String query = "{},{_id:0,dashboardName:1,owner:1,releaseSet:1}";
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query1.addCriteria(Criteria.where("owner").is(owner));

		try {
			operational = getMongoOperation().find(query1,OperationalDashboardVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			logger.error(e.getMessage());
		}
		if(!operational.isEmpty()){

			for(int i=0; i<operational.get(0).getReleaseSet().size();i++){

				if(!domainName.equalsIgnoreCase("null") && projectName.equalsIgnoreCase("null")){
					if(operational.get(0).getReleaseSet().get(i).getLevel1().equalsIgnoreCase(domainName)){
						int id = operational.get(0).getReleaseSet().get(i).getLevelId();
						levelidlist.add(id);}}

				if(!domainName.equalsIgnoreCase("null") && !projectName.equalsIgnoreCase("null")){
					if(operational.get(0).getReleaseSet().get(i).getLevel1().equalsIgnoreCase(domainName) &&
							operational.get(0).getReleaseSet().get(i).getLevel2().equalsIgnoreCase(projectName)	){
						int id = operational.get(0).getReleaseSet().get(i).getLevelId();
						levelidlist.add(id);}}
			}

		}
		return levelidlist;
	}

	public static List<Integer> getLevelIds(String dashboardName,String owner) {

		/*if(level1.equalsIgnoreCase("")){
		return null;//return empty value when level1 value is empty
	}*/		
		List<OperationalDashboardVO> operational = new ArrayList<OperationalDashboardVO>();
		List<Integer> levelidlist= new ArrayList<Integer>();
		String query = "{},{_id:0,dashboardName:1,owner:1,releaseSet:1}";
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("dashboardName").is(dashboardName));
		query1.addCriteria(Criteria.where("owner").is(owner));
		try {
			operational = getMongoOperation().find(query1,
					OperationalDashboardVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		for(int i=0; i<operational.get(0).getReleaseSet().size();i++){
			int id = operational.get(0).getReleaseSet().get(i).getLevelId();
			levelidlist.add(id);
		}
		return levelidlist;
	}
	public static List<Integer> getALMLevelIds(String level1,String level2,String level3){

		/*if(level1.equalsIgnoreCase("")){
		return null;//return empty value when level1 value is empty
	}*/
		String query = "{},{_id:0}";
		List<LevelItemsVO> levelItems= new ArrayList<LevelItemsVO>();	
		Query query1 = new BasicQuery(query);

		if(!level3.equalsIgnoreCase("")){	    	 
			query1.addCriteria(Criteria.where("level1").is(level1).andOperator(
					Criteria.where("level2").is(level2),Criteria.where("level3").is(level3)));
		}else if(!level2.equalsIgnoreCase("")){
			query1.addCriteria(Criteria.where("level1").is(level1).andOperator(
					Criteria.where("level2").is(level2)));
		}else if(!level1.equalsIgnoreCase("")){
			query1.addCriteria(Criteria.where("level1").is(level1));
		}

		try {
			levelItems =getMongoOperation().find(query1, LevelItemsVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}	 		 		

		List<Integer> levelIDs = fetchLevelIDs(levelItems);


		return levelIDs;
	}

	private static List<Integer> fetchLevelIDs(List<LevelItemsVO> levelItems){

		List<Integer> levelIDList = new ArrayList<Integer>();
		for(int i=0;i<levelItems.size();i++){
			LevelItemsVO lvlItemVO = levelItems.get(i);
			int levelID = lvlItemVO.getLevelId();
			levelIDList.add(levelID);			
		}
		return levelIDList;

	}
	
public static List<String> getLevelIdDefects(String dashboardName,String owner) {
		
		List<Integer> levelIdList = getLevelIds(
				dashboardName, owner);
		
		List<DefectVO> reqList = new ArrayList<DefectVO>();
		List<String> levellist = new ArrayList<String>();
		LookupOperation lookupp = LookupOperation.newLookup()
	    .from("levelId").localField("levelId")
	    .foreignField("levelId").as("duplication");
		
		MatchOperation match = new MatchOperation(Criteria.where(
	    "duplication.levelId").in(levelIdList));
		
		GroupOperation group = new GroupOperation(
				Fields.fields("defectId").and("duplication.level2"));
		
		Aggregation agg = Aggregation.newAggregation(lookupp, match,
				group.
	            push(new BasicDBObject
	                   ("defectId", "$defectId").append
	                   ("_id", "$_id")).as("duplication"));

		try {
			reqList = getMongoOperation().aggregate(agg, "Defects",
					DefectVO.class).getMappedResults();
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		for(int i=0; i<reqList.size();i++)
			{	
		levellist.add(reqList.get(i).getDuplication().get(0).get_id());
			}
			return levellist;
		
	}

/*public static List<String> getLevelIdDesign(String dashboardName,String owner){
	
	List<Integer> levelIdList = getLevelIds(
			dashboardName, owner);
	
	List<TestCaseVO> reqList = null;
	List<String> levellist = new ArrayList<String>();
	LookupOperation lookupp = LookupOperation.newLookup()
    .from("levelId").localField("levelId")
    .foreignField("levelId").as("duplication");
	
	MatchOperation match = new MatchOperation(Criteria.where(
    "duplication.levelId").in(levelIdList));
	
	GroupOperation group = new GroupOperation(
			Fields.fields("testID").and("duplication.level2"));
	
	Aggregation agg = Aggregation.newAggregation(lookupp, match,
			group.
            push(new BasicDBObject
                   ("testID", "$testID").append
                   ("_id", "$_id")).as("duplication"));

	try {
		reqList = getMongoOperation().aggregate(agg, "TestCases",
				TestCaseVO.class).getMappedResults();
	} catch (NumberFormatException | BaseException | BadLocationException e) {
		// TODO Auto-generated catch block
		logger.error(e.getMessage());
	}

	for(int i=0; i<reqList.size();i++)
		{	
	levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
	
	return levellist;
	
}*/

/*public static List<String> getLevelIdExecution(String dashboardName,String owner){
	
	List<Integer> levelIdList = getLevelIds(
			dashboardName, owner);
	
	List<TestExecutionVO> reqList = null;
	List<String> levellist = new ArrayList<String>();
	LookupOperation lookupp = LookupOperation.newLookup()
    .from("levelId").localField("levelId")
    .foreignField("levelId").as("duplication");
	
	MatchOperation match = new MatchOperation(Criteria.where(
    "duplication.levelId").in(levelIdList));
	
	GroupOperation group = new GroupOperation(
			Fields.fields("testID").and("duplication.level2"));
	
	Aggregation agg = Aggregation.newAggregation(lookupp, match,
			group.
            push(new BasicDBObject
                   ("testID", "$testID").append
                   ("_id", "$_id")).as("duplication"));

	try {
		reqList = getMongoOperation().aggregate(agg, "TestExecution",
				TestExecutionVO.class).getMappedResults();
	} catch (NumberFormatException | BaseException | BadLocationException e) {
		// TODO Auto-generated catch block
		logger.error(e.getMessage());
	}

	for(int i=0; i<reqList.size();i++)
		{	
	levellist.add(reqList.get(i).getDuplication().get(0).get_id());
		}
	
	return levellist;
	
}*/

	

}