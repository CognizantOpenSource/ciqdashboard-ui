package com.cts.metricsportal.bo;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;

public class LayerAccess {
	
	public static boolean getLCLayerAccess(String authString) {
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		return LCAccess;
	}

	public static String getUser(String authString) {
		AuthenticationService UserEncrypt = new AuthenticationService();
		String userId = UserEncrypt.getUser(authString);
		return userId;
	}

	public static boolean getOperationalLayerAccess(String authString) {
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean operationalAccess = UserEncrypt
				.checkOperationalLayerAccess(authString);
		return operationalAccess;
	}
	public static boolean getAdminLayerAccess(String authString) {
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = AuthServ.checkAdminUser(authString);
		return adminstatus;
	}
}
