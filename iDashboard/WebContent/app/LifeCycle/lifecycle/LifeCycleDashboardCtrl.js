/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle.lifecycle').controller(
			'LifeCycleDashboardCtrl', LifeCycleDashboardCtrl);

	/** @ngInject */
	function LifeCycleDashboardCtrl($sessionStorage, AES, localStorageService,
			baSidebarService, $base64, $element, $scope, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths, $state, toastr) {
	
		$rootScope.buildJob = "";
		$rootScope.caProjectName = "";
		$rootScope.menubar = false;
		$rootScope.var1 = false;
		$rootScope.var2 = true;
		$rootScope.var3 = false;
		$rootScope.var4 = false;
		$rootScope.var5 = false;
		$rootScope.var6 = false;
		$scope.selected = localStorageService.get('selected');
		$scope.itemsPerPage = 5;

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
		

		$scope.redirectDashboard = function(dashName) {
			$http.get(
					"./rest/lifeCycleServices/redirectDashboard?dashName="
							+ dashName, config).success(function(response) {
				$scope.redirectDetails = response;
				$scope.changeRoute($scope.redirectDetails[0]);
			});

		}

		
		$rootScope.initialcountofDetails = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("rest/lifeCycleServices/DashboardDetailsCount",
							config)
					.success(
							function(response) {
								$rootScope.detailsCount = response;
								
								$scope.lifecycleDashboardDetails(1);

								$http.get("rest/lifeCycleServices/DashboardDetailspulicCount",
												config)
										.success(
												function(response) {
													$rootScope.detailspublicCount = response;
													
													if ($rootScope.detailspublicCount == 0) {
														$rootScope.detailspublicCount=0;
													} else {
														$scope
																.lifecycleDashboardpublicDetails(1);
													}

												});
							});
		};

		$scope.lifecycleDashboardDetails = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;

			$http.get(
					"./rest/lifeCycleServices/lifecycleDashboardDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				// $scope.IsVisible=false;
				$scope.lifecycleDashboardTableDetails = response;
				

			});

		};

		$scope.lifecycleDashboardpublicDetails = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;

			$http.get(
					"./rest/lifeCycleServices/lifecycleDashboardpublicDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				$scope.lifecycleDashboardTablepublicDetails = response;
			});
		};

		$scope.createNewDashboard = function() {
			$rootScope.component = false;
			localStorageService.remove('component');
			$rootScope.isdashboardpublic="";
			$rootScope.formelem=true;
			$state.go("createDashbaord");
		
		}

		$scope.changeRoute = function(item,dashboardtype) {
			
			if(dashboardtype=='my') {
				$rootScope.formelem=true;
			}else if(dashboardtype=='public'){
				$rootScope.formelem=false;
			}

			$rootScope.loggedInuserId = localStorageService
					.get('loggedInuserId');

			localStorageService.set('component', true);
			localStorageService.set('dashboardName', item.dashboardName);
			localStorageService.set('description', item.description);
			localStorageService.set('owner', item.owner);
			localStorageService.set('component', item.component);
			localStorageService.set('dashid', item._id);
			localStorageService.set('ispublic', item.ispublic);

			$rootScope.dashboardName = localStorageService.get('dashboardName');
			$rootScope.description = localStorageService.get('description');
			$rootScope.owner = localStorageService.get('owner');
			$rootScope.component = localStorageService.get('component');
			$rootScope.dashid = localStorageService.get('dashid');
			$rootScope.isdashboardpublic = localStorageService.get('ispublic');
			//$state.go("build")
			$state.go("viewDashbaord");

		}
		$scope.saveDashboard = function(form) {

			if (form.ispublic) {
				$scope.ispublicselected = true;
			} else {
				$scope.ispublicselected = false;
			}

			$scope.dashName = form.dashname;
			$scope.description = form.description;
			$scope.owner = form.owner;

			var token = AES.getEncryptedValue();
			/*   var config = {headers: {
			         'Authorization': token
			         }};*/

			var lifecycledata = {
				dashboardName : $scope.dashName,
				description : $scope.description,
				ispublic :  $scope.ispublicselected,
				components : {
					'buildJobName' : $rootScope.buildJob,
					'codeAnalysisProjectName' : $rootScope.caProjectName,
					'gitName' : $rootScope.UserName,
					'gitType' : $rootScope.selectedtype,
					'gitRepo' : $rootScope.selectedRepo,
					'domainName' : $rootScope.selecteddomain,
					'projectName' : $rootScope.selectedproject,
					'releaseName' : $rootScope.selectedrelease,
					'transactionName' : $rootScope.selectedtransaction,
					'rallyProject' : $rootScope.selectedRallyProject,
					'jiraProject' : $rootScope.selectedJiraProject,
					'fortifyProject' : $rootScope.selectedFortifyProject,
					'fortifyVersion' : $rootScope.selectedFortifyVersion,
					'octaneProject' : $rootScope.selectedOctaneProject,
					'cookbookName' : $rootScope.cookbookname
				}
			}
			$http({
				url : "./rest/lifeCycleServices/saveDashboard",
				method : "POST",
				params : lifecycledata,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {
								if (response == 0) {
									$scope
											.open(
													'app/LifeCycle/lifecycle/saveDashboardMsg.html',
													'sm');
								} else {
									$scope
											.open(
													'app/LifeCycle/lifecycle/existDashboardMsg.html',
													'sm');
								}
							});
			setTimeout(function() {
				$scope.redirect();
			}, 2000);
		}

		$scope.redirect = function() {
			$state.go("lifecycledashboard");
		}

		$scope.updateDashboard = function(form, dashid) {
			
			if(form.ispublic) {
				$scope.ispublicselected=true;
			}else {
				$scope.ispublicselected=false;
			}

			$scope.dashName = form.dashname;
			$scope.description = form.description;
			$scope.owner = form.owner;
			$scope.id = dashid;

			var lifecycledata = {
				_id : $scope.id,
				dashboardName : $scope.dashName,
				description : $scope.description,
				ispublic :  $scope.ispublicselected,
				owner : $scope.owner,
				components : {
					'buildJobName' : $rootScope.buildJob,
					'codeAnalysisProjectName' : $rootScope.caProjectName,
					'gitName' : $rootScope.UserName,
					'gitType' : $rootScope.selectedtype,
					'gitRepo' : $rootScope.selectedRepo,
					'domainName' : $rootScope.selecteddomain,
					'projectName' : $rootScope.selectedproject,
					'releaseName' : $rootScope.selectedrelease,
					'transactionName' : $rootScope.selectedtransaction,
					'rallyProject' : $rootScope.selectedRallyProject,
					'jiraProject' : $rootScope.selectedJiraProject,
					'octaneProject' : $rootScope.selectedOctaneProject,
					'cookbookName' : $rootScope.cookbookname
				}
			}
			$http({
				url : "./rest/lifeCycleServices/updateDashboard",
				method : "POST",
				params : lifecycledata,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {

								if (response == 0) {

									$scope
											.open(
													'app/LifeCycle/lifecycle/updatedDashboardMsg.html',
													'sm');
								} else {

									$scope
											.open(
													'app/LifeCycle/lifecycle/existDashboardMsg.html',
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

			$http.get(
					"./rest/lifeCycleServices/deleteDashboardInfo?id="
							+ $scope.id + "&dashboardName="
							+ $scope.dashboardName, config).success(
					function(response) {

						/*	   if(response==0){
								    $scope.$dismiss();
								    $scope.open('app/LifeCycle/lifecycle/deletedDashboardMsg.html','sm');
							   }
						 */
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

		$scope.kpiView = function(selected,dashboardType) {
			localStorageService.set('selected', selected);
			localStorageService.set('kpidashboardtype', dashboardType);
			
			$state.go('updateKpiDashbaord');
		};
		$scope.createView = function(selected) {
			$state.go('createProdDashbaord');
		};
		$scope.createKpiView = function(selected) {
			$state.go('createKpiDashbaord');
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
			});
			$scope.updateProdTableDetails();
		}

		$scope.getRelStartDate = function() {
			$scope.selected = localStorageService.get('selected');

			$http.get(
					"./rest/lifeCycleServices/getRelStartDate?selected="
							+ $scope.selected, config).success(
					function(response) {
						var fromdtSel = new Date(response);

						$scope.fromdt = fromdtSel;
					});

		}
		$scope.getRelEndDate = function() {
			//alert("getRelEndDat");
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getRelEndDate?selected="
							+ $scope.selected, config).success(
					function(response) {
						var todtSel = new Date(response);
						$scope.todt = todtSel;
					});

		}
		
		$scope.getispublicdashboard = function() {
			
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getispublic?selected="
							+ $scope.selected, config).success(
					function(response) {
						//alert(response);
						$scope.kpiisdashboardpublic=response;
					});

		}

		// GET SELECTED FROM PROJECT DROP DOWN LIST
		$scope.myEventListenersproduct = {
			onSelectionChanged : onSelectionChangedproduct,
		};

		function onSelectionChangedproduct() {
			$rootScope.prodsel = [];
			for (var i = 0; i < $scope.selproduct.length; i++) {
				$rootScope.prodsel.push($scope.selproduct[i].label);
			}
		}

		// GET SELECTED FROM PROJECT DROP DOWN LIST

		$scope.myEventUpListenersproduct = {
			onSelectionChanged : onSelectionUpChangedproduct,
		};

		function onSelectionUpChangedproduct() {

			//alert("on:::"+JSON.stringify($scope.upselproduct));
			$scope.upprodsell = [];
			// $scope.multiproducts = $scope.upselproduct;
			for (var i = 0; i < $scope.upselproduct.length; i++) {
				$scope.upprodsell.push($scope.upselproduct[i].label);
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

		$scope.SaveProdDashboard = function(form) {

			$scope.relName = form.relname;
			$scope.products = $rootScope.prodsel;
			var token = AES.getEncryptedValue();
			var productData = {
				relName : $scope.relName,
				products : $scope.products,
				owner : $rootScope.loggedInuserId
			}
			$http({
				url : "./rest/lifeCycleServices/saveProductDashboard",
				method : "POST",
				params : productData,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {

								if (response == 0) {
									$scope
											.open(
													'app/LifeCycle/lifecycle/saveDashboardMsg.html',
													'sm');
								} else {
									$scope
											.open(
													'app/LifeCycle/lifecycle/existDashboardMsg.html',
													'sm');
								}
							});
			setTimeout(function() {
				$scope.redirect();
			}, 2000);
		}

		$scope.SaveKpiDashboard = function(form) {

			$scope.relName = form.relname;
			$scope.products = $rootScope.prodsel;
			var fromdt = localStorageService.get('dtfrom');
			var todt = localStorageService.get('dtto');
			$scope.selectedKpiList = [];
			$scope.getonlyselected;
			var token = AES.getEncryptedValue();
			$scope.getSelectedkpi = localStorageService.get('selectKpiItems');
			$scope.kpiispublic=form.kpiispublic;

			if ($scope.getSelectedkpi == null
					|| $scope.getSelectedkpi == undefined) {
				toastr.warning('Please select Metrics from the List !');

			} else {
				$scope.getonlyselected = $scope.getSelectedkpi[0];

				var productData = {
					relName : $scope.relName,
					products : $scope.products,
					owner : $rootScope.loggedInuserId,
					fromDate : fromdt,
					toDate : todt,
					ispublic : $scope.kpiispublic,
					selectKpiItems : JSON.stringify($scope.getonlyselected)
				}
				$http({
					url : "./rest/lifeCycleServices/saveKpiDashboard",
					method : "POST",
					params : productData,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {

									if (response == 0) {
										$scope
												.open(
														'app/LifeCycle/lifecycle/saveDashboardMsg.html',
														'sm');
									} else {
										$scope
												.open(
														'app/LifeCycle/lifecycle/existDashboardMsg.html',
														'sm');
									}
								});
				setTimeout(function() {
					$scope.redirect();
				}, 2000);
			}

		}

		$scope.updateProdDashboard = function(form) {

			$scope.relName = form.relname;
			$scope.products = $scope.upprodsel;
			var dtae = form.fromdt;
			$scope.tae = form.fromdt;
			$scope.ispublic=form.ispublic;

			var token = AES.getEncryptedValue();
			var productData = {
				relName : $scope.relName,
				products : $scope.products,
				owner : $rootScope.loggedInuserId
			}
			$http({
				url : "./rest/lifeCycleServices/updateProductDashboard",
				method : "POST",
				params : productData,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {

								if (response == 0) {
									$scope
											.open(
													'app/LifeCycle/lifecycle/saveDashboardMsg.html',
													'sm');
								} else {
									$scope
											.open(
													'app/LifeCycle/lifecycle/existDashboardMsg.html',
													'sm');
								}
							});
			setTimeout(function() {
				$scope.redirect();
			}, 2000);
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

			$rootScope.fromDate = dtfrom;
			localStorageService.set('dtfrom', dtfrom);

		}
		// Get end date
		$scope.gettodate = function(dtto) {
			$rootScope.toDate = dtto;
			localStorageService.set('dtto', dtto);

		}

		// Get update product dashboard page table details 
		$scope.updateProductTableDetails = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/updateProductTableDetails?selected="
							+ $scope.selected, config).success(
					function(response) {
						debugger;
						$scope.upprodTabDet = response;
						/*$scope.upselproducts = [];
						$scope.upselproduct = [];
						for (var i = 0; i < $scope.upprodTabDet.length; i++) {
							$scope.upselproducts.push({
								"id" : i,

								"label" : $scope.upprodTabDet[i].productName
							});
						}
						//alert($scope.upselproducts);
						$scope.upselproduct = $scope.upselproducts;
						
						
						onSelectionUpChangedproduct();
						*/
					});
		}

		$scope.updateProdTableDetails = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/updateProdTableDetails?selected="
							+ $scope.selected, config).success(
					function(response) {
						debugger;
						$scope.upprodTableDet = response;
						/*$scope.upselproducts = [];
						$scope.upselproduct = [];
						for (var i = 0; i < $scope.upprodTabDet.length; i++) {
							$scope.upselproducts.push({
								"id" : i,

								"label" : $scope.upprodTabDet[i].productName
							});
						}
						//alert($scope.upselproducts);
						$scope.upselproduct = $scope.upselproducts;
						*/
						
						$scope.upselprod = [];
						for ( var pk in $scope.upprodTableDet) {
							$scope.upselprod.push($scope.upprodTableDet[pk]);
						}

						$scope.upselpro = $scope.upselprod;
						$scope.upselproducts = [];
						for ( var pk in $scope.multiproducts) {
							if($scope.upselpro.includes($scope.multiproducts[pk].label)){
								$scope.upselproducts.push($scope.multiproducts[pk]); 
							}
						}
						$scope.upselproduct = $scope.upselproducts;
						onSelectionUpChangedproduct();
					});
		}

		// Get update KPI dashboard products 

		$scope.updateKpiTableDetails = function() {
			$scope.selected = localStorageService.get('selected');
			$http.get(
					"./rest/lifeCycleServices/getUpdateKpiTableDetails?selected="
							+ $scope.selected, config).success(
					function(response) {
						$scope.upprodTabDet = response;
						$scope.upselproducts = [];
						$scope.upselproduct = [];
						for (var i = 0; i < $scope.upprodTabDet.length; i++) {
							$scope.upselproducts.push({
								"label" : $scope.upprodTabDet[i]
							});
						}
						//alert($scope.upselproducts);
						$scope.upselproduct = $scope.upselproducts;
						onSelectionUpChangedproduct();
					});
		}

		// Get Release Dashboard Table Details 

		$scope.getproductDashboardTable = function() {
			$http.get("./rest/lifeCycleServices/productDashboardTable", config)
					.success(function(response) {
						$scope.prodTabInfo = response;
						$scope.safeProdTabInfo = response;
					});
		}

		// Get KPI Dashboard Table Details 

		$rootScope.initialkpicountofDetails = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get("rest/lifeCycleServices/kpiDetailsCount",
							config)
					.success(
							function(response) {
								$rootScope.detailsCount = response;
								
								$scope.getKpiDashboardTable();

								$http
										.get(
												"rest/lifeCycleServices/kpiDetailspulicCount",
												config)
										.success(
												function(response) {
													$rootScope.kpidetailspublicCount = response;
													
													if ($rootScope.kpidetailspublicCount == 0) {
														$rootScope.kpidetailspublicCount=0;
													} else {
														$scope.getKpipublicDashboardTable();
													}

												});

							});

		};

		$scope.getKpiDashboardTable = function() {
			$http.get("./rest/lifeCycleServices/kpiDashboardTable", config)
					.success(function(response) {
						$scope.kpiTabInfo = response;
						$scope.safeKpiTabInfo = response;
					});
		}
		
		$scope.getKpipublicDashboardTable = function() {
			$http.get("./rest/lifeCycleServices/kpipublicDashboardTable", config)
			.success(function(response) {
				$scope.kpipublicTabInfo = response;
				$scope.safeKpipublicTabInfo = response;
			});
		}

		// Modal dialog
		$scope.openpopup = function(url, size, relName, owner) {
			$scope.relName = relName;
			$scope.owner = owner;
			$scope.getproductPopup($scope.relName, $scope.owner);
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

		// Get Release Dashboard Info popup Details 

		$scope.getproductPopup = function(relName, owner) {
			$scope.relName = relName;
			$scope.owner = owner;
			$http.get(
					"./rest/lifeCycleServices/productPopupDetails?relName="
							+ $scope.relName, config).success(
					function(response) {
						$scope.prodInfo = response;
					});
		}

		// Get KPI Dashboard Info popup Details 

		$scope.getKpiPopup = function(relName, owner) {
			$scope.relName = relName;
			$http.get(
					"./rest/lifeCycleServices/kpiPopupDetails?relName="
							+ $scope.relName, config).success(
					function(response) {
						$scope.prodInfo = response;

					});
		}

		// Delete Dashboard Popup Method	
		$scope.deleteRelDashboard = function(dashid) {

			$scope.data = dashid;
			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/LifeCycle/lifecycle/deleteRelDashboard.html',
						scope : $scope,
						size : 'sm',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		// Delete KPI Dashboard Popup Method	
		$scope.deleteKpiDashboard = function(dashid) {

			$scope.data = dashid;
			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/LifeCycle/lifecycle/deleteKpiDashboard.html',
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
		$scope.deleteRelDashboardInfo = function(id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.id = id;
			var userId = localStorageService.get('owner');
			$http.get(
					"./rest/lifeCycleServices/deleteRelDashboardInfo?id="
							+ $scope.id, config).success(function(response) {
				/* 
				if(response==0){
				    $scope.$dismiss();
				    $scope.open('app/LifeCycle/lifecycle/deletedDashboardMsg.html','sm');
				}
				 */
				$rootScope.initialcountofDetails();
				setTimeout(function() {
					$scope.redirecttodashboard(id);
				}, 500);

			});

			$scope.redirecttodashboard = function(id) {
				/*   $scope.lifecycleDashboardTableDetails.splice(id, 1);*/
				$state.reload();
			}

			//  $scope.lifecycleDashboardDetails(1);

		}

		// Removes KPI Dashboard information completely	  
		$scope.deleteKpiDashboardInfo = function(id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.id = id;
			var userId = localStorageService.get('owner');
			$http.get(
					"./rest/lifeCycleServices/deleteKpiDashboardInfo?id="
							+ $scope.id, config).success(function(response) {
				/*
				if(response==0){
				    $scope.$dismiss();
				    $scope.open('app/LifeCycle/lifecycle/deletedDashboardMsg.html','sm');
				}
				 */
				$rootScope.initialcountofDetails();
				setTimeout(function() {
					$scope.redirecttodashboard(id);
				}, 500);

			});

			$scope.redirecttodashboard = function(id) {
				/*   $scope.lifecycleDashboardTableDetails.splice(id, 1);*/
				$state.reload();
			}

			//  $scope.lifecycleDashboardDetails(1);

		}
		$scope.getSelectedTools = function() {
			$http
					.get("./rest/lifeCycleServices/getSelectedLCTools", config)
					.success(
							function(response) {

								$scope.selectedLCTools = response;
								$scope.selectedKeyLists = [];
								for (var i = 0; i < $scope.selectedLCTools.length; i++) {
									if ($scope.selectedLCTools[i].key == "codeQuality") {
										$scope.selectedKeyLists
												.push({
													"title" : "Code Quality",
													"path" : "app\\LifeCycle\\charts\\CodeAnalysisChart\\CodeAnalysisHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "chef") {
										$scope.selectedKeyLists
												.push({
													"title" : "Chef",
													"path" : "app\\LifeCycle\\charts\\chefDataChart\\chefDataHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "build") {
										$scope.selectedKeyLists
												.push({
													"title" : "Build",
													"path" : "app\\LifeCycle\\charts\\buildChart\\buildMetricsHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "gitHub") {
										$scope.selectedKeyLists
												.push({
													"title" : "Github",
													"path" : "app\\LifeCycle\\charts\\GitHub\\GitHubHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "testManagement") {
										$scope.selectedKeyLists
												.push({
													"title" : "Test Management",
													"path" : "app\\LifeCycle\\charts\\TMChart\\testManagementHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "userStory") {
										$scope.selectedKeyLists
												.push({
													"title" : "User Story Data",
													"path" : "app\\LifeCycle\\lifecycle\\userstories\\UserStoryAnalysisHome.html"
												});
									}
									if ($scope.selectedLCTools[i].key == "fortify") {
										$scope.selectedKeyLists
												.push({
													"title" : "Fortify",
													"path" : "app\\LifeCycle\\lifecycle\\fortify\\fortifyHome.html"	
												});
									}
									if ($scope.selectedLCTools[i].key == "octane") {
										$scope.selectedKeyLists
												.push({
													"title" : "ALM Octane",
													"path" : "app\\LifeCycle\\charts\\Octane\\OctaneHome.html"
												});
									}

								}
							});

		}

		$scope.getKpiMetricList = function() {
			$http.get(
					"./rest/lifeCycleServices/getKpiMetricList?relName="
							+ $scope.relName, config).success(
					function(response) {
						$scope.kpiMetricLists = response;
						$scope.getAvailList(response);
					});
		}

		$scope.getAvailList = function(response) {
			$scope.selectFaIndex = 0;
			$scope.SelectedAvailItems = [];
			$scope.SelectedSelectedListItems = [];
			$scope.SelectedListItems = [ [] ];
			$scope.AvailableListItems = [ [] ];
			$scope.DefaultListItems = [];
			var arr1 = [];

			for (var i = 0; i < response.length; i++) {
				arr1.push({
					"metricName" : response[i].metricName
				});

			}

			$scope.DefaultListItems.push(arr1);

			angular.copy($scope.DefaultListItems, $scope.AvailableListItems);

		}

		$scope.btnRight = function() {
			//move selected.
			angular.forEach($scope.SelectedAvailItems, function(value, key) {
				this.push(value);
			}, $scope.SelectedListItems[$scope.selectFaIndex]);

			//remove the ones that were moved.
			angular
					.forEach(
							$scope.SelectedAvailItems,
							function(value, key) {
								for (var i = $scope.AvailableListItems[$scope.selectFaIndex].length - 1; i >= 0; i--) {
									if ($scope.AvailableListItems[$scope.selectFaIndex][i].metricName == value.metricName) {
										$scope.AvailableListItems[$scope.selectFaIndex]
												.splice(i, 1);
									}
								}
							});
			$scope.SelectedAvailItems = [];
			localStorageService.set('selectKpiItems', $scope.SelectedListItems);

		};

		$scope.btnLeft = function() {
			//move selected.
			angular.forEach($scope.SelectedSelectedListItems, function(value,
					key) {
				this.push(value);
			}, $scope.AvailableListItems[$scope.selectFaIndex]);

			//remove the ones that were moved from the source container.
			angular
					.forEach(
							$scope.SelectedSelectedListItems,
							function(value, key) {
								for (var i = $scope.SelectedListItems[$scope.selectFaIndex].length - 1; i >= 0; i--) {
									if ($scope.SelectedListItems[$scope.selectFaIndex][i].metricName == value.metricName) {
										$scope.SelectedListItems[$scope.selectFaIndex]
												.splice(i, 1);
									}
								}
							});
			$scope.SelectedSelectedListItems = [];
			localStorageService.set('selectKpiItems', $scope.SelectedListItems);
		};

	}
})();