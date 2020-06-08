package com.idashboard.admin.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cts.metricsportal.vo.UserCountVO;
import com.idashboard.admin.service.UserManagementService;
import com.idashboard.admin.serviceImpl.UserManagementServiceImpl;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.common.vo.DomainVO;
import com.sun.jersey.multipart.FormDataParam;

@Path("/usercontroller")
public class UserManagmentController {

	UserManagementService UserService = new UserManagementServiceImpl();

	@GET
	@Path("/getuserdetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getUserList(@HeaderParam("Authorization") String authString) {

		List<UserVO> list = new ArrayList<UserVO>();
		list = UserService.getUserList(authString);
		return list;

	}

	@GET
	@Path("/getprojectsforadminaccess")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getprojectsforadminaccess(@HeaderParam("Authorization") String authString) {
		List<DomainVO> list = new ArrayList<DomainVO>();
		list = UserService.getprojectsforadminaccess(authString);
		return list;

	}

	@GET
	@Path("/getjiraprojectsforadminaccess")
	@Produces(MediaType.APPLICATION_JSON)
	public List<DomainVO> getjiraprojectsforadminaccess(@HeaderParam("Authorization") String authString) {
		List<DomainVO> list = new ArrayList<DomainVO>();
		list = UserService.getjiraprojectsforadminaccess(authString);
		return list;
	}

	@POST
	@Path("/createAdminUser")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public int getcreateAdminUser(@HeaderParam("Authorization") String authString,
			@FormDataParam("userId") String userId, @FormDataParam("password") String password,
			@FormDataParam("userName") String userName, @FormDataParam("email") String email,
			@FormDataParam("mobileNum") String mobileNum, @FormDataParam("ldap") boolean isLadp) {

		int Count = 0;
		Count = UserService.CreateUser(authString, userId, password, userName, email, mobileNum, isLadp);
		return Count;

	}

	@POST
	@Path("/adminupdate")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public int getadminupdate(@HeaderParam("Authorization") String authString, @FormDataParam("userId") String userId,
			@FormDataParam("userName") String userName, @FormDataParam("email") String email,
			@FormDataParam("mobileNum") String mobileNum) {

		int Count = 0;
		Count = UserService.UpdateUser(authString, userId, userName, email, mobileNum);
		return Count;
	}
	
	
	@POST
	@Path("/deleteUserInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int deleteUserInfo(@HeaderParam("Authorization") String authString, String userId) {
		int deleted = 0;
		deleted = UserService.DeleteUserInfo(authString, userId);
		return deleted;
	}

	@POST
	@Path("/uploadUserImg")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public int getuploadUserImg(@HeaderParam("Authorization") String authString,
			@FormDataParam("userImg") InputStream userImg, @FormDataParam("filename") String profileFileName) {
		int Count = 0;
		Count = UserService.UploadUserImg(authString, userImg, profileFileName);
		return Count;
	}

	@GET
	@Path("/roleChange")
	@Produces(MediaType.APPLICATION_JSON)
	public int changeRole(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId,
			@QueryParam("role") String role) {

		int change = 0;
		change = UserService.UpdateUserRole(authString, userId, role);
		return change;

	}

	@GET
	@Path("/removeImg")
	@Produces(MediaType.APPLICATION_JSON)
	public int getremoveImg(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId) {
		int removed = 0;
		removed = UserService.RemoveLogo(authString, userId);
		return removed;
	}

	@POST
	@Path("/uploadOrgLogo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public int getuploadImage(@HeaderParam("Authorization") String authString, @FormDataParam("orgName") String orgName,
			@FormDataParam("orgLogo") InputStream orgLogo, @FormDataParam("usersel") String usersel,
			@FormDataParam("filename") String profileFileName) {
		int addlogo = 0;
		addlogo = UserService.AddLogo(authString, orgName, orgLogo, usersel, profileFileName);
		return addlogo;
	}

	@POST
	@Path("/updateUserInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int updateUserInfo(@HeaderParam("Authorization") String authString, String data) {
		int removed = 0;
		removed = UserService.UpdateUserInfo(authString, data);
		return removed;
	}

	@POST
	@Path("/saveAdminProjectAccess")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int saveAdminProjectAccess(@HeaderParam("Authorization") String authString,
			@QueryParam("userId") String userId, @QueryParam("selectedProjects") List<String> selectedProjects) {
		
		int accessupdate = 0;
		accessupdate = UserService.SaveAdminProjectAccess(authString, userId, selectedProjects);
		return accessupdate;
	}
	
	@GET
	@Path("/updateDashboards")
	@Produces(MediaType.APPLICATION_JSON)
	public int updateDashboards(@HeaderParam("Authorization") String authString, @QueryParam("userId") String userId) {
		
		int accessupdate = 0;
		accessupdate = UserService.UpdateDashboardsInfoInUser(authString, userId);
		return accessupdate;
	}
	
	@GET
	@Path("/getloginRequests")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getloginRequests(@HeaderParam("Authorization") String authString){
		
		List<UserVO> userInfo = null;
		userInfo = UserService.GetLoginRequestsCount(authString);
		return userInfo;
		
	}
	
	@POST
	@Path("/loginRequests")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int loginRequests(@HeaderParam("Authorization") String authString, String output) {
		int UpdateLoginRequest = 0;
		UpdateLoginRequest = UserService.UpdateLoginRequests(authString, output);
		return UpdateLoginRequest;
	}
	
	@GET
	@Path("/getActiveUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Object[] getActiveUsers(@HeaderParam("Authorization") String authString) {
		Object[] objArray = null;
		objArray=UserService.GetActiveUsersCount(authString);
		return objArray;
	}
	
	@GET
	@Path("/getInactiveUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Object[] getInactiveUsers(@HeaderParam("Authorization") String authString) {
		Object[] objArray = null;
		objArray=UserService.GetInActiveUsersCount(authString);
		return objArray;
	}
	
	@GET
	@Path("/adminUserCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserCountVO> getAdminUserCount(@HeaderParam("Authorization") String authString) {
		List<UserCountVO> UserCount = null;
		UserCount = UserService.GetUserCount(authString);
		return UserCount;
	}
	
	@GET
	@Path("/lockedAccountCount")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> getlockedAccountCount(@HeaderParam("Authorization") String authString) {
		List<UserVO> UserLockedCount = null;
		UserLockedCount = UserService.GetLockedAccountCount(authString);
		return UserLockedCount;
	}
	
	@POST
	@Path("/inactivateUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int inactivateUsers(@HeaderParam("Authorization") String authString, String output) {
		int InActiveUserCount = 0;
		InActiveUserCount = UserService.GetInactivateUsers(authString, output);
		return InActiveUserCount;
	}
	
	@POST
	@Path("/activateUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int activateUsers(@HeaderParam("Authorization") String authString, String output) {
		int InActiveUserCount = 0;
		InActiveUserCount = UserService.GetactivateUsers(authString, output);
		return InActiveUserCount;
	}
	
	@POST
	@Path("/lockRequests")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public int lockRequests(@HeaderParam("Authorization") String authString, String output) {
		int LckReqCount = 0;
		LckReqCount = UserService.GetLockRequests(authString, output);
		return LckReqCount;
	}
	
	
	
	

}
