(function() {
	'use strict';

	angular.module('MetricsPortal.pages').controller('SummaryslideShowCtrl',
			SummaryslideShowCtrl);

	/** @ngInject */

	function SummaryslideShowCtrl($scope, $state, buildData, baConfig,
			localStorageService, $filter, $element, $rootScope, $window,
			$sessionStorage, layoutPaths, $base64, $http, $timeout, $uibModal,
			Idle, Keepalive, $interval) {

		var prjcnt = localStorageService.get('projectcnt');

		// Not to watch the Ideal state.
		Idle.unwatch();

		// Refresh the Page
		var timeinterval = 0;
		$interval(function() {
			timeinterval++;

			if (timeinterval === 1000) {
				$state.reload();
				timeinterval = 0;
			}
		}, 1000);

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}

		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');

		$rootScope.timeperiodReq = localStorageService.get('rollingPeriod');
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		var domainName = localStorageService.get('domainName');
		var projectName = localStorageService.get('SlideprojectName');

		$rootScope.displayDashName = localStorageService.get('dashboardName');

		$scope.init = function() {

			$rootScope.tprj = localStorageService.get('SlideprojectName')
			$rootScope.getAllMetrics($rootScope.tprj, 0);

		}

		$rootScope.getAllMetrics = function(prjName, idx) {

			$rootScope.tprj = prjName;
			
			
			if (localStorageService.get('dtto') != null) {
				
				var dtToDate = new Date(localStorageService.get('dtto'));			
				dtToDate.setDate(dtToDate.getDate() + 1);			
				
				var dtToDateStr = $filter('date')(new Date(Date.parse(dtToDate)), 'MM/dd/yyyy');			
				
				localStorageService.set('dttoPlus', dtToDateStr);			
			}
			
			
			$rootScope.SlideReqcount(prjName);
			$rootScope.Slidetestcount(prjName);
			$rootScope.SlideReqvoltilityFilter(prjName, idx);
			$rootScope.SlideregressionautomationFilter(prjName, idx);
			$rootScope.Slideinitialtccount(prjName, idx);
			$rootScope.Slidefirstpassrate(prjName, idx);

			$rootScope.SlideFuncationalAutomation(prjName, idx);
			$rootScope.SlideRegressionAutomation(prjName, idx);
			$rootScope.SlideUATAutomation(prjName, idx);
			$rootScope.Slidedefectcount(prjName, idx);
			$rootScope.Slidedefectrejratefilter(prjName, idx);
			$rootScope.Slidedefectdensityfilter(prjName, idx);

		}

		$rootScope.SlideReqcount = function(prjName) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');

			
			vardtto = localStorageService.get('dttoPlus');
			
			$http
					.get(
							"rest/almMetricsServices/reqCountFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.SlideReqCount = response;

					});
		}

		$rootScope.Slidetestcount = function(prjName) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/totalTestCountinitial?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.SlidetestCount = response;

					});
		}

		$rootScope.SlideReqvoltilityFilter = function(prjName, idx) {

			$scope.idx = idx;

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http
					.get(
							"./rest/almMetricsServices/reqvolatilityfilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								$scope.slidevolatilityfilter = response;
								$rootScope.loadPieCharts('#slidereqvolafilter',
										idx, $scope.slidevolatilityfilter);
							});
		}

		$rootScope.SlideregressionautomationFilter = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var vardtfrom = "";
			var vardtto = "";
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http
					.get(
							"rest/almMetricsServices/regressionautoFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								$scope.regautofilter = response;
								$scope.loadPieCharts('#regautofilter', idx,
										$scope.regautofilter);
							});

		}

		$rootScope.Slideinitialtccount = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http.get(
					"rest/almMetricsServices/tcexeCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ prjName + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.Slidetcexecnt = response;
					});
		}

		$rootScope.Slidefirstpassrate = function(prjName, idx) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http.get(
					"./rest/almMetricsServices/firstTimePass?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ prjName + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.Slidepassratedata = response;

						$scope.loadPieCharts('#passrate', idx,
								$rootScope.Slidepassratedata);
					});

		}

		// 
		$rootScope.SlideFuncationalAutomation = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http.get(
					"./rest/almMetricsServices/FuncationalAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ prjName + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.Slidefuncauto = response;

						$scope.loadPieCharts('#funcatuo', idx,
								$rootScope.Slidefuncauto);
					});

		}

		$rootScope.SlideRegressionAutomation = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http.get(
					"./rest/almMetricsServices/RegressionAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ prjName + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.Slideregatuo = response;

						$scope.loadPieCharts('#regatuo', idx,
								$rootScope.Slideregatuo);
					});

		}

		$rootScope.SlideUATAutomation = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http.get(
					"./rest/almMetricsServices/UATAutomation?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&domainName=" + domainName + "&projectName="
							+ prjName + "&vardtfrom=" + vardtfrom + "&vardtto="
							+ vardtto + "&timeperiod="
							+ $rootScope.timeperiodReq, config).success(
					function(response) {
						$rootScope.Slideuatauto = response;

						$scope.loadPieCharts('#uatatuo', idx,
								$rootScope.Slideuatauto);
					});

		}

		$rootScope.Slidedefectcount = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"rest/almMetricsServices/totalDefectCountinitial?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(function(response) {
						$rootScope.SlidedefectCount = response;
					});
		};

		$rootScope.Slidedefectrejratefilter = function(prjName, idx) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";

			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			

			$http
					.get(
							"./rest/almMetricsServices/defectRejRateFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								$scope.defectRejection = response;
								$scope.loadDefectRejectionPieCharts(
										'#defrejratefilter', idx,
										$scope.defectRejection);
							});
		}

		$rootScope.Slidedefectdensityfilter = function(prjName, idx) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');

			$http
					.get(
							"./rest/almMetricsServices/defectdensityFilter?dashboardName="
									+ dashboardName + "&domainName="
									+ domainName + "&projectName=" + prjName
									+ "&vardtfrom=" + vardtfrom + "&vardtto="
									+ vardtto + "&timeperiod="
									+ $rootScope.timeperiodReq, config)
					.success(
							function(response) {
								$scope.defectdensity = response;
								$scope.loadPieDefectDensityCharts(
										'#defdensityfilter', idx,
										$scope.defectdensity);
							});

		}

		$rootScope.loadPieCharts = function(id, index, chartcount) {

			$scope.chartcount = chartcount;
			$scope.id = id;

			var chart = $("#slideNumber_" + index + " " + $scope.id);

			chart.easyPieChart({
				easing : 'easeOutBounce',
				onStep : function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				},
				barColor : function(chartcount) {
					return (chartcount < 30 ? 'red'
							: (chartcount <= 60 ? 'orange' : 'green'));
				},
				trackColor : 'lightgray',
				size : 85,
				scaleLength : 0,
				animation : 2000,
				lineWidth : 10,
				lineCap : 'round',
				scaleColor : 'white'
			});
			updatePieCharts("#slideNumber_" + index + " " + $scope.id,
					$scope.chartcount)

		}

		$rootScope.loadDefectRejectionPieCharts = function(id, index,
				chartcount) {

			$scope.chartcount = chartcount;
			$scope.id = id;

			var chart = $("#slideNumber_" + index + " " + $scope.id);

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
			updatePieCharts("#slideNumber_" + index + " " + $scope.id,
					$scope.chartcount)

		}

		$rootScope.loadPieDefectDensityCharts = function(id, index, chartcount) {

			$scope.chartcount = chartcount;
			$scope.id = id;

			var chart = $("#slideNumber_" + index + " " + $scope.id);

			chart.easyPieChart({
				easing : 'easeOutBounce',
				onStep : function(from, to, percent) {
					$(this.el).find('.percent').text(Math.round(percent));
				},
				barColor : function(chartcount) {
					return (chartcount < 30 ? 'green'
							: (chartcount <= 60 ? 'orange' : 'red'));
				},
				trackColor : 'lightgray',
				size : 85,
				scaleLength : 0,
				animation : 2000,
				lineWidth : 10,
				lineCap : 'round',
				scaleColor : 'white'
			});
			updatePieCharts("#slideNumber_" + index + " " + $scope.id,
					$scope.chartcount)

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

		$scope.onExit = function() {

			$rootScope.hidepagetop = false;
			window.top.location.href = "/intelligentdashboard/#/globalview"; // works
																				// OK
			window.top.close();
			window.opener.location.reload();

		};

		var timer = setInterval(function() {

			if ($scope.win.closed != null) {
				if ($scope.win.closed) {
					$rootScope.hidepagetop = false;
					$rootScope.menubarPopup = true;
					clearInterval(timer);
					Idle.watch();
					// $state.go('dashboard'); // Refresh the parent page
					window.location = "/intelligentdashboard/#/globalview";
					// window.location.reload();
				}
			}
		}, 1000);

		$scope.openpopup = function(size) {

			$rootScope.hidepagetop = true;
			$rootScope.menubarPopup = false;
			$scope.win = window.open(
					"/intelligentdashboard/#/Summaryslideshowpopup", "popup",
					"width=1850,height=900,left=30,top=50");

		}

		$scope.gotodashboard = function() {
			$state.go('dashboard');
		};

		$scope.myInterval = 5000;
		$scope.myPopupInterval = 10000;
		$scope.noWrapSlides = false;
		$scope.noPopupWrapSlides = false;
		$scope.active = 0;
		$scope.popupactive = 0;
		var slides = $scope.slides = [];
		var popupslides = $scope.popupslides = [];
		var currIndex = 0;
		var currPopupIndex = 0;
		var contenturl;
		$scope.popupslideimg = [];

		$scope.addPopUpSlide = function(i) {

			var newPopupWidth = 600 + popupslides.length + 1;

			// $scope.popupslideimg = [
			// "app/pages/operational/SummarySlideShow/SummarypopupSlides.html",
			// "app/pages/operational/SummarySlideShow/SummarypopupSlides.html"];
			// $scope.popupslidetxt = [ "Requirements", "Design",
			// "Execution","Defects" ];

			popupslides.push({
				image : $scope.popupslideimg[i],
				// text : $scope.popupslidetxt[i],
				id : currPopupIndex++
			});
		};

		for (var i = 0; i < prjcnt; i++) {
			contenturl = "app/pages/operational/SummarySlideShow/SummarypopupSlides.html";
			$scope.popupslideimg.push(contenturl);
			$scope.addPopUpSlide(i);

		}

	}

})();
