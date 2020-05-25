package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

public class FortifyVersionsVO {
	
	
	public String versionId;
	public Date versionCreationDate;
	public double PercentCriticalPriorityIssuesAudited;
	public double PercentCriticalPriorityIssues; 
	public double PercentHighPriorityIssuesAudited;
	public double PercentHighPriorityIssues; 
	public double PercentAudited;
	public double Issues; 
	public double percentconfigurationIssues;
	public double percentCriticalExposure;
	public double FortifySecurityRating;
	public double TotalRemediationEffort; 
	public double TotalRemediationEffortCritical;
	public double TotalRemediationEffortHigh; 
	public double TotalRemediationEffortMedium;
	public double TotalRemediationEffortLow;
	public int FILES;
	public int NumFilesWithIssues;
	public int TotalScans;
	
	
	public Date getVersionCreationDate() {
		return versionCreationDate;
	}
	public void setVersionCreationDate(Date versionCreationDate) {
		this.versionCreationDate = versionCreationDate;
	}
	public String getVersionId() {
		return versionId;
	}
	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}
	public double getPercentCriticalPriorityIssuesAudited() {
		return PercentCriticalPriorityIssuesAudited;
	}
	public void setPercentCriticalPriorityIssuesAudited(double percentCriticalPriorityIssuesAudited) {
		PercentCriticalPriorityIssuesAudited = percentCriticalPriorityIssuesAudited;
	}
	public double getPercentCriticalPriorityIssues() {
		return PercentCriticalPriorityIssues;
	}
	public void setPercentCriticalPriorityIssues(double percentCriticalPriorityIssues) {
		PercentCriticalPriorityIssues = percentCriticalPriorityIssues;
	}
	public double getPercentHighPriorityIssuesAudited() {
		return PercentHighPriorityIssuesAudited;
	}
	public void setPercentHighPriorityIssuesAudited(double percentHighPriorityIssuesAudited) {
		PercentHighPriorityIssuesAudited = percentHighPriorityIssuesAudited;
	}
	public double getPercentHighPriorityIssues() {
		return PercentHighPriorityIssues;
	}
	public void setPercentHighPriorityIssues(double percentHighPriorityIssues) {
		PercentHighPriorityIssues = percentHighPriorityIssues;
	}
	public double getPercentAudited() {
		return PercentAudited;
	}
	public void setPercentAudited(double percentAudited) {
		PercentAudited = percentAudited;
	}
	public double getIssues() {
		return Issues;
	}
	public void setIssues(double issues) {
		Issues = issues;
	}
	public double getPercentconfigurationIssues() {
		return percentconfigurationIssues;
	}
	public void setPercentconfigurationIssues(double percentconfigurationIssues) {
		this.percentconfigurationIssues = percentconfigurationIssues;
	}
	public double getPercentCriticalExposure() {
		return percentCriticalExposure;
	}
	public void setPercentCriticalExposure(double percentCriticalExposure) {
		this.percentCriticalExposure = percentCriticalExposure;
	}
	public double getFortifySecurityRating() {
		return FortifySecurityRating;
	}
	public void setFortifySecurityRating(double fortifySecurityRating) {
		FortifySecurityRating = fortifySecurityRating;
	}
	public double getTotalRemediationEffort() {
		return TotalRemediationEffort;
	}
	public void setTotalRemediationEffort(double totalRemediationEffort) {
		TotalRemediationEffort = totalRemediationEffort;
	}
	public double getTotalRemediationEffortCritical() {
		return TotalRemediationEffortCritical;
	}
	public void setTotalRemediationEffortCritical(double totalRemediationEffortCritical) {
		TotalRemediationEffortCritical = totalRemediationEffortCritical;
	}
	public double getTotalRemediationEffortHigh() {
		return TotalRemediationEffortHigh;
	}
	public void setTotalRemediationEffortHigh(double totalRemediationEffortHigh) {
		TotalRemediationEffortHigh = totalRemediationEffortHigh;
	}
	public double getTotalRemediationEffortMedium() {
		return TotalRemediationEffortMedium;
	}
	public void setTotalRemediationEffortMedium(double totalRemediationEffortMedium) {
		TotalRemediationEffortMedium = totalRemediationEffortMedium;
	}
	public double getTotalRemediationEffortLow() {
		return TotalRemediationEffortLow;
	}
	public void setTotalRemediationEffortLow(double totalRemediationEffortLow) {
		TotalRemediationEffortLow = totalRemediationEffortLow;
	}
	public int getFILES() {
		return FILES;
	}
	public void setFILES(int fILES) {
		FILES = fILES;
	}
	public int getNumFilesWithIssues() {
		return NumFilesWithIssues;
	}
	public void setNumFilesWithIssues(int numFilesWithIssues) {
		NumFilesWithIssues = numFilesWithIssues;
	}
	public int getTotalScans() {
		return TotalScans;
	}
	public void setTotalScans(int totalScans) {
		TotalScans = totalScans;
	}
	
	
	
}
