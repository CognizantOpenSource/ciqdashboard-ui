package com.cts.metricsportal.dao;

import javax.swing.text.BadLocationException;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.vo.IdashboardSession;
import com.cts.metricsportal.vo.UserVO;

public class SessionMongoOperation extends BaseMongoOperation {

	private IdashboardSession sess;
	public IdashboardSession getSessionByUser(String userId)
	{
		Query sessionquery = new Query();
		sessionquery.addCriteria(Criteria.where("userId").is(userId));
		try {
			sess =  getMongoOperation().find(sessionquery, IdashboardSession.class).get(0); //list.get(i);
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return sess;
	}
	
	public int saveSessionUser(IdashboardSession session)
	{
		String userId = session.getUserId();
		
		Query sessionquery = new Query();
		sessionquery.addCriteria(Criteria.where("userId").is(userId));
		
		try {
			IdashboardSession getExistingSession = getMongoOperation().findOne(sessionquery, IdashboardSession.class);
			if(getExistingSession != null)
			{
				Update update = new Update();
				update.set("sessionId", session.getSessionId());
				update.set("timestamp", session.getTimestamp());
				getMongoOperation().updateFirst(sessionquery, update, IdashboardSession.class);
			}
			else {
				getMongoOperation().save(session);
			}
			
		} catch (NumberFormatException | BaseException | BadLocationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return 1;
	}
}
