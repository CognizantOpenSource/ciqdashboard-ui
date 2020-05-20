/**
 * @author Subramani Murthy created on Feb - 2017
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.functionalCoverage').controller(
			'FunctionalCoverageCtrl', FunctionalCoverageCtrl);

	/** @ngInject */

	function FunctionalCoverageCtrl($scope, $http, baConfig, $element,
			layoutPaths) {
		
		var token  = getEncryptedValue();
	      var config = {headers: {
	              'Authorization': token
	              }};

		$http.get("rest/funcCovgServices/functionalCoverage",config).success(
				function(response) {
					$scope.items = response;
				});

		$scope.expandCompress = function(nam) {
			if (eval(nam).style.display == "") {
				eval(nam).style.display = "none";
				eval("Mod" + nam).src = "assets/img/app/profile/Plus.png";
			} else if (eval(nam).style.display == "none") {
				eval(nam).style.display = "";
				eval("Mod" + nam).src = "assets/img/app/profile/Minus.png";
			}
		};

	}

})();