/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.theme.components')
      .directive('contentTop', contentTop);

  /** @ngInject */
  function contentTop($location, $state, $sessionStorage,localStorageService) {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/contentTop/contentTop.html',
      link: function($scope) {
    	  $scope.value=false;
        $scope.$watch(function () {
        	$scope.activePageTitle = $sessionStorage.dashboardName; 
       	 if($state.current.title=='Requirements' ||
       			$state.current.title=='Design' ||
       			$state.current.title=='Execution' ||
       			$state.current.title=='Defects'||
       			$state.current.title=='User Story')
       			
   		{        		
       		$scope.activePageTitle = $state.current.title;
       		$scope.activeDashboardName = localStorageService.get('projectName');
       		$scope.value=true;
   		}
       	 else if($state.current.title=='Dashboard'||
       			$state.current.title=='SlideShow')
       		 {
       		$scope.activePageTitle = $state.current.title;
       		$scope.activeDashboardName = localStorageService.get('projectName');
       		$scope.value=false;
       		 }
       	else if($state.current.title=='Global View')
   		{       			
       		$scope.activePageTitle = $state.current.title;
       		$scope.activeDashboardName = localStorageService.get('dashboardName');
       		$scope.value=false;
   		}
       	else if($state.current.title=='LC Dashboard' ||
       			$state.current.title=='Code Repository' ||
       			$state.current.title=='Builds' ||
       			$state.current.title=='Chef Node Details' )
   		{       			
       			$scope.activePageTitle = $state.current.title;
       			$scope.activeDashboardName = localStorageService.get('dashboardName');
       			$scope.value=false;
   		}
       	else if($state.current.title=='Code Analysis' ||
       			$state.current.title=='Build Metrics' ||
       			$state.current.title=='Test Management Metrics'||
       			$state.current.title=='SCM Dashboard' ||
       			$state.current.title=='Chef Run Details' ||
       			$state.current.title=='User Story Life Cycle')
       		{
       			$scope.activePageTitle = $state.current.title;
       			$scope.activeDashboardName = localStorageService.get('dashboardName');
       			$scope.value=true;
       		}
       	
       				
       	else
       	{
       	        $scope.activePageTitle = $state.current.title;
       	        $scope.activeDashboardName = $state.current.title;
       	        $scope.value=false;
       	}
       });
      }
    };
  }

})();