/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.defects').controller(
			'defectsJiraCtrl', defectsJiraCtrl);

	/** @ngInject */
	function defectsJiraCtrl($sessionStorage, paginationService,
			localStorageService, $element, $scope, $base64, AES, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths) {

		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
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
					"./rest/jiraMetricsServices/projectlevellist?dashboardName="
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

		// SPRINT DROP DOWN LIST
		$scope.getsprintName = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/defectServices/sprintsList?dashboardName="
							+ dashboardName + "&owner=" + owner,
					config).success(function(response) {
				$scope.sprints = response;
				$scope.multisprints = [];
				for (var i = 0; i < $scope.sprints.length; i++) {
					if ($scope.sprints[i] != "") {
						$scope.multisprints.push({
							"label" : $scope.sprints[i]
						});
					}
				}
				/*$scope.selectsprints = [];
				for ( var pk in $scope.multisprints) {
					$scope.selectsprints.push($scope.multisprints[pk]);
				}

				$scope.selsprint = $scope.selectsprints;
				// $scope.selsprint = [];
				onSelectionChangedsprint();
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
						"./rest/requirementServices/sprintsListSel?dashboardName="
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
					$scope.getdefaultdate();
					//$scope.getepicName();
					//$rootScope.defectfilterfunction();
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
					"./rest/defectServices/epicsList?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
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
				epics : varselectedepic
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
		// CALENDER DEFAULT VALUE
		$scope.getdefaultdate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/defectServices/getdefaultdate?dashboardName="
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
						var date = dtoval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/" + year;

						$rootScope.defectfilterfunction();
					});
		}
		
		// CALENDER ON LOAD VALUE
		$scope.getOnLoaddate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/defectServices/getOnLoaddate?dashboardName="
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

						$scope.dfromval = "" + month + "/" + date + "/" + year;

						var dtoval = $rootScope.dtto;
						var month = dtoval.getMonth() + 1;
						if (month < 10) {
							month = '0' + month;
						}
						var date = dtoval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/" + year;

						$rootScope.defectfilterfunction();
					});
		}

		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$scope.dfromval = dtfrom;
			$rootScope.defectfilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$scope.dtoval = dtto;
			$rootScope.defectfilterfunction();
		}

		$scope.scrollsettings = {
			scrollableHeight : '300px',
			scrollable : true,
		};

		// Function call for each dropdown change

		$rootScope.defectfilterfunction = function() {
			$scope.defclosedcount();
			$scope.reopencount();
			$scope.defectpassfailTrend();
			$scope.defectLoggedTrend();
			$scope.newOwnerChart();
			$scope.defReportedChart();
			$scope.prioritybarChart();
			$scope.defStatusChart();
			$scope.openstatusbarChart();
			$scope.openstatusbyversion();
			$scope.defectOpenPriorityPie();
		}

		// Closed Defect Count
		$scope.defclosedcount = function() {

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
					"rest/jiraMetricsServices/defclosedcount?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$rootScope.defcloseddata = response;
			});

		}

		// Re-Open Defect Count - BA Panel
		$scope.reopencount = function() {

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
					"rest/jiraMetricsServices/reopenCount?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(function(response) {
				$rootScope.defreopendata = response;
			});

		}

		// Defect Pass Fail Trend Chart

		$scope.defectpassfailTrend = function() {

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
							"rest/jiraMetricsServices/passfailtrendchart?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.defectlinechart($scope.data);
								} else {
									$('#defectline').remove();
									$('#defectdiv')
											.append(
													'<canvas id="defectline" height="100%"> </canvas>');
								}
							});
			$scope.defectlinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.openDefects = [];
				$scope.closedDefects = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.openDefects.push($scope.lineresult[i].open);
					$scope.closedDefects.push($scope.lineresult[i].closed);

				}
				$scope.data = [ $scope.openDefects, $scope.closedDefects ];
				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.openDefects,
							label : "Open Defects",
							backgroundColor : "#DB2117",
							borderColor : "#DB2117",
							fill : false
						}, {
							data : $scope.closedDefects,
							label : "Closed Defects",
							backgroundColor : "#32CD32",
							borderColor : "#32CD32",
							fill : false
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor: '#4c4c4c'
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
									unit : "week"
								},
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									beginAtZero : true,
									fontColor: '#4c4c4c'
								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Bugs Count',
									fontColor: '#4c4c4c'
								},
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									beginAtZero : true,
									fontColor: '#4c4c4c'
								}
							} ]

						},
						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#4c4c4c',
								boxWidth : 20,
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
				$('#defectline').remove(); // this is my <canvas> element
				$('#defectdiv').append(
						'<canvas id="defectline" height="100%"> </canvas>');

				var ctx = document.getElementById("defectline");
				window.defectline = new Chart(ctx, config);

			}
		}

		// Defect Logged Trend Chart

		$scope.defectLoggedTrend = function() {

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
							"rest/defectServices/defectLoggedTrendchart?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.totdefectlinechart($scope.data);
								} else {
									$('#totdefectline').remove();
									$('#totdefectdiv')
											.append(
													'<canvas id="totdefectline" height="100%"> </canvas>');
								}
							});

			$scope.totdefectlinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.totDefects = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.totDefects.push($scope.lineresult[i].totalcount);

				}

				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.totDefects,
							label : "Total Count",
							borderColor : "#257312",
							backgroundColor : "#257312",
							fill : false
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
									unit : "week"
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ],
							yAxes : [ {
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									beginAtZero : true
								}
							} ]

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
				$('#totdefectline').remove(); // this is my <canvas> element
				$('#totdefectdiv').append(
						'<canvas id="totdefectline" height="100%"> </canvas>');

				var ctx = document.getElementById("totdefectline");
				window.totdefectline = new Chart(ctx, config);

			}
		}

		// Assigned To Bar Chart

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

			$http
					.get(
							"rest/defectServices/defectOwnerChartData?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.ownerchart($scope.data);
								} else {
									$('#defectowner').remove();
									$('#ownerdiv')
											.append(
													'<canvas id="defectowner" height="100%"></canvas>');
								}
							});

			$scope.ownerchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.bgcolor = [];

				// Generate random colors for charts
				$scope.colors = [ "rgba(54, 162, 235, 0.8)",
						"rgba(153, 102, 255, 0.8)", "rgba(75, 192, 192, 0.8)",
						"rgba(255, 159, 64, 0.8)", "rgba(255, 99, 132, 0.8)",
						"#429bf4", "rgba(54, 162, 235, 0.8)",
						"rgba(153, 102, 255, 0.8)", "rgba(75, 192, 192, 0.8)",
						"rgba(255, 159, 64, 0.8)", "rgba(255, 99, 132, 0.8)",
						"#429bf4", "#723f4e", "rgba(255, 206, 86, 0.8)",
						"#835C3B" ];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
						$scope.getRandomValueBetween = function(from, to) {
							return Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] * (to - from + 1)
									+ from);
						};

						$scope.bgcolor
								.push($scope.colors[$scope
										.getRandomValueBetween(0,
												$scope.bgcolor.length)]);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defectowner').remove(); // this is my <canvas> element
				$('#ownerdiv').append(
						'<canvas id="defectowner" height="100%"></canvas>');

				var ctx = document.getElementById("defectowner");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
									data : $scope.datapie,
									backgroundColor : $scope.bgcolor,
									borderWidth : 1,

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
								tooltipEvents : [],
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

		// Reported To Bar Chart

		$scope.defReportedChart = function() {

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
							"rest/defectServices/defectReportChartData?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.reportchart($scope.data);
								} else {
									$('#reportby').remove();
									$('#reportbydiv')
											.append(
													'<canvas id="reportby" height="100%"></canvas>');
								}
							});

			$scope.reportchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#reportby').remove(); // this is my <canvas> element
				$('#reportbydiv').append(
						'<canvas id="reportby" height="100%"></canvas>');

				var ctx = document.getElementById("reportby");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
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
											"#835C3B", "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "rgba(54, 162, 235, 1)",
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
								tooltipEvents : [],
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

		// Priority Bar Chart

		$scope.prioritybarChart = function() {

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
							"rest/defectServices/defectsPriorityBarchart?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.prioritybarchart($scope.data);
								} else {
									$('#defectprioritybar').remove();
									$('#prioritybardiv')
											.append(
													'<canvas id="defectprioritybar" height="100%"');
								}
							});

			$scope.prioritybarchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defectprioritybar').remove(); // this is my <canvas>
				// element
				$('#prioritybardiv')
						.append(
								'<canvas id="defectprioritybar" height="100%"></canvas>');

				var ctx = document.getElementById("defectprioritybar");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
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
								tooltipEvents : [],
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

		// Defect status Chart

		$scope.defStatusChart = function() {

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
							"rest/jiraMetricsServices/defectStatusChart?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {

									$scope.statuspiechart($scope.data);
									$scope.statusbarchart($scope.data);
								} else {
									$('#defrejectchart').remove();
									$('#defrejectdiv')
											.append(
													'<canvas id="defrejectchart"></canvas>');

									$('#defstatuspiediv').remove(); // this is
									// my
									// <canvas>
									// element
									$('#defstatuspie')
											.append(
													'<canvas id="defstatuspiediv"  height="100%"></canvas>');

								}
							});

			$scope.statusbarchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defrejectchart').remove(); // this is my <canvas> element
				$('#defrejectdiv').append(
						'<canvas id="defrejectchart"></canvas>');

				var ctx = document.getElementById("defrejectchart");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
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
								tooltipEvents : [],
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
										},
										gridLines : {
											color : "#4c4c4c"
										}
									} ],
									xAxes : [ {
										barThickness : 40,
										ticks : {
											beginAtZero : true,
											fontColor: '#4c4c4c'
										},
										gridLines : {
											color : "#4c4c4c"
										}
									} ]

								}
							}

						});
			};

			$scope.statuspiechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defstatuspiediv').remove(); // this is my <canvas> element
				$('#defstatuspie').append(
						'<canvas id="defstatuspiediv" height="100%"></canvas>');

				var ctx = document.getElementById("defstatuspiediv");
				var defectowner = new Chart(ctx, {
					type : 'pie',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							label : "Defects",
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderWidth : 1,

						} ]
					},

					options : {
						responsive : true,
						maintainAspectRatio : false,
						tooltips : {
							enabled : true
						},
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
						},
						tooltipEvents : [],

					}

				});
			};
		}

		// Defect open status Chart

		$scope.openstatusbarChart = function() {

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
					"rest/defectServices/defectsOpenStatusBarchart?dashboardName="
							+ dashboardName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&domainName="
							+ domainName + "&projectName=" + projectName,
					config).success(
					function(response) {
						$scope.data = response;
						if ($scope.data.length != 0) {
							$scope.statuscategorybarchart($scope.data);
						} else {
							$('#defopenstatusbar').remove(); // this
							// is my
							// <canvas>
							// element
							$('#defopenstatusbardiv').append(
									'<canvas id="defopenstatusbar"></canvas>');
						}
					});

			$scope.statuscategorybarchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defopenstatusbar').remove(); // this is my <canvas>
				// element
				$('#defopenstatusbardiv').append(
						'<canvas id="defopenstatusbar"></canvas>');

				var ctx = document.getElementById("defopenstatusbar");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
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
								tooltipEvents : [],
								scales : {
									yAxes : [ {
										scaleLabel : {
											display : true,
											labelString : 'Open Bugs Count'
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

		// Defect open Priority Pie Chart

		$scope.defectOpenPriorityPie = function() {

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
							"rest/jiraMetricsServices/defectsOpenStatusPriority?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.prioritystatuspiechart($scope.data);
								} else {
									$('#defopenstatuspie').remove();
									$('#defopenstatuspiediv')
											.append(
													'<canvas id="defopenstatuspie" height="100%">');

								}
							});

			$scope.prioritystatuspiechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#defopenstatuspiediv').remove(); // this is my <canvas>
				// element
				$('#defopenstatuspie').append(
						'<canvas id="defopenstatuspiediv" height="100%">');

				var ctx = document.getElementById("defopenstatuspiediv");
				var defectowner = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							label : "Defects",
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B", "rgba(54, 162, 235, 1)",
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
						tooltips : {
							enabled : true
						},
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
						},
						tooltipEvents : [],

					}

				});
			};

		}

		// Defect open status by Version

		$scope.openstatusbyversion = function() {

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
							"rest/defectServices/defectsOpenStatusByVersion?dashboardName="
									+ dashboardName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&domainName="
									+ domainName + "&projectName="
									+ projectName, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope
											.statusopenstatusbyversionchart($scope.data);
								} else {
									$('#defopenstatusbyversion').remove();
									$('#defopenstatusbyversiondiv')
											.append(
													'<canvas id="defopenstatusbyversion" width=900 height=200 style="margin-top:10px; margin-left:10px;width: 900px;height: 200px;"></canvas>');
								}
							});

			$scope.statusopenstatusbyversionchart = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].count != 0) {
						$scope.labels1.push($scope.result[i].value);
						$scope.data1.push($scope.result[i].count);
					}
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#defopenstatusbyversion').remove(); // this is my <canvas>
				// element
				$('#defopenstatusbyversiondiv')
						.append(
								'<canvas id="defopenstatusbyversion" width=900 height=200 style="margin-top:10px; margin-left:10px;width: 900px;height: 200px;"></canvas>');

				var ctx = document.getElementById("defopenstatusbyversion");
				var defectowner = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									label : "Defects",
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B",
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
								tooltipEvents : [],
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

		// Defect open status by Version

		// DEFECT TABLE DETAILS STARTS HERE //

		// Defect open Priority Pie Chart

		$scope.defectTableData = function() {

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
			var varselectedepic = "";

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

			if ($rootScope.projsel == null || $rootScope.projsel == undefined
					|| $rootScope.projsel == "") {
				varselectedproject = "-";
			} else {
				varselectedproject = $rootScope.projsel;
			}
			if ($rootScope.sprintsel == null
					|| $rootScope.sprintsel == undefined
					|| $rootScope.sprintsel == "") {
				varselectedsprint = "-";
			} else {
				varselectedsprint = $rootScope.sprintsel;
			}
			if ($rootScope.epicsel == null || $rootScope.epicsel == undefined
					|| $rootScope.epicsel == "") {
				varselectedepic = "-";
			} else {
				varselectedepic = $rootScope.epicsel;
			}

			$http
					.get(
							"rest/defectServices/defectTableDetails?dashboardName="
									+ dashboardName + "&owner=" + owner
									+ "&selectedproject=" + varselectedproject
									+ "&selectedsprint=" + varselectedsprint
									+ "&selectedepic=" + varselectedepic
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto, config).success(
							function(response) {
								$scope.data = response;

							});
		}

		/* Landing Page BA Panel Code Starts Here */
		// Total Defect Count - Landing Page
		$scope.totDefCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/defectServices/totalDefCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.defectCount = response;
					});
		};

		// Defect Open Rate - Landing Page
		$rootScope.defectopenrate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/defectServices/defectOpenRate?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {
								$scope.defOpenRate = response;
								$scope.loadPieCharts('#defopenrate',
										$scope.defOpenRate);
							});
		}
		// Pie Chart with Small ba-panel
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
								return (chartcount < 75 ? '#5cb85c'
										: chartcount < 25 ? '#f0ad4e'
												: '#cb3935');
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
		/* Lading Page BA Panel Code Ends Here */

	}
})();
