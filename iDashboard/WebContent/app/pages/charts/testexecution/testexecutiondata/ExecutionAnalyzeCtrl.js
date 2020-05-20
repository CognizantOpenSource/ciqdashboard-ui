
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.testexecution').controller(
			'ExecutionAnalyzeCtrl', ExecutionAnalyzeCtrl);

	/** @ngInject */
	function ExecutionAnalyzeCtrl($sessionStorage, $scope, UserService,
			localStorageService, baConfig, $rootScope, $element, layoutPaths,
			$http, $base64) {
		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$scope.cancel = function() {
			$rootScope.teanalyse.close();
		};
		var token = getEncryptedValue();
		var config = {
			headers : {
				'Authorization' : token
			}
		};
		var vardtfrom = "";
		var vardtto = "";

		if ($rootScope.dfromvalTe == null || $rootScope.dfromvalTe == undefined
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
				"./rest/almMetricsServices/executionData?dashboardName="
						+ dashboardName + "&domainName=" + domainName
						+ "&projectName=" + projectName + "&vardtfrom="
						+ vardtfrom + "&vardtto=" + vardtto + "&timeperiod="
						+ $rootScope.timeperiodTe, config).success(
				function(response) {
					$scope.executiondata = response;
					makeGraphs(response);
				});

		function makeGraphs(apiData) {

			// Start Transformations
			var dataSet = apiData;

			// Create a Crossfilter instance
			var ndx = crossfilter(dataSet);

			// alert(JSON.stringify(dataSet));

			// Define Dimensions
			var testID = ndx.dimension(function(d) {
				return d.testID;
			});
			var testTester = ndx.dimension(function(d) {
				return d.testTester;
			});
			var testName = ndx.dimension(function(d) {
				return d.testName;
			});

			var testDescription = ndx.dimension(function(d) {
				return d.testDescription;
			});
			var testType = ndx.dimension(function(d) {
				return d.testType;
			});
			var testExecutionStatus = ndx.dimension(function(d) {
				return d.testExecutionStatus;
			});
			var testExecutionDate = ndx.dimension(function(d) {
				return d.testExecutionDate;
			});
			var defectId = ndx.dimension(function(d) {
				return d.defectId;
			});

			// CycleName
			var testCycleName = ndx.dimension(function(d) {
				return d.cycleName;
			});

			// var defectOpenStatus = ndx.dimension(function(d) { return
			// d.status("Open"); });

			// console.log((defectOpenStatus.size()));

			// Calculate metrics
			var testByID = testID.group();
			var testByTester = testTester.group();
			var testByName = testName.group();
			var testByDescription = testDescription.group();
			var testByType = testType.group();
			var testByExecutionStatus = testExecutionStatus.group();
			var testByExecutionDate = testExecutionDate.group();
			var defectById = defectId.group();
			var testByCycleName = testCycleName.group();

			// total defects
			var totalExecutions = dc.numberDisplay("#total-executions");

			$scope.ofs = 0;
			var all = ndx.groupAll();

			// Calculate Groups
			var ExecutionsByStatus = testExecutionStatus.group().reduceSum(
					function(d) {
						return d.status;
					});

			var ExecutionsByExecutors = testTester.group().reduceSum(
					function(d) {
						return d.executors;
					});

			function getTops(source_group) {
				return {
					all : function() {
						return source_group.top(6);
					}
				};
			}
			var topGroup = getTops(testByCycleName);

			var exeStatusChart = dc.pieChart("#status-chart");
			// var executorsChart = dc.barChart("#executors-chart");
			/*var cycleChart = dc.barChart("#cycle-chart");*/
			var cyclepieChart = dc.pieChart("#cycle-pie-chart");
			$scope.executionTable = dc.dataTable("#datatable");
			$scope.ofs = 0;
			$scope.pag = 7;

			var pieChartColors = d3.scale.ordinal().range(
					[ "rgba(227, 43, 25)", "rgba(31, 138, 15)",
							"rgba(16, 239, 2212, 10)", "rgba(189, 5, 171, 0.8)",
							"rgba(9, 191, 22, 1)", "rgba(153, 102, 255, 0.8)",
							"rgba(67, 154, 213, 0.8)",
							"rgba(255, 113, 189, 0.8)",
							"rgba(54, 162, 235, 0.8)",
							"rgba(153, 102, 255, 0.8)" ,"rgba(674, 111, 155, 0.8)" ,
							"rgba(227,132,25)",
							"rgba(132, 118, 15)",
							"rgba(22, 224,212, 10)",
							"rgba(199, 3, 271, 0.8)",
							"rgba(109, 291, 122, 1)",
							"rgba(343, 422, 166, 0.8)",
							"rgba(328, 154, 113, 10)",
							"rgba(295, 123, 0, 10)",
							"rgba(54, 62, 35, 10)",
							"rgba(252, 0, 155, 10)"]);
			var barChartColors = d3.scale.ordinal().range(
					[ "#97516B", "#dfb81c", "#90b900", "#209e91", "#e85656" ]);
			var rowChartColors = d3.scale.ordinal().range(
					[ "#dfb81c", "#90b900", "#209e91", "#e85656" ]);
			
			

			/*
			 * var selectField = dc.selectMenu('#menuselect')
			 * .dimension(defectPriority) .group(defectsByPriority);
			 */

			var selectField = dc.selectMenu('#menuselect1').dimension(
					testCycleName).group(testByCycleName);

			var selectField = dc.selectMenu('#menuselect2').dimension(
					testTester).group(testByTester);

			var selectField = dc.selectMenu('#menuselect3').dimension(
					testExecutionStatus).group(testByExecutionStatus);

			totalExecutions.formatNumber(d3.format("d")).valueAccessor(
					function(d) {
						return d;
					}).group(all);

			exeStatusChart
					.height(300)
					.width(350)
					.colors(pieChartColors)
					.radius(140)
					.innerRadius(40)
					.transitionDuration(1000)
					.dimension(testExecutionStatus)					
					.on(
							'pretransition',
							function(exeStatusChart) {
								exeStatusChart
										.selectAll('text.pie-slice')
										.text(
												function(d) {
													return ' '+Math.round(dc.utils
																			.printSingleValue((d.endAngle - d.startAngle)
																					/ (2 * Math.PI)
																					* 100))
															+ '%';
												})
							}).group(testByExecutionStatus);
			
			
			cyclepieChart
			.height(300)
			.width(350)
			.colors(pieChartColors)
			.radius(140)
			.innerRadius(80)
			.transitionDuration(1000)
			.dimension(testCycleName)			
			.on(
					'pretransition',
					function(cyclepieChart) {
						cyclepieChart
								.selectAll('text.pie-slice')
								.text(
										function(d) {
											return  ' '
													+ Math
															.round(dc.utils
																	.printSingleValue((d.endAngle - d.startAngle)
																			/ (2 * Math.PI)
																			* 100))
													+ '%';
										})
					}).group(testByCycleName);


			/*cycleChart.width(450).height(300).colors(barChartColors)
			.dimension(
					testCycleName).group(topGroup).margins({
				top : 10,
				right : 80,
				bottom : 30,
				left : 50
			}).centerBar(false).gap(5).elasticY(true).x(
					d3.scale.ordinal().domain(testCycleName)).xUnits(
					dc.units.ordinal).renderHorizontalGridLines(true)
					.renderVerticalGridLines(true).ordering(function(d) {
						return d.value;
					}).colorAccessor(function(d) {
						return d.value;
					}).yAxis().tickFormat(d3.format('d'));*/

			
			

			// Data table for defects
			$scope.executionTable.width(800).height(800).dimension(testID)
					.group(function(d) {
						return " ";
					}).size(Infinity).columns([ {
						label : "Name",
						format : function(d) {
							return d.testName;
						}
					}, {
						label : "Owner",
						format : function(d) {
							return d.testTester;
						}
					}, {
						label : "Status ",
						format : function(d) {
							return d.testExecutionStatus;
						}
					} ]);

			function display() {
				d3.select('#begin').text($scope.ofs);
				d3.select('#end').text($scope.ofs + $scope.pag - 1);
				d3.select('#last').attr('disabled',
						$scope.ofs - $scope.pag < 0 ? 'true' : null);
				d3.select('#next').attr('disabled',
						$scope.ofs + $scope.pag >= ndx.size() ? 'true' : null);
				d3.select('#size').text(ndx.size());
			}

			function update() {
				// alert($scope.ofs);
				$scope.executionTable.beginSlice($scope.ofs);
				$scope.executionTable.endSlice($scope.ofs + $scope.pag);
				display();
				//$scope.dashTable.render();
			}
			$scope.next = function() {
				//alert("next");
				$scope.ofs += $scope.pag;
				update();
				$scope.executionTable.redraw();

			};
			$scope.last = function() {
				{
					$scope.ofs -= $scope.pag;
					update();
					$scope.executionTable.render();
				}

			};

			update();
			dc.renderAll();

		}
		;

	}

})();
