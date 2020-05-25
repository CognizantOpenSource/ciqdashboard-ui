package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "IdashboardSession")
public class IdashboardSession {

	private String userId;
	private String sessionId;
	private Long timestamp;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public Long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}
	
	
}
