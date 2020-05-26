/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.Operational.Defects').controller(
			'defectPopupDataCtrl', defectPopupDataCtrl);

	/** @ngInject */
	function defectPopupDataCtrl($sessionStorage,AES, $scope, localStorageService,
			UserService, baConfig, $rootScope, $element, layoutPaths, $http,
			$base64) {
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
			$rootScope.defectsanalyse.close();
		};

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

		if ($rootScope.dtovalDef == null || $rootScope.dtovalDef == undefined
				|| $rootScope.dtovalDef == "") {
			vardtto = "-";
		} else {
			vardtto = $rootScope.dtovalDef;
		}
		
		vardtfrom = localStorageService.get('dtfrom');
		//vardtto = localStorageService.get('dtto');
		vardtto = localStorageService.get('dttoPlus');	
		
		$http.get(
				"./rest/almMetricsServices/defectsdataforpopup?dashboardName="
						+ dashboardName + "&domainName=" + domainName
						+ "&projectName=" + projectName + "&vardtfrom="
						+ vardtfrom + "&vardtto=" + vardtto + "&timeperiod="
						+ $rootScope.timeperiodDef, config).success(
				function(response) {
					$scope.executiondata = response;
					// alert(JSON.stringify($scope.executiondata));
					makeGraphs(response);
				});

		function makeGraphs(apiData) {

			// Start Transformations
			var dataSet = apiData;

			// Create a Crossfilter instance
			var ndx = crossfilter(dataSet);

			// alert(JSON.stringify(dataSet));

			// Define Dimensions
			var defectID = ndx.dimension(function(d) {
				return d.defectId;
			});
			var defectassignedto = ndx.dimension(function(d) {
				return d.assignedto;
			});
			var defectApplication = ndx.dimension(function(d) {
				return d.application;
			});
			var defectSummary = ndx.dimension(function(d) {
				return d.summary;
			});
			var defectPriority = ndx.dimension(function(d) {
				return d.priority;
			});
			var defectSeverity = ndx.dimension(function(d) {
				return d.severity;
			});
			var defectStatus = ndx.dimension(function(d) {
				return d.status;
			});
			var defectTower = ndx.dimension(function(d) {
				return d.tower;
			});

			// var defectOpenStatus = ndx.dimension(function(d) { return
			// d.status("Open"); });

			// console.log((defectOpenStatus.size()));

			// Calculate metrics
			var defectsByassignedto = defectassignedto.group();
			var defectsByPriority = defectPriority.group();
			var defectsBySeverity = defectSeverity.group();
			var defectsByStatus = defectStatus.group();
			var defectByApplication = defectApplication.group();
			var defectByTower = defectTower.group();
			// total defects
			var totalDefects = dc.numberDisplay("#total-projects");

			$scope.ofs = 0;
			var all = ndx.groupAll();

			// Calculate Groups
			var totalDefectsBySeverity = defectSeverity.group().reduceSum(
					function(d) {
						return d.severity;
					});

			var totalDefectsByPriority = defectPriority.group().reduceSum(
					function(d) {
						return d.priority;
					});

			var totalDefectsByassignedto = defectassignedto.group().reduceSum(
					function(d) {
						return d.assignedto;
					});

			var totalDefectsByStatus = defectStatus.group().reduceSum(
					function(d) {
						return d.status;
					});

			//var assignedtoTypeChart = dc.pieChart("#funding-chart");
			var priorityTypeChart = dc.barChart("#state-donations");
			var statusTypeChart = dc.rowChart("#poverty-chart");

			var severityTypeChart = dc.rowChart("#severity-chart");

			$scope.dashTable = dc.dataTable("#datatable");
			$scope.ofs = 0;
			$scope.pag = 7;

			var pieChartColors = d3.scale.ordinal().range(
					[ "#dfb81c", "#0F8070", "#045259", "#d18c2b", "#00b8e6",
							"#90b900", "#209e91", "#e85656" ]);
			var barChartColors = d3.scale.ordinal()
					.range(
							[ "rgba(255, 113, 189, 0.9)",
									"rgba(9, 191, 22, 0.9)",
									"rgba(6, 239, 212, 0.9)",
									"rgba(236, 255, 0, 0.9)",
									"rgba(255, 159, 64, 0.9)",
									"rgba(255, 31, 0, 0.9)" ]);
			var rowChartColors = d3.scale.ordinal()
					.range(
							[ "rgba(255, 113, 189, 0.9)",
									"rgba(9, 191, 22, 0.9)",
									"rgba(6, 239, 212, 0.9)",
									"rgba(236, 255, 0, 0.9)",
									"rgba(255, 159, 64, 0.9)",
									"rgba(255, 31, 0, 0.9)" ]);

			var selectField = dc.selectMenu('#menuselect').dimension(
					defectPriority).group(defectsByPriority);

			var selectField = dc.selectMenu('#menuselect1').dimension(
					defectStatus).group(defectsByStatus);

			var selectField = dc.selectMenu('#menuselect2').dimension(
					defectSeverity).group(defectsBySeverity);

			totalDefects.formatNumber(d3.format("d")).valueAccessor(
					function(d) {
						return d;
					}).group(all);

			priorityTypeChart.width(450).height(300).colors(barChartColors)
					.dimension(defectPriority).group(defectsByPriority)
					.margins({
						top : 10,
						right : 80,
						bottom : 30,
						left : 50
					}).centerBar(false).gap(5).elasticY(true).x(
							d3.scale.ordinal().domain(defectPriority)).xUnits(
							dc.units.ordinal).renderHorizontalGridLines(true)
					.renderVerticalGridLines(true).ordering(function(d) {
						return d.value;
					}).colorAccessor(function(d) {
						return d.value;
					}).yAxis().tickFormat(d3.format("s"));

			/*
			 * assignedtoTypeChart .height(300) .width(350)
			 * .colors(pieChartColors) .radius(140) .innerRadius(40)
			 * .transitionDuration(1000) .dimension(defectassignedto)
			 * .legend(dc.legend().x(315).y(0).gap(5)) .on('pretransition',
			 * function(assignedtoTypeChart) {
			 * assignedtoTypeChart.selectAll('text.pie-slice').text(function(d) {
			 * return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle -
			 * d.startAngle) / (2*Math.PI) * 100) + '%'; }) })
			 * .group(defectsByassignedto);
			 */

			statusTypeChart
			// .width(300)
			.colors(rowChartColors).height(300).dimension(defectStatus).group(
					defectsByStatus).xAxis().ticks(4);

			severityTypeChart
			// .width(300)
			.colors(rowChartColors).height(300).dimension(defectSeverity)
					.group(defectsBySeverity).xAxis().ticks(4);

			// Data table for defects
			$scope.dashTable.width(800).height(800).dimension(defectID).group(
					function(d) {
						return " ";
					}).size(Infinity).columns([ {
				label : "Defect_Id ",
				format : function(d) {
					return d.defectId;
				}
			}, {
				label : "Assigned_To ",
				format : function(d) {
					return d.assignedto;
				}
			}, {
				label : "Status ",
				format : function(d) {
					return d.status;
				}
			}, {
				label : "Priority ",
				format :

				function(d) {
					return d.priority;
				}
			},{
				label : "Severity ",
				format :
	
				function(d) {
					return d.severity;
				}
			} 
			]);

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
				$scope.dashTable.beginSlice($scope.ofs);
				$scope.dashTable.endSlice($scope.ofs + $scope.pag);
				display();
				// $scope.dashTable.render();
			}
			$scope.next = function() {
				// alert("next");
				$scope.ofs += $scope.pag;
				update();
				$scope.dashTable.redraw();

			};
			$scope.last = function() {
				{
					$scope.ofs -= $scope.pag;
					update();
					$scope.dashTable.render();
				}

			};

			update();
			dc.renderAll();

		}
		;

	}

})();
