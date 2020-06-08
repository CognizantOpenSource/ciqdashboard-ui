package com.idashboard.admin.dao;

import java.io.InputStream;
import java.util.List;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.vo.UserCountVO;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.common.vo.DomainVO;
import com.sun.jersey.multipart.FormDataParam;

public interface UserManagementMongoInterface {
	
	public List<UserVO> UserManagement_ExecuteQuery_GetUserList();
	public List<DomainVO> UserManagement_ExecuteQuery_GetProjetList();
	public List<DomainVO> UserManagement_ExecuteQuery_JiraGetProjetList();
	
	
	public int UserManagement_ExecuteQuery_CreateUser(String authString,
			String userId, String password,String userName, String email,
			String mobileNum, boolean isLadp,boolean adminstatus,AuthenticationService authenticateService);
	
	public int UserManagement_ExecuteQuery_UpdateUser(String authString, String userId,String userName, String email,
			 String mobileNum,boolean adminstatus);
	
	public int UserManagement_ExecuteQuery_UploadUserImage(String authString,InputStream userImg, String profileFileName,String userId);
	
	public int UserManagement_ExecuteQuery_UpdateUserRole(String authString, String userId, String role);
	
	public int UserManagement_ExecuteQuery_RemoveLogo(String authString, String userId);
	
	public int UserManagement_ExecuteQuery_AddLogo(String authString, String orgName,InputStream orgLogo,String usersel,
			 String profileFileName);
	
	public int UserManagement_ExecuteQuery_UpdateUserInfo(String authString, String data);
	
	public int UserManagement_ExecuteQuery_SaveAdminProjectAccess(String authString,
			String userId, List<String> selectedProjects);
	
	public int UserManagement_ExecuteQuery_UpdateDashboards(String authString, String userId);
	
	public int UserManagement_ExecuteQuery_DeleteUserInfo(String authString, String userId);
	
	public List<UserVO> UserManagement_ExecuteQuery_GetLoginRequests(String authString);
	
	public Object[] UserManagement_ExecuteQuery_GetActiveUsersCount(String authString);
	
	public Object[] UserManagement_ExecuteQuery_GetInActiveUsersCount(String authString);
	
	public List<UserCountVO> UserManagement_ExecuteQuery_GetUserCount(String authString);
	
	public List<UserVO> UserManagement_ExecuteQuery_GetLockedAccountCount(String authString);
	
	public int UserManagement_ExecuteQuery_GetInactivateUsers(String authString, String output);
	
	public int UserManagement_ExecuteQuery_GetactivateUsers(String authString, String output);
	
	public int UserManagement_ExecuteQuery_GetLockRequests(String authString, String output);
	
	public int UserManagement_ExecuteQuery_LoginRequests(String authString, String output);

}
