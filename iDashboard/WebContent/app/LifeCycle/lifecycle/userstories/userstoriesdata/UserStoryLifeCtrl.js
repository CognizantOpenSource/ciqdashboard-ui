/**
 * @author 653731 created on 12.03.2018
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller('UserStoryLifeCtrl',
			UserStoryLifeCtrl);

	/** @ngInject */
	
	function UserStoryLifeCtrl($sessionStorage, AES, paginationService, UserService,
			localStorageService, $element, $scope, $base64, $http, $timeout,
			$uibModal, $rootScope, baConfig, layoutPaths, $state) {

		/*
		 * var useStrDivView = document.getElementById('usrStrLifeDiv');
		 * 
		 * if(useStrDivView==undefined)
		 */

		if (localStorageService.get('component')) {
			// alert("inside component");
			if ($rootScope.selectedRallyProject == null
					|| $rootScope.selectedJiraProject == null
					|| $rootScope.selectedJiraProject == false
					|| $rootScope.selectedRallyProject == false) {

				var component = localStorageService.get('component');
				$rootScope.selectedRallyProject = component.rallyProject;
				$rootScope.selectedJiraProject = component.jiraProject;
				/*
				 * $rootScope.prjName = component.rallyProject;
				 * //$sessionStorage.prjName = component.projectName;
				 * $scope.selectedProjectName = component.rallyProject;
				 * $rootScope.selectedProjectName = c/omponent.rallyProject;
				 */

				// $scope.initLifeUserStorySprintCount(projectName);
				$rootScope.selectedProjectName = $rootScope.selectedRallyProject;
				$rootScope.prjName = $rootScope.selectedRallyProject;
				$rootScope.jiraPrjName = $rootScope.selectedJiraProject;

			}

		} else {
			// Will clear the selected job from drop down when clicked on
			// "create new"
			$rootScope.selectedRallyProject = false;
			$rootScope.selectedJiraProject = false;
		}

		$scope.getvalues = function() {
			$rootScope.selectedRallyProject;

		}

		// getJira project
		$scope.getvaluesJira = function() {
			$rootScope.selectedJiraProject;

		}

		$rootScope.sortkey = false;
		$rootScope.searchkey = false;
		$rootScope.menubar = false;

		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');

		$scope.initProjectsList = function() {
			$scope.selectedName = $scope.selectedRallyProject;
			setSelectedApplication($scope.selectedName);
		}

		$scope.changeSelectedProjectHome = function(selectedRallyProject) {
			$rootScope.prjName = selectedRallyProject;
			$rootScope.selectedRallyProject = selectedRallyProject;
			/*
			 * $scope.selectedRallyProject = selectedRallyProject;
			 * ///$rootScope.prjName = selectedRallyProject; $rootScope.prjName =
			 * selectedRallyProject;
			 */

			// $scope.prjName = selectedRallyProject;
		}

		// changed Jiraproject
		$scope.changeSelectedJiraProjectHome = function(selectedJiraProject) {

			// alert("changeSelectedProjectHome");
			$rootScope.jiraPrjName = selectedJiraProject;
			$rootScope.selectedJiraProject = selectedJiraProject;

		}

		$scope.interval = function(selectedRallyProject) {

			$rootScope.initLifeUserStorySprintCount(selectedRallyProject);
			$rootScope.initialLifeCycUserStorycount(selectedRallyProject);
			$rootScope.initIterationUserStoryBackLogCount(selectedRallyProject);
			$rootScope.selectedPrjectForIterationsList(selectedRallyProject);
			// $rootScope.initIterationUserStoryPoints(selectedRallyProject);
			// $scope.lifeUserStrStatusChart(selectedRallyProject);
			// $rootScope.iterationStoryCount(selectedRallyProject);
			// $rootScope.selectedPrjectForIterations(selectedRallyProject);
		}

		
		 function setSelectedApplication(selectedPrj) {
			 $rootScope.selectedProjectName = selectedPrj;
			 $rootScope.prjName = $rootScope.selectedProjectName;
			} 
		 
		

		function setSelectedApplication(selectedPrj) {
			$rootScope.selectedProjectName = selectedPrj;
			$rootScope.prjName = $rootScope.selectedProjectName;
		}

		// //////////Hiding Iteration pannel when no project is selected///////
		// $('#iterationDetails').hide();

		$('#rallyDetails').hide();

		// ///showing Iteration Panel when project is selected//////////////
		$rootScope.showIterationPanel = function(project) {

			if (project != undefined) {
				$('#iterationDetails').show();
				$('#rallyDetails').hide();
				rallyDetails
			} else {
				$('#iterationDetails').hide();
				$('#rallyDetails').show();
			}

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

		}

		// ///////////////////User Story Search Test
		// Cases//////////////////////////

		var vm = this;
		vm.total_count = 0;
		$scope.itemsPerPage = 5;

		// search
		$scope.searchTestCase = function(start_index, searchField, searchText) {

			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "testID") {
				$rootScope.testID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyID") {
				$rootScope.storyID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testName") {
				$rootScope.testName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "testDescription") {
				$rootScope.testDescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "priority") {
				$rootScope.priority = searchText;
				$scope.key = true;
			}

			else if ($scope.searchField == "projectName") {
				$rootScope.projectName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "status") {
				$rootScope.status = searchText;
				$scope.key = true;
			}

			$scope.searchableTestCase();

		}

		$scope.searchableTestCase = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if ($rootScope.defectId == undefined) {
				$rootScope.defectId = 0;
			}

			$http.get(
					"./rest/rallyServices/userStorytestCaseSearchpagecount?testName="
							+ $rootScope.testName + "&testID="
							+ $rootScope.testID + "&storyID="
							+ $rootScope.storyID + "&testDescription="
							+ $rootScope.testDescription + "&priority="
							+ $rootScope.priority + "&projectName="
							+ $rootScope.projectName + "&status="
							+ $rootScope.assignedto + "&dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});

			paginationService.setCurrentPage("userStoryTestCasepaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;

			$http
					.get(
							"./rest/rallyServices/userStoryTestCaseSearch?testName="
									+ $rootScope.testName + "&testID="
									+ $rootScope.testID + "&storyID="
									+ $rootScope.storyID + "&testDescription="
									+ $rootScope.testDescription + "&priority="
									+ $rootScope.priority + "&projectName="
									+ $rootScope.projectName + "&status="
									+ $rootScope.status + "&itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {

								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialTestCasecountpaginate();
									$scope.userStoryTestCaseTableData(1);
								} else {
									paginationService.setCurrentPage(
											"userStoryTestCasepaginate",
											$scope.start_index);
									$rootScope.userStoryTestCaseTableDetails = response;
								}
							});
		}

		// ///////////////////////////////////////////////////////////////////////////////////////////////

		// ////////////////////////////User Story Defect Search
		// ////////////////////////////////////////

		var vm = this;
		vm.total_count = 0;
		$scope.itemsPerPage = 5;

		// search
		$scope.searchDefect = function(start_index, searchField, searchText) {
			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "defID") {
				$rootScope.defID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyID") {
				$rootScope.storyID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "defName") {
				$rootScope.defName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "defDescription") {
				$rootScope.defDescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "defPrjName") {
				$rootScope.defPrjName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "status") {
				$rootScope.status = searchText;
				$scope.key = true;
			}

			$scope.searchableUserStoryDefect();

		}

		$scope.searchableUserStoryDefect = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if ($rootScope.defectId == undefined) {
				$rootScope.defectId = 0;
			}

			$http.get(
					"./rest/rallyServices/userStoryDefectSearchpagecount?storyID="
							+ $rootScope.storyID + "&defID=" + $rootScope.defID
							+ "&defDescription=" + $rootScope.defDescription
							+ "&defName=" + $rootScope.defName + "&defPrjName="
							+ $rootScope.defPrjName + "&dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});

			paginationService.setCurrentPage("userStoryDefectdatapaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;

			$http
					.get(
							"./rest/rallyServices/userStoryDefectSearch?storyID="
									+ $rootScope.storyID + "&defID="
									+ $rootScope.defID + "&defDescription="
									+ $rootScope.defDescription + "&defName="
									+ $rootScope.defName + "&defPrjName="
									+ $rootScope.defPrjName + "&itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {

								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialDefectCountpaginate();
									$scope.userStoryDefectTableData(1);
								} else {
									paginationService.setCurrentPage(
											"userStoryDefectdatapaginate",
											$scope.start_index);
									$rootScope.userStoryDefectTableDetails = response;
								}
							});
		}

		// ///////////////////////////////////////////////////////////////////////////////////////////////

		// //////////////////Story Details Search
		// ////////////////////////////////

		var vm = this;
		vm.total_count = 0;
		$scope.itemsPerPage = 5;

		// search
		$scope.searchStoryDetails = function(start_index, searchField,
				searchText) {

			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "storyID" && $scope.searchText != "") {
				$rootScope.storyID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyName"
					&& $scope.searchText != "") {
				$rootScope.storyName = searchText;
				$scope.key = true;
			}

			else if ($scope.searchField == "description"
					&& $scope.searchText != "") {
				$rootScope.description = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyOwner"
					&& $scope.searchText != "") {
				$rootScope.storyOwner = searchText;
				$scope.key = true;
			}

			else if ($scope.searchField == "projectName"
					&& $scope.searchText != "") {
				$rootScope.projectName = searchText;
				$scope.key = true;
			}

			$scope.searchableUserStoryDetails();

		}

		$scope.searchableUserStoryDetails = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/rallyServices/userStorySearchpagecount?storyName="
							+ $rootScope.storyName + "&storyID="
							+ $rootScope.storyID + "&description="
							+ $rootScope.description + "&storyOwner="
							+ $rootScope.storyOwner + "&projectName="
							+ $rootScope.projectName + "&dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});

			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;

			$http
					.get(
							"./rest/rallyServices/searchUserStory?storyName="
									+ $rootScope.storyName + "&storyID="
									+ $rootScope.storyID + "&description="
									+ $rootScope.description + "&storyOwner="
									+ $rootScope.storyOwner + "&projectName="
									+ $rootScope.projectName + "&itemsPerPage="
									+ $scope.itemsPerPage + "&start_index="
									+ $scope.start_index + "&dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {

								if (response == "" && $scope.key == false) {

									$rootScope.searchkey = false;
									$scope.initialUserStorycountpaginate();
									$scope.userStoryTableData(1);
								} else {
									paginationService.setCurrentPage(
											"userStorydatapaginate",
											$scope.start_index);
									$rootScope.userStoryTableDataDetails = response;
								}
							});

		}

		// ///Open User Story Details Page///////////////

		$scope.openUserStory = function(project) {

			$rootScope.strProject = project;
			$state.go('userstorieslifecycledetails');
			// $state.go('codeanalysis');

		};

		$scope.open = function() {

			$state.go('userstorieslifecycledetails');
		};

		// ////////// Total User Story Count on load///////////

		$rootScope.initialUserStorycount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/userStoryCount?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$rootScope.userStoryData = response;

					});
		}

		$rootScope.initialLifeCycUserStorycount = function(project) {

			if (project != undefined) {
				var token = AES.getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http.get(
						"rest/rallyServices/lifeuserStoryCount?dashboardName="
								+ dashboardName + "&owner=" + owner
								+ "&userStrproject=" + project, config)
						.success(function(response) {
							$rootScope.lifeuserStoryData = response;
							// $scope.lifeuserStoryData = response;

						});
			} else {
				$scope.lifeuserStoryData = '';

			}
		}

		$rootScope.initOpsUserStorycount = function(project) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/lifeuserStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$rootScope.opsuserStoryData = response;
						// $scope.opsuserStoryData = response;

					});

		}

		// get rally projects
		$rootScope.initialProjects = function() {
			// alert("inside initialProjects");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/rallyServices/projectDetails?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$scope.projects = response;

					});

			// $scope.selectedRallyProject = $rootScope.prjName;
			// $rootScope.prjName = $sessionStorage.prjName;
			// setSelectedApplication($scope.selectedRallyProject);

		}

		// get jira projects
		$rootScope.initialJiraProjects = function() {

			// alert("inside initialProjects");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/jiraprojectdetails?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$scope.jiraprojects = response;

					});

		}
		// get jira Active SprintName
		$scope.initLifeUserStorySprintName = function(selectedJiraProject) {
			// alert("inside sprint name");
			$rootScope.selectedJiraProject = selectedJiraProject;

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getuserstoryactivesprint?dashboardName="
							+ dashboardName + "&userStrproject="
							+ selectedJiraProject, config).success(
					function(response) {
						$scope.jiraUserStoryactiveSprintName = response;

					});

		}

		// get jira Active sprint days left
		$scope.initLifeSprintdaysleft = function(selectedJiraProject) {
			// alert("inside sprint days left");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getdaysleftinsprint?dashboardName="
							+ dashboardName + "&userStrproject="
							+ selectedJiraProject, config).success(
					function(response) {
						$scope.sprintDaysLeft = response;

					});

		}
		// get jira sprint status
		$scope.initLifeSprintStatus = function(selectedJiraProject) {
	
			// alert("insid Sprint Status ");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getsprintstatus?dashboardName="
							+ dashboardName + "&userStrproject="
							+ selectedJiraProject, config).success(
					function(response) {
						$scope.jirauserstorycompleted = response[0];
						$scope.jirauserstoryprogress = response[1];
						$scope.jirauserstorytodo = response[2];
					});

		}

		// get on-change data

		$scope.getJiraSprintChangeData = function() {
			// alert(" on Sprint change")
			$scope.getJiraUserstoryCount();
			$scope.getJiraUserstoryPoint();
			$scope.getJiraBugCount();
			$scope.newPriorityChart();
			$scope.newStatusChart();
			$scope.newVelocityChart();
			$scope.newBugStoryReportChart();
		}
		
		
	
	//get jira sprint user story period
		$scope.getJiraSprintPeriod = function() {
			//alert("inside sprint period");
			
			// initialise
			$scope.selectedsprintperioddrop = "Current Sprint";
			$scope.jiradays = "current";

			$rootScope.jirasprintperioddrops = [ "Current Sprint",
					"Last Sprint", "Last 3 Sprints" ];
			$scope.noofjiradays = [ "current", "last", "lastthree" ];
		}

		// get jira selected sprint drop down
		$scope.getSprintPeriodSelection = function(selectedsprint) {
			$scope.selectedsprintperioddrop = selectedsprint;
			var index = $rootScope.jirasprintperioddrops
					.indexOf(selectedsprint);
			$scope.jiradays = $scope.noofjiradays[index];

			// alert("Jira days "+ $scope.jiradays);

		}

		// get jira sprint count
		$scope.getJiraSprintCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getjirasprintcount?dashboardName="
							+ dashboardName + "&userStrproject="
							+ $rootScope.selectedJiraProject, config).success(
					function(response) {
						$scope.sprintscompleted = response;
					});

		}

		// get Jira backlog count
		$scope.getJiraBacklogCount = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getbacklogcount?dashboardName="
							+ dashboardName + "&userStrproject="
							+ $rootScope.selectedJiraProject, config).success(
					function(response) {
						$scope.totalstorybacklog = response;
					});
		}

		// get jira total story count
		$scope.getJiraUserstoryCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getjirastorycount?dashboardName="
							+ dashboardName + "&userStrproject="
							+ $rootScope.selectedJiraProject
							+ "&jiraSelectedSprint=" + $scope.jiradays, config)
					.success(function(response) {
						$scope.totalstorycount = response;
					});
		}

		// get jira total story points in sprint

		$scope.getJiraUserstoryPoint = function() {
			// alert("inside story point");

			$rootScope.selectedJiraProject;
			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getjirastorypoint?dashboardName="
							+ dashboardName + "&userStrproject="
							+ $rootScope.selectedJiraProject
							+ "&jiraSelectedSprint=" + $scope.jiradays, config)
					.success(function(response) {
						$scope.totalstorypoint = response;
					});

		}
		// get jira total bugs in sprint
		$scope.getJiraBugCount = function() {
			// alert("inside bug count");
			$rootScope.selectedJiraProject;

			var token = AES.getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/lifeCycleServices/getjirabugcount?dashboardName="
							+ dashboardName + "&userStrproject="
							+ $rootScope.selectedJiraProject
							+ "&jiraSelectedSprint=" + $scope.jiradays, config)
					.success(function(response) {
						$scope.bugcount = response;
					});
		}

		// get jira issuePriority bar chart
		$scope.newPriorityChart = function() {
			// alert("inside bar graph");

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("rest/lifeCycleServices/issuesbyprioritybar?dashboardName="
							+ dashboardName + "&userStrproject="+ $rootScope.selectedJiraProject + "&jiraSelectedSprint=" + $scope.jiradays, config).success(
									function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.jirastatuschartnew($scope.data);
								}
							});
		}
		
		// get jira issuePriority bar chart
		$scope.newStatusChart = function() {
			// alert("inside bar graph");

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("rest/lifeCycleServices/issuesbyprioritybar?dashboardName="
							+ dashboardName + "&userStrproject="+ $rootScope.selectedJiraProject + "&jiraSelectedSprint=" + $scope.jiradays, config).success(
									function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.jirastatuschartnew($scope.data);
								}
							});
		}
			$scope.jirastatuschartnew = function(result) {
				
				//alert("inside chart new");
				$scope.sprintName = [];
				$scope.vhighCount =[];
				$scope.highCount =[];
				$scope.medCount = [];
				$scope.lowCount = [];
				
				for(var i=0;i<result.length;i++)
				{
						$scope.vhighCount.push(result[i].vhighCount);
				
						$scope.highCount.push(result[i].highCount);
					
						$scope.medCount.push(result[i].mediumCount);
					
						$scope.lowCount.push(result[i].lowCount)
					
				}
				// labels according to sprints selected from drop-down
				//last sprint
				if(result.length == 1)
				{
					var mydata = {
					    labels: [result[0].sprintName],
					    series: [
					           
					             	$scope.lowCount, $scope.medCount, $scope.highCount, $scope.vhighCount
					             ]
					  };
				}
				//last 3 sprints
				else if(result.length == 3)
				{
					var mydata = {
					    labels: [result[0].sprintName , result[1].sprintName, result[2].sprintName],
					    series: [
					             
					             	$scope.lowCount, $scope.medCount, $scope.highCount, $scope.vhighCount
					             ]
					  };
				}
					var options = {
						    stackBars: true,
						    axisY: { 
						    	  offset: 40,
						          labelOffset: {
						          x: 0,
						          y: 5
						        },
						        showGrid: true,
						        onlyInteger: true,
						    	showLabel: true,
						    },
						    height: '360px',
						    
						    chartPadding: {
						        top: 10,
						        right: 15,
						        bottom: 10,
						        left:10
						      },
						      
						    showGridBackground: false,
						    plugins: [
						             Chartist.plugins.legend({
						                 legendNames: ['Very High', 'High', 'Medium', 'Low'],
						              }),
						              
						              Chartist.plugins.tooltip(),
						             
						             Chartist.plugins.ctAxisTitle({
						                  axisX: {
						                    axisTitle: 'Sprints',
						                    axisClass: 'ct-axis-title',
						                    offset: {
						                      x: 0,
						                      y: 38
						                    },
						                    textAnchor: 'middle'
						                  },
						                  axisY: {
						                    axisTitle: 'Number of Defects',
						                    axisClass: 'ct-axis-title',
						                    offset: {
						                      x: 0,
						                      y: 10
						                    },
						                    textAnchor: 'middle',
						                    flipTitle: true
						                  }
						                })
						          ]
						  };
				
				
				var chart = new Chartist.Bar('.ct-chart', mydata, options);
			
				//labelling over the bars tip
			/*	var seriesIndex = -1;
				chart.on('created', function() {
				  // reset series counter
				  seriesIndex = -1;
				});

				chart.on('draw', function(context) {
				  if(context.type === 'bar') {
				    if(context.index === 0) {
				      seriesIndex++;
				    }
				    var seriesName = chart.data.series[seriesIndex].name;
				    
				    context.element.root().elem('text', {
				      x: context.x1,
				      y: context.y2 + 5
				    }, 'ct-bar-label').text(context.value.y);
				  }
				});*/

				chart.on('draw', function(data) {
					if(data.type === 'bar') {
						data.element.attr({
						style: 'stroke-width: 80px'
					});
					}
				});
			}
		
			//get jira velocity bar chart
			
			$scope.newVelocityChart = function() {
				//alert("velocity");
				var token = AES.getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http.get("rest/lifeCycleServices/velocityChart?dashboardName="
								+ dashboardName + "&userStrproject="+ $rootScope.selectedJiraProject + "&jiraSelectedSprint=" + $scope.jiradays, config).success(
										function(response) {
									$scope.data = response;
									if ($scope.data.length != 0) {
										$scope.jiraVelocitychartnew($scope.data);
									}
								});
			}
			
			$scope.jiraVelocitychartnew = function(result) {
	
				
					$scope.result = result;
			        $scope.labels1 =[];
			        $scope.data1 = [];
			       
			        for( var i=0 ; i<$scope.result.length; i++){
			        	
			        	 $scope.labels1.push($scope.result[i].sprintName);
			    		 $scope.data1.push($scope.result[i].storyCompleted);
			        }	
			    		$scope.labelspie = $scope.labels1;
			    		$scope.datapie = $scope.data1;
			    		var layoutColors = baConfig.colors;  
			        
			        	   $('#userStrStatuschart').remove(); // this is my <canvas> element
			        	   $('#lifeUserStrVelocitychartdiv').append('<canvas id="userStrStatuschart" style="width:400px;height:270px"> </canvas>'); 

			        		 var ctx = document.getElementById("userStrStatuschart");
			        		 var designerbarchart = new Chart(ctx, {
			        			 type: 'bar',
			        			 data: {
			        				 labels: $scope.labelspie,
			        				 datasets: [{
			        					 data: $scope.datapie,
			        					 label : " Stories Completed",
			        					 backgroundColor : ["rgba(142, 238, 102, 0.8)", 
			        					                    "rgba(142, 238, 102, 0.8)",
			        					                    "rgba(142, 238, 102, 0.8)",
			        					                    "rgba(142, 238, 102, 0.8)",
			        					                    "rgba(255, 99, 132, 0.8)",
			        					                    "#429bf4",
			        					                    "#723f4e",
			        					                    "rgba(255, 206, 86, 0.8)",
			        					                    "#835C3B" ],
			        					  borderColor: [
												"rgba(142, 238, 102, 1)", 
												"rgba(142, 238, 102, 1)",
												"rgba(142, 238, 102, 1)",
												"rgba(142, 238, 102, 1)",
												"rgba(255, 99, 132, 1)",
												"#429bf4",
				                                "#723f4e",
												"rgba(255, 206, 86, 1)",
												"#835C3B"
			                                                ],
			                             borderWidth: 1,
			             
			        				 }]
			        			 },
			        			 options: {
			        				 responsive : true,
									maintainAspectRatio : false,
			        				 tooltips : {
			        					 enabled: true      
			        				 },
			        				 
			        				 legend: {
			        			            display: true,
			        			            labels: {
			        			                fontColor : '#2c2c2c',
			    								boxWidth : 20,
			    								fontSize : 10
			        			            }
			        			        },
			        				 scales: {
			        					 yAxes: [{
			        						 ticks: {
			        							 beginAtZero:true,
			        							 fontColor: '#4c4c4c'
			        						 },
			        						 scaleLabel : {
			        							 display : true,
			        							 fontColor : '#2c2c2c',
			        							 labelString : 'Stories Completed'
			        						 },
			        						 gridLines: {
			        							 color: "#d8d3d3"
			        						 }
			        					 }],
			        					 xAxes: [{
			        						 barThickness : 70,
			        						 ticks: {
			        							 beginAtZero:true,
			        							 fontColor: '#4c4c4c'
			        						 },
			        						 scaleLabel : {
			        							 display : true,
			        							 fontColor : '#2c2c2c',
			        							 labelString : 'Sprints'
			        						 },
			                            gridLines: {
			                                color: "#d8d3d3"
			                            }
			                        }]
			                }
			            }
			            
			        }); 
			}
			
			$scope.newBugStoryReportChart = function()
			{
				//alert("inside bipolar");
				var token = AES.getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http.get("rest/lifeCycleServices/storybugreportchart?dashboardName="
								+ dashboardName + "&userStrproject="+ $rootScope.selectedJiraProject + "&jiraSelectedSprint=" + $scope.jiradays, config).success(
										function(response) {
									$scope.data = response;
									if ($scope.data.length != 0) {
										$scope.jiraReportChart($scope.data);
									}
								});
			}
			$scope.jiraReportChart = function(results)
			{
				//change color of bars in main.css
				
				$scope.label = [];
				$scope.storyCount =[];
				$scope.bugCount =[];
				
				for(var i = 0; i<results.length; i++)
				{
					$scope.label.push(results[i].sprintName);
					$scope.storyCount.push(results[i].storyCompleted);
					$scope.bugCount.push(results[i].totalBug);
				}
				
				// labels according to sprints selected from drop-down
				//last sprint
				if(results.length == 1)
				{
					var mydata = {
					    labels: $scope.label,
					    series: [
					             
					             	$scope.storyCount,$scope.bugCount
					             ]
					  };
				}
				//last 3 sprints
				else if(results.length == 3)
				{
					var mydata = {
					    labels: $scope.label,
					    series: [
					             
					             	$scope.storyCount,$scope.bugCount
					             ]
					  };
				}

						var options = {
								low: 0,
							    showPoint: true,
							  showArea: true,
							 
							 
							    plugins: [
							    Chartist.plugins.tooltip(),
							    
							    Chartist.plugins.legend({
					                 legendNames: ['Total Stories', 'Total Defects'],
					              }),
					              
					              Chartist.plugins.ctAxisTitle({
					                  axisX: {
					                    axisTitle: 'Sprints',
					                    axisClass: 'ct-axis-title',
					                    offset: {
					                      x: 0,
					                      y: 38
					                    },
					                    textAnchor: 'middle'
					                  },
					                  axisY: {
					                    axisTitle: 'Count',
					                    axisClass: 'ct-axis-title',
					                    offset: {
					                      x: 0,
					                      y: 10
					                    },
					                    textAnchor: 'middle',
					                    flipTitle: true
					                  }
					                })
					              
							  ],
							  
							 seriesBarDistance: 40,
							    
							  axisX: {
							    showGrid:true,
							    offset: 30,
							      labelOffset: {
							      x: 20
							    }
							  },
							  axisY: {
							    type: Chartist.AutoScaleAxis,
							    showGrid:true,
							    offset: 40,
							    onlyInteger: true,
							   
							  	  scaleMinSpace: 20
							  },
							  height: '375px',
							  
							    chartPadding: {
							        top: 10,
							        right: 15,
							        bottom: 10,
							        left:10
							      },
						};

					
						var bipolar = new Chartist.Bar('#simplebarchart', mydata, options);
						
						bipolar.on('draw', function(data) {
							if(data.type === 'bar') {
								data.element.attr({
								style: 'stroke-width: 40px'
							});
							}
						});
			}
			
			//jira recently created issues
			
			$scope.jiraRecentlyCreatedIssues = function()
			{
				var token = AES.getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http.get("rest/lifeCycleServices/jiracreatedissue?dashboardName="
								+ dashboardName + "&userStrproject="+ $rootScope.selectedJiraProject + "&jiraSelectedSprint=" + $scope.jiradays, config).success(
										function(response) {
									$scope.data = response;
									if ($scope.data.length != 0) {
										$scope.chartCreatedIssues($scope.data);
									}
								});
			}
			
			 $scope.chartCreatedIssues = function(result){
				 
			  	 $scope.result = result;
			        $scope.labels1 =['Unresolved Issues' , 'Resolved Issues'];
			       
			    	$scope.labelspie = $scope.labels1;
			    	$scope.datapie =[];
			    	
			    	$scope.datapie.push($scope.result[0].unresolvedBug);
			    	$scope.datapie.push($scope.result[0].resolvedBug);
			    	
			        var layoutColors = baConfig.colors;  
			        $('#issuepiechart').remove(); 
			        $('#lifeIssuepiechartdiv').append('<canvas id="issuepiechart"></canvas>'); 

			        var ctx = document.getElementById("issuepiechart");
			        var piechart = new Chart(ctx, {
			            type: 'pie',
			            data: {
			                labels: $scope.labelspie,
			                datasets: [{
			                data: $scope.datapie,
			                backgroundColor : ["rgba(255, 28, 28, 0.7)",
			                	"rgba(0, 155, 0, 0.8)",
			                    "rgba(189, 5, 171, 0.8)",
			                    "rgba(255, 31, 0, 0.8)"	
			 				 ],
							borderColor: ["rgba(255, 28, 28, 1)",
			                	"rgba(0, 155, 0, 1)",
			                    "rgba(189, 5, 171, 1)",
			                    "rgba(255, 31, 0, 1)"
			 				  ],
			                    borderWidth: 1
			                }]
			            },
			            options: {
			            	responsive: true,
			            	maintainAspectRatio : false,
			            	pieceLabel: {
			            	    render: 'value',
			            	    fontColor:'#4c4c4c'
			            	  },
			            	  
			            	  legend: {
			                      display: true,
			                      position: 'bottom',
			                      labels: {
			                    	   fontColor: '#4c4c4c',
			                    	   boxWidth : 20,
			                    	   fontSize : 10
			                      }
			                  }
			            }
			            
			        });

			    
			    }
			
		$rootScope.selectedPrjectForIterationsList = function(project) {
			
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
		$http.get(
					"rest/rallyServices/iterationDetailsList?dashboardName="
							+ dashboardName + "&owner="
							+ owner+"&userStrproject="+project, config).success(
					function(response) {
						$rootScope.iterationsList = response;
						$scope.selectedIterationName = $rootScope.iterationsList[0];
					});
			$scope.onSelectedLifeIteration($scope.selectedName,$scope.selectedIterationName);				//added by Adhish
		}

		$rootScope.selectedPrjectForIterationsList = function(project) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/rallyServices/iterationDetailsList?dashboardName="
									+ dashboardName + "&owner=" + owner
									+ "&userStrproject=" + project, config)
					.success(
							function(response) {
								$rootScope.iterationsList = response;
								$scope.selectedIterationName = $rootScope.iterationsList[0];
							});
			$scope.onSelectedLifeIteration($scope.selectedName,
					$scope.selectedIterationName); // added by Adhish
		}

		$rootScope.selectedPrjectForIterations = function(project, iteration) {
			debugger;
			// alert("selectedPrjectForIterations" + project);
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/rallyServices/iterationDetails?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project + "&userStrIter="
							+ iteration, config).success(function(response) {
				$rootScope.iterationDetails = response;

			});

		}

		$rootScope.iterationStoryCount = function(project, iteration) {
			debugger;

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/iterationStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project + "&userStrIter="
							+ iteration, config).success(function(response) {
				$rootScope.iterationStoryCt = response;

			});

		}

		/*
		 * $rootScope.selectedRallyProject = function(project) { var token =
		 * AES.getEncryptedValue(); var config = { headers : { 'Authorization' :
		 * token } };
		 * 
		 * $scope.newTypeChart(project); //$scope.tctypechart($scope.data);
		 *  }
		 */

		$scope.selectedProjectForStoryIter = function(project) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$rootScope.initialLifeCycUserStorycount(project);
			$rootScope.initLifeUserStorySprintCount(project);

			$rootScope.initOpsUserStorycount(project);
			$rootScope.initOpsUserStorySprintCount(project);

			// $scope.selectedRallyProject = project;

		}

		$rootScope.selectedProjectForOwner = function(project) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$scope.newOwnerCountChart(project);

		}

		
		// ////////////////////Current Iteration Details
		// ///////////////////////////////////////////

		$scope.onSelectedLifeIteration = function(selectedProjectName,
				selectedIterationNamee) {
			$rootScope.iterationStoryCount(selectedProjectName,
					selectedIterationNamee);
			$scope.lifeUserStrStatusChart(selectedProjectName,
					selectedIterationNamee);
			$rootScope.selectedPrjectForIterations(selectedProjectName,
					selectedIterationNamee);
			// $scope.userStoryLifeTrendChart(selectedProjectName,selectedIterationNamee);
			$rootScope.initIterationUserStoryBackLogCount(selectedProjectName);
			$scope.userStoryLifeTrendChart(selectedProjectName);
			$rootScope.initIterationUserStoryPoints(selectedProjectName,
					selectedIterationNamee);

		}

		// ////////////////////////////////////////////////////////////////////////////////

		// //////////Total User Story in backlog Count/////////////////////

		$rootScope.initUserStoryBackLogCount = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/userStoryBackLogCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.userStoryBackLogData = response;

					});
		}

		// //////// Total User Stories in Iteration
		// backog///////////////////////

		$rootScope.initIterationUserStoryBackLogCount = function(project) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/initIterationUserStoryBackLogCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$rootScope.userStoryIterBackLogData = response;

					});
		}

		// ///////////////////////////////////////////////////////////////////////

		// ////////////////////Iteration Story Points
		// ////////////////////////////////

		$rootScope.initIterationUserStoryPoints = function(project, iteration) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/initIterationUserStoryPoints?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project + "&userStrIter="
							+ iteration, config).success(function(response) {
				$rootScope.iterationUserStoryPoints = response;

			});
		}

		// //////////////////////////////////////////////////////////////////////////

		// /////////////User Story By Priority Funnel Chart
		// /////////////////////////////////////////////////////////////

		$rootScope.userStoryPrioirtyFunnelChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/rallyServices/userStorypriorityFunnelchartdata?dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.funnel($scope.data);
								} else {
									$('#my-funnel').remove(); // this is my
																// <canvas>
																// element
									$('#funneldiv')
											.append(
													' <canvas id="my-funnel" height="250" style="margin-top:40px;margin-left:100px"> </canvas>');
								}
							});

			$scope.funnel = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];
				$scope.backgroundColor = [];
				$scope.borderColor = [];

				for (var i = 0; i < $scope.result.length; i++) {
					if ($scope.result[i].storyStatus == "") {
						$scope.result[i].storyStatus = "No Status";
					}

					if ($scope.result[i].storyStatus == "Defined") {
						$scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
						$scope.borderColor.push("rgba(54, 162, 235, 1)");
					}
					if ($scope.result[i].storyStatus == "In-Progress") {
						$scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
						$scope.borderColor.push("rgba(75, 192, 192, 1)");
					}
					if ($scope.result[i].storyStatus == "Completed") {
						$scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
						$scope.borderColor.push("rgba(153, 102, 255, 1)");
					}

					$scope.labels1.push($scope.result[i].storyStatus);
					$scope.data1.push($scope.result[i].priorityCnt);

				}
				$scope.labelsfunnel = $scope.labels1;
				$scope.datafunnel = $scope.data1;

				FunnelChart('my-funnel', {
					values : $scope.datafunnel,
					labels : $scope.labelsfunnel,
					displayPercentageChange : false,
					sectionColor : [ "rgba(255, 99, 132, 0.8)",
							"rgba(54, 162, 235, 0.8)",
							"rgba(255, 206, 86, 0.8)",
							"rgba(75, 192, 192, 0.8)",
							"rgba(153, 102, 255, 0.8)",
							"rgba(255, 159, 64, 0.8)" ],
					labelFontColor : "rgba(255, 255, 255, 0.8)"
				});
			}
		}

		// //////////////////////////////////////////////////////////////////////////////////////////////////////

		// /////////// User Story Test cases count////////////////////

		$rootScope.initUserStoryTestCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryTestCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$scope.testCasesData = response;
						// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
					});
		}

		// //////////////////// User Story Sprint
		// count/////////////////////////////
		$rootScope.initUserStorySprintCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStorySprintCount?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						// $scope.userStorySprintData = response;
						$rootScope.userStorySprintData = response;
						// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
					});
		}

		// ////////////////////User Story Sprint count for Life
		// Cycle/////////////////////////////
		$rootScope.initLifeUserStorySprintCount = function(project) {

			if (project != undefined) {
				var token = AES.getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};
				$http.get(
						"./rest/rallyServices/lifeuserStorySprintCount?dashboardName="
								+ dashboardName + "&owner=" + owner
								+ "&userStrproject=" + project, config)
						.success(function(response) {
							// $scope.lifeuserStorySprintData = response;
							$rootScope.lifeuserStorySprintData = response;
							// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
						});
			}

			else {
				$scope.lifeuserStorySprintData = '';
			}

		}

		// ////////////////////User Story Sprint count for
		// Ops/////////////////////////////
		$rootScope.initOpsUserStorySprintCount = function(project) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/lifeuserStorySprintCount?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {

						// $scope.opsuserStorySprintData = response;
						$rootScope.opsuserStorySprintData = response;
						// $rootScope.lifeuserStorySprintData = response;
						// $scope.loadPieCharts('#reqvola',$scope.volatilitydata);
					});

		}

		// ////////////////// User Story Defect
		// count/////////////////////////////////
		$scope.initUserStoryDefectCount = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryDefectCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.defectdata = response;
					});

		}

		// /////////////////////////User Story Trend Chart
		// //////////////////////////////////////

		$scope.userStoryLifeTrendChart = function(project) {

			if (project == null || project == undefined) {
				project = $rootScope.selectedRallyProject;
			}

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/rallyServices/userstorytrendchartdata?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$scope.data = response;
						$scope.linechart($scope.data);
					});

			$scope.linechart = function(lineresult) {

				$scope.lineresult = lineresult;
				$scope.labels = [];
				$scope.data = [];
				$scope.series = [];

				$scope.defined = [];
				$scope.completed = [];
				$scope.inprogress = [];

				var text;
				for (var i = 0; i < $scope.lineresult.length; i++) {

					$scope.labels.push($scope.lineresult[i].mydate);

					$scope.defined.push($scope.lineresult[i].defined);
					$scope.completed.push($scope.lineresult[i].completed);
					$scope.inprogress.push($scope.lineresult[i].inprogress);
				}
				$scope.data = [ $scope.defined, $scope.completed,
						$scope.inprogress ];

				// $scope.data=[$scope.defined];

				var config = {
					type : 'line',

					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.nostatus,
							label : "No status",
							borderColor : "rgba(67, 154, 213, 0.7)",
						}, {
							data : $scope.defined,
							label : "Defined",
							borderColor : "rgba(255, 99, 132, 0.8)"
						}, {
							data : $scope.inprogress,
							label : "In-Progress",
							borderColor : "rgb(67, 154, 213, 0.7)",
						}, {
							data : $scope.completed,
							label : "Completed",
							borderColor : "rgba(255, 159, 64, 0.8)",

						}

						]
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
									color : "rgba(255,255,255,0.2)",
								}
							} ],
							yAxes : [ {
								gridLines : {
									color : "rgba(255,255,255,0.2)",
								}
							} ]

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
				$('#line').remove(); // this is my <canvas> element
				$('#linediv').append(
						'<canvas id="line" height="100"> </canvas>');
				var ctx = document.getElementById("line");
				window.line = new Chart(ctx, config);

			}

		}

		// //////////////////////////////////////////////////////////////////////////////////////

		// ///////////////////User Story By Defect Bar
		// Chart////////////////////////////////////

		$scope.userStoryDefChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/rallyServices/userstorydefchartdata?dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.designerchart($scope.data);
								} else {
									$('#designerbarchart').remove(); // this
																		// is my
																		// <canvas>
																		// element
									$('#exediv')
											.append(
													'<canvas id="designerbarchart" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');
								}
							});

			$scope.designerchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].storyID);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#designerbarchart').remove(); // this is my <canvas>
													// element
				$('#exediv')
						.append(
								'<canvas id="designerbarchart" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');

				var ctx = document.getElementById("designerbarchart");
				var designerbarchart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B" ],
							borderWidth : 1,

						} ]
					},
					options : {
						tooltips : {
							enabled : true
						},
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ],
							xAxes : [ {
								barThickness : 40,
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ]

						}
					}

				});
			};

		}

		// ////////////////////////////////////////////////////////////////////////////

		// ///////////////////Sprint By Defect Bar
		// Chart////////////////////////////////////

		$scope.sprintDefChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/rallyServices/sprintdefchartdata?dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.sprintDefchart($scope.data);
								} else {
									$('#designerbarchart4').remove(); // this
																		// is my
																		// <canvas>
																		// element
									$('#exediv4')
											.append(
													'<canvas id="designerbarchart4" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');
								}
							});

			$scope.sprintDefchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].sprintID == ""
							|| $scope.result[i].sprintID == null) {
						$scope.result[i].sprintID = "Unassigned";
					}

					// $scope.labels1.push($scope.result[i].sprintID);
					// $scope.data1.push($scope.result[i].typecount);

					$scope.labels1.push('Sprint ' + $scope.result[i].sprintID);
					$scope.data1.push($scope.result[i].typecount);

				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#designerbarchart4').remove(); // this is my <canvas>
													// element
				$('#exediv4')
						.append(
								'<canvas id="designerbarchart4" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');

				var ctx = document.getElementById("designerbarchart4");
				var designerbarchart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B" ],
							borderWidth : 1,

						} ]
					},
					options : {
						tooltips : {
							enabled : true
						},
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ],
							xAxes : [ {
								barThickness : 40,
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ]

						}
					}

				});
			};

		}

		// ////////////////////////////User Story by Sprint Bar
		// chart/////////////////////////////////////////

		$scope.userStorySprintChart = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/rallyServices/userstorysprintchartdata?dashboardName="
									+ dashboardName + "&owner=" + owner, config)
					.success(
							function(response) {
								$scope.data = response;
								if ($scope.data.length != 0) {
									$scope.sprintchart($scope.data);
								} else {
									$('#designerbarchart1').remove(); // this
																		// is my
																		// <canvas>
																		// element
									$('#exediv1')
											.append(
													'<canvas id="designerbarchart1" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');
								}
							});

			$scope.sprintchart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].iteration == ""
							|| $scope.result[i].iteration == null) {
						$scope.result[i].iteration = "Backlog";
					}

					// if($scope.result[i].sprintID !="No Sprint"){
					// $scope.labels1.push('Sprint '+$scope.result[i].sprintID);
					// }

					$scope.labels1.push($scope.result[i].iteration);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;

				$('#designerbarchart1').remove(); // this is my <canvas>
													// element
				$('#exediv1')
						.append(
								'<canvas id="designerbarchart1" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');

				var ctx = document.getElementById("designerbarchart1");
				var designerbarchart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B" ],
							borderWidth : 1,

						} ]
					},
					options : {
						tooltips : {
							enabled : true
						},
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								},
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ],
							xAxes : [ {
								barThickness : 40,
								gridLines : {
									color : "rgba(255,255,255,0.2)"
								}
							} ]

						}
					}

				});
			};

		}

		// ////////////////////////////////////////////////////////////////////////////////

		// ///////////////////User Story By Owner Bar Graph
		// /////////////////////

		// Design Count by Owner - BAR CHART
		$scope.newOwnerCountChart = function(project) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/userstoryownerchartdata?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$scope.data = response;
						$scope.tcownerchart($scope.data);

					});

			$scope.tcownerchart = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].storyOwner == ""
							|| $scope.result[i].storyOwner == null) {
						$scope.result[i].storyOwner = "No Owner";
					}

					$scope.labels1.push($scope.result[i].storyOwner);
					$scope.data1.push($scope.result[i].ownercount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#ownerchart').remove();
				$('#ownerchartdiv')
						.append(
								'<canvas id="ownerchart" style="width:900px ; height:150px; margin-top:30px">')
				var ctx = document.getElementById("ownerchart");
				var ownerchart = new Chart(ctx, {
					type : 'bar',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 0.8)",
									"#835C3B", "#55335e" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)", "#429bf4",
									"#723f4e", "rgba(255, 206, 86, 1)",
									"#835C3B", "#55335e" ],
							borderWidth : 1
						} ]
					},
					options : {
						tooltips : {
							enabled : true
						},
						scales : {
							yAxes : [ {
								ticks : {
									beginAtZero : true
								}
							} ],
							xAxes : [ {
								barThickness : 40
							} ]

						}
					}

				});
			};

		}

		// ////////////////////////////////////////////////////////////////////////

		// //////////Life Cycle User Story By Status
		// ///////////////////////////////////////

		// Design Count by Owner - BAR CHART
		$scope.lifeUserStrStatusChart = function(project, iteration) {
			debugger;

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/rallyServices/lifeUserstoryStatuschartdata?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project + "&userStrIter="
							+ iteration, config).success(function(response) {
				$scope.data = response;
				$scope.userStrStatuschart($scope.data);

			});

			$scope.userStrStatuschart = function(result) {

				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].storyStatus == ""
							|| $scope.result[i].storyStatus == null) {
						$scope.result[i].storyStatus = "No Status";
					}

					$scope.labels1.push($scope.result[i].storyStatus);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#userStrStatuschart').remove();
				$('#lifeUserStrVelocitychartdiv')
						.append(
								'<canvas id="userStrStatuschart" style="width:900px ; height:150px; margin-top:30px">')
				var ctx = document.getElementById("userStrStatuschart");
				var ownerchart = new Chart(
						ctx,
						{
							type : 'bar',
							data : {
								labels : $scope.labelspie,
								datasets : [ {
									data : $scope.datapie,
									backgroundColor : [
											"rgba(54, 162, 235, 0.8)",
											"rgba(153, 102, 255, 0.8)",
											"rgba(75, 192, 192, 0.8)",
											"rgba(255, 159, 64, 0.8)",
											"rgba(255, 99, 132, 0.8)",
											"#429bf4", "#723f4e",
											"rgba(255, 206, 86, 0.8)",
											"#835C3B", "#55335e" ],
									borderColor : [ "rgba(54, 162, 235, 1)",
											"rgba(153, 102, 255, 1)",
											"rgba(75, 192, 192, 1)",
											"rgba(255, 159, 64, 1)",
											"rgba(255, 99, 132, 1)", "#429bf4",
											"#723f4e", "rgba(255, 206, 86, 1)",
											"#835C3B", "#55335e" ],
									borderWidth : 1
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
															.forEach(function(
																	bar, index) {
																// This below
																// lines are
																// user to show
																// the count in
																// TOP of the
																// BAR
																/*
																 * var data =
																 * dataset.data[index];
																 * ctx.fillText(data,
																 * bar._model.x,
																 * bar._model.y -
																 * 5);
																 */

																// This below
																// lines are
																// user to show
																// the count in
																// CENTER of the
																// BAR
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
																				centerPoint.y - 2);
															});
												});
									}
								},
								tooltips : {
									enabled : true
								},
								scales : {
									yAxes : [ {
										ticks : {
											beginAtZero : true
										}
									} ],
									xAxes : [ {
										barThickness : 40
									} ]

								}
							}

						});
			};

		}

		// /////////////////////////////////////////////////////////////////////////////////

		// //////////User Story By Project pie chart/////////////////////

		$scope.newTypeChart = function(project) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/rallyServices/userstorybyprjchartdata?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$scope.data = response;
						$scope.tctypechart($scope.data);
					});

			$scope.tctypechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {
					$scope.labels1.push($scope.result[i].projectName);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#donutChart2').remove();
				$('#donutChartdiv2')
						.append(
								'<canvas id="donutChart2" width="200" height="200" style="margin-top:20px; margin-left:120px"></canvas>');
				var ctx = document.getElementById("donutChart2");
				var donutChart = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)",

									"rgba(255, 206, 86, 0.8)", "#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)",

									"rgba(255, 206, 86, 1)", "#835C3B" ],
							borderWidth : 1
						} ]
					},

				});
			};

		};

		// ///////////////////////////////////////////////////////////////

		// /////////////////////////User Story By Status Pie
		// Chart/////////////////////////////////

		$scope.userStoryByStatusPieChart = function(project) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/rallyServices/userstorybystatuschartdata?dashboardName="
							+ dashboardName + "&owner=" + owner
							+ "&userStrproject=" + project, config).success(
					function(response) {
						$scope.data = response;
						$scope.statustypechart($scope.data);
					});

			$scope.statustypechart = function(result) {
				$scope.result = result;
				$scope.labels1 = [];
				$scope.data1 = [];

				for (var i = 0; i < $scope.result.length; i++) {

					if ($scope.result[i].iteration == ""
							|| $scope.result[i].iteration == null) {
						$scope.result[i].iteration = "Backlog";
					}
					$scope.labels1.push($scope.result[i].iteration);
					$scope.data1.push($scope.result[i].typecount);
				}
				$scope.labelspie = $scope.labels1;
				$scope.datapie = $scope.data1;
				var layoutColors = baConfig.colors;
				$('#donutChart1').remove();
				$('#donutChartdiv1')
						.append(
								'<canvas id="donutChart1" width="200" height="200" style="margin-top:20px; margin-left:120px"></canvas>');
				var ctx = document.getElementById("donutChart1");
				var donutChart = new Chart(ctx, {
					type : 'doughnut',
					data : {
						labels : $scope.labelspie,
						datasets : [ {
							data : $scope.datapie,
							backgroundColor : [ "rgba(54, 162, 235, 0.8)",
									"rgba(153, 102, 255, 0.8)",
									"rgba(75, 192, 192, 0.8)",
									"rgba(255, 159, 64, 0.8)",
									"rgba(255, 99, 132, 0.8)",

									"rgba(255, 206, 86, 0.8)", "#835C3B" ],
							borderColor : [ "rgba(54, 162, 235, 1)",
									"rgba(153, 102, 255, 1)",
									"rgba(75, 192, 192, 1)",
									"rgba(255, 159, 64, 1)",
									"rgba(255, 99, 132, 1)",

									"rgba(255, 206, 86, 1)", "#835C3B" ],
							borderWidth : 1
						} ]
					},

				});
			};

		};
		// ///////////////////////////////////////////////////////////////////////////////////////////////////

		$scope.initialTestCasecountpaginate = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryTestCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});
		}

		$scope.initialUserStorycountpaginate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});
		}

		$scope.initialDefectCountpaginate = function() {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"./rest/rallyServices/userStoryDefectCount?dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});
		}

		// /////////////// Table on-load for user story test case
		// data/////////////////////////////
		$scope.userStoryTestCaseTableData = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;

			$http.get(
					"./rest/rallyServices/userStoryTestCaseTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&owner=" + owner, config).success(
					function(response) {
						$rootScope.userStoryTestCaseTableDetails = response;
					});
			paginationService.setCurrentPage("userStoryTestCasepaginate",
					$scope.index);
		};

		// ///////////////////////// Table on-load for user story test case
		// data////////////////////////
		$scope.userStoryTableData = function(start_index) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;

			$http.get(
					"./rest/rallyServices/userStoryTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&owner=" + owner, config).success(
					function(response) {
						$rootScope.userStoryTableDataDetails = response;
					});
			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.index);
		};

		// /////////////////////// Table on-load for user story Defect
		// data////////////////////////
		$scope.userStoryDefectTableData = function(start_index) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.index = start_index;
			$scope.itemsPerPage = 5;

			$http.get(
					"./rest/rallyServices/userStoryDefectTableDetails?&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&dashboardName=" + dashboardName
							+ "&owner=" + owner, config).success(
					function(response) {
						$rootScope.userStoryDefectTableDetails = response;
					});

			paginationService.setCurrentPage("userStoryDefectdatapaginate",
					$scope.index);
		};

		// //////////////////////////// User Story Search
		// ///////////////////////////////////////////////
		$scope.search = function(start_index, searchField, searchText) {

			$scope.start_index = start_index;
			$scope.searchField = searchField;
			$scope.searchText = searchText;
			$rootScope.sortkey = false;
			$rootScope.searchkey = true;
			$scope.key = false;

			if ($scope.searchField == "storyID") {
				$rootScope.storyID = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyName") {
				$rootScope.storyName = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "userStrdescription") {
				$rootScope.userStrdescription = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "storyOwner") {
				$rootScope.storyOwner = searchText;
				$scope.key = true;
			} else if ($scope.searchField == "projectName") {
				$rootScope.projectName = searchText;
				$scope.key = true;
			}

			$scope.searchable();
		}

		$scope.searchable = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"./rest/rallyServices/userStorySearchpagecount?storyName="
							+ $rootScope.storyName + "&storyID="
							+ $rootScope.storyID + "&userStrdescription="
							+ $rootScope.userStrdescription + "&storyOwner="
							+ $rootScope.storyOwner + "&projectName="
							+ $rootScope.projectName + "&dashboardName="
							+ dashboardName + "&owner=" + owner, config)
					.success(function(response) {
						$rootScope.reqdatapaginate = response;
					});

			paginationService.setCurrentPage("userStorydatapaginate",
					$scope.start_index);
			$scope.itemsPerPage = 5;

			$http
					.get(
							"./rest/rallyServices/searchUserStory?storyName="
									+ $rootScope.storyName + "&storyID="
									+ $rootScope.storyID
									+ "&userStrdescription="
									+ $rootScope.userStrdescription
									+ "&storyOwner=" + $rootScope.storyOwner
									+ "&projectName=" + $rootScope.projectName
									+ "&itemsPerPage=" + $scope.itemsPerPage
									+ "&start_index=" + $scope.start_index
									+ "&dashboardName=" + dashboardName
									+ "&owner=" + owner, config)
					.success(
							function(response) {

								if (response == "" && $scope.key == false) {
									$rootScope.searchkey = false;
									$scope.initialUserStorycountpaginate();
									$scope.userStoryTableData(1);
								} else {
									paginationService.setCurrentPage(
											"userStorydatapaginate",
											$scope.start_index);
									$rootScope.userStoryTableDataDetails = response;
								}
							});

		}

		$scope.userStoryTestpageChangedLevel = function(pageno) {

			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {

				$scope.userStoryTestCaseTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryTestCaseTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.searchTestCase($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		$scope.userStorypageChangedLevel = function(pageno) {
			$scope.pageno = pageno;

			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {
				$scope.userStoryTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.search($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		$scope.userStoryDefectpageChangedLevel = function(pageno) {

			$scope.pageno = pageno;
			if ($scope.sortBy == undefined && $rootScope.sortkey == false
					&& $rootScope.searchkey == false) {

				$scope.userStoryDefectTableData($scope.pageno);

			} else if ($rootScope.sortkey == true) {
				$scope.userStoryDefectTableData($scope.pageno);

			} else if ($rootScope.searchkey == true) {
				$scope.searchDefect($scope.pageno, $scope.searchField,
						$scope.searchText);

			}
		};

		// //////////// Sort function starts
		// here////////////////////////////////////
		$scope.sort = function(keyname, start_index) {
			$rootScope.sortkey = true;
			$rootScope.searchkey = false;
			$scope.sortBy = keyname;
			$scope.index = start_index;
			$scope.reverse = !$scope.reverse;
			$scope.sortedtable($scope.sortBy, $scope.index, $scope.reverse);
		};

		// Table on-load with sort implementation
		$scope.sortedtable = function(sortvalue, start_index, reverse) {
			paginationService.setCurrentPage("reqpaginate", start_index);
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$scope.column = sortvalue;
			$scope.index = start_index;
			$scope.order = reverse;
			$http.get(
					"./rest/rallyServices/requirementsData?sortvalue="
							+ $scope.column + "&itemsPerPage="
							+ $scope.itemsPerPage + "&start_index="
							+ $scope.index + "&reverse=" + $scope.order
							+ "&dashboardName=" + dashboardName + "&owner="
							+ owner, config).success(function(response) {
				$rootScope.reqTableDetails = response;
			});
		}

		// Back Button Functionality

		$scope.back = function() {

			// alert("Back button");
			$state.go('viewDashbaord');

		}

		/* Export Graphs and tables */
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

	}

})();