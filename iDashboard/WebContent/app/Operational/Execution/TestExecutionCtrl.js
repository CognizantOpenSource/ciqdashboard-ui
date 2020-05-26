/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.Operational.Execution').controller(
			'TestExecutionCtrl', TestExecutionCtrl).filter('trimDesc',
			function() {
				return function(value) {
					if (!angular.isString(value)) {
						return value;
					}
					return value.replace(/^\s+|\s+$/g, '');
				};
			});

	/** @ngInject */
	function TestExecutionCtrl($element, paginationService, AES, UserService,
			localStorageService, $scope, $base64, $http, $timeout, $uibModal,
			$rootScope, baConfig, layoutPaths, $sessionStorage, $filter) {

		$rootScope.timeperiodTe = localStorageService.get('timeperiod');

		if ($scope.dtto != null) {

			var dtToDate = new Date($scope.dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');

			localStorageService.set('dttoPlus', dtToDateStr);
		}

		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');

		$scope.init = function() {
			$rootScope.dataloader = true;
		}

		// Total Test Case Count

		$rootScope.initialtccount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/tcexeCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.tcexecnt = response;
					});
		}
		// Manual Test Case Count

		$rootScope.manualtccount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/tcmanualCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$rootScope.tcmanual = response;
					});
		}

		// Automated Test Case Count

		$rootScope.autotccount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/tcautoCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.tcauto = response;
					});
		}

		// Regression Automation
		$rootScope.RegressionAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/RegressionAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.regatuo = response;

						$scope.loadPieCharts('#regatuo', $rootScope.regatuo);
					});

		}

		// UAT Automation
		$rootScope.UATAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/UATAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.uatauto = response;

						$scope.loadPieCharts('#uatatuo', $rootScope.uatauto);
					});

		}

		// Functional Automation

		$rootScope.FuncationalAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/FuncationalAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.funcauto = response;

						$scope.loadPieCharts('#funcatuo', $rootScope.funcauto);
					});

		}

		// First Time Pass Rate percentage
		$rootScope.firstpassrate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/firstTimePass?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.passratedata = response;

						$scope.loadPieCharts('#passrate',
								$rootScope.passratedata);
					});

		}

		// FunctionalUitilizaiton - Trend Graph

		$scope.functionalUtilChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/FunctionalUtilChart?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodTe, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope
											.functionaldesignerbarchart($scope.data);
								} else {
									$('#functionalutilbarchart').remove(); // this
									// is
									// my
									// <canvas>
									// element
									$('#exefunctionalutildiv')
											.append(
													'<canvas id="functionalutilbarchart"> </canvas>');
								}
							});

			$scope.functionaldesignerbarchart = function(lineresult) {
				$scope.result = lineresult;
				$scope.labels1 = [];
				$scope.labels2 = [];
				$scope.data1 = [];
				var colors = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].isoTestExecutionMonth);
					$scope.labels2.push($scope.result[i].testExecutionMonth);
					$scope.data1.push($scope.result[i].funcUtilValue);

					//colors.push("rgba(0, 0, 128, 0.8)");

				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#functionalutilbarchart').remove(); // this is my <canvas>
				// element
				$('#exefunctionalutildiv').append(
						'<canvas id="functionalutilbarchart"> </canvas>');

				var ctx = document.getElementById("functionalutilbarchart");
				var functionalutilbarchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels1,
								datasets : [ {
									data : $scope.data1,
									backgroundColor : "rgba(0, 0, 128, 0.3)",
									borderColor : "rgba(0, 0, 128, 0.8)",
									borderWidth : 1,

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

																			//var data = dataset.data[index] + "%";
																			if (dataset.data[index] != 0) {
																				var data = dataset.data[index]
																						+ "%";
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
								//								tooltips : {
								//									enabled : true
								//								},
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor : '#000000', //text color											
										},
										scaleLabel : {
											display : true,
											labelString : 'Functional Utilization %',
											fontColor : '#4c4c4c',
											fontStyle : 'bold'
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],
									xAxes : [ {
										barThickness : 30,
										//										bounds : 'data',
										type : "time",
										//										offset: true,
										time : {
											//max: 1473853353000,										
											displayFormats : {
												month : "MMM YYYY",
											},
											tooltipFormat : "MMM YYYY",
											unit : "month"
										},
										scaleLabel : {
											display : true,
											labelString : 'Month(s)',
											fontColor : '#4c4c4c',
											fontStyle : 'bold'
										},
										gridLines : {
											color : "rgba(192,192,192,0.2)",
											offsetGridLines : true
										},
										ticks : {
											fontColor : '#4c4c4c',
										//											 source: 'auto'
										}
									} ]

								}
							}

						});
			};

		}

		// RegressionUitilizaiton - Trend Graph

		$scope.regressionUtilChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/RegressionUtilChart?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodTe, config)
					.success(
							function(response) {
								$scope.data = response;
								
								if ($scope.data.length != 0) {
									$scope
											.regressiondesignerbarchart($scope.data);
								} else {
									$('#regressionutilbarchart').remove(); // this
									// is
									// my
									// <canvas>
									// element
									$('#exeregressionutildiv')
											.append(
													'<canvas id="regressionutilbarchart"> </canvas>');
								}
							});

			$scope.regressiondesignerbarchart = function(lineresult) {
				$scope.result = lineresult;
				$scope.labels1 = [];
				$scope.labels2 = [];
				$scope.data1 = [];
				var colors = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].isoTestExecutionMonth);
					$scope.labels2.push($scope.result[i].testExecutionMonth);
					$scope.data1.push($scope.result[i].regUtilValue);

					//colors.push("rgba(0, 0, 128, 0.8)");

				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#regressionutilbarchart').remove(); // this is my <canvas>
				// element
				$('#exeregressionutildiv').append(
						'<canvas id="regressionutilbarchart"> </canvas>');

				var ctx = document.getElementById("regressionutilbarchart");
				var regressionutilbarchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels1,
								datasets : [ {
									data : $scope.data1,
									backgroundColor : "rgba(0, 0, 128, 0.3)",
									borderColor : "rgba(0, 0, 128, 0.8)",
									borderWidth : 1,

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

																			//var data = dataset.data[index] + "%";
																			if (dataset.data[index] != 0) {
																				var data = dataset.data[index]
																						+ "%";
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
								//									tooltips : {
								//										enabled : true
								//									},
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor : '#000000', //text color											
										},
										scaleLabel : {
											display : true,
											labelString : 'Regression Utilization %',
											fontColor : '#4c4c4c',
											fontStyle : 'bold'
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],
									xAxes : [ {
										barThickness : 30,
										//											bounds : 'data',
										type : "time",
										//											offset: true,
										time : {
											//max: 1473853353000,										
											displayFormats : {
												month : "MMM YYYY",
											},
											tooltipFormat : "MMM YYYY",
											unit : "month"
										},
										scaleLabel : {
											display : true,
											labelString : 'Month(s)',
											fontColor : '#4c4c4c',
											fontStyle : 'bold'
										},
										gridLines : {
											color : "rgba(192,192,192,0.2)",
											offsetGridLines : true
										},
										ticks : {
											fontColor : '#4c4c4c',
										//												 source: 'auto'
										}
									} ]

								}
							}

						});
			};

		}

		// Error Discovery Rate percentage
		$rootScope.errordiscoveryrate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/errorDiscovery?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(
							function(response) {
								$rootScope.errorratedata = response;

								$scope.loadPieCharts('#errorrate',
										$rootScope.errorratedata);
							});

		}

		// TestCase Execution by Pie Chart
		$scope.testExeStatusPie = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/testcaseExeStatus?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$scope.data = response;
						$scope.statuschart($scope.data);
					});

			$scope.statuschart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].testExecutionStatus);
					$scope.data1.push($scope.result[i].statusCnt);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#statusdoughnutchart').remove(); // this is my <canvas>
				// element
				$('#statuspiediv').append(
						'<canvas id="statusdoughnutchart"> </canvas>');

				var ctx = document.getElementById("statusdoughnutchart");
				var statusdoughnutchart = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(9, 191, 22, 0.8)",
									"rgba(255, 31, 0, 0.8)",
									"rgba(255, 134, 0, 0.8)",
									"rgba(236, 255, 0, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(67, 154, 213, 0.8)",
									"rgba(255, 113, 189, 0.8)" ],
							borderColor : [ "rgba(9, 191, 22, 1)",
									"rgba(255, 31, 0, 1)",
									"rgba(255, 134, 0, 1)",
									"rgba(236, 255, 0, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(67, 154, 213, 1)",
									"rgba(255, 113, 189, 1)" ],
							borderWidth : 1
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						pieceLabel : {
							render : 'value',
							fontColor : '#4c4c4c'
						},

						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#4c4c4c',
								boxWidth : 20,
								fontSize : 10
							}
						}
					}

				});
			};
		}

		// TC coverage percentage
		$rootScope.tccoverage = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/tccoverage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(
							function(response) {
								$rootScope.tccoveragedata = response;
								$scope.loadPieCharts('#tccov',
										$rootScope.tccoveragedata);
							});

		}

		// Loading Pie Chart in ba-panel
		$scope.loadPieCharts = function(id, chartcount) {
			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(
					function() {
						var chart = $(this);
						chart.easyPieChart({
							easing : 'easeOutBounce',
							onStep : function(from, to, percent) {
								$(this.el).find('.percent').text(
										Math.round(percent));
							},
							barColor : function(chartcount) {
								if (chartcount == $rootScope.errorratedata) {

									return (chartcount < 30 ? 'green'
											: (chartcount <= 60 ? 'orange'
													: 'red'));
								}

								if (chartcount != $rootScope.errorratedata) {

									return (chartcount < 30 ? 'red'
											: (chartcount <= 60 ? 'orange'
													: 'green'));
								}
							},
							trackColor : 'lightgray',
							size : 85,
							scaleLength : 0,
							animation : 2000,
							lineWidth : 10,
							lineCap : 'round',
							scaleColor : 'white'
						});
						updatePieCharts($scope.id, $scope.chartcount)
					});
			$('.refresh-data').on('click', function() {
				updatePieCharts();
			});
		}
		function updatePieCharts(id, count) {
			$scope.id = id;
			$scope.count = count;
			$($scope.id).each(function(index, chart) {
				$(chart).data('easyPieChart').update($scope.count);
			});
		}
		$timeout(function() {
		}, 1000);

		// TC by owner Chart
		$scope.testOwnerChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/testOwnerChart?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodTe, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.designerchart($scope.data);
								} else {
									$('#designerbarchart').remove(); // this
									// is my
									// <canvas>
									// element
									$('#exediv')
											.append(
													'<canvas id="designerbarchart"> </canvas>');
								}
							});

			$scope.designerchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].testTester);
					$scope.data1.push($scope.result[i].statusCnt);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#designerbarchart').remove(); // this is my <canvas>
				// element
				$('#exediv').append('<canvas id="designerbarchart"> </canvas>');

				var ctx = document.getElementById("designerbarchart");
				var designerbarchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									data : $scope.datapie,
									backgroundColor : [
											"rgba(199, 99, 5, 0.9)",
											"rgba(255, 31, 0, 0.8)",
											"rgba(6, 239, 212, 0.8)",
											"rgba(189, 5, 171, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(67, 154, 213, 0.8)",
											"rgba(255, 113, 189, 0.8)",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B" ],
									borderColor : [ "rgba(199, 99, 5, 0.8)",
											"rgba(255, 31, 0, 0.8)",
											"rgba(6, 239, 212, 0.8)",
											"rgba(189, 5, 171, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(67, 154, 213, 0.8)",
											"rgba(255, 113, 189, 0.8)",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B" ],
									borderWidth : 1,

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
																			// This
																			// below
																			// lines
																			// are
																			// user
																			// to
																			// show
																			// the
																			// count
																			// in
																			// TOP
																			// of
																			// the
																			// BAR
																			/*
																			 * var
																			 * data =
																			 * dataset.data[index];
																			 * ctx.fillText(data,
																			 * bar._model.x,
																			 * bar._model.y -
																			 * 5);
																			 */

																			// This
																			// below
																			// lines
																			// are
																			// user
																			// to
																			// show
																			// the
																			// count
																			// in
																			// CENTER
																			// of
																			// the
																			// BAR
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
									enabled : true
								},
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor : '#4c4c4c'
										},
										scaleLabel : {
											display : true,
											labelString : 'No. of Test Cases Executed',
											fontColor : '#4c4c4c'
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],
									xAxes : [ {
										barThickness : 40,
										scaleLabel : {
											display : true,
											labelString : 'Owner',
											fontColor : '#4c4c4c'
										},
										gridLines : {
											color : "#d8d3d3"
										},
										ticks : {
											fontColor : '#4c4c4c'
										}
									} ]

								}
							}

						});
			};

		}

		// Execution Trend chart
		$scope.executionTrendChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}

			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/executiontrendchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$scope.data = response;
						$scope.telinechart($scope.data);
					});

			$scope.telinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.nostatus = [];
				$scope.notcompleted = [];
				$scope.notapplicable = [];
				$scope.failed = [];
				$scope.passed = [];
				$scope.norun = [];
				$scope.blocked = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.nostatus.push($scope.lineresult[i].nostatus);
					$scope.notcompleted
							.push($scope.lineresult[i].notcompletedCnt);
					$scope.notapplicable
							.push($scope.lineresult[i].notapplicableCnt);
					$scope.failed.push($scope.lineresult[i].failedCnt);
					$scope.passed.push($scope.lineresult[i].passedCnt);
					$scope.norun.push($scope.lineresult[i].norunCnt);
					$scope.blocked.push($scope.lineresult[i].blockedCnt);
				}
				$scope.data = [ $scope.nostatus, $scope.notcompleted,
						$scope.notapplicable, $scope.failed, $scope.passed,
						$scope.norun, $scope.blocked, ];
				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.nostatus,
							label : "No Status",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.9)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.9)",
						}, {
							data : $scope.notcompleted,
							label : "Not Completed",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 0.9)",
							pointBackgroundColor : "rgba(236, 255, 0, 0.9)",
						}, {
							data : $scope.notapplicable,
							label : "Not Applicable",
							pointStyle : "line",
							borderColor : "rgba(153, 102, 255, 0.8)",
							pointBackgroundColor : "rgba(153, 102, 255, 0.8)",
						}, {
							data : $scope.failed,
							label : "Failed",
							pointStyle : "line",
							borderColor : "rgba(255, 31, 0, 0.9)",
							pointBackgroundColor : "rgba(255, 31, 0, 0.9)",

						}, {
							data : $scope.passed,
							label : "Passed",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)",

						},

						{
							data : $scope.norun,
							label : "No Run",
							pointStyle : "line",
							borderColor : "rgba(255, 113, 189, 1)",
							pointBackgroundColor : "rgba(255, 113, 189, 1)",
						}, {
							data : $scope.blocked,
							label : "Blocked",
							pointStyle : "line",
							borderColor : "rgba(255, 134, 0, 1)",
							pointBackgroundColor : "rgba(255, 134, 0, 1)",

						}

						]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
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
									unit : "month"
								},
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : '#4c4c4c'
								},
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									fontColor : '#4c4c4c'
								}
							} ],
							yAxes : [ {
								gridLines : {
									color : "#d8d3d3",
								},
								scaleLabel : {
									display : true,
									labelString : 'No. of Test Cases Executed',
									fontColor : '#4c4c4c'
								},
								ticks : {
									beginAtZero : true,
									fontColor : '#4c4c4c'
								}
							} ]

						},
						legend : {
							display : true,
							position : 'right',
							labels : {
								fontColor : '#4c4c4c',
								usePointStyle : true,
								fontSize : 10
							}
						},
						pan : {
							// Boolean to enable panning
							enabled : true,

							// Panning directions. Remove the appropriate
							// direction to disable
							// Eg. 'y' would only allow panning in the y
							// direction
							mode : 'x'
						},

						// Container for zoom options
						zoom : {
							// Boolean to enable zooming
							enabled : true,

							// Zooming directions. Remove the appropriate
							// direction to disable
							// Eg. 'y' would only allow zooming in the y
							// direction
							mode : 'x',
						}
					}
				}
				$('#teline').remove(); // this is my <canvas> element
				$('#statusdiv').append('<canvas id="teline"></canvas>');

				var ctx = document.getElementById("teline");
				window.teline = new Chart(ctx, config);

			}
		}

		// PopUp of Execution details using D3 Cross Filter
		$scope.openpopup = function(size) {
			$rootScope.teanalyse = $uibModal
					.open({
						animation : true,
						templateUrl : 'app/Operational/Execution/executionAnalyze.html',
						scope : $scope,
						size : size,
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		// Table on-load
		$scope.tcexeTableData = function(start_index) {
			
						
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$scope.index = start_index;
			$http.get(
					"./rest/almMetricsServices/tcexeTableDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.tcexeTableDetails = response;
					});

		};

		$scope.initialcountpaginate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/tcexeCountForTable?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$rootScope.datapaginate = response;
					});
		}

		// Execution Table Code starts here
		$scope.pageChangedLevel = function(pageno) {

			$scope.pageno = pageno;

			// if ($scope.sortBy == undefined && $rootScope.sortkey == false
			// && $rootScope.searchkey == false) {
			// $scope.tcexeTableData($scope.pageno);
			// } else if ($rootScope.sortkey == true) {
			// $scope
			// .sortedtable($scope.sortBy, $scope.pageno,
			// $scope.reverse);
			// }
			// if ($rootScope.searchkey == true) {
			// $scope.search($scope.pageno, $scope.searchField,
			// $scope.searchText);
			// }

			if ($rootScope.sortkey == true) {
				$scope
						.sortedtable($scope.sortBy, $scope.pageno,
								$scope.reverse);
			} else if ($rootScope.searchkey == true) {
				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);
			} else {
				$scope.tcexeTableData($scope.pageno);
			}

		}
		// Sort function starts here
		$scope.sort = function(keyname, start_index) {
			$scope.sortBy = keyname;
			$rootScope.sortkey = true;
			$rootScope.searchkey = false;
			$scope.index = start_index;
			$scope.reverse = !$scope.reverse;
			$scope.sortedtable($scope.sortBy, $scope.index, $scope.reverse);

		};

		// Table on-load with sort implementation
		$scope.sortedtable = function(sortvalue, start_index, reverse) {
			paginationService.setCurrentPage("tepaginate", start_index);
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;

			$http.get(
					"rest/almMetricsServices/testexeData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$rootScope.tcexeTableDetails = response;
					});
		}

		var vm = this;
		vm.total_count = 0;
		$scope.itemsPerPage = 5;

		// search
		$scope.search = function(start_index, searchField, searchText) {
			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "testID") {
				$rootScope.testID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "releaseName") {
				$rootScope.releaseName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "cycleName") {
				$rootScope.cycleName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testName") {
				$rootScope.testName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testRunID") {
				$rootScope.testRunID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testTester") {
				$rootScope.testTester = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testType") {
				$rootScope.testType = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testExecutionStatus") {
				$rootScope.testExecutionStatus = searchText;
				$scope.key = true;
			}

			$scope.searchable();
		}

		$scope.searchable = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if ($rootScope.testID == undefined) {
				$rootScope.testID = 0;
			}

			if ($rootScope.testRunID == undefined) {
				$rootScope.testRunID = 0;
			}

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/searchpagecountexe?releaseName="
							+ $rootScope.releaseName + "&cycleName="
							+ $rootScope.cycleName + "&testID="
							+ $rootScope.testID + "&testName="
							+ $rootScope.testName + "&testType="
							+ $rootScope.testType + "&testRunID="
							+ $rootScope.testRunID + "&testTester="
							+ $rootScope.testTester + "&testExecutionStatus="
							+ $rootScope.testExecutionStatus
							+ "&dashboardName=" + dashboardName + "&owner="
							+ owner + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$rootScope.datapaginate = response;
					});
			paginationService.setCurrentPage("tepaginate", $scope.start_index);
			$scope.itemsPerPage = 5;

			$scope.index = $scope.start_index; // Fix

			$http.get(
					"./rest/almMetricsServices/searchExe?releaseName="
							+ $rootScope.releaseName + "&cycleName="
							+ $rootScope.cycleName + "&testID="
							+ $rootScope.testID + "&testName="
							+ $rootScope.testName + "&testType="
							+ $rootScope.testType + "&testRunID="
							+ $rootScope.testRunID + "&testTester="
							+ $rootScope.testTester + "&testExecutionStatus="
							+ $rootScope.testExecutionStatus + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						if (response == "" && $scope.key == false) {
							$rootScope.searchkey = false;
							$scope.initialcountpaginate();
							$scope.tcexeTableData(1);
						} else if (response == null) {
							$rootScope.searchkey = false;
							$scope.initialcountpaginate();
							$scope.tcexeTableData(1);
						} else {
							paginationService.setCurrentPage("tepaginate",
									$scope.start_index);
							$rootScope.tcexeTableDetails = response;
						}
					});
		}

		// CYCLE DROP DOWN CHANGES
		$scope.getCycleDetails = function() {
			debugger;
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			$http.get(
					"./rest/almMetricsServices/exeCycleList?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTe, config)
					.success(function(response) {
						$scope.cycles = response;
						$scope.multicycles = [];
						for (var i = 0; i < $scope.cycles.length; i++) {
							$scope.multicycles.push({
								"label" : $scope.cycles[i]
							});
						}
						$scope.selectcycles = [];
						for (var i = 0; i < $scope.multicycles.length; i++) {
							$scope.selectcycles.push($scope.multicycles[i]);
						}

						$scope.selcycle = $scope.selectcycles;
						onSelectionChangedcycle();
						// $scope.selcycle = [];
					});
		}

		/* Tree Structure Ends Here */

		/* Date Filter Code Starts Here */
		// CALENDER DEFAULT VALUE
		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			
			$rootScope.dfromvalTe = dtfrom;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtfrom', dtfrom);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodTe = localStorageService.get('timeperiod');

			$scope.dtto = localStorageService.get('dtto');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.exefilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$rootScope.dtovalTe = dtto;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtto', dtto);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodTe = localStorageService.get('timeperiod');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.exefilterfunction();
		}

		$scope.gettimeperiod = function() {
			debugger;
			$rootScope.timeperiodTedrops = [ "Last 30 days", "Last 60 days",
					"Last 90 days", "Last 180 days", "Last 365 days" ];
			$rootScope.noofdays = [ "30", "60", "90", "180", "365" ];

			if (localStorageService.get('dtfrom') != null
					&& localStorageService.get('dtto') == null) {
				$scope.dtfrom = new Date(localStorageService.get('dtfrom'));
				$scope.dtto = new Date();
				$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			} else if (localStorageService.get('dtfrom') != null
					&& localStorageService.get('dtto') != null
					&& localStorageService.get('timeperiod') != null) {
				$scope.dtfrom = new Date(localStorageService.get('dtfrom'));
				$scope.dtto = new Date(localStorageService.get('dtto'));
				$scope.selectedtimeperioddrop = localStorageService
						.get('timeperiod');
				$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			} else if (localStorageService.get('dtfrom') != null
					&& localStorageService.get('dtto') != null) {
				$scope.dtfrom = new Date(localStorageService.get('dtfrom'));
				$scope.dtto = new Date(localStorageService.get('dtto'));
				localStorageService.set('timeperiod', null);
				$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			} else {
				$scope.selectedtimeperioddrop = localStorageService
						.get('timeperiod');
				$scope.gettimeperiodselection($scope.selectedtimeperioddrop);
			}
			var timep = $scope.selectedtimeperioddrop;
			localStorageService.set('timeperiod', timep);
			$rootScope.timeperiodTe = localStorageService.get('timeperiod');
			// $rootScope.exefilterfunction(); //drop-down change--not needed
		}

		$scope.gettimeperiodselection = function(timeperiod) {
			
			localStorageService.set('timeperiod', timeperiod);
			$rootScope.timeperiodTe = localStorageService.get('timeperiod');
			var index = $rootScope.timeperiodDashdrops.indexOf(timeperiod);
			var selectednoofdays = $rootScope.noofdays[index];
			var to = new Date();
			var from = new Date();

			$scope.dtto = to;
			$scope.dtfrom = new Date(from.setDate(to.getDate()
					- selectednoofdays));

			$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			$rootScope.exefilterfunction(); // drop-down change
		}

		$scope.convertDateToString = function(dtfrom, dtto) {
			var dfrom = $scope.dtfrom;
			var month = dfrom.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var date = dfrom.getDate();
			if (date < 10) {
				date = '0' + date;
			}
			var year = dfrom.getFullYear();

			$scope.dtfromfinal = "" + month + "/" + date + "/" + year;

			var dto = $scope.dtto;
			var month = dto.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var date = dto.getDate();
			if (date < 10) {
				date = '0' + date;
			}
			var year = dto.getFullYear();

			$scope.dttofinal = "" + month + "/" + date + "/" + year;

			localStorageService.set('dtfrom', $scope.dtfromfinal);
			localStorageService.set('dtto', $scope.dttofinal);

			$rootScope.dfromvalTe = $scope.dtfromfinal; // storage date reset
			$rootScope.dtovalTe = $scope.dttofinal; // storage date reset
			// $rootScope.exefilterfunction();
		}

		// Function call for each dropdown 'change'--imp

		$rootScope.exefilterfunction = function() {
			
			alert("exfilterfunction");
			
			$rootScope.initialtccount();
			$rootScope.manualtccount();
			$rootScope.autotccount();
			$rootScope.tccoverage();
			$rootScope.firstpassrate();
			$rootScope.errordiscoveryrate();
			$scope.executionTrendChart();
			$scope.testExeStatusPie();
			$scope.testOwnerChart();
			$scope.tcexeTableData(1);
			$scope.initialcountpaginate();
			$scope.getCycleDetails();

			$scope.FuncationalAutomation();
			
			$scope.FuncationalAutomation();
			$scope.functionalUtilChart();
			
			$scope.UATAutomation();
			
			$scope.RegressionAutomation();
			$scope.regressionUtilChart();

		}

		/* Export Graphs and tables */
		function saveCanvasAs(canvas, fileName) {
			// get image data and transform mime type to
			// application/octet-stream
			var canvasDataUrl = canvas.toDataURL().replace(
					/^data:image\/[^;]*/, 'data:application/octet-stream'), link = document
					.createElement('a'); // create an anchor tag

			// set parameters for downloading
			link.setAttribute('href', canvasDataUrl);
			link.setAttribute('target', '_blank');
			link.setAttribute('download', fileName);

			// compat mode for dispatching click on your anchor
			if (document.createEvent) {
				var evtObj = document.createEvent('MouseEvents');
				evtObj.initEvent('click', true, true);
				link.dispatchEvent(evtObj);
			} else if (link.click) {
				link.click();
			}
		}
		function fillCanvasBackgroundWithColor(canvas, color) {
			const context = canvas.getContext('2d');
			context.save();
			context.globalCompositeOperation = 'destination-over';
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.restore();
		}

		$scope.downloadImg = function(format, elementId, filename) {
			var canvas = document.getElementById(elementId);
			var destinationCanvas = document.createElement("canvas");
			destinationCanvas.width = canvas.width;
			destinationCanvas.height = canvas.height;
			var destCtx = destinationCanvas.getContext('2d');
			destCtx.drawImage(canvas, 0, 0);
			fillCanvasBackgroundWithColor(destinationCanvas, '#4F5D77');
			if (format === 'jpeg') {
				saveCanvasAs(destinationCanvas, filename + ".jpg");
			}
			if (format === 'png') {
				saveCanvasAs(destinationCanvas, filename + ".png");
			}

		}
		$scope.tcexeTableDataExport = function(start_index) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
					|| $rootScope.dfromvalTe == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTe;
			}

			if ($rootScope.dtovalTe == null || $rootScope.dtovalTe == undefined
					|| $rootScope.dtovalTe == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTe;
			}
			var index = start_index;
			var itemsPerPage = 0;
			$http.get(
					"./rest/almMetricsServices/tcexeTableDetails?itemsPerPage="
							+ itemsPerPage + "&start_index=" + index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTe, config).success(
					function(response) {
						$scope.tcexeTableDetailsExport = response;
						
					});
		};

		$scope.downloadTable = function(format, elementId, filename) {
			if (format === 'csv') {
				var table = document.getElementById(elementId);
				var csvString = '';
				for (var i = 0; i < table.rows.length; i++) {
					var rowData = table.rows[i].cells;
					for (var j = 0; j < rowData.length; j++) {
						csvString = csvString + rowData[j].innerHTML + ",";
					}
					csvString = csvString.substring(0, csvString.length - 1);
					csvString = csvString + "\n";
				}
				csvString = csvString.substring(0, csvString.length - 1);
				
				var blob = new Blob([ csvString ], {
					type : "text/csv;charset=utf-8;"
				});
				saveAs(blob, filename + ".csv");
			}
			if (format === 'xls') {
				var blob = new Blob(
						[ document.getElementById('exportableTable').innerHTML ],
						{
							type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
						});
				saveAs(blob, filename + ".xls");
			}
		}
		/* Export graphs and tables */

	}
})();