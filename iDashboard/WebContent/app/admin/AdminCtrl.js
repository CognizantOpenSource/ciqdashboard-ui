/**
 * @author v.lugovksy created on 16.12.2015 NOTE: use encodeURIComponent() to
 *         include special characters '&' while sending query parameters
 *         **653731**
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.Login').service('FileUploadService',
			[ '$https', function($https) {
				this.uploadFileToUrl = function(file, uploadUrl) {
					var fd = new FormData();
					fd.append('file', file);

					$https.post(uploadUrl, fd, {
						transformRequest : angular.identity,
						headers : {
							'Content-Type' : undefined
						}
					})

					.success(function() {
						// console.log("image uploaded successfully");
					})

					.error(function() {
						// console.log("image upload failed");
					});
				}
			} ]).controller('AdminCtrl', AdminCtrl,
			function($scope, FileUploadService) {

			});

	angular.module('MetricsPortal.Login').controller('AdminCtrl',
			AdminCtrl).directive(
			"keepScroll",
			function() {
				return {
					link : function(scope, el, attr, ctrl) {
						var scrollHeight;

						scope.$watchCollection('items', function(n, o) {
							// Set the scroll height to it's previous value, or
							// instantiate it when the list is
							// done loading.
							scrollHeight = scrollHeight || el[0].scrollHeight;
							// Adjust the scrolltop if items change.
							el[0].scrollTop = el[0].scrollTop
									- (scrollHeight - el[0].scrollHeight);
							// Remember current scrollHeight for next change.
							scrollHeight = el[0].scrollHeight;
						});
					}

				};
			});

	angular.module('MetricsPortal.Login').controller('AdminCtrl',
			AdminCtrl).filter('trimDesc', function() {
		return function(value) {
			if (!angular.isString(value)) {
				return value;
			}
			return value.replace(/^\s+|\s+$/g, '');
		};
	});
	/** @ngInject */
	function AdminCtrl($filter, AES, $sessionStorage, $scope, $http, $sce,
			localStorageService, $state, $window, $timeout, $location,
			$rootScope, $uibModal, $base64, toastr, $uibModalStack) {

		$scope.currentPage = 0;
		$scope.pageSize = 5;
		$rootScope.menubar = false;
		$scope.numberOfPages = function() {

			if ($scope.AvailbleList) {
				return Math.ceil($scope.AvailbleList.length / $scope.pageSize);
			} else
				return 1;
		}
		$rootScope.menubar = false;
		$rootScope.var1 = false;
		$rootScope.var2 = false;
		$rootScope.var3 = false;
		$rootScope.var4 = true;
		$rootScope.var5 = false;
		$rootScope.var6 = false;

		$scope.selection = [];
		$scope.allowDrop = function(ev) {
			ev.preventDefault();
		}

		$scope.drag = function(ev) {
			ev.dataTransfer.setData("text", ev.target.id);
		}

		$scope.drop = function(ev) {
			ev.preventDefault();
			$scope.data = ev.dataTransfer.getData("text");
			ev.target.appendChild(document.getElementById($scope.data));
			$scope.selection.push($scope.data);
		}

		$scope.saveToolDetails = function() {

			$scope.selectedTool = JSON.stringify($scope.toolsSelected);

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var uri = "./rest/jsonServices/saveToolDetails?toolsSelected="
					+ $scope.selectedTool + "&template=" + $scope.selection
			var encodeduri = encodeURI(uri);

			$http
					.get(encodeduri, config)
					.success(
							function(response) {
								$scope.userDetails = response;
								$scope.totalcnt = response.length;
								$scope.rowCollection = response;
								if (response == 1) {
									$scope
											.open(
													'app/pages/admin/selectionSavedSuccessfully.html',
													'sm');
									setTimeout(function() {
										$state.go('admin');
									}, 2000);
								}
							});
		}

		$rootScope.var1 = false;
		$rootScope.var2 = false;
		$rootScope.var3 = false;
		$rootScope.var4 = true;

		$rootScope.isToolSelectedAlready = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("./rest/jsonServices/isToolSelectedAlready", config)
					.success(
							function(response) {
								$scope.toolLists = [];
								$scope.toolLists = response;
								localStorageService.set('toolListLen',
										$scope.toolLists.length);
								localStorageService.set('toolList',
										$scope.toolLists);
							});
		}
		$scope.generateModel = function() {
			$scope.titleList = [ "Industry Standard Metrics",
					"Selected Metrics List" ];
			$scope.isToolSelectedAlready();

			$rootScope.toolListLen = localStorageService.get('toolListLen');
			$scope.toolListSel = localStorageService.get('toolList');
			if ($rootScope.toolListLen > 0) {
				$scope.toolList = [ "User Story", "Build", "SCM", "Deployment",
						"Code Quality", "Test Management", "Fortify",
						"ALM-Octane" ];
				$scope.models = {
					selected : $scope.toolListSel,
					lists : {
						"available" : [],
						"selected" : []
					}
				};

				angular.forEach($scope.toolListSel, function(value, key) {
					for (var i = 0; i < $scope.toolList.length; i++) {
						if ($scope.toolList[i] == value) {
							$scope.toolList.splice(i, 1);
						}

					}

				});
				// Generate initial model

				for (var i = 0; i < $scope.toolList.length; i++) {

					$scope.models.lists.available.push({
						label : $scope.toolList[i]
					});
				}

				for (var i = 0; i < $scope.toolListSel.length; i++) {
					$scope.models.lists.selected.push({
						label : $scope.toolListSel[i]
					});
				}

			} else {
				$scope.toolList = [ "User Story", "Build", "SCM", "Deployment",
						"Code Quality", "Test Management", "Fortify",
						"ALM-Octane" ];
				$scope.models = {
					selected : null,
					lists : {
						"available" : [],
						"selected" : []
					}
				};
				// Generate initial model
				for (var i = 0; i < $scope.toolList.length; i++) {
					$scope.models.lists.available.push({
						label : $scope.toolList[i]
					});

				}
			}

			// Model to JSON for demo purpose
			$scope
					.$watch(
							'models',
							function(model) {
								$scope.modelAsJson = angular
										.toJson(model, true);
								$scope.toolsSelected = [];

								for (var i = 0; i < model.lists.selected.length; i++) {

									if (model.lists.selected[i].label == "SCM") {
										$scope.imgPath = "app\\pages\\admin\\icon-github.png";
										$scope.key = "gitHub";
									} else if (model.lists.selected[i].label == "Test Management") {
										$scope.imgPath = "app\\pages\\admin\\icon-hp.png";
										$scope.key = "testManagement";
									} else if (model.lists.selected[i].label == "Code Quality") {
										$scope.imgPath = "app\\pages\\admin\\icon-sonar.png";
										$scope.key = "codeQuality";
									} else if (model.lists.selected[i].label == "User Story") {
										$scope.imgPath = "app\\pages\\admin\\icon-jira.png";
										$scope.key = "userStory";
									} else if (model.lists.selected[i].label == "Deployment") {
										$scope.imgPath = "app\\pages\\admin\\icon-chef.png";
										$scope.key = "chef";
									} else if (model.lists.selected[i].label == "Build") {
										$scope.imgPath = "app\\pages\\admin\\icon-jenkins.png";
										$scope.key = "build";
									} else if (model.lists.selected[i].label == "Fortify") {
										$scope.imgPath = "app\\pages\\admin\\icon-fortify.png";
										$scope.key = "fortify";
									} else if (model.lists.selected[i].label == "ALM-Octane") {
										$scope.imgPath = "app\\pages\\admin\\icon-octane.png";
										$scope.key = "octane";
									}

									$scope.toolsSelected
											.push({
												"label" : model.lists.selected[i].label,
												"imagePath" : $scope.imgPath,
												"key" : $scope.key,
												"position" : i + 1
											});
								}
								$scope.generateImg();
							}, true);

		}

		$scope.toolSelection = function(page) {
			if (page == "operationalCustomization") {
				$state.go('templateCustomizationHome'); //templateCustomizationHome
			}

			else if (page == "lifecycle") {
				//$state.go('toolSelect');lifecycleLayoutSelection
				$state.go('lifecycleLayoutSelection')
			}
			else if (page == "toolConfiguration") {
				$state.go('toolConfiguration');
			}
		}

		$scope.generateImg = function() {
			$scope.imglist = [];
			for (var i = 0; i < $scope.toolsSelected.length; i++) {
				$scope.imglist.push($scope.toolsSelected[i].imagePath);
			}
		}

		// ///////////////////////////// TEmplate customization
		// code/////////////////////////////////////
		$scope.TemplateSavingCancel = function() {
			$state.go('templateCustomizationHome');
		}

		$scope.deleteTemplate = function(templateName) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.data = templateName;

			$http
					.get(
							"./rest/jsonServices/templateNameInOperational?templateName="
									+ encodeURIComponent($scope.data), config)
					.success(
							function(response) {
								if (response > 0) {

									$scope.data = templateName;
									$uibModal
											.open({
												animation : true,
												templateUrl : 'app/admin/templateCustomization/deleteTemplateName.html',

												scope : $scope,
												size : 'sm',
												resolve : {
													items : function() {
														return $scope.items;
													}
												}
											});

								} else if (response == 0) {
									$scope.data = templateName;
									$uibModal
											.open({
												animation : true,
												templateUrl : 'app/pages/admin/deleteUnusedTemplate.html',

												scope : $scope,
												size : 'sm',
												resolve : {
													items : function() {
														return $scope.items;
													}
												}
											});
									/*
									 * $scope.$dismiss(); $scope.open(
									 * 'app/pages/admin/cannotDeleteTemplate.html',
									 * 'sm')
									 */
								}
								;

							});

			/*
			 * $scope.redirecttodashboard = function() {
			 * 
			 * $state.reload(); }
			 */

		}
		// used template

		$scope.deleteTemplateRow = function(data) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.templatename = data;
			$http
					.get(
							"./rest/jsonServices/deleteTemplateName?templateName="
									+ encodeURIComponent($scope.templatename),
							config)
					.success(
							function(response) {
								if (response == 0) {

									$scope.$dismiss();
									$scope
											.open(
													'app/pages/admin/deletedTemplateMsg.html',
													'sm')
								}

								setTimeout(function() {
									$scope.redirecttodashboard();
								}, 2000);

							});

			$scope.redirecttodashboard = function() {

				$state.reload();
			}

		}
		// unused template
		$scope.deleteUnusedTemplateRow = function(data) {
			var token = AES.getEncryptedValue();
			var paramdata = {
				templateName : data
			}

			$http({
				url : "./rest/jsonServices/deleteUnusedTemplateName",
				method : "GET",
				params : paramdata,
				headers : {
					'Authorization' : token
				}

			})
					.success(
							function(response) {
								if (response == 0) {

									$scope.$dismiss();
									$scope
											.open(
													'app/pages/admin/cannotDeleteTemplate.html',
													'sm')
								}

								setTimeout(function() {
									$scope.redirecttodashboard();
								}, 2000);

							});

			$scope.redirecttodashboard = function() {

				$state.reload();
			}

		}

		// saving the template n metric at finish widget function
		$rootScope.selectedMetricsList = {};
		var modelNames = [];

		$scope.modelNamesFinal = [];
		$scope.saveMetricDetails = function() {
			if ($scope.selectTemplate == undefined) {

			}

			$rootScope.metricSelected = localStorageService
					.get('metricSelected');
			if ($rootScope.metricSelected == null) {
				$scope.open('app/pages/admin/selectMetric.html', 'sm');
			}
			$rootScope.isAlmTool = localStorageService.get('almMetric');
			$rootScope.isJiratool = localStorageService.get('jiraMetric');

			var selectedItems = $scope
					.getSelectedMetricData($rootScope.metricSelected);
			$rootScope.selectedMetrics = selectedItems;
			localStorageService.set('selectedMetrics',
					$rootScope.selectedMetrics);
			console.log("225", $rootScope.selectedMetrics);

			var rollingPeriod;
			$rootScope.selectedRollingPeriod = localStorageService
					.get('selectedRollingPeriod');
			var selectMetrics;

			var token = AES.getEncryptedValue();
			var Viewdata = {
				selectedTemplate : $scope.selectTemplate,
				selectMetrics : JSON.stringify($rootScope.selectedMetrics),
				organization : $scope.organizationName,
				rollingPeriod : $rootScope.selectedRollingPeriod,
				isAlmtool : $rootScope.isAlmTool,
				isJiratool : $rootScope.isJiratool,

			}
			if ($scope.selectTemplate == undefined) {
				$scope.open('app/pages/admin/provideTemplatename.html', 'sm');
			} else {
				$http({
					url : "./rest/jsonServices/saveMetricDetails",
					method : "POST",
					params : Viewdata,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {
									$scope.template = response;
									$scope.rowCollection = response;
									if (response == 0) {
										$scope
												.open(
														'app/pages/admin/templateSavedSuccessfully.html',
														'sm');

										setTimeout(
												function() {
													$state
															.go('templateCustomizationHome');
												}, 2000);
									}
								});

			}
		}
		// save and update
		$scope.updateSelectedTemplateDetails = function() {

			localStorageService.set('metricSelected', $scope.metricSelected);

			$scope.metricSelected = localStorageService.get('metricSelected');
			$rootScope.templateToolIsAlm = localStorageService.get('almMetric');
			$rootScope.templateToolIsJira = localStorageService
					.get('jiraMetric');
			$rootScope.selectedcustomtemplate = localStorageService
					.get('selectedcustomtemplate');
			var selectedItems = $scope
					.getSelectedMetricData($scope.metricSelected);
			$rootScope.selectedMetrics = selectedItems;
			localStorageService.set('selectedMetrics',
					$rootScope.selectedMetrics);
			console.log("225", $rootScope.selectedMetrics);

			var rollingPeriod;
			$rootScope.selectedRollingPeriod = localStorageService
					.get('selectedRollingPeriod');
			var selectMetrics;

			var token = AES.getEncryptedValue();

			var Viewdata = {
				selectedTemplate : $scope.selectedcustomtemplate,
				selectMetrics : JSON.stringify($rootScope.selectedMetrics),

				rollingPeriod : $rootScope.selectedRollingPeriod,
				isAlmtool : $rootScope.templateToolIsAlm,
				isJiratool : $rootScope.templateToolIsJira,

			}
			$http({
				url : "./rest/jsonServices/updateMetricDetails",
				method : "POST",
				params : Viewdata,
				headers : {
					'Authorization' : token
				}
			})
					.success(
							function(response) {
								$scope.template = response;
								$scope.rowCollection = response;
								if (response == 0) {
									$scope
											.open(
													'app/admin/templateCustomization/templateUpdateSuccessfully.html',
													'sm');

									setTimeout(function() {
										$state.go('templateCustomizationHome');
									}, 2000);
								}
							});

		}
		$scope.metric = false;
		$scope.displayMetic = true;
		// get the selected metric in the finish widgets
		$scope.SelectedMetric = function() {

			$rootScope.SelectedMetricsLIst = angular
					.copy($scope.templatemodels[1].Selected);

			$scope.SelectedMetricsLIst = localStorageService
					.get('SelectedMetricsLIst');
			$rootScope.metricSelected = localStorageService
					.get('metricSelected');
			$scope.metricLength = $rootScope.metricSelected.length;
			console.log($rootScope.metricLength)
		}

		$scope.getSelectedMetricData = function(data) {
			var modelNames1 = [];

			$rootScope.selectedMetrics = localStorageService
					.get('metricSelected');
			/* $rootScope.selectedMetrics=selectedItems; */

			$scope.metricList = data;

			for (var i = 0; i < $scope.metricList.length; i++) {
				var obj = {};
				obj["metricName"] = $scope.metricList[i].metricName;
				obj["metricId"] = $scope.metricList[i].metricId;
				obj["entityType"] = $scope.metricList[i].entityType;
				obj["almMetric"] = $scope.metricList[i].almMetric;
				obj["jiraMetric"] = $scope.metricList[i].jiraMetric;
				obj["type"] = $scope.metricList[i].type;
				modelNames1.push(obj);
			}

			console.log("item", modelNames1);
			return modelNames1;
		}

		$rootScope.almMetric = localStorageService.get('almMetric');

		$rootScope.jiraMetric = localStorageService.get('jiraMetric');

		$scope.getvalues = function(organisation, template) {

			$scope.selectTemplate = template;
			var token = AES.getEncryptedValue();
			var templateData = {
				selectTemplate : $scope.selectTemplate
			}
			$http({
				url : "./rest/jsonServices/existTemplateName",
				method : "POST",
				params : templateData,
				headers : {
					'Authorization' : token
				}
			}).success(
					function(response) {

						if (response) {
							$scope.open(
									'app/pages/admin/existTemplateName.html',
									'sm');
						}
					});
			setTimeout(function() {
				$scope.dismiss();
			}, 2000);
		}

		$scope.cancelTemplate = function() {
			/* alert("i m oin") */
			$state.go('templateCustomizationHome');
		}

		$scope.selectedTool = function() {
			$rootScope.almMetric = localStorageService.get('almMetric');
			$rootScope.jiraMetric = localStorageService.get('jiraMetric');
			localStorageService.set('jiraMetric', $rootScope.jiraMetric);
			localStorageService.set('almMetric', $rootScope.almMetric);
			console.log("364", $rootScope.jiraMetric)
			$scope.metricAvailableLists();

		}

		$scope.selectedJiraTool = function(jiraMetric) {
			/* alert("jira") */
			localStorageService.set('jiraMetric', jiraMetric);
			$rootScope.jiraMetric = localStorageService.get('jiraMetric');

			console.log(jiraMetric);
			$scope.metricAvailableLists();

		}
		$scope.selectedAlmTool = function(almMetric) {
			/* alert("alm") */
			localStorageService.set('almMetric', almMetric);
			$rootScope.almMetric = localStorageService.get('almMetric');

			console.log("123", almMetric);
			$scope.metricAvailableLists();

		}

		// function to get the selected rolling period from dropdown
		$scope.getSelectedRollingPeriod = function(selectedRollingPeriod) {
			$rootScope.selectedRollingPeriod = selectedRollingPeriod;
			localStorageService.set('selectedRollingPeriod',
					$rootScope.selectedRollingPeriod);
			console.log($rootScope.selectedRollingPeriod);
		}

		// function to get rolling period
		$scope.getRollingPeriodData = function() {
			$scope.rollingperioddrops = [ "Last 30 days", "Last 60 days",
					"Last 90 days", "Last 180 days", "Last 365 days" ];
			$rootScope.selectedRollingPeriod = $scope.rollingperioddrops[0];
			localStorageService.set('selectedRollingPeriod',
					$rootScope.selectedRollingPeriod);
		}

		// fetching the available list of metric

		$scope.metricAvailableLists = function() {
			/* alert("metriclist") */

			$scope.almMetric = localStorageService.get('almMetric');
			$scope.jiraMetric = localStorageService.get('jiraMetric');
			console.log($scope.jiraMetric);
			console.log($scope.almMetric);
			if ($scope.almMetric == true && $scope.jiraMetric == false
					|| $scope.jiraMetric == null) {
				$scope.valueOfTool = "ALM ";

			} else if ($scope.jiraMetric == true && $scope.almMetric == false
					|| $scope.almMetric == null) {
				$scope.valueOfTool = "JIRA ";
			} else if ($scope.jiraMetric == true && $scope.almMetric == true) {
				$scope.valueOfTool = "ALM and JIRA ";
			}
			var token = AES.getEncryptedValue();

			$scope.almtoolvalue = $scope.almMetric;
			$scope.jiratoolvalue = $scope.jiraMetric;

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"./rest/jsonServices/metricAvailableList?almMetric="
									+ $scope.almtoolvalue + "&jiraMetric="
									+ $scope.jiratoolvalue, config)
					.success(
							function(response) {

								$scope.AvailbleList = response;
								/* alert("response.length " + response.length) */
								$scope.rowCollection = response;
								console.log($scope.AvailbleList);
								if ($scope.templatemodels[1].Selected.length == 0
										&& $scope.templatemodels[0].Available.length == 0) {
									angular
											.forEach(
													$scope.templatemodels,
													function(list, index) {
														console
																.log($scope.templatemodels);
														for (var i = 0; i < $scope.AvailbleList.length; i++) {

															list.Available
																	.push($scope.AvailbleList[i]);

														}
													});

									/* alert(JSON.stringify($scope.models)); */
								} else {
									$scope.metricSelected = angular
											.copy($scope.templatemodels[1].Selected);

									$scope.metricSelected = localStorageService
											.get('metricSelected');

									for (var i = 0; i < $scope.metricSelected.length; i++) {
										for (var j = 0; j < $scope.rowCollection.length; j++) {
											if ($scope.metricSelected[i].metricId == $scope.rowCollection[j].metricId
													|| Object
															.keys($scope.rowCollection[j]).length === 0) {
												delete $scope.rowCollection[j];
											}
											$scope.rowCollection = $scope.rowCollection
													.filter(function(e) {
														return e
													});
										}

									}

									angular
											.forEach(
													$scope.templatemodels,
													function(list, index) {
														console
																.log($scope.templatemodels);
														list.Available = [];
														for (var i = 0; i < $scope.rowCollection.length; i++) {

															list.Available
																	.push($scope.rowCollection[i]);

														}

													});

								}

							});

		}

		// function to get the available metric from db
		$scope.generateTemplateModel = function() {

			$scope.templatemodels = [ {
				listName : "Available",
				Available : [],
				dragging : false
			}, {
				listName : "Selected",
				Selected : [],
				dragging : false
			} ];
			/* alert(JSON.stringify($scope.templatemodels)); */

			$scope.getSelectedItemsIncluding = function(list, item) {
				item.selected = true;

				return list.Available.filter(function(item) {

					return item.selected;
				});

			};

			$scope.onDragstart = function(list, event) {

				list.dragging = true;

				if (event.dataTransfer.setDragImage) {
					var img = new Image();
					img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
					event.dataTransfer.setDragImage(img, 0, 0);
				}
			};

			$scope.onDrop = function(list, Available, index) {
				$scope.metricSelected = [];
				angular.forEach(Available, function(item) {
					item.selected = false;
				});
				list.Available = list.Available.slice(0, index).concat(
						Available).concat(list.Available.slice(index));
				$scope.metricSelected = localStorageService
						.get('metricSelected');
				console.log("avaialbleDropvvc", $scope.metricSelected)

				for (var i = 0; i < $scope.metricSelected.length; i++) {

					if ($scope.metricSelected[i].metricId == Available[0].metricId) {
						delete $scope.metricSelected[i];
					}
				}
				$scope.metricSelected = $scope.metricSelected
						.filter(function(e) {
							return e
						});

				localStorageService
						.set('metricSelected', $scope.metricSelected);

				return true;
			}

			$scope.variable = false;
			$scope.onMoved = function(list) {
				list.Available = list.Available.filter(function(item) {

					return !item.selected;
				});

			};

			$scope.getSelectedItemsIncluding1 = function(list, item) {

				item.selected = true;

				return list.Selected.filter(function(item) {

					return item.selected;
				});
			};

			$scope.onDragstart1 = function(list, event) {

				list.Selected.dragging = true;
				if (event.dataTransfer.setDragImage) {
					var img = new Image();
					img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
					event.dataTransfer.setDragImage(img, 0, 0);
				}

			};
			$scope.onDrop1 = function(list, Selected, index) {
				$scope.metricSelected = [];

				list.Selected = list.Selected.slice(0, index).concat(Selected)
						.concat(list.Selected.slice(index));
				angular.forEach(Selected, function(item) {
					item.selected = false;
				});
				$scope.variable = true;
				$scope.metricSelected = angular.copy(list.Selected);
				localStorageService
						.set('metricSelected', $scope.metricSelected);

				return true;

			}

			$scope.onMoved1 = function(list) {

				list.Selected = list.Selected.filter(function(item) {
					return !item.selected;
				});
			};

		}

		// function to create new template
		$scope.createNewTemplate = function() {
			$rootScope.selectedRollingPeriod = localStorageService
					.get('selectedRollingPeriod');
			if ($rootScope.selectedRollingPeriod != null) {
				$rootScope.selectedRollingPeriod = "";
			}
			$scope.almMetric = localStorageService.get('almMetric');
			$scope.jiraMetric = localStorageService.get('jiraMetric');

			if ($scope.jiraMetric != null || $scope.almMetric != null
					|| $scope.jiraMetric == null || $scope.almMetric == null) {
				$scope.valueOfTool = "";

			}

			$rootScope.metricSelected = localStorageService
					.get('metricSelected');
			console.log("metricSelected", $rootScope.metricSelected);
			if ($rootScope.metricSelected) {
				$rootScope.metricSelected = "";
			}

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get("./rest/jsonServices/getNumberOfTemplate", config)
					.success(
							function(response) {
								$scope.numberOfTemplate = response;
								$scope.templateLength = localStorageService
										.get('templateLength');
								console
										.log("response",
												$scope.numberOfTemplate)
								console.log("response", $scope.templateLength)
								if ($scope.numberOfTemplate <= $scope.templateLength) {
									$scope
											.open(
													'app/admin/templateCustomization/restrictTemplateCreationMessage.html',
													'sm');

									setTimeout(function() {
										$state.go('templateCustomizationHome');
									}, 2000);
								} else {
									$state.go('templateCustomization');
								}

							});

		}

		// template details from DB on page load

		$scope.templateDetails = function() {
			/* alert("i ,m dfsdf"); */

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("./rest/jsonServices/templateDetails", config).success(
					function(response) {
						$scope.templateTableDetails = response;

						localStorageService.set('templateLength',
								$scope.templateTableDetails.length);

					});

		}
		// edit of selected template
		$scope.updateTemplateDetails = function(selectedcustomtemplate) {

			$state.go('editTemplateView');
			localStorageService.set('selectedcustomtemplate',
					selectedcustomtemplate);

			$scope.selectedcustomtemplate = localStorageService
					.get('selectedcustomtemplate');

		}

		// get the selected template data from db to ui function
		// NOTE: use encodeURIComponent() in template name to include special
		// characters '&' while sending query parameters **653731**
		$scope.getSelectedTemplateDetails = function() {
			$scope.selectedcustomtemplate = localStorageService
					.get('selectedcustomtemplate');
			var listedItems = [];
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/operationalServices/customTemplateView?selectedcustomtemplate="
									+ encodeURIComponent($scope.selectedcustomtemplate),
							config).success(function(response) {
						if (response != 0)

							$scope.loadCustomTemplateDetails(response);

					});
		}
		$scope.loadCustomTemplateDetails = function(response) {

			$rootScope.selectedRollingPeriod = response[0].rollingPeriod;
			$rootScope.templateToolIsAlm = response[0].almtool;
			$rootScope.templateToolIsJira = response[0].jiratool;

			localStorageService.set('selectedRollingPeriod',
					$rootScope.selectedRollingPeriod);
			localStorageService
					.set('jiraMetric', $rootScope.templateToolIsJira);
			localStorageService.set('almMetric', $rootScope.templateToolIsAlm);
			localStorageService.set('selectedcustomtemplate',
					$rootScope.selectedcustomtemplate);
			$rootScope.templateSelectedMetrics = response[0].selectedMetrics;
			console.log("$rootScope.templateSelectedMetrics",
					$rootScope.templateSelectedMetrics)
			if ($rootScope.templateToolIsJira != null
					&& $rootScope.templateToolIsAlm != null) {
				$scope.metricAvailableLists();
				$scope.AvailableMetricList = localStorageService
						.get('AvailableMetricList');
			}
			$rootScope.templateSelectedMetricName = [];
			console.log($scope.templatemodels.length);
			for (var i = 0; i < $scope.templatemodels.length; i++) {

				for (var j = 0; j < $scope.templateSelectedMetrics.length; j++) {
					if ($scope.templatemodels[i].listName != "Available") {

						$scope.templatemodels[i].Selected
								.push($scope.templateSelectedMetrics[j]);

					}
				}
			}
			$scope.metricSelected = angular
					.copy($scope.templatemodels[1].Selected);

			localStorageService.set('metricSelected', $scope.metricSelected);

		}

		// info icon of selcted template

		$scope.getselectedtemp = function(selectedcustomtemplate) {

			$scope.myselectedTemplate = selectedcustomtemplate;
			$state.go('customTemplateView');
			localStorageService.set('myselectedTemplate',
					selectedcustomtemplate);

		}

		$scope.getcustomtemplatelistview = function() {

			$scope.myselectedTemplate = localStorageService
					.get('myselectedTemplate');
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/operationalServices/customTemplateView?selectedcustomtemplate="
							+ encodeURIComponent($scope.myselectedTemplate),
					config).success(function(response) {
				if (response != 0)
					$scope.loadCustomTemplate(response);

			});
		}

		$scope.loadCustomTemplate = function(response) {

			$scope.viewRollingPeriod = response[0].rollingPeriod;
			$scope.viewToolIsAlm = response[0].almtool;
			$scope.viewToolIsJira = response[0].jiratool;
			$scope.viewSelectedMetrics = response[0].selectedMetrics;

			$scope.viewSelectedMetricName = [];

			for (var i = 0; i < $scope.viewSelectedMetrics.length; i++) {
				$scope.viewSelectedMetricName
						.push($scope.viewSelectedMetrics[i].metricName);
				// $scope.templateSelectedMetrics[i].metricName;
			}

		}

		// //////////////////
		// License Details for Admin

		$scope.getLicenseDetailsForAdmin = function() {
			$scope.licenseDetails = localStorageService.get('licenseDetails');
			$scope.safeLicenseDetails = localStorageService
					.get('licenseDetails');
		}

		/*
		 * $scope.toolSelection = function (){ $state.go('toolSelect'); }
		 */

		// No Access Redirection
		$scope.noaccesshide = function() {
			$rootScope.menubar = false;
		}

		$scope.gotoAccessHome = function() {
			if (localStorageService.get('admin')) {
				$state.go('admin');
			} else if (localStorageService.get('operational')) {
				$state.go('Operational');
			} else if (localStorageService.get('lifeCycle')) {
				$state.go('lifecycledashboard');
			} else if (localStorageService.get('riskCompliance')) {
				$state.go('riskCompliance');
			}

			else if (localStorageService.get('qbot')) {
				$state.go('dashbot');
			}
		}

		// HPALM table html code
		$scope.Hpalmdetails = function() {
			/* console.log("fhhhdfhd"); */
			$state.go('hpalmdetails');
			localStorageService.set('name', $scope.name);
			localStorageService.set('serverUrl', $scope.serverUrl);

		}

		/*
		 * $scope.domainAndProjectDetailsOnPageload = function(){
		 * console.log("domain nproject inside"); var token =
		 * getEncryptedValue(); var config = {headers: { 'Authorization': token
		 * }};
		 * $http.get("./rest/jsonServices/domainAndProjectDetailOnInit",config).success(function
		 * (response) { $scope.domainAndProjectDetails = response;
		 * console.log("projectndomain",response); }) ; };
		 */

		// HPALM INSTANCE DETAILS
		$scope.saveInstance = function(form) {
			/* console.log("inside"); */
			$scope.instanceName = form.instanceName;
			$scope.serverUrl = form.serverUrl;
			$scope.password = form.password;
			$scope.userId = form.userId;
			/*
			 * console.log($scope.instanceName); console.log($scope.password);
			 * console.log($scope.userId);
			 */
			console.log($scope.serverUrl);
			var token = AES.getEncryptedValue();

			var HPALMdata = {
				instanceName : $scope.instanceName,
				serverUrl : $scope.serverUrl,
				userId : $scope.userId,
				password : btoa($scope.password),

			}

			$http({
				url : "./rest/jsonServices/saveInstance",
				method : "POST",
				params : HPALMdata,
				headers : {
					'Authorization' : token
				}
			})

			.success(
					function(response) {

						if (response == 0) {
							$scope.open(
									'app/pages/admin/saveDomainProject.html',
									'sm');

						} else {
							$scope.open('app/pages/admin/exitDashboard.html',
									'sm');
						}
					});
			/*
			 * setTimeout(function() { $scope.redirect(); }, 2000);
			 */

		}

		$scope.reloadd = function() {
			$state.reload();
		}

		// DISPLAYING IN THE TABLE INSTANCE AND SERVER URL
		$scope.instanceDetailsfn = function() {
			/* console.log("instanceDetailsfn"); */
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/instanceDetails", config).success(
					function(response) {
						$scope.instanceDetails = response;

						console.log("response2", response);

					})
		}

		/* $scope.visible=false; */

		$scope.createDomainAndpoject = function(item) {
			/* console.log("inside"); */
			/* $scope.visible=true; */
			console.log(item);
			$scope.instanceName = item.instanceName;
			$scope.serverUrl = item.serverUrl;
			$scope.password = item.password;
			$scope.userId = item.userId;
			console.log($scope.password);
			/*
			 * console.log($scope.userId);
			 * 
			 * console.log( $scope.instanceName);
			 */
			localStorageService.set('instanceName', $scope.instanceName);
			localStorageService.set('serverUrl', $scope.serverUrl);
			localStorageService.set('password', $scope.password);
			localStorageService.set('userId', $scope.userId);
			$scope.domainAndProjectDetailsfn();

		}

		// add hpalm details
		$scope.UpdateInstance = function(form) {
			/* console.log("inside"); */
			/* $scope.selectedFields={"project":form.project,"domain":form.domain,"userId":form.userId,"password":form.password}; */
			/* console.log( $scope.selectedFields); */
			$scope.domain = form.domain;
			$scope.project = form.project;
			console.log($scope.project);
			console.log($scope.domain);
			console.log($scope.password);
			var token = AES.getEncryptedValue();

			var HPALMdata = {

				project : $scope.project,
				domain : $scope.domain,
				serverUrl : $scope.serverUrl,
				instanceName : $scope.instanceName,
				userId : $scope.userId,
				password : $scope.password,
			/* selectedFields:$scope.selectedFields */

			}

			$http({
				url : "./rest/jsonServices/UpdateInstance",
				method : "POST",
				params : HPALMdata,
				headers : {
					'Authorization' : token
				}
			})

					.success(
							function(response) {

								if (response == 1) {
									$scope
											.open(
													'app/pages/admin/saveDomainAndProject1.html',
													'sm');

								} else {
									$scope
											.open(
													'app/pages/admin/exitDashboard.html',
													'sm');
								}
								console.log("response1223", response);
							});
			/*
			 * setTimeout(function() { $scope.redirect(); }, 2000);
			 */

		}

		// display domain n project in table

		$scope.domainAndProjectDetailsfn = function() {
			/* console.log("domainnproject inside"); */
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.instanceName = localStorageService.get('instanceName');
			$scope.serverUrl = localStorageService.get('serverUrl');
			$scope.userId = localStorageService.get('userId');
			$scope.password = localStorageService.get('password');

			/*
			 * console.log("instanceName",$scope.instanceName);
			 * console.log("userId",$scope.userId);
			 * console.log("password",$scope.password);
			 */

			$http.get(
					"./rest/jsonServices/domainAndProjectDetails?instanceName="
							+ $scope.instanceName + "&serverUrl="
							+ $scope.serverUrl + "&userId=" + $scope.userId
							+ "&password=" + $scope.password, config).success(
					function(response) {
						$scope.domainAndProjectDetails = response;
						/*
						 * $scope.values=response.length; for (i = 0; i <
						 * response.length; i++) { if(response[i]==null){
						 * var index = $scope.domainAndProjectDetails.indexOf(response);
						 * $scope.domainAndProjectDetails.splice(index, 1); } }
						 */

						console.log("response1", response);
						/* console.log("values", response.length); */
					});
		};

		// delete instance in a particular row
		$scope.deleteHPALMInstance = function(item) {
			$scope.data = item;
			console.log(" $scope.data", $scope.data);
			$uibModal.open({
				animation : true,
				templateUrl : 'app/pages/admin/deleteInstanceDetails.html',

				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});

		}

		$scope.deleteInstanceRow = function(data) {

			/* console.log("in"); */
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.instanceName = data.instanceName;

			console.log(" $scope.instanceName", $scope.instanceName);
			$http.get(
					"./rest/jsonServices/deleteALMInstance?instanceName="
							+ $scope.instanceName, config).success(
					function(response) {

						if (response == 0) {

							$scope.$dismiss();
							$scope.open(
									'app/pages/admin/deletedSuccessMsg.html',
									'sm');
						}

						setTimeout(function() {
							$scope.redirecttodashboard();
						}, 2000);

					});

			$scope.redirecttodashboard = function() {

				$state.reload();
			}

		}

		// delete domain n paroject in a particular row
		$scope.deleteHPALMRow = function(item) {
			$scope.data = item;

			console.log(" $scope.data", $scope.data);
			$uibModal.open({
				animation : true,
				templateUrl : 'app/pages/admin/deleteHPALMdetails.html',

				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		$scope.deleteHPALMRoww = function(data) {

			/* console.log("in"); */
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.domain = data.domain;
			$scope.project = data.project;

			$http.get(
					"./rest/jsonServices/deleteHPALMRoww?domain="
							+ $scope.domain + "&project=" + $scope.project,
					config).success(
					function(response) {

						if (response == 0) {

							$scope.$dismiss();
							$scope.open(
									'app/pages/admin/deletedSuccessMsg.html',
									'sm');
						}

						setTimeout(function() {
							$scope.redirecttodashboard();
						}, 2000);

					});

			$scope.redirecttodashboard = function() {

				$state.reload();
			}

		}

		// No Access Redirection ends here

		// Displays the user table details in Admin home screen
		$scope.getAdminTableDetails = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/adminDetails", config).success(
					function(response) {
						$rootScope.userDetails = response;
						$rootScope.totalcnt = response.length;
						$rootScope.rowCollection = response;

					})
		}
		$scope.statuses = [ {
			value : 1,
			text : 'SDET'
		}, {
			value : 2,
			text : 'admin'
		}, {
			value : 3,
			text : 'Developer'
		}, {
			value : 4,
			text : 'Tester'
		} ];

		$scope.showStatus = function(details) {

			if (details.role == 'SDET' || details.role == '1') {
				$scope.val = 1;
			}
			if (details.role == 'admin' || details.role == '2') {
				$scope.val = 2;
			}
			if (details.role == 'Developer' || details.role == '3') {
				$scope.val = 3;
			}
			if (details.role == 'Tester' || details.role == '4') {
				$scope.val = 4;
			}

			if ($scope.val) {
				$scope.selected = $filter('filter')($scope.statuses, {
					value : $scope.val
				});
			}
			return $scope.selected.length ? $scope.selected[0].text : 'Not set';
		};

		$scope.getRoleChange = function(details) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.valuerole = $('#getvalrole option:selected').text();
			$scope.roleUserId = details.userId;

			$http
					.get(
							"./rest/jsonServices/roleChange?userId="
									+ $scope.roleUserId + "&role="
									+ $scope.valuerole, config)
					.success(
							function(response) {
								$scope.valcheck = response;
								if (response == 1) {
									$scope
											.open(
													'app/pages/admin/roleUpdatedSuccessfully.html',
													'sm');
									setTimeout(function() {
										$scope.reload();
									}, 1000);
								}
							})
		}

		$scope.updateUser = function(details) {

			$scope.userIdUpdate = details.userId;
			$scope.passwordUpdate = btoa(details.password);
			$scope.userNameUpdate = details.userName;
			$scope.emailUpdate = details.email;
			$scope.mobileUpdate = details.mobileNum;
			$scope.IsDisabled = details.ldap;

			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/manageUser/updateAdminUser.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		}

		// export as pdf using jspdf

		$scope.exportData = function() {

			var pdf = new jsPDF('p', 'pt', 'a4');

			/*
			 * $(document).ready(function() { $("exportThis").click(function () {
			 * var sou= $("#content")[0].show(); });
			 */

			var source = $("#content")[0];
			var specialElementHandlers = {
				'#bypassmee' : function(element, renderer) {
					return true
				}
			};

			var margins = {
				top : 40,
				bottom : 40,
				left : 40,
				right : 40,
				width : 40
			};
			pdf.fromHTML(source, margins.left, margins.top,

			{
				'width' : margins.width,
				'elementHandlers' : specialElementHandlers
			},

			function(dispose) {
				pdf.save('tablecontent.pdf');
			}, margins);

		}

		// export as excel
		$scope.exportData = function() {
			var blob = new Blob(
					[ document.getElementById("exportableBizAdminDetails").innerHTML ],
					{
						type : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
					});
			saveAs(blob, "userDetails.xls");

		}
		// export as csv
		$scope.exportDataInCSV = function() {
			var table = TableExport(document
					.getElementById("exportableBizAdminDetails"));
			var exportData = table.getExportData();
			console.log("exportData", exportData);
			var samplecsvData = exportData.exportableBizAdminDetails.csv.data;
			var blob = new Blob([ samplecsvData ], {
				type : "application/vnd.ms-excel",
				type : "text/csv;charset=utf-8"
			});
			saveAs(blob, "userDetails.csv");

		};

		// csv table function
		/*
		 * $scope.getCsvTableDetails = function(start_index) { var token =
		 * getEncryptedValue(); var config = {headers: { 'Authorization': token
		 * }};
		 * 
		 * $scope.index = start_index; $http.get(
		 * "./rest/jsonServices/userDetails",config).success( function(response) {
		 * $scope.userDetails = response; console.log($scope.userDetails); }); };
		 */

		// csv download
		/*
		 * $scope.exportTableToCSV=function (filename) { var csv = []; var rows =
		 * document.querySelectorAll("table tr");
		 * 
		 * for (var i = 0; i < rows.length; i++) { var row = []; var cols =
		 * rows[i].querySelectorAll("td, th");
		 * 
		 * for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
		 * 
		 * csv.push(row.join(",")); } // Download CSV file
		 * downloadCSV(csv.join("\n"), filename); } function downloadCSV(csv,
		 * filename) { var csvFile; var downloadLink; // CSV file csvFile = new
		 * Blob([csv], {type: "text/csv"}); // Download link downloadLink =
		 * document.createElement("a"); // File name downloadLink.download =
		 * filename; // Create a link to the file downloadLink.href =
		 * window.URL.createObjectURL(csvFile); // Hide download link
		 * downloadLink.style.display = "none"; // Add the link to DOM
		 * document.body.appendChild(downloadLink); // Click download link
		 * downloadLink.click(); }
		 */
		// Editing User Method
		$scope.editUser = function(userDetails) {
			$scope.data = userDetails;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/CreateUser/editUser.html',

				scope : $scope,
				size : 'md',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Creating User Method
		$scope.creatingUser = function(userDetails) {
			$scope.data = userDetails;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/CreateUser/creatingUser.html',

				scope : $scope,
				size : 'md',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Project Access

		$scope.projectAccess = function(userDetails) {
			$scope.data = userDetails;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/projectAccess/projectAccess.html',

				scope : $scope,
				size : 'md',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};
		// Updates Edited User Information
		$scope.updateUserInfo = function(data) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(data);
			console.log(data);
			$http({
				url : "./rest/jsonServices/updateUserInfo",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				if (response == 1) {
					$scope.showSuccessMsg();
				}
			});

			$scope.$dismiss();
		}

		// Creating User Information
		$scope.createUserInfo = function(data) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(data);
			$http({
				url : "./rest/jsonServices/updateUserInfo",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getAdminTableDetails();
				$scope.getUserCount();
				$uibModalStack.dismissAll();
			});
		}

		// Delete User Popup Method
		$scope.deleteUser = function(userDetails) {
			$scope.data = userDetails;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/manageUser/deleteUser.html',

				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Removes User information completely
		/*
		 * $scope.deleteUserInfo = function(userId) { var token =
		 * getEncryptedValue(); var config = { headers : { 'Authorization' :
		 * token } };
		 * 
		 * $http({ url : "./rest/jsonServices/deleteUserInfo", method : "POST",
		 * data : userId, headers : { 'Authorization' : token } }).success(
		 * function(response) { if (response == 1) { $scope.$dismiss();
		 * $scope.open( 'app/pages/admin/deletedSuccessMsg.html', 'sm');
		 * setTimeout(function() { $scope.reload(); }, 500); } }); }
		 */
		// delete multiple users from the db on click of delete button
		/*$scope.deleteUserInfo = function(loginRequests) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(loginRequests);
			$http({
				url : "./rest/jsonServices/deleteUserInfo", //deleteUserList
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getAdminTableDetails();
				$scope.getUserCount();
			});
		}*/
		
		// Delete the user, But not taken from the record
		$scope.deleteUserInfo = function(userId) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(loginRequests);
			$http({
				url : "./rest/jsonServices/deleteUserInfo", //deleteUserList
				method : "POST",
				data : userId,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getAdminTableDetails();
				$scope.getUserCount();
			});
		}
		// End of the Delete user

		// To fetch pending login requests
		$scope.getLoginRequests = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/getloginRequests", config).success(
					function(response) {

						$scope.loginRequests = response;
						console.log("dataa", $scope.loginRequests)
						$scope.rowCollection = response;
					})
		}

		/*
		 * // To get project access details $scope.getProjectAccess = function() {
		 * 
		 * $http.get("./rest/jsonServices/projectaccess").success(function
		 * (response) {
		 * 
		 * $scope.operations_publish=response; $scope.operations = new
		 * Array($scope.operations_publish.length); $scope.output = ''; }); }
		 * 
		 * $scope.printOperations = function(userId) { $scope.output =
		 * getSelected(); var data = {'projectlist': $scope.output, 'userId' :
		 * userId} $rootScope.projectaccesslist = $scope.output; $http({ url:
		 * "./rest/jsonServices/userprojectaccess", method: "POST", params:
		 * data, }).success(function (response) { }); $scope.$dismiss(); }
		 */

		$scope.updateDashboards = function(userid) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.iduser = userid;

			$http.get(
					"rest/jsonServices/updateDashboards?&userId="
							+ $scope.iduser, config).success(
					function(response) {
						$scope.updateinfo = response;
					});
		}

		function getSelected() {
			return $scope.operations_publish.filter(function(x, i) {
				return $scope.operations[i]
			});
		}
		// reload after login

		$scope.reload = function() {
			$window.location.reload();
		}

		// To fetch active users
		$scope.getActiveUsers = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/getActiveUsers", config).success(
					function(response) {

						$rootScope.activeUsers = response;
						$rootScope.activeUsersRowCollection = response;
					})
		}
		// To fetch Inactive users
		$scope.getInactiveUsers = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/getInactiveUsers", config).success(
					function(response) {

						$rootScope.inactiveUsers = response;
						$rootScope.inactiveUsersRowCollection = response;
					})
		}

		// To fetch user counts and display in home screen of admin
		$scope.getUserCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get("./rest/jsonServices/adminUserCount", config)
					.success(
							function(response) {
								$rootScope.inactiveUsersCount = response[0].inactiveUsers;
								$rootScope.activeUsersCount = response[0].activeUsers;
								$rootScope.pendingRequestsCount = response[0].pendingRequests;
							})
		}

		// Accounts Lock resolve from Admin

		// To fetch user counts and display in home screen of admin
		$scope.lockedAccountCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/lockedAccountCount", config)
					.success(function(response) {
						$scope.lockedAccountDetails = response;
						$scope.lockedAccountDetailsSmartTable = response;
						$scope.lockedAccountCount = response.length;
					})
		}

		// Updates the Active Users to Inactive Users
		$scope.inactivateUsers = function(activeUsers) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(activeUsers);

			$http({
				url : "./rest/jsonServices/inactivateUsers",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getActiveUsers();
				$scope.getUserCount();
			});
		}
		/*
		 * $scope.redirect = function(){ $location.reload(); }
		 */
		// Updates the InActive Users to active Users
		$scope.activateUsers = function(inactiveUsers) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(inactiveUsers);

			$http({
				url : "./rest/jsonServices/activateUsers",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getInactiveUsers();
				$scope.getUserCount();
			});
		}

		// Updates the processed login requests
		$scope.processLogins = function(loginRequests) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(loginRequests);
			console.log("dataa", data)
			$http({
				url : "./rest/jsonServices/loginRequests",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.getLoginRequests()
				$scope.getUserCount();
			});
		}

		// Updates the processed lock requests
		$scope.processLocks = function(lockedAccountDetails) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var data = angular.toJson(lockedAccountDetails);
			$http({
				url : "./rest/jsonServices/lockRequests",
				method : "POST",
				data : data,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
			});
			$scope.reload();
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

		// Create User By Admin Method
		$scope.createAdminUser = function() {
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/CreateUser/createAdminUser.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Create User By Admin Method
		$scope.updateLicenseKey = function() {
			$uibModal.open({
				animation : true,
				templateUrl : 'app/pages/admin/updateLicenseKey.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		// Get and save new License Key

		$scope.saveNewLicenseKey = function(key) {
			var key = key.replace(/[+]/g, "%2B");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/updateLicenseKey?licenseKey=" + key,
					config).success(
					function(response) {
						$scope.result = response;
						if ($scope.result == true) {
							$scope.open(
									'app/pages/admin/licenseKeyUpdated.html',
									'sm');
						}
					})
		}

		// Create Organization By Admin Method
		$scope.createOrg = function(getid) {
			$scope.getid = getid;
			if ($scope.getid == undefined) {
				$scope.multidropdown = true;
			} else {
				$scope.multidropdown = false;
			}
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/UserManagement/createOrganization/createOrg.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};
		
		
		// Create User in Admin Module.

		$scope.saveAdminUser = function(form) {
			
			var token = AES.getEncryptedValue();

			if ($("#rdnormal").is(":checked")) {
				$scope.usertype = "normal";
			} else {
				$scope.usertype = "ldap";
			}

			if ($scope.usertype == "normal") {

				$scope.userid = form.userId;
				$scope.password = form.password;
				$scope.username = form.userName;
				$scope.email = form.email;
				$scope.mobile = form.mobile;
				$scope.isAccessible = true;
				$scope.role = "tester";
				$scope.isAdmin = false;
				$scope.isOperational = false;
				$scope.isLifeCycle = false;
				$scope.isRiskCompliance = false;
				$scope.isCustomMetrics = false;
				$scope.isQbot = false;
				$scope.isCoEDashboard = false;
				$scope.unavailable = false;
				$scope.isActive = true;
				$scope.isldap = false;

				var signUpData = new FormData();
				signUpData.append('userId', $scope.userid);
				signUpData.append('password', $scope.password ? AES
						.encode($scope.password) : '');
				signUpData.append('userName', $scope.username);
				signUpData.append('email', $scope.email);
				signUpData.append('mobileNum', $scope.mobile);
				signUpData.append('ldap', $scope.isldap);

				var signUpDataDefault = {
					userId : $scope.userid,
					password : $scope.password,
					userName : $scope.username,
					email : $scope.email,
					mobileNum : $scope.mobile,
					accessible : true,
					ldap : false,
					active : true
				}

			} else if ($scope.usertype == "ldap") {
				$scope.userid = form.userId;
				$scope.password = null;
				$scope.username = null;
				$scope.email = null;
				$scope.mobile = null;
				$scope.isAccessible = true;
				$scope.role = "tester";
				$scope.isAdmin = false;
				$scope.isOperational = false;
				$scope.isLifeCycle = false;
				$scope.isQbot = false;
				$scope.isCoEDashboard = false;
				$scope.isRiskCompliance = false;
				$scope.isCustomMetrics = false;
				$scope.unavailable = false;
				$scope.isActive = true;
				$scope.isldap = true;

				$scope.password = null;

				var signUpData = new FormData();
				signUpData.append('userId', $scope.userid);
				signUpData.append('password', $scope.password ? AES
						.encode($scope.password) : '');
				signUpData.append('userName', $scope.username);
				signUpData.append('email', $scope.email);
				signUpData.append('mobileNum', $scope.mobile);
				signUpData.append('ldap', $scope.isldap);

				var signUpDataDefault = {
					userId : $scope.userid,
					password : $scope.password,
					userName : $scope.username,
					email : $scope.email,
					mobileNum : $scope.mobile,
					accessible : true,
					ldap : true,
					active : true
				}
			}

			$http({
				url : "rest/jsonServices/createAdminUser",
				method : "POST",
				data : signUpData,
				headers : {
					'Authorization' : token,
					'Content-Type' : undefined
				},
				transformRequest : angular.identity
			}).success(function(response) {

				if (response == 0) {
					$scope.creatingUser(signUpDataDefault);
				} else if (response == 1) {
					$scope.showWarningMsg("UserId");
				} else if (response == 2) {
					$scope.showWarningMsg("User Name");
				} else if (response == 3) {
					$scope.showWarningMsg("Email");
				} else if (response == 4) {
					$scope.showWarningMsg("Mobile Number");
				}
			});

		}

		$scope.updateAdminUser = function(form) {

			var token = AES.getEncryptedValue();

			$scope.userId = form.userId;
			$scope.username = form.userName;
			$scope.email = form.email;
			$scope.mobile = form.mobile;

			var updateData = new FormData();
			updateData.append('userId', $scope.userId);
			updateData.append('userName', $scope.username);
			updateData.append('email', $scope.email);
			updateData.append('mobileNum', $scope.mobile);

			$http({
				url : "rest/jsonServices/adminupdate",
				method : "POST",
				data : updateData,
				headers : {
					'Authorization' : token,
					'Content-Type' : undefined
				},
				transformRequest : angular.identity
			}).success(function(response) {
				
				if (response == 0) {
					$scope.showSuccessMsg(signUpDataDefault);
				} else if (response == 1) {
					$scope.showWarningMsg("UserId");
				} else if (response == 2) {
					$scope.showWarningMsg("User Name");
				} else if (response == 3) {
					$scope.showWarningMsg("Email");
				} else if (response == 4) {
					$scope.showWarningMsg("Mobile Number");
				}
			});
		}

		$scope.showSuccessMsg = function() {
			$scope.open('/app/admin/UserManagement/manageUser/savedSuccessfully.html', 'sm');
			setTimeout(function() {
				$scope.reload();
			}, 1000);

		};

		$scope.showCreateSuccessMsg = function() {
			$scope.open('app/pages/admin/createdSuccessfully.html', 'sm');
		};

		$scope.showWarningMsg = function(value) {
			$scope.value = value;
			$scope.openwarning($scope.value, 'app/pages/admin/warningMsg.html',
					'sm');
		};

		// Modal dialog for warning message
		$scope.openwarning = function(value, url, size) {
			$scope.value = value;
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

		$scope.showDeletedMsg = function() {

			toastr.success('User has been deleted Successfully ');
		};

		$scope.loadItems = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/getprojectsforadminaccess", config)
					.success(function(response) {
						$scope.rel_items = response;
						console.log("2result::");
						$scope.rel_items = updateViewData();
					});
		};

		$scope.loadJiraItems = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/getjiraprojectsforadminaccess",
					config).success(function(response) {
				$scope.rel_jira_items = response;
				$scope.rel_jira_items = updateJiraViewData();
			});
		};

		/*
		 * $(document).ready(function() { if($rootScope.operationalcomponent !=
		 * null && $rootScope.operationaljiracomponent != null){ //
		 * console.log($rootScope.rel_items); console.log("kxjdfnblb");
		 * $scope.rel_items = updateViewData(); $scope.rel_jira_items =
		 * updateJiraViewData(); $scope.changeRouteOperational();
		 * $scope.changeJiraRouteOperational(); $rootScope.operationalcomponent =
		 * null; $rootScope.operationaljiracomponent = null;} });
		 */

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
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				var sourceTool = selectItems[m].sourceTool;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */
					var rel_selected = selectItems[m].children[i].selected;
					if (rel_selected) {
						var obj = new Object();
						obj.level1 = level1;
						obj.level2 = level2;
						obj.sourceTool = sourceTool;
						/*
						 * obj.releaseName = releaseName; obj.levelId = levelId;
						 */

						var Selectedstring = JSON.stringify(obj);
						if (selectedItems == "") {
							selectedItems = Selectedstring;
						} else {
							selectedItems = selectedItems + ","
									+ Selectedstring;
						}

						// console.log(Selectedstring);
						// console.log(JSON.parse(string));
						/* } */
					}
				}
			}

			return selectedItems;
		}
		;

		function getJiraSelectedData() {

			var selectedItems = "";

			var selectItems = $scope.rel_jira_items;
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				var sourceTool = selectItems[m].sourceTool;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */
					var rel_selected = selectItems[m].children[i].selected;
					if (rel_selected) {
						var obj = new Object();
						obj.level1 = level1;
						obj.level2 = level2;
						obj.sourceTool = sourceTool;
						/*
						 * obj.releaseName = releaseName; obj.levelId = levelId;
						 */

						var Selectedstring = JSON.stringify(obj);
						if (selectedItems == "") {
							selectedItems = Selectedstring;
						} else {
							selectedItems = selectedItems + ","
									+ Selectedstring;
						}

						// console.log(Selectedstring);
						// console.log(JSON.parse(string));
						/* } */
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
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */

					// var rel_selected =
					// selectItems[m].children[i].children[j].selected;
					for (var z = 0; z < selectedItems.length; z++) {
						/* var sel_levelId = selectedItems[z].levelId; */
						var sel_project = selectedItems[z].level2;
						var sel_domain = selectedItems[z].level1;

						if (sel_project == level2 && sel_domain == level1) {
							selectItems[m].children[i].selected = true;
							break;
						}
						/*
						 * } }
						 */
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
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */

					// var rel_selected =
					// selectItems[m].children[i].children[j].selected;
					for (var z = 0; z < selectedItems.length; z++) {
						/* var sel_levelId = selectedItems[z].levelId; */
						var sel_project = selectedItems[z].level2;
						var sel_domain = selectedItems[z].level1;

						if (sel_project == level2 && sel_domain == level1) {
							selectItems[m].children[i].selected = true;
							break;
						}
						/*
						 * } }
						 */
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
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

			$state.go('admin');

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

			// console.log($scope.rel_items.length);

			var checkItems = $scope.rel_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

			// console.log($scope.rel_items.length);

			var checkItems = $scope.rel_jira_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

		// saving user selection

		$scope.getSelection = function(userId) {
			var token = AES.getEncryptedValue();

			/*
			 * $scope.dashName = form.dashname; $scope.description =
			 * form.description; $scope.owner = form.owner;
			 */

			var selectedItems = getSelectedData();
			var selectedJiraItems = getJiraSelectedData();

			var selectedData = selectedItems + "," + selectedJiraItems;

			var selectedProjects = {
				'selectedProjects' : selectedData,
				'userId' : userId
			}

			$http({
				url : "./rest/jsonServices/saveAdminProjectAccess",
				method : "POST",
				params : selectedProjects,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.updateDashboards(userId);
				if (response == 0) {

					$scope.open('app/admin/UserManagement/projectAccess/updatedAdminMsg.html', 'sm');
				}
			});
			setTimeout(function() {
				$state.reload();
			}, 2000);

			$scope.$dismiss();
		}

		$scope.changeRouteOperational = function(item) {
			$rootScope.operationalcomponent = item.selectedProjects;
			$scope.loadItems();
			// $rootScope.rel_items = $scope.rel_items;
		}

		$scope.changeJiraRouteOperational = function(item) {
			$rootScope.operationaljiracomponent = item.selectedProjects;
			$scope.loadJiraItems();
			// $rootScope.rel_jira_items = $scope.rel_jira_items;
		}

		$scope.htmlPopover = $sce
				.trustAsHtml('<b style="color: navy">Updating Project Access will also reflect in saved dashboards.</b>');

		$scope.hovered = function(hovering) {
			$timeout(function() {
				console.log('update with timeout fired');
				if (hovering.objHovered == true) {
					hovering.popoverOpened2 = true;
				}
			}, 500);
		}

		// upload organisation image
		$scope.UploadLogoResourceFile = function(files) {

			// alert("ResourceFile");

			/*
			 * $scope.SelectedFileForUpload = files[0]; $scope.selectedFileName =
			 * $scope.SelectedFileForUpload.name; $scope.extension =
			 * $scope.selectedFileName.split('.').pop() .toLowerCase();
			 */

			$scope.SelectedFileForUpload = files[0];
			$scope.selectedFileName = $scope.SelectedFileForUpload.name;
			var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

			if (!allowedExtensions.exec($scope.selectedFileName)) {

				angular.element(document.getElementById("file")).val(null);

				if (flagVal == 'upload') {
					$scope.SelectedFileForUpload = undefined;
					$scope.selectedFileName = "InvalidFile";
				} else {
					$scope.selectedFileName = 'unchanged';
					$scope.editUserModel.profilePhoto = $scope.temppic;
				}
				return $scope.showWarnError("Profile Photo");

				// $scope.extFlag = true;
				// $scope.fileExtError = 'Please upload file having extensions
				// .jpeg/.jpg/ .gif only.';
				// $scope.open('app/pages/login/fileFormatMsg.html', 'sm');
				// return false;
			} else {
				$scope.extension = $scope.selectedFileName.split('.').pop()
						.toLowerCase();
			}

			$scope.progress = 0;
			fileReader.readAsDataUrl($scope.SelectedFileForUpload, $scope)
					.then(
							function(result) {
								$scope.profilePhoto = result.substr(result
										.indexOf(',') + 1);
							});

		};

		/*
		 * $(document).ready(function() { if($rootScope.operationalcomponent !=
		 * null && $rootScope.operationaljiracomponent != null){ //
		 * console.log($rootScope.rel_items); console.log("kxjdfnblb");
		 * $scope.rel_items = updateViewData(); $scope.rel_jira_items =
		 * updateJiraViewData(); $scope.changeRouteOperational();
		 * $scope.changeJiraRouteOperational(); $rootScope.operationalcomponent =
		 * null; $rootScope.operationaljiracomponent = null;} });
		 */

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
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				var sourceTool = selectItems[m].sourceTool;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */
					var rel_selected = selectItems[m].children[i].selected;
					if (rel_selected) {
						var obj = new Object();
						obj.level1 = level1;
						obj.level2 = level2;
						obj.sourceTool = sourceTool;
						/*
						 * obj.releaseName = releaseName; obj.levelId = levelId;
						 */

						var Selectedstring = JSON.stringify(obj);
						if (selectedItems == "") {
							selectedItems = Selectedstring;
						} else {
							selectedItems = selectedItems + ","
									+ Selectedstring;
						}

						// console.log(Selectedstring);
						// console.log(JSON.parse(string));
						/* } */
					}
				}
			}

			return selectedItems;
		}
		;

		function getJiraSelectedData() {

			var selectedItems = "";

			var selectItems = $scope.rel_jira_items;
			for (var m = 0; m < selectItems.length; m++) {
				var level1 = selectItems[m].level1;
				var sourceTool = selectItems[m].sourceTool;
				for (var i = 0; i < selectItems[m].children.length; i++) {
					var level2 = selectItems[m].children[i].level2;
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */
					var rel_selected = selectItems[m].children[i].selected;
					if (rel_selected) {
						var obj = new Object();
						obj.level1 = level1;
						obj.level2 = level2;
						obj.sourceTool = sourceTool;
						/*
						 * obj.releaseName = releaseName; obj.levelId = levelId;
						 */

						var Selectedstring = JSON.stringify(obj);
						if (selectedItems == "") {
							selectedItems = Selectedstring;
						} else {
							selectedItems = selectedItems + ","
									+ Selectedstring;
						}

						// console.log(Selectedstring);
						// console.log(JSON.parse(string));
						/* } */
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
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */

					// var rel_selected =
					// selectItems[m].children[i].children[j].selected;
					for (var z = 0; z < selectedItems.length; z++) {
						/* var sel_levelId = selectedItems[z].levelId; */
						var sel_project = selectedItems[z].level2;
						var sel_domain = selectedItems[z].level1;

						if (sel_project == level2 && sel_domain == level1) {
							selectItems[m].children[i].selected = true;
							break;
						}
						/*
						 * } }
						 */
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
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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
					/*
					 * for (var j = 0; j <
					 * selectItems[m].children[i].children.length; j++) { var
					 * releaseName =
					 * selectItems[m].children[i].children[j].releaseName; var
					 * levelId = selectItems[m].children[i].children[j].levelId;
					 */

					// var rel_selected =
					// selectItems[m].children[i].children[j].selected;
					for (var z = 0; z < selectedItems.length; z++) {
						/* var sel_levelId = selectedItems[z].levelId; */
						var sel_project = selectedItems[z].level2;
						var sel_domain = selectedItems[z].level1;

						if (sel_project == level2 && sel_domain == level1) {
							selectItems[m].children[i].selected = true;
							break;
						}
						/*
						 * } }
						 */
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
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

			// console.log($scope.rel_items.length);

			var checkItems = $scope.rel_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

			// console.log($scope.rel_items.length);

			var checkItems = $scope.rel_jira_items;

			var SelectedDomains = 0;
			var InterDomains = 0;

			for (var i = 0; i < checkItems.length; i++) {
				// Inside Domain

				var IsDomain_SelectedProjects = 0;
				var IsDomain_InterProjects = 0;
				var objDomain = checkItems[i];

				for (var j = 0; j < objDomain.children.length; j++) {
					var objPro = objDomain.children[j];
					if (objPro.selected == true) {
						IsDomain_SelectedProjects++;

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

		// saving user selection

		$scope.getSelection = function(userId) {
			var token = AES.getEncryptedValue();

			/*
			 * $scope.dashName = form.dashname; $scope.description =
			 * form.description; $scope.owner = form.owner;
			 */

			var selectedItems = getSelectedData();
			var selectedJiraItems = getJiraSelectedData();

			if (selectedItems != "" && selectedJiraItems != "") {
				var selectedData = selectedItems + "," + selectedJiraItems;
			} else if (selectedItems != "") {
				var selectedData = selectedItems;
			} else if (selectedJiraItems != "") {
				var selectedData = selectedJiraItems;
			}

			var selectedProjects = {
				'selectedProjects' : selectedData,
				'userId' : userId
			}

			$http({
				url : "./rest/jsonServices/saveAdminProjectAccess",
				method : "POST",
				params : selectedProjects,
				headers : {
					'Authorization' : token
				}
			}).success(function(response) {
				$scope.updateDashboards(userId);
				if (response == 0) {

					$scope.open('app/admin/UserManagement/projectAccess/updatedAdminMsg.html', 'sm');
				}
			});

		}

		$scope.changeRouteOperational = function(item) {
			$rootScope.operationalcomponent = item.selectedProjects;
			$scope.loadItems();
			// $rootScope.rel_items = $scope.rel_items;
		}

		$scope.changeJiraRouteOperational = function(item) {
			$rootScope.operationaljiracomponent = item.selectedProjects;
			$scope.loadJiraItems();
			// $rootScope.rel_jira_items = $scope.rel_jira_items;
		}

		$scope.htmlPopover = $sce
				.trustAsHtml('<b style="color: navy">Updating Project Access will also reflect in saved dashboards.</b>');

		$scope.hovered = function(hovering) {
			$timeout(function() {
				console.log('update with timeout fired');
				if (hovering.objHovered == true) {
					hovering.popoverOpened2 = true;
				}
			}, 500);
		}

		// upload organisation image
		$scope.UploadResourceFile = function(files, flagVal) {

			$scope.SelectedFileForUpload = files[0];
			$scope.selectedFileName = $scope.SelectedFileForUpload.name;
			var allowedExtensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;

			if (!allowedExtensions.exec($scope.selectedFileName)) {

				angular.element(document.getElementById("file")).val(null);

				if (flagVal == 'upload') {
					$scope.SelectedFileForUpload = undefined;
					$scope.selectedFileName = "InvalidFile";
				} else {
					$scope.selectedFileName = 'unchanged';
					$scope.editUserModel.profilePhoto = $scope.temppic;
				}
				return $scope.showWarnError("Profile Photo");

				// $scope.extFlag = true;
				// $scope.fileExtError = 'Please upload file having extensions
				// .jpeg/.jpg/ .gif only.';
				// $scope.open('app/pages/login/fileFormatMsg.html', 'sm');
				// return false;
			} else {
				$scope.extension = $scope.selectedFileName.split('.').pop()
						.toLowerCase();
			}

			$scope.progress = 0;
			fileReader.readAsDataUrl($scope.SelectedFileForUpload, $scope)
					.then(
							function(result) {
								$scope.profilePhoto = result.substr(result
										.indexOf(',') + 1);
							});

		};

		// UserList
		$scope.getusers = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get("./rest/jsonServices/adminDetails", config).success(
					function(response) {
						$scope.userDrops = response;
						$scope.multiusers = [];
						$scope.selusers = [];
						for (var i = 0; i < $scope.userDrops.length; i++) {
							$scope.multiusers.push({
								"label" : $scope.userDrops[i].userId
							});
						}
					})

		}

		$scope.scrollsettings = {
			scrollableHeight : '150px',
			scrollable : true,
		};

		// GET SELECTED FROM USER DROP DOWN LIST
		$scope.myEventListenersuser = {
			onSelectionChanged : onSelectionChangeduser,
		};

		function onSelectionChangeduser() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.usersel = [];
			for (var i = 0; i < $scope.selusers.length; i++) {
				$scope.usersel.push($scope.selusers[i].label);
			}

		}

		/*
		 * $scope.uploadImage = function(usersel) { if (usersel != undefined) {
		 * $scope.usersel = usersel; }
		 * 
		 * var userDetails = new FormData(); userDetails.append('orgName',
		 * $scope.org); userDetails.append('orgLogo',
		 * $scope.SelectedFileForUpload); userDetails.append('usersel',
		 * $scope.usersel); userDetails.append('filename',
		 * $scope.selectedFileName);
		 * 
		 * var token = AES.getEncryptedValue(); var config = { headers : {
		 * 'Authorization' : token } };
		 * 
		 * $http({ url : "./rest/jsonServices/uploadOrgLogo", method : "POST",
		 * data : userDetails, headers : { 'Authorization' : token,
		 * 'Content-Type' : undefined }, transformRequest : angular.identity
		 * }).success( function(response) { if (response == 1) { $scope.open(
		 * 'app/pages/admin/orgLogoUpdatedMsg.html', 'sm');
		 * setTimeout(function() { $state.reload(); }, 2000);
		 * 
		 * $scope.$dismiss();
		 *  } else { $scope.open( 'app/pages/admin/orgLogoFailedMsg.html',
		 * 'sm'); }
		 * 
		 * });
		 *  }
		 */

		/***********************************************************************
		 * Function : Upload Organization Image Description : To Upload
		 * Organization image to check the header information Date of Change : 4 /
		 * 8 / 2020 Changed By : Subbu (138497)
		 */

		$scope.uploadImage = function(usersel) {

			if (usersel != undefined) {
				$scope.usersel = usersel;
			}

			var userDetails = new FormData();
			userDetails.append('orgName', $scope.org);
			userDetails.append('orgLogo', $scope.SelectedFileForUpload);
			userDetails.append('usersel', $scope.usersel);
			userDetails.append('filename', $scope.selectedFileName);

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			// File Reader to verify file type before uploading...

			var reader = new FileReader();
			reader.readAsArrayBuffer($scope.SelectedFileForUpload);
			var filetype = "";
			var filetypeValid = "";
			reader.onloadend = function(evt) {

				var arr = (new Uint8Array(evt.target.result)).subarray(0, 4);
				var MIMEheader = "";
				for (var i = 0; i < arr.length; i++) {
					MIMEheader += arr[i].toString(16);
				}
				switch (MIMEheader) {
				case "89504e47":
					filetype = "image/png";
					filetypeValid = "Yes";
					break;
				case "47494638":
					filetype = "image/gif";
					filetypeValid = "Yes";
					break;
				case "ffd8ffe0":
				case "ffd8ffe1":
				case "ffd8ffe2":
					filetype = "image/jpeg";
					filetypeValid = "Yes";
					break;
				default:
					filetype = "unknown";
					break;
				}

				if (filetypeValid == "Yes") {
					// REST CALL
					$http({
						url : "./rest/jsonServices/uploadOrgLogo",
						method : "POST",
						data : userDetails,
						headers : {
							'Authorization' : token,
							'Content-Type' : undefined
						},
						transformRequest : angular.identity
					})
							.success(
									function(response) {
										if (response == 1) {
											$scope
													.open(
															'app/admin/UserManagement/createOrganization/orgLogoUpdatedMsg.html',
															'sm');
											setTimeout(function() {
												$state.reload();
											}, 2000);

											/* $scope.$dismiss(); */

										} else {
											$scope
													.open(
															'app/admin/UserManagement/createOrganization/orgLogoFailedMsg.html',
															'sm');
										}

									});

					// REST CALL
				} else {
					$scope.open('app/admin/UserManagement/createOrganization/orgLogoFailedMsg.html', 'sm');
				}

			}
			// File Reader to verify file type before uploading....

		}

		/** ****************************************************************** */

		/***********************************************************************
		 * Function : Upload User Image Description : To Upload User Image image
		 * to check the header information Date of Change : 4 / 8 / 2020 Changed
		 * By : Subbu (138497)
		 */

		$scope.uploadUserImage = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			var userImgDetails = new FormData();

			userImgDetails.append('filename', $scope.selectedFileName);
			userImgDetails.append('userImg', $scope.SelectedFileForUpload);

			// File Reader to verify file type before uploading...

			var reader = new FileReader();
			reader.readAsArrayBuffer($scope.SelectedFileForUpload);
			var filetype = "";
			var filetypeValid = "";
			reader.onloadend = function(evt) {

				var arr = (new Uint8Array(evt.target.result)).subarray(0, 4);
				var MIMEheader = "";
				for (var i = 0; i < arr.length; i++) {
					MIMEheader += arr[i].toString(16);
				}
				switch (MIMEheader) {
				case "89504e47":
					filetype = "image/png";
					filetypeValid = "Yes";
					break;
				case "47494638":
					filetype = "image/gif";
					filetypeValid = "Yes";
					break;
				case "ffd8ffe0":
				case "ffd8ffe1":
				case "ffd8ffe2":
					filetype = "image/jpeg";
					filetypeValid = "Yes";
					break;
				default:
					filetype = "unknown";
					break;
				}

				if (filetypeValid == "Yes") {
					// REST CALL
					$http({
						url : "./rest/jsonServices/uploadUserImg",
						method : "POST",
						data : userImgDetails,
						headers : {
							'Authorization' : token,
							'Content-Type' : undefined
						},
						transformRequest : angular.identity
					})
							.success(
									function(response) {

										if (response == 1) {
											$scope
													.open(
															'app/Login/userImageUpdatedSuccess.html',
															'sm');
											setTimeout(function() {
												$state.reload();
											}, 2000);

											$scope.$dismiss();

										} else {
											$scope
													.open(
															'app/Login/userImageUpdatedFail.html',
															'sm');
										}

									});

					// REST CALL
				} else {
					$scope.open('app/Login/userImageUpdatedFail.html',
							'sm');
				}

			}
			// File Reader to verify file type before uploading....

		}

		/** ****************************************************************** */

		/*
		 * $scope.uploadUserImage = function() {
		 * 
		 * var token = AES.getEncryptedValue(); var config = { headers : {
		 * 'Authorization' : token } };
		 * 
		 * var userImgDetails = new FormData();
		 * 
		 * userImgDetails.append('filename', $scope.selectedFileName);
		 * userImgDetails.append('userImg', $scope.SelectedFileForUpload);
		 * 
		 * $http({ url : "./rest/jsonServices/uploadUserImg", method : "POST",
		 * data : userImgDetails, headers : { 'Authorization' : token,
		 * 'Content-Type' : undefined }, transformRequest : angular.identity })
		 * .success( function(response) {
		 * 
		 * if (response == 1) { $scope .open(
		 * 'app/pages/login/userImageUpdatedSuccess.html', 'sm');
		 * setTimeout(function() { $state.reload(); }, 2000);
		 * 
		 * $scope.$dismiss();
		 *  } else { $scope .open( 'app/pages/login/userImageUpdatedFail.html',
		 * 'sm'); }
		 * 
		 * });
		 *  }
		 */
		$scope.removeImg = function(userId) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get("./rest/jsonServices/removeImg?userId=" + userId,
							config)
					.success(
							function(response) {
								if (response == 1) {
									$scope
											.open(
													'app/pages/admin/orgLogoRemovedMsg.html',
													'sm');
									setTimeout(function() {
										$state.reload();
									}, 2000);

									$scope.$dismiss();

								}

							});
		}

		// Check Normal user or LDAP user

		$("#rdldap, #rdnormal").change(function() {
			if ($("#rdnormal").is(":checked")) {
				// $('#normaluser').show();
				$('#normaluser :input').attr('disabled', false);
			} else if ($("#rdldap").is(":checked")) {
				// $('#normaluser').hide();
				$('#normaluser :input').attr('disabled', true);
			}

		});
		
		
	}

})();
