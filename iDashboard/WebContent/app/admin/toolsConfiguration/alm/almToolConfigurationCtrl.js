
(function() {
	'use strict';

	angular.module('MetricsPortal.Login').controller('almToolConfigurationCtrl',
			almToolConfigurationCtrl);
	/** @ngInject */
	function almToolConfigurationCtrl($sessionStorage,AES, paginationService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$state, $uibModal, $rootScope, baConfig, layoutPaths, $window) {

		/*function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);

			return tokeen;
		}*/

		$scope.addAlmInstanceInfo = function(data) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (data.name != undefined && data.name != ""
					&& data.url != undefined && data.url != ""
					&& data.username != undefined && data.username != ""
					&& data.password != undefined && data.password != "") {
				data.password = btoa(data.password);
				var data = angular.toJson(data);
				$http(
						{
							url : "./rest/almToolConfigurationServices/addAlmInstanceInfo",
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
				alert("Please fill all alm instance details !")
			}

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
		$scope.updateAlmScheduler = function(instanceDetails) {
			$scope.data = instanceDetails;
			$uibModal.open({
				animation : true,
				templateUrl : 'app/admin/toolsConfiguration/alm/almScheduler.html',

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
		$scope.updateAlmSchedulerInfo = function(data) {
			var token = AES.getEncryptedValue();
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
							url : "./rest/almToolConfigurationServices/updateAlmSchedulerInfo",
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

		$scope.loadAlmInstanceInfo = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("./rest/almToolConfigurationServices/getAlmInstanceInfo",
					config).success(
					function(response) {

						if (response.length != 0) {
							$scope.almInstanceDetails = response[0];
							$scope.instanceList = response[0].servers;
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
		// Editing ALM Projects Data
		$scope.addALMDomains = function(data, id) {
			$scope.almId = id;
			$scope.instanceName = data.name;
			$scope.domainList = data.domains;
			$scope.stalmdomains = data.domains;
			$scope.stalmdomainsTable = data.domains;
			$uibModal.open({
				animation : false,
				templateUrl : 'app/admin/toolsConfiguration/alm/almDomains.html',

				scope : $scope,
				size : 'md',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};
		$scope.reloadALMDomains = function(data, id) {
			$scope.almId = id;
			$scope.instanceName = data.name;
			$scope.domainList = data.domains;
			$scope.stalmdomains = data.domains;
			$scope.stalmdomainsTable = data.domains;

		};

		$scope.addAlmDomainData = function(almDomainName, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (almDomainName != undefined && almDomainName != "") {

				var domaindata = {
					almDomainName : almDomainName,
					toolId : id
				}

				$http({
					url : "./rest/almToolConfigurationServices/addAlmDomainToDb",
					method : "POST",
					params : domaindata,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {
									if (response != "") {
										document.getElementById('almDomain').value = '';
										$scope.reloadALMDomains(response, id);
									} else {
										$scope.level = "domain";
										$scope.value = almDomainName;
										$uibModal
												.open({
													animation : false,
													templateUrl : 'app/admin/toolsConfiguration/alm/warningAlreadyExists.html',

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
				$scope.value = "Domain Name";
				$uibModal
						.open({
							animation : false,
							templateUrl : 'app/admin/toolsConfiguration/alm/warningDomain.html',

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

		$scope.closeAlmDomains = function() {
			$window.location.reload();
		}

		// Delete ALM Domain
		$scope.deleteAlmDomain = function(almDomainName, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (almDomainName != undefined && almDomainName != "") {
				var prjdata = {
					almDomainName : almDomainName,
					almId : id
				}

				$http(
						{
							url : "./rest/almToolConfigurationServices/removeAlmDomainInDb",
							method : "POST",
							params : prjdata,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.reloadALMDomains(response, id);

				});

			}

		}

		// Editing ALM Projects Data
		$scope.addALMProjects = function(data, id) {
			$scope.almId = id;

			$scope.domainList = data.domains;
			$scope.projectList = $scope.domainList[0].projects;
			$scope.stalmprojectsTable = $scope.projectList;
			$scope.stalmprojects = $scope.projectList;
			$uibModal.open({
				animation : false,
				templateUrl : 'app/admin/toolsConfiguration/alm/almProject.html',

				scope : $scope,
				size : 'lg',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};
		$scope.reloadALMProjects = function(data, id) {
			$scope.almId = id;

			$scope.domainList = data.domains;
			$scope.projectList = $scope.domainList[0].projects;
			$scope.stalmprojectsTable = $scope.projectList;
			$scope.stalmprojects = $scope.projectList;

		};

		$scope.addAlmProjectData = function(selectedDomain, almProjectName, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (almProjectName != undefined && almProjectName != "") {
				if (selectedDomain != undefined && selectedDomain != "") {

					var selDomainName = selectedDomain[0].domain;
					var projectdata = {
						selectedDomain : selDomainName,
						almProjectName : almProjectName,
						toolId : id
					}

					$http(
							{
								url : "./rest/almToolConfigurationServices/addAlmProjectToDb",
								method : "POST",
								params : projectdata,
								headers : {
									'Authorization' : token
								}
							})
							.success(
									function(response) {
										if (response != "") {
											document
													.getElementById('almProject').value = '';
											$scope.reloadALMProjects(response,
													id);
										} else {
											$scope.level = "project";
											$scope.value = almProjectName;
											$uibModal
													.open({
														animation : false,
														templateUrl : 'app/admin/toolsConfiguration/alm/warningAlreadyExists.html',

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
					alert("Please select the domain to add the project !")

				}
			} else {
				$scope.value = "Project Name";
				$uibModal
						.open({
							animation : false,
							templateUrl : 'app/admin/toolsConfiguration/alm/warningDomain.html',

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

		$scope.loadProjectData = function(selectedDomain) {

			$scope.stalmprojectsTable = selectedDomain[0].projects;
			$scope.stalmprojects = selectedDomain[0].projects;

		}
		$scope.closeAlmProjects = function() {
			$window.location.reload();
		}

		// Delete ALM Project
		$scope.deleteAlmProject = function(selectedDomain, projectName, id) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (selectedDomain != undefined && selectedDomain != "") {
				var selDomainName = selectedDomain[0].domain;
				var prjdata = {
					selectedDomain : selDomainName,
					projectName : projectName,
					almId : id
				}

				$http(
						{
							url : "./rest/almToolConfigurationServices/removeAlmProjectInDb",
							method : "POST",
							params : prjdata,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.reloadALMProjects(response, id);

				});

			} else {
				alert("Please select the domain to delete the project !")
			}

		}
		// Editing ALM Releases Data
		$scope.addALMReleases = function(data, id) {
			$scope.almId = id;
			$scope.domainList = data.domains;
			$scope.projectList = [];
			for (var i = 0; i < $scope.domainList.length; i++) {
				var domain = $scope.domainList[i].domain;
				if ($scope.domainList[i].projects != null) {
					if ($scope.domainList[i].projects.length > 0) {
						for (var j = 0; j < $scope.domainList[i].projects.length; j++) {
							var project = $scope.domainList[i].projects[j].project;
							var domProjName = domain + " - " + project;
							$scope.projectList.push(domProjName);
						}
					}
				}
			}
			var separatedName = $scope.projectList[0].split(" - ");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.releasesList = [];
			for (var i = 0; i < $scope.domainList.length; i++) {
				if ($scope.domainList[i].domain === $scope.domainName) {
					if ($scope.domainList[i].projects != null) {
						if ($scope.domainList[i].projects.length > 0) {
							for (var j = 0; j < $scope.domainList[i].projects.length; j++) {
								if ($scope.domainList[i].projects[j].project === $scope.projectName) {
									if ($scope.domainList[i].projects[j].releases != null) {
										if ($scope.domainList[i].projects[j].releases.length > 0) {
										}
										for (var k = 0; k < $scope.domainList[i].projects[j].releases.length; k++) {
											$scope.releasesList
													.push($scope.domainList[i].projects[j].releases[k]);
										}

									}

								}
							}
						}
					}
				}

			}

			$scope.stalmreleasesTable = $scope.releasesList;
			$scope.stalmreleases = $scope.releasesList;
			$uibModal.open({
				animation : false,
				templateUrl : 'app/admin/toolsConfiguration/alm/almRelease.html',

				scope : $scope,
				size : 'lg',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};
		$scope.reloadALMReleases = function(data, id) {
			$scope.almId = id;
			$scope.domainList = data.domains;
			$scope.projectList = [];
			for (var i = 0; i < $scope.domainList.length; i++) {
				var domain = $scope.domainList[i].domain;
				if ($scope.domainList[i].projects != null) {
					if ($scope.domainList[i].projects.length > 0) {
						for (var j = 0; j < $scope.domainList[i].projects.length; j++) {
							var project = $scope.domainList[i].projects[j].project;
							var domProjName = domain + " - " + project;
							$scope.projectList.push(domProjName);
						}
					}
				}
			}
			var separatedName = $scope.projectList[0].split(" - ");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.releasesList = [];
			for (var i = 0; i < $scope.domainList.length; i++) {
				if ($scope.domainList[i].domain === $scope.domainName) {
					if ($scope.domainList[i].projects != null) {
						if ($scope.domainList[i].projects.length > 0) {
							for (var j = 0; j < $scope.domainList[i].projects.length; j++) {
								if ($scope.domainList[i].projects[j].project === $scope.projectName) {
									if ($scope.domainList[i].projects[j].releases != null) {
										if ($scope.domainList[i].projects[j].releases.length > 0) {
										}
										for (var k = 0; k < $scope.domainList[i].projects[j].releases.length; k++) {
											$scope.releasesList
													.push($scope.domainList[i].projects[j].releases[k]);
										}

									}

								}
							}
						}
					}
				}

			}

			$scope.stalmreleasesTable = $scope.releasesList;
			$scope.stalmreleases = $scope.releasesList;

		};
		$scope.loadReleaseData = function(selectedProject) {
			var separatedName = selectedProject[0].split(" - ");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.releasesList = [];
			for (var i = 0; i < $scope.domainList.length; i++) {
				if ($scope.domainList[i].domain === $scope.domainName) {
					if ($scope.domainList[i].projects != null) {
						if ($scope.domainList[i].projects.length > 0) {
							for (var j = 0; j < $scope.domainList[i].projects.length; j++) {
								if ($scope.domainList[i].projects[j].project === $scope.projectName) {
									if ($scope.domainList[i].projects[j].releases != null) {
										if ($scope.domainList[i].projects[j].releases.length > 0) {
										}
										for (var k = 0; k < $scope.domainList[i].projects[j].releases.length; k++) {
											$scope.releasesList
													.push($scope.domainList[i].projects[j].releases[k]);
										}

									}

								}
							}
						}
					}
				}

			}

			$scope.stalmreleasesTable = $scope.releasesList;
			$scope.stalmreleases = $scope.releasesList;

		}
		$scope.addAlmReleaseData = function(selectedProject, almReleaseName, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (almReleaseName != undefined && almReleaseName != "") {
				if (selectedProject != undefined && selectedProject != "") {
					var projectdata = {
						selectedProject : selectedProject,
						almReleaseName : almReleaseName,
						toolId : id
					}

					$http(
							{
								url : "./rest/almToolConfigurationServices/addAlmReleaseToDb",
								method : "POST",
								params : projectdata,
								headers : {
									'Authorization' : token
								}
							})
							.success(
									function(response) {
										if (response != "") {
											document
													.getElementById('almRelease').value = '';
											document
													.getElementById('almReleaseId').value = '';

											$scope.reloadALMReleases(response,
													id);
										} else {

											$scope.level = "release name";
											$scope.value = almReleaseName;
											$uibModal
													.open({
														animation : false,
														templateUrl : 'app/admin/toolsConfiguration/alm/warningAlreadyExists.html',

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
					alert("Please select the project to add the release !")
				}
			} else {

				$scope.value = "Release Name";
				$uibModal
						.open({
							animation : false,
							templateUrl : 'app/admin/toolsConfiguration/alm/warningDomain.html',

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
		$scope.addAlmReleaseIdData = function(selectedProject, almReleaseId, id) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (almReleaseId != undefined && almReleaseId != "") {
				if (selectedProject != undefined && selectedProject != "") {

					var projectdata = {
						selectedProject : selectedProject,
						almReleaseId : almReleaseId,
						toolId : id
					}

					$http(
							{
								url : "./rest/almToolConfigurationServices/addAlmReleaseIdToDb",
								method : "POST",
								params : projectdata,
								headers : {
									'Authorization' : token
								}
							})
							.success(
									function(response) {
										if (response != "") {
											document
													.getElementById('almRelease').value = '';
											document
													.getElementById('almReleaseId').value = '';

											$scope.reloadALMReleases(response,
													id);
										} else {

											$scope.level = "release id";
											$scope.value = almReleaseId;
											$uibModal
													.open({
														animation : false,
														templateUrl : 'app/admin/toolsConfiguration/alm/warningAlreadyExists.html',

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
					alert("Please select the project to add the release !")
				}
			} else {
				$scope.value = "Release Id";
				$uibModal
						.open({
							animation : false,
							templateUrl : 'app/admin/toolsConfiguration/alm/warningDomain.html',

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
		// Delete ALM Release
		$scope.deleteAlmRelease = function(selectedProject, releaseId,
				releaseName, id) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if (selectedProject != undefined && selectedProject != "") {
				var prjdata = {
					selectedProject : selectedProject,
					releaseId : releaseId,
					releaseName : releaseName,
					almId : id
				}

				$http(
						{
							url : "./rest/almToolConfigurationServices/removeAlmReleaseInDb",
							method : "POST",
							params : prjdata,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.reloadALMReleases(response, id);

				});

			} else {
				alert("Please select the project to delete the release !")
			}

		}

		// Editing ALM Cycles Data
		$scope.addALMCycles = function(data, id) {

			$scope.almId = id;
			$scope.domainList = data.domains;
			$scope.projectList = [];
			angular
					.forEach(
							$scope.domainList,
							function(value) {
								var domain = value.domain;
								if (value.projects != null) {
									if (value.projects.length > 0) {
										for (var j = 0; j < value.projects.length; j++) {

											if (value.projects[j].releases != null) {
												if (value.projects[j].releases.length > 0) {
													var project = value.projects[j].project;
													for (var k = 0; k < value.projects[j].releases.length; k++) {
														var release = value.projects[j].releases[k].release;
														if (release == null) {
															var release = " - ";
														}
														var releaseId = value.projects[j].releases[k].releaseId;
														if (releaseId == null) {
															var releaseId = " - ";
														}
														var wholeName = domain
																+ ":" + project
																+ ":" + release
																+ "/"
																+ releaseId;
														$scope.projectList
																.push(wholeName);
													}
												}
											}
										}
									}
								}
							});

			var separatedName = $scope.projectList[0].split(":");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.release = separatedName[2];
			var splitWord = $scope.release.split("/");
			$scope.releaseName = splitWord[0];
			$scope.releaseId = splitWord[1];

			$scope.cycleList = [];

			angular
					.forEach(
							$scope.domainList,
							function(value) {
								if (value.domain === $scope.domainName) {

									if (value.projects != null) {
										if (value.projects.length > 0) {
											for (var j = 0; j < value.projects.length; j++) {
												if (value.projects[j].project === $scope.projectName) {
													if (value.projects[j].releases != null) {
														if (value.projects[j].releases.length > 0) {

															for (var k = 0; k < value.projects[j].releases.length; k++) {
																if ($scope.releaseName != " - ") {
																	if (value.projects[j].releases[k].release === $scope.releaseName) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}
																} else if ($scope.releaseId != " - ") {

																	if (value.projects[j].releases[k].releaseId === $scope.releaseId) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}

																}

															}
														}
													}
												}
											}
										}
									}
								}
							});
			$scope.stalmCyclesTable = $scope.cycleList;
			$scope.stalmCycles = $scope.cycleList;
			$uibModal.open({
				animation : false,
				templateUrl : 'app/admin/toolsConfiguration/alm/almCycle.html',

				scope : $scope,
				size : 'lg',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		$scope.reloadALMCycles = function(data, id) {

			$scope.almId = id;
			$scope.domainList = data.domains;
			$scope.projectList = [];
			angular
					.forEach(
							$scope.domainList,
							function(value) {
								var domain = value.domain;
								if (value.projects != null) {
									if (value.projects.length > 0) {
										for (var j = 0; j < value.projects.length; j++) {

											if (value.projects[j].releases != null) {
												if (value.projects[j].releases.length > 0) {
													var project = value.projects[j].project;
													for (var k = 0; k < value.projects[j].releases.length; k++) {
														var release = value.projects[j].releases[k].release;
														if (release == null) {
															var release = " - ";
														}
														var releaseId = value.projects[j].releases[k].releaseId;
														if (releaseId == null) {
															var releaseId = " - ";
														}
														var wholeName = domain
																+ ":" + project
																+ ":" + release
																+ "/"
																+ releaseId;
														$scope.projectList
																.push(wholeName);
													}
												}
											}
										}
									}
								}
							});

			var separatedName = $scope.projectList[0].split(":");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.release = separatedName[2];
			var splitWord = $scope.release.split("/");
			$scope.releaseName = splitWord[0];
			$scope.releaseId = splitWord[1];

			$scope.cycleList = [];
			angular
					.forEach(
							$scope.domainList,
							function(value) {
								if (value.domain === $scope.domainName) {
									if (value.projects != null) {
										if (value.projects.length > 0) {
											for (var j = 0; j < value.projects.length; j++) {
												if (value.projects[j].project === $scope.projectName) {
													if (value.projects[j].releases != null) {
														if (value.projects[j].releases.length > 0) {

															for (var k = 0; k < value.projects[j].releases.length; k++) {
																if ($scope.releaseName != " - ") {
																	if (value.projects[j].releases[k].release === $scope.releaseName) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}
																} else if ($scope.releaseId != " - ") {

																	if (value.projects[j].releases[k].releaseId === $scope.releaseId) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}

																}

															}
														}
													}
												}
											}
										}
									}
								}
							});
			$scope.stalmCyclesTable = $scope.cycleList;
			$scope.stalmCycles = $scope.cycleList;

		};
		$scope.loadCycleData = function(selectedProject) {

			var separatedName = $scope.selectedProject[0].split(":");
			$scope.domainName = separatedName[0];
			$scope.projectName = separatedName[1];
			$scope.release = separatedName[2];
			var splitWord = $scope.release.split("/");
			$scope.releaseName = splitWord[0];
			$scope.releaseId = splitWord[1];
			$scope.cycleList = [];
			angular
					.forEach(
							$scope.domainList,
							function(value) {
								if (value.domain === $scope.domainName) {
									if (value.projects != null) {
										if (value.projects.length > 0) {
											for (var j = 0; j < value.projects.length; j++) {
												if (value.projects[j].project === $scope.projectName) {
													if (value.projects[j].releases != null) {
														if (value.projects[j].releases.length > 0) {

															for (var k = 0; k < value.projects[j].releases.length; k++) {
																if ($scope.releaseName != " - ") {
																	if (value.projects[j].releases[k].release === $scope.releaseName) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}
																} else if ($scope.releaseId != " - ") {

																	if (value.projects[j].releases[k].releaseId === $scope.releaseId) {
																		if (value.projects[j].releases[k].cycles != null) {
																			if (value.projects[j].releases[k].cycles.length > 0) {
																				for (var l = 0; l < value.projects[j].releases[k].cycles.length; l++) {
																					$scope.cycleList
																							.push(value.projects[j].releases[k].cycles[l]);
																				}
																			}
																		}

																	}

																}

															}
														}
													}
												}
											}
										}
									}
								}
							});

			$scope.stalmCyclesTable = $scope.cycleList;
			$scope.stalmCycles = $scope.cycleList;

		}
		$scope.addAlmCycleData = function(selectedProject, almCycleName, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (selectedProject != undefined && selectedProject != "") {
				document.getElementById('almCycle').value = '';
				document.getElementById('almCycleId').value = '';

				var projectdata = {
					selectedProject : selectedProject,
					almCycleName : almCycleName,
					toolId : id
				}

				$http({
					url : "./rest/almToolConfigurationServices/addAlmCycleToDb",
					method : "POST",
					params : projectdata,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					$scope.reloadALMCycles(response, id);

				});

			} else {
				alert("Please select the project to add the cycle !")
			}
		}

		$scope.addAlmCycleIdData = function(selectedProject, almCycleId, id) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (selectedProject != undefined && selectedProject != "") {
				document.getElementById('almCycle').value = '';
				document.getElementById('almCycleId').value = '';

				var projectdata = {
					selectedProject : selectedProject,
					almCycleId : almCycleId,
					toolId : id
				}

				$http({
					url : "./rest/almToolConfigurationServices/addAlmCycleIdToDb",
					method : "POST",
					params : projectdata,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					$scope.reloadALMCycles(response, id);

				});

			} else {
				alert("Please select the project to add the cycle id !")
			}
		}
		// Delete ALM Cycle
		$scope.deleteAlmCycle = function(selectedProject, cycleId, cycleName,
				id) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if (selectedProject != undefined && selectedProject != "") {
				var prjdata = {
					selectedProject : selectedProject,
					cycleId : cycleId,
					cycleName : cycleName,
					almId : id
				}

				$http(
						{
							url : "./rest/almToolConfigurationServices/removeAlmCycleInDb",
							method : "POST",
							params : prjdata,
							headers : {
								'Authorization' : token
							}
						}).success(function(response) {
					$scope.reloadALMCycles(response, id);

				});

			} else {
				alert("Please select the project to add the cycle id !")
			}

		}

		// Editing ALM Instance Data
		$scope.updateInstanceDetails = function(almId) {
			$scope.almId = localStorageService.set('almId', almId);
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/alm/editAlmInstances.html',

						scope : $scope,
						size : 'lg',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		};
		$scope.loadInstanceDetails = function() {
			$scope.almId = localStorageService.get('almId');
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/almToolConfigurationServices/almInstanceData?almId="
							+ $scope.almId, config).success(function(response) {
				response.password = atob(response.password);
				$scope.data = response;
			});

		};

		$scope.updateAlmInstanceInfo = function(data) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			if (data.name != undefined && data.name != ""
					&& data.url != undefined && data.url != ""
					&& data.username != undefined && data.username != ""
					&& data.password != undefined && data.password != "") {
				data.password = btoa(data.password);
				var data = angular.toJson(data);
				$http(
						{
							url : "./rest/almToolConfigurationServices/updateAlmInstanceInfo",
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
				alert("Please fill all alm instance details !")
			}

		}

		$scope.deleteInstancePopup = function(almId) {
			$scope.almId = almId;
			$uibModal
					.open({
						animation : true,
						templateUrl : 'app/admin/toolsConfiguration/alm/deleteInstanceWarning.html',

						scope : $scope,
						size : 'sm',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		}
		$scope.deleteInstance = function(almId) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"./rest/almToolConfigurationServices/deleteInstanceData?almId="
									+ almId, config)
					.success(
							function(response) {

								if (response == 0) {
									$scope.$dismiss();
									$scope
											.open(
													'app/admin/toolsConfiguration/alm/instanceDeletedSuccess.html',
													'sm')
								}

								setTimeout(function() {
									$window.location.reload();
								}, 2000);

							});

		}
		$scope.viewInstanceDetails = function(data) {
			$scope.domainList = data.domains;
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/alm/viewInstanceInfo.html',

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

		$scope.downloadInstanceDetails = function(details) {
			
			
		var instanceDetails = JSON.stringify(details, function( key, value ) {
					    if( key === "$$hashKey" ) {
					        return undefined;
					    }

					    return value;
					})
					var data = "text/json;charset=utf-8,"
							+ encodeURIComponent(instanceDetails); 
				 

			
			//var data = "text/json;charset=utf-8,"
			//		+ encodeURIComponent(JSON.stringify(details));

			var a = document.createElement('a');
			a.href = 'data:' + data;
			a.download = details.name + '.json';
			a.click();
			document.body.appendChild(a);
		}

		$scope.uploadInstanceDetails = function(data) {
			$scope.instanceDetails = data;
			$uibModal
					.open({
						animation : false,
						templateUrl : 'app/admin/toolsConfiguration/alm/uploadInstances.html',

						scope : $scope,
						size : 'md',
						resolve : {
							items : function() {
								return $scope.items;
							}
						}
					});

		}
		
		$scope.loadDefaultTemplate = function(instanceDetails) {

			$http.get('app/admin/toolsConfiguration/alm/instanceTemplate.json')
					.success(function(template) {
						$scope.defaultTemplate = template;
					});

		}
		

		$scope.downloadDefaultTemplate = function() {
			$scope.fileuploadederror = false;
			$scope.fieldError = false;
			$scope.extnFlag = false;
			var data = "text/json;charset=utf-8,"
					+ encodeURIComponent(JSON.stringify($scope.defaultTemplate));

			var a = document.createElement('a');
			a.href = 'data:' + data;
			a.download = 'ALM Default Template.json';
			a.click();
			document.body.appendChild(a);
		}
		
		//var fd = new FormData();
		$scope.uploadTemplateFile = function() {
			var token = AES.getEncryptedValue();
			var fd = new FormData();
			$scope.extnFlag = false;
			$scope.fieldError = false;
			$scope.InvalidJson = false;
			$scope.InvalidInstance = false;var allowedExtensions = /(\.json)$/i;
			if (!allowedExtensions.exec(file.value)) {
				$scope.extnFlag = true;
				$scope.fileExtnError = 'Please choose a file having extensions .json only.';
				return false;
			} else {
				if (file.files[0]) {
					fd.append('file', file.files[0]);
					$http
							.post(
									'./rest/almToolConfigurationServices/checkTemplateInstanceInfo',
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
										if (response == "InstanceWithoutDomainInInput") {
											$scope.fieldError = true;
										} else if (response == "InstanceWithDomainInInput") {

											$uibModal
													.open({
														animation : false,
														templateUrl : 'app/admin/toolsConfiguration/alm/uploadInstanceWarning.html',

														scope : $scope,
														size : 'sm',
														resolve : {
															items : function() {
																//alert($scope.items);
																return $scope.items;
															}
														}
													});

										} else if (response == "InvalidJson") {
											$scope.InvalidJson = true;
										} else if (response == "InvalidInstance") {
											$scope.InvalidInstance = true;
											
										}
									});
				} else {
					$scope.fileuploadederror = true;
				}
			}
		}
		
		$scope.almClearUploadData = function() {
			var token = AES.getEncryptedValue();
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
							'./rest/almToolConfigurationServices/almClearUploadInstanceData',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined,
									'Authorization' : token,
									'enctype' : "multipart/form-data"
								}
							}).success(function(response) {
								if(response === "success"){
									$scope
									.open(
											'app/admin/toolsConfiguration/alm/uploadSuccessful.html',
											'sm');
									setTimeout(
									function() {
										$window.location.reload();
									}, 2000);
							}else if(response === "failure"){

								$scope
								.open(
										'app/admin/toolsConfiguration/alm/uploadFailure.html',
										'sm');
								setTimeout(
								function() {}, 2000);
						
									
								}
								
					});
			}
			
		}
		
		$scope.almMergeUploadData = function() {
			var token = AES.getEncryptedValue();
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
							'./rest/almToolConfigurationServices/almMergeUploadInstanceData',
							fd, {
								transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined,
									'Authorization' : token,
									'enctype' : "multipart/form-data"
								}
							}).success(function(response) {
								if(response === "success"){
									$scope
									.open(
											'app/admin/toolsConfiguration/alm/uploadSuccessful.html',
											'sm');
									setTimeout(
									function() {
										$window.location.reload();
									}, 2000);
							}else if(response === "failure"){

								$scope
								.open(
										'app/admin/toolsConfiguration/alm/uploadFailure.html',
										'sm');
								setTimeout(
								function() {}, 2000);
						
									
								}
								
					});
			}
			
		}
	}
})();