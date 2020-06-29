/**
 * @author 653731 created on 12.03.2018
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller('FortifyCtrl',
			FortifyCtrl);

	/** @ngInject */
	// function FortifyCtrl($sessionStorage, paginationService,
	// $element,$state,
	// $scope, $base64, $http, $timeout, $uibModal, $rootScope, baConfig,
	// layoutPaths) {
	function FortifyCtrl($sessionStorage, AES, paginationService, UserService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths, $state) {

		var token = AES.getEncryptedValue();
		var config = {
			headers : {
				'Authorization' : token
			}
		};

		// check if component is available
		if (localStorageService.get('component')) {
			if ($rootScope.selectedFortifyProject == null
					&& $rootScope.selectedFortifyVersion == null) {

				// Will assign the selected to dropdown
				var values = localStorageService.get('component');
				$rootScope.selectedFortifyProject = values.fortifyProject;
				$rootScope.selectedFortifyVersion = values.fortifyVersion;
			}
		} else if ($rootScope.selectedFortifyProject == ""
				|| $rootScope.selectedFortifyProject == null) {
			// alert("selectedGit "+$rootScope.selectedtype);
			$rootScope.selectedFortifyProject = false;
			$rootScope.selectedFortifyVersion = false;

		} else {
			// Will clear the selected job from drop down when clicked on
			// "create new"
			$rootScope.selectedFortifyProject = false;
			$rootScope.selectedFortifyVersion = false;

		}

		// get Fortify projects
		$scope.initialFortifyProjects = function() {

			$http.get("rest/lifeCycleServices/fortifyprojectdetails", config)
					.success(function(response) {
						$scope.fortifyprojects = response;

					});
		}

		// get Fortify versions
		$scope.changeSelectedFortifyProject = function(selectedFortifyProject) {

			localStorageService.set('selectedFortifyProject',
					selectedFortifyProject);
			$rootScope.selectedFortifyProject = selectedFortifyProject;

			$http.get(
					"rest/lifeCycleServices/fortifyversiondetails?selectedFortifyProject="
							+ selectedFortifyProject, config).success(
					function(response) {
						$scope.fortifyversions = response;
					});
		}

		$scope.changeSelectedFortifyVersions = function(selectedFortifyVersion) {
			//alert(selectedFortifyVersion);
			localStorageService.set('selectedFortifyVersion',
					selectedFortifyVersion);
			$rootScope.selectedFortifyVersion = selectedFortifyVersion;
			$rootScope.fortifyHomeMetrics();
			$scope.fortifyPriorityChart();
		}

		$rootScope.fortifyHomeMetrics = function() {
			
			$http
					.get(
							"rest/lifeCycleServices/fortifyHomeMetrics?selectedFortifyProject="
									+ $rootScope.selectedFortifyProject
									+ "&selectedFortifyVersion="
									+ $rootScope.selectedFortifyVersion, config)
					.success(
							function(response) {
								$scope.fortifyHomeMetrics = response;
								$rootScope.totalScans = $scope.fortifyHomeMetrics[0];
								$rootScope.files = $scope.fortifyHomeMetrics[1];
								$rootScope.numFilesWithIssues = $scope.fortifyHomeMetrics[2];
							});
		}

		// Open page on click on 'View more metrics'
		$scope.open = function(UserName) {
			$state.go('viewfortifydashboard');
			$scope.getvalues();
		}

		$scope.getvalues = function() {
			$rootScope.selectedFortifyProject;
			$rootScope.selectedFortifyVersion;
		}

		// Charts

		$scope.fortifyPriorityChart = function() {

			$http.get(
					"rest/lifeCycleServices/fortifyMetrics?selectedFortifyProject="
							+ $rootScope.selectedFortifyProject
							+ "&selectedFortifyVersion="
							+ $rootScope.selectedFortifyVersion, config)
					.success(function(response) {
						$scope.fortifyMetricDetails = response;
						//alert($scope.fortifyMetricDetails);
						$scope.prioritychart($scope.fortifyMetricDetails);
					});

			$scope.prioritychart = function(result) {
				$scope.result = result;
				$scope.labels = [];
				$scope.data = [];
				$scope.dataaudited = [];

				$scope.labels.push("Critical");
				$scope.labels.push("High");

				for(var i=0; i<result[0].versions.length; i++){
					if(result[0].versions[i].versionId == $rootScope.selectedFortifyVersion){
				$scope.data
						.push(result[0].versions[i].PercentCriticalPriorityIssues);
				$scope.data
						.push(result[0].versions[i].PercentHighPriorityIssues);

				$scope.dataaudited
						.push(result[0].versions[i].PercentCriticalPriorityIssuesAudited);
				$scope.dataaudited
						.push(result[0].versions[i].PercentHighPriorityIssuesAudited);}}
				
				var layoutColors = baConfig.colors;

				$('#fortify-priority').remove(); // this is my <canvas>
				// element
				$('#fortifyprioritydiv')
						.append(
								'<canvas id="fortify-priority" width="220" height="250"></canvas>');

				var ctx = document.getElementById("fortify-priority");
				var myChart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels,
								datasets : [
										{
											label : "Issues",
											data : $scope.data,
											backgroundColor : [
													"rgba(75, 192, 192, 0.8)",
													"rgba(153, 102, 255, 0.8)" ],
											borderWidth : 1
										},
										{
											label : "Audited Issues",
											data : $scope.dataaudited,
											backgroundColor : [
													"rgba(54, 162, 235, 0.8)",
													"rgba(255, 99, 132, 0.8)", ],
											borderWidth : 1
										} ]
							},
							options : {
								responsive : true,
								maintainAspectRatio : false,
								hover : {
									animationDuration : 0
								},
								"animation" : {
									"duration" : 1,
									"onComplete" : function() {
										var chartInstance = this.chart, ctx = chartInstance.ctx;

										ctx.font = Chart.helpers
												.fontString(
														Chart.defaults.global.defaultFontSize,
														Chart.defaults.global.defaultFontStyle,
														Chart.defaults.global.defaultFontFamily);
										ctx.textAlign = 'center';
										ctx.textBaseline = 'bottom';

										this.data.datasets
												.forEach(function(dataset, i) {
													var meta = chartInstance.controller
															.getDatasetMeta(i);
													meta.data
															.forEach(function(
																	bar, index) {
																var meta = chartInstance.controller
																		.getDatasetMeta(i);
																meta.data
																		.forEach(function(
																				bar,
																				index) {
																			if (dataset.data[index] != 0) {
																				var data = dataset.data[index];
																			} else {
																				var data = "";
																			}
																			var centerPoint = bar
																					.getCenterPoint();
																			ctx
																					.fillText(
																							data,
																							centerPoint.x,
																							centerPoint.y - 2);
																		});
															});
												});
									}
								},
								tooltips : {
									enabled : true,
									mode : 'index',
									callbacks : {
										title : function(tooltipItems, data) {
											return $scope.labels[tooltipItems[0].index]
										}
									}
								},
								scales : {
									yAxes : [ {
										stacked : true,
										scaleLabel : {
											display : true,
											fontColor : '#2c2c2c',
											labelString : 'Priority (%)'
										},
										ticks : {
											beginAtZero : true
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ],
									xAxes : [ {
										stacked : true,
										scaleLabel : {
											display : true,
											fontColor : '#2c2c2c',
											labelString : 'Issues'
										},
										barThickness : 40,
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ]

								}
							}
						});

			};
		}
		
		
		
		$scope.fortifyLast3VersionChart = function() {
			$http.get(
					"rest/lifeCycleServices/fortifyLast3VersionChart?selectedFortifyProject="
							+ $rootScope.selectedFortifyProject, config)
					.success(function(response) {
						$scope.fortifyVersionDetails = response;
						$scope.versionchart($scope.fortifyVersionDetails);
					});

			$scope.versionchart = function(result) {
				$scope.result = result;
				$scope.labels = [];
				$scope.dataCritical = [];
				$scope.dataHigh = [];
				
				for(var i=0; i<result[0].versions.length; i++){
					if(i<3){
				$scope.labels.push(result[0].versions[i].versionCreationDate);

				$scope.dataCritical
						.push(result[0].versions[i].PercentCriticalPriorityIssues);
				$scope.dataHigh
						.push(result[0].versions[i].PercentHighPriorityIssues);}}
				
				//alert(JSON.stringify($scope.dataCritical));
				//alert(JSON.stringify($scope.dataHigh));

				var layoutColors = baConfig.colors;

				$('#fortify-last3-version').remove(); // this is my <canvas>
				// element
				$('#fortifylast3versiondiv')
						.append(
								'<canvas id="fortify-last3-version" width="220" height="250"></canvas>');

				var ctx = document.getElementById("fortify-last3-version");
				var myChart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels,
								datasets : [
										{
											label : "Critical Issues",
											data : $scope.dataCritical,
											backgroundColor : [
													"rgba(75, 192, 192, 0.8)",
													"rgba(153, 102, 255, 0.8)",
													"rgba(9, 191, 22, 0.9)"
													],
											borderWidth : 1
										},
										{
											label : "High Priority Issues",
											data : $scope.dataHigh,
											backgroundColor : [
													"rgba(54, 162, 235, 0.8)",
													"rgba(255, 99, 132, 0.8)",
													"rgba(236, 255, 0, 0.9)"],
											borderWidth : 1
										} ]
							},
							options : {
								responsive : true,
								maintainAspectRatio : false,
								hover : {
									animationDuration : 0
								},
								"animation" : {
									"duration" : 1,
									"onComplete" : function() {
										var chartInstance = this.chart, ctx = chartInstance.ctx;

										ctx.font = Chart.helpers
												.fontString(
														Chart.defaults.global.defaultFontSize,
														Chart.defaults.global.defaultFontStyle,
														Chart.defaults.global.defaultFontFamily);
										ctx.textAlign = 'center';
										ctx.textBaseline = 'bottom';

										this.data.datasets
												.forEach(function(dataset, i) {
													var meta = chartInstance.controller
															.getDatasetMeta(i);
													meta.data
															.forEach(function(
																	bar, index) {
																var meta = chartInstance.controller
																		.getDatasetMeta(i);
																meta.data
																		.forEach(function(
																				bar,
																				index) {
																			if (dataset.data[index] != 0) {
																				var data = dataset.data[index];
																			} else {
																				var data = "";
																			}
																			var centerPoint = bar
																					.getCenterPoint();
																			ctx.fillText(
																							data,
																							centerPoint.x,
																							centerPoint.y - 2);
																		});
															});
												});
									}
								},
								tooltips : {
									enabled : true
								},
								scales : {
									yAxes : [ {
										stacked : true,
										scaleLabel : {
											display : true,
											fontColor : '#2c2c2c',
											labelString : 'Priority (%)'
										},
										ticks : {
											beginAtZero : true
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ],
									xAxes : [ {
										scaleLabel : {
											display : true,
											fontColor : '#2c2c2c',
											labelString : 'Time Period'
										},
										type : "time",
										time : {
											displayFormats : {
												millisecond : "SSS [ms]",
												second : "h:mm:ss a",
												minute : "h:mm:ss a",
												hour : "MMM D, hA",
												day : "ll",
												week : "ll",
												month : "MMM YYYY",
												quarter : "[Q]Q - YYYY",
												year : "YYYY"
											},
											tooltipFormat : "D MMM YYYY",
											unit : "day"
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)",
										}
									} ]

								}
							}
						});
			};
		}


	}
})();