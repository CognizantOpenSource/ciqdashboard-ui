(function() {
	'use strict';

	angular.module('MetricsPortal.Login').controller('jiraToolConfigurationCtrl',
			jiraToolConfigurationCtrl);
	/** @ngInject */
	function jiraToolConfigurationCtrl($sessionStorage,AES, paginationService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$state, $uibModal, $rootScope, baConfig, layoutPaths, $window) {
		/*function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}*/

		$scope.addJiraInstanceInfo = function(data) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if (data.name != undefined && data.name != ""
					&& data.url != undefined && data.url != ""
					&& data.username != undefined && data.username != ""
					&& data.password != undefined && data.password != ""
					&& data.customEpic != undefined && data.customEpic != ""
					&& data.customSprint != undefined
					&& data.customSprint != ""
					&& data.customStorypoints != undefined
					&& data.customStorypoints != "") {

				var verification = "false";
				if (data.testPlugin == "Zephyr") {
					if (data.zephyrUrl != undefined && data.zephyrUrl != ""
							&& data.zephyrUsername != undefined
							&& data.zephyrUsername != ""
							&& data.zephyrAccessKey != undefined
							&& data.zephyrAccessKey != ""
							&& data.zephyrSecretKey != undefined
							&& data.zephyrSecretKey != ""
							&& data.customAutomation != undefined
							&& data.customAutomation != "") {
						verification = "true";
					}
				} else if (data.testPlugin == "QMetry") {
					if (data.qMetryAPIKey != undefined
							&& data.qMetryAPIKey != ""
							&& data.customAutomation != undefined
							&& data.customAutomation != "") {
						verification = "true";
					}
				} else if (data.testPlugin == "NONE") {
					verification = "true";
				}

				if (verification == "true") {
					data.password = btoa(data.password);
					var data = angular.toJson(data);

					$http(
							{
								url : "./rest/jiraToolConfigurationServices/addJiraInstanceInfo",
								method : "POST",
								data : data,
								headers : {
									'Authorization' : token
								}
							}).success(function(response) {
						$window.location.reload();
					});

					$scope.$dismiss();
				} else {
					alert("Please provide jira plugin details !")
				}

			} else {
				alert("Please fill all jira details !")
			}

		}

		$scope.loadJiraInstanceInfo = function() {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("./rest/jiraToolConfigurationServices/getJiraInstanceInfo",
					config).success(
					function(response) {

						if (response.length != 0) {
							$scope.jiraInstanceDetails = response[0];
							$scope.instanceListJira = response[0].servers;
							$scope.scheduler = response[0].scheduler;
							$scope.runStatus = response[0].runStatus;
							$scope.runDuration = response[0].runDuration;
							$scope.runStartTime = response[0].runStartTime;
							$scope.runEndTime = response[0].runEndTime;

							$scope.nextRunTime = new Date(
									response[0].runStartTime)
									.addHours($scope.scheduler);
							$scope.expectedEndTime = new Date(
									response[0].runStartTime)
									.addMinutes($scope.runDuration);

						}

					});

		}
		Date.prototype.addHours = function(h) {
			this.setTime(this.getTime() + (h * 60 * 60 * 1000));
			return this;
		}
		Date.prototype.addMinutes = function(m) {
			this.setTime(this.getTime() + (m * 60 * 1000));
			return this;
		}
		// Editing Scheduler Data
		$scope.updateJiraScheduler = function(instanceDetails) {
			$scope.data = instanceDetails;
			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/admin/toolsConfiguration/jira/jiraScheduler.html',

						scope : $scope,
						size : 'lg',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});
		};

		// Updates Edited Scheduler Data
		$scope.updateJiraSchedulerInfo = function(data) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (isInt(data.scheduler)) {
				// if (data === parseInt(data, 10)){
				var data = angular.toJson(data);
				$http(
						{
							url : "./rest/jiraToolConfigurationServices/updateJiraSchedulerInfo",
							method : "POST",
							data : data,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.scheduler = response;
					$scope.reload();
				});
				$scope.$dismiss();
			} else {
				alert("Hour should be integer")
			}

		}

		$scope.closeJiraProjects = function() {
			$window.location.reload();
		}

		$scope.updateJiraProjects = function(instanceDetails, jiraId) {
			$scope.data = instanceDetails;
			$scope.jiraId = jiraId;
			$scope.stjiraprojects = instanceDetails.projects;
			$scope.safejiraprojects = instanceDetails.projects;

			$uibModal.open({
				animation : false,
				templateUrl : 'app/admin/toolsConfiguration/jira/jiraProjects.html',

				scope : $scope,
				size : 'lg',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});

		}

		$scope.addJiraProjectData = function(jiraProjectName, id) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (jiraProjectName != undefined && jiraProjectName != "") {

				var projectdata = {
					jiraProjectName : jiraProjectName,
					instanceId : id
				}

				$http(
						{
							url : "./rest/jiraToolConfigurationServices/addJiraProjectToDb",
							method : "POST",
							params : projectdata,
							headers : {
								'Authorization' : token
							}
						})
						.success(
								function(response) {
									if (response != "") {
										document.getElementById('jiraProject').value = '';
										$scope.reloadJIRAProjects(response, id);
									} else {
										$scope.level = "project";
										$scope.value = jiraProjectName;
										$uibModal
												.open({
													animation : false,
													templateUrl : 'app/admin/toolsConfiguration/jira/warningAlreadyExists.html',

													scope : $scope,
													size : 'sm',
													resolve : {
														items : function() {
															return $scope.items;
														}
													}
												});
									}

								});

			} else {
				$scope.value = "Project Name";
				$uibModal
						.open({
							animation : false,
							templateUrl : 'app/admin/toolsConfiguration/jira/warningProject.html',

							scope : $scope,
							size : 'sm',
							resolve : {
								items : function() {
									return $scope.items;
								}
							}
						});
			}
		}

		$scope.reloadJIRAProjects = function(data, id) {
			$scope.jiraId = id;
			$scope.instanceName = data.name;
			$scope.projectList = data.projects;
			$scope.stjiraprojects = data.projects;
			$scope.safejiraprojects = data.projects;

		};

		// Delete JIRA Project
		$scope.deleteJiraProject = function(jiraProjectName, id) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (jiraProjectName != undefined && jiraProjectName != "") {
				var prjdata = {
					jiraProjectName : jiraProjectName,
					instanceId : id
				}

				$http(
						{
							url : "./rest/jiraToolConfigurationServices/removeJiraProjectInDb",
							method : "POST",
							params : prjdata,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.reloadJIRAProjects(response, id);

				});

			}

		}

		// Editing JIRA Instance Data
		$scope.updateJiraInstanceDetails = function(jiraId) {
			$scope.jiraId = localStorageService.set('jiraId', jiraId);
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/jira/editJiraInstanceInfo.html',

						scope : $scope,
						size : 'lg',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		};
		$scope.loadJiraInstanceDetails = function() {
			$scope.jiraId = localStorageService.get('jiraId');
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/jiraToolConfigurationServices/jiraInstanceData?jiraId="
							+ $scope.jiraId, config).success(
					function(response) {
						response.password = atob(response.password);
						$scope.data = response;
					});

		};

		$scope.updateJiraInstanceInfo = function(data) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if (data.name != undefined && data.name != ""
					&& data.url != undefined && data.url != ""
					&& data.username != undefined && data.username != ""
					&& data.password != undefined && data.password != ""
					&& data.customEpic != undefined && data.customEpic != ""
					&& data.customSprint != undefined
					&& data.customSprint != ""
					&& data.customStorypoints != undefined
					&& data.customStorypoints != "") {

				var verification = "false";
				if (data.testPlugin == "Zephyr") {
					if (data.zephyrUrl != undefined && data.zephyrUrl != ""
							&& data.zephyrUsername != undefined
							&& data.zephyrUsername != ""
							&& data.zephyrAccessKey != undefined
							&& data.zephyrAccessKey != ""
							&& data.zephyrSecretKey != undefined
							&& data.zephyrSecretKey != ""
							&& data.customAutomation != undefined
							&& data.customAutomation != "") {
						verification = "true";
					}
				} else if (data.testPlugin == "QMetry") {
					if (data.qMetryAPIKey != undefined
							&& data.qMetryAPIKey != ""
							&& data.customAutomation != undefined
							&& data.customAutomation != "") {
						verification = "true";
					}
				} else if (data.testPlugin == "NONE") {
					verification = "true";
				}

				if (verification == "true") {

					var data = angular.toJson(data);
					// alert(data);

					$http(
							{
								url : "./rest/jiraToolConfigurationServices/updateJiraInstanceInfo",
								method : "POST",
								data : data,
								headers : {
									'Authorization' : token
								}
							}).success(function(response) {
						$window.location.reload();
					});

					$scope.$dismiss();
				} else {
					alert("Please provide jira plugin details !")
				}

			} else {
				alert("Please fill all jira details !")
			}

		}
		$scope.deleteJiraInstancePopup = function(jiraId) {
			$scope.jiraId = jiraId;
			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/admin/toolsConfiguration/jira/deleteJiraInstance.html',

						scope : $scope,
						size : 'sm',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		}
		$scope.deleteJiraInstance = function(jiraId) {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"./rest/jiraToolConfigurationServices/deleteJiraInstanceData?jiraId="
									+ jiraId, config)
					.success(
							function(response) {

								if (response == 0) {
									$scope.$dismiss();
									$scope
											.open(
													'app/admin/toolsConfiguration/jira/instanceDeletedSuccess.html',
													'sm')
								}

								setTimeout(function() {
									$window.location.reload();
								}, 2000);

							});

		}
		$scope.viewJiraInstanceDetails = function(data) {
			$scope.projectList = data.projects;
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/jira/viewJiraInstanceInfo.html',

						scope : $scope,
						size : 'md',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

			if (data.name != undefined && data.name != ""
					&& data.url != undefined && data.url != ""
					&& data.username != undefined && data.username != ""
					&& data.password != undefined && data.password != "") {

			} else {
				alert("Please fill all alm instance details !")
			}

		}
		$scope.uploadJiraInstanceDetails = function(data) {
			$scope.instanceDetailsJira = data;
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/jira/uploadJiraInstances.html',

						scope : $scope,
						size : 'md',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		}

		$scope.loadDefaultTemplateJira = function(instanceDetails) {

			$http.get('app/admin/toolsConfiguration/jira/instanceTemplateJira.json')
					.success(function(template) {
						$scope.defaultTemplateJira = template;
					});

		}

		$scope.downloadDefaultTemplateJira = function() {
			$scope.jirafileuploadederror = false;
			$scope.jirafieldError = false;
			$scope.jiraextnFlag = false;
			var data = "text/json;charset=utf-8,"
					+ encodeURIComponent(JSON
							.stringify($scope.defaultTemplateJira));

			var a = document.createElement('a');
			a.href = 'data:' + data;
			a.download = 'JIRA Default Template .json';
			a.click();
			document.body.appendChild(a);
		}

		$scope.uploadTemplateFileJira = function() {
			var token = AES.getEncryptedValue()
			var fd = new FormData();
			$scope.jiraextnFlag = false;
			$scope.jirafieldError = false;
			$scope.jiraInvalidJson = false;
			$scope.jiraInvalidInstance = false;
			var allowedExtensions = /(\.json)$/i;
			if (!allowedExtensions.exec(file.value)) {
				$scope.jiraextnFlag = true;
				$scope.jirafileExtnError = 'Please choose a file having extensions .json only.';
				return false;
			} else {
				if (file.files[0]) {
					fd.append('file', file.files[0]);
					$http
							.post(
									'./rest/jiraToolConfigurationServices/jiraCheckTemplateInstanceInfo',
									fd, {
										transformRequest : angular.identity,
										headers : {
											'Content-Type' : undefined,
											'Authorization' : token,
											'enctype' : "multipart/form-data"
										}
									})
							.success(
									function(response) {
										if (response == "InstanceWithoutProjectInInput") {
											$scope.jirafieldError = true;
											// $scope.jirafieldErrorMessage =
											// "Please provide the project key
											// in the json template";
										} else if (response == "InstanceWithProjectInInput") {

											$uibModal
													.open({
														animation : false,
														templateUrl : 'app/admin/toolsConfiguration/jira/uploadJiraInstanceWarning.html',

														scope : $scope,
														size : 'sm',
														resolve : {
															items : function() {
																// alert($scope.items);
																return $scope.items;
															}
														}
													});

										} else if (response == "InvalidJson") {
											$scope.jiraInvalidJson = true;
											// $scope.jirafieldErrorMessage =
											// "Please upload the template in a
											// valid json format ";
										} else if (response == "InvalidInstance") {
											$scope.jiraInvalidInstance = true;
											$scope.jirafieldErrorMessage = "Please check the Instance name ";
										}
									});
				} else {
					$scope.jirafileuploadederror = true;
				}
			}
		}

		// Upload & Clear/Merge

		$scope.jiraClearUploadData = function() {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (file.files[0]) {
				var fd = new FormData();
				fd.append('file', file.files[0]);
				$http
						.post(
								'./rest/jiraToolConfigurationServices/jiraClearUploadInstanceData',
								fd, {
									transformRequest : angular.identity,
									headers : {
										'Content-Type' : undefined,
										'Authorization' : token,
										'enctype' : "multipart/form-data"
									}
								})
						.success(
								function(response) {
									if (response === "success") {
										$scope
												.open(
														'app/admin/toolsConfiguration/jira/uploadSuccessful.html',
														'sm');
										setTimeout(function() {
											$window.location.reload();
										}, 2000);
									} else if (response === "failure") {

										$scope
												.open(
														'app/admin/toolsConfiguration/jira/uploadFailure.html',
														'sm');
										setTimeout(function() {
										}, 2000);

									}

								});
			}

		}

		$scope.jiraMergeUploadData = function() {
			var token = AES.getEncryptedValue()
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (file.files[0]) {
				var fd = new FormData();
				fd.append('file', file.files[0]);
				$http
						.post(
								'./rest/jiraToolConfigurationServices/jiraMergeUploadInstanceData',
								fd, {
									transformRequest : angular.identity,
									headers : {
										'Content-Type' : undefined,
										'Authorization' : token,
										'enctype' : "multipart/form-data"
									}
								})
						.success(
								function(response) {
									if (response === "success") {
										$scope
												.open(
														'app/admin/toolsConfiguration/jira/uploadSuccessful.html',
														'sm');
										setTimeout(function() {
											$window.location.reload();
										}, 2000);
									} else if (response === "failure") {

										$scope
												.open(
														'app/admin/toolsConfiguration/jira/uploadFailure.html',
														'sm');
										setTimeout(function() {
										}, 2000);

									}

								});
			}

		}

		//Upload & Clear/Merge

		//Download

		$scope.downloadJiraInstanceDetails = function(details) {

			var instanceDetails = JSON.stringify(details, function(key, value) {
				if (key === "$$hashKey") {
					return undefined;
				}

				return value;
			})
			var data = "text/json;charset=utf-8,"
					+ encodeURIComponent(instanceDetails);

			//var data = "text/json;charset=utf-8,"
			//            + encodeURIComponent(JSON.stringify(details));

			var a = document.createElement('a');
			a.href = 'data:' + data;
			a.download = details.name + '.json';
			a.click();
			document.body.appendChild(a);
		}

		//Download

	}
})();