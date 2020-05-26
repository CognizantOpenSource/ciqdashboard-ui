
(function() {
	'use strict';

	angular.module('MetricsPortal.Login').controller('lifecycleLayoutSelectionCtrl',
			lifecycleLayoutSelectionCtrl);
	/** @ngInject */
	function lifecycleLayoutSelectionCtrl($sessionStorage,AES, paginationService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$state, $uibModal, $rootScope, baConfig, layoutPaths, $window,
			$filter, $sce, $location, toastr, $uibModalStack) {

		/*function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}*/
		
		
		
		$scope.generateModel = function() {
			$scope.titleList = [ "Industry Standard Metrics",
					"Selected Metrics List" ];
			$scope.isToolSelectedAlready();

			$rootScope.toolListLen = localStorageService.get('toolListLen');
			$scope.toolListSel = localStorageService.get('toolList');
			if ($rootScope.toolListLen > 0) {
				$scope.toolList = [ "User Story", "Build", "SCM", "Deployment",
						"Code Quality", "Test Management" ];
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
						"Code Quality", "Test Management" ];
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
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-github.png";
										$scope.key = "gitHub";
									} else if (model.lists.selected[i].label == "Test Management") {
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-hp.png";
										$scope.key = "testManagement";
									} else if (model.lists.selected[i].label == "Code Quality") {
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-sonar.png";
										$scope.key = "codeQuality";
									} else if (model.lists.selected[i].label == "User Story") {
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-jira.png";
										$scope.key = "userStory";
									} else if (model.lists.selected[i].label == "Deployment") {
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-chef.png";
										$scope.key = "chef";
									} else if (model.lists.selected[i].label == "Build") {
										$scope.imgPath = "app\\admin\\lifecycleLayoutSelection\\icon-jenkins.png";
										$scope.key = "build";
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
		$scope.generateImg = function() {
			$scope.imglist = [];
			for (var i = 0; i < $scope.toolsSelected.length; i++) {
				$scope.imglist.push($scope.toolsSelected[i].imagePath);
			}
		}
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

			var uri = "./rest/lifecycleLayoutSelectionServices/saveToolDetails?toolsSelected="
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
													'app/admin/lifecycleLayoutSelection/selectionSavedSuccessfully.html',
													'sm');
									setTimeout(function() {
										$state.go('admin');
									}, 2000);
								}
							});
		}
		
		$scope.cancel = function() {

			$state.go('admin');

		};
	}
})();