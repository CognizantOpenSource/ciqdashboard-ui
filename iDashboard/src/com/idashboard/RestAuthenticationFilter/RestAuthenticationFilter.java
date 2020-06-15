package com.idashboard.RestAuthenticationFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
	private static final List<String> URL_NOT_TO_AUTHENTICATE = new ArrayList<String>();
	
	//add all urls which do not need authentication
	static {
		URL_NOT_TO_AUTHENTICATE.add("/jsonServices/logout");
		URL_NOT_TO_AUTHENTICATE.add("/jsonServices/lockAccount");
		URL_NOT_TO_AUTHENTICATE.add("/jsonServices/Resetpassword");
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain filter) throws IOException, ServletException {
		
		
		if (request instanceof HttpServletRequest) {
			HttpServletRequest httpServletRequest = (HttpServletRequest) request;
			HttpServletResponse httpServletResponse = (HttpServletResponse) response;

			String authCredentials = httpServletRequest.getHeader(AUTHENTICATION_HEADER);
			String dashboardName = httpServletRequest.getParameter(AUTHENTICATION_DASHBOARD_NAME);
			String domainName = httpServletRequest.getParameter(AUTHENTICATION_DOMAIN);
			String projectName = httpServletRequest.getParameter(AUTHENTICATION_PROJECT);
			Boolean isPlugin = false; //for future referenceas in bots-653731
			Integer authenticationStatus = AuthenticationService.AUTH_FAILED;;
			boolean authenticationProject = false;
			
			//System.out.println(httpServletRequest.getPathInfo());
			
			// --done by Adhish 653731
			if(httpServletRequest.getPathInfo().contains("/logincontroller/signup")
				||	httpServletRequest.getPathInfo().contains("/authentication") || 
				httpServletRequest.getPathInfo().contains("/licenseDetails") ||
				httpServletRequest.getPathInfo().contains("/getldapstatus") ||
				httpServletRequest.getPathInfo().contains("/lockAccount") ||
				httpServletRequest.getPathInfo().contains("/reportDataServices") ||
				
				(!httpServletRequest.getPathInfo().contains("/qbotServices/checkQbotHome")) && httpServletRequest.getPathInfo().contains("/qbotServices")){
				
				authenticationStatus = AuthenticationService.OK;
			}
			
			// Admin check
			
			else if(httpServletRequest.getPathInfo().contains("/jsonServices/admin")
		|| httpServletRequest.getPathInfo().contains("/jsonServices/createAdminUser"))
			{
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationStatus = authenticationService.checkAdminUser(authCredentials);
				
			}
			
			//project access check
			else if(dashboardName != null && domainName != null && projectName != null){
				
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationProject = authenticationService.authenticateProjects(authCredentials,dashboardName,domainName,projectName);
				if(authenticationProject)
					authenticationStatus = AuthenticationService.OK;
			}
			
			// operational layer access 
			else if(httpServletRequest.getPathInfo().contains("/operationalServices")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationStatus = authenticationService.checkOperationalLayerAccess(authCredentials);
			}
			
			// LC layer access
			else if(httpServletRequest.getPathInfo().contains("/lifeCycleServices")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationStatus = authenticationService.checkLifecycleLayerAccess(authCredentials);
				
			}
			
			else if(httpServletRequest.getPathInfo().contains("/qbotServices/checkQbotHome")){
				
				AuthenticationService authenticationService = new AuthenticationService();
				authenticationStatus = authenticationService.checkIntelligentLayerAccess(authCredentials);
				
			}
			
			
			//other services
			else{
				for(String url : URL_NOT_TO_AUTHENTICATE)
				{
					if(httpServletRequest.getPathInfo().equals(url)) {
						authenticationStatus = AuthenticationService.OK;
						break;
					}
				}
				if(authenticationStatus != AuthenticationService.OK) {
					//System.out.println(httpServletRequest.getPathInfo());
					 AuthenticationService authenticationService = new AuthenticationService();
					 authenticationStatus = authenticationService.authenticate(authCredentials, isPlugin);	
				}
			
			}
			
			if (authenticationStatus == AuthenticationService.OK) {
				filter.doFilter(request, httpServletResponse);
			}
			else if(authenticationStatus == AuthenticationService.SESSION_TIMEOUT) {
				if(response instanceof HttpServletResponse){
					httpServletResponse.sendError(HttpServletResponse.SC_NON_AUTHORITATIVE_INFORMATION,
							"Session Timeout");
				}
			}
			else if (authenticationStatus == AuthenticationService.OTHER_ACTIVE_SESSION) {
				if (response instanceof HttpServletResponse) {
					httpServletResponse.sendError(HttpServletResponse.SC_CONFLICT,
							"Another Active Session");
				}
			}
			else if (authenticationStatus == AuthenticationService.UNKNOWN_EXCEPTION) {
				if (response instanceof HttpServletResponse) {
					httpServletResponse.sendError(HttpServletResponse.SC_EXPECTATION_FAILED,
							"Unknown Exception in Auth Service");
				}
			}
			else {
				if (response instanceof HttpServletResponse) {
					
					httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
					httpServletResponse.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
					System.out.println(httpServletResponse.getStatus());
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
