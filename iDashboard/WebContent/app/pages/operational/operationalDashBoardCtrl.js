/**
 * @author v.lugovksy created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages').controller(
			'OperationalDashboardCtrl', OperationalDashboardCtrl);

	/** @ngInject */
	function OperationalDashboardCtrl($sessionStorage, $base64, $element,
			$scope, $http, UserService, $timeout, $uibModal, $rootScope,
			baConfig, layoutPaths, $state, localStorageService, toastr,$window) {
		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}
		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		// $rootScope.templatename = localStorageService.get('templatename');
		$rootScope.tool = localStorageService.get('tool');
		
		$scope.isVisiablepubicview = localStorageService.get('isEnablepublicopt')
		
		
		
		//		$rootScope.buildJob = "Build";
		//		$rootScope.calevel2 = "Project";
		$rootScope.menubar = false;
		$rootScope.var1 = true;
		$rootScope.var2 = false;
		$rootScope.var3 = false;
		$rootScope.var4 = false;
		$rootScope.var7 = false;
		$rootScope.tool = localStorageService.get('tool');
		$scope.itemsPerPage = 5;

		$scope.init = function() {
			$rootScope.dataloader = true;
			
		}

		$scope.pageChangedLevel = function(pageno) {
			$rootScope.pageno = pageno;
			$scope.operationalDashboardDetails($rootScope.pageno);

		};

		$scope.pageChangedLevelpublic = function(publicpageno) {

			$rootScope.publicpageno = publicpageno;
			$scope.operationalDashboardpublicDetails($rootScope.publicpageno);

		};

		// Dashboard details count
		$rootScope.initialcountofDetails = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get("rest/operationalServices/DashboardDetailsCount",
							config)
					.success(
							function(response) {
								$rootScope.detailsCount = response;
								$scope.operationalDashboardDetails(1);

								$http
										.get(
												"rest/operationalServices/DashboardDetailspulicCount",
												config)
										.success(
												function(response) {
													$rootScope.detailspublicCount = response;
													if ($rootScope.detailspublicCount == 0) {
													} else {
														$scope
																.operationalDashboardpublicDetails(1);
													}

												});

							});

		};

		$scope.operationalDashboardDetails = function(start_index) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;

			$http.get(
					"./rest/operationalServices/operationalDashboardDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				//$scope.IsVisible=false;
				$scope.operationalDashboardTableDetails = response;

			});

		};

		$scope.operationalDashboardpublicDetails = function(start_index) {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;

			$http.get(
					"./rest/operationalServices/operationalDashboardpublicDetails?itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index, config).success(function(response) {
				$scope.operationalDashboardTablepublicDetails = response;
			});
		};

		$scope.createDashboard = function() {
			$scope.loadItems();
			$scope.loadJiraItems();
		}

		$scope.loadItems = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/createOperationalDashboard", config)
					.success(function(response) {
						$scope.rel_items = response;
						$rootScope.rel_items = $scope.rel_items;

					});
		};

		$scope.loadJiraItems = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/createJiraOperationalDashboard",
					config).success(function(response) {
				$scope.rel_jira_items = response;
				$rootScope.rel_jira_items = $scope.rel_jira_items;
			});
		};

		/*$(document).ready(function() {
		    $('#example').DataTable( {
		        "scrollY":        "500px",
		        "scrollCollapse": true,
		        "paging":         false,
		        "fixedHeader": true
		    } );
		} );*/

		//		selectViewItems();
		//		
		//		function selectViewItems() {
		//			if ($rootScope.operationalcomponent != null) {
		//				console.log($rootScope.rel_items);
		//				$scope.rel_items = updateViewData();
		//				$rootScope.operationalcomponent = null;
		//			}
		//		};
		//popup function
		/*$scope.addMetric = function() {
			$scope
			.open(
					'app/pages/operational/addMetric.html',
					'sm'); 

		}*/

		$scope.addMetric = function() {
			$uibModal.open({
				animation : true,
				templateUrl : 'app/pages/operational/addMetric.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		//save metric formula
		$scope.saveMetricFormula = function(form) {
			$scope.metric = form.metric;
			$scope.formula = form.formula;

			//console.log($scope.formula);
			var token = getEncryptedValue();

			var metricdata = {
				metric : $scope.metric,
				formula : $scope.formula,

			}

			$http({
				url : "./rest/operationalServices/saveMetric",
				method : "POST",
				params : metricdata,
				headers : {
					'Authorization' : token
				}
			})

					.success(
							function(response) {

								if (response == 0) {
									$scope
											.open(
													'app/pages/operational/alerts/saveMetric.html',
													'sm');

								} else {
									$scope
											.open(
													'app/pages/operational/alerts/existDashboardMsg.html',
													'sm');
								}
							});
			/*setTimeout(function() {
				$scope.redirect();
			}, 2000);*/

		}
		$scope.redirect = function() {
			$state.reload();
		}

		$(document).ready(function() {

			// console.log($rootScope.rel_items);
			$scope.rel_items = updateViewData();
			$scope.rel_jira_items = updateJiraViewData();
			/*$scope.changeRouteOperational();
			$scope.changeJiraRouteOperational();*/
			$rootScope.operationalcomponent = null;
			$rootScope.operationaljiracomponent = null;
		});

		$scope.vm = {};
		$scope.vmjira = {};

		$scope.selectalm = function(nam) {
			var result = eval(nam).checked;

			var checkItems = $scope.rel_items;

			for (var m = 0; m < checkItems.length; m++) {
				checkItems[m].selected = result;
				for (var i = 0; i < checkItems[m].children.length; i++) {
					checkItems[m].children[i].selected = result;
					for (var j = 0; j < checkItems[m].children[i].children.length; j++) {
						checkItems[m].children[i].children[j].selected = result;
					}
				}
			}

		};

		$scope.selectjira = function(nam) {
			var result = eval(nam).checked;

			var checkItems = $scope.rel_jira_items;

			for (var m = 0; m < checkItems.length; m++) {
				checkItems[m].selected = result;
				for (var i = 0; i < checkItems[m].children.length; i++) {
					checkItems[m].children[i].selected = result;
					for (var j = 0; j < checkItems[m].children[i].children.length; j++) {
						checkItems[m].children[i].children[j].selected = result;
					}
				}
			}

		};

		function getSelectedData() {

			var selectedItems = "";

			var selectItems = $scope.rel_items;

			if (selectItems == undefined) {
				selectedItems = "";
			}

			if (selectItems != undefined) {
				for (var m = 0; m < selectItems.length; m++) {
					var level1 = selectItems[m].level1;
					var sourceTool = selectItems[m].sourceTool;
					for (var i = 0; i < selectItems[m].children.length; i++) {
						var level2 = selectItems[m].children[i].level2;
						for (var j = 0; j < selectItems[m].children[i].children.length; j++) {
							var level3 = selectItems[m].children[i].children[j].level3;
							var levelId = selectItems[m].children[i].children[j].levelId;
							var rel_selected = selectItems[m].children[i].children[j].selected;
							if (rel_selected) {
								var obj = new Object();
								obj.level1 = level1;
								obj.level2 = level2;
								obj.level3 = level3;
								obj.levelId = levelId;
								obj.sourceTool = sourceTool;

								var Selectedstring = JSON.stringify(obj);
								if (selectedItems == "") {
									selectedItems = Selectedstring;
								} else {
									selectedItems = selectedItems + ","
											+ Selectedstring;
								}

								// console.log(Selectedstring);
								// console.log(JSON.parse(string));
							}
						}
					}
				}
			}

			return selectedItems;
		}
		;

		function getJiraSelectedData() {

			var selectedItems = "";

			var selectItems = $scope.rel_jira_items;

			if (selectItems == undefined) {
				selectedItems = "";
			}

			if (selectItems != undefined) {
				for (var m = 0; m < selectItems.length; m++) {
					var level1 = selectItems[m].level1;
					var sourceTool = selectItems[m].sourceTool;
					for (var i = 0; i < selectItems[m].children.length; i++) {
						var level2 = selectItems[m].children[i].level2;
						for (var j = 0; j < selectItems[m].children[i].children.length; j++) {
							var level3 = selectItems[m].children[i].children[j].level3;
							var levelId = selectItems[m].children[i].children[j].levelId;
							var rel_selected = selectItems[m].children[i].children[j].selected;
							if (rel_selected) {
								var obj = new Object();
								obj.level1 = level1;
								obj.level2 = level2;
								obj.level3 = level3;
								obj.levelId = levelId;
								obj.sourceTool = sourceTool;

								var Selectedstring = JSON.stringify(obj);
								if (selectedItems == "") {
									selectedItems = Selectedstring;
								} else {
									selectedItems = selectedItems + ","
											+ Selectedstring;
								}

								// console.log(Selectedstring);
								// console.log(JSON.parse(string));
							}
						}
					}
				}
			}

			return selectedItems;
		}
		;

		function updateViewData() {

			var selectedItems = $rootScope.operationalcomponent;

			var selectItems = $scope.rel_items;
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					for (var j = 0; j < selectItems[m].children[i].children.length; j++) {
						var level3 = selectItems[m].children[i].children[j].level3;
						var levelId = selectItems[m].children[i].children[j].levelId;

						//var rel_selected = selectItems[m].children[i].children[j].selected;

						for (var z = 0; z < selectedItems.length; z++) {
							var sel_levelId = selectedItems[z].levelId;
							if (sel_levelId == levelId) {
								selectItems[m].children[i].children[j].selected = true;
								break;
							}
						}
					}
				}
			}

			var checkItems = selectItems;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					// Inside Projects

					var IsProject_SelectedReleases = 0;
					var objProject = objDomain.children[j];
					for (var z = 0; z < objProject.children.length; z++) {
						// Inside Releases
						var objRel = objProject.children[z];
						if (objRel.selected == true) {
							IsProject_SelectedReleases++;
						}
					}

					var prj_checkbox = document.getElementById('Chk'
							+ objProject.level2ID);

					if (IsProject_SelectedReleases == 0) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = false;
						objProject.selected = false;
					} else if (IsProject_SelectedReleases == objProject.children.length) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = true;
						objProject.selected = true;

						IsDomain_SelectedProjects++;
					} else {
						prj_checkbox.indeterminate = true;
						IsDomain_InterProjects++;
					}

				}

				var dom_checkbox = document.getElementById('Chk'
						+ objDomain.level1ID);

				if (IsDomain_SelectedProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = true;
					objDomain.selected = true;
					SelectedDomains++;
				} else if (IsDomain_InterProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_InterProjects > 0) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_SelectedProjects == 0) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = false;
					objDomain.selected = false;
				} else {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				}
			}

			var selectall_checkbox = document.getElementById('alm_select_all');
			if (SelectedDomains == checkItems.length) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = true;
			} else if (InterDomains > 0) {
				selectall_checkbox.indeterminate = true;
			} else if (SelectedDomains == 0) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = false;
			} else {
				selectall_checkbox.indeterminate = true;
			}

			return selectItems;
		}
		;

		function updateJiraViewData() {
			var selectedItems = $rootScope.operationaljiracomponent;
			var selectItems = $scope.rel_jira_items;
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					for (var j = 0; j < selectItems[m].children[i].children.length; j++) {
						var level3 = selectItems[m].children[i].children[j].level3;
						var levelId = selectItems[m].children[i].children[j].levelId;

						//var rel_selected = selectItems[m].children[i].children[j].selected;

						for (var z = 0; z < selectedItems.length; z++) {
							var sel_levelId = selectedItems[z].levelId;
							if (sel_levelId == levelId) {
								selectItems[m].children[i].children[j].selected = true;
								break;
							}
						}
					}
				}
			}

			var checkItems = selectItems;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					// Inside Projects

					var IsProject_SelectedReleases = 0;
					var objProject = objDomain.children[j];
					for (var z = 0; z < objProject.children.length; z++) {
						// Inside Releases
						var objRel = objProject.children[z];
						if (objRel.selected == true) {
							IsProject_SelectedReleases++;
						}
					}

					var prj_checkbox = document.getElementById('JiraChk'
							+ objProject.level2ID);

					if (IsProject_SelectedReleases == 0) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = false;
						objProject.selected = false;
					} else if (IsProject_SelectedReleases == objProject.children.length) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = true;
						objProject.selected = true;

						IsDomain_SelectedProjects++;
					} else {
						prj_checkbox.indeterminate = true;
						IsDomain_InterProjects++;
					}

				}

				var dom_checkbox = document.getElementById('JiraChk'
						+ objDomain.level1ID);

				if (IsDomain_SelectedProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = true;
					objDomain.selected = true;
					SelectedDomains++;
				} else if (IsDomain_InterProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_InterProjects > 0) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_SelectedProjects == 0) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = false;
					objDomain.selected = false;
				} else {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				}
			}

			var selectall_checkbox = document.getElementById('jira_select_all');
			if (SelectedDomains == checkItems.length) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = true;
			} else if (InterDomains > 0) {
				selectall_checkbox.indeterminate = true;
			} else if (SelectedDomains == 0) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = false;
			} else {
				selectall_checkbox.indeterminate = true;
			}

			return selectItems;
		}
		;

		$scope.cancel = function() {

			$state.go("operational");

		};

		$scope.expandCompress = function(nam) {
			if (eval(nam).style.display == "") {
				eval(nam).style.display = "none";
				eval("Mod" + nam).src = "app/pages/operational/collapse.png";
			} else if (eval(nam).style.display == "none") {
				eval(nam).style.display = "";
				eval("Mod" + nam).src = "app/pages/operational/expand.png";
			}
		};

		$scope.expandCompressJira = function(nam) {
			if (eval(nam).style.display == "") {
				eval(nam).style.display = "none";
				eval("JiraMod" + nam).src = "app/pages/operational/collapse.png";
			} else if (eval(nam).style.display == "none") {
				eval(nam).style.display = "";
				eval("JiraMod" + nam).src = "app/pages/operational/expand.png";
			}
		};

		$scope.vm.Click = function(chkID, $event) {

			if ($event) { // If it is checked
				for (var i = 0; i < chkID.children.length; i++) {
					chkID.children[i].selected = true;
					for (var j = 0; j < chkID.children[i].children.length; j++) {
						chkID.children[i].children[j].selected = true;
					}
				}
			} else { // If it is checked
				for (var i = 0; i < chkID.children.length; i++) {
					chkID.children[i].selected = false;
					for (var j = 0; j < chkID.children[i].children.length; j++) {
						chkID.children[i].children[j].selected = false;
					}
				}
			}

			// alert($scope.rel_items.length);

			var checkItems = $scope.rel_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					// Inside Projects

					var IsProject_SelectedReleases = 0;
					var objProject = objDomain.children[j];

					for (var z = 0; z < objProject.children.length; z++) {
						// Inside Releases
						var objRel = objProject.children[z];
						if (objRel.selected == true) {
							IsProject_SelectedReleases++;
						}
					}

					var prj_checkbox = document.getElementById('Chk'
							+ objProject.level2ID);

					if (IsProject_SelectedReleases == 0) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = false;
						objProject.selected = false;
					} else if (IsProject_SelectedReleases == objProject.children.length) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = true;
						objProject.selected = true;

						IsDomain_SelectedProjects++;
					} else {
						prj_checkbox.indeterminate = true;
						IsDomain_InterProjects++;
					}

				}

				var dom_checkbox = document.getElementById('Chk'
						+ objDomain.level1ID);

				if (IsDomain_SelectedProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = true;
					objDomain.selected = true;
					SelectedDomains++;
				} else if (IsDomain_InterProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_InterProjects > 0) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_SelectedProjects == 0) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = false;
					objDomain.selected = false;
				} else {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				}
			}

			var selectall_checkbox = document.getElementById('alm_select_all');
			if (SelectedDomains == checkItems.length) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = true;
			} else if (InterDomains > 0) {
				selectall_checkbox.indeterminate = true;
			} else if (SelectedDomains == 0) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = false;
			} else {
				selectall_checkbox.indeterminate = true;
			}

		}

		$scope.vmjira.Click = function(chkID, $event) {

			if ($event) { // If it is checked
				for (var i = 0; i < chkID.children.length; i++) {
					chkID.children[i].selected = true;
					for (var j = 0; j < chkID.children[i].children.length; j++) {
						chkID.children[i].children[j].selected = true;
					}
				}
			} else { // If it is checked
				for (var i = 0; i < chkID.children.length; i++) {
					chkID.children[i].selected = false;
					for (var j = 0; j < chkID.children[i].children.length; j++) {
						chkID.children[i].children[j].selected = false;
					}
				}
			}

			// alert($scope.rel_items.length);

			var checkItems = $scope.rel_jira_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					// Inside Projects

					var IsProject_SelectedReleases = 0;
					var objProject = objDomain.children[j];

					for (var z = 0; z < objProject.children.length; z++) {
						// Inside Releases
						var objRel = objProject.children[z];
						if (objRel.selected == true) {
							IsProject_SelectedReleases++;
						}
					}

					var prj_checkbox = document.getElementById('JiraChk'
							+ objProject.level2ID);

					if (IsProject_SelectedReleases == 0) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = false;
						objProject.selected = false;
					} else if (IsProject_SelectedReleases == objProject.children.length) {
						prj_checkbox.indeterminate = false;
						prj_checkbox.checked = true;
						objProject.selected = true;

						IsDomain_SelectedProjects++;
					} else {
						prj_checkbox.indeterminate = true;
						IsDomain_InterProjects++;
					}

				}

				var dom_checkbox = document.getElementById('JiraChk'
						+ objDomain.level1ID);

				if (IsDomain_SelectedProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = true;
					objDomain.selected = true;
					SelectedDomains++;
				} else if (IsDomain_InterProjects == objDomain.children.length) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_InterProjects > 0) {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				} else if (IsDomain_SelectedProjects == 0) {
					dom_checkbox.indeterminate = false;
					dom_checkbox.checked = false;
					objDomain.selected = false;
				} else {
					dom_checkbox.indeterminate = true;
					InterDomains++;
				}
			}

			var selectall_checkbox = document.getElementById('jira_select_all');
			if (SelectedDomains == checkItems.length) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = true;
			} else if (InterDomains > 0) {
				selectall_checkbox.indeterminate = true;
			} else if (SelectedDomains == 0) {
				selectall_checkbox.indeterminate = false;
				selectall_checkbox.checked = false;
			} else {
				selectall_checkbox.indeterminate = true;
			}

		}

		var vm = this;
		vm.total_count = 0;

		var loggedInuserId = localStorageService.get('loggedInuserId');

		$scope.createNewDashboard = function() {
			$rootScope.component = false;
			$rootScope.selectedtemplate = false;
			$state.go("createDashbaordOperational");
		}

		$scope.openDashboard = function(item) {
			if (item.releaseSet.length == 0) {
				$scope.open('app/pages/operational/noAccess.html', 'sm');
			} else {
				$rootScope.operationaldashid = item._id;
				//$rootScope.tool = tool;
				//localStorageService.set('tool',tool);
				localStorageService.set('dashboardName', item.dashboardName);
				localStorageService.set('owner', item.owner);
				localStorageService.set('templateName', item.templateName);
				$state.go("globalview");
				$rootScope.menubar = true;
			}
		}

		$scope.changeRouteOperational = function(item) {
			$rootScope.operationaldashboardName = item.dashboardName;
			$rootScope.operationaldescription = item.description;
			$rootScope.operationalowner = item.owner;
			$rootScope.selectedtemplate = item.templateName;
			//$rootScope.operationalcomponent = item.component;
			$rootScope.operationalcomponent = item.releaseSet;
			$rootScope.operationaljiracomponent = item.releaseSet;
			$rootScope.operationaldashid = item._id;
			$rootScope.isdashboardpublic = item.ispublic;

			$sessionStorage.operationaldashboardName = $rootScope.operationaldashboardName;
			$sessionStorage.operationaldescription = $rootScope.operationaldescription;
			$sessionStorage.operationalowner = $rootScope.operationalowner;
			$sessionStorage.selectedtemplate = $rootScope.selectedtemplate;
			$sessionStorage.operationalcomponent = $rootScope.operationalcomponent;
			$sessionStorage.operationaljiracomponent = $rootScope.operationaljiracomponent;
			$sessionStorage.operationaldashid = $rootScope.operationaldashid;
			$sessionStorage.isdashboardpublic = $rootScope.isdashboardpublic;

			// $state.go("build")
			//			$state.go("viewDashbaordOperational");

			$scope.loadItems();
			$scope.loadJiraItems();
			setTimeout(function() {
				$state.go("viewDashbaordOperational")
			}, 2000);

		}

		$scope.saveDashboard = function(form, selectedtemplate) {

			if (form.ispublic) {
				$scope.ispublicselected = true;
			} else {
				$scope.ispublicselected = false;
			}

			var token = getEncryptedValue();

			$scope.dashName = form.dashname;
			$scope.description = form.description;
			$scope.owner = form.owner;
			$scope.selectedtemplate = selectedtemplate;

			var selectedItems = getSelectedData();
			var selectedJiraItems = getJiraSelectedData();

			if (selectedItems != "" && selectedJiraItems != "") {
				var selectedData = selectedItems + "," + selectedJiraItems;
			} else if (selectedItems != "") {
				var selectedData = selectedItems;
			} else if (selectedJiraItems != "") {
				var selectedData = selectedJiraItems;
			}

			if (selectedItems == "" && selectedJiraItems == "") {
				$scope.open(
						'app/pages/operational/alerts/selectDashboardMsg.html',
						'sm');
			} else {

				var operationaldata = {
					dashboardName : $scope.dashName,
					description : $scope.description,
					ispublic : $scope.ispublicselected,
					templateName : $scope.selectedtemplate,
					components : selectedData
				}

				$http({
					url : "./rest/operationalServices/saveDashboard",
					method : "POST",
					params : operationaldata,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {

									if (response == 0) {
										$scope
												.open(
														'app/pages/operational/alerts/saveDashboardMsg.html',
														'sm');
									} else {
										$scope
												.open(
														'app/pages/operational/alerts/existDashboardMsg.html',
														'sm');
									}
								});
				setTimeout(function() {
					$scope.redirect();
				}, 2000);

			}
		}
		$scope.redirect = function() {
			$state.go("operational");
		}

		$scope.updateDashboard = function(form, dashid, selectedtemplate) {

			if (form.ispublic) {
				$scope.ispublicselected = true;
			} else {
				$scope.ispublicselected = false;
			}

			$scope.dashName = form.dashname;
			$scope.description = form.description;
			$scope.owner = form.owner;
			$scope.selectedtemplate = selectedtemplate;

			$scope.id = dashid;
			var token = getEncryptedValue();

			var selectedItems = getSelectedData();
			var selectedJiraItems = getJiraSelectedData();

			if (selectedItems != "" && selectedJiraItems != "") {
				var selectedData = selectedItems + "," + selectedJiraItems;
			} else if (selectedItems != "") {
				var selectedData = selectedItems;
			} else if (selectedJiraItems != "") {
				var selectedData = selectedJiraItems;
			}

			if (selectedData == "") {
				$scope.open(
						'app/pages/operational/alerts/selectDashboardMsg.html',
						'sm');
			} else {
				var operationaldata = {
					_id : $scope.id,
					dashboardName : $scope.dashName,
					description : $scope.description,
					ispublic : $scope.ispublicselected,
					templateName : $scope.selectedtemplate,
					components : selectedData
				}

				$http({
					url : "./rest/operationalServices/updateDashboard",
					method : "POST",
					params : operationaldata,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {

									if (response == 0) {

										$scope
												.open(
														'app/pages/operational/alerts/updatedDashboardMsg.html',
														'sm');
									} else {

										$scope
												.open(
														'app/pages/operational/alerts/existDashboardMsg.html',
														'sm');
									}
								});
				setTimeout(function() {
					$scope.redirect();
				}, 2000);
			}
		}

		// Delete Dashboard Popup Method
		$scope.deleteDashboard = function(dashid) {

			$scope.data = dashid;
			//console.log("data",$scope.data)

			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/pages/operational/alerts/deleteDashboard.html',
						scope : $scope,
						size : 'sm',
						resolve : {
							items : function() {
								// return $scope.items;
								//$scope.items = $scope.operationalDashboardTableDetails;
								//								$scope.deleteDashboardInfo($scope.data);
								return $scope.items;
							}
						}
					});

		};

		// Removes Dashboard information completely
		$scope.deleteDashboardInfo = function(data) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.id = data._id;
			$http
					.get(
							"./rest/operationalServices/deleteDashboardInfo?id="
									+ $scope.id + "&owner="
									+ localStorageService.get('loggedInuserId'),
							config).success(function(response) {

						/*if (response == 0) {
							$scope
									.open(
											'app/pages/operational/alerts/deletedDashboardMsg.html',
											'sm');
						}*/
						$rootScope.initialcountofDetails();
						setTimeout(function() {
							$scope.redirecttodashboard(id);
						}, 2000);
						$state.reload();
					});

			$scope.redirecttodashboard = function(id) {
				/* $scope.operationalDashboardTableDetails.splice(id, 1); */
				$state.reload();
			}

			// $scope.operationalDashboardDetails(1);
		}

		// Modal dialog
		$scope.open = function(url, size, dashboardName, owner) {
			$scope.dashboardName = dashboardName;
			$scope.owner = owner;
			$scope.dashboardInfo(dashboardName, owner);
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

		$scope.dashboardInfo = function(dashboardName, owner) {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalServices/getInfo?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$scope.dashboardinfo = response;
					});
		}

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

		$scope.getRollingPeriod = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.templateName = localStorageService.get('templateName');
			$http.get(
					"rest/operationalServices/getRollingPeriod?templateName="
							+ $scope.templateName, config).success(
					function(response) {

						$rootScope.rollingPeriodTime = response[0];
						localStorageService.set('rollingPeriod',
								$rootScope.rollingPeriodTime);
						$rootScope.selectedrollingPeriod();

					});
		}

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
			$rootScope.dfromvalDash = $scope.dtfromfinal; // storage date reset
			$rootScope.dtovalDash = $scope.dttofinal; // storage date reset
			$scope.rollupsheet();
			$scope.globalViewTable();
			//$rootScope.dataloader = false;
			$timeout(function () { $scope.closeloader(); }, 2000);
			
		}

		$scope.summaryTableMetricTitle = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.dashboardName = localStorageService.get('dashboardName');
			$scope.templateName = localStorageService.get('templateName');
			$scope.owner = localStorageService.get('owner');

			$http.get(
					"rest/operationalServices/summaryTableMetricTitle?dashboardName="
							+ $scope.dashboardName + "&owner=" + $scope.owner
							+ "&templateName=" + $scope.templateName, config)
					.success(function(response) {
						$scope.templateSelectedMetricName = response;

					});
		}

		
		$scope.globalViewTable = function() {
			
			$rootScope.dataloader = true;
			
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.dashboardName = localStorageService.get('dashboardName');
			$scope.templateName = localStorageService.get('templateName');
			$scope.owner = localStorageService.get('owner');
			$rootScope.selectedrollingPeriod = function() {
				$rootScope.rollingPeriod = localStorageService
						.get('rollingPeriod');
				var token = getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};
				$http.get(
						"rest/operationalServices/selectednoofdays?rollingPeriod="
								+ $rootScope.rollingPeriod, config).success(
						function(response) {
							if (response != 0) {
								var to = new Date();
								var from = new Date();

								$scope.dtto = to;
								$scope.dtfrom = new Date(from.setDate(to
										.getDate()
										- response + 1));
								$scope.convertDateToString($scope.dtfrom,
										$scope.dtto);
							}

						});

			}

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
							"rest/operationalServices/globalView?dashboardName="
									+ $scope.dashboardName + "&owner="
									+ $scope.owner + "&templateName="
									+ $scope.templateName + "&vardtfrom="
									+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(function(response) {
						$scope.globalViewDetails = response;
						// Get total project size
						$rootScope.summaryprojectlen = $scope.globalViewDetails.length;
						localStorageService.set('summaryprjlen', $rootScope.summaryprojectlen);
						$scope.safeCollection = response;
						
						$scope.getProjectlist($rootScope.summaryprojectlen,$scope.globalViewDetails);
						
						
						
					});
		}

		$scope.getProject = function(domainName, projectName, tool) {
			localStorageService.set('domainName', domainName);
			localStorageService.set('projectName', projectName);
			$rootScope.tool = tool;
			localStorageService.set('tool', tool);
			$state.go("dashboard");
		}
		
		
		$scope.getProjectlist=function(idx,data){
			$rootScope.prj_array = [];
			$scope.tool_array = [];
			localStorageService.set('domainName', data[0].domain);
			
			localStorageService.set('projectcnt', idx);
			
			for(var i=0;i<idx;i++) {
						$rootScope.prj_array.push(data[i].project);
						//$scope.tool_array.push(data[i].project]);
			}
			
			localStorageService.set('projectlist',$rootScope.prj_array);
			//localStorageService.set('projectName', data[0].project);
			localStorageService.set('SlideprojectName', data[0].project);
			localStorageService.set('tool', data[0].tool);
			
			
		}

		/* Export Graphs and tables*/
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

		$scope.getTemplatesList = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("rest/operationalServices/templateList", config).success(
					function(response) {
						$scope.templatelists = response;

					});
		};

		$scope.gettemplatelistselection = function(selectedtemplate) {
			localStorageService.set('selectedtemplate', selectedtemplate);
			$scope.selectedtemplate = localStorageService
					.get('selectedtemplate');

		};

		$scope.getcustomtemplatelistview = function(selectedcustomtemplate) {
			localStorageService.set('selectedcustomtemplate',
					selectedcustomtemplate);
			$scope.selectedcustomtemplate = localStorageService
					.get('selectedcustomtemplate');
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalServices/customTemplateView?selectedcustomtemplate="
							+ $scope.selectedcustomtemplate, config).success(
					function(response) {
						if (response != 0)
							$scope.loadCustomTemplate(response);

					});

			$rootScope.loadCustomTemplate = function(response) {

				$rootScope.templateRollingPeriod = response[0].rollingPeriod;
				$rootScope.templateToolIsAlm = response[0].almtool;
				$rootScope.templateToolIsJira = response[0].jiratool;
				$rootScope.templateSelectedMetrics = response[0].selectedMetrics;

				$rootScope.templateSelectedMetricName = [];

				for (var i = 0; i < $scope.templateSelectedMetrics.length; i++) {
					$scope.templateSelectedMetricName
							.push($scope.templateSelectedMetrics[i].metricName);
					//$scope.templateSelectedMetrics[i].metricName;
				}

			};

		};
		
		// Open window from Summary Page
		$rootScope.openpopupforsummarypage = function(size) {
			$state.go('Summaryslideshowpopup');
	    }
		
		
		// Rollup Sheet
		
		$scope.rollupsheet= function() {
			
			$rootScope.dataloader = true;
			
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.dashboardName = localStorageService.get('dashboardName');
			$scope.templateName = localStorageService.get('templateName');
			$scope.owner = localStorageService.get('owner');
			
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
							"rest/operationalServices/rollupsheet?dashboardName="
									+ $scope.dashboardName + "&owner="
									+ $scope.owner + "&templateName="
									+ $scope.templateName + "&vardtfrom="
									+ vardtfrom + "&vardtto=" + vardtto, config)
					.success(function(response) {
						$scope.rolupsheetTableDetailsExport = response;
					});
			
			
			
		}
		
		$scope.downloadTable = function(format, elementId, filename) {
			
			filename = localStorageService.get('dashboardName');
			
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
		
		$scope.closeloader = function() {
			$rootScope.dataloader = false;
		}
	
		
		
	
		
		

	}
})();