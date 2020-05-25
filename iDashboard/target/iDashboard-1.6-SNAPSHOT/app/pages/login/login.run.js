(function() {
	'use strict';

	angular.module('MetricsPortal.pages.login').run(loginRun);

	/** @ngInject */
	function loginRun($timeout, $rootScope, preloader, $q) {
		$rootScope.serviceurl = "http://10.219.161.168:8080/MetricsPortalv1";
		$rootScope.middleLayerURL = "http://10.240.157.55:8080/QIMiddleLayer";

		$rootScope.roles = [];
	}
})();
