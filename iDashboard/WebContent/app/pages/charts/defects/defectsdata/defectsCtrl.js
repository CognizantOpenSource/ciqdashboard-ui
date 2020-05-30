
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.defects').controller(
			'defectsCtrl', defectsCtrl).filter('trimDesc', function() {
		return function(value) {
			if (!angular.isString(value)) {
				return value;
			}
			return value.replace(/^\s+|\s+$/g, '');
		};
	})

	.filter('htmlToPlaintext', function() {
		return function(text) {
			return text ? String(text).replace(/<[^>]+>/gm, '') : '';
		};
	});

	/** @ngInject */
	function defectsCtrl($sessionStorage, paginationService, AES,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths,$filter) {
		
		
		$rootScope.MetricsName = "Test Defects";
		$scope.init = function() {
			$rootScope.dataloader = true;
		}

		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$rootScope.timeperiodDef = localStorageService.get('timeperiod');
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		$rootScope.tool = localStorageService.get('tool');
		
		$scope.dtfrom = localStorageService.get('dtfrom');
		$scope.dtto = localStorageService.get('dtto');

		if ($scope.dtto != null) {

			var dtToDate = new Date($scope.dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');

			localStorageService.set('dttoPlus', dtToDateStr);
		}


		// Closed Defect Count on Page Load - Dashboard
		$rootScope.defclosedcount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/defectServices/closedCountinitial?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$rootScope.defcloseddata = response;
					});
		};

		// Defect Count on Page Load
		$rootScope.initialcount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			$http
					.get(
							"rest/almMetricsServices/totalDefectCountinitial?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(function(response) {
						$rootScope.defectCount = response;
					});
		};

		// Defect Rejection Rate on Page Load
		$rootScope.defectrejrate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			$http
					.get(
							"./rest/almMetricsServices/defectRejectionRate?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.defectRejectionRate = response;
								$scope.loadPieCharts('#defrejrate',
										$scope.defectRejectionRate);
							});
		}

		$rootScope.defectResolutionChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalDashboardALMServices/defectResolutionTime?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.data = response;
						if (response.length != 0) {
							$scope.resolutionchart($scope.data);
						} else {
							$('#resolutionchart').remove(); // this is my
							// <canvas> element
							$('#resoldiv').append(
									'<canvas id="resolutionchart"> </canvas>');
						}
					});
			$scope.resolutionchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				for (var i = 0; i < $scope.result.length; i++) {

					$scope.labels1.push($scope.result[i].severity);

					$scope.data1.push($scope.result[i].defrestime);
				}
				$scope.labels = $scope.labels1;
				$scope.data = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#resolutionchart').remove(); // this is my <canvas>
				// element
				$('#resoldiv')
						.append('<canvas id="resolutionchart"> </canvas>');
				var ctx = document.getElementById("resolutionchart");
				var resolutionchart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : $scope.labels1,

						datasets : [ {
							data : $scope.data1,
							backgroundColor : [ "rgba(75, 192, 192, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(255, 206, 86, 0.8)",
									"rgba(255, 99, 132, 0.8)",
									"rgba(255, 159, 64, 0.8)", ],
							borderColor : [ "rgba(75, 192, 192, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(255, 206, 86, 1)",
									"rgba(255, 99, 132, 1)",
									"rgba(255, 159, 64, 1)", ],
							borderWidth : 1
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						tooltips : {
							enabled : true,
							callbacks : {
								label : function(tooltipItem) {
									return "" + Number(tooltipItem.yLabel)
											+ " days";
								}
							}
						},
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ],
							xAxes : [ {
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

		// Defect trend chart

		$scope.defectTrendChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/defecttrendchartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.defectlinechart($scope.data);
								} else {
									$('#defectline').remove(); // this is my <canvas>
									// element
									$('#defectdiv')
											.append(
													'<canvas id="defectline"> </canvas>');
								}
							});

			$scope.defectlinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.newDefects = [];
				$scope.readyforQA = [];
				$scope.nostatus = [];
				$scope.openDefects = [];
				$scope.closedDefects = [];
				$scope.fixedDefects = [];
				$scope.rejectedDefects = [];
				$scope.reopenDefects = [];
				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.newDefects.push($scope.lineresult[i].newDefects);
					$scope.readyforQA.push($scope.lineresult[i].readyQA);
					$scope.nostatus.push($scope.lineresult[i].nostatus);
					$scope.openDefects.push($scope.lineresult[i].openDefects);
					$scope.closedDefects
							.push($scope.lineresult[i].closedDefects);
					$scope.fixedDefects.push($scope.lineresult[i].fixedDefects);
					$scope.rejectedDefects
							.push($scope.lineresult[i].rejectedDefects);
					$scope.reopenDefects
							.push($scope.lineresult[i].reopenDefects);
				}
				$scope.data = [ $scope.newDefects, $scope.readyforQA,
						$scope.nostatus, $scope.openDefects,
						$scope.closedDefects, $scope.fixedDefects,
						$scope.rejectedDefects, $scope.reopenDefects ];
				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.newDefects,
							label : "New Defects",
							pointStyle : "line",
							borderColor : "rgba(199, 99, 5, 0.9)",
							pointBackgroundColor : "rgba(199, 99, 5, 0.9)"
						}, {
							data : $scope.readyforQA,
							label : "Ready for QA",
							pointStyle : "line",
							borderColor : "rgba(253, 151, 104, 0.9)",
							pointBackgroundColor : "rgba(253, 151, 104, 0.9)"
						}, {
							data : $scope.nostatus,
							label : "No Status",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.9)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.9)"
						}, {
							data : $scope.openDefects,
							label : "Open Defects",
							pointStyle : "line",
							borderColor : "rgba(255, 31, 0, 0.9)",
							pointBackgroundColor : "rgba(255, 31, 0, 0.9)"

						}, {
							data : $scope.closedDefects,
							label : "Closed Defects",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 0.9)",
							pointBackgroundColor : "rgba(9, 191, 22, 0.9)"

						}, {
							data : $scope.fixedDefects,
							label : "Fixed Defects",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 0.9)",
							pointBackgroundColor : "rgba(236, 255, 0, 0.9)"

						}, {
							data : $scope.rejectedDefects,
							label : "Rejected Defects",
							pointStyle : "line",
							borderColor : "rgba(153, 102, 255, 0.9)",
							pointBackgroundColor : "rgba(153, 102, 255, 0.9)"

						}, {
							data : $scope.reopenDefects,
							label : "Reopen Defects",
							pointStyle : "line",
							borderColor : "rgba(255, 99, 132, 0.9)",
							pointBackgroundColor : "rgba(255, 99, 132, 0.9)"

						} ]
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
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {

									fontColor : '#4c4c4c'
								},
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : '#4c4c4c'
								},
							} ],
							yAxes : [ {
								gridLines : {
									color : "#d8d3d3",
								},
								scaleLabel : {
									display : true,
									labelString : 'No. of Defects',
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

							// Panning directions. Remove the appropriate direction to
							// disable
							// Eg. 'y' would only allow panning in the y direction
							mode : 'x'
						},

						// Container for zoom options
						zoom : {
							// Boolean to enable zooming
							enabled : true,

							// Zooming directions. Remove the appropriate direction to
							// disable
							// Eg. 'y' would only allow zooming in the y direction
							mode : 'x',
						}
					}
				}
				$('#defectline').remove(); // this is my
				// <canvas> element
				$('#defectdiv').append('<canvas id="defectline"> </canvas>');

				var ctx = document.getElementById("defectline");
				window.defectline = new Chart(ctx, config);

			}
		}

		// Defect By Priority Chart
		$scope.newPriorityChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/defectsprioritychartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.prioritychart($scope.data);
								} else {
									$('#defectpriority').remove(); // this is my <canvas>
									// element
									$('#prioritydiv')
											.append(
													'<canvas id="defectpriority"> </canvas>');
								}
							});

			$scope.prioritychart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].priority == "") {
						$scope.result[i].priority = "No Priority";
					}
					$scope.labels1.push($scope.result[i].priority);
					$scope.data1.push($scope.result[i].priorityCnt);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defectpriority').remove(); // this is my <canvas>
				// element
				$('#prioritydiv').append(
						'<canvas id="defectpriority"> </canvas>');

				var ctx = document.getElementById("defectpriority");
				var defectpriority = new Chart(ctx, {
					type : 'pie',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(255, 113, 189, 0.9)",
									"rgba(9, 191, 22, 0.9)",
									"rgba(6, 239, 212, 0.9)",
									"rgba(236, 255, 0, 0.9)",
									"rgba(255, 159, 64, 0.9)",
									"rgba(255, 31, 0, 0.9)" ],
							borderColor : [ "rgba(255, 113, 189, 1)",
									"rgba(9, 191, 22, 1)",
									"rgba(6, 239, 212, 1)",
									"rgba(236, 255, 0, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 31, 0, 1)" ],
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

		// Defect By Severity Chart
		$scope.newSeverityChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/defectsseveritychartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)

					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.severitychart($scope.data);
								} else {
									$('#defectseverity').remove(); // this is my <canvas>
									// element
									$('#severitydiv')
											.append(
													'<canvas id="defectseverity"> </canvas>');
								}
							});

			$scope.severitychart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].severity == "") {
						$scope.result[i].severity = "No Severity";
					}
					$scope.labels1.push($scope.result[i].severity);
					$scope.data1.push($scope.result[i].severityCnt);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defectseverity').remove(); // this is my
				// <canvas> element
				$('#severitydiv').append(
						'<canvas id="defectseverity"> </canvas>');

				var ctx = document.getElementById("defectseverity");
				var defectseverity = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(9, 191, 22, 0.9)",
									"rgba(6, 239, 212, 0.9)",
									"rgba(236, 255, 0, 0.9)",
									"rgba(255, 159, 64, 0.9)",
									"rgba(255, 31, 0, 0.9)" ],
							borderColor : [ "rgba(9, 191, 22, 0.9)",
									"rgba(6, 239, 212, 1)",
									"rgba(236, 255, 0, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 31, 0, 1)" ],
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

		// Defect By Owner Chart
		$scope.newOwnerChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/defectownerchartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.ownerchart($scope.data);
								} else {
									$('#defectowner').remove(); // this is my <canvas>
									// element
									$('#ownerdiv')
											.append(
													'<canvas id="defectowner"></canvas>');
								}
							});

			$scope.ownerchart = function(result) {

				var dynamicColors = function() {
					var r = Math.floor(Math.random() * 255);
					var g = Math.floor(Math.random() * 255);
					var b = Math.floor(Math.random() * 255);
					return "rgb(" + r + "," + g + "," + b + ")";
				};
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				var color = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].assignedto == "") {
						$scope.result[i].assignedto = "Not AssignedTo";
					}
					$scope.labels1.push($scope.result[i].assignedto);
					$scope.data1.push($scope.result[i].usercount);
					color.push(dynamicColors());
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defectowner').remove(); // this is my <canvas>
				// element
				$('#ownerdiv').append('<canvas id="defectowner"></canvas>');

				var ctx = document.getElementById("defectowner");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									data : $scope.datapie,
									backgroundColor : color,
									borderColor : color,
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
																// This below lines are user to show
																// the count in TOP of the BAR
																/*
																 * var data = dataset.data[index];
																 * ctx.fillText(data, bar._model.x,
																 * bar._model.y - 5);
																 */

																// This below lines are user to show
																// the count in CENTER of the BAR
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
									}
								},
								tooltips : {
									enabled : true
								},
								tooltipEvents : [],
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor : '#4c4c4c'
										},
										scaleLabel : {
											display : true,
											labelString : 'No. of defects',
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

		// Teble details
		$scope.defectTableData = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}

			$scope.start_index = start_index;
			$http
					.get(
							"./rest/almMetricsServices/defectTableDetails?itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(function(response) {
						$scope.defectTableDetails = response;
					});
			/*
			 * paginationService.setCurrentPage("defpaginate",
			 * $scope.start_index);
			 */

		};

		// pagination count details
		$scope.initialcountpaginate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;

			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/totalDefectCountinitial?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(function(response) {
						$rootScope.defdatapaginatecount = response;
					});
		}

		// pagination call
		$scope.pageChangedLevel = function(pageno) {
			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {
				$scope.defectTableData($scope.pageno);
			} else if ($rootScope.sortkey == true) {
				$scope
						.sortedtable($scope.sortBy, $scope.pageno,
								$scope.reverse);
			} else if ($rootScope.searchkey == true) {
				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		// Sort function starts here
		$scope.sort = function(keyname, start_index) {
			$scope.sortBy = keyname;
			$rootScope.sortkey = true;
			$rootScope.searchkey = false;
			$scope.start_index = start_index;
			$scope.reverse = !$scope.reverse;
			$scope.sortedtable($scope.sortBy, $scope.start_index,
					$scope.reverse);
		};

		// Table on-load with sort implementation
		$scope.sortedtable = function(sortvalue, start_index, reverse) {

			paginationService.setCurrentPage("defpaginate", start_index);

			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/defectServices/defectsData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDef, config).success(
					function(response) {
						$scope.defectTableDetails = response;
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

			if ($scope.searchField == "defectId") {
				$rootScope.defectId = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "summary") {
				$rootScope.summary = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "releaseName") {
				$rootScope.releaseName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "priority") {
				$rootScope.priority = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "severity") {
				$rootScope.severity = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "assignedto") {
				$rootScope.assignedto = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "status") {
				$rootScope.status = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "environment") {
				$rootScope.env = searchText;
				$scope.key = true;
			}

			$scope.searchable();
			// $scope.searchable(start_index,$scope.searchField,$scope.searchText)
			// ;
		}

		$scope.searchable = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if ($rootScope.defectId == undefined) {
				$rootScope.defectId = 0;
			}
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}

			/* $scope.defectTableData(1); */

			$http
					.get(
							"./rest/defectServices/searchpagecount?"
									+ "defectId="
									+ $rootScope.defectId
									+ "&summary="
									+ $rootScope.summary
									+ "&priority="
									+ $rootScope.priority
									+ "&status="
									+ $rootScope.status
									+ "&severity="
									+ $rootScope.severity
									+ "&assignedto="
									+ $rootScope.assignedto
									+ "&releaseName="
									+ $rootScope.releaseName
									+ "&environment="
									+ $rootScope.env
									+ "&dashboardName="
									+ dashboardName
									+ "&domainName="
									+ domainName
									+ "&projectName="
									+ projectName
									+ "&vardtfrom="
									+ vardtfrom
									+ "&vardtto="
									+ vardtto
									+ "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(function(response) {
						$rootScope.defdatapaginatecount = response;
					});
			paginationService.setCurrentPage("defpaginate", $scope.start_index);
			$scope.itemsPerPage = 5;
			$scope.index = $scope.start_index; // Fix
			$http
					.get(
							"./rest/defectServices/searchDefects?"
									+ "defectId="
									+ $rootScope.defectId
									+ "&summary="
									+ $rootScope.summary
									+ "&priority="
									+ $rootScope.priority
									+ "&status="
									+ $rootScope.status
									+ "&severity="
									+ $rootScope.severity
									+ "&assignedto="
									+ $rootScope.assignedto
									+ "&releaseName="
									+ $rootScope.releaseName
									+ "&environment="
									+ $rootScope.env
									+ "&itemsPerPage="
									+ $scope.itemsPerPage
									+ "&start_index="
									+ $scope.start_index
									+ "&dashboardName="
									+ dashboardName
									+ "&domainName="
									+ domainName
									+ "&projectName="
									+ projectName
									+ "&vardtfrom="
									+ vardtfrom
									+ "&vardtto="
									+ vardtto
									+ "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialcountpaginate();
									$scope.defectTableData(1);
								} else if (response == null) {
									$rootScope.searchkey = false;
									$scope.initialcountpaginate();
									$scope.defectTableData(1);
								} else {
									paginationService.setCurrentPage(
											"defpaginate", $scope.start_index);
									$scope.defectTableDetails = response;
								}
							});
		}

		// PopUp of Defect details using D3 Cross Filter
		$scope.openpopup = function(size) {
			$rootScope.defectsanalyse = $uibModal
					.open({
						animation : true,
						templateUrl : 'app/pages/charts/defects/defectsdata/defectPopupData.html',
						scope : $scope,
						size : size,
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		// Pie Chart with Small ba-panel
		$scope.loadPieCharts = function(id, chartcount) {
			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(
					function() {
						var chart = $(this);
						chart
								.easyPieChart({
									easing : 'easeOutBounce',
									onStep : function(from, to, percent) {
										$(this.el).find('.percent').text(
												Math.round(percent));
									},
									barColor : function(chartcount) {
										return (chartcount < 30 ? 'green'
												: (chartcount <= 60 ? 'orange'
														: 'red'));
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
		// Auto updates ba-panel Pie Chart
		function updatePieCharts(id, count) {
			$scope.id = id;
			$scope.count = count;
			$($scope.id).each(function(index, chart) {
				$(chart).data('easyPieChart').update($scope.count);
			});
		}
		$timeout(function() {
		}, 1000);

		/* Date Filter Code Starts Here */
		// CALENDER DEFAULT VALUE

		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$rootScope.dfromvalDef = dtfrom;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('timeperiod', null);
			localStorageService.set('dtfrom', dtfrom);
			$rootScope.timeperiodDef = localStorageService.get('timeperiod');
			
			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}
			
			$rootScope.defectfilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$rootScope.dtovalDef = dtto;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtto', dtto);
			localStorageService.set('timeperiod', null);
			console.log(timeperiod);
			$rootScope.timeperiodDef = localStorageService.get('timeperiod');
			
			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}
			
			$rootScope.defectfilterfunction();
		}

		$scope.gettimeperiod = function() {
			$rootScope.timeperiodDefdrops = [ "Last 30 days", "Last 60 days",
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
			$rootScope.timeperiodDef = localStorageService.get('timeperiod');

		}

		$scope.gettimeperiodselection = function(timeperiod) {
			localStorageService.set('timeperiod', timeperiod);
			$rootScope.timeperiodDef = localStorageService.get('timeperiod');
			var index = $rootScope.timeperiodDashdrops.indexOf(timeperiod);
			var selectednoofdays = $rootScope.noofdays[index];
			var to = new Date();
			var from = new Date();

			$scope.dtto = to;
			$scope.dtfrom = new Date(from.setDate(to.getDate()
					- selectednoofdays));

			$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			
			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.defectfilterfunction();
			$scope.defectTableData(1);
			$scope.downloadDefectTableData(1);

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

			$rootScope.dfromvalDef = $scope.dtfromfinal; // storage date
			// reset
			$rootScope.dtovalDef = $scope.dttofinal; // storage date
			// reset
			// $rootScope.defectfilterfunction();

		}

		// Function call for each dropdown change

		$rootScope.defectfilterfunction = function() {
			$scope.totdefcountfilter();
			$scope.defectrejratefilter();
			$scope.defectleakageSITtoUAT();
			$scope.defectleakageSITtoPROD();
			$scope.defectTrendChart();
			$scope.newPriorityChart();
			$scope.newSeverityChart();
			$scope.newOwnerChart();
			$scope.initialcountpaginate();
			$scope.defectTableData(1);

		}

		// Total Defect Count - Date Filter
		$rootScope.totdefcountfilter = function() {
			// alert("Time Period Def : " + $rootScope.timeperiodDef);
			var token = AES.getEncryptedValue();

			var config = {
				headers : {

					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/totalDefectCountFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(function(response) {
						$rootScope.totdefectCount = response;
					});
		};

		// Defect Rejection Rate - Date Filter
		$rootScope.defectrejratefilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/defectRejRateFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.defectRejection = response;
								$scope.loadPieCharts('#defrejratefilter',
										$scope.defectRejection);
							});
		}
		
		// New Metrics
		
		$rootScope.defectleakageSITtoPROD = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			// vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/defectRejRateFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.defectleakageSITtoPROD = 0;
								//$scope.defectleakageSITtoPROD = response;
								$scope.loadPieCharts('#defleakageSITtoPROD',
										$scope.defectleakageSITtoPROD);
							});
		}
		
		$rootScope.defectleakageSITtoUAT = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/defectRejRateFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDef, config)
					.success(
							function(response) {
								$scope.defectleakageSITtoUAT = 1;
								//$scope.defectleakageSITtoUAT = response;
								$scope.loadPieCharts('#defleakageSITtoUAT',
										$scope.defectleakageSITtoUAT);
							});
		}
		
		// New Metrics
		
		
		

		/* Date Filter Code Ends Here */
		
		/*Defect Density Filter */
		
		$rootScope.defectdensityfilter = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/defectdensityFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(
					function(response) {
						$scope.defectdensity = response;
						/*$scope.loadPieCharts('#defdensityfilter',
								$scope.defectdensity);*/
						$scope.loadDefectDensityPieCharts('#defdensityfilter',
								$scope.defectdensity);
						$rootScope.dataloader = false;

					});

			//$('#cover-spin').hide(0);

		}
		
		/* End of Defect Density Filter*/
		
		/* Defect Density Pie Chart */
		
		$scope.loadDefectDensityPieCharts = function(id, chartcount) {

			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(
					function() {
						var chart = $(this);
						chart
								.easyPieChart({
									easing : 'easeOutBounce',
									onStep : function(from, to, percent) {
										$(this.el).find('.percent').text(
												Math.round(percent));
									},
									barColor : function(chartcount) {
										return (chartcount <= 30 ? 'green'
												: (chartcount <= 60 ? 'red'
														: 'orange'));
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
		
		/* End of Defect Dnesity Filter */

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
		$scope.downloadDefectTableData = function(start_index) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDef == null
					|| $rootScope.dfromvalDef == undefined
					|| $rootScope.dfromvalDef == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDef;
			}

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}
			var start_index = 1;
			var itemsPerPage = 0;
			$http.get(
					"./rest/almMetricsServices/defectTableDetails?itemsPerPage="
							+ itemsPerPage + "&start_index=" + start_index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDef, config).success(
					function(response) {
						$scope.defectTableDetails = response;
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
				console.log(csvString);
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
