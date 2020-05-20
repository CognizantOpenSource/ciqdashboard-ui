
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
	function RequirementsCtrl($sessionStorage, paginationService, UserService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths, $filter) {

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
		$rootScope.MetricsName = "Test Requirments";
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		/* $rootScope.menubar = true; */
		$rootScope.timeperiodReq = localStorageService.get('timeperiod');
		
		
		$scope.dtfrom = localStorageService.get('dtfrom');
		$scope.dtto = localStorageService.get('dtto');
				
		
		if ($scope.dtto != null) {
			
			var dtToDate = new Date($scope.dtto);			
			dtToDate.setDate(dtToDate.getDate() + 1);			
			
			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');			
			
			localStorageService.set('dttoPlus', dtToDateStr);			
		}
		
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');

		$scope.init = function() {
			$rootScope.dataloader = true;
		}

		

		

		$scope.getRollingPeriod = function() {

			var token = getEncryptedValue();

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
			var token = getEncryptedValue();
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

			var token = getEncryptedValue();
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
				$scope.obsolete = [];

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
					$scope.obsolete.push($scope.lineresult[i].obsolete);

				}
				$scope.data = [ $scope.nostatus, $scope.notapplicable,
						$scope.notcompleted, $scope.blocked, $scope.failed,
						$scope.norun, $scope.notcovered, $scope.passed,
						$scope.obsolete ];

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
							data : $scope.obsolete,
							label : "Obsolete",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)",

						}, {
							data : $scope.passed,
							label : "Passed",
							pointStyle : "line",
							borderColor : "rgba(180, 195, 22, 1)",
							pointBackgroundColor : "rgba(180, 195, 22, 1)",

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
								ticks : {

									fontColor : '#4c4c4c'
								},
								gridLines : {
									color : "#d8d3d3",
								},
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
									fontColor : '#4c4c4c',
									beginAtZero : true
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
							},
							ticks : {

								fontColor : '#4c4c4c'
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
				$rootScope.dataloader = false;

			}
		}

		// ALM Requirements by Status Chart
		$scope.reqStatusChart = function() {

			var token = getEncryptedValue();
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
											"rgba(255, 206, 86, 0.8)" ],
									borderColor : [ "rgba(199, 99, 5, 1)",
											"rgba(255, 31, 0, 1)",
											"rgba(6, 239, 212, 1)",
											"rgba(189, 5, 171, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(67, 154, 213, 1)",
											"rgba(255, 113, 189, 1)",
											"rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)" ],
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
																// This below
																// lines are
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
											fontColor : '#4c4c4c'
										},
										scaleLabel : {
											display : true,
											labelString : 'Requirement Count',
											fontColor : '#4c4c4c'
										},
										gridLines : {
											color : "#d8d3d3"
										}
									} ],

									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Status',
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

		// ALM Requirements Priority Chart

		$scope.reqPriorityChart = function() {
			var token = getEncryptedValue();
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
						$scope.backgroundColor.push("rgba(9, 191, 22, 0.9)");
						$scope.borderColor.push("rgba(9, 191, 22, 1)");
					}
					if ($scope.result[i].priority == "3-High") {
						$scope.backgroundColor.push("rgba(236, 255, 0, 0.9)");
						$scope.borderColor.push("rgba(236, 255, 0, 0.8)");
					}
					if ($scope.result[i].priority == "4-Very High") {
						$scope.backgroundColor.push("rgba(255, 159, 64, 0.9)");
						$scope.borderColor.push("rgba(255, 159, 64, 1)");
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
			var token = getEncryptedValue();
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

		// Count for pagination
		$scope.initialReqcountpaginate = function() {
			var token = getEncryptedValue();
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

		// search
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
			}else if ($scope.searchField == "description") {
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
			var token = getEncryptedValue();
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
			$scope.index=$scope.start_index; // Fix
			
			$http
					.get(
							"./rest/almMetricsServices/searchRequirements?reqName="
									+ $rootScope.reqName + "&reqID="
									+ $rootScope.reqID + "&releaseName="
									+ $rootScope.releaseName+ "&description="
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
								}else if(response == null){
									$rootScope.searchkey = false;
									$scope.initialReqcountpaginate();
									$scope.reqTableData(1);
								}
										else {
									
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

		// Req Lazy Load Table with sorting Code Starts Here

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

		// Sort function starts here
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

		/* Date Filter Code Starts Here */
		// CALENDER DEFAULT VALUE
		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {

			$rootScope.dataloader = true;
			$rootScope.dfromvalReq = dtfrom;
			localStorageService.set('dtfrom', dtfrom);
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');
			
			if ($scope.dtto != null) {
				
				var dtToDate = new Date($scope.dtto);			
				dtToDate.setDate(dtToDate.getDate() + 1);			
				
				var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');			
				
				localStorageService.set('dttoPlus', dtToDateStr);			
			}

			$rootScope.reqfilterfunction();
			$scope.downloadReqTableData(1);
		}
		// Get end date
		$scope.gettodate = function(dtto) {

			$rootScope.dataloader = true;
			// $rootScope.dtovalReq = dtto;

			var dtToDate = new Date(dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');
			$rootScope.dtovalReq = dtToDateStr;

			localStorageService.set('dtto', dtto);
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodReq = localStorageService.get('timeperiod');
			
			if ($scope.dtto != null) {
				
				var dtToDate = new Date($scope.dtto);			
				dtToDate.setDate(dtToDate.getDate() + 1);			
				
				var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');			
				
				localStorageService.set('dttoPlus', dtToDateStr);			
			}
			
			$rootScope.reqfilterfunction();
			$scope.downloadReqTableData(1);
		}

		$scope.gettimeperiod = function() {

			$rootScope.timeperiodReqdrops = [ "Last 7 days", "Last 15 days",
					"Last 30 days", "Last 60 days", "Last 90 days",
					"Last 180 days", "Last 365 days" ];
			$rootScope.noofdays = [ "7", "15", "30", "60", "90", "180", "365" ];

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
			// $rootScope.reqfilterfunction(); //drop-down change
		}

		$scope.gettimeperiodselection = function(timeperiod) {

			$rootScope.dataloader = true;

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
				
				var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');			
				
				localStorageService.set('dttoPlus', dtToDateStr);			
			}

			$rootScope.reqfilterfunction(); // drop-down change
			$scope.downloadReqTableData();
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

			localStorageService.set('dtfrom', $scope.dtfromfinal);
			localStorageService.set('dtto', $scope.dttofinal);

			$rootScope.dfromvalReq = $scope.dtfromfinal; // storage date
			// reset
			$rootScope.dtovalReq = $scope.dttofinal; // storage date reset
			// $rootScope.reqfilterfunction();

		}

		// Function call for each dropdown 'change'

		$rootScope.reqfilterfunction = function() {
			
			
			$rootScope.totalReqcountFilter();
			/*$rootScope.ReqvoltilityFilter();
			$scope.ReqleakageFilter();*/
			$scope.reqTrendChart();
			$scope.reqStatusChart();
			$scope.reqPriorityChart();
			$scope.reqTableData(1);
			$scope.initialReqcountpaginate();

		}

		// ALMTotal Req. Count - Date Filter
		$rootScope.totalReqcountFilter = function() {

			var token = getEncryptedValue();
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

			var token = getEncryptedValue();
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
			var token = getEncryptedValue();
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
		$scope.getprojectName = function() {
			var token = getEncryptedValue();
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
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$rootScope.projsel = [];
			for (var i = 0; i < $scope.selproject.length; i++) {
				$rootScope.projsel.push($scope.selproject[i].label);
			}

			$scope.updateProjects();
		}

		/* Update Projects Starts Here */

		$scope.updateProjects = function() {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

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

			$http(
					{
						url : "./rest/levelItemServices/updateSelectedProjects",
						method : "POST",
						params : updateData,
						headers : {
							'Authorization' : 'Basic '
									+ btoa(localStorageService.get('userIdA')
											+ ":"
											+ localStorageService
													.get('passwordA'))
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
			var token = getEncryptedValue();
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

								/*
								 * $scope.selectsprints = []; for ( var pk in
								 * $scope.multisprints) {
								 * $scope.selectsprints.push($scope.multisprints[pk]); }
								 * 
								 * $scope.selsprint = $scope.selectsprints;
								 * onSelectionChangedsprint();
								 */
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

		/*
		 * $scope.getsprintNameSel = function() { var token =
		 * getEncryptedValue(); var config = { headers : { 'Authorization' :
		 * token } };
		 * 
		 * var vardtfrom = ""; var vardtto = "";
		 * 
		 * if ($rootScope.dfromDash == null || $rootScope.dfromDash == undefined ||
		 * $rootScope.dfromDash == "") { vardtfrom = "-"; } else { vardtfrom =
		 * $rootScope.dfromDash; }
		 * 
		 * if ($rootScope.dtoDash == null || $rootScope.dtoDash == undefined ||
		 * $rootScope.dtoDash == "") { vardtto = "-"; } else { vardtto =
		 * $rootScope.dtoDash; }
		 * 
		 * $http.get( "./rest/requirementServices/sprintsListSel?dashboardName=" +
		 * dashboardName + "&domainName=" + domainName + "&projectName=" +
		 * projectName + "&dfromval=" + vardtfrom + "&dtoval=" + vardtto,
		 * config).success( function(response) { $rootScope.userStorySprintSel =
		 * response;
		 * console.log("$rootScope.userStorySprintSel:::::"+$rootScope.userStorySprintSel);
		 * $scope.selectsprints = []; for ( var pk in
		 * $rootScope.userStorySprintSel) {
		 * $scope.selectsprints.push($rootScope.userStorySprintSel[pk]); }
		 * 
		 * $scope.selsprint = $scope.selectsprints;
		 * console.log("$scope.selsprint:::::"+$scope.selsprint);
		 * onSelectionChangedsprintSel(); }); };
		 */

		// GET SELECTED FROM SPRINT DROP DOWN LIST
		$scope.myEventListenerssprint = {
			onSelectionChanged : onSelectionChangedsprint,
		};

		function onSelectionChangedsprint() {
			var token = getEncryptedValue();
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

			var token = getEncryptedValue();

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

			$http(
					{
						url : "./rest/levelItemServices/updateSelectedSprints",
						method : "POST",
						params : updateData,
						headers : {
							'Authorization' : 'Basic '
									+ btoa(localStorageService.get('userIdA')
											+ ":"
											+ localStorageService
													.get('passwordA'))
						}
					}).success(function(response) {
				if (response == 0) {
					// alert('Failure');
				} else {
					/* $scope.getdefaultdate(); */
					// $rootScope.reqfilterfunctionjira();
					$scope.getdefaultdate();
				}
			});

		};

		// EPIC DROP DOWN LIST

		/*
		 * $scope.getepicName = function() {
		 * 
		 * var token = getEncryptedValue(); var config = { headers : {
		 * 'Authorization' : token } };
		 * 
		 * $http.get( "./rest/requirementServices/epicsList?dashboardName=" +
		 * dashboardName, config) .success(function(response) { $scope.epics =
		 * response; $scope.multiepics = []; for (var i = 0; i <
		 * $scope.epics.length; i++) { $scope.multiepics.push({ "label" :
		 * $scope.epics[i] }); } $scope.selectepics = []; for ( var pk in
		 * $scope.multiepics) { $scope.selectepics.push($scope.multiepics[pk]); }
		 * $scope.selepic = $scope.selectepics; onSelectionChangedepic(); }); }
		 */

		// GET SELECTED FROM EPICS DROP DOWN LIST
		/*
		 * $scope.myEventListenersepic = { onSelectionChanged :
		 * onSelectionChangedepic, };
		 * 
		 * function onSelectionChangedepic() { var token = getEncryptedValue();
		 * var config = { headers : { 'Authorization' : token } };
		 * $rootScope.epicsel = []; for (var i = 0; i < $scope.selepic.length;
		 * i++) { $rootScope.epicsel.push($scope.selepic[i].label); }
		 * $scope.updateEpics(); }
		 * 
		 * $scope.updateEpics = function() {
		 * 
		 * var token = getEncryptedValue();
		 * 
		 * var config = { headers : { 'Authorization' : token } };
		 * 
		 * var varselectedepic = ""; if ($rootScope.epicsel == null ||
		 * $rootScope.epicsel == undefined || $rootScope.epicsel == "") {
		 * varselectedepic = "-"; } else { varselectedepic = $rootScope.epicsel; }
		 * 
		 * var updateData = { dashboardName : dashboardName, owner : owner,
		 * epics : varselectedepic }
		 * 
		 * $http({ url : "./rest/levelItemServices/updateSelectedEpics", method :
		 * "POST", params : updateData, headers:{ 'Authorization': 'Basic ' +
		 * btoa(localStorageService.get('userIdA')+ ":" +
		 * localStorageService.get('passwordA'))} }).success(function(response) {
		 * if (response == 0) { //alert('Failure'); } else {
		 * $rootScope.reqfilterfunctionjira();
		 * $rootScope.designfilterfunction(); $rootScope.defectfilterfunction();
		 * $rootScope.exefilterfunction();
		 * 
		 * window.setInterval(function(){
		 * 
		 * $rootScope.reqfilterfunctionjira();
		 * $rootScope.designfilterfunction(); $rootScope.defectfilterfunction();
		 * $rootScope.exefilterfunction(); }, 900000); } }); }
		 */

		// CALENDER DEFAULT VALUE
		$scope.getdefaultdate = function() {

			var token = getEncryptedValue();
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

			var token = getEncryptedValue();
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

			var token = getEncryptedValue();

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

		/* Total Story Points Starts Here */

		$scope.totalstorypoints = function() {

			var token = getEncryptedValue();

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

		/*
		 * $scope.jirareqTrendChart = function() { var token =
		 * getEncryptedValue();
		 * 
		 * var config = { headers : { 'Authorization' : token } };
		 * 
		 * var vardtfrom = ""; var vardtto = "";
		 * 
		 * if ($rootScope.dfromval == null || $rootScope.dfromval == undefined ||
		 * $rootScope.dfromval == "") { vardtfrom = "-"; } else { vardtfrom =
		 * $rootScope.dfromval; }
		 * 
		 * if ($rootScope.dtoval == null || $rootScope.dtoval == undefined ||
		 * $rootScope.dtoval == "") { vardtto = "-"; } else { vardtto =
		 * $rootScope.dtoval; }
		 * 
		 * $http .get(
		 * "rest/requirementServices/jirareqStatusTrend?dashboardName=" +
		 * dashboardName + "&vardtfrom=" + vardtfrom + "&vardtto=" +
		 * vardtto+"&domainName="+domainName+"&projectName="+projectName,
		 * config) .success( function(response) { $scope.data = response; if
		 * ($scope.data.length != 0) { $scope.jiralinechart($scope.data); } else {
		 * $('#line').remove(); // this is my // <canvas> element $('#linediv')
		 * .append( '<canvas id="line" height="100%"> </canvas>'); } });
		 * 
		 * $scope.jiralinechart = function(lineresult) { $scope.lineresult =
		 * lineresult; $scope.labels = []; $scope.data = []; $scope.series = [];
		 * 
		 * $scope.readyForAnalysis = []; $scope.closed = [];
		 * $scope.prioritization = []; $scope.dltReview = [];
		 * $scope.crNeedsFunding = []; $scope.notStarted = [];
		 * $scope.analysisOnHold= []; $scope.internalReviewInQa = [];
		 * $scope.readyForWork = []; $scope.wishlist = [];
		 * $scope.pendingExecReview = []; $scope.infoNeeded = [];
		 * $scope.assessmentRequested = []; $scope.inAnalysis = [];
		 * 
		 * $scope.partnerReview = []; $scope.implementation = [];
		 * $scope.internalReviewInProd = []; $scope.workOnHold = [];
		 * $scope.awaitingCrEvaluation = [];
		 * $scope.pendingExecApprovalForCrFunding = [];
		 * $scope.pendingUberReview= []; $scope.awaitingAssessment = [];
		 * $scope.assessmentRequiresFunding = [];
		 * 
		 * $scope.pendingExecApprovalForAssessmentFunding = [];
		 * $scope.requiresUberApproval = []; $scope.rejected = [];
		 * $scope.readyForDev = []; $scope.readyForCreative = [];
		 * $scope.devInProgress = []; $scope.readyForTest= [];
		 * $scope.readyForBuild = []; $scope.blocked = [];
		 * $scope.analysisInProgress = [];
		 * 
		 * var text; for (var i = 0; i < $scope.lineresult.length; i++) {
		 * 
		 * $scope.labels.push($scope.lineresult[i].mydate);
		 * 
		 * $scope.closed.push($scope.lineresult[i].closed);
		 * $scope.readyForAnalysis.push($scope.lineresult[i].readyForAnalysis);
		 * $scope.prioritization.push($scope.lineresult[i].prioritization);
		 * $scope.dltReview.push($scope.lineresult[i].dltReview);
		 * $scope.crNeedsFunding.push($scope.lineresult[i].crNeedsFunding);
		 * $scope.notStarted.push($scope.lineresult[i].notStarted);
		 * $scope.analysisOnHold.push($scope.lineresult[i].analysisOnHold);
		 * $scope.internalReviewInQa.push($scope.lineresult[i].internalReviewInQa);
		 * $scope.readyForWork.push($scope.lineresult[i].readyForWork);
		 * $scope.wishlist.push($scope.lineresult[i].wishlist);
		 * $scope.pendingExecReview.push($scope.lineresult[i].pendingExecReview);
		 * $scope.infoNeeded.push($scope.lineresult[i].infoNeeded);
		 * $scope.assessmentRequested.push($scope.lineresult[i].assessmentRequested);
		 * $scope.inAnalysis.push($scope.lineresult[i].inAnalysis);
		 * 
		 * $scope.partnerReview.push($scope.lineresult[i].partnerReview);
		 * $scope.implementation.push($scope.lineresult[i].implementation);
		 * $scope.internalReviewInProd.push($scope.lineresult[i].internalReviewInProd);
		 * $scope.workOnHold.push($scope.lineresult[i].workOnHold);
		 * $scope.awaitingCrEvaluation.push($scope.lineresult[i].awaitingCrEvaluation);
		 * $scope.pendingExecApprovalForCrFunding.push($scope.lineresult[i].pendingExecApprovalForCrFunding);
		 * $scope.pendingUberReview.push($scope.lineresult[i].pendingUberReview);
		 * $scope.awaitingAssessment.push($scope.lineresult[i].awaitingAssessment);
		 * $scope.assessmentRequiresFunding.push($scope.lineresult[i].assessmentRequiresFunding);
		 * 
		 * $scope.pendingExecApprovalForAssessmentFunding.push($scope.lineresult[i].pendingExecApprovalForAssessmentFunding);
		 * $scope.requiresUberApproval.push($scope.lineresult[i].requiresUberApproval);
		 * $scope.rejected.push($scope.lineresult[i].rejected);
		 * $scope.readyForDev.push($scope.lineresult[i].readyForDev);
		 * $scope.readyForCreative.push($scope.lineresult[i].readyForCreative);
		 * $scope.devInProgress.push($scope.lineresult[i].devInProgress);
		 * $scope.readyForTest.push($scope.lineresult[i].readyForTest);
		 * $scope.readyForBuild.push($scope.lineresult[i].readyForBuild);
		 * $scope.blocked.push($scope.lineresult[i].blocked);
		 * $scope.analysisInProgress.push($scope.lineresult[i].analysisInProgress); }
		 * $scope.data = [ $scope.readyForAnalysis, $scope.closed,
		 * $scope.prioritization, $scope.dltReview, $scope.crNeedsFunding,
		 * $scope.notStarted, $scope.analysisOnHold, $scope.internalReviewInQa,
		 * $scope.readyForWork, $scope.wishlist, $scope.pendingExecReview,
		 * $scope.infoNeeded, $scope.assessmentRequested, $scope.inAnalysis,
		 * $scope.partnerReview, $scope.implementation,
		 * $scope.internalReviewInProd, $scope.workOnHold,
		 * $scope.awaitingCrEvaluation, $scope.pendingExecApprovalForCrFunding,
		 * $scope.pendingUberReview, $scope.awaitingAssessment,
		 * $scope.assessmentRequiresFunding,
		 * $scope.pendingExecApprovalForAssessmentFunding,
		 * $scope.requiresUberApproval, $scope.rejected, $scope.readyForDev,
		 * $scope.readyForCreative, $scope.devInProgress, $scope.readyForTest,
		 * $scope.readyForBuild, $scope.blocked, $scope.analysisInProgress,];
		 * 
		 * var config = { type : 'line',
		 * 
		 * data : { labels : $scope.labels, datasets : [ { data :
		 * $scope.readyForAnalysis, label : "Ready for Analysis",
		 * backgroundColor :"#e60000" , borderColor : "#e60000", fill: false }, {
		 * data : $scope.closed, label : "Closed", backgroundColor : "#558000",
		 * borderColor : "#558000", fill: false }, { data :
		 * $scope.prioritization, label : "Prioritization", backgroundColor :
		 * "#804000", borderColor : "#804000", fill: false }, { data :
		 * $scope.dltReview, label : "DLT Review", backgroundColor : "#990073",
		 * borderColor : "#990073", fill: false }, { data :
		 * $scope.crNeedsFunding, label : "CR Needs Funding", backgroundColor :
		 * "#ff8000", borderColor : "#ff8000", fill: false }, { data :
		 * $scope.notStarted, label : "Not Started", backgroundColor :
		 * "#00cc88", borderColor : "#00cc88", fill: false }, { data :
		 * $scope.analysisOnHold, label : "Analysis On Hold", backgroundColor :
		 * "#e6e600", borderColor : "#e6e600", fill: false }, { data :
		 * $scope.internalReviewInQa, label : "Internal Review in QA",
		 * borderColor : "#0088cc", backgroundColor : "#0088cc", fill: false }, {
		 * data : $scope.readyForWork, label : "Ready for Work", borderColor :
		 * "#2eb82e", backgroundColor : "#2eb82e", fill: false }, { data :
		 * $scope.wishlist, label : "Wishlist", borderColor : "#ff8c1a",
		 * backgroundColor : "#ff8c1a", fill: false }, { data :
		 * $scope.pendingExecReview, label : "Pending Exec Review", borderColor :
		 * "#8a00e6", backgroundColor : "#8a00e6", fill: false }, { data :
		 * $scope.infoNeeded, label : "Info Needed", borderColor : "#cc6600",
		 * backgroundColor : "#cc6600", fill: false }, { data :
		 * $scope.assessmentRequested, label : "Assessment Requested",
		 * borderColor : "#476b6b", backgroundColor : "#476b6b", fill: false }, {
		 * data : $scope.inAnalysis, label : "In Analysis", borderColor :
		 * "#00b3b3", backgroundColor : "#00b3b3", fill: false }, { data :
		 * $scope.partnerReview, label : "Partner Review", borderColor : "
		 * #00b3b3", backgroundColor : "#00b3b3", fill: false }, { data :
		 * $scope.implementation, label : "Implementation", borderColor :
		 * "#8a00e6", backgroundColor : "#8a00e6", fill: false }, { data :
		 * $scope.internalReviewInProd, label : "Internal Review in Prod",
		 * borderColor : "#cc6600", backgroundColor : "#cc6600", fill: false }, {
		 * data : $scope.workOnHold, label : "Work On Hold", borderColor :
		 * "#476b6b", backgroundColor : "#476b6b", fill: false }, { data :
		 * $scope.awaitingCrEvaluation, label : "Awaiting CR Evaluation",
		 * borderColor :"#00b3b3", backgroundColor :"#00b3b3", fill: false }, {
		 * data : $scope.pendingExecApprovalForCrFunding, label : "Pending Exec
		 * Approval for CR Funding", borderColor :"#00b3b3", backgroundColor
		 * :"#00b3b3", fill: false }, { data : $scope.pendingUberReview, label :
		 * "Pending UBER Review", borderColor : "#cc6600", backgroundColor :
		 * "#cc6600", fill: false }, { data : $scope.awaitingAssessment, label :
		 * "Awaiting Assessment", borderColor : "#476b6b", backgroundColor :
		 * "#476b6b", fill: false }, { data : $scope.assessmentRequiresFunding,
		 * label : "Assessment Requires Funding", borderColor : "#00b3b3",
		 * backgroundColor :"#00b3b3", fill: false }, { data :
		 * $scope.pendingExecApprovalForAssessmentFunding, label : "Pending Exec
		 * Approval for Assessment Funding", backgroundColor :"#e60000" ,
		 * borderColor : "#e60000", fill: false }, { data :
		 * $scope.requiresUberApproval, label : "Requires UBER Approval",
		 * backgroundColor : "#558000", borderColor : "#558000", fill: false }, {
		 * data : $scope.rejected, label : "Rejected", backgroundColor :
		 * "#804000", borderColor : "#804000", fill: false }, { data :
		 * $scope.readyForDev, label : "Ready for Dev", backgroundColor :
		 * "#990073", borderColor : "#990073", fill: false }, { data :
		 * $scope.readyForCreative, label : "Ready for Creative",
		 * backgroundColor : "#ff8000", borderColor : "#ff8000", fill: false }, {
		 * data : $scope.devInProgress, label : "Dev in Progress",
		 * backgroundColor : "#00cc88", borderColor : "#00cc88", fill: false }, {
		 * data : $scope.readyForTest, label : "Ready for Test", backgroundColor :
		 * "#e6e600", borderColor : "#e6e600", fill: false }, { data :
		 * $scope.readyForBuild, label : "Ready for Build", borderColor :
		 * "#0088cc", backgroundColor : "#0088cc", fill: false }, { data :
		 * $scope.blocked, label : "Blocked", borderColor : "#2eb82e",
		 * backgroundColor : "#2eb82e", fill: false },{ data :
		 * $scope.analysisInProgress, label : "Analysis In Progress",
		 * backgroundColor : "#e6e600", borderColor : "#e6e600", fill: false }] },
		 * options : { responsive: true, maintainAspectRatio : false, tooltips: {
		 * enabled : true }, scales : { xAxes : [ { scaleLabel: { display: true,
		 * labelString: 'Time Period' }, type : "time", time : { displayFormats : {
		 * millisecond : "SSS [ms]", second : "h:mm:ss a", minute : "h:mm:ss a",
		 * hour : "MMM D, hA", day : "ll", week : "ll", month : "MMM YYYY",
		 * quarter : "[Q]Q - YYYY", year : "YYYY" }, tooltipFormat : "D MMM
		 * YYYY", unit : "month" }, gridLines : { color :
		 * "rgba(255,255,255,0.2)", } } ], yAxes : [ { scaleLabel: { display:
		 * true, labelString: 'Status Count' }, gridLines : { color :
		 * "rgba(255,255,255,0.2)", } } ] }, legend : { display : true, position :
		 * 'bottom', labels : { fontColor : '#ffffff', boxWidth : 15, } }, pan : { //
		 * Boolean to enable panning enabled : true, // Panning directions.
		 * Remove the appropriate // direction to disable // Eg. 'y' would only
		 * allow panning in the y // direction mode : 'x' }, // Container for
		 * zoom options zoom : { // Boolean to enable zooming enabled : true, //
		 * Zooming directions. Remove the appropriate // direction to disable //
		 * Eg. 'y' would only allow zooming in the y // direction mode : 'x', } } }
		 * $('#line').remove(); // this is my <canvas> element
		 * $('#linediv').append( '<canvas id="line" height="100%"> </canvas>');
		 * var ctx = document.getElementById("line"); window.line = new
		 * Chart(ctx, config); } }
		 */
		/* Jira Requirement Trend Chart */

		$scope.jirareqTrendChart = function() {

			var token = getEncryptedValue();

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
							label : "Done",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.7)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.7)",
							fill : false
						}, {
							data : $scope.todo,
							label : "To-Do",
							pointStyle : "line",
							borderColor : "rgba(255, 113, 189, 1)",
							pointBackgroundColor : "rgba(255, 113, 189, 1)",
							fill : false
						}, {
							data : $scope.inprogress,
							label : "In-Progress",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 1)",
							pointBackgroundColor : "rgba(236, 255, 0, 1)",
							fill : false
						}, {
							data : $scope.intesting,
							label : "In-Testing",
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
								scaleLabel : {
									display : true,
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
									unit : "month"
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Status Count'
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'right',
							labels : {
								fontColor : '#4c4c4c',
								usePointStyle : true,
								fontSize : 10,
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

			var token = getEncryptedValue();
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
							"rest/requirementServices/reqStoriesByStatus?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.jirastatuschartnew($scope.data);
								} else {
									$('#barchart').remove(); // this is my
									// <canvas>
									// element
									$('#bardiv')
											.append(
													' <canvas id="barchart" style="width: 480px;height: 282px;margin-top: 30px;margin-left: 10px;display: block;"> </canvas>');
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
				$('#bardiv')
						.append(
								' <canvas id="barchart" style="width: 480px;height: 282px;margin-top: 30px;margin-left: 10px;display: block;"> </canvas>');

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
											labelString : 'Stories Count'
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
											labelString : 'Status'
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ]
								}
							}
						});

			};
		}

		// Requirements by Priority Chart
		$scope.newPriorityChart = function() {

			var token = getEncryptedValue();
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
					config).success(
					function(response) {
						$scope.data = response;
						if ($scope.data.length != 0) {
							$scope.jiraprioritychartnew($scope.data);
						} else {
							$('#doughnut').remove(); // this is my
							// <canvas>
							// element
							$('#doughnutdiv').append(
									'<canvas id="doughnut" height="180%">');
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
				$('#doughnutdiv')
						.append('<canvas id="doughnut" height="180%">');
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
						maintainAspectRatio : true,
						pieceLabel : {
							render : 'value',
							fontColor : '#4c4c4c'
						},

						legend : {
							display : true,
							position : 'right',
							labels : {
								fontColor : '#4c4c4c',
								boxWidth : 15,
							}
						}
					}

				});
			};
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
			fillCanvasBackgroundWithColor(destinationCanvas, '#fcfcfc');
			if (format === 'jpeg') {
				saveCanvasAs(destinationCanvas, filename + ".jpg");
			}
			if (format === 'png') {
				saveCanvasAs(destinationCanvas, filename + ".png");
			}

		}
		/** *Requirement details download** */
		$scope.downloadReqTableData = function(start_index) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			// $scope.index = start_index;
			var start_index = 1
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
			$http.get(
					"./rest/almMetricsServices/reqTableDetails?&itemsPerPage="
							+ itemsPerPage + "&start_index=" + start_index
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
				// console.log(csvString);
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
