package com.idashboard.login.controller;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.idashboard.admin.vo.UserVO;
import com.idashboard.login.service.LoginService;
import com.idashboard.login.serviceImpl.LoginServiceImpl;

@Path("/logincontroller")
public class LoginController {
	
	LoginService Loginservice = new LoginServiceImpl();
	
	@POST
	@Path("/authentication")
	@Produces(MediaType.APPLICATION_JSON)
	public UserVO getUserInfo(@HeaderParam("Authorization") String authString) {
		UserVO userInfo = new UserVO();
		userInfo = Loginservice.GetUserInfo(authString);
		return userInfo;
	}
	
	@GET
	@Path("/lockAccount")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean SetAcoountlock(@HeaderParam("Authorization") String authString) {
		boolean Acctlocked = false;
		Acctlocked = Loginservice.SetAcoountlock(authString);
		return Acctlocked;
	}
	
	@POST
	@Path("/signup")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int signup(@QueryParam("userId") String userId, @QueryParam("password") String password,
			@QueryParam("userName") String userName, @QueryParam("email") String email,
			@QueryParam("mobileNum") String mobileNum) {
		
		int count = 0;
		count=Loginservice.SignupUser(userId, password, userName, email, mobileNum);
		return count;
		
	}
	
	@POST
	@Path("/Resetpassword")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int Resetpassword(@HeaderParam("Authorization") String authString, String data) {
		
		int count=0;
		count=Loginservice.Resetpassword(authString, data);
		return count;
	}

}
