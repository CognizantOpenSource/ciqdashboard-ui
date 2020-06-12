package com.idashboard.admin.service;

import java.io.InputStream;
import java.util.List;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.vo.UserCountVO;
import com.idashboard.admin.vo.UserProjectVO;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.common.vo.DomainVO;
import com.idashboard.lifecycle.vo.BuildTotalVO;
import com.sun.jersey.multipart.FormDataParam;;

public interface UserManagementService {
	
	
	public List<UserVO> getUserList(String authString);
	public List<DomainVO> getprojectsforadminaccess(String authString);
	public List<DomainVO> getjiraprojectsforadminaccess(String authString);
	
	public int CreateUser(String authString,
			String userId, String password,String userName, String email,
			String mobileNum, boolean isLadp);
	
	public int UpdateUser(String authString, String userId,String userName, String email,
			 String mobileNum);
	
	public int DeleteUserInfo(String authString, String userId);
	
	public int UploadUserImg(String authString,InputStream userImg, String profileFileName);
	
	public int UpdateUserRole(String authString, String userId, String role);
	
	public int RemoveLogo(String authString, String userId);
	
	public int AddLogo(String authString, String orgName,InputStream orgLogo,String usersel,
			 String profileFileName);
	
	public int UpdateUserInfo(String authString, String data);
	
	public int SaveAdminProjectAccess(String authString,String userId, List<String> selectedProjects);
	
	public int UpdateDashboardsInfoInUser(String authString, String userId);
	
	public List<UserVO> GetLoginRequestsCount(String authString);
	
	public int UpdateLoginRequests(String authString, String output);
	
	public Object[] GetActiveUsersCount(String authString);
	
	public Object[] GetInActiveUsersCount(String authString);
	
	public List<UserCountVO> GetUserCount(String authString);
	
	public List<UserVO> GetLockedAccountCount(String authString);
	
	public int GetInactivateUsers(String authString, String output);
	
	public int GetactivateUsers(String authString, String output);
	
	public int GetLockRequests(String authString, String output);
	
	public int SaveNewpassword(String authString, String oldPassword, String newPassword);
	
	
	
	
	
	
	
	

}
