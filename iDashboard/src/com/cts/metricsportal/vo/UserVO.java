package com.cts.metricsportal.vo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userInfo")
public class UserVO {

	private String userId = null;
	private String password = null;
	private String userName = null;
	private String email = null;
	private String mobileNum = null;
	private String role = null;
	private String defaultMenuType = null;
	private List<UserProjectVO> selectedProjects = null;
	boolean isLdap = false;
	boolean isAdmin = false;
	boolean isOperational = false;
	boolean isLifeCycle = false;
	boolean isQbot = false;
	boolean isAccessible = false;
	boolean authStatus = false;
	boolean isActive = false;
	boolean acLock = false;
	boolean isCoEDashboard = false;
	boolean isRiskCompliance = false;
	boolean isCustomMetrics = false;
	
	String profilePhoto = null;
	Date lastNotifiedTimeStamp = null;

	String orgName = null;
	String orgLogo = null;
	String userImg = null;
	boolean ispassReset = true;
	boolean isEnbPublicOpt = false;

	public Date getLastNotifiedTimeStamp() {
		return lastNotifiedTimeStamp;
	}

	public void setLastNotifiedTimeStamp(Date lastNotifiedTimeStamp) {
		this.lastNotifiedTimeStamp = lastNotifiedTimeStamp;
	}

	public boolean isAcLock() {
		return acLock;
	}

	public void setAcLock(boolean acLock) {
		this.acLock = acLock;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getOrgLogo() {
		return orgLogo;
	}

	public void setOrgLogo(String orgLogo) {
		this.orgLogo = orgLogo;
	}

	public String getProfilePhoto() {
		return profilePhoto;
	}

	public void setProfilePhoto(String profilePhoto) {
		this.profilePhoto = profilePhoto;
	}

	public List<UserProjectVO> getSelectedProjects() {
		return selectedProjects;
	}

	public void setSelectedProjects(List<UserProjectVO> selectedProjects) {
		this.selectedProjects = selectedProjects;
	}

	public boolean isLdap() {
		return isLdap;
	}

	public void setLdap(boolean isLdap) {
		this.isLdap = isLdap;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public boolean isAuthStatus() {
		return authStatus;
	}

	public void setAuthStatus(boolean authStatus) {
		this.authStatus = authStatus;
	}

	public String getDefaultMenuType() {
		return defaultMenuType;
	}

	public void setDefaultMenuType(String defaultMenuType) {
		this.defaultMenuType = defaultMenuType;
	}

	public boolean isOperational() {
		return isOperational;
	}

	public void setOperational(boolean isOperational) {
		this.isOperational = isOperational;
	}

	public boolean isLifeCycle() {
		return isLifeCycle;
	}

	public void setLifeCycle(boolean isLifeCycle) {
		this.isLifeCycle = isLifeCycle;
	}

	public boolean isQbot() {
		return isQbot;
	}

	public void setQbot(boolean isQbot) {
		this.isQbot = isQbot;
	}

	public boolean isCoEDashboard() {
		return isCoEDashboard;
	}

	public void setCoEDashboard(boolean isCoEDashboard) {
		this.isCoEDashboard = isCoEDashboard;
	}

	public boolean isRiskCompliance() {
		return isRiskCompliance;
	}

	public void setRiskCompliance(boolean isRiskCompliance) {
		this.isRiskCompliance = isRiskCompliance;
	}

	public boolean isCustomMetrics() {
		return isCustomMetrics;
	}

	public void setCustomMetrics(boolean isCustomMetrics) {
		this.isCustomMetrics = isCustomMetrics;
	}

	

	public boolean isEnbPublicOpt() {
		return isEnbPublicOpt;
	}

	public void setEnbPublicOpt(boolean isEnbPublicOpt) {
		this.isEnbPublicOpt = isEnbPublicOpt;
	}

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}

	public boolean isAccessible() {
		return isAccessible;
	}

	public void setAccessible(boolean isAccessible) {
		this.isAccessible = isAccessible;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getUserImg() {
		return userImg;
	}

	public void setUserImg(String userImg) {
		this.userImg = userImg;
	}

	public boolean isIspassReset() {
		return ispassReset;
	}

	public void setIspassReset(boolean ispassReset) {
		this.ispassReset = ispassReset;
	}

}
