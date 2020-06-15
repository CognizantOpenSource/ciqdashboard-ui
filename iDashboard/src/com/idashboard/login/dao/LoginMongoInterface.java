package com.idashboard.login.dao;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import com.idashboard.admin.vo.UserVO;

public interface LoginMongoInterface {
	
	public UserVO Login_ExecuteQuery_GetUserInfo( String authString);
	
	public boolean Login_ExecuteQuery_SetAcoountlock(String authString);
	
	public int Login_ExecuteQuery_SignupUser(String userId, String password,String userName, String email,
			String mobileNum);
	
	public int Login_ExecuteQuery_Resetpassword(String authString, String data);

}
