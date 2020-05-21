/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.requirements').controller(
			'ReqAnalyzeCtrl', ReqAnalyzeCtrl);

	/** @ngInject */
	function ReqAnalyzeCtrl($sessionStorage,AES,$scope, UserService,
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
			$rootScope.requirementsanalyse.close();
		};
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

		if ($rootScope.dtovalReq == null || $rootScope.dtovalReq == undefined
				|| $rootScope.dtovalReq == "") {
			vardtto = "-";
		} else {
			vardtto = $rootScope.dtovalReq;
		}
		
		vardtfrom = localStorageService.get('dtfrom');
		//vardtto = localStorageService.get('dtto');
		vardtto = localStorageService.get('dttoPlus');

		$http.get(
				"./rest/almMetricsServices/requirementsDataAnalyseLevel?dashboardName="
						+ dashboardName + "&domainName=" + domainName
						+ "&projectName=" + projectName + "&vardtfrom="
						+ vardtfrom + "&vardtto=" + vardtto + "&timeperiod="
						+ $rootScope.timeperiodReq, config).success(
				function(response) {
					$scope.reqdata = response;

					makeGraphs(response);
				});

		function makeGraphs(apiData) {
			var dataSet = apiData;
			var ndx = crossfilter(dataSet);

			var reqID = ndx.dimension(function(d) {
				return d.reqID;
			});
			var reqName = ndx.dimension(function(d) {
				return d.reqName;
			});
			var description = ndx.dimension(function(d) {
				return d.description;
			});
			var status = ndx.dimension(function(d) {
				return d.status;
			});
			var priority = ndx.dimension(function(d) {
				if(d.priority == ""){
					d.priority = "No priority";
				}
				return d.priority;
			});
			var reqType = ndx.dimension(function(d) {
				return d.reqType;
			});
			var creationTime = ndx.dimension(function(d) {
				return d.creationTime;
			});
			var lastModified = ndx.dimension(function(d) {
				return d.lastModified;
			});

			var reqByID = reqID.group();
			var reqByName = reqName.group();
			var reqdescription = description.group();
			var reqstatus = status.group();
			var reqpriority = priority.group();
			var reqByType = reqType.group();
			var reqcreationTime = creationTime.group();
			var reqlastModified = lastModified.group();
			
			

			var totalReqs = dc.numberDisplay("#total-requirements");
			$scope.ofs = 0;
			var all = ndx.groupAll();

			var ReqByStatus = status.group().reduceSum(function(d) {
				return d.status;
			});
			var ReqByPriority = priority.group().reduceSum(function(d) {
				return d.priority;
			});
			
			var ReqByType = reqType.group().reduceSum(function(d) {
				return d.reqType;
			});

			var reqPriorityChart = dc.pieChart("#priority-chart");
			var reqStatusChart = dc.rowChart("#status-chart");
			var reqTypeChart = dc.rowChart("#type-chart");

			$scope.reqTable = dc.dataTable("#datatable");
			$scope.ofs = 0;
			$scope.pag = 7;

			var barChartColors = d3.scale.ordinal().range(
					[ "#97516B", "#dfb81c", "#90b900", "#209e91", "#e85656" ]);
			var pieChartColors = d3.scale.ordinal().range(
					[ "rgba(255, 113, 189, 0.9)", "rgba(9, 191, 22, 0.9)",
							"rgba(236, 255, 0, 0.9)",
							"rgba(255, 159, 64, 0.9)", "rgba(255, 31, 0, 0.8)",
							"rgba(6, 239, 212, 0.8)" ]);
			var rowChartColors = d3.scale.ordinal().range(
					[ "rgba(67, 154, 213, 0.9)", "rgba(255, 134, 0, 1)",
							"rgba(255, 31, 0, 0.9)",
							"rgba(255, 113, 189, 0.9)",
							"rgba(153, 102, 255, 0.9)",
							"rgba(236, 255, 0, 0.9)", "rgba(31, 255, 240, 1)",
							"rgba(9, 191, 22, 0.9)" ]);

			var selectField = dc.selectMenu('#menuselect1').dimension(status)
					.group(reqstatus);

			var selectField = dc.selectMenu('#menuselect2').dimension(reqType)
					.group(reqByType);
			
			
			var selectField = dc.selectMenu('#menuselect3').dimension(priority)
			.group(reqpriority);

			totalReqs.formatNumber(d3.format("d")).valueAccessor(function(d) {
				return d;
			}).group(all);

			reqStatusChart.width(400).colors(rowChartColors).height(300)
					.dimension(status).group(reqstatus).title(function(d) {
						return d.value;
					}).legend(dc.legend()).renderTitleLabel([ false ]).xAxis()
					.ticks(4);
			
			reqTypeChart.width(400).colors(rowChartColors).height(300)
			.dimension(reqType).group(reqByType).title(function(d) {
				return d.value;
			}).legend(dc.legend()).renderTitleLabel([ false ]).xAxis()
			.ticks(4);

			reqPriorityChart
					.height(300)
					.width(350)
					.colors(pieChartColors)
					.radius(140)
					.innerRadius(40)
					.transitionDuration(1000)
					.dimension(priority)
					.legend(dc.legend().x(300).y(0).gap(5))
					.on(
							'pretransition',
							function(reqPriorityChart) {
								reqPriorityChart
										.selectAll('text.pie-slice')
										.text(
												function(d) {
													return  Math.round(dc.utils.printSingleValue((d.endAngle - d.startAngle)/ (2 * Math.PI)* 100)) + '%';
												})
							}).group(reqpriority);
			
			

			$scope.reqTable.width(1200).height(1200).dimension(reqID).group(
					function(d) {
						return " ";
					}).size(Infinity).columns([ {
				label : "Name",
				format : function(d) {
					return d.reqName;
				}
			}, {
				label : "Type",
				format : function(d) {
					return d.reqType;
				}
			}, {
				label : "Modified Date",
				format : function(d) {
					return d.lastModified;
				}
			}, {
				label : "Creation Date",
				format : function(d) {
					return d.creationTime;
				}
			}, {
				label : "Status ",
				format : function(d) {
					return d.status;
				}
			}, {
				label : "Priority ",
				format : function(d) {
					return d.priority;
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

				$scope.reqTable.beginSlice($scope.ofs);
				$scope.reqTable.endSlice($scope.ofs + $scope.pag);
				display();

			}
			$scope.next = function() {

				$scope.ofs += $scope.pag;
				update();
				$scope.reqTable.redraw();

			};
			$scope.last = function() {
				{
					$scope.ofs -= $scope.pag;
					update();
					$scope.reqTable.render();
				}

			};

			update();
			dc.renderAll();

		}
		;
	}
})();
