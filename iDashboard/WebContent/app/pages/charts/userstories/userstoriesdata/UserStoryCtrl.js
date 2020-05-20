/**
 * @author 653731 created on 16.02.2018
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller('UserStoryCtrl',
			UserStoryCtrl).controller('RequirementsCtrl', RequirementsCtrl)
			.filter('trimDesc', function() {
				return function(value) {
					if (!angular.isString(value)) {
						return value;
					}
					return value.replace(/^\s+|\s+$/g, '');
				};
			});

	/** @ngInject */
	// function UserStoryCtrl($sessionStorage, paginationService,
	// $element,$state,
	// $scope, $base64, $http, $timeout, $uibModal, $rootScope, baConfig,
	// layoutPaths) {
	function UserStoryCtrl($sessionStorage, paginationService, UserService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths) {

		function getEncryptedValue() {

			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;

		var dashboardName = localStorageService.get('dashboardName');
		var domainName = localStorageService.get('domainName');
		var owner = localStorageService.get('owner');
		var projectName = localStorageService.get('projectName');

		// alert('before value.....'+ dashboardName + '---owner---' + owner);

		$scope.initProjectsList = function() {

			$scope.selectedName = projectName;

			/* setSelectedApplication($scope.selectedName); */
		}

		$scope.changeSelectedProjectHome = function(selectedProject) {

			$rootScope.prjName = selectedProject;
			// $scope.prjName = selectedProject;

		}

		$scope.changeSelectedProject = function(selectedProject) {
			// alert ("inside changeSelectedCookbook");
			$scope.selectedCookbook = selectedProject;
			$rootScope.cookbookname = selectedProject;

		}

		function setSelectedApplication(selectedCookbook) {

			$scope.selectedProjectName = $rootScope.prjName;

		}

		// //////////Hiding Iteration pannel when no project is selected///////
		// $('#iterationDetails').hide();
		// alert('hiding rallyDetails.... ');
		$('#rallyDetails').hide();

		// ////////// Total User Story Count on load///////////

		$rootScope.initialUserStorycount = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

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
					"rest/operationalDashboardJiraServices/userStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						
						$rootScope.userStoryData = response;

					});
		}

		$rootScope.initOpsUserStorycount = function() {

			// alert('calling initOpsUserStorycount....');

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/jiraMetricsServices/lifeuserStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName, config).success(function(response) {
				$rootScope.opsuserStoryData = response;
				// $scope.opsuserStoryData = response;

			});

		}

		// US-JIRA project details drop-down --> now removed
		/*
		 * $rootScope.initialProjects = function() {
		 * 
		 * //alert('calling initialProjects >>>>4444:::'); var token =
		 * getEncryptedValue(); var config = { headers : { 'Authorization' :
		 * token } }; //alert('calling initialProjects >>>>4444::: 2');
		 * $http.get( "rest/jiraMetricsServices/projectDetails?dashboardName=" +
		 * dashboardName,config).success( function(response) {
		 * $rootScope.projects = response;
		 * 
		 * }); //alert('calling initialProjects >>>>4444::: 3');
		 * 
		 * //$rootScope.projects = ["Taxi4U", "DevOps", "Sample Project"]; }
		 */

		/*
		 * $rootScope.selectedPrjectForIterationsList = function(project) {
		 * 
		 * //alert('calling selectedPrjectForIterationsList......'); //alert('on
		 * load calling selectedPrjectForIterationsList.....' + project);
		 * 
		 * var token = getEncryptedValue(); var config = { headers : {
		 * 'Authorization' : token } }; $http.get(
		 * "rest/rallyServices/iterationDetailsList?dashboardName=" +
		 * dashboardName+"&userStrproject="+project, config).success(
		 * function(response) { $rootScope.iterationsList = response;
		 * 
		 * }); }
		 * 
		 */

		$rootScope.selectedPrjectForIterations = function(project, iteration) {

			// alert('calling ....selectedPrjectForIterations' + project );
			// alert('calling ....selectedPrjectForIterations' + iteration );
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/rallyServices/iterationDetails?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ project + "&userStrIter=" + iteration, config)
					.success(function(response) {
						$rootScope.iterationDetails = response;

					});

		}

		$rootScope.iterationStoryCount = function(project, iteration) {

			// alert('calling ....iterationStoryCount >>>>> ' + project );
			// alert('calling .... + strProject );

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/iterationStoryCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + project + "&userStrIter="
							+ iteration, config).success(function(response) {
				$rootScope.iterationStoryCt = response;

			});

		}

		// ////////////////////Current Iteration Details
		// ///////////////////////////////////////////

		$rootScope.CurrentIerationDetails = function() {

			// alert('2:');

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			// alert('Current Iteration details.....');

			// $scope.newOwnerCountChart(project);

		}

		// ////////////////////////////////////////////////////////////////////////////////

		// //////////Total User Story in backlog Count/////////////////////

		$rootScope.initUserStoryBackLogCount = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/userStoryBackLogCount?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$rootScope.userStoryBackLogData = response;

					});
		}

		// //////// Total User Stories in Iteration backog
		// JIRA///////////////////////

		$rootScope.initIterationUserStoryBackLogCount = function() {

			// alert("calling..initIterationUserStoryBackLogCount ");
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/jiraMetricsServices/initIterationUserStoryBackLogCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$rootScope.userStoryIterBackLogData = response;

					});
		}

		// //////////////////////////////////////////////////////////////////////////

		// /////////////User Story By Priority Funnel Chart
		// JIRA/////////////////////////////////////////////////////////////

		$rootScope.userStoryPrioirtyFunnelChart = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/jiraMetricsServices/userStorypriorityFunnelchartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&userStrproject="
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
													' <canvas id="my-funnel" width="220px" height="250" style="margin-top:5%;margin-left:20%"> </canvas>');
								}
							});

			$scope.funnel = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.backgroundColor = [];
				$scope.borderColor = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].storyStatus == "") {
						$scope.result[i].storyStatus = "No Status";
					}

					if ($scope.result[i].storyStatus == "Defined") {
						$scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
						$scope.borderColor.push("rgba(54, 162, 235, 1)");
					}
					if ($scope.result[i].storyStatus == "In-Progress") {
						$scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
						$scope.borderColor.push("rgba(75, 192, 192, 1)");
					}
					if ($scope.result[i].storyStatus == "Completed") {
						$scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
						$scope.borderColor.push("rgba(153, 102, 255, 1)");
					}

					$scope.labels1.push($scope.result[i].storyStatus);
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

		// //////////////////////////////////////////////////////////////////////////////////////////////////////

		// /////////// User Story Test cases count////////////////////

		$rootScope.initUserStoryTestCount = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryTestCount?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$scope.testCasesData = response;
						// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
					});
		}

		// //////////////////// User Story Sprint
		// count/////////////////////////////
		$rootScope.initUserStorySprintCount = function() {
			
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

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
					"./rest/operationalDashboardJiraServices/userStorySprintCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						// $scope.userStorySprintData = response;
						$rootScope.userStorySprintData = response;
						// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
					});
		}

		// ////////////////////User Story Sprint count for Ops
		// JIRA/////////////////////////////
		$rootScope.initOpsUserStorySprintCount = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/jiraMetricsServices/lifeuserStorySprintCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName, config).success(function(response) {

				// $scope.opsuserStorySprintData = response;
				$rootScope.opsuserStorySprintData = response;
				// $rootScope.lifeuserStorySprintData = response;
				// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
			});

		}

		// ////////////////// User Story Defect count
		// JIRA/////////////////////////////////
		$scope.initUserStoryDefectCount = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/jiraMetricsServices/userStoryDefectCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$rootScope.defectdata = response;
					});

		}

		// /////////////////////////User Story Trend Chart
		// //////////////////////////////////////

		$scope.userStoryTrendChart = function() {
			
			// alert('calling userStoryTrendChart....from main...1111');

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/jiraMetricsServices/userstorytrendchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$scope.data = response;
						$scope.linechart($scope.data);
					});

			$scope.linechart = function(lineresult) {

				// alert('calling ...user ctrl linechart.....4444:::4444
				// :::4444');

				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.defined = [];
				$scope.completed = [];
				$scope.inprogress = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].mydate);

					$scope.defined.push($scope.lineresult[i].defined);
					$scope.completed.push($scope.lineresult[i].completed);
					$scope.inprogress.push($scope.lineresult[i].inprogress);
				}
				$scope.data = [ $scope.defined, $scope.completed,
						$scope.inprogress ];

				// $scope.data=[$scope.defined];

				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						pointStyle : "line",
						datasets : [ {
							data : $scope.nostatus,
							label : "No status",
							pointStyle : "line",
							borderColor : "rgba(67, 154, 213, 0.7)",
							pointBackgroundColor : "rgba(67, 154, 213, 0.7)",
						}, {
							data : $scope.defined,
							label : "Defined",
							pointStyle : "line",
							borderColor : "rgba(255, 113, 189, 1)",
							pointBackgroundColor : "rgba(255, 113, 189, 1)",
						}, {
							data : $scope.inprogress,
							label : "In-Progress",
							pointStyle : "line",
							borderColor : "rgba(236, 255, 0, 1)",
							pointBackgroundColor : "rgba(236, 255, 0, 1)",
						}, {
							data : $scope.completed,
							label : "Completed",
							pointStyle : "line",
							borderColor : "rgba(9, 191, 22, 1)",
							pointBackgroundColor : "rgba(9, 191, 22, 1)",
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
									labelString : 'Time Period'
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'No. of User Stories'
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									beginAtZero : true
								}
							} ]

						},
						legend : {
							display : true,
							position : 'right',
							labels : {
								fontColor : '#ffffff',
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
				$('#linediv').append('<canvas id="line"> </canvas>');
				var ctx = document.getElementById("line");
				window.line = new Chart(ctx, config);

			}

		}

		// //////////////////////////////////////////////////////////////////////////////////////

		// ///////////////////User Story By Defect Bar Chart
		// JIRA////////////////////////////////////

		$scope.userStoryDefChart = function() {

			// alert('calling userStoryDefChart......4444:::');

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/jiraMetricsServices/userstorydefchartdata?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&userStrproject="
									+ projectName, config)
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
					$scope.labels1.push($scope.result[i].storyID);
					$scope.data1.push($scope.result[i].typecount);
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
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B" ],
									borderColor : [ "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
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
											beginAtZero : true
										},
										scaleLabel : {
											display : true,
											labelString : 'Defect Count'
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ],

									xAxes : [ {
										barThickness : 40,
										scaleLabel : {
											display : true,
											labelString : 'User Story'
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

		// ////////////////////////////////////////////////////////////////////////////

		// ///////////////////User Story By Owner Bar Graph
		// /////////////////////

		// Design Count by Owner - BAR CHART
		$scope.newOwnerCountChart = function(project) {
			
			// alert("Function called");
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/jiraMetricsServices/userstoryownerchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$scope.data = response;
						// alert($scope.data);
						$scope.tcownerchart($scope.data);

					});

			$scope.tcownerchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].storyOwner == ""
							|| $scope.result[i].storyOwner == null) {
						$scope.result[i].storyOwner = "No Owner";
					}

					$scope.labels1.push($scope.result[i].storyOwner);
					$scope.data1.push($scope.result[i].ownercount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#ownerchart').remove();
				$('#ownerchartdiv').append('<canvas id="ownerchart"></canvas>')
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
											beginAtZero : true
										},
										scaleLabel : {
											display : true,
											labelString : 'No. of User Stories'
										},
										gridLines : {
											color : "rgba(255,255,255,0.2)"
										}
									} ],
									xAxes : [ {
										barThickness : 40,
										scaleLabel : {
											display : true,
											labelString : 'Owner'
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

		// ////////////////////////////////////////////////////////////////////////

		// //////////User Story By Project pie chart/////////////////////

		$scope.newTypeChart = function(project) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/jiraMetricsServices/userstorybyprjchartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$scope.data = response;
						$scope.tctypechart($scope.data);
					});

			$scope.tctypechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].prjName); // use
					// prjName
					// or
					// levelId
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#donutChart2').remove();
				$('#donutChartdiv2').append(
						'<canvas id="donutChart2"></canvas>');
				var ctx = document.getElementById("donutChart2");
				var donutChart = new Chart(ctx, {
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
							position : 'right',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						}
					}

				});
			};

		};

		// ///////////////////////////////////////////////////////////////

		// /////////////////////////User Story By Status Pie
		// Chart/////////////////////////////////

		$scope.userStoryByStatusPieChart = function() {
			
			// alert('calling userStoryByStatusPieChart');
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/jiraMetricsServices/userstorybystatuschartdata?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&userStrproject=" + projectName, config)
					.success(function(response) {
						$scope.data = response;
						$scope.statustypechart($scope.data);
					});

			$scope.statustypechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].iteration == ""
							|| $scope.result[i].iteration == null) {
						$scope.result[i].iteration = "Backlog";
					}
					$scope.labels1.push($scope.result[i].iteration);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#donutChart1').remove();
				$('#donutChartdiv1').append(
						'<canvas id="donutChart1"></canvas>');
				var ctx = document.getElementById("donutChart1");
				var donutChart = new Chart(ctx, {
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

									"rgba(255, 206, 86, 0.8)",
									"rgba(25, 245, 91, 0.85)",
									"rgba(245, 25, 117, 0.85)",
									"rgba(254, 206, 62, 0.97)",
									"rgba(11, 173, 254, 0.97)",
									"rgba(23, 253, 195, 0.82)", "#835C3B" ],
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
							position : 'right',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						}
					}

				});
			};

		};
		// ///////////////////////////////////////////////////////////////////////////////////////////////////

		// JIRA
		$scope.initialUserStorycountpaginate = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/jiraMetricsServices/userStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName, config).success(function(response) {
				$rootScope.reqdatapaginate = response;
			});
		}

		// ///////////////////////// Table on-load for user story test case
		// data////////////////////////
		$scope.userStoryTableData = function(start_index) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;

			$http.get(
					"./rest/jiraMetricsServices/userStoryTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName, config).success(function(response) {
				$rootScope.userStoryTableDataDetails = response;
			});
			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.index);
		};

		// /////////////////////// Table on-load for user story Defect
		// data////////////////////////
		$scope.userStoryDefectTableData = function(start_index) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;

			$http.get(
					"./rest/rallyServices/userStoryDefectTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName,
					config).success(function(response) {
				$rootScope.userStoryDefectTableDetails = response;
			});

			paginationService.setCurrentPage("userStoryDefectdatapaginate",
					$scope.index);
		};

		// //////////////////////////// User Story Search
		// ///////////////////////////////////////////////
		$scope.search = function(start_index, searchField, searchText) {

			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "storyID") {
				$rootScope.storyID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyName") {
				$rootScope.storyName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "userStrdescription") {
				$rootScope.userStrdescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyOwner") {
				$rootScope.storyOwner = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "projectNamee") {
				$rootScope.projectNamee = searchText;
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

			$http.get(
					"./rest/jiraMetricsServices/userStorySearchpagecount?storyName="
							+ $rootScope.storyName + "&storyID="
							+ $rootScope.storyID + "&userStrdescription="
							+ $rootScope.userStrdescription + "&storyOwner="
							+ $rootScope.storyOwner + "&projectName="
							+ $rootScope.projectNamee + "&dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$rootScope.reqdatapaginate = response;
					});

			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;

			$http
					.get(
							"./rest/jiraMetricsServices/searchUserStory?storyName="
									+ $rootScope.storyName + "&storyID="
									+ $rootScope.storyID
									+ "&userStrdescription="
									+ $rootScope.userStrdescription
									+ "&storyOwner=" + $rootScope.storyOwner
									+ "&projectName=" + $rootScope.projectNamee
									+ "&itemsPerPage=" + $scope.itemsPerPage
									+ "&start_index=" + $scope.start_index
									+ "&dashboardName=" + dashboardName
									+ "&owner=" + owner, config)
					.success(
							function(response) {

								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialUserStorycountpaginate();
									$scope.userStoryTableData(1);
								} else {
									paginationService.setCurrentPage(
											"userStorydatapaginate",
											$scope.start_index);
									$rootScope.userStoryTableDataDetails = response;
								}
							});

		}

		$scope.userStoryTestpageChangedLevel = function(pageno) {

			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {

				$scope.userStoryTestCaseTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryTestCaseTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.searchTestCase($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		$scope.userStorypageChangedLevel = function(pageno) {
			$scope.pageno = pageno;

			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {
				$scope.userStoryTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		$scope.userStoryDefectpageChangedLevel = function(pageno) {

			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {

				$scope.userStoryDefectTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryDefectTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.searchDefect($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		// //////////// Sort function starts
		// here////////////////////////////////////
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
			$http.get(
					"./rest/jiraMetricsServices/requirementsData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName + "&owner="
							+ owner, config).success(function(response) {
				$rootScope.reqTableDetails = response;
			});
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
		$scope.downloadUSTableData = function(start_index) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var index = start_index;
			var itemsPerPage = 0;

			$http.get(
					"./rest/jiraMetricsServices/userStoryTableDetails?&itemsPerPage="
							+ itemsPerPage + "&start_index=" + index
							+ "&dashboardName=" + dashboardName
							+ "&domainName=" + domainName + "&userStrproject="
							+ projectName, config).success(function(response) {
				$scope.reqTableDetailsDownload = response;
			});
			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.index);
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
				//console.log(csvString);
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