package com.cts.metricsportal.bo;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;

public class LayerAccess {
	
	public static String getUser(String authString) {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		return userId;
	}
	 //added by adhish for token authentication i.e token verified
	public static boolean authenticateToken(String authString) {
		boolean authStatus = true;
		return authStatus;
	}

	//these methods only return true i.e token verified --653731
	public static boolean getOperationalLayerAccess(String authString) {
		
		//boolean operationalAccess = UserEncrypt.checkOperationalLayerAccess(authString);
		return true;
	}
	public static boolean getAdminLayerAccess(String authString) {
		//AuthenticationService AuthServ = new AuthenticationService();
		//Integer adminstatus = AuthServ.checkAdminUser(authString);
		return true;
	}
}
