/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle.lifecycle').controller(
			'KpiDashboardCtrl', KpiDashboardCtrl);

	/** @ngInject */
	function KpiDashboardCtrl($sessionStorage, AES, localStorageService,
			baSidebarService, $base64, $element, $scope, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths, $state, toastr) {

		$rootScope.menubar = false;
		$rootScope.var1 = true;
		$rootScope.var5 = false;
		$scope.selected = localStorageService.get('selected');

		var token = AES.getEncryptedValue();
		var config = {
			headers : {
				'Authorization' : token
			}
		};

		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');

		$scope.pageChangedLevel = function(pageno) {
			$rootScope.pageno = pageno;
			$scope.lifecycleDashboardDetails($rootScope.pageno);

		};

		var vm = this;
		vm.total_count = 0;
		$scope.itemsPerPage = 5;

		$scope.redirectDashboard = function(dashName) {
			$http.get(
					"./rest/lifeCycleServices/redirectDashboard?dashName="
							+ dashName, config).success(function(response) {
				$scope.redirectDetails = response;
				$scope.changeRoute($scope.redirectDetails[0]);
			});

		}

		$scope.lifecycleDashboardDetails = function(start_index) {
			$scope.index = start_index;
			$http.get(
					"./rest/lifeCycleServices/lifecycleDashboardDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				$scope.lifecycleDashboardTableDetails = response;
			});
		};
		// Dashboard details count	
		$rootScope.initialcountofDetails = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("rest/lifeCycleServices/DashboardDetailsCount", config)
					.success(function(response) {
						$rootScope.detailsCount = response;
					});
		};

		$scope.createNewDashboard = function() {
			$rootScope.component = false;
			localStorageService.remove('component');
			$state.go("createDashbaord");
		}

		$scope.redirect = function() {
			$state.go("lifecycledashboard");
		}

		$scope.updateKpiDashboard = function(form) {
			var oldrel = localStorageService.get('selected');
			$scope.relName = form.relname;
			$scope.kpiispublic = form.kpiispublic;
			$scope.products = $scope.upprodsel;
			var fromdat = $scope.fromdate;
			var todat = $scope.todate;

			var token = AES.getEncryptedValue();
			var productData = {
				oldRelName : oldrel,
				relName : $scope.relName,
				products : $scope.products,
				owner : $rootScope.loggedInuserId,
				fromDate : fromdat,
				toDate : todat,
				ispublic : $scope.kpiispublic
			}
			$http({
				url : "./rest/lifeCycleServices/updateKpiDashboard",
				method : "POST",
				params : productData,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {

								if (response == 0) {
									$scope.open('app/LifeCycle/lifecycle/saveDashboardMsg.html',
													'sm');
								} else {
									$scope.open('app/LifeCycle/lifecycle/existDashboardMsg.html',
													'sm');
								}
							});
			setTimeout(function() {
				$scope.redirect();
			}, 2000);
		}
		// Delete Dashboard Popup Method	
		$scope.deleteDashboard = function(dashid) {

			$scope.data = dashid;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/LifeCycle/lifecycle/deleteDashboard.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Removes Dashboard information completely	  
		$scope.deleteDashboardInfo = function(item) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.id = item._id;
			$scope.owner = item.owner;
			$scope.dashboardName = item.dashboardName;

			$http
					.get(
							"./rest/lifeCycleServices/deleteDashboardInfo?id="
									+ $scope.id + "&dashboardName="
									+ $scope.dashboardName, config)
					.success(
							function(response) {

								if (response == 0) {
									$scope.$dismiss();
									$scope.open('app/LifeCycle/lifecycle/deletedDashboardMsg.html',
													'sm');
								}
								$rootScope.initialcountofDetails();
								setTimeout(function() {
									$scope.redirecttodashboard($scope.id);
								}, 500);

							});

			$scope.redirecttodashboard = function(id) {
				/*   $scope.lifecycleDashboardTableDetails.splice(id, 1);*/
				$state.reload();
			}

			//  $scope.lifecycleDashboardDetails(1);
		}
		// Modal dialog 	  
		$scope.open = function(url, size) {
			$uibModal.open({
				animation : true,
				templateUrl : url,

				scope : $scope,
				size : size,
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		$scope.showDashboarddeleteMsg = function() {

			toastr.success('Dashboard has been deleted Successfully ');
		};

		$scope.showSuccessMsg = function() {

			toastr.success('Saved Succesfully');
		};
		$scope.showUpdatedMsg = function() {

			toastr.success('Updated Succesfully');
		};
		$scope.showWarningMsg = function(value) {
			$scope.value = value;
			toastr.warning($scope.value + " already exists", 'Warning');
		};

		$scope.cancel = function() {

			$state.go("lifecycledashboard");

		};

		$scope.prodView = function(selected) {
			localStorageService.set('selected', selected);
			$state.go('updateProdDashbaord');
		};

		// PRODUCT DROP DOWN LIST
		$scope.getProductName = function(start_index) {
			
			$scope.index = start_index;
			$http.get(
					"./rest/lifeCycleServices/lifecycleDashboardDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				$scope.dropdetails = response;

				$scope.multiproducts = [];
				for (var i = 0; i < $scope.dropdetails.length; i++) {
					$scope.multiproducts.push({
						"label" : $scope.dropdetails[i].dashboardName
					});
				}
				$scope.updateKpiTableDetails();
			});

		}
		$scope.getProjectList = function() {
			$http.get(
					"./rest/lifeCycleServices/getProjectList?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.projectlists = response;

					});

		}
		$scope.getSprintList = function() {
			$http.get(
					"./rest/lifeCycleServices/getSprintList?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.sprintList = response;

					});

		}
		$scope.getRelStartDate = function() {
			$scope.selected = localStorageService.get('selected');

			$http.get(
					"./rest/lifeCycleServices/getRelStartDate?selected="
							+ $scope.selected, config).success(
					function(response) {
						var fromdtSel = new Date(response);
						$scope.fromdate = response;
						$scope.fromdt = fromdtSel;

					});

		}
		$scope.getRelEndDate = function() {
			
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getRelEndDate?selected="
							+ $scope.selected, config).success(
					function(response) {
						var todtSel = new Date(response);
						$scope.todate = response;
						$scope.todt = todtSel;
					});

		}
		
		$scope.getispublicdashboard = function() {
			
			$scope.selected = localStorageService.get('selected');
			$scope.dashboardType = localStorageService.get('kpidashboardtype');
			$http.get(
					"./rest/lifeCycleServices/getispublic?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.kpiispublic=response;
						if(response == "true"){
						  $( "#chkpublic" ).prop( "checked", response );
						}
						
						if($scope.dashboardType == "my"){
							$scope.kpihead = true;
						}else if($scope.dashboardType == "public"){
							$scope.kpihead = false;
						}
					});

		}

		// Get update KPI dashboard products 

		$scope.updateKpiTableDetails = function() {
			$scope.selected = localStorageService.get('selected');

			$http.get(
					"./rest/lifeCycleServices/updateKpiTableDetails?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.upprodTabDet = response;
						
					/*	for (var i = 0; i < $scope.upprodTabDet.length; i++) {
							$scope.upselproducts.push({
								"label" : $scope.upprodTabDet[i]
							});
						}
						*/
						
						$scope.upselprod = [];
						for ( var pk in $scope.upprodTabDet) {
							$scope.upselprod.push($scope.upprodTabDet[pk]);
						}

						$scope.upselpro = $scope.upselprod;
						$scope.upselproducts = [];
						for ( var pk in $scope.multiproducts) {
							if($scope.upselpro.includes($scope.multiproducts[pk].label)){
								$scope.upselproducts.push($scope.multiproducts[pk]); 
							}
						}
						//	alert($scope.upselproducts);
						/*$scope.upselproduct = $scope.upselproducts;*/
						onSelectionUpChangedproduct();
					});
		}

		$scope.getMetricList = function() {
			$scope.selected = localStorageService.get('selected');

			$http
					.get(
							"./rest/lifeCycleServices/getMetricList?selected="
									+ $scope.selected, config)
					.success(
							function(response) {
								$scope.selMetricList = response;
								if ($scope.selMetricList
										.includes("Total User Story Count")) {
									$scope.usCount = "true";
								}
								if ($scope.selMetricList
										.includes("Sprint Count")) {
									$scope.sprCount = "true";
								}
								if ($scope.selMetricList
										.includes("Total Contributor Count")) {
									$scope.contCount = "true";
								}
								if ($scope.selMetricList
										.includes("Lines of Code")) {
									$scope.locCount = "true";
								}
								if ($scope.selMetricList
										.includes("Total Commit Count")) {
									$scope.comCount = "true";
								}
								if ($scope.selMetricList
										.includes("Execution Count")) {
									$scope.exeCount = "true";
								}
								if ($scope.selMetricList
										.includes("Defects Count")) {
									$scope.defCount = "true";
								}
								if ($scope.selMetricList
										.includes("Deployed Environments")) {
									$scope.envCount = "true";
								}
								if ($scope.selMetricList
										.includes("Deployment Status")) {
									$scope.depCount = "true";
								}
								if ($scope.selMetricList
										.includes("Automated Test Pass %")) {
									$scope.testPassCount = "true";
								}
								if ($scope.selMetricList
										.includes("Incident Resolved with SLA")) {
									$scope.slaCount = "true";
								}
								if ($scope.selMetricList
										.includes("Deployment Size")) {
									$scope.depSizeCount = "true";
								}
								if ($scope.selMetricList
										.includes("Deployment Volume")) {
									$scope.depVolCount = "true";
								}
								if ($scope.selMetricList
										.includes("Deployment Failure")) {
									$scope.depFailCount = "true";
								}
								if ($scope.selMetricList
										.includes("Successful Deployment Speed")) {
									$scope.depSpeedCount = "true";
								}
							});
		}

		// GET SELECTED FROM PROJECT DROP DOWN LIST

		$scope.myEventUpListenersproduct = {
			onSelectionChanged : onSelectionUpChangedproduct,
		};

		function onSelectionUpChangedproduct() {
			;
			//alert("on:::"+JSON.stringify($scope.upselproduct));
			$scope.upprodsell = [];
			for (var i = 0; i < $scope.upselproducts.length; i++) {
				$scope.upprodsell.push($scope.upselproducts[i].label);
			}
			//remove duplicates

			var unique_array = [];
			for (var i = 0; i < $scope.upprodsell.length; i++) {
				if (unique_array.indexOf($scope.upprodsell[i]) == -1) {
					unique_array.push($scope.upprodsell[i]);
				}
			}
			$scope.upprodsel = [];
			for (var i = 0; i < unique_array.length; i++) {
				$scope.upprodsel.push(unique_array[i]);
			}
		}

		// Get create product dashboard page table details 

		$scope.getProductTableDetails = function() {
			//alert("prod tab det");
			$http.get("./rest/lifeCycleServices/productTableDetails", config)
					.success(function(response) {
						$scope.prodTabDet = response;
					});
		}
		// Get start date
		$scope.getfromdate = function(dtfrom) {
			$scope.fromdate = dtfrom;
			$scope.fromdt = dtfrom;
			localStorageService.set('dtfrom', dtfrom);

		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$scope.todate = dtto;
			$scope.todt = dtto;
			localStorageService.set('dtto', dtto);

		}

		//**Show KPI metrics

		$scope.getKpiMetrics = function() {
			$scope.getSprintCount();
			$scope.getUserStoryCount();
			$scope.getCommitCount();
			$scope.getCommitCount();
			$scope.getContributorCount();
			$scope.getLinesofCode();
			$scope.getDefectsCount();
			$scope.getExecPassPercent();
			$scope.getQaCount();
			$scope.getDevCount();
			$scope.getDeploymentData();
			$scope.getTotalDeployment();
			$scope.getWeeklyDeployment();
			$scope.getDeploymentFailure();
			$scope.getWeeklyDeploymentFailure();
			$scope.getDeploymentSize();
			$scope.getAutoTestPassPercent();
		}

		$scope.getSprintCount = function() {

			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getkpisprintcount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.sprintCount = response;

					});

		}

		$scope.getUserStoryCount = function() {

			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getUserStoryCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.userStoryCount = response;

					});

		}

		$scope.getCommitCount = function() {

			$http.get(
					"./rest/lifeCycleServices/getCommitCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.commitCount = response;

					});
		}

		$scope.getContributorCount = function() {
			$http.get(
					"./rest/lifeCycleServices/getContributorCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.contributorCount = response;

					});
		}

		$scope.getLinesofCode = function() {
			$http.get(
					"./rest/lifeCycleServices/getlinesofcode?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.linesCode = response;

					});
		}

		$scope.getDefectsCount = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDefectsCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.defectsCount = response;

					});

		}

		$scope.getExecPassPercent = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getExecPassPercent?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.execPassPercent = response;

					});
		}

		$scope.getEnvironmentsCount = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getEnvironmentsCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.environmentsCount = response;

					});
		}
		$scope.getQaCount = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getQaCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.qaCountPass = response[0];
						$scope.qaCountFail = response[1];

					});
		}
		$scope.getDevCount = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDevCount?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.devCountPass = response[0];
						$scope.devCountFail = response[1];

					});
		}

		$scope.getDeploymentData = function() {
			$http.get(
					"./rest/lifeCycleServices/getdeploymentdata?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.passcount = response[0];
						$scope.failcount = response[1];
					});
		}

		$scope.getDepSpeedMax = function() {

			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDepSpeedMax?selected="
							+ $scope.selected, config).success(
					function(response) {

						var guage = new JustGage({
							id : "maxgauge",
							value : response,
							min : 0,
							max : 50,
							decimals : 0,
							gaugeWidthScale : 0.6,
							symbol : " min",

							pointer : true,
							pointerOptions : {
								toplength : -15,
								bottomlength : 5,
								bottomwidth : 6,
								color : '#8e8e93',
								stroke : '#ffffff',
								stroke_width : 1,
								stroke_linecap : 'round'
							},

							counter : true,
							relativeGaugeSize : true

						});

					});

		}

		$scope.getDepSpeedMin = function() {

			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDepSpeedMin?selected="
							+ $scope.selected, config).success(
					function(response) {

						var guage = new JustGage({
							id : "mingauge",
							value : response,
							min : 0,
							max : 30,
							decimals : 0,
							gaugeWidthScale : 0.6,
							symbol : " min",

							pointer : true,
							pointerOptions : {
								toplength : -15,
								bottomlength : 5,
								bottomwidth : 6,
								color : '#8e8e93',
								stroke : '#ffffff',
								stroke_width : 1,
								stroke_linecap : 'round'
							},

							counter : true,
							relativeGaugeSize : true

						});

					});

		}
		$scope.getDepSpeedAvg = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDepSpeedAvg?selected="
							+ $scope.selected, config).success(
					function(response) {

						var guage = new JustGage({
							id : "avggauge",
							value : response,
							min : 0,
							max : 30,
							decimals : 0,
							gaugeWidthScale : 0.6,
							symbol : " min",

							pointer : true,
							pointerOptions : {
								toplength : -15,
								bottomlength : 5,
								bottomwidth : 6,
								color : '#8e8e93',
								stroke : '#ffffff',
								stroke_width : 1,
								stroke_linecap : 'round'
							},

							counter : true,
							relativeGaugeSize : true

						});

					});

		}

		$scope.getDepSpeedAvgWeekly = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getDepSpeedAvgWeekly?selected="
							+ $scope.selected, config).success(
					function(response) {

						var guage = new JustGage({
							id : "weeklyavggauge",
							value : response,
							min : 0,
							max : 30,
							decimals : 0,
							gaugeWidthScale : 0.6,
							symbol : " min",

							pointer : true,
							pointerOptions : {
								toplength : -15,
								bottomlength : 5,
								bottomwidth : 6,
								color : '#8e8e93',
								stroke : '#ffffff',
								stroke_width : 1,
								stroke_linecap : 'round'
							},

							counter : true,
							relativeGaugeSize : true

						});

					});

		}

		$scope.getTotalDeployment = function() {
			$http.get(
					"./rest/lifeCycleServices/gettotaldeployment?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.totDeployment = response;
					});
		}

		$scope.getWeeklyDeployment = function() {

			$http.get(
					"./rest/lifeCycleServices/getweeklydeployment?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.totDeploymentWeekly = response;

					});
		}

		$scope.getDeploymentFailure = function() {

			$http.get(
					"./rest/lifeCycleServices/getdeploymentfailure?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.totDeploymentFailure = response;

					});
		}

		$scope.getWeeklyDeploymentFailure = function() {

			$http.get(
					"./rest/lifeCycleServices/getweeklydeploymentfailure?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.totDeploymentFailWeekly = response;

					});
		}
		$scope.getAutoTestPassPercent = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getAutoTestPassPercent?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.autoTestPassPer = response;

					});
		}
		$scope.getDeploymentSize = function() {

			$http.get(
					"./rest/lifeCycleServices/getDeploymentSize?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.totDeploymentSize = response;

					});
		}

		$scope.getIncidentResolvedSLA = function() {

			$http.get(
					"./rest/lifeCycleServices/getincidentresolved?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.slaIncidentResolved = response;

					});
		}

	}
})();