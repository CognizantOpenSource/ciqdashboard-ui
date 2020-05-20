package com.cts.metricsportal.RestAuthenticationFilter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RestAuthenticationFilter implements javax.servlet.Filter {
	public static final String AUTHENTICATION_HEADER = "Authorization";
	public static final String AUTHENTICATION_DASHBOARD_NAME = "dashboardName";
	public static final String AUTHENTICATION_DOMAIN = "domainName";
	public static final String AUTHENTICATION_PROJECT = "projectName";

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain filter) throws IOException, ServletException {
		
		
		if (request instanceof HttpServletRequest) {
			HttpServletRequest httpServletRequest = (HttpServletRequest) request;
			
			String authCredentials = httpServletRequest.getHeader(AUTHENTICATION_HEADER);
			String dashboardName = httpServletRequest.getParameter(AUTHENTICATION_DASHBOARD_NAME);
			String domainName = httpServletRequest.getParameter(AUTHENTICATION_DOMAIN);
			String projectName = httpServletRequest.getParameter(AUTHENTICATION_PROJECT);
					
			boolean authenticationStatus = false;
			boolean projectAccessStatus = false;
			boolean operationalAccessStatus = false;
			boolean LCAccessStatus = false;
			boolean adminStatus = false;
			boolean qbotAccessStatus = false;
			
			//System.out.println(httpServletRequest.getPathInfo());
			
			// skipping signup service
			if(httpServletRequest.getPathInfo().contains("/jsonServices/signup")
				||	httpServletRequest.getPathInfo().contains("/authentication") || 
				httpServletRequest.getPathInfo().contains("/licenseDetails") ||
				httpServletRequest.getPathInfo().contains("/getldapstatus") ||
				httpServletRequest.getPathInfo().contains("/lockAccount") ||
				httpServletRequest.getPathInfo().contains("/reportDataServices") ||
				

				(!httpServletRequest.getPathInfo().contains("/qbotServices/checkQbotHome")) && httpServletRequest.getPathInfo().contains("/qbotServices")){
				
				authenticationStatus =true;
			}
			
			// Admin check
			
			else if(httpServletRequest.getPathInfo().contains("/jsonServices/adminDetails")
		|| httpServletRequest.getPathInfo().contains("/jsonServices/createAdminUser")
					){
				
				AuthenticationService authenticationService = new AuthenticationService();
				boolean authentication = authenticationService.authenticate(authCredentials);
				
				if (authentication == true){

				adminStatus = authenticationService.checkAdminUser(authCredentials);
				authenticationStatus = adminStatus;}
				
				else{
					authenticationStatus = false;
				}
			}
			
			//project access check
			else if(dashboardName != null && domainName != null && projectName != null){
				
				AuthenticationService authenticationService = new AuthenticationService();
				boolean authentication = authenticationService.authenticate(authCredentials);
				
				if (authentication == true){

				projectAccessStatus = authenticationService.authenticateProjects(authCredentials,dashboardName,domainName,projectName);
				authenticationStatus = projectAccessStatus;}
				
				else{
					authenticationStatus = false;
				}
				
			}
			
			// operational layer access
			else if(httpServletRequest.getPathInfo().contains("/operationalServices")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				boolean authentication = authenticationService.authenticate(authCredentials);
				
				if (authentication == true){

				operationalAccessStatus = authenticationService.checkOperationalLayerAccess(authCredentials);
				authenticationStatus = operationalAccessStatus;}
				
				else{
					authenticationStatus = false;
				}
				
			}
			
			// LC layer access
			else if(httpServletRequest.getPathInfo().contains("/lifeCycleServices")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				boolean authentication = authenticationService.authenticate(authCredentials);
				
				if (authentication == true){

				LCAccessStatus = authenticationService.checkLCLayerAccess(authCredentials);
				authenticationStatus = LCAccessStatus;}
				
				else{
					authenticationStatus = false;
				}
				
			}
			
				else if(httpServletRequest.getPathInfo().contains("/qbotServices/checkQbotHome")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				boolean authentication = authenticationService.authenticate(authCredentials);
				
				if (authentication == true){

				qbotAccessStatus = authenticationService.checkIntelligentLayerAccess(authCredentials);
				authenticationStatus = qbotAccessStatus;}
				
				else{
					authenticationStatus = false;
				}
				
			}
			
			//other services
			else{
				
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationStatus = authenticationService.authenticate(authCredentials);
			}
			

			
			if (authenticationStatus) {
				filter.doFilter(request, response);
			} else {
				if (response instanceof HttpServletResponse) {
					HttpServletResponse httpServletResponse = (HttpServletResponse) response;
					httpServletResponse
							.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					httpServletResponse
							.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
					//System.out.println(httpServletResponse.getStatus());
					/*httpServletResponse.sendRedirect("");*/
				}
			}
		}
	}

	public void destroy() {
	}

	public void init(FilterConfig arg0) throws ServletException {
	}
}
