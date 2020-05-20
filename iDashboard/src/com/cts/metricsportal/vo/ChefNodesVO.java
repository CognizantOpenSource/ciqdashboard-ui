package com.cts.metricsportal.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
//import java.util.ArrayList;
//import java.util.List;

@Document(collection = "nodes") 
public class ChefNodesVO {

	private String name;
	private String envname;
	private String platform;
	private String hostname;
	private String local_hostname;
	private String public_hostname;
	private String local_ipv4;
	private String public_ipv4;
	private String fqdn;
	private String domain;
	private String os;
	private String uptime;
	private String idletime;
	private List<String> recipes =  new ArrayList<String>();

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPlatform() {
		return platform;
	}
	public String getEnvname() {
		return envname;
	}
	public void setEnvname(String envname) {
		this.envname = envname;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public String getHostname() {
		return hostname;
	}
	public void setHostname(String hostname) {
		this.hostname = hostname;
	}
	public String getLocal_hostname() {
		return local_hostname;
	}
	public void setLocal_hostname(String local_hostname) {
		this.local_hostname = local_hostname;
	}
	public String getPublic_hostname() {
		return public_hostname;
	}
	public void setPublic_hostname(String public_hostname) {
		this.public_hostname = public_hostname;
	}
	public String getLocal_ipv4() {
		return local_ipv4;
	}
	public void setLocal_ipv4(String local_ipv4) {
		this.local_ipv4 = local_ipv4;
	}
	public String getPublic_ipv4() {
		return public_ipv4;
	}
	public void setPublic_ipv4(String public_ipv4) {
		this.public_ipv4 = public_ipv4;
	}
	public String getFqdn() {
		return fqdn;
	}
	public void setFqdn(String fqdn) {
		this.fqdn = fqdn;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public String getOs() {
		return os;
	}
	public void setOs(String os) {
		this.os = os;
	}
	public List<String> getRecipes() {
		return recipes;
	}
	public void setRecipes(List<String> recipes) {
		this.recipes = recipes;
	}
	public String getUptime() {
		return uptime;
	}
	public void setUptime(String uptime) {
		this.uptime = uptime;
	}
	public String getIdletime() {
		return idletime;
	}
	public void setIdletime(String idletime) {
		this.idletime = idletime;
	}
	
}
