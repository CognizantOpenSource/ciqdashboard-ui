package com.cts.metricsportal.util;

import java.util.Date;
import java.util.Random;

import javax.xml.bind.DatatypeConverter;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;

import com.cognizant.idashboard.iAuthentication;
import com.cts.metricsportal.dao.SessionMongoOperation;
import com.cts.metricsportal.vo.IdashboardSession;
import com.cts.metricsportal.vo.UserVO;

public class SessionHandler {
	
	static final private String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	final private Random rng = new SecureRandom();
	
	SessionMongoOperation sessionOperation = new SessionMongoOperation();
	
	public String createNewSesion(String userId, Boolean isPlugin) {
		IdashboardSession session = new IdashboardSession();
		String sessionId = generateSessionKey();
			
		if (isPlugin)
			userId += "_plugin";
		session.setUserId(userId);
		session.setSessionId(sessionId);
		session.setTimestamp(getRefresh());
		sessionOperation.saveSessionUser(session);
		return sessionId;
	}
	
	public IdashboardSession updateCurrentSession(IdashboardSession session) {
		session.setTimestamp(getRefresh());
		sessionOperation.saveSessionUser(session);
		return session;
	}
	
	public Long getRefresh() {
		return new Date().getTime();
	}

	public boolean isExpired(IdashboardSession session, Boolean isPlugin) {
		Long diff = new Date().getTime() - session.getTimestamp();
		int mintues = (int) (diff / 60000);
		if(isPlugin)
			return mintues >= 60;
		return mintues >= 20;
	}
	
	public String generateSessionKey() {
		int length = 16;
		StringBuilder sb = new StringBuilder();
		while (length > 0) {
			sb.append(randomChar());
			length--;
		}
		return sb.toString();
	}
	
	public IdashboardSession getSession(String userId, Boolean isPlugin) {
		if (isPlugin)
			userId += "_plugin";
		return sessionOperation.getSessionByUser(userId);
	}
	public void logoutCurrentSession(UserVO userInfo) {
		IdashboardSession session = sessionOperation.getSessionByUser(userInfo.getUserId());
		session.setTimestamp(-1L);
		sessionOperation.saveSessionUser(session);
	}
	
	private char randomChar() {
		return ALPHABET.charAt(this.rng.nextInt(ALPHABET.length()));
	}

}
