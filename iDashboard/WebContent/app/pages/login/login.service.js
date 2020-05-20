(function() {
  'use strict';

  angular.module('MetricsPortal.pages.login')
      .provider('loginService', loginServiceProvider);
  
  /** @ngInject */
  function loginServiceProvider() {
      var userRoles = [];
      
      this.setUserRoles =function(){
    	  userRoles.push.apply(userRoles, arguments);
      };
          
      this.getDefinedUserRoles = function() {
          return userRoles;
        };
      
      this.$get = function($rootScope){
          return new _factory();

          function _factory() {
        	  this.setUserRoles =function(){
            	  userRoles.push.apply(userRoles, $rootScope.roles);
              };
        	  }
          }
      }
  })();