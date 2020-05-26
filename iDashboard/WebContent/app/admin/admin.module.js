/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.admin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $routeProvider) {
	  
	  $stateProvider
		.state(
				'admin',
				{
					url : '/admin',
					templateUrl : 'app/admin/admin.html',
					title : 'Admin',
					resolve : {
						loadMyCtrl : [
								'$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad
											.load({
												files : [
														'app/admin/admin.module.js',
														'app/admin/AdminCtrl.js',
														'app/admin/toolsConfiguration/alm/almToolConfigurationCtrl.js',
														'app/admin/toolsConfiguration/jira/jiraToolConfigurationCtrl.js',
														/*'app/Operational/oHome/oHomeCtrl.js',*/
														'lib/angularjs-dropdown-multiselect.js',
														'lib/xeditable.js',
														'lib/xeditable.css',
														'lib/jspdf.debug.js' ],
											});
								} ]
					}
				}).state('lifecycleLayoutSelection', {
			url : '/lifecycleLayoutSelection',
			templateUrl : 'app/admin/lifecycleLayoutSelection/toolSelection.html',
			title : 'LifeCycle Layout Selection',
			resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/admin/admin.module.js',
												'app/admin/AdminCtrl.js',
												'app/admin/lifecycleLayoutSelection/lifecycleLayoutSelectionCtrl.js',
												'lib/angularjs-dropdown-multiselect.js',
												'lib/xeditable.js',
												'lib/xeditable.css',
												'lib/jspdf.debug.js' ],
									});
						} ]
			}
		}).state('editTemplateView', {
			url : '/editCustomTemplate',
			templateUrl : 'app/admin/templateCustomization/editTemplateView.html',
			title : ' Update Template ',
		})

		.state('templateCustomizationHome', {
			url : '/templateCustomizationHome',
			templateUrl : 'app/admin/templateCustomization/templateCustomizationHome.html',
			title : 'Template Customization',
			resolve : {
				loadMyCtrl : [
						'$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad
									.load({
										files : [
												'app/admin/admin.module.js',
												'app/admin/AdminCtrl.js',
												'lib/xeditable.js',
												'lib/xeditable.css',
												'lib/jspdf.debug.js' ],
									});
						} ]
			}
		})

		.state('templateCustomization', {
			url : '/templateCustomization',
			templateUrl : 'app/admin/templateCustomization/templateCustomization.html',
			title : 'Template Customization',
		})

		.state('toolConfiguration', {
			url : '/toolConfiguration',
			templateUrl : 'app/admin/toolsConfiguration/toolConfiguration.html',
			title : 'Tool Configuration',
		}).state(
				'Operational',
				{
					url : '/Operational',
					directive : 'baSidebar',
					templateUrl : 'app/Operational/Home/operationalDashBoard.html',
					title : 'Operational Dashboard',
					resolve : {
						loadMyCtrl : [
								'$ocLazyLoad',
								function($ocLazyLoad) {
									return $ocLazyLoad
											.load({
												files : [
														'app/Operational/Home/operationalDashBoardCtrl.js',
														'lib/angularjs-dropdown-multiselect.js',
														'lib/ui-bootstrap-tpls.js' ],
											});
								} ]
					}
				}).state(
						'createDashbaordOperational',
						{
							url : '/createDashbaordOperational',
							directive : 'baSidebar',
							templateUrl : 'app/Operational/Home/createOperationalDashboard.html',
							title : 'Create Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Home/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						})

				.state(
						'viewDashbaordOperational',
						{
							url : '/viewDashbaordOperational',
							directive : 'baSidebar',
							templateUrl : 'app/Operational/Home/viewOperationalDashboard.html',
							title : 'Update Dashboard',
							resolve : {
								loadMyCtrl : [
										'$ocLazyLoad',
										function($ocLazyLoad) {
											return $ocLazyLoad
													.load({
														files : [
																'app/Operational/Home/operationalDashBoardCtrl.js',
																'lib/angularjs-dropdown-multiselect.js' ],
													});
										} ]
							}
						}).state(
								'globalview',
								{
									url : '/globalview',
									directive : 'baSidebar',
									templateUrl : 'app/Operational/Home/globalView.html',
									title : 'Global View',
									resolve : {
										loadMyCtrl : [
												'$ocLazyLoad',
												function($ocLazyLoad) {
													return $ocLazyLoad
															.load({
																files : [
																		'app/Operational/Home/operationalDashBoardCtrl.js',
																		'lib/angularjs-dropdown-multiselect.js' ],
															});
												} ]
									}
								}).state(
										'dashboard',
										{
											url : '/dashboard',
											directive : 'baSidebar',
											templateUrl : 'app/Dashboard/dashboard.html',
											title : 'Dashboard',
											sidebarMeta : {
												icon : 'ion-android-home',
												order : 0,
											},
											resolve : {
												loadMyCtrl : [
														'$ocLazyLoad',
														function($ocLazyLoad) {
															return $ocLazyLoad
																	.load({
																		files : [
																				'app/Dashboard/DashboardPieChartCtrl.js',
																				'app/Dashboard/artifactCountCtrl.js',
																				'app/Operational/UserStories/UserStoryCtrl.js',
																				'app/Operational/Requirements/RequirementsCtrl.js',
																				'app/Operational/Design/TestCasesCtrl.js',
																				'app/Operational/Design/JiraTestCasesCtrl.js',
																				'app/Operational/Defects/defectsCtrl.js',
																				'app/Operational/Defects/defectsJiraCtrl.js',
																				'app/Operational/Execution/TestExecutionCtrl.js',
																				'app/Login/loginCtrl.js',
																				'lib/funnel-chart.js',
																				'lib/jquery.easypiechart.js',
																				'app/Dashboard/highlightsCtrl.js',
																				'lib/raphael.min.js',
																				'lib/morris.css',
																				'lib/morris.min.js',
																				'lib/angular-morris-chart.min.js'],
																	});
														} ]
											}
										}).state(
												'Summaryslideshowpopup',
												{
													url : '/Summaryslideshowpopup',
													directive : 'baSidebar',
													templateUrl : 'app/Operational/SummarySlideShow/Summaryslideshowpopup.html',
													title : '',
													resolve : {
														loadMyCtrl : [
																'$ocLazyLoad',
																function($ocLazyLoad) {
																	return $ocLazyLoad
																			.load({
																				files : [
																						'lib//jquery.easing.js',
																						'app/Operational/SummarySlideShow/SummaryslideShowCtrl.js' ],
																			});
																} ]
													}

												});
	  
	  }	    
	
})();
	  
	  /*
	  
	  
	  $routeProvider
	    .when('/admin' ,{
	   // templateUrl: "app/pages/admin/admin.html",
	    resolve:{
	        "check":function($location,localStorageService,$state){   
	            if(localStorageService.get('admin')){ 
	            	$state.go('admin');
	            }else{
	            	$state.go('noaccess');    //redirect user to home.
	            }
	        }
	    }
	    })
	    
	    .when('/operationalDashboard' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('operational')){ 
	 	            	$state.go('operationalDashboard');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	   .when('/createDashbaordOperational' ,{
		 	   // templateUrl: "app/pages/admin/admin.html",
		 	    resolve:{
		 	        "check":function($location,localStorageService,$state){   
		 	            if(localStorageService.get('operational')){ 
		 	            	$state.go('createDashbaordOperational');
		 	            }else{
		 	            	$state.go('noaccess');    //redirect user to home.
		 	            }
		 	        }
		 	    }
		 	    })
		 	    
		 	 .when('/operationalDashboard' ,{
		 	   // templateUrl: "app/pages/admin/admin.html",
		 	    resolve:{
		 	        "check":function($location,localStorageService,$state){   
		 	            if(localStorageService.get('operational')){ 
		 	            	$state.go('createDashbaordOperational');
		 	            }else{
		 	            	$state.go('noaccess');    //redirect user to home.
		 	            }
		 	        }
		 	    }
		 	    })
		 	    
		 	   .when('/operational' ,{
			 	   // templateUrl: "app/pages/admin/admin.html",
			 	    resolve:{
			 	        "check":function($location,localStorageService,$state){   
			 	            if(localStorageService.get('operational')){ 
			 	            	$state.go('operational');
			 	            }else{
			 	            	$state.go('noaccess');    //redirect user to home.
			 	            }
			 	        }
			 	    }
			 	    })
	  
	  	.when('/viewDashbaordOperational' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('operational')){ 
	 	            	$state.go('viewDashbaordOperational');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	  
	  .when('/dashboard' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('operational')){ 
	 	            	$state.go('dashboard');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/charts/defects' ,{
		 	   // templateUrl: "app/pages/admin/admin.html",
		 	    resolve:{
		 	        "check":function($location,localStorageService,$state){   
		 	            if(localStorageService.get('operational')){ 
		 	            	$state.go('defects');
		 	            }else{
		 	            	$state.go('noaccess');    //redirect user to home.
		 	            }
		 	        }
		 	    }
		 	    })
		 	    
		 	   .when('/charts/testcases' ,{
			 	   // templateUrl: "app/pages/admin/admin.html",
			 	    resolve:{
			 	        "check":function($location,localStorageService,$state){   
			 	            if(localStorageService.get('operational')){ 
			 	            	$state.go('testcases');
			 	            }else{
			 	            	$state.go('noaccess');    //redirect user to home.
			 	            }
			 	        }
			 	    }
			 	    })
	  
	  .when('/charts/testexecution' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('operational')){ 
	 	            	$state.go('testexecution');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	  
	  .when('/charts/requirements' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('operational')){ 
	 	            	$state.go('requirements');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	   .when('/slideshow' ,{
		 	   // templateUrl: "app/pages/admin/admin.html",
		 	    resolve:{
		 	        "check":function($location,localStorageService,$state){   
		 	            if(localStorageService.get('operational')){ 
		 	            	$state.go('slideshow');
		 	            }else{
		 	            	$state.go('noaccess');    //redirect user to home.
		 	            }
		 	        }
		 	    }
		 	    })
		 	    
		 	.when('/viewDashbaord' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('viewDashbaord');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/lifecycledashboard' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('lifecycledashboard');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/createDashbaord' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('createDashbaord');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/codeRepo' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('codeRepo');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/build' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('build');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/createProdDashbaord' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('createProdDashbaord');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/codeanalysis' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('codeanalysis');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/buildMetrics' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('buildMetrics');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/testMgmtMetrics' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('testMgmtMetrics');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	    .when('/viewgitdashboard' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('viewgitdashboard');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	     .when('/chefrundetails' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('chefrundetails');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	     .when('/chefnodedetails' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('lifeCycle')){ 
	 	            	$state.go('viewgitdashboard');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
	 	    
	 	     .when('/dashbot' ,{
	 	   // templateUrl: "app/pages/admin/admin.html",
	 	    resolve:{
	 	        "check":function($location,localStorageService,$state){   
	 	            if(localStorageService.get('qbot')){ 
	 	            	$state.go('dashbot');
	 	            }else{
	 	            	$state.go('noaccess');    //redirect user to home.
	 	            }
	 	        }
	 	    }
	 	    })
*/
