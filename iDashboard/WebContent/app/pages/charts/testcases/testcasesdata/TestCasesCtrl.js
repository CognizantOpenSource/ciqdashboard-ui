/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.testcases').controller(
			'TestCasesCtrl', TestCasesCtrl).filter('trimDesc', function() {
		return function(value) {
			if (!angular.isString(value)) {
				return value;
			}
			return value.replace(/^\s+|\s+$/g, '');
		};
	});

	/** @ngInject */
	function TestCasesCtrl($sessionStorage, AES, paginationService,
			UserService, localStorageService, $element, $scope, $base64, $http,
			$timeout, $uibModal, $rootScope, baConfig, layoutPaths,$filter) {
		/* function getEncryptedValue()
		 {
		  var username= localStorageService.get('userIdA');
		     var password= localStorageService.get('passwordA');
		       var tokeen =$base64.encode(username+":"+password);
		       
		       return tokeen;
		       }*/
		
		$rootScope.MetricsName = "Test Design";
		$scope.init = function() {
			$rootScope.dataloader = true;
		}
		
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$rootScope.timeperiodTc = localStorageService.get('timeperiod');
		
		if ($scope.dtto != null) {

			var dtToDate = new Date($scope.dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');

			localStorageService.set('dttoPlus', dtToDateStr);
		}

		
		$rootScope.tool = localStorageService.get('tool');

		//-----------------------------------------------------------------------

		$scope.tcdesignTableData = function(start_index) {
			
			

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.index = start_index;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;

			}

			

			$http.get(
					"./rest/almMetricsServices/tcTableDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTc, config).success(
					function(response) {
						
						
						$rootScope.tcTableDetails = response;
					});

		}

		$scope.initialdesigncountpaginate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;

			}

			$http.get(
					"rest/testCaseServices/tcTableRecordsCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testdesigndatapaginate = response;
					});
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
			paginationService.setCurrentPage("tcdesignpaginate", start_index);
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;

			$http.get(
					"rest/testCaseServices/testcaseData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTc, config).success(
					function(response) {
						$rootScope.tcTableDetails = response;
					});
		}

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
			} else if ($scope.searchField == "testName") {
				$rootScope.testName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDescription") {
				$rootScope.testDescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDesigner") {
				$rootScope.testDesigner = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "automationType") {
				$rootScope.automationType = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "automationStatus") {
				$rootScope.automationStatus = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDesignStatus") {
				$rootScope.testDesignStatus = searchText;
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

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}

			

			$http.get(
					"./rest/testCaseServices/searchpagecount?testID="
							+ $rootScope.testID + "&testName="
							+ $rootScope.testName + "&releaseName="
							+ $rootScope.releaseName + "&automationType="
							+ $rootScope.automationType + "&automationStatus="
							+ $rootScope.automationStatus + "&testDesigner="
							+ $rootScope.testDesigner + "&testDesignStatus="
							+ $rootScope.testDesignStatus + "&dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testdesigndatapaginate = response;
					});
			paginationService.setCurrentPage("tcdesignpaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;
			$scope.index = $scope.start_index;
			$http
					.get(
							"./rest/testCaseServices/searchTest?testID="
									+ $rootScope.testID + "&testName="
									+ $rootScope.testName + "&releaseName="
									+ $rootScope.releaseName
									+ "&automationType="
									+ $rootScope.automationType
									+ "&automationStatus="
									+ $rootScope.automationStatus
									+ "&testDesigner="
									+ $rootScope.testDesigner
									+ "&testDesignStatus="
									+ $rootScope.testDesignStatus
									+ "&itemsPerPage=" + $scope.itemsPerPage
									+ "&start_index=" + $scope.start_index
									+ "&dashboardName=" + dashboardName
									+ "&domainName=" + domainName
									+ "&projectName=" + projectName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodTc, config)
					.success(
							function(response) {
								console.log("searchTest response :" + response);
								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialdesigncountpaginate();
									$scope.tcdesignTableData(1);
								} else if (response == null) {
									$rootScope.searchkey = false;
									$scope.initialdesigncountpaginate();
									$scope.tcdesignTableData(1);
								} else {
									paginationService.setCurrentPage(
											"tcdesignpaginate",
											$scope.start_index);
									$rootScope.tcTableDetails = response;
								}
							});
		}

		//-----------------------------------------------------------------------

		/* Tree Level Structure Starts Here */
		//Total Test Count(BA Panel)
		$rootScope.initialtestcount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$http.get(
					"rest/almMetricsServices/totalTestCountinitial?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testCount = response;

					});
		}
		// Test Design Coverage(BA Panel)
		$rootScope.designCoverage = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$http.get(
					"rest/almMetricsServices/designCoverage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.designcovg = response;
						$scope.loadPieCharts('#designcov', $scope.designcovg);

					});
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

		//Automation Coverage
		$rootScope.autoCoverage = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$http.get(
					"rest/almMetricsServices/autoCoverageinitial?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.autocovg = response;
						$scope.loadPieCharts('#autocov', $scope.autocovg);
					});

		}

		// Design Trend Chart
		$scope.TCTrendChart = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/tctrendchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.data = response;
						$scope.tclinechart($scope.data);
					});

			$scope.tclinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.nostatus = [];
				$scope.imported = [];
				$scope.stable = [];
				$scope.design = [];
				$scope.ready = [];
				$scope.repair = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.nostatus.push($scope.lineresult[i].nostatus);
					$scope.imported.push($scope.lineresult[i].importedCnt);
					$scope.stable.push($scope.lineresult[i].stableCnt);
					$scope.design.push($scope.lineresult[i].designCnt);
					$scope.ready.push($scope.lineresult[i].readyCnt);
					$scope.repair.push($scope.lineresult[i].repairCnt);

				}
				$scope.data = [ $scope.nostatus, $scope.imported,
						$scope.stable, $scope.design, $scope.ready,
						$scope.repair ];
				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.nostatus,
							label : "No Status",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.7)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.7)"
						},

						{
							data : $scope.notcompleted,
							label : "notcompleted",
							pointStyle : "line",
							borderColor : "rgba(153, 102, 255, 0.8)",
							pointBackgroundColor : "rgba(153, 102, 255, 0.8)"
						}, {
							data : $scope.imported,
							label : "Imported",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 0.9)",
							pointBackgroundColor : "rgba(236, 255, 0, 0.9)"

						}, {
							data : $scope.design,
							label : "Design",
							pointStyle : "line",
							borderColor : "rgba(255, 134, 0, 1)",
							pointBackgroundColor : "rgba(255, 134, 0, 1)"

						}, {
							data : $scope.ready,
							label : "Ready",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)"

						}, {
							data : $scope.repair,
							label : "repair",
							pointStyle : "line",
							borderColor : "rgba(255, 31, 0, 0.9)",
							pointBackgroundColor : "rgba(255, 31, 0, 0.9)"

						}, {
							data : $scope.stable,
							label : "stable",
							pointStyle : "line",
							borderColor : "rgba(153, 102, 255, 0.8)",
							pointBackgroundColor : "rgba(153, 102, 255, 0.8)"

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
								scaleLabel : {
									display : true,
									labelString : 'Test Count',
									fontColor : '#4c4c4c'
								},
								gridLines : {
									color : "#d8d3d3",
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
							//Boolean to enable panning
							enabled : true,

							//Panning directions. Remove the appropriate direction to disable
							//Eg. 'y' would only allow panning in the y direction
							mode : 'x'
						},

						//Container for zoom options
						zoom : {
							//Boolean to enable zooming
							enabled : true,

							//Zooming directions. Remove the appropriate direction to disable
							//Eg. 'y' would only allow zooming in the y direction
							mode : 'x',
						}
					}
				}
				$('#tcline').remove(); // this is my <canvas> element
				$('#tclinediv').append('<canvas id="tcline"></canvas>');
				var ctx = document.getElementById("tcline");
				window.tcline = new Chart(ctx, config);
			}
		}

		//Design Status Pie Chart
		$scope.newStatusChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/designstatuschartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.data = response;
						$scope.tcstatuschart($scope.data);

					});

			$scope.tcstatuschart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].testDesignStatus == "") {
						$scope.result[i].testDesignStatus = "No Status";
					}
					$scope.labels1.push($scope.result[i].testDesignStatus);
					$scope.data1.push($scope.result[i].statuscount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#piechart').remove();
				$('#piechartdiv').append('<canvas id="piechart"></canvas>');

				var ctx = document.getElementById("piechart");
				var piechart = new Chart(ctx, {
					type : 'pie',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(199, 99, 5, 0.9)",
									"rgba(38, 189, 0, 0.8)",
									"rgba(189, 5, 171, 0.8)",
									"rgba(255, 31, 0, 0.8)",
									"rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)" ],
							borderColor : [ "rgba(199, 99, 5, 1)",
									"rgba(38, 189, 0, 1)",
									"rgba(189, 5, 171, 1)",
									"rgba(255, 31, 0, 1)",
									"rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)" ],
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

		// DESIGN BY TEST TYPE - DONUT CHART

		$scope.newTypeChart = function(domain, project, release) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/designtypechartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.data = response;
						$scope.tctypechart($scope.data);
					});

			$scope.tctypechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].testType);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#donutChart').remove();
				$('#donutChartdiv').append('<canvas id="donutChart"></canvas>');
				var ctx = document.getElementById("donutChart");
				var donutChart = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(255, 0, 174, 0.8)",
									"rgba(47, 0, 255, 0.8)",
									"rgba(6, 239, 212, 0.8)",
									"rgba(189, 5, 171, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(255, 245, 51, 0.8)",
									"rgba(255, 113, 189, 0.8)",
									"rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)" ],
							borderColor : [ "rgba(255, 0, 174, 1)",
									"rgba(47, 0, 255, 1)",
									"rgba(6, 239, 212, 1)",
									"rgba(189, 5, 171, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(255, 245, 51, 1)",
									"rgba(255, 113, 189, 1)",
									"rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)" ],
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

		};

		//Design Count by Owner - BAR CHART
		$scope.newOwnerCountChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/designownerchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$scope.data = response;
						$scope.tcownerchart($scope.data);

					});

			$scope.tcownerchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].testDesigner == "") {
						$scope.result[i].testDesigner = "No Owner";
					}
					$scope.labels1.push($scope.result[i].testDesigner);
					$scope.data1.push($scope.result[i].designercount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#ownerchart').remove();
				$('#ownerchartdiv').append('<canvas id="ownerchart">')
				var ctx = document.getElementById("ownerchart");
				var ownerchart = new Chart(
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
											"rgba(255, 99, 132, 0.8)" ],
									borderColor : [ "rgba(199, 99, 5, 0.9)",
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
											"rgba(255, 99, 132, 0.8)" ],
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
																//This below lines are user to show the count in TOP of the BAR
																/*var data = dataset.data[index];
																ctx.fillText(data, bar._model.x, bar._model.y - 5);*/

																//This below lines are user to show the count in CENTER of the BAR
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
											fontColor : '#4c4c4c'
										},
										scaleLabel : {
											display : true,
											labelString : 'Test Count'
										},
										ticks : {
											beginAtZero : true,
											fontColor : '#4c4c4c'
										}
									} ],
									xAxes : [ {

										ticks : {
											fontColor : '#4c4c4c'
										},
										scaleLabel : {
											display : true,
											labelString : 'Owner',
											fontColor : '#4c4c4c'
										},
										barThickness : 40
									} ]

								}
							}

						});
			};

		}

		$scope.tcTableData = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.index = start_index;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$http.get(
					"./rest/almMetricsServices/tcTableDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTc, config).success(
					function(response) {
						$rootScope.tcTableDetails = response;
					});

		}

		/*$scope.initialcountpaginate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$http.get(
					"rest/testCaseServices/tcTableRecordsCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testdatapaginate = response;
					});
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
			paginationService.setCurrentPage("tcpaginate", start_index);
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;

			$http.get(
					"rest/testCaseServices/testcaseData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTc, config).success(
					function(response) {
						$rootScope.tcTableDetails = response;
					});
		}

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
			} else if ($scope.searchField == "testName") {
				$rootScope.testName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDescription") {
				$rootScope.testDescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDesigner") {
				$rootScope.testDesigner = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testType") {
				$rootScope.testType = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDesignStatus") {
				$rootScope.testDesignStatus = searchText;
				$scope.key = true;
			}

			$scope.searchable();

		}

		$scope.searchable = function(start_index, searchField, searchText) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if ($rootScope.testID == undefined) {
				$rootScope.testID = 0;
			}

			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}

			$http.get(
					"./rest/testCaseServices/searchpagecount?testID="
							+ $rootScope.testID + "&testName="
							+ $rootScope.testName + "&testType="
							+ $rootScope.testType + "&testDescription="
							+ $rootScope.testDescription + "&testDesigner="
							+ $rootScope.testDesigner + "&testDesignStatus="
							+ $rootScope.testDesignStatus + "&dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testdatapaginate = response;
					});
			paginationService.setCurrentPage("tcpaginate", start_index);
			$scope.itemsPerPage = 5;
			$http.get(
					"./rest/testCaseServices/searchTest?testID="
							+ $rootScope.testID + "&testName="
							+ $rootScope.testName + "&testDescription="
							+ $rootScope.testDescription + "&testDesigner="
							+ $rootScope.testDesigner + "&testType="
							+ $rootScope.testType + "&testDesignStatus="
							+ $rootScope.testDesignStatus + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.start_index + "&dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(
							function(response) {
								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialcountpaginate();
									$scope.tcTableData(1);
								} else {
									paginationService.setCurrentPage(
											"tcpaginate", $scope.start_index);
									$rootScope.tcTableDetails = response;
								}
							});
		}*/

		//TC Lazy Load Table Code Starts Here 
		$scope.tcpageChangedLevel = function(pageno) {
			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {
				$scope.tcTableData($scope.pageno);
			} else if ($rootScope.sortkey == true) {
				$scope
						.sortedtable($scope.sortBy, $scope.pageno,
								$scope.reverse);
			} else if ($rootScope.searchkey == true) {

				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);
			}
		}
		// PopUp of Defect details using D3 Cross Filter
		$scope.openpopup = function(size) {
			$rootScope.tcanalyse = $uibModal
					.open({
						animation : true,
						templateUrl : 'app/pages/charts/testcases/testcasesdata/designAnalyze.html',
						scope : $scope,
						size : size,
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		/* Tree Level Structure Ends Here */

		/* Date Filter Code Starts Here */
		// CALENDER DEFAULT VALUE
		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$rootScope.dfromvalTc = dtfrom;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtfrom', dtfrom);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodTc = localStorageService.get('timeperiod');
			$rootScope.designfilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$rootScope.dtovalTc = dtto;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtto', dtto);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodTc = localStorageService.get('timeperiod');
			$rootScope.designfilterfunction();
		}

		$scope.gettimeperiod = function() {
			$rootScope.timeperiodTcdrops = [ "Last 30 days", "Last 60 days",
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
			$rootScope.timeperiodTc = localStorageService.get('timeperiod');
		}

		$scope.gettimeperiodselection = function(timeperiod) {
			localStorageService.set('timeperiod', timeperiod);
			$rootScope.timeperiodTc = localStorageService.get('timeperiod');
			var index = $rootScope.timeperiodDashdrops.indexOf(timeperiod);
			var selectednoofdays = $rootScope.noofdays[index];
			var to = new Date();
			var from = new Date();

			$scope.dtto = to;
			$scope.dtfrom = new Date(from.setDate(to.getDate()
					- selectednoofdays));

			$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			$rootScope.designfilterfunction();
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

			$rootScope.dfromvalTc = $scope.dtfromfinal; // storage date reset
			$rootScope.dtovalTc = $scope.dttofinal; // storage date reset
			//	 $rootScope.designfilterfunction();

		}

		// Function call for each dropdown change

		$rootScope.designfilterfunction = function() {
			$scope.testCountFilter();
			$scope.designCoverageFilter();
			$scope.autoCoverageFilter();
			$scope.TCTrendChart();
			$scope.newStatusChart();
			$scope.newTypeChart();
			$scope.newOwnerCountChart();
			//$scope.tcTableData(1);
			$scope.tcdesignTableData(1);
			$scope.initialcountpaginate();
			$scope.regressionautomationFilter();
		}

		//Total Test Count(BA Panel)
		$rootScope.testCountFilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}

			$http.get(
					"rest/almMetricsServices/totalTestCountFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(function(response) {
						$rootScope.testCount = response;

					});
		}
		// Test Design Coverage(BA Panel)
		$rootScope.designCoverageFilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/designCovFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(
							function(response) {
								$scope.designcovgfilter = response;
								$scope.loadPieCharts('#designcovfilter',
										$scope.designcovgfilter);

							});
		}

		//Automation Coverage
		$rootScope.autoCoverageFilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');
			
			$http.get(
					"rest/almMetricsServices/autoCovFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(
							function(response) {
								$scope.autocovgfilter = response;
								$scope.loadPieCharts('#autocovfilter',
										$scope.autocovgfilter);
							});

		}

		/* Date Filter Code Ends Here */

		/* Export Graphs and tables*/
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
		$scope.tcTableDataExport = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var index = start_index;
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;
			}
			var itemsPerPage = 0;
			$http.get(
					"./rest/almMetricsServices/tcTableDetails?itemsPerPage="
							+ itemsPerPage + "&start_index=" + index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodTc, config).success(
					function(response) {
						$scope.tcTableDetailsDownload = response;
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
		
		$rootScope.regressionautomationFilter = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			//var vartime = "";

			/*if ($rootScope.timeperiodTc == null || $rootScope.timeperiodTc == undefined
					|| $rootScope.timeperiodTc == "") {
				vartime = "-";
			} else {
				vartime = $rootScope.timeperiodTc;
			}*/

			if ($rootScope.dfromvalTc == null
					|| $rootScope.dfromvalTc == undefined
					|| $rootScope.dfromvalTc == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromvalTc;
			}

			if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
					|| $rootScope.dtovalTc == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalTc;

			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"rest/almMetricsServices/regressionautoFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodTc, config)
					.success(
							function(response) {
								$scope.regautofilter = response;
								$scope.loadPieCharts('#regautofilter',
										$scope.regautofilter);
							});

		}


	}
})();
