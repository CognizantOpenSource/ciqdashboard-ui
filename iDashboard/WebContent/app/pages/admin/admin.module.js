/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.admin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $routeProvider) {/*
	  
	  
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
*/}	    
	
})();
