package com.idashboard.admin.serviceImpl;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.HeaderParam;

import org.apache.log4j.Logger;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.vo.UserCountVO;
import com.idashboard.admin.dao.UserManagementMongoInterface;
import com.idashboard.admin.daoImpl.UserManagementMongoOperationImpl;
import com.idashboard.admin.service.UserManagementService;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.common.vo.DomainVO;
import com.sun.jersey.multipart.FormDataParam;

public class UserManagementServiceImpl implements UserManagementService {

	UserManagementMongoInterface UserOperation = new UserManagementMongoOperationImpl();
	static final Logger logger = Logger.getLogger(UserManagementServiceImpl.class);

	@Override
	public List<UserVO> getUserList(String authString) {

		List<UserVO> list = new ArrayList<UserVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			list = UserOperation.UserManagement_ExecuteQuery_GetUserList();
		}

		return list;
	}

	@Override
	public List<DomainVO> getprojectsforadminaccess(String authString) {

		List<DomainVO> list = new ArrayList<DomainVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			list = UserOperation.UserManagement_ExecuteQuery_GetProjetList();
		}

		return list;
	}

	@Override
	public List<DomainVO> getjiraprojectsforadminaccess(String authString) {

		List<DomainVO> list = new ArrayList<DomainVO>();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			list = UserOperation.UserManagement_ExecuteQuery_JiraGetProjetList();
		}

		return list;
	}

	@Override
	public int CreateUser(String authString, String userId, String password, String userName, String email,
			String mobileNum, boolean isLadp) {

		int count = 0;
		AuthenticationService authenticateService = new AuthenticationService();

		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_CreateUser(authString, userId, password, userName, email,
					mobileNum, isLadp, adminstatus, authenticateService);

		}
		return count;

	}

	@Override
	public int UpdateUser(String authString, String userId, String userName, String email, String mobileNum) {

		int count = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_UpdateUser(authString, userId, userName, email, mobileNum,
					adminstatus);

		}
		return count;

	}

	@Override
	public int DeleteUserInfo(String authString, String userId) {

		int deleted = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			deleted = UserOperation.UserManagement_ExecuteQuery_DeleteUserInfo(authString, userId);
		}
		return deleted;
	}

	@Override
	public int UploadUserImg(String authString, InputStream userImg, String profileFileName) {

		int count = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		AuthenticationService AuthServ = new AuthenticationService();
		String userId = AuthServ.getUser(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_UploadUserImage(authString, userImg, profileFileName,
					userId);

		}
		return count;

	}

	@Override
	public int UpdateUserRole(String authString, String userId, String role) {

		int change = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			change = UserOperation.UserManagement_ExecuteQuery_UpdateUserRole(authString, userId, role);
		}
		return change;
	}

	@Override
	public int RemoveLogo(String authString, String userId) {

		int removed = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			removed = UserOperation.UserManagement_ExecuteQuery_RemoveLogo(authString, userId);
		}
		return removed;
	}

	@Override
	public int AddLogo(String authString, String orgName, InputStream orgLogo, String usersel, String profileFileName) {

		int removed = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			removed = UserOperation.UserManagement_ExecuteQuery_AddLogo(authString, orgName, orgLogo, usersel,
					profileFileName);
		}
		return removed;
	}

	@Override
	public int UpdateUserInfo(String authString, String data) {

		int update = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			update = UserOperation.UserManagement_ExecuteQuery_UpdateUserInfo(authString, data);
		}
		return update;
	}

	@Override
	public int SaveAdminProjectAccess(String authString, String userId, List<String> selectedProjects) {

		int update = 0;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			update = UserOperation.UserManagement_ExecuteQuery_SaveAdminProjectAccess(authString, userId,
					selectedProjects);
		}
		return update;
	}

	@Override
	public int UpdateDashboardsInfoInUser(String authString, String userId) {
		int update = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			update = UserOperation.UserManagement_ExecuteQuery_UpdateDashboards(authString, userId);
		}
		return update;
	}

	@Override
	public List<UserVO> GetLoginRequestsCount(String authString) {

		List<UserVO> userVO = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			userVO = UserOperation.UserManagement_ExecuteQuery_GetLoginRequests(authString);
		}
		return userVO;

	}
	
	@Override
	public int UpdateLoginRequests(String authString, String output) {
		int update = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			update = UserOperation.UserManagement_ExecuteQuery_LoginRequests(authString, output);
		}
		return update;
	}

	@Override
	public Object[] GetActiveUsersCount(String authString) {

		Object[] objArray = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			objArray = UserOperation.UserManagement_ExecuteQuery_GetActiveUsersCount(authString);
		}
		return objArray;
	}

	@Override
	public Object[] GetInActiveUsersCount(String authString) {

		Object[] objArray = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			objArray = UserOperation.UserManagement_ExecuteQuery_GetInActiveUsersCount(authString);
		}
		return objArray;
	}

	@Override
	public List<UserCountVO> GetUserCount(String authString) {

		List<UserCountVO> adminUserCount = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			adminUserCount = UserOperation.UserManagement_ExecuteQuery_GetUserCount(authString);
		}
		return adminUserCount;
	}

	@Override
	public List<UserVO> GetLockedAccountCount(String authString) {

		List<UserVO> UserLockedCount = null;
		boolean authenticateToken = LayerAccess.authenticateToken(authString);
		if (authenticateToken) {
			UserLockedCount = UserOperation.UserManagement_ExecuteQuery_GetLockedAccountCount(authString);
		}
		return UserLockedCount;
	}

	@Override
	public int GetInactivateUsers(String authString, String output) {
		int count = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_GetInactivateUsers(authString, output);
		}
		return count;
	}
	
	@Override
	public int GetactivateUsers(String authString, String output) {
		int count = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_GetactivateUsers(authString, output);
		}
		return count;
	}
	
	@Override
	public int GetLockRequests(String authString, String output) {
		int count = 0;

		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_GetLockRequests(authString, output);
		}
		return count;
	}
	
	@Override
	public int SaveNewpassword(String authString, String oldPassword, String newPassword) {
		int count = 0;

		AuthenticationService authenticateService = new AuthenticationService();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

		if (authenticateToken) {
			count = UserOperation.UserManagement_ExecuteQuery_Savenewpassword(authString, oldPassword, newPassword);
		}
		return count;
	}

}
