package com.idashboard.lifecycle.daoImpl;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.idashboard.lifecycle.dao.FortifyMongoInterface;
import com.idashboard.lifecycle.vo.CodeAnalysisVO;
import com.idashboard.lifecycle.vo.FortifyVO;
import com.idashboard.lifecycle.vo.FortifyVersionsVO;

public class FortifyMongoOperationImpl extends BaseMongoOperation implements FortifyMongoInterface {

	@SuppressWarnings("unchecked")
	public List<String> Fortify_ExecuteQuery_getProjectNames() {
		List<String> projectNames = null;
		try {
			projectNames = getMongoOperation().getCollection("LCfortifyDetails").distinct("projectName");
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			e.printStackTrace();
		}
		return projectNames;
	}

	
	@Override
	public List<String> Fortify_ExecuteQuery_getVersionDetails(String selectedFortifyProject) {

		List<FortifyVO> fortifyList = new ArrayList<FortifyVO>();
		List<String> fortifyVList = new ArrayList<String>();
		List<FortifyVersionsVO> fortifyList1 = new ArrayList<FortifyVersionsVO>();
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("projectName").in(selectedFortifyProject));
		try {

			fortifyList = getMongoOperation().find(query1, FortifyVO.class);

			for (FortifyVO fortifyval : fortifyList) {
				fortifyList1 = fortifyval.getVersions();
				for (FortifyVersionsVO fortifyVersionsVO : fortifyList1) {
					fortifyVList.add(fortifyVersionsVO.getVersionId());
				}
			}
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			e.printStackTrace();
		}
		return fortifyVList;

	}

	@Override
	public List<Integer> Fortify_ExecuteQuery_getFortifyHomeMetrics(String selectedFortifyProject,
			String selectedFortifyVersion) {

		int totalScans = 0;
		int files = 0;
		int numFilesWithIssues = 0;
		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		List<Integer> fortifyHomeDetails = new ArrayList<Integer>();

		Query query1 = new Query();
		try {
			query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));
			query1.addCriteria(Criteria.where("versions.versionId").is(selectedFortifyVersion));

			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);

			if (fortifyDetails.size() != 0) {
				for (int i = 0; i < fortifyDetails.get(0).getVersions().size(); i++) {
					if (fortifyDetails.get(0).getVersions().get(i).getVersionId()
							.equalsIgnoreCase(selectedFortifyVersion)) {

						totalScans = fortifyDetails.get(0).getVersions().get(i).getTotalScans();
						files = fortifyDetails.get(0).getVersions().get(i).getFILES();
						numFilesWithIssues = fortifyDetails.get(0).getVersions().get(i).getNumFilesWithIssues();
					}

				}
			}
			fortifyHomeDetails.add(totalScans);
			fortifyHomeDetails.add(files);
			fortifyHomeDetails.add(numFilesWithIssues);

		} catch (NumberFormatException | BaseException | BadLocationException e) {
			e.printStackTrace();
		}
		return fortifyHomeDetails;
	}

	@Override
	public List<FortifyVO> Fortify_ExecuteQuery_getFortifyMetrics(String selectedFortifyProject,
			String selectedFortifyVersion) {
		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));
		query1.addCriteria(Criteria.where("versions.versionId").is(selectedFortifyVersion));

		try {
			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			e.printStackTrace();
		}
		return fortifyDetails;
	}

	@Override
	public List<FortifyVO> Fortify_ExecuteQuery_getFortifyLast3VersionChart(String selectedFortifyProject) {

		List<FortifyVO> fortifyDetails = new ArrayList<FortifyVO>();
		Query query1 = new Query();
		query1.addCriteria(Criteria.where("projectName").is(selectedFortifyProject));

		try {
			fortifyDetails = getMongoOperation().find(query1, FortifyVO.class);
		} catch (NumberFormatException | BaseException | BadLocationException e) {

			e.printStackTrace();
		}
		return fortifyDetails;
	}

}
