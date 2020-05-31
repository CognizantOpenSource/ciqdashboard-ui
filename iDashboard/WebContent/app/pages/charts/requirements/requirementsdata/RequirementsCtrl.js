/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.requirements').controller(
			'RequirementsCtrl', RequirementsCtrl).filter('trimDesc',
			function() {
				return function(value) {
					if (!angular.isString(value)) {
						return value;
					}
					return value.replace(/^\s+|\s+$/g, '');
				};
			});

	/** @ngInject */
	function RequirementsCtrl($sessionStorage, AES, paginationService,
			UserService, localStorageService, $element, $scope, $base64, $http,
			$timeout, $uibModal, $rootScope, baConfig, layoutPaths, $filter) {

		$rootScope.MetricsName = "Test Requirments";
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		$rootScope.timeperiodReq = localStorageService.get('timeperiod');

		$scope.dtfrom = localStorageService.get('dtfrom');
		$scope.dtto = localStorageService.get('dtto');

		if ($scope.dtto != null) {

			var dtToDate = new Date($scope.dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');

			localStorageService.set('dttoPlus', dtToDateStr);
		}

		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');

		$scope.init = function() {
			$rootScope.dataloader = true;
		}

		/*var dateplus = function() {
			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				return dtToDateStr;

				//localStorageService.set('dttoPlus', dtToDateStr);
			}

		}*/
		// Total Req. Count on Load - Dashboard
		$rootScope.initialreqpasscount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/requirementServices/reqPassedCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$rootScope.reqpassdata = response;

					});
		}

		// Requirement Priority Funnel Chart - Dashboard

		$rootScope.reqPrioirtyFunnelChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/requirementServices/reqprioritychartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.funnel($scope.data);
								} else {
									$('#my-funnel').remove(); // this is my
									// <canvas>
									// element
									$('#funneldiv')
											.append(
													' <canvas id="my-funnel" height="250" style="margin-top:40px;margin-left:100px"> </canvas>');
								}
							});

			$scope.funnel = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.backgroundColor = [];
				$scope.borderColor = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].priority == "") {
						$scope.result[i].priority = "No Priority";
					}

					if ($scope.result[i].priority == "No Priority") {
						$scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
						$scope.borderColor.push("rgba(54, 162, 235, 1)");
					}
					if ($scope.result[i].priority == "1-Low") {
						$scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
						$scope.borderColor.push("rgba(75, 192, 192, 1)");
					}
					if ($scope.result[i].priority == "2-Medium") {
						$scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
						$scope.borderColor.push("rgba(153, 102, 255, 1)");
					}
					if ($scope.result[i].priority == "3-High") {
						$scope.backgroundColor.push("rgba(255, 206, 86, 0.8)");
						$scope.borderColor.push("rgba(255, 206, 86, 1)");
					}
					if ($scope.result[i].priority == "4-Very High") {
						$scope.backgroundColor.push("rgba(255, 159, 64, 0.8)");
						$scope.borderColor.push("rgba(255, 159, 64, 1)");
					}
					if ($scope.result[i].priority == "5-Urgent") {
						$scope.backgroundColor.push("rgba(255, 99, 132, 0.8)");
						$scope.borderColor.push("rgba(255, 99, 132, 1)");
					}
					$scope.labels1.push($scope.result[i].priority);
					$scope.data1.push($scope.result[i].priorityCnt);
				}
				$scope.labelsfunnel = $scope.labels1;
				$scope.datafunnel = $scope.data1;

				FunnelChart('my-funnel', {
					values : $scope.datafunnel,
					labels : $scope.labelsfunnel,
					displayPercentageChange : false,
					sectionColor : [ "rgba(255, 99, 132, 0.8)",
							"rgba(54, 162, 235, 0.8)",
							"rgba(255, 206, 86, 0.8)",
							"rgba(75, 192, 192, 0.8)",
							"rgba(153, 102, 255, 0.8)",
							"rgba(255, 159, 64, 0.8)" ],
					labelFontColor : "rgba(255, 255, 255, 0.8)"
				});
			}
		}

		$scope.getRollingPeriod = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/jiraMetricsServices/getRollingPeriod?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.rollingPeriodTime = response;
						localStorageService.set('rollingPeriod',
								$scope.rollingPeriodTime);
						$scope.selectedrollingPeriod();
					});
		}

		$scope.selectedrollingPeriod = function() {
			$scope.rollingPeriod = localStorageService.get('rollingPeriod');
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalServices/selectednoofdays?rollingPeriod="
							+ $scope.rollingPeriod, config).success(
					function(response) {
						if (response != 0) {
							var to = new Date();
							var from = new Date();

							$scope.dtto = to;
							$scope.dtfrom = new Date(from.setDate(to.getDate()
									- response));

							$scope.convertDateToStringVal($scope.dtfrom,
									$scope.dtto);
						}

					});

		}
		$scope.convertDateToStringVal = function(fromDate, toDate) {
			var dfrom = fromDate;
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
			$scope.dfromval = $scope.dtfromfinal;
			var dto = toDate;
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
			$scope.dtoval = $scope.dttofinal;
			localStorageService.set('dtfrom', $scope.dtfromfinal);
			localStorageService.set('dtto', $scope.dttofinal);
			$rootScope.dfromDash = $scope.dtfromfinal; // storage date reset
			$rootScope.dtoDash = $scope.dttofinal; // storage date reset

		}
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
								return (chartcount < 30 ? 'red'
										: (chartcount <= 60 ? 'orange'
												: 'green'));
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

		/* ALM Requirement Trend Chart */

		$scope.reqTrendChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/requirementtrendchartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$scope.data = response;
						$scope.linechart($scope.data);
					});
			$scope.linechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.nostatus = [];
				$scope.notapplicable = [];
				$scope.notcompleted = [];
				$scope.blocked = [];
				$scope.failed = [];
				$scope.norun = [];
				$scope.notcovered = [];
				$scope.passed = [];
				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].mydate);

					$scope.nostatus.push($scope.lineresult[i].nostatus);
					$scope.notapplicable
							.push($scope.lineresult[i].notapplicable);
					$scope.notcompleted.push($scope.lineresult[i].notcompleted);
					$scope.blocked.push($scope.lineresult[i].blocked);
					$scope.failed.push($scope.lineresult[i].failed);
					$scope.norun.push($scope.lineresult[i].norun);
					$scope.notcovered.push($scope.lineresult[i].notcovered);
					$scope.passed.push($scope.lineresult[i].passed);
				}
				$scope.data = [ $scope.nostatus, $scope.notapplicable,
						$scope.notcompleted, $scope.blocked, $scope.failed,
						$scope.norun, $scope.notcovered, $scope.passed ];

				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.nostatus,
							label : "No status",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.7)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.7)",
						}, {
							data : $scope.notapplicable,
							label : "Not applicable",
							pointStyle : "line",
							borderColor : "rgba(153, 102, 255, 0.8)",
							pointBackgroundColor : "rgba(153, 102, 255, 0.8)",
						}, {
							data : $scope.notcompleted,
							label : "Not completed",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 0.9)",
							pointBackgroundColor : "rgba(236, 255, 0, 0.9)",
						}, {
							data : $scope.blocked,
							label : "Blocked",
							pointStyle : "line",
							borderColor : "rgba(255, 134, 0, 1)",
							pointBackgroundColor : "rgba(255, 134, 0, 1)",

						}, {
							data : $scope.failed,
							label : "Failed",
							pointStyle : "line",
							borderColor : "rgba(255, 31, 0, 0.9)",
							pointBackgroundColor : "rgba(255, 31, 0, 0.9)",

						}, {
							data : $scope.norun,
							label : "No run",
							pointStyle : "line",
							borderColor : "rgba(255, 113, 189, 1)",
							pointBackgroundColor : "rgba(255, 113, 189, 1)",

						}, {
							data : $scope.notcovered,
							label : "Not covered",
							pointStyle : "line",
							borderColor : "rgba(199, 99, 5, 1)",
							pointBackgroundColor : "rgba(199, 99, 5, 1)"

						}, {
							data : $scope.passed,
							label : "Passed",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)",

						} ]
					},
					options : {
						/* steppedLine: true, */
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
									labelString : 'Requirement Count',
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
				$('#dailystatus').remove(); // this is my <canvas> element
				$('#dailystatusdiv').append(
						'<canvas id="dailystatus"> </canvas>');
				var ctx = document.getElementById("dailystatus");
				window.line = new Chart(ctx, config);

			}
		}

		// ALM Requirements by Status Chart
		$scope.reqStatusChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/reqstatuschartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$scope.data = response;
						$scope.statuschartnew($scope.data);
					});

			$scope.statuschartnew = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].status == "") {
						$scope.result[i].status = "No Status";
					}
					$scope.labels1.push($scope.result[i].status);

					$scope.data1.push($scope.result[i].statusCnt);
				}
				$scope.labels = $scope.labels1;
				$scope.data = $scope.data1;

				var layoutColors = baConfig.colors;
				var color = [];

				var dynamicColors = function() {
					var r = Math.floor(Math.random() * 255);
					var g = Math.floor(Math.random() * 255);
					var b = Math.floor(Math.random() * 255);
					return "rgb(" + r + "," + g + "," + b + ")";
				};
				for ( var i in $scope.labels1) {
					if ($scope.labels1[i] == "Passed"
							|| $scope.labels1[i] == "PASSED")
						color.push("rgba(180, 230, 30, 0.9)");

					else if ($scope.labels1[i] == "Failed"
							|| $scope.labels1[i] == "FAILED")
						color.push("rgba(160, 13, 20, 0.9)");

					else
						color.push(dynamicColors());
				}

				$('#statuschart').remove(); // this is my <canvas> element
				$('#statuschartdiv').append(
						' <canvas id="statuschart"> </canvas>');

				var ctx = document.getElementById("statuschart");
				var myChart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels1,
								datasets : [ {
									data : $scope.data1,
									backgroundColor : color,
									borderColor : color,
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
																// This below lines are
																// user to show
																// the count in
																// TOP of the
																// BAR
																/*
																 * var data =
																 * dataset.data[index];
																 * ctx.fillText(data,
																 * bar._model.x,
																 * bar._model.y -
																 * 5);
																 */

																// This below
																// lines are
																// user to show
																// the count in
																// CENTER of the
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
									}
								},

								tooltips : {
									enabled : true
								},
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor : '#2c2c2c'
										},
										scaleLabel : {
											display : true,
											labelString : 'Requirement Count',
											fontColor : '#2c2c2c'
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],

									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Status',
											fontColor : '#2c2c2c'
										},
										gridLines : {
											color : "#d8d3d3"
										},
										ticks : {
											fontColor : '#2c2c2c'
										}
									} ]
								}
							}
						});

			};
		}

		// ALM Requirements Priority Chart

		$scope.reqPriorityChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/reqprioritychartfilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$scope.data = response;
						$scope.prioritychartnew($scope.data);
					});
			$scope.prioritychartnew = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.backgroundColor = [];
				$scope.borderColor = [];
				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].priority == "") {
						$scope.result[i].priority = "No priority";
					}

					if ($scope.result[i].priority == "No priority") {
						$scope.backgroundColor.push("rgba(255, 113, 189, 0.9)");
						$scope.borderColor.push("rgba(255, 113, 189, 1)");
					}
					if ($scope.result[i].priority == "1-Low") {
						$scope.backgroundColor.push("rgba(6, 239, 212, 0.9)");
						$scope.borderColor.push("rgba(6, 239, 212, 1)");
					}
					if ($scope.result[i].priority == "2-Medium") {
						$scope.backgroundColor.push("rgba(236, 255, 0, 0.9)");
						$scope.borderColor.push("rgba(236, 255, 0, 1)");
					}
					if ($scope.result[i].priority == "3-High") {
						$scope.backgroundColor.push("rgba(255, 127, 39, 0.9)");
						$scope.borderColor.push("rgba(255, 127, 39, 0.8)");
					}
					if ($scope.result[i].priority == "4-Very High") {
						$scope.backgroundColor.push("rgba(244, 119, 125, 0.9)");
						$scope.borderColor.push("rgba(244, 119, 125, 1)");
					}
					if ($scope.result[i].priority == "5-Urgent") {
						$scope.backgroundColor.push("rgba(255, 31, 0, 0.9)");
						$scope.borderColor.push("rgba(255, 31, 0, 1)");
					}
					$scope.labels1.push($scope.result[i].priority);
					$scope.data1.push($scope.result[i].priorityCnt);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#prioritychart').remove(); // this is my <canvas> element
				$('#prioritychartdiv').append('<canvas id="prioritychart">');
				var ctx = document.getElementById("prioritychart");
				var doughnut = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : $scope.backgroundColor,
							borderColor : $scope.borderColor,
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
							position : 'right',
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

		// ALM Table on-load
		$scope.reqTableData = function(start_index) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/reqTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.reqTableDetails = response;
					});
		};

		// Remote the html tag from the data
		$scope.htmlToPlaintext = function(text) {
			return text ? String(text).replace(/<[^>]+>/gm, '') : '';
		}

		$scope.initialReqcountpaginate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/totalReqCount?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;

					});
		}

		///-------------------------------------------------------
		// Table Search Function
		///---------------------------------------------------------

		$scope.search = function(start_index, searchField, searchText) {
			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "reqID") {
				$rootScope.reqID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "releaseName") {
				$rootScope.releaseName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "reqName") {
				$rootScope.reqName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "description") {
				$rootScope.description = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "reqType") {
				$rootScope.reqType = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "status") {
				$rootScope.status = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "priority") {
				$rootScope.priority = searchText;
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

			if ($rootScope.reqID == undefined) {
				$rootScope.reqID = 0;
			}

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/searchpagecount?reqName="
									+ $rootScope.reqName + "&reqID="
									+ $rootScope.reqID + "&releaseName="
									+ $rootScope.releaseName + "&description="
									+ $rootScope.description + "&reqType="
									+ $rootScope.reqType + "&status="
									+ $rootScope.status + "&priority="
									+ $rootScope.priority + "&dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});
			paginationService.setCurrentPage("reqpaginate", $scope.start_index);
			$scope.itemsPerPage = 5;
			$scope.index = $scope.start_index; // Fix

			$http
					.get(
							"./rest/almMetricsServices/searchRequirements?reqName="
									+ $rootScope.reqName + "&reqID="
									+ $rootScope.reqID + "&releaseName="
									+ $rootScope.releaseName + "&description="
									+ $rootScope.description + "&reqType="
									+ $rootScope.reqType + "&status="
									+ $rootScope.status + "&priority="
									+ $rootScope.priority + "&dashboardName="
									+ dashboardName + "&itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialReqcountpaginate();
									$scope.reqTableData(1);
								} else if (response == null) {
									$rootScope.searchkey = false;
									$scope.initialReqcountpaginate();
									$scope.reqTableData(1);
								} else {

									paginationService.setCurrentPage(
											"reqpaginate", $scope.start_index);
									$rootScope.reqTableDetails = response;
								}
							});
		}

		$scope.sort = function(keyname, start_index) {
			$rootScope.sortkey = true;
			$rootScope.searchkey = false;
			$scope.sortBy = keyname;
			$scope.index = start_index;
			$scope.reverse = !$scope.reverse;
			$scope.sortedtable($scope.sortBy, $scope.index, $scope.reverse);
		};

		// Table on-load with sort implementation
		$scope.sortedtable = function(sortvalue, start_index, reverse) {

			paginationService.setCurrentPage("reqpaginate", start_index);

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/requirementsData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.reqTableDetails = response;
					});
		}

		///--------------------------------------------------------------

		//Requirements Lazy Load Table Code Starts Here 
		$scope.reqpageChangedLevel = function(pageno) {

			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {
				$scope.reqTableData($scope.pageno);
			} else if ($rootScope.sortkey == true) {
				$scope
						.sortedtable($scope.sortBy, $scope.pageno,
								$scope.reverse);
			} else if ($rootScope.searchkey == true) {

				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		/*// Sort function starts here
		$scope.sort = function (keyname, start_index) {
		    $rootScope.sortkey = true;
		    $rootScope.searchkey = false;
		    $scope.sortBy = keyname;
		    $scope.index = start_index;
		    $scope.reverse = !$scope.reverse;
		    $scope.sortedtable($scope.sortBy, $scope.index, $scope.reverse);
		};

		// Table on-load with sort implementation
		$scope.sortedtable = function (sortvalue, start_index, reverse) {
		    var token = AES.getEncryptedValue();
		    var config = {
		        headers: {
		            'Authorization': token
		        }
		    };
		    $scope.column = sortvalue;
		    $scope.index = start_index;
		    $scope.order = reverse;
		    var vardtfrom = "";
		    var vardtto = "";

		    if ($rootScope.dfromvalReq == null
		        || $rootScope.dfromvalReq == undefined
		        || $rootScope.dfromvalReq == "") {
		        vardtfrom = "-";
		    } else {
		        vardtfrom = $rootScope.dfromvalReq;
		    }

		    if ($rootScope.dtovalReq == null
		        || $rootScope.dtovalReq == undefined
		        || $rootScope.dtovalReq == "") {
		        vardtto = "-";
		    } else {
		        vardtto = $rootScope.dtovalReq;
		    }


		    $http.get(
		        "./rest/almMetricsServices/reqTableDetails?&itemsPerPage="
		        + $scope.itemsPerPage + "&start_index=" + $scope.index
		        + "&dashboardName=" + dashboardName + "&domainName="
		        + domainName + "&projectName=" + projectName
		        + "&vardtfrom=" + vardtfrom + "&vardtto=" + vardtto
		        + "&timeperiod=" + $rootScope.timeperiodReq, config)
		        .success(function (response) {
		            $rootScope.reqTableDetails = response;
		        });

		};*/

		// Almsearch
		$scope.asearch = function(start_index, searchField, searchText) {

			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "reqID") {
				$rootScope.reqID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "reqName") {
				$rootScope.reqName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "description") {
				$rootScope.description = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "reqType") {
				$rootScope.reqType = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "status") {
				$rootScope.status = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "priority") {
				$rootScope.priority = searchText;
				$scope.key = true;
			}
			$scope.asearchable();
		}

		$scope.asearchable = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if ($rootScope.reqID == undefined) {
				$rootScope.reqID = 0;
			}

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}
			$http
					.get(
							"./rest/almMetricsServices/searchpagecount?reqID="
									+ $rootScope.reqID + "&reqName="
									+ $rootScope.reqName + "&description="
									+ $rootScope.description + "&reqType="
									+ $rootScope.reqType + "&status="
									+ $rootScope.status + "&priority="
									+ $rootScope.priority + "&dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});
			paginationService.setCurrentPage("reqpaginate", $scope.start_index);
			$scope.itemsPerPage = 5;
			$http
					.get(
							"./rest/almMetricsServices/searchRequirements?reqID="
									+ $rootScope.reqID + "&reqName="
									+ $rootScope.reqName + "&description="
									+ $rootScope.description + "&reqType="
									+ $rootScope.reqType + "&status="
									+ $rootScope.status + "&priority="
									+ $rootScope.priority + "&dashboardName="
									+ dashboardName + "&itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialReqcountpaginate();
									$scope.reqTableData(1);
								} else {
									paginationService.setCurrentPage(
											"reqpaginate", $scope.start_index);
									$rootScope.reqTableDetails = response;
								}
							});
		}

		// PopUp of Requirements details using D3 Cross Filter
		$scope.openpopup = function(size) {
			$rootScope.requirementsanalyse = $uibModal
					.open({
						animation : true,
						templateUrl : 'app/pages/charts/requirements/requirementsdata/reqAnalyze.html',
						scope : $scope,
						size : size,
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		/* Date Filter Code Starts Here */
		// CALENDER DEFAULT VALUE
		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$rootScope.dfromvalReq = dtfrom;
			localStorageService.set('dtfrom', dtfrom);
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.reqfilterfunction();
			$scope.downloadReqTableData(1);
		}
		// Get end date
		$scope.gettodate = function(dtto) {

			localStorageService.set('dtto', dtto);
			/*$scope.dttoplus = dateplus();
			$rootScope.dtovalReq = $scope.dttoplus;
			localStorageService.set('dttoplus', $scope.dttoplus);*/
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.reqfilterfunction();
			$scope.downloadReqTableData(1);
		}

		$scope.gettimeperiod = function() {

			$rootScope.timeperiodReqdrops = [ "Last 30 days", "Last 60 days",
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
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');
		}

		$scope.gettimeperiodselection = function(timeperiod) {

			localStorageService.set('timeperiod', timeperiod);
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');
			var index = $rootScope.timeperiodReqdrops.indexOf(timeperiod);
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

			$rootScope.reqfilterfunction(); // drop-down change
			$scope.downloadReqTableData(1);
		}

		$scope.convertDateToString = function(fromDate, toDate) {

			var dfrom = fromDate;
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

			var dto = toDate;
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

			//$scope.dttoplus = dateplus();

			localStorageService.set('dtfrom', $scope.dtfromfinal);
			localStorageService.set('dtto', $scope.dttofinal);
			//localStorageService.set('dttoplus', $scope.dttoplus);

			$rootScope.dfromvalReq = $scope.dtfromfinal; // storage date

			$rootScope.dtovalReq = $scope.dttoplus;
			

			//$rootScope.dtovalReq = $scope.dttofinal;
			// $rootScope.reqfilterfunction();

		}

		// Function call for each dropdown 'change'

		$rootScope.reqfilterfunction = function() {

			$rootScope.totalReqcountFilter();
			$rootScope.ReqvoltilityFilter();
			$scope.ReqleakageFilter();
			$scope.reqTrendChart();
			$scope.reqStatusChart();
			$scope.reqPriorityChart();
			$scope.reqTableData(1);
			$scope.initialReqcountpaginate();
		}

		// ALMTotal Req. Count - Date Filter
		$rootScope.totalReqcountFilter = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			$http
					.get(
							"rest/almMetricsServices/reqCountFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.totalreqcount = response;

					});
		}

		// Req volatility percentage - Date Filter
		$rootScope.ReqvoltilityFilter = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			$http
					.get(
							"./rest/almMetricsServices/reqvolatilityfilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								$scope.volatilityfilter = response;
								$scope.loadPieCharts('#reqvolafilter',
										$scope.volatilityfilter);
							});
		}

		// Requirement Leakage Count -Date Filter
		$scope.ReqleakageFilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}

			$http
					.get(
							"./rest/almMetricsServices/reqleakfilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.reqleakagefilter = response;
					});

		}

		/* Date Filter Code Ends Here */

		/* Date Filter Code Ends Here */

		/* Levis Code starts here */

		// PROJECT DROP DOWN LIST
		$scope.getprojectList = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/requirementServices/projectlevellist?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.projects = response;
						$scope.multiprojects = [];
						for (var i = 0; i < $scope.projects.length; i++) {
							$scope.multiprojects.push({
								"label" : $scope.projects[i]
							});
						}
						$scope.selectprojects = [];
						for ( var pk in $scope.multiprojects) {
							$scope.selectprojects
									.push($scope.multiprojects[pk]);
						}
						$scope.selproject = $scope.selectprojects;
						// $scope.selproject = [];
						onSelectionChangedproject();

					});
		}

		// GET SELECTED FROM PROJECT DROP DOWN LIST
		$scope.myEventListenersproject = {
			onSelectionChanged : onSelectionChangedproject,
		};

		function onSelectionChangedproject() {

			$rootScope.projsel = [];
			for (var i = 0; i < $scope.selproject.length; i++) {
				$rootScope.projsel.push($scope.selproject[i].label);
			}

			$scope.updateProjects();
		}

		/* Update Projects Starts Here */

		$scope.updateProjects = function() {

			var token = AES.getEncryptedValue();

			var varselectedproject = "";
			if ($rootScope.projsel == null || $rootScope.projsel == undefined
					|| $rootScope.projsel == "") {
				varselectedproject = "-";
			} else {
				varselectedproject = $rootScope.projsel;
			}

			var updateData = {
				dashboardName : dashboardName,
				owner : owner,
				projects : varselectedproject
			}

			$http({
				url : "./rest/levelItemServices/updateSelectedProjects",
				method : "POST",
				params : updateData,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 0) {
					// alert('Failure');
				} else {
					$scope.getsprintName();
				}
			});

		};

		// SPRINT DROP DOWN LIST

		$scope.getsprintName = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"./rest/requirementServices/sprintsList?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.sprints = response;
								$scope.multisprints = [];
								for (var i = 0; i < $scope.sprints.length; i++) {
									if (!($scope.sprints[i] == "")
											&& !($scope.sprints[i] == "Backlog")) {
										$scope.multisprints.push({
											"label" : $scope.sprints[i]
										});
									}

								}

								$scope.getRollingPeriod();
								var vardtfrom = "";
								var vardtto = "";

								if ($rootScope.dfromDash == null
										|| $rootScope.dfromDash == undefined
										|| $rootScope.dfromDash == "") {
									vardtfrom = "-";
								} else {
									vardtfrom = $rootScope.dfromDash;
								}

								if ($rootScope.dtoDash == null
										|| $rootScope.dtoDash == undefined
										|| $rootScope.dtoDash == "") {
									vardtto = "-";
								} else {
									vardtto = $rootScope.dtoDash;
								}
								$http
										.get(
												"./rest/requirementServices/sprintsListSel?dashboardName="
														+ dashboardName
														+ "&domainName="
														+ domainName
														+ "&projectName="
														+ projectName
														+ "&dfromval="
														+ vardtfrom
														+ "&dtoval=" + vardtto,
												config)
										.success(
												function(response) {
													$rootScope.userStorySprintSel = response;
													$scope.fnselectsprints = [];
													for ( var pk in $rootScope.userStorySprintSel) {
														$scope.fnselectsprints
																.push($rootScope.userStorySprintSel[pk]);
													}

													$scope.fnselsprint = $scope.fnselectsprints;
													$scope.selectsprints = [];
													for ( var pk in $scope.multisprints) {
														if ($scope.fnselsprint
																.includes($scope.multisprints[pk].label)) {
															$scope.selectsprints
																	.push($scope.multisprints[pk]);
														}
													}
													$scope.selsprint = $scope.selectsprints;
													onSelectionChangedsprint();

												});

							});
		};

		// GET SELECTED FROM SPRINT DROP DOWN LIST
		$scope.myEventListenerssprint = {
			onSelectionChanged : onSelectionChangedsprint,
		};

		function onSelectionChangedsprint() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$rootScope.sprintsel = [];
			if ($scope.selsprint.length > 0) {
				for (var i = 0; i < $scope.selsprint.length; i++) {
					$rootScope.sprintsel.push($scope.selsprint[i].label);
				}

				$scope.updateSprints();
			} else {
				$scope.updateSprints();
			}

		}

		$scope.updateSprints = function() {
			//alert("update sprints");

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var varselectedsprint = "";
			if ($rootScope.sprintsel == null
					|| $rootScope.sprintsel == undefined
					|| $rootScope.sprintsel == "") {
				varselectedsprint = "-";
			} else {
				varselectedsprint = $rootScope.sprintsel;
			}

			var updateData = {
				dashboardName : dashboardName,
				owner : owner,
				sprints : varselectedsprint
			}

			$http({
				url : "./rest/levelItemServices/updateSelectedSprints",
				method : "POST",
				params : updateData,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 0) {

				} else {
					//$rootScope.reqfilterfunctionjira();
					$scope.getdefaultdate();
				}
			});

		};

		// CALENDER DEFAULT VALUE
		$scope.getdefaultdate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/requirementServices/getdefaultdate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.defaultdate = response;

						var date = new Date($scope.defaultdate[1]);
						var date1 = new Date($scope.defaultdate[0]);
						$scope.dtto = date;
						// date1.setDate(date.getDate() - 30);
						$scope.dtfrom = date1;
						var dfromval = $scope.dtfrom;
						var month = dfromval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dfromval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dfromval.getFullYear();

						$scope.dfromval = "" + month + "/" + date + "/" + year;
						var dtoval = $scope.dtto;
						var month = dtoval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dtoval.getDate() + 1;
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/" + year;
						$rootScope.reqfilterfunctionjira();
					});
		}

		$scope.getOnLoaddate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/requirementServices/getOnLoaddate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.defaultdate = response;

						var date = new Date($scope.defaultdate[1]);
						var date1 = new Date($scope.defaultdate[0]);
						$scope.dtto = date;
						// date1.setDate(date.getDate() - 30);
						$scope.dtfrom = date1;
						var dfromval = $scope.dtfrom;
						var month = dfromval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dfromval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dfromval.getFullYear();

						$scope.dfromval = "" + month + "/" + date + "/" + year;
						var dtoval = $scope.dtto;
						var month = dtoval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dtoval.getDate() + 1;
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/" + year;
						$rootScope.reqfilterfunctionjira();
					});
		}

		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdatejira = function(dtfrom) {

			$scope.dfromval = dtfrom;
			$rootScope.reqfilterfunctionjira();
		}
		// Get end date
		$scope.gettodatejira = function(dtto) {
			$scope.dtoval = dtto;
			$rootScope.reqfilterfunctionjira();
		}

		$scope.scrollsettings = {
			scrollableHeight : '300px',
			scrollable : true,
		};
		// Function call for each dropdown change

		$rootScope.reqfilterfunctionjira = function() {

			$scope.totalstoriescount();
			$scope.totalstorypoints();
			$scope.jirareqTrendChart();
			$scope.newStatusChart();
			$scope.newPriorityChart();
		}

		/* Total Stories Starts Here */

		$scope.totalstoriescount = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http.get(
					"rest/requirementServices/reqTotalStoriesCount?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$rootScope.uitotalstoriescount = response;
			});

		};

		/* Total Stories count Ends Here */

		/* Total Story Rejected Starts Here */
		$scope.totalstoryrej = function() {
			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			var varselectedproject = "";
			var varselectedsprint = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			/*$http.get(
					"rest/requirementServices/reqTotalStoryRej?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.totalstoryrej = response;
			});
			 */$scope.totalstoryrej = 100;
		}
		/* Total Story Points Starts Here */
		$scope.totalstorypoints = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			var varselectedproject = "";
			var varselectedsprint = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http.get(
					"rest/requirementServices/reqTotalStoryPoints?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$rootScope.uitotalstorypoints = response;
			});

		};

		/* Total Stories count Ends Here */

		/* Requirement Trend Chart */

		/* Jira Requirement Trend Chart */

		$scope.jirareqTrendChart = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http
					.get(
							"rest/requirementServices/jirareqStatusTrend?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.jiralinechart($scope.data);
								} else {
									$('#line').remove(); // this is my
									// <canvas> element
									$('#linediv')
											.append(
													'<canvas id="line" height="100%"> </canvas>');
								}
							});

			$scope.jiralinechart = function(lineresult) {

				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.done = [];
				$scope.todo = [];
				$scope.inprogress = [];
				$scope.intesting = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].mydate);

					$scope.done.push($scope.lineresult[i].done);
					$scope.todo.push($scope.lineresult[i].toDo);
					$scope.inprogress.push($scope.lineresult[i].inProgress);
					$scope.intesting.push($scope.lineresult[i].inTesting);

				}
				$scope.data = [ $scope.done, $scope.todo, $scope.inprogress,
						$scope.intesting, ];

				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						pointStyle : "line",
						datasets : [ {
							data : $scope.done,
							label : "Closed",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.7)",
							pointBackgroundColor : "#4c4c4c",
							fill : false
						}, {
							data : $scope.todo,
							label : "Open",
							pointStyle : "line",
							borderColor : "rgba(255, 113, 189, 1)",
							pointBackgroundColor : "rgba(255, 113, 189, 1)",
							fill : false
						}, {
							data : $scope.inprogress,
							label : "In-Development",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 1)",
							pointBackgroundColor : "rgba(236, 255, 0, 1)",
							fill : false
						}, {
							data : $scope.intesting,
							label : "In-QA",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)",
							fill : false
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						tooltips : {
							enabled : true
						},
						scales : {
							xAxes : [ {

								ticks : {
									fontColor : '#4c4c4c'
								},
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : '#4c4c4c'

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
									unit : "month"
								},
								gridLines : {
									color : "#d8d3d3",
								}
							} ],
							yAxes : [ {

								ticks : {
									fontColor : '#4c4c4c'
								},
								scaleLabel : {
									display : true,
									labelString : 'Status Count',
									fontColor : '#4c4c4c'

								},
								gridLines : {
									color : "#d8d3d3",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'right',
							labels : {
								fontColor : '#4c4c4cf',
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
				$('#line').remove(); // this is my <canvas> element
				$('#linediv').append(
						'<canvas id="line" height="100%"> </canvas>');
				var ctx = document.getElementById("line");
				window.line = new Chart(ctx, config);

			}

		}

		// Requirements by Status Chart
		$scope.newStatusChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http.get(
					"rest/requirementServices/reqStoriesByStatus?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				if ($scope.data.length != 0) {
					$scope.jirastatuschartnew($scope.data);
				} else {
					$('#barchart').remove(); // this is my
					// <canvas>
					// element
					$('#bardiv').append(' <canvas id="barchart"> </canvas>');
				}
			});
			$scope.jirastatuschartnew = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						if ($scope.result[i].status == "") {
							$scope.result[i].status = "No Status";
						}
						$scope.labels1.push($scope.result[i].value);

						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labels = $scope.labels1;
				$scope.data = $scope.data1;

				var layoutColors = baConfig.colors;

				$('#barchart').remove(); // this is my <canvas> element
				$('#bardiv').append(' <canvas id="barchart"> </canvas>');

				var ctx = document.getElementById("barchart");
				var myChart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels1,
								datasets : [ {
									data : $scope.data1,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B" ],
									borderColor : [ "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B" ],
									borderWidth : 1
								} ]
							},
							options : {
								responsive : true,
								maintainAspectRatio : false,
								tooltips : {
									enabled : true
								},
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
																				centerPoint.y + 10);
															});
												});
									}
								},

								scales : {
									yAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Stories Count',
											fontColor : "#4c4c4c"
										},
										ticks : {
											beginAtZero : true,
											fontColor : "#4c4c4c"
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],

									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Status',
											fontColor : "#4c4c4c"
										},
										ticks : {
											beginAtZero : true,
											fontColor : "#4c4c4c"
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ]
								}
							}
						});

			};
		}

		$scope.newOwnerChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http.get(
					"rest/requirementServices/reqStoriesByOwner?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				if ($scope.data.length != 0) {
					$scope.jiraownerchartnew($scope.data);
				} else {
					$('#barowner').remove(); // this is my
					// <canvas>
					// element
					$('#barown').append(' <canvas id="barowner"> </canvas>');
				}
			});
			$scope.jiraownerchartnew = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						if ($scope.result[i].status == "") {
							$scope.result[i].status = "No Owner";
						}
						$scope.labels1.push($scope.result[i].value);

						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labels = $scope.labels1;
				$scope.data = $scope.data1;

				var layoutColors = baConfig.colors;

				$('#barowner').remove(); // this is my <canvas> element
				$('#barown').append(' <canvas id="barowner"> </canvas>');

				var ctx = document.getElementById("barowner");
				var myChart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labels1,
								datasets : [ {
									data : $scope.data1,
									backgroundColor : [
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B" ],
									borderColor : [ "rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(255, 159, 64, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)",
											"rgba(255, 206, 86, 1)", "#835C3B" ],
									borderWidth : 1
								} ]
							},
							options : {
								responsive : true,
								maintainAspectRatio : false,
								tooltips : {
									enabled : true
								},
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
																				centerPoint.y + 10);
															});
												});
									}
								},

								scales : {
									yAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Stories Count',
											fontColor : "#4c4c4c"
										},
										ticks : {
											beginAtZero : true,
											fontColor : "#4c4c4c"
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],

									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Owner',
											fontColor : "#4c4c4c"
										},
										ticks : {
											beginAtZero : true,
											fontColor : "#4c4c4c"
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ]
								}
							}
						});

			};
		}
		// Requirements by Priority Chart
		$scope.newPriorityChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($scope.dfromval == null || $scope.dfromval == undefined
					|| $scope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $scope.dfromval;
			}

			if ($scope.dtoval == null || $scope.dtoval == undefined
					|| $scope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $scope.dtoval;
			}

			$http.get(
					"rest/requirementServices/reqStoriesByPriority?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				if ($scope.data.length != 0) {
					$scope.jiraprioritychartnew($scope.data);
				} else {
					$('#doughnut').remove(); // this is my
					// <canvas>
					// element
					$('#doughnutdiv').append('<canvas id="doughnut">');
				}
			});
			$scope.jiraprioritychartnew = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.backgroundColor = [];
				$scope.borderColor = [];
				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						if ($scope.result[i].issuePriority == "") {
							$scope.result[i].issuePriority = "No Priority";
						}

						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#doughnut').remove(); // this is my <canvas> element
				$('#doughnutdiv').append('<canvas id="doughnut">');
				var ctx = document.getElementById("doughnut");
				var doughnut = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)",
									"rgba(255, 206, 86, 0.8)", "#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)",
									"rgba(255, 206, 86, 1)", "#835C3B" ],
							borderWidth : 1
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						pieceLabel : {
							render : 'value',
							fontColor : 'white'
						},

						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#4c4c4c',
								boxWidth : 15,
							}
						}
					}

				});
			};
		}

		// Jira Table on-load

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
		/** *Requirement details download** */
		$scope.downloadReqTableData = function(start_index) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			var itemsPerPage = 0;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalReq == null
					|| $rootScope.dfromvalReq == undefined
					|| $rootScope.dfromvalReq == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalReq;
			}

			if ($rootScope.dtovalReq == null
					|| $rootScope.dtovalReq == undefined
					|| $rootScope.dtovalReq == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalReq;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');
			
			/*$http.get(
					"./rest/requirementServices/reqTableDetails?&itemsPerPage="
							+ itemsPerPage + "&start_index=" + $scope.index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$scope.reqTableDetailsDownload = response;
					});*/
			
			$http.get(
					"./rest/almMetricsServices/reqTableDetails?&itemsPerPage="
							+ itemsPerPage + "&start_index=" + $scope.index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$scope.reqTableDetailsDownload = response;
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
		
		// Total Requirement Count
		$rootScope.dashboardReqCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalDash == null
					|| $rootScope.dfromvalDash == undefined
					|| $rootScope.dfromvalDash == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalDash;
			}

			if ($rootScope.dtovalDash == null
					|| $rootScope.dtovalDash == undefined
					|| $rootScope.dtovalDash == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDash;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/operationalDashboardALMServices/totalReqCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.totalreqdata = response;
				// alert("Req Count : " + $rootScope.totalreqdata);

			});
		}
		/* Export graphs and tables */

		// ****************************************************************
		//  Data Table View Jira
		//****************************************************************
		/* $scope.initialReqjirapaginate = function () {
		     var token = AES.getEncryptedValue();
		     var config = {
		         headers: {
		             'Authorization': token
		         }
		     };
		     var vardtfrom = "";
		     var vardtto = "";

		     if ($rootScope.dfromvalReq == null
		         || $rootScope.dfromvalReq == undefined
		         || $rootScope.dfromvalReq == "") {
		         vardtfrom = "-";
		     } else {
		         vardtfrom = $rootScope.dfromvalReq;
		     }

		     if ($rootScope.dtovalReq == null || $rootScope.dtovalReq == undefined
		         || $rootScope.dtovalReq == "") {
		         vardtto = "-";
		     } else {
		         vardtto = $rootScope.dtovalReq;
		     }
		     $http.get(
		         "rest/requirementServices/jirareqtable?dashboardName="
		         + dashboardName + "&domainName=" + domainName
		         + "&projectName=" + projectName + "&vardtfrom="
		         + vardtfrom + "&vardtto=" + vardtto + "&timeperiod="
		         + $rootScope.timeperiodReq, config).success(
		             function (response) {
		                 $rootScope.jirareqdatapaginate = response;
		                 $scope.search(1, "", "");
		             });
		 }

		 //Get Value for Tables
		 $scope.reqTableDataJira = function (start_index) {


		     var token = AES.getEncryptedValue();
		     var config = {
		         headers: {
		             'Authorization': token
		         }
		     };
		     $scope.index = start_index;
		     $scope.itemsPerPage = 5;
		     var vardtfrom = "";
		     var vardtto = "";

		     if ($rootScope.dfromvalReq == null
		         || $rootScope.dfromvalReq == undefined
		         || $rootScope.dfromvalReq == "") {
		         vardtfrom = "-";
		     } else {
		         vardtfrom = $rootScope.dfromvalReq;
		     }

		     if ($rootScope.dtovalReq == null || $rootScope.dtovalReq == undefined
		         || $rootScope.dtovalReq == "") {
		         vardtto = "-";
		     } else {
		         vardtto = $rootScope.dtovalReq;
		     }



		     $http.get(
		         "./rest/requirementServices/jirareqtable?&itemsPerPage="
		         + $scope.itemsPerPage + "&start_index=" + $scope.index
		         + "&dashboardName=" + dashboardName + "&domainName="
		         + domainName + "&projectName=" + projectName
		         + "&vardtfrom=" + vardtfrom + "&vardtto=" + vardtto
		         + "&timeperiod=" + $rootScope.timeperiodReq, config)
		         .success(function (response) {
		             $rootScope.reqJiraTableDetails = response;
		         });
		 };

		 // For Jira
		 $scope.jirareqpageChangedLevel = function (pageno) {
		     $scope.pageno = pageno;
		     if ($scope.sortBy == undefined && $rootScope.sortkey == false
		         && $rootScope.searchkey == false) {
		         $scope.reqTableDataJira($scope.pageno);
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
		 $scope.sort = function (keyname, start_index) {
		     $rootScope.sortkey = true;
		     $rootScope.searchkey = false;
		     $scope.sortBy = keyname;
		     $scope.index = start_index;
		     $scope.reverse = !$scope.reverse;
		     $scope.sortedtable($scope.sortBy, $scope.index, $scope.reverse);
		 };

		 // Table on-load with sort implementation
		 $scope.sortedtable = function (sortvalue, start_index, reverse) {
		     var token = AES.getEncryptedValue();
		     var config = {
		         headers: {
		             'Authorization': token
		         }
		     };
		     $scope.column = sortvalue;
		     $scope.index = start_index;
		     $scope.order = reverse;
		     var vardtfrom = "";
		     var vardtto = "";

		     if ($rootScope.dfromvalReq == null
		         || $rootScope.dfromvalReq == undefined
		         || $rootScope.dfromvalReq == "") {
		         vardtfrom = "-";
		     } else {
		         vardtfrom = $rootScope.dfromvalReq;
		     }

		     if ($rootScope.dtovalReq == null
		         || $rootScope.dtovalReq == undefined
		         || $rootScope.dtovalReq == "") {
		         vardtto = "-";
		     } else {
		         vardtto = $rootScope.dtovalReq;
		     }


		     $http.get(
		         "./rest/requirementServices/jirareqtable?&itemsPerPage="
		         + $scope.itemsPerPage + "&start_index=" + $scope.index
		         + "&dashboardName=" + dashboardName + "&domainName="
		         + domainName + "&projectName=" + projectName
		         + "&vardtfrom=" + vardtfrom + "&vardtto=" + vardtto
		         + "&timeperiod=" + $rootScope.timeperiodReq, config)
		         .success(function (response) {
		             $rootScope.reqJiraTableDetails = response;
		         });



		 };


		 //Search Code

		 // search

		 $scope.search = function (start_index, searchField, searchText) {

		     $scope.start_index = start_index;
		     $scope.searchField = searchField;
		     $scope.searchText = searchText;
		     $rootScope.sortkey = false;
		     $rootScope.searchkey = true;
		     $scope.key = false;

		     if ($scope.searchField == "issueID") {
		         $rootScope.issueID = searchText;
		         $scope.key = true;
		     } else if ($scope.searchField == "summary") {
		         $rootScope.summarysearch = searchText;
		         $scope.key = true;
		     } else if ($scope.searchField == "issueType") {
		         $rootScope.issueTypeesearch = searchText;
		         $scope.key = true;
		     } else if ($scope.searchField == "issueStatus") {
		         $rootScope.issueStatussearch = searchText;
		         $scope.key = true;
		     } else if ($scope.searchField == "issuePriority") {
		         $rootScope.issuePrioritysearch = searchText;
		         $scope.key = true;
		     }
		     $scope.searchable();
		 }

		 $scope.searchable = function () {


		     var token = AES.getEncryptedValue();
		     var config = {
		         headers: {
		             'Authorization': token
		         }
		     };

		     if ($rootScope.issueID == undefined) {
		         $rootScope.issueID = 0;
		     }

		     var vardtfrom = "";
		     var vardtto = "";

		     if ($rootScope.dfromvalReq == null
		         || $rootScope.dfromvalReq == undefined
		         || $rootScope.dfromvalReq == "") {
		         vardtfrom = "-";
		     } else {
		         vardtfrom = $rootScope.dfromvalReq;
		     }

		     if ($rootScope.dtovalReq == null
		         || $rootScope.dtovalReq == undefined
		         || $rootScope.dtovalReq == "") {
		         vardtto = "-";
		     } else {
		         vardtto = $rootScope.dtovalReq;
		     }
		     $http
		         .get(
		             "./rest/requirementServices/searchpagecount?issueID="
		             + $rootScope.issueID + "&summary="
		             + $rootScope.summarysearch + "&issueType="
		             + $rootScope.issueTypeesearch + "&issueStatus="
		             + $rootScope.issueStatussearch + "&issuePriority="
		             + $rootScope.issuePrioritysearch + "&dashboardName="
		             + dashboardName + "&domainName="
		             + domainName + "&projectName="
		             + projectName + "&vardtfrom=" + vardtfrom
		             + "&vardtto=" + vardtto + "&timeperiod="
		             + $rootScope.timeperiodReq, config)
		         .success(function (response) {
		             $rootScope.jirareqdatapaginate = response;
		         });
		     paginationService.setCurrentPage("reqpaginate", $scope.start_index);
		     $scope.itemsPerPage = 5;
		     $http
		         .get(
		             "./rest/requirementServices/searchJiraRequirements?reqName="
		             + $rootScope.issueID + "&summary="
		             + $rootScope.summarysearch + "&issueType="
		             + $rootScope.issueTypeesearch + "&issueStatus="
		             + $rootScope.issueStatussearch + "&issuePriority="
		             + $rootScope.priority + "&dashboardName="
		             + dashboardName + "&itemsPerPage="
		             + $scope.itemsPerPage + "&start_index="
		             + $scope.start_index + "&domainName="
		             + domainName + "&projectName="
		             + projectName + "&vardtfrom=" + vardtfrom
		             + "&vardtto=" + vardtto + "&timeperiod="
		             + $rootScope.timeperiodReq, config)
		         .success(
		             function (response) {
		                 if (response == "" && $scope.key == false) {
		                     $rootScope.searchkey = false;
		                     $scope.initialReqjirapaginate();
		                     $scope.reqTableDataJira(1);
		                 } else {
		                     paginationService.setCurrentPage(
		                         "reqpaginate", $scope.start_index);
		                     $rootScope.reqJiraTableDetails = response;
		                 }
		             });
		 }*/

		// End of Search Code
		// End of Data Table View
	} //end of ctrl

})();
