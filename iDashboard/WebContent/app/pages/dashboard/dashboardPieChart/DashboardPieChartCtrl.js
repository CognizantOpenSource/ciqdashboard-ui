/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.dashboard').controller(
			'DashboardPieChartCtrl', DashboardPieChartCtrl);

	/** @ngInject */
	function DashboardPieChartCtrl($sessionStorage, AES, paginationService,
			baSidebarService, localStorageService, $element, $scope, $base64,
			$http, $timeout, $uibModal, $rootScope, baConfig, layoutPaths,
			$filter) {

		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('projectName');
		$rootScope.rollingPeriod = localStorageService.get('rollingPeriod');
		localStorageService.set('timeperiod', $rootScope.rollingPeriod);

		$scope.currenttimeperiod = localStorageService.get('timeperiod');


		$scope.dtfrom = localStorageService.get('dtfrom');
		$scope.dtto = localStorageService.get('dtto');

		if ($scope.dtto != null) {

			var dtToDate = new Date($scope.dtto);
			dtToDate.setDate(dtToDate.getDate() + 1);

			var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)),
					'MM/dd/yyyy');

			localStorageService.set('dttoPlus', dtToDateStr);
		}

		$scope.init = function() {
			$rootScope.dataloader = true;
		}

		if ($scope.currenttimeperiod != null) {
			localStorageService.set('timeperiod', $scope.currenttimeperiod)
		} else {
			localStorageService.set('timeperiod', $rootScope.rollingPeriod);
			$scope.currenttimeperiod = null;
			$scope.selectedtimeperioddrop = "";
		}

		function treatAsUTC(date) {
			var result = new Date(date);
			result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
			return result;
		}
		//localStorageService.set('timeperiod', $rootScope.rollingPeriod);

		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = true;

		$rootScope.tool = localStorageService.get('tool');

		if ($rootScope.tool == 'JIRA') {
			$rootScope.menuItems = [ {
				"name" : "dashboard",
				"title" : "Dashboard",
				"level" : 0,
				"order" : 0,
				"icon" : "ion-android-home",
				"stateRef" : "dashboard",
				"subMenu" : null
			}, {
				"name" : "charts",
				"title" : "Metrics",
				"level" : 0,
				"order" : 150,
				"icon" : "ion-stats-bars",
				"stateRef" : "charts",
				"subMenu" : [ {
					"name" : "charts.userstories",
					"title" : "User Story",
					"level" : 1,
					"order" : 0,
					"stateRef" : "charts.userstories"
				}, {
					"name" : "charts.testcases",
					"title" : "Test Design",
					"level" : 1,
					"order" : 0,
					"stateRef" : "charts.testcases"
				}, {
					"name" : "charts.defects",
					"title" : "Defects",
					"level" : 1,
					"order" : 0,
					"stateRef" : "charts.defects"
				}, {
					"name" : "charts.testexecution",
					"title" : "Test Execution",
					"level" : 1,
					"order" : 0,
					"stateRef" : "charts.testexecution"
				}, ]
			} ];
		} else {
			$rootScope.menuItems = baSidebarService.getMenuItems();
		}

		/*
		 * // Data for drop downs on initial Page Load
		 * 
		 * $scope.projectlevel = function() { var token = getEncryptedValue();
		 * var config = {headers: { 'Authorization': token }};
		 * $http.get("rest/jsonServices/projectlevel",config).success(function
		 * (response) { $scope.project = response; $scope.projectdata = {};
		 * $scope.projectleveldata = $scope.project ; $scope.allDomains =
		 * $scope.projectleveldata; $scope.domains = $scope.allDomains; }); }
		 * $scope.selectedValue=function(selectedValueInProject){ var token =
		 * getEncryptedValue(); var config = {headers: { 'Authorization': token
		 * }}; $scope.selectedproject = selectedValueInProject;
		 * $http.get("rest/jsonServices/environmentlevel?selectedproject="+$scope.selectedproject,config).success(function
		 * (response) { $scope.environment = response; $scope.businessenv = {};
		 * $scope.businessEnvironment = $scope.environment; $scope.allProjects =
		 * $scope.businessEnvironment; $scope.projects = $scope.allProjects; }) ; };
		 * 
		 * $scope.envlevel = function(selectedValueInEnvironment) { var token =
		 * getEncryptedValue(); var config = {headers: { 'Authorization': token
		 * }}; $scope.selectedenv = selectedValueInEnvironment;
		 * $http.get("rest/jsonServices/releaselevel?selectedenv="+$scope.selectedenv+"&selectedproject="+$scope.selectedproject,config).success(function
		 * (response) { $scope.releasedata = response; $scope.releases = {};
		 * $scope.release= $scope.releasedata; $scope.allReleases =
		 * $scope.release; $scope.releases = $scope.allReleases; }) ; };
		 * 
		 * 
		 * $scope.dropdowndomain = function(domain) { if(domain == undefined ||
		 * domain == null){ domain = ""; $rootScope.initialreqcount();
		 * $rootScope.reqvoltility(); $rootScope.initialtestcount();
		 * $rootScope.initialcount(); $rootScope.designCoverage();
		 * $rootScope.initialtccount(); $rootScope.tccoverage();
		 * $rootScope.defectrejrate(); $rootScope.defectResolutionChart();
		 * $rootScope.reqPrioirtyFunnelChart(); $rootScope.artifactCountChart(); }
		 * $rootScope.domain = domain; $rootScope.project = "";
		 * $rootScope.release=""; $rootScope.newDomainReq($rootScope.domain);
		 * $rootScope.newDomainDesign($rootScope.domain);
		 * $rootScope.newDomainExecution($rootScope.domain);
		 * $rootScope.newDomainDefects($rootScope.domain);
		 * $rootScope.newDomainArtifacts($rootScope.domain); }
		 * $scope.dropdownproject = function(project){ $rootScope.project =
		 * project; $rootScope.newProjectReq($rootScope.project);
		 * $rootScope.newProjectDesign($rootScope.project);
		 * $rootScope.newProjectExecution($rootScope.project);
		 * $rootScope.newProjectDefects($rootScope.project);
		 * $rootScope.newProjectArtifacts($rootScope.project); }
		 * $scope.dropdownrelease = function(release){ $rootScope.release =
		 * release; $rootScope.newReleaseReq($rootScope.release);
		 * $rootScope.newReleaseDesign($rootScope.release);
		 * $rootScope.newReleaseExecution($rootScope.release);
		 * $rootScope.newReleaseDefects($rootScope.release);
		 * $rootScope.newReleaseArtifacts($rootScope.release); }
		 */

		/**
		 * Date Filter Code Starts Here
		 */

		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$rootScope.dfromvalDash = dtfrom;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtfrom', dtfrom);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodDash = localStorageService.get('timeperiod');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.dashboardfilterfunction();
		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$rootScope.dtovalDash = dtto;
			$scope.selectedtimeperioddrop = "";
			localStorageService.set('dtto', dtto);
			localStorageService.set('timeperiod', null);
			$rootScope.timeperiodDash = localStorageService.get('timeperiod');

			if ($scope.dtto != null) {

				var dtToDate = new Date($scope.dtto);
				dtToDate.setDate(dtToDate.getDate() + 1);

				var dtToDateStr = $filter('date')(
						new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');

				localStorageService.set('dttoPlus', dtToDateStr);
			}

			$rootScope.dashboardfilterfunction();
		}

		$scope.gettimeperiod = function() {

			$rootScope.timeperiodDashdrops = [ "Last 30 days", "Last 60 days",
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
			$rootScope.timeperiodDash = localStorageService.get('timeperiod');
		}

		$scope.gettimeperiodselection = function(timeperiod) {
			localStorageService.set('timeperiod', timeperiod);
			$rootScope.timeperiodDash = localStorageService.get('timeperiod');

			var index = $rootScope.timeperiodDashdrops.indexOf(timeperiod);
			var selectednoofdays = $rootScope.noofdays[index];
			var to = new Date();
			var from = new Date();

			$scope.dtto = to;
			$scope.dtfrom = new Date(from.setDate(to.getDate()
					- selectednoofdays));

			$scope.convertDateToString($scope.dtfrom, $scope.dtto);
			
			$rootScope.dashboardfilterfunction();
		}

		//ALM
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

			$rootScope.dfromvalDash = $scope.dtfromfinal; // storage date
			// reset
			$rootScope.dtovalDash = $scope.dttofinal; // storage date reset
			// $rootScope.dashboardfilterfunction();

		}

		$scope.fromoptions = {
			// set this to whatever date you want to set
			maxDate : new Date(), 
		}

		$scope.tooptions = {
			minDate : new Date(), // set this to whatever date you want to set
		
		}

		// Function call for each dropdown change

		$rootScope.dashboardfilterfunction = function() {

			$scope.dashboardDefCount();
			$scope.dashboardTestCount();
			$scope.dashboardExeCount();
			$scope.dashboardReqCount();
			$scope.dashboardReqVolatility();
			$scope.dashboardDesignCoverage();
			$scope.dashboardExeCoverage();
			$scope.dashboardDefectRejrate();
			$scope.dashboardReqPassCount();
			$scope.dashboardAutoCoverage();
			$scope.dashboardManualCount();
			$scope.dashboardAutoCount();
			$scope.dashboardDefClosedCount();
			$scope.reqPrioirtyFunnel();

			$scope.regressionautomationFilter();
			$scope.firstpassrate();

			$scope.FuncationalAutomation();

			$scope.RegressionAutomation();
			$scope.UATAutomation();
			$scope.defectdensityfilter();

		}

		//First Time Pass Rate percentage
		$rootScope.firstpassrate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
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

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/firstTimePass?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDash, config).success(
					function(response) {
						$rootScope.passratedata = response;

						$scope.loadPieCharts('#passrate',
								$rootScope.passratedata);
					});

		}

		$rootScope.FuncationalAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
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

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/FuncationalAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDash, config).success(
					function(response) {
						$rootScope.funcauto = response;
						$scope.loadPieCharts('#funcatuo', $rootScope.funcauto);

					});

		}

		// Regression Automation
		$rootScope.RegressionAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
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

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/RegressionAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDash, config).success(
					function(response) {
						$rootScope.regatuo = response;

						$scope.loadPieCharts('#regatuo', $rootScope.regatuo);
					});

		}

		$rootScope.UATAutomation = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			if ($rootScope.dfromvalTe == null
					|| $rootScope.dfromvalTe == undefined
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

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/UATAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ projectName + "&vardtfrom=" + vardtfrom
							+ "&vardtto=" + vardtto + "&timeperiod="
							+ $rootScope.timeperiodDash, config).success(
					function(response) {
						$rootScope.uatauto = response;

						$scope.loadPieCharts('#uatatuo', $rootScope.uatauto);
					});

		}

		$rootScope.defectdensityfilter = function() {

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

			if ($rootScope.dtovalDef == null
					|| $rootScope.dtovalDef == undefined
					|| $rootScope.dtovalDef == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtovalDef;
			}

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/defectdensityFilter?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(
					function(response) {
						$scope.defectdensity = response;
						/*$scope.loadPieCharts('#defdensityfilter',
								$scope.defectdensity);*/
						$scope.loadDefectDensityPieCharts('#defdensityfilter',
								$scope.defectdensity);
						$rootScope.dataloader = false;

					});

			//$('#cover-spin').hide(0);

		}

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
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$scope.regautofilter = response;
				$scope.loadPieCharts('#regautofilter', $scope.regautofilter);
			});

		}

		// End of Regression automation

		// Defect Count on Page Load
		$rootScope.dashboardDefCount = function() {
			// alert("Def Count");
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
					"rest/operationalDashboardALMServices/totalDefCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.defectCount = response;
				// alert("Def Count : " + $rootScope.defectCount);
			});
		};

		// Total Test Count(BA Panel)
		$rootScope.dashboardTestCount = function() {
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
					"rest/operationalDashboardALMServices/totalTestCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.testCount = response;
				// alert("TC Count : " + $rootScope.testCount);

			});
		}

		// Total Execution Count

		$rootScope.dashboardExeCount = function() {
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
					"rest/operationalDashboardALMServices/totalExeCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.tcexecnt = response;
				// alert("Exec Count : " + $rootScope.tcexecnt);
			});
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

		// Requirement Volatility
		$rootScope.dashboardReqVolatility = function() {

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
					"rest/operationalDashboardALMServices/reqvolaPercentage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$scope.volatilitydata = response;
				// alert("Req VolatilityData : " + $rootScope.volatilitydata);
				$scope.loadPieCharts('#dashreqvola', $scope.volatilitydata);
			});

		}

		// Design Coverage
		$rootScope.dashboardDesignCoverage = function() {

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
					"rest/operationalDashboardALMServices/designCoverage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(
					function(response) {
						$scope.designcovgfilter = response;

						// alert("Design Coverage : " +
						// $rootScope.designcovgfilter);

						$scope.loadPieChartsDashboard('#dashdesigncov',
								$scope.designcovgfilter);

					});

		}

		// Execution Coverage
		$rootScope.dashboardExeCoverage = function() {

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
					"rest/operationalDashboardALMServices/executionCoverage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(
					function(response) {
						$rootScope.tccoveragedata = response;

						// alert("Exe Coverage : " + $rootScope.tccoveragedata);

						$scope.loadPieChartsDashboard('#dashexecov',
								$rootScope.tccoveragedata);
					});

		}

		// Defect Rejection Rate
		$rootScope.dashboardDefectRejrate = function() {

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
					/*"rest/operationalDashboardALMServices/defRejectRate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config)*/
					
					"./rest/almMetricsServices/defectRejRateFilter?dashboardName="
					+ dashboardName + "&domainName="
					+ domainName + "&projectName="
					+ projectName + "&vardtfrom=" + vardtfrom
					+ "&vardtto=" + vardtto + "&timeperiod="
					+ $rootScope.timeperiodDash, config).success(
					function(response) {
						$scope.defectRejection = response;

						// alert("Def Reject : " + $rootScope.defectRejection);

						$scope.loadPieChartsNeg('#dashdefrejrate',
								$scope.defectRejection);
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

		// Neg Pie Chart with Small ba-panel
		$scope.loadPieChartsNeg = function(id, chartcount) {
			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(
					function() {
						var chart = $(this);
						chart
								.easyPieChart({
									easing : 'easeOutBounce',
									onStep : function(from, to, percent) {
										$(this.el).find('.percent').text(
												Math.round(percent));
									},
									barColor : function(chartcount) {
										return (chartcount < 30 ? 'green'
												: (chartcount <= 60 ? 'orange'
														: 'red'));
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

		// Auto updates ba-panel Pie Chart
		function updatePieCharts(id, count) {
			$scope.id = id;
			$scope.count = count;
			$($scope.id).each(function(index, chart) {
				$(chart).data('easyPieChart').update($scope.count);
			});
		}
		$timeout(function() {
		}, 1000);

		// Pie Chart with Small ba-panel
		$scope.loadPieChartsDashboard = function(id, chartcount) {
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
						updatePieChartsDashboard($scope.id, $scope.chartcount)
					});
			$('.refresh-data').on('click', function() {
				updatePieChartsDashboard();
			});
		}
		// Auto updates ba-panel Pie Chart
		function updatePieChartsDashboard(id, count) {
			$scope.id = id;
			$scope.count = count;
			$($scope.id).each(function(index, chart) {
				$(chart).data('easyPieChart').update($scope.count);
			});
		}
		$timeout(function() {
		}, 1000);

		// Requirement Pass Count
		$rootScope.dashboardReqPassCount = function() {
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
					"rest/operationalDashboardALMServices/reqPassCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.reqpassdata = response;

				// alert("Req Pass Count : " + $rootScope.reqpassdata);

			});
		}

		// Automation Coverage
		$rootScope.dashboardAutoCoverage = function() {
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
					"rest/operationalDashboardALMServices/designAutoCoverage?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.autocovg = response;
				// alert("Auto Coverage : " + $rootScope.autocovg);
				$scope.loadPieCharts('#designautocov', $rootScope.autocovg);
			});

		}

		// Manual Execution Count

		$rootScope.dashboardManualCount = function() {
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
					"rest/operationalDashboardALMServices/exeManualCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.tcmanual = response;
			});
		}

		// Automated Execution Count

		$rootScope.dashboardAutoCount = function() {
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
					"rest/operationalDashboardALMServices/exeAutoCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.tcauto = response;
			});
		}

		// Closed Defect Count on Page Load - Dashboard
		$rootScope.dashboardDefClosedCount = function() {

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
					"rest/operationalDashboardALMServices/defClosedCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ vardtfrom + "&vardtto=" + vardtto
							+ "&timeperiod=" + $rootScope.timeperiodDash,
					config).success(function(response) {
				$rootScope.defectClosedCount = response;
				// alert("Def Closed Count : " + $rootScope.defectClosedCount);
			});
		};

		// Requirement Priority Funnel Chart - Dashboard

		$rootScope.reqPrioirtyFunnel = function() {
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

			$http
					.get(
							"rest/operationalDashboardALMServices/reqprioritychart?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName="
									+ projectName + "&vardtfrom=" + vardtfrom
									+ "&vardtto=" + vardtto + "&timeperiod="
									+ $rootScope.timeperiodDash, config)
					.success(
							function(response) {
								$scope.data = response;
								// alert("Priority Funnel : " + $scope.data);
								if ($scope.data.length != 0) {
									$scope.funnel($scope.data);
								} else {
									$('#priorfunnel').remove(); // this is my
									// <canvas>
									// element
									$('#priorfunneldiv')
											.append(
													' <canvas id="priorfunnel" height="250" style="margin-top:40px;margin-left:100px"> </canvas>');
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

				FunnelChart('priorfunnel', {
					values : $scope.datafunnel,
					labels : $scope.labelsfunnel,
					displayPercentageChange : false,
					sectionColor : [ "rgba(255, 99, 132, 0.8)",
							"rgba(54, 162, 235, 0.8)",
							"rgba(255, 206, 86, 0.8)",
							"rgba(75, 192, 192, 0.8)",
							"rgba(153, 102, 255, 0.8)",
							"rgba(255, 159, 64, 0.8)" ],
					labelFontColor : "rgba(112, 112, 112, 0.8)"
				});
			}
		}

		/**
		 * Date Filter Code Starts Here
		 */

		/**
		 * *****************************************JIRA
		 * Integrated***********************************************************
		 */

		/** Levis code starts here */

		/* Landing Page Code Starts Here */

		// Total Req. Count - Landing Page
		$scope.totReqcount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalDashboardJiraServices/totalreqCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName, config).success(
					function(response) {
						$scope.reqdata = response;
					});
		}

		// Total Story Point - Landing Page
		$rootScope.totStoryPoint = function() {
			var token = AES.getEncryptedValue();
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
					"rest/operationalDashboardJiraServices/totStoryPointCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						$scope.totstorypoint = response;
					});
		};

		// Total Defect Count - Landing Page
		$rootScope.totDefCount = function() {
			var token = AES.getEncryptedValue();
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
					"rest/operationalDashboardJiraServices/totDefCount?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						$scope.defectCount = response;
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
					"./rest/operationalDashboardJiraServices/defectOpenRate?dashboardName="
							+ dashboardName + "&domainName=" + domainName
							+ "&projectName=" + projectName + "&vardtfrom="
							+ $rootScope.dfromDash + "&vardtto="
							+ $rootScope.dtoDash, config).success(
					function(response) {
						$scope.defOpenRate = response;
						$scope
								.loadPieCharts('#defopenrate',
										$scope.defOpenRate);
					});
		}

		/* Landing Page Code Ends Here */

		$rootScope.initialtestcountdash = function() {

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

			$http
					.get(
							"rest/operationalDashboardJiraServices/totalTestCountinitialdash?dashboardName="
									+ dashboardName
									+ "&domainName="
									+ domainName
									+ "&projectName="
									+ projectName
									+ "&vardtfrom="
									+ vardtfrom
									+ "&vardtto=" + vardtto, config).success(
							function(response) {
								$rootScope.testCountdash = response;
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
									- response + 1));

							$scope.jiraconvertDateToString($scope.dtfrom,
									$scope.dtto);
						}

					});

		}

		$scope.jiraconvertDateToString = function(fromDate, toDate) {
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
			$rootScope.dfromDash = $scope.dtfromfinal; // storage date reset
			$rootScope.dtoDash = $scope.dttofinal; // storage date reset

			$rootScope.initUserStorySprintCount();
			$rootScope.initialUserStorycount();
			$rootScope.totStoryPoint();
			$rootScope.initialtestcountdash();
			$rootScope.totDefCount();
			$rootScope.defectopenrate();
			$rootScope.totExeCount();
			$rootScope.bugsdetectedcount();
		}

		$scope.loadDefectDensityPieCharts = function(id, chartcount) {

			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(
					function() {
						var chart = $(this);
						chart
								.easyPieChart({
									easing : 'easeOutBounce',
									onStep : function(from, to, percent) {
										$(this.el).find('.percent').text(
												Math.round(percent));
									},
									barColor : function(chartcount) {
										return (chartcount <= 30 ? 'green'
												: (chartcount <= 60 ? 'red'
														: 'orange'));
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

		// End Defect Density chart

		// Start of Defect Rejection Rate

		$scope.loadDefectRejectionPieCharts = function(id, chartcount) {
			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(function() {
				var chart = $(this);
				chart.easyPieChart({
					easing : 'easeOutBounce',
					onStep : function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent));
					},
					barColor : function(chartcount) {
						var color1 = 'red';
						var color2 = 'green';
						var color3 = 'orange'
						var color = "";
						if (chartcount <= 8) {
							color = color2
						}
						if (chartcount >= 9 && chartcount <= 20) {
							color = color3
						}
						if (chartcount > 20) {
							color = color1
						}
						return color;
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

		// End of Defect Rejection Rate

	}
})();
