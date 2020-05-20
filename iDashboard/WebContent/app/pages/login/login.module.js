(function () {
  'use strict';

	  var login = angular.module('MetricsPortal.pages.login', [ 'ui.router'
	                                                             ]);

	  login.config(routeConfig);
	  
  login.constant('USER_ROLES', {
	all : '*',
	admin : 'admin',
	clientadmin : 'clientAdmin',
	portaladmin : 'portalAdmin',
	engineadmin : 'engineAdmin',
	client : 'client',
	guest : 'guest'
}).constant('AUTH_EVENTS', {
	loginSuccess : 'auth-login-success',
	loginFailed : 'auth-login-failed',
	logoutSuccess : 'auth-logout-success',
	sessionTimeout : 'auth-session-timeout',
	notAuthenticated : 'auth-not-authenticated',
	notAuthorized : 'auth-not-authorized'
})
	login.constant('ErrorCodes', {
		
		// Error Code for Engine
		Err1001_DupEngine : '1001 - Inputted Engine Name already exists in System..!!!',
		Err1002_EngNameNull : '1002 - Engine Name cannot be left as blank',
		Err1003_EngAdmIDNull : '1003 - Engine Admin ID cannot be left as blank',
		Err1004_DateIssues : '1004 - End Date cannot be before Start Date',

		Err1501_DupEngineAdmin : '1501 - Enter User is already an admin to this Engine.!!!',

		// Error Code for Client
		Err2001_DupClient : '2001 - Inputted Client Name already exists in System..!!!',
		Err2002_ClientNameNull : '2002 - Client Name cannot be left as blank',
		Err2003_ClientAdmIDNull : '2003 - Client Admin ID cannot be left as blank',
		Err2004_ProjCountEmpty : '2004 - Enter non zero value for Max No. of Projects',
		Err2005_UserCountEmpty : '2005 - Enter non zero value for Max No. of Users',

		Err2501_DupClientAdmin : '2501 - Enter User is already an admin to this client.!!!',

		Err1004_UserInputNameNull : '1004 - User Input name cannot be left as blank',
		Err1005_UserInputTypeNull : '1005 - User Input type cannot be left as blank',
		Err1006_ReportViewNameNull : '1006 - Report View name cannot be left as blank',
		Err1007_ReportViewTypeNull : '1007 - Report View type cannot be left as blank',
		Err1008_DupUserInput : '1008 - Entered User Input Name already exists in System..!!!',
		Err1009_DupReportView : '1009 - Entered Report View Name already exists in System..!!!',

		// Error Code for Project
		Err4001_DupProject : '4001 - Inputted Project already exists in System..!!!',
		Err4002_projectNull : '4002 - Project cannot be left as blank',
		Err4003_selectCodeTool : '4003 - Select any Code Management Tool for entering data',
		Err4004_selectBugTool : '4004 - Select any Bug Management Tool for entering data',
		Err4004_selectBuildTool : '4005 - Select any Build Management Tool for entering data',

		// Error Code for Sub Project
		Err5001_DupSubProject : '5001 - Inputted SubProject already exists in System..!!!',
		Err5002_SubProjectNull : '5002 - Sub Project cannot be left as blank',

		// Error Code for Sub Project
		Err6001_DupUserID : '6001 - Inputted User already exists in System..!!!',
		Err6002_UserIDNull : '6002 - User ID cannot be left as blank',

	})
  /** @ngInject */
  function routeConfig($urlRouterProvider, $stateProvider, $routeProvider,baSidebarServiceProvider) {
		$urlRouterProvider.otherwise('/');	
		$stateProvider.state('login', {
			url : "/login",
			templateUrl : "app/pages/login/auth.html",
			controller : 'LoginCtrl',
			authenticate: true,
			 
			  
		}).state('index', {
			url : "/index",
			templateUrl : "index.html",
			authenticate: true
		})
		 ;
  }
})();
