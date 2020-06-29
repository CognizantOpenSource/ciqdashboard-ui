/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.testcases').controller(
			'JiraTestCasesCtrl', JiraTestCasesCtrl);

	/** @ngInject */
	function JiraTestCasesCtrl($sessionStorage, AES, paginationService, UserService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths) {
		
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$rootScope.tool = localStorageService.get('tool');

		// PROJECT DROP DOWN LIST
		$scope.getprojectName = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/testCaseServices/projectlevellist?dashboardName="
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
			var token = AES.getEncryptedValue();
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

			var token = AES.getEncryptedValue();

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

		// SPRINT DROP DOWN LIST
		$scope.getsprintName = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/testCaseServices/sprintsList?dashboardName="
							+ dashboardName , config)
					.success(function(response) {
						$scope.sprints = response;
						$rootScope.multisprints = [];
						for (var i = 0; i < $scope.sprints.length; i++) {
							if (($scope.sprints[i] != "") 
									&& !($scope.sprints[i] == "Backlog")){
								$rootScope.multisprints.push({
									"label" : $scope.sprints[i]
								});
							}
						}
						
						/*
						$scope.selectsprints = [];
						for ( var pk in $scope.multisprints) {
							$scope.selectsprints.push($scope.multisprints[pk]);
						}

						$scope.selsprint = $scope.selectsprints;
						// $scope.selsprint = [];
						
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

						if ($rootScope.dtoDash == null || $rootScope.dtoDash == undefined
								|| $rootScope.dtoDash == "") {
							vardtto = "-";
						} else {
							vardtto = $rootScope.dtoDash;
						}

						$http.get(
								"./rest/testCaseServices/sprintsListSel?dashboardName="
										+ dashboardName + "&domainName=" + domainName
										+ "&projectName=" + projectName + "&dfromval=" + vardtfrom
										+ "&dtoval=" + vardtto, config).success(
								function(response) {
									$rootScope.userStorySprintSel = response;
									$scope.fnselectsprints = [];
									for ( var pk in $rootScope.userStorySprintSel) {
										$scope.fnselectsprints.push($rootScope.userStorySprintSel[pk]);
									}

									$scope.fnselsprint = $scope.fnselectsprints;
									$scope.selectsprints = [];
									for ( var pk in $scope.multisprints) {
										if($scope.fnselsprint.includes($scope.multisprints[pk].label)){
											$scope.selectsprints.push($scope.multisprints[pk]); 
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
			for (var i = 0; i < $scope.selsprint.length; i++) {
				$rootScope.sprintsel.push($scope.selsprint[i].label);
			}
			$scope.updateSprints();
		}

		$scope.updateSprints = function() {

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
					// alert('Failure');
				} else {
					//$scope.getepicName();
					
					$scope.getdefaultdate();
				}
			});
			
		};

		// EPIC DROP DOWN LIST

		$scope.getepicName = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/testCaseServices/epicsList?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$scope.epics = response;
						$scope.multiepics = [];
						for (var i = 0; i < $scope.epics.length; i++) {
							$scope.multiepics.push({
								"label" : $scope.epics[i]
							});
						}
						$scope.selectepics = [];
						for ( var pk in $scope.multiepics) {
							$scope.selectepics.push($scope.multiepics[pk]);
						}

						$scope.selepic = $scope.selectepics;
						onSelectionChangedepic();
						// $scope.selepic = [];
					});
		}

		// GET SELECTED FROM EPICS DROP DOWN LIST
		$scope.myEventListenersepic = {
			onSelectionChanged : onSelectionChangedepic,
		};

		function onSelectionChangedepic() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$rootScope.epicsel = [];
			for (var i = 0; i < $scope.selepic.length; i++) {
				$rootScope.epicsel.push($scope.selepic[i].label);
			}
			$scope.updateEpics();
		}

		$scope.updateEpics = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var varselectedepic = "";
			if ($rootScope.epicsel == null || $rootScope.epicsel == undefined
					|| $rootScope.epicsel == "") {
				varselectedepic = "-";
			} else {
				varselectedepic = $rootScope.epicsel;
			}

			var updateData = {
				dashboardName : dashboardName,
				owner : owner,
				epics : varselectedepic,
				headers : {
					'Authorization' : token
				}
			}

			$http({
				url : "./rest/levelItemServices/updateSelectedEpics",
				method : "POST",
				params : updateData,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 0) {
					// alert('Failure');
				} else {
					$scope.getdefaultdate();

				}
			});
		}

		// CALENDER DEFAULT VALUE
		$scope.getdefaultdate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/testCaseServices/getdefaultdate?dashboardName="
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

						$scope.dfromval = "" + month + "/" + date + "/"
								+ year;
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

						$scope.dtoval = "" + month + "/" + date + "/"
								+ year;
						$rootScope.jiradesignfilterfunction();
					});
		}
		
		// CALENDER DEFAULT VALUE
		$scope.getOnLoaddate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/testCaseServices/getOnLoaddate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.defaultdate = response;

						var date = new Date($scope.defaultdate[1]);
						var date1 = new Date($scope.defaultdate[0]);
						$rootScope.dtto = date;
						// date1.setDate(date.getDate() - 30);
						$rootScope.dtfrom = date1;

						var dfromval = $rootScope.dtfrom;
						var month = dfromval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dfromval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dfromval.getFullYear();

						$scope.dfromval = "" + month + "/" + date + "/"
								+ year;
						var dtoval = $rootScope.dtto;
						var month = dtoval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dtoval.getDate() + 1;
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/"
								+ year;
						$rootScope.jiradesignfilterfunction();
					});
		}


		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$scope.dfromval = dtfrom;
			$rootScope.jiradesignfilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$scope.dtoval = dtto;
			$rootScope.jiradesignfilterfunction();
		}

		$scope.scrollsettings = {
			scrollableHeight : '300px',
			scrollable : true,
		};

		// Function call for each dropdown change

		$rootScope.jiradesignfilterfunction = function() {

			$scope.initialtestcount();
			$scope.newStatusChart();
			/*
			 * $scope.noofdevelopmentstories(); $scope.autoCoverage();
			 * $scope.getmanualvsauto(); $scope.getStatusStacked();
			 */
			$scope.designPriorityChart();
			$scope.designOwnerChart();
		}

		// Total Test Count(BA Panel)

		$scope.initialtestcount = function() {

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
					"rest/testCaseServices/totalJiraTestCountinitial?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$rootScope.testCount = response;
			});

		};

		/* Total Stories count Ends Here */

		// Test case count
		$scope.initialtestcountdash = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/testCaseServices/totalTestCountinitialdash?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.testCountdash = response;
					});

		};

		// Design Count by Priority - BAR CHART
		$scope.designPriorityChart = function() {

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
					"rest/testCaseServices/designpriorchartdata?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				if ($scope.data != 0) {
					$scope.tcprioritychart($scope.data);
				} else {
					$('#designchart').remove();
					$('#designchartdiv').append('<canvas id="designchart">')
				}

			});

			$scope.tcprioritychart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].issuePriority == "") {
						$scope.result[i].issuePriority = "No Priority";
					}
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#designchart').remove();
				$('#designchartdiv').append('<canvas id="designchart">')
				var ctx = document.getElementById("designchart");

				var designchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B", "#55335e" ],
									borderColor : [ "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "#55335e" ],
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
											labelString : 'Test Count'
										},
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ],
									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Priority'
										},
										barThickness : 40,
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
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

		// Status pie chart
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
					"rest/testCaseServices/designjirastatuschartdata?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				$scope.tcstatuschart($scope.data);

			});

			$scope.tcstatuschart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].value == "") {
						$scope.result[i].testDesignStatus = "No Status";
					}
					$scope.labels1.push($scope.result[i].value);
					$scope.data1.push($scope.result[i].count);
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
							fontColor : 'white'
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
		
		// Design Count by Owner - BAR CHART
		$scope.designOwnerChart = function() {
			debugger;
			//alert("owner chart");
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
					"rest/testCaseServices/designownerchartdata?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$scope.data = response;
				if ($scope.data != 0) {
					$scope.tcownerchart($scope.data);
				} else {
					$('#designowner').remove();
					$('#designownerdiv').append('<canvas id="designowner">')
				}

			});

			$scope.tcownerchart = function(result) {
			
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].value == "") {
						$scope.result[i].value = "No Owner";
					}
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#designowner').remove();
				$('#designownerdiv').append('<canvas id="designowner">')
				var ctx = document.getElementById("designowner");

				var designchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B", "#55335e" ],
									borderColor : [ "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "#55335e" ],
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
											labelString : 'Test Count'
										},
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
										},
										gridLines : {
											color :  "#d8d3d3"
										}
									} ],
									xAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Priority'
										},
										barThickness : 40,
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
										},
										gridLines : {
											color :  "#d8d3d3"
										}
									} ]

								}
							}

						});
			};

		}
		
		$scope.jiraDesignTable = function(start_index){   
			//alert("table k undar");
			 var token  = AES.getEncryptedValue();
			   var config = {headers: {
			               'Authorization': token
			              }};

		$scope.index=start_index;
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
	  $http.get("./rest/testCaseServices/jiradesigntable?itemsPerPage="+$scope.itemsPerPage+"&start_index="+$scope.index+"&dashboardName="+dashboardName+
			  "&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto+"&timeperiod="+$rootScope.timeperiodTc,config).success(function (response) {
		   $rootScope.tcTableDetails = response;	   
		 }) ; 
		 
	}

	$scope.initialcountpaginate=function(){
		debugger;
		  var token  = AES.getEncryptedValue();
	    var config = {headers: {
	            'Authorization': token
	            }};
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
				  $http.get("rest/testCaseServices/tcJiraRecordsCount?dashboardName="+dashboardName+"&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto+"&timeperiod="+$rootScope.timeperiodTc,config).success(function (response) {	
					  $rootScope.testdatapaginate = response;  
				   }) ;}
	   
	// Sort function starts here
	$scope.sort = function(keyname,start_index){
		   $scope.sortBy = keyname;
		   $rootScope.sortkey= true;
	   	   $rootScope.searchkey= false;
		   $scope.index=start_index;
		   $scope.reverse = !$scope.reverse;
		   $scope.sortedtable($scope.sortBy,$scope.index,$scope.reverse);

	 };
	 
	 // Table on-load with sort implementation
	$scope.sortedtable =function(sortvalue,start_index,reverse)
	{paginationService.setCurrentPage("tcpaginate", start_index);
		   var token  = AES.getEncryptedValue();
		         var config = {headers: {
		                 'Authorization': token
		                 }};
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
	$scope.column=sortvalue;
	$scope.index=start_index;
	$scope.order=reverse;

	$http.get("rest/testCaseServices/jiratestcaseData?sortvalue="+$scope.column+"&itemsPerPage="+$scope.itemsPerPage+"&start_index="+$scope.index+"&reverse="+$scope.order+"&dashboardName="+dashboardName+"&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto,config).success(function (response) {
		   $rootScope.tcTableDetails = response;
			 }) ; 
	}

	  	  $scope.itemsPerPage = 5; 
	  	  
	  	  
	  	  // search
	  	$scope.search = function(start_index,searchField,searchText){ 
	  		$scope.start_index = start_index;
	  		$scope.searchField = searchField;
	  		$scope.searchText = searchText;
	  		$rootScope.sortkey= false;
	     	$rootScope.searchkey= true;
	     	$scope.key = false;
	     	
	     	if($scope.searchField == "issueID"){
				$rootScope.issueID = searchText;
				$scope.key = true;
				}
				else if($scope.searchField == "summary"){
					$rootScope.summary = searchText;
					$scope.key = true;
				}
				else if($scope.searchField == "issueDescription"){
					$rootScope.issueDescription = searchText;
					$scope.key = true;
				}
				else if($scope.searchField == "issueAssignee"){
					$rootScope.issueAssignee = searchText;
					$scope.key = true;
				}
				else if($scope.searchField == "issuePriority"){
					$rootScope.issuePriority = searchText;
					$scope.key = true;
				}
				else if($scope.searchField == "issueStatus"){
					$rootScope.issueStatus = searchText;
					$scope.key = true;
				}
	     	
	        $scope.searchable() ; 	
	      
	  	}
	  	
	  	$scope.searchable = function(start_index,searchField,searchText){
	  		 var token  = AES.getEncryptedValue();
	  	        var config = {headers: {
	  	                'Authorization': token
	  	                }};
	  	      if($rootScope.issueID == undefined){
			    	 $rootScope.issueID = 0;
			     } 
	  	      
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
			
	  		$http.get("./rest/testCaseServices/jirasearchpagecount?testID="+$rootScope.issueID+"&summary="+$rootScope.summary+"&issuePriority="+$rootScope.issuePriority+"&testDescription="+$rootScope.issueDescription+"&testDesigner="+$rootScope.issueAssignee+"&testDesignStatus="+$rootScope.issueStatus+"&dashboardName="+dashboardName+"&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto,config).success(function (response) {
	  			  $rootScope.testdatapaginate = response; 
	  		});
	  		paginationService.setCurrentPage("tcpaginate", start_index);
	  		$scope.itemsPerPage = 5;
	  	$http.get("./rest/testCaseServices/jirasearchTest?testID="+$rootScope.issueID+"&summary="+$rootScope.summary+"&issuePriority="+$rootScope.issuePriority+"&testDescription="+$rootScope.issueDescription+"&testDesigner="+$rootScope.issueAssignee+"&testDesignStatus="+$rootScope.testDesignStatus+"&itemsPerPage="+$scope.itemsPerPage+"&start_index="+$scope.start_index+"&dashboardName="+dashboardName+"&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto,config).success(function (response) {
	  		if(response == "" && $scope.key == false){
	  			$rootScope.searchkey= false;
	  			$scope.initialcountpaginate();
	  			$scope.jiraDesignTable(1);
	  		}  
	  		else{
	  			paginationService.setCurrentPage("tcpaginate", $scope.start_index);
	  			$rootScope.tcTableDetails = response; 
	  		}
	  	  }) ;
	  	}
	  	
	  	 //TC Lazy Load Table Code Starts Here 
	  	$scope.tcpageChangedLevel=function(pageno){
	  		
	  		$scope.pageno = pageno;
	  			   if( $scope.sortBy==undefined && $rootScope.sortkey == false && $rootScope.searchkey == false)
	  				 {
	  				   $scope.jiraDesignTable($scope.pageno) ; 
	  				 }else if ($rootScope.sortkey == true)
	  				 {
	  				$scope.sortedtable($scope.sortBy,$scope.pageno,$scope.reverse);
	  				 } 
	  				 else if($rootScope.searchkey == true){
	  				
	  						 $scope.search($scope.pageno,$scope.searchField,$scope.searchText);
	  					 }
	  			}


	}
})();
