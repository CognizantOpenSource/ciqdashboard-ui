/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.theme.components').controller(
			'BaSidebarCtrl', BaSidebarCtrl);

	/** @ngInject */
	function BaSidebarCtrl($scope, baSidebarService, $rootScope) {

		/* $rootScope.$on("CallParentMethod", function(event,response){  	 
		  $rootScope.menus=response;
		  loadData(response);
		 
		  });*/
		//  $scope.menuItems= $rootScope.menus;
		$rootScope.menuItems = baSidebarService.getMenuItems();
		/* $scope.menuItemsAccess = [];
		 $scope.menuItemsAccess.push($scope.menuList)
		 $scope.menuItemsAccess=$rootScope.menus;
		
		$scope.menuItems = $scope.menuItemsAccess;
		
		$scope.menuItems = baSidebarService.getMenuItems();*/
		//console.log(JSON.stringify($scope.menuItems)); 
		$rootScope.menuItems = baSidebarService.getMenuItems();
		$rootScope.$watch("menuItems", function(newValue, oldValue) //This gets called when data changes.
		{
			$rootScope.menuItems = newValue;
			return newValue;
			$scope.defaultSidebarState = $rootScope.menuItems[0].stateRef;
		});

		$scope.defaultSidebarState = $rootScope.menuItems[0].stateRef;

		$scope.hoverItem = function($event) {
			
			$scope.showHoverElem = true;
			$scope.hoverElemHeight = $event.currentTarget.clientHeight;
			var menuTopValue = 66;
			$scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top
					- menuTopValue;
		};

		$scope.$on('$stateChangeSuccess', function() {
			if (baSidebarService.canSidebarBeHidden()) {
				baSidebarService.setMenuCollapsed(true);
			}
		});

	}
})();