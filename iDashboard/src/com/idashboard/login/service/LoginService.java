package com.idashboard.login.service;

import com.idashboard.admin.vo.UserVO;

public interface LoginService {
	
	public UserVO GetUserInfo(String authString);
	public boolean SetAcoountlock(String authString);
	public int SignupUser(String userId, String password,String userName, String email,
			String mobileNum);
	
	public int Resetpassword(String authString, String data);

}
