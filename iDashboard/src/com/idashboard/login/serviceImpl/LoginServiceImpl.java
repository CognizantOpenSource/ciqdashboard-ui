package com.idashboard.login.serviceImpl;

import org.apache.log4j.Logger;

import com.idashboard.admin.vo.UserVO;
import com.idashboard.login.dao.LoginMongoInterface;
import com.idashboard.login.daoImpl.LoginMongoInterfaceImpl;
import com.idashboard.login.service.LoginService;

public class LoginServiceImpl implements LoginService {
	
	LoginMongoInterface LoginOperation = new LoginMongoInterfaceImpl();
	static final Logger logger = Logger.getLogger(LoginServiceImpl.class);
	
	@Override
	public UserVO GetUserInfo(String authString) {
		
		UserVO userInfo = new UserVO();
		userInfo = LoginOperation.Login_ExecuteQuery_GetUserInfo(authString);
		return userInfo;
	
	}
	
	@Override
	public boolean SetAcoountlock(String authString) {
	
		boolean Acctlocked = false;
		Acctlocked= LoginOperation.Login_ExecuteQuery_SetAcoountlock(authString);
		return Acctlocked;
	}
	
	@Override
	public int SignupUser(String userId, String password,String userName, String email,
			String mobileNum) {
		
		int count = 0;
		count=LoginOperation.Login_ExecuteQuery_SignupUser(userId, password, userName, email, mobileNum);
		return count;
		
	};
	
	@Override
	public int Resetpassword(String authString, String data) {
		
		int count=0;
		count=LoginOperation.Login_ExecuteQuery_Resetpassword(authString, data);
		return count;
	}
	

}
