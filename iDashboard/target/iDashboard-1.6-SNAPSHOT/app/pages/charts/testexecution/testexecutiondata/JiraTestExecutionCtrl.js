(function() {
	'use strict';

	angular.module('MetricsPortal.pages.charts.testexecution').controller(
			'JiraTestExecutionCtrl', JiraTestExecutionCtrl);

	/** @ngInject */
	function JiraTestExecutionCtrl($element, AES, paginationService, UserService,
			localStorageService, $scope, $base64, $http, $timeout, $uibModal,
			$rootScope, baConfig, layoutPaths, $sessionStorage) {
		
		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;
		$rootScope.timeperiodReq = localStorageService.get('timeperiod');
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');

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
		// VERSION DROP DOWN LIST
		$scope.getversionName = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/jiraMetricsServices/versionsList?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.versions = response;
						$scope.multiversions = [];
						for (var i = 0; i < $scope.versions.length; i++) {
							$scope.multiversions.push({
								"label" : $scope.versions[i]
							});
						}
						
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
								"./rest/jiraMetricsServices/versionsListSel?dashboardName="
										+ dashboardName + "&domainName=" + domainName
										+ "&projectName=" + projectName + "&dfromval=" + vardtfrom
										+ "&dtoval=" + vardtto, config).success(
								function(response) {
									$rootScope.versionSelList = response;
									$scope.fnselectVersions = [];
									for ( var pk in $rootScope.versionSelList) {
										$scope.fnselectVersions.push($rootScope.versionSelList[pk]);
									}

									$scope.fnselVer = $scope.fnselectVersions;
									$scope.selectversions = [];
									for ( var pk in $scope.multiversions) {
										if($scope.fnselVer.includes($scope.multiversions[pk].label)){
											$scope.selectversions.push($scope.multiversions[pk]); 
										}
									}
									$scope.selversion = $scope.selectversions;
									onSelectionChangedversion();
									
								});
						
						/*
						$scope.selectversions = [];
						for ( var pk in $scope.multiversions) {
							$scope.selectversions
									.push($scope.multiversions[pk]);
						}

						$scope.selversion = $scope.selectversions;
						// $scope.selversion = [];
						onSelectionChangedversion();
						*/
					});
		};

		// GET SELECTED FROM VERSION DROP DOWN LIST
		$scope.myEventListenersversion = {
			onSelectionChanged : onSelectionChangedversion,
		};

		function onSelectionChangedversion() {
			document.getElementById('ver').style.pointerEvents = 'none';
			document.getElementById('cyc').style.pointerEvents = 'none';
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$rootScope.versionsel = [];
			for (var i = 0; i < $scope.selversion.length; i++) {
				$rootScope.versionsel.push($scope.selversion[i].label);
			}
			$scope.updateVersions();

			setTimeout(function() {
				document.getElementById('ver').style.pointerEvents = 'auto';
				document.getElementById('cyc').style.pointerEvents = 'auto';
			}, 1000);

		}

		$scope.updateVersions = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var varselectedversion = "";
			if ($rootScope.versionsel == null
					|| $rootScope.versionsel == undefined
					|| $rootScope.versionsel == "") {
				varselectedversion = "-";
			} else {
				varselectedversion = $rootScope.versionsel;
			}

			var updateData = {
				dashboardName : dashboardName,
				owner : owner,
				versions : varselectedversion
			}

			$http({
				url : "./rest/levelItemServices/updateSelectedVersions",
				method : "POST",
				params : updateData,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 0) {
					// alert('Failure');
				} else {
					$scope.getcycleName();
					$scope.getdefaultdate();
					//$scope.exefilterfunction();
				}
			});
			
		};

		// CYCLE DROP DOWN LIST
		$scope.getcycleName = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/jiraMetricsServices/cycleList?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.cycles = response;
						$scope.multicycles = [];
						for (var i = 0; i < $scope.cycles.length; i++) {
							$scope.multicycles.push({
								"label" : $scope.cycles[i]
							});
						}
						
						$scope.selectcycles = [];
						for ( var i=0;i< $scope.multicycles.length;i++) {
							$scope.selectcycles.push($scope.multicycles[i]);
						}

						$scope.selcycle = $scope.selectcycles;
						onSelectionChangedcycle();
						// $scope.selcycle = [];
					});
		}

		// GET SELECTED FROM CYCLE DROP DOWN LIST
		$scope.myEventListenerscycle = {
			onSelectionChanged : onSelectionChangedcycle,
		};

		function onSelectionChangedcycle() {

			document.getElementById('ver').style.pointerEvents = 'none';
			document.getElementById('cyc').style.pointerEvents = 'none';

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$rootScope.cyclesel = [];
			for (var i = 0; i < $scope.selcycle.length; i++) {
				$rootScope.cyclesel.push($scope.selcycle[i].label);
			}

			$scope.updateCycles();
			setTimeout(function() {
				document.getElementById('ver').style.pointerEvents = 'auto';
				document.getElementById('cyc').style.pointerEvents = 'auto';
			}, 2000);

		}

		$scope.updateCycles = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var varselectedcycle = "";

			if ($rootScope.cyclesel == null || $rootScope.cyclesel == undefined
					|| $rootScope.cyclesel == "") {
				varselectedcycle = "-";
			} else {
				varselectedcycle = $rootScope.cyclesel;
			}

			var updateData = {
				dashboardName : dashboardName,
				owner : owner,
				cycles : varselectedcycle
			}

			$http({
				url : "./rest/levelItemServices/updateSelectedCycles",
				method : "POST",
				params : updateData,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 0) {
					// alert('Failure');
					$scope.getRollingPeriod
				} else {

					
					var token = AES.getEncryptedValue();
					var config = {
						headers : {
							'Authorization' : token
						}
					};

					$http.get(
							"rest/jiraMetricsServices/getdefaultdate?dashboardName="
									+ dashboardName + "&domainName=" + domainName
									+ "&projectName=" + projectName, config).success(
							function(response) {
								$scope.defaultdate = response;
								var date = new Date($scope.defaultdate[1]);
								var date1 = new Date($scope.defaultdate[0]);
								$scope.dtto = date;
								// date1.setDate(date.getDate() - 30);
								$scope.dtfrom = date1;
								
								$scope.convertDateToStringVal($scope.dtfrom,$scope.dtto);
								
								
								$scope.exefilterfunction();
								
							});

				
					
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
					"rest/jiraMetricsServices/getdefaultdate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.defaultdate = response;

						var date = new Date($scope.defaultdate[1]);
						var date1 = new Date($scope.defaultdate[0]);
						$scope.dtto = date;
						// date1.setDate(date.getDate() - 30);
						$scope.dtfrom = date1;

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
						var date = dtoval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/"
								+ year;
						
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
					"rest/jiraMetricsServices/getOnLoaddate?dashboardName="
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
						var date = dtoval.getDate();
						if (date < 10) {
							date = '0' + date;
						}
						var year = dtoval.getFullYear();

						$scope.dtoval = "" + month + "/" + date + "/"
								+ year;

					});

		}


		// GET SELECTED FROM DATE CALENDAR
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$scope.dfromval = dtfrom;
			$scope.exefilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$scope.dtoval = dtto;
			$scope.exefilterfunction();
		}

		// Function call for each dropdown change

		$scope.exefilterfunction = function() {
			$scope.testexecutioncount();
			//$scope.tcOpenCycle();
			//$scope.trOpenRun();
			$rootScope.bugsdetectedcount();
			$rootScope.testscreatedvsexecuted();
			$scope.ratiooftestcasefails();
			$scope.executionPassFail();

			//$rootScope.mmexecutioncycleTableExists = true;
			//$scope.executioncycleTableData(1);
			//$scope.executioncycleTableDataCount(1);
			//$scope.pagecycleChangedLevel(1);

			//$rootScope.mmexecutionrunTableExists = true;
			//$scope.executionrunTableData(1);
			//$scope.executionrunTableDataCount(1);
			//$scope.pagerunChangedLevel(1);
		}

		/** ** Run - Table Setup ** */

		$scope.executionrunTableData = function(start_runindex) {

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
			$scope.start_runindex = start_runindex;

			$http.get(
					"./rest/testExecutionServices/getexecutionruntabledata?itemsPerPage="
							+ 5 + "&start_index=" + $scope.start_runindex
							+ "&dashboardName=" + dashboardName + "&owner="
							+ owner + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto, config).success(function(response) {
				$rootScope.mmexecutionrunTableDetails = response;
				if ($rootScope.mmexecutionrunTableDetails.length == 0) {
					$rootScope.mmexecutionrunTableExists = false;
				} else {
					$rootScope.mmexecutionrunTableExists = true;
				}

			});
		};

		$scope.executionrunTableDataCount = function() {
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
					"./rest/testExecutionServices/getexecutionruntabledatacount?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(function(response) {
						$rootScope.exerundatapaginatecount = response;
					});
		};

		$scope.pagerunChangedLevel = function(runpageno) {

			$scope.runpageno = runpageno;

			if ($rootScope.runsortkey == true) {
				$scope.runsortedtable($scope.runsortBy, $scope.runpageno,
						$scope.runreverse);
			} else if ($rootScope.runsearchkey == true) {
				$scope.runsearch($scope.runpageno, $scope.runsearchField,
						$scope.runsearchText);
			} else {
				$scope.executionrunTableData($scope.runpageno);
			}

		};

		// Sort function starts here
		$scope.runsort = function(runkeyname, start_runindex) {
			$scope.runsortBy = runkeyname;
			$rootScope.runsortkey = true;
			$rootScope.runsearchkey = false;
			$scope.start_runindex = start_runindex;
			$scope.runreverse = !$scope.runreverse;
			$scope.runsortedtable($scope.runsortBy, $scope.start_runindex,
					$scope.runreverse);
		};

		// Table on-load with sort implementation
		$scope.runsortedtable = function(runsortvalue, start_runindex,
				runreverse) {

			$scope.runcolumn = runsortvalue;
			$scope.runindex = start_runindex;
			$scope.runorder = runreverse;

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
					"rest/testExecutionServices/sortrundata?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&itemsPerPage=" + $scope.itemsPerPage
							+ "&start_index=" + $scope.runindex + "&sortvalue="
							+ $scope.runcolumn + "&reverse=" + $scope.runorder,
					config).success(function(response) {
				$rootScope.mmexecutionrunTableDetails = response;
			});
		}

		$scope.itemsPerPage = 5;

		// search
		$scope.runsearch = function(start_runindex, runsearchField,
				runsearchText) {
			$scope.start_runindex = start_runindex;
			$scope.runsearchField = runsearchField;
			$scope.runsearchText = runsearchText;
			$rootScope.runsortkey = false;
			$rootScope.runsearchkey = true;
			$scope.runkey = false;

			if ($scope.runsearchField == "issueKey") {
				$rootScope.runissueKey = runsearchText;
				$scope.runkey = true;
			} else if ($scope.runsearchField == "issueSummary") {
				$rootScope.runissueSummary = runsearchText;
				$scope.runkey = true;
			} else if ($scope.runsearchField == "testRunName") {
				$rootScope.testRunName = runsearchText;
				$scope.runkey = true;
			} else if ($scope.runsearchField == "executedOn") {
				$rootScope.runexecutedOn = runsearchText;
				$scope.runkey = true;
			} else if ($scope.runsearchField == "executedBy") {
				$rootScope.runexecutedBy = runsearchText;
				$scope.runkey = true;
			} else if ($scope.runsearchField == "issueStatus") {
				$rootScope.runissueStatus = runsearchText;
				$scope.runkey = true;
			}

			$scope.runsearchable();
		}

		$scope.runsearchable = function() {
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
					"./rest/testExecutionServices/searchrunpagecount?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto + "&issueKey="
							+ $rootScope.runissueKey + "&issueSummary="
							+ $rootScope.runissueSummary + "&testRunName="
							+ $rootScope.testRunName + "&executedOn="
							+ $rootScope.runexecutedOn + "&executedBy="
							+ $rootScope.runexecutedBy + "&issueStatus="
							+ $rootScope.runissueStatus, config).success(
					function(response) {
						$rootScope.exerundatapaginatecount = response;
					});

			paginationService.setCurrentPage("exerunpaginate",
					$scope.start_runindex);

			$scope.itemsPerPage = 5;

			$scope.runindex = $scope.start_runindex; // Fix

			$http.get(
					"./rest/testExecutionServices/searchrundata?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&itemsPerPage=" + $scope.itemsPerPage
							+ "&start_index=" + $scope.runindex + "&issueKey="
							+ $rootScope.runissueKey + "&issueSummary="
							+ $rootScope.runissueSummary + "&testRunName="
							+ $rootScope.testRunName + "&executedOn="
							+ $rootScope.runexecutedOn + "&executedBy="
							+ $rootScope.runexecutedBy + "&issueStatus="
							+ $rootScope.runissueStatus, config).success(
					function(response) {
						if (response == "" && $scope.runkey == false) {
							$rootScope.runsearchkey = false;
							$scope.executionrunTableDataCount();
							$scope.executionrunTableData(1);
						} else {
							paginationService.setCurrentPage("exerunpaginate",
									$scope.start_runindex);
							$rootScope.mmexecutionrunTableDetails = response;
						}
					});
		}

		/** ** Run - Table Setup ** */

		/** ** Cycle - Table Setup ** */

		$scope.executioncycleTableData = function(start_cycleindex) {

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
			$scope.start_cycleindex = start_cycleindex;

			$http.get(
					"./rest/testExecutionServices/getexecutioncycletabledata?itemsPerPage="
							+ 5 + "&start_index=" + $scope.start_cycleindex
							+ "&dashboardName=" + dashboardName + "&owner="
							+ owner + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto, config).success(function(response) {
				$rootScope.mmexecutioncycleTableDetails = response;
				if ($rootScope.mmexecutioncycleTableDetails.length == 0) {
					$rootScope.mmexecutioncycleTableExists = false;
				} else {
					$rootScope.mmexecutioncycleTableExists = true;
				}

			});
		};

		$scope.executioncycleTableDataCount = function() {
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
					"./rest/testExecutionServices/getexecutioncycletabledatacount?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(function(response) {
						$rootScope.execycledatapaginatecount = response;
					});
		};

		$scope.pagecycleChangedLevel = function(cyclepageno) {

			$scope.cyclepageno = cyclepageno;

			// if ($scope.cyclesortBy == undefined && $rootScope.cyclesortkey ==
			// false
			// && $rootScope.cyclesearchkey == false) {
			// $scope.executioncycleTableData($scope.cyclepageno);
			// } else if ($rootScope.cyclesortkey == true) {
			// $scope.cyclesortedtable($scope.cyclesortBy, $scope.cyclepageno,
			// $scope.cyclereverse);
			// } else if ($rootScope.cyclesearchkey == true) {
			// $scope.cyclesearch($scope.cyclepageno, $scope.cyclesearchField,
			// $scope.cyclesearchText);
			// }

			if ($rootScope.cyclesortkey == true) {
				$scope.cyclesortedtable($scope.cyclesortBy, $scope.cyclepageno,
						$scope.cyclereverse);
			} else if ($rootScope.cyclesearchkey == true) {
				$scope.cyclesearch($scope.cyclepageno, $scope.cyclesearchField,
						$scope.cyclesearchText);
			} else {
				$scope.executioncycleTableData($scope.cyclepageno);
			}

		};

		// Sort function starts here
		$scope.cyclesort = function(cyclekeyname, start_cycleindex) {
			$scope.cyclesortBy = cyclekeyname;
			$rootScope.cyclesortkey = true;
			$rootScope.cyclesearchkey = false;
			$scope.start_cycleindex = start_cycleindex;
			$scope.cyclereverse = !$scope.cyclereverse;
			$scope.cyclesortedtable($scope.cyclesortBy,
					$scope.start_cycleindex, $scope.cyclereverse);
		};

		// Table on-load with sort implementation
		$scope.cyclesortedtable = function(cyclesortvalue, start_cycleindex,
				cyclereverse) {

			$scope.cyclecolumn = cyclesortvalue;
			$scope.cycleindex = start_cycleindex;
			$scope.cycleorder = cyclereverse;

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
					"rest/testExecutionServices/sortcycledata?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&itemsPerPage=" + $scope.itemsPerPage
							+ "&start_index=" + $scope.cycleindex
							+ "&sortvalue=" + $scope.cyclecolumn + "&reverse="
							+ $scope.cycleorder, config).success(
					function(response) {
						$rootScope.mmexecutioncycleTableDetails = response;
					});
		}

		/* Usage */
		var vm = this;
		vm.total_count = 0;
		/* Usage */

		$scope.itemsPerPage = 5;

		// search
		$scope.cyclesearch = function(start_cycleindex, cyclesearchField,
				cyclesearchText) {
			$scope.start_cycleindex = start_cycleindex;
			$scope.cyclesearchField = cyclesearchField;
			$scope.cyclesearchText = cyclesearchText;
			$rootScope.cyclesortkey = false;
			$rootScope.cyclesearchkey = true;
			$scope.cyclekey = false;

			if ($scope.cyclesearchField == "issueKey") {
				$rootScope.cycleissueKey = cyclesearchText;
				$scope.cyclekey = true;
			} else if ($scope.cyclesearchField == "issueSummary") {
				$rootScope.cycleissueSummary = cyclesearchText;
				$scope.cyclekey = true;
			} else if ($scope.cyclesearchField == "cycleName") {
				$rootScope.cycleName = cyclesearchText;
				$scope.cyclekey = true;
			} else if ($scope.cyclesearchField == "executedOn") {
				$rootScope.cycleexecutedOn = cyclesearchText;
				$scope.cyclekey = true;
			} else if ($scope.cyclesearchField == "executedBy") {
				$rootScope.cycleexecutedBy = cyclesearchText;
				$scope.cyclekey = true;
			} else if ($scope.cyclesearchField == "issueStatus") {
				$rootScope.cycleissueStatus = cyclesearchText;
				$scope.cyclekey = true;
			}

			$scope.cyclesearchable();
		}

		$scope.cyclesearchable = function() {
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
					"./rest/testExecutionServices/searchcyclepagecount?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto + "&issueKey="
							+ $rootScope.cycleissueKey + "&issueSummary="
							+ $rootScope.cycleissueSummary + "&cycleName="
							+ $rootScope.cycleName + "&executedOn="
							+ $rootScope.cycleexecutedOn + "&executedBy="
							+ $rootScope.cycleexecutedBy + "&issueStatus="
							+ $rootScope.cycleissueStatus, config).success(
					function(response) {
						$rootScope.execycledatapaginatecount = response;
					});

			paginationService.setCurrentPage("execyclepaginate",
					$scope.start_cycleindex);

			$scope.itemsPerPage = 5;

			$scope.cycleindex = $scope.start_cycleindex; // Fix

			$http.get(
					"./rest/testExecutionServices/searchcycledata?dashboardName="
							+ dashboardName + "&owner=" + owner + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&itemsPerPage=" + $scope.itemsPerPage
							+ "&start_index=" + $scope.cycleindex
							+ "&issueKey=" + $rootScope.cycleissueKey
							+ "&issueSummary=" + $rootScope.cycleissueSummary
							+ "&cycleName=" + $rootScope.cycleName
							+ "&executedOn=" + $rootScope.cycleexecutedOn
							+ "&executedBy=" + $rootScope.cycleexecutedBy
							+ "&issueStatus=" + $rootScope.cycleissueStatus,
					config).success(
					function(response) {
						if (response == "" && $scope.cyclekey == false) {
							$rootScope.cyclesearchkey = false;
							$scope.executioncycleTableDataCount();
							$scope.executioncycleTableData(1);
						} else {
							paginationService
									.setCurrentPage("execyclepaginate",
											$scope.start_cycleindex);
							$rootScope.mmexecutioncycleTableDetails = response;
						}
					});
		}

		/** ** Table Setup - Cycle ** */

		/* Test Execution count Starts Here */

		$scope.testexecutioncount = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};
			//$scope.dfromval = localStorageService.get('fromDateVal');
			//$scope.dtoval = localStorageService.get('toDateVal');
			
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
					"rest/jiraMetricsServices/testexecutioncount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(function(response) {
						
						$rootScope.uitestexecutioncount = response;
					});

		};

		/* Test Execution count Ends Here */

		// # of TC open chart
		$scope.tcOpenCycle = function() {

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
							"rest/testExecutionServices/tcOpenCycle?dashboardName="
									+ dashboardName + "&owner=" + owner
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto, config)
					.success(
							function(response) {
								$scope.tcOpenCycleData = response;
								$rootScope.uiTCPlannedVsExecuted = $scope.tcOpenCycleData.length;
								$rootScope.uiTCOpenCycle = 0;
								if ($scope.tcOpenCycleData.length != 0) {

									$scope
											.tcOpenCycleStackChart($scope.tcOpenCycleData);
									$scope
											.tcPlannedvsExeChart($scope.tcOpenCycleData);
								} else {
									$('#tcOpenCycleChart').remove();
									$('#tcOpenCyclediv')
											.append(
													'<canvas id="tcOpenCycleChart" height="100%"></canvas>');

									$('#plannedvsexechart').remove();
									$('#plannedvsexediv')
											.append(
													'<canvas id="plannedvsexechart" height="100%"></canvas>');

								}
							});

			// Draw # of TC open chart

			$scope.tcOpenCycleStackChart = function(data) {
				$scope.data = data
				// alert(JSON.stringify($scope.data));
				// $rootScope.uiTCOpenCycle =$scope.data.length;
				$scope.labeldatastack = [];
				$scope.graphdata = [];
				$scope.exeCount = [];
				$scope.notExeCount = [];

				for (var i = 0; i < $scope.data.length; i++) {
					if ($scope.data[i].notExeCount != 0) {
						$rootScope.uiTCOpenCycle = $rootScope.uiTCOpenCycle + 1;
						$scope.labeldatastack.push($scope.data[i].cycleName);
						$scope.exeCount.push($scope.data[i].exeCount);
						$scope.notExeCount.push($scope.data[i].notExeCount);
					} else {
						$('#tcOpenCycleChart').remove(); // this is my
						// <canvas> element
						$('#tcOpenCyclediv')
								.append(
										'<canvas id="tcOpenCycleChart" height="100%"></canvas>');
					}
				}

				var config = {
					type : 'bar',
					data : {
						labels : $scope.labeldatastack,
						datasets : [ {
							label : "Executed",
							data : $scope.exeCount,
							backgroundColor : "rgba(15, 138, 47, 0.8)",
							borderColor : "rgba(15, 138, 47, 0.8)"
						}, {
							data : $scope.notExeCount,
							label : "Not Executed",
							backgroundColor : "rgba(207, 207, 207, 0.8)",
							borderColor : "rgba(207, 207, 207, 0.8)"
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
													.forEach(function(bar,
															index) {
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
							xAxes : [ {
								barPercentage : 0.25,
								stacked : true,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									callback : function(value) {
										return value.substr(0, 10);// truncate
									},
								}
							} ],

							yAxes : [ {
								stacked : true,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						},
						tooltips : {
							enabled : true,
							mode : 'index',
							callbacks : {
								title : function(tooltipItems, data) {
									return $scope.labeldatastack[tooltipItems[0].index]
								}
							}
						},

					}
				};

				$('#tcOpenCycleChart').remove(); // this is my <canvas>
				// element

				if ($rootScope.uiTCOpenCycle == 0) {
					$('#tcOpenCycleManage').hide();
					// $('#tcOpenCyclediv')
					// .append(
					// '<canvas id="tcOpenCycleChart" style="width: 1100px;
					// height: 50px; margin-top: 20px;"></canvas>');
				} else {
					$('#tcOpenCycleManage').show();
					$('#tcOpenCyclediv')
							.append(
									'<canvas id="tcOpenCycleChart" height="100%"></canvas>');
					var ctx = document.getElementById("tcOpenCycleChart");
					window.statusstack = new Chart(ctx, config);
				}

			}

			// # of TC planned vs executed chart

			$scope.tcPlannedvsExeChart = function(data) {
				$scope.data = data
				// alert(JSON.stringify($scope.data));

				$scope.labeldata = [];
				$scope.graphdata = [];
				$scope.exeCount = [];
				$scope.notExeCount = [];

				for (var i = 0; i < $scope.data.length; i++) {
					var planned = $scope.data[i].exeCount
							+ $scope.data[i].notExeCount;

					$scope.labeldata.push($scope.data[i].cycleName);
					$scope.exeCount.push($scope.data[i].exeCount);
					$scope.notExeCount.push(planned);
				}
				var config = {
					type : 'bar',
					data : {
						labels : $scope.labeldata,
						datasets : [ {
							data : $scope.notExeCount,
							label : "Planned",
							backgroundColor : "rgba(207, 207, 207, 0.8)",
							borderColor : "rgba(207, 207, 207, 0.8)"
						}, {
							label : "Executed",
							data : $scope.exeCount,
							backgroundColor : "rgba(15, 138, 47, 0.8)",
							borderColor : "rgba(15, 138, 47, 0.8)"
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								barPercentage : 0.4,
								stacked : false,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									callback : function(value) {
										return value.substr(0, 8);// truncate
									},
								}
							} ],

							yAxes : [ {
								stacked : false,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						},
						tooltips : {
							enabled : true,
							mode : 'index',
							callbacks : {
								title : function(tooltipItems, data) {
									return $scope.labeldata[tooltipItems[0].index]
								}
							}
						},

					}
				};

				$('#plannedvsexechart').remove(); // this is my <canvas>
				// element
				$('#plannedvsexediv')
						.append(
								'<canvas id="plannedvsexechart" style="width: 1100px; height: 350px; margin-top: 20px;"></canvas>');

				var ctx = document.getElementById("plannedvsexechart");
				window.statusstack = new Chart(ctx, config);
			}

		}

		/* QMetry */

		// # of TR open chart
		$scope.trOpenRun = function() {

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
							"rest/testExecutionServices/trOpenRun?dashboardName="
									+ dashboardName + "&owner=" + owner
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto, config)
					.success(
							function(response) {
								$scope.trOpenRunData = response;
								$rootScope.uiTRPlannedVsExecuted = $scope.trOpenRunData.length;
								$rootScope.uiTROpenRun = 0;
								if ($scope.trOpenRunData.length != 0) {

									$scope
											.trOpenRunStackChart($scope.trOpenRunData);
									$scope
											.trPlannedvsExeChart($scope.trOpenRunData);
								} else {
									$('#trOpenRunChart').remove();
									$('#trOpenRundiv')
											.append(
													'<canvas id="trOpenRunChart" height="100%"></canvas>');

									$('#qplannedvsexechart').remove();
									$('#qplannedvsexediv')
											.append(
													'<canvas id="qplannedvsexechart" height="100%"></canvas>');

								}
							});

			// Draw # of TR open chart

			$scope.trOpenRunStackChart = function(data) {
				$scope.qdata = data

				$scope.qlabeldatastack = [];
				$scope.qgraphdata = [];
				$scope.qexeCount = [];
				$scope.qnotExeCount = [];

				for (var i = 0; i < $scope.qdata.length; i++) {
					if ($scope.qdata[i].qnotExeCount != 0) {
						$rootScope.uiTROpenRun = $rootScope.uiTROpenRun + 1;
						$scope.qlabeldatastack.push($scope.qdata[i].runName);
						$scope.qexeCount.push($scope.qdata[i].qexeCount);
						$scope.qnotExeCount.push($scope.qdata[i].qnotExeCount);
					} else {
						$('#trOpenRunChart').remove(); // this is my
						// <canvas> element
						$('#trOpenRundiv')
								.append(
										'<canvas id="trOpenRunChart" height="100%"></canvas>');
					}
				}

				var config = {
					type : 'bar',
					data : {
						labels : $scope.qlabeldatastack,
						datasets : [ {
							label : "Executed",
							data : $scope.qexeCount,
							backgroundColor : "rgba(15, 138, 47, 0.8)",
							borderColor : "rgba(15, 138, 47, 0.8)"
						}, {
							label : "Not Executed",
							data : $scope.qnotExeCount,
							backgroundColor : "rgba(207, 207, 207, 0.8)",
							borderColor : "rgba(207, 207, 207, 0.8)"
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
													.forEach(function(bar,
															index) {
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
							xAxes : [ {
								barPercentage : 0.1,
								stacked : true,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									callback : function(value) {
										return value.substr(0, 12);// truncate
									},
								}
							} ],

							yAxes : [ {
								barPercentage : 0.1,
								stacked : true,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						},
						tooltips : {
							enabled : true,
							mode : 'index',
							callbacks : {
								title : function(tooltipItems, data) {
									return $scope.qlabeldatastack[tooltipItems[0].index]
								}
							}
						},

					}
				};

				$('#trOpenRunChart').remove(); // this is my <canvas>
				// element

				if ($rootScope.uiTROpenRun == 0) {
					$('#trOpenRunManage').hide();
				} else {
					$('#trOpenRunManage').show();
					$('#trOpenRundiv')
							.append(
									'<canvas id="trOpenRunChart" height="100%"></canvas>');
					var ctx = document.getElementById("trOpenRunChart");
					window.statusstack = new Chart(ctx, config);
				}

			}

			// # of TR planned vs executed chart

			$scope.trPlannedvsExeChart = function(data) {
				$scope.data = data
				// alert(JSON.stringify($scope.data));

				$scope.qlabeldata = [];
				$scope.qgraphdata = [];
				$scope.qexeCount = [];
				$scope.qnotExeCount = [];

				for (var i = 0; i < $scope.data.length; i++) {
					var qplanned = $scope.data[i].qexeCount
							+ $scope.data[i].qnotExeCount;

					$scope.qlabeldata.push($scope.data[i].runName);
					$scope.qexeCount.push($scope.data[i].qexeCount);
					$scope.qnotExeCount.push(qplanned);
				}
				var qconfig = {
					type : 'bar',
					data : {
						labels : $scope.qlabeldata,
						datasets : [ {
							data : $scope.qnotExeCount,
							label : "Planned",
							backgroundColor : "rgba(207, 207, 207, 0.8)",
							borderColor : "rgba(207, 207, 207, 0.8)"
						}, {
							data : $scope.qexeCount,
							label : "Executed",
							backgroundColor : "rgba(15, 138, 47, 0.8)",
							borderColor : "rgba(15, 138, 47, 0.8)"
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								barPercentage : 0.25,
								stacked : false,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								},
								ticks : {
									callback : function(value) {
										return value.substr(0, 12);// truncate
									}
								}
							} ],

							yAxes : [ {
								barPercentage : 0.25,
								stacked : false,
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

						},
						legend : {
							display : true,
							position : 'bottom',
							labels : {
								fontColor : '#ffffff',
								boxWidth : 20,
								fontSize : 10
							}
						},
						tooltips : {
							enabled : true,
							mode : 'index',
							callbacks : {
								title : function(tooltipItems, data) {
									return $scope.qlabeldata[tooltipItems[0].index]
								}
							}
						},

					}
				};

				$('#qplannedvsexechart').remove(); // this is my <canvas>
				// element
				$('#qplannedvsexediv')
						.append(
								'<canvas id="qplannedvsexechart" style="width: 1100px; height: 350px; margin-top: 20px;"></canvas>');

				var qctx = document.getElementById("qplannedvsexechart");
				window.statusstack = new Chart(qctx, qconfig);
			}

		}
		
		
		/* Bugs Detected count Starts Here */

		$rootScope.bugsdetectedcount = function() {

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
			
			var vardtfrom = "";
			var vardtto = "";
			
			if ($rootScope.dfromDash == null || $rootScope.dfromDash == undefined
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

			$http
					.get(
							"rest/jiraMetricsServices/bugsdetectedcountbyprojects?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&selectedproject="
									+ varselectedproject + "&vardtfrom="
									+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(
							function(response) {

								$scope.mBugsCount = response;

								for ( var type in $scope.mBugsCount) {
									if (type == "Total") {
										$rootScope.uibugsdetectedcount = $scope.mBugsCount[type];
									}
								}

							});

		};
		/* Bugs Detected count Ends Here */

		/* Ratio of Test Cases Fails Starts Here */

		$scope.ratiooftestcasefails = function() {

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
							"rest/jiraMetricsServices/ratiooftestcasefails?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto, config)
					.success(
							function(response) {

								$scope.mTCFailsCount = response;
								console.log($scope.mTCFailsCount);
								for ( var type in $scope.mTCFailsCount) {
									if (type == "Open") {
										$rootScope.uitestcasefailsopen = $scope.mTCFailsCount[type];
									} else if (type == "Closed") {
										$rootScope.uitestcasefailsclosed = $scope.mTCFailsCount[type];
									}
								}

							});

		};
		/* Ratio of Test Cases Fails Ends Here */

		// PASS FAIL START
		// Execution PASS vs FAIL TREND CHART
		$scope.executionPassFail = function() {

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
							"rest/jiraMetricsServices/exepassfailtrendchart?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto, config)
					.success(
							function(response) {
								$scope.data = response;

								if ($scope.data.length != 0) {
									$scope.exelinechart($scope.data);
								} else {
									$('#passfailline').remove();
									$('#passfaillinediv')
											.append(
													'<canvas id="passfailline" height="100%"> </canvas>');
								}
							});

			$scope.exelinechart = function(lineresult) {
				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.passStatus = [];
				$scope.failStatus = [];
				$scope.wipStatus = [];
				$scope.blockedStatus = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].isodate);

					$scope.passStatus.push($scope.lineresult[i].passStatus);
					$scope.failStatus.push($scope.lineresult[i].failStatus);
					$scope.wipStatus.push($scope.lineresult[i].wipStatus);
					$scope.blockedStatus
							.push($scope.lineresult[i].blockedStatus);

				}
				$scope.data = [ $scope.passStatus, $scope.failStatus,
						$scope.wipStatus, $scope.blockedStatus ];
				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.passStatus,
							label : "Passed Count",
							borderColor : "#2eb82e",
							backgroundColor : "#2eb82e",
							fill : false
						}, {
							data : $scope.failStatus,
							label : "Failed Count",
							borderColor : "#e60000",
							backgroundColor : "#e60000",
							fill : false
						}, {
							data : $scope.wipStatus,
							label : "WIP Count",
							borderColor : "#e6e600",
							backgroundColor : "#e6e600",
							fill : false
						}, {
							data : $scope.blockedStatus,
							label : "Blocked Count",
							borderColor : "#8a00e6",
							backgroundColor : "#8a00e6",
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
									unit : "month"
								},
								gridLines : {
									color : "#d8d3d3",
								},
								ticks: { 
									fontColor: '#4c4c4c'
								}
							} ],
							yAxes : [ {
								gridLines : {
									color : "#d8d3d3"
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
				$('#passfailline').remove(); // this is my <canvas> element
				$('#passfaillinediv').append(
						'<canvas id="passfailline" height="100%"> </canvas>');

				var ctx = document.getElementById("passfailline");
				window.defectline = new Chart(ctx, config);

			}

		}
		// PASS FAIL END

		/* Landing Page BA Panel Code Starts Here */

		// Total Execution Count
		$rootScope.totExeCount = function() {

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/jiraMetricsServices/totexecutioncount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName  + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						$rootScope.totexecount = response;
					});

		};

		// Tests Created Vs. Executed
		$rootScope.testscreatedvsexecuted = function() {

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

			$http
					.get(
							"./rest/jiraMetricsServices/testsCreatedVsExecuted?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&selectedproject="
									+ varselectedproject, config)
					.success(
							function(response) {
								$scope.mTestsCount = response;

								for ( var type in $scope.mTestsCount) {
									if (type == "Created") {
										$rootScope.uitestscreated = $scope.mTestsCount[type];
									}
								}

							});

		};

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
								return (chartcount > 75 ? '#5cb85c'
										: chartcount > 25 ? '#f0ad4e'
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
		$timeout(function() {
		}, 1000);

		/* Landing Page BA Panel Code Ends Here */

		// Mass Mutual Code Ends Here
	}

})();