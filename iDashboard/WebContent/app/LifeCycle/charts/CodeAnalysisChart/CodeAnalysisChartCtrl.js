/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller(
			'CodeAnalysisChartCtrl', CodeAnalysisChartCtrl);

	/** @ngInject */
	function CodeAnalysisChartCtrl($scope, $rootScope, $state, $http,
			localStorageService, codeAnalysisData, baConfig, $element, $base64,
			layoutPaths) {

		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		if (localStorageService.get('component')) {
			// Will assign the selected job to dropdown
			var component = localStorageService.get('component');
			$rootScope.codeAnalysisProjName = component.codeAnalysisProjectName;
		} else {
			// Will clear the selected job from dropdown
			$rootScope.codeAnalysisProjName = false;
		}

		codeAnalysisData.details().then(function(data) {

			$scope.caprojects(data)
			/*
			 * processResponse(builds); deferred.resolve(data.lastUpdated);
			 */
		})

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var token = $base64.encode(username + ":" + password);
			return token;
		}

		$scope.open = function() {
			$state.go('codeanalysis');
		};

		$scope.caprojects = function(data) {

			// $http.get("rest/jsonServices/buildsJobs").success(function
			// (response) {
			$scope.projectList = data;
			if ($rootScope.codeAnalysisProjName == "") {

				$rootScope.codeAnalysisProjName = $rootScope.caProjectName;
			}

			// $rootScope.caProjectName = selectedProj.name;

			if ($rootScope.codeAnalysisProjName) {
				for (var i = 0; i < $scope.projectList.length; i++) {
					if ($scope.projectList[i].prjName == $rootScope.codeAnalysisProjName) {
						// To save the Selected jobName in Collection
						// $rootScope.buildJob = $rootScope.selectedVal.jobName;
						$scope.selectedProj = $scope.projectList[i];
						break;
					}
				}

				$scope.selectedProject($scope.selectedProj)

				/*
				 * if($rootScope.nodays !== 15) {
				 * $scope.selectedProject($scope.selectedcaproj) } else {
				 * $scope.selectedProject($scope.selectedcaproj) }
				 */
			}

			// $scope.selectedProj = $scope.projectList[0];
			// $scope.selectedProject($scope.selectedProj);

			// $scope.selectedJob = $scope.buildJobList[0];
			// $scope.selectedBuildJob($scope.selectedJob);

		}

		// #1 Get Code Coverage Details
		$scope.getcoverage = function(projectName) {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getcoverage?projectname="
							+ projectName, config).success(function(response) {
				gethomepagecoverage(response);
			});

		}

		function gethomepagecoverage(data) {

			var coverage = [];
			var groupbydata;
			var filterdata;

			
			
			for (var x = 0; x < data.length; x++) {

				coverage.push({
					date : data[x].date,
					coverage : data[x].coverage
				})

			}

			groupbydata = group(data);
			getData(groupbydata);

			
			// Get lines of code

			function group(data) {
				return _.groupBy(data, function(item) {
					return moment(item.date).format('L');
				});
			}

			function getData(simplifiedData) {

				$scope.coverage = [];
				$scope.coverageDate = [];

				_.forEach(simplifiedData, function(caData) {
					var coverage = 0;
					var coverageDate = "";
					// console.log(build);
					for (var x = 0; x < caData.length; x++) {

						coverage = Number(coverage)
								+ Number(caData[x].coverage);

						if (coverageDate == "") {
							coverageDate = moment(caData[x].date).format('L')
						}
						// $scope.graphData
					}

					$scope.coverage.push(coverage);
					$scope.coverageDate.push(moment(coverageDate)
							.startOf('day').format("D/MMM"));

				});
			}

			
			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			
			$scope.linesofCode = result.lines;

			
			$scope.lines_to_cover = result.lines_to_cover;
			$scope.new_lines_to_cover = result.new_lines_to_cover == "" ? 0
					: result.new_lines_to_cover;

			// Set value to pieGraph
			$scope.codeCoveragepie = result.coverage;
			$scope.loadPieCharts('#codeCoverageChart', $scope.codeCoveragepie);

			//Trend Graph

			var config = {
				type : 'line',

				data : {
					labels : $scope.coverageDate,
					datasets : [ {
						data : $scope.coverage,
						label : "Coverage",
						borderColor : "#106810",
						fill : 1
					} ]
				},
				options : {
					scales : {
						xAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Time Period'
								},
							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						} ],
						yAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Covered Lines of Code'
								},
						gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						}, {
							ticks : {
								min : 0,
								stepSize : 1
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
						enabled : false,

						// Zooming directions. Remove the appropriate
						// direction to disable
						// Eg. 'y' would only allow zooming in the y
						// direction
						mode : 'x',
					},
					plugins : {
						filler : {
							propagate : true
						}
					}
				}
			}

			var ctx;

			$('#linecoverage').remove(); // this is my <canvas> element
			$('#coverage')
					.append(
							'<canvas id="linecoverage" style="height:280px;"> </canvas>');
			ctx = document.getElementById("linecoverage");

			// window.line = new Chart(ctx, config);
			var myChart = new Chart(ctx, config);

		}

		// End of Code Coverage

		// #2 Get Unit Test Metrics
		$scope.getunittest = function(projectName) {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getunittest?projectname="
							+ projectName, config).success(function(response) {
				getunittestmetrics(response);
			});

		}

		function getunittestmetrics(data) {

			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.testExecutionDuration = result.coverage.test_execution_time;
			$scope.test_success_density = result.coverage.test_success_density;

			var unitTest = [];
			var groupbydata;
			var filterdata;

			for (var x = 0; x < data.length; x++) {
				unitTest.push({
					date : data[x].date,
					unitTest : data[x].coverage.tests
				})

			}

			groupbydata = group(unitTest);
			getData(groupbydata);

			function group(data) {
				return _.groupBy(data, function(item) {
					return moment(item.date).format('L');
				});
			}

			function getData(simplifiedData) {

				$scope.unitTest = [];
				$scope.unitTestDate = [];

				_.forEach(simplifiedData, function(caData) {
					var unitTest = 0;
					var unitTestDate = "";

					for (var x = 0; x < caData.length; x++) {

						unitTest = Number(unitTest)
								+ Number(caData[x].unitTest);

						if (unitTestDate == "") {
							unitTestDate = moment(caData[x].date).format('L')
						}

					}

					$scope.unitTest.push(unitTest);
					$scope.unitTestDate.push(moment(unitTestDate)
							.startOf('day').format("D/MMM"));

				});
			}

			// Chart Js //

			var config = {
				type : 'line',

				data : {
					labels : $scope.unitTestDate,
					datasets : [ {
						data : $scope.unitTest,
						label : "Unit Test",
						borderColor : "#106810",
						fill : 1
					} ]
				},
				options : {
					scales : {
						xAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Time Period'
								},
							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						} ],
						yAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Passed Unit TestCases'
								},
						gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						}, {
							ticks : {
								min : 0,
								stepSize : 1
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
						enabled : false,

						// Zooming directions. Remove the appropriate
						// direction to disable
						// Eg. 'y' would only allow zooming in the y
						// direction
						mode : 'x',
					},
					plugins : {
						filler : {
							propagate : true
						}
					}
				}
			}

			var ctx;

			$('#lineunitTest').remove(); // this is my <canvas> element
			$('#unitTest')
					.append(
							'<canvas id="lineunitTest" style="height:280px;"> </canvas>');
			ctx = document.getElementById("lineunitTest");

			// window.line = new Chart(ctx, config);
			var myChart = new Chart(ctx, config);

		}

		// #2 End of Unit Test Metrics

		// #3 Get Size Metrics
		$scope.getsize = function(projectName) {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getsizemetrics?projectname="
							+ projectName, config).success(function(response) {
				getsizemetrics(response);
			});

		}

		function getsizemetrics(data) {

			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.classes = result.classes;
			$scope.functions = result.functions;
			$scope.lines = result.lines;
		}

		// #3 End of Get Size Metrics

		// #4 Get Complexity Metrics
		$scope.getcomplexity = function(projectName) {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getcomplexitymetrics?projectname="
							+ projectName, config).success(function(response) {
				getcomplexitymetrics(response);
			});

		}

		function getcomplexitymetrics(data) {

			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.complexity = result.complexity;
			$scope.class_complexity = result.class_complexity;
			$scope.function_complexity = result.function_complexity;
		}

		// #4 End of Get Complexity Metrics

		// #5 Get Issues Metrics
		$scope.getissues = function(projectName) {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getissuemetrics?projectname="
							+ projectName, config).success(function(response) {
				getissuemetrics(response);
			});

		}

		function getissuemetrics(data) {

			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.violations = result.violations;
			$scope.open_issues = result.open_issues;
			$scope.reopened_issues = result.reopened_issues;
		}

		// #5 End of Get Issue Metrics

		// #6 Get Get reliability Metrics

		$scope.getreliability = function(projectName) {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getreliabilitymetrics?projectname="
							+ projectName, config).success(function(response) {
				getreliabilitymetrics(response);
			});
		}

		function getreliabilitymetrics(data) {

			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.newBugs = result.new_bugs == "" ? 0 : result.new_bugs;
			$scope.reliability_Rating = returnRating(result.reliability_rating);
			$scope.reliability_Rating_color = returnColour($scope.reliability_Rating);
			$scope.new_reliability_Rating = returnRating(result.new_reliability_rating);
			$scope.new_reliability_Rating_color = returnColour($scope.new_reliability_Rating);

			$scope.Label = [];
			$scope.bugs = [];
			$scope.remediationeffort = [];

			var reliability = [];
			var groupbydata;
			var filterdata;

			for (var x = 0; x < data.length; x++) {
				reliability
						.push({
							date : data[x].date,
							bugs : data[x].bugs,
							remediationeffort : data[x].reliability_remediation_effort
						})
			}
			groupbydata = group(reliability);
			getData(groupbydata);

			function group(data) {
				return _.groupBy(data, function(item) {
					return moment(item.date).format('L');
				});
			}

			function getData(simplifiedData) {
				$scope.bugs = [];
				$scope.remediationeffort = [];
				$scope.bugremedationDate = [];

				_.forEach(simplifiedData, function(caData) {
					var bugs = 0;
					var remediationeffort = 0;
					var bugremedationDate = "";
					// console.log(build);
					for (var x = 0; x < caData.length; x++) {

						bugs = Number(bugs) + Number(caData[x].bugs);
						remediationeffort = Number(remediationeffort)
								+ Number(caData[x].remediationeffort);

						if (bugremedationDate == "") {
							bugremedationDate = moment(caData[x].date).format(
									'L')
						}
						// $scope.graphData
					}

					$scope.bugs.push(bugs);
					$scope.remediationeffort.push(remediationeffort);
					$scope.bugremedationDate.push(moment(bugremedationDate)
							.startOf('day').format("D/MMM"));

				});
			}

			// Chart Js //

			var config = {
				type : 'line',

				data : {
					labels : $scope.bugremedationDate,
					datasets : [ {
						data : $scope.bugs,
						label : "Bugs",
						borderColor : "#106810",
						fill : 1
					}, {
						data : $scope.remediationeffort,
						label : "Remedation",
						borderColor : "#a50303",
						fill : 1
					} ]
				},
				options : {
					scales : {
						xAxes : [ {

							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						} ],
						yAxes : [ {
							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						}, {
							ticks : {
								min : 0,
								stepSize : 1
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
						enabled : false,

						// Zooming directions. Remove the appropriate
						// direction to disable
						// Eg. 'y' would only allow zooming in the y
						// direction
						mode : 'x',
					},
					plugins : {
						filler : {
							propagate : true
						}
					}
				}
			}

			var ctx;

			$('#line').remove(); // this is my <canvas> element
			$('#reliability').append(
					'<canvas id="line" style="height:400px;"> </canvas>');
			ctx = document.getElementById("line");

			// window.line = new Chart(ctx, config);
			var myChart = new Chart(ctx, config);
		}
		// #6 End of reliability Metrics

		
		// #7 Get SecurityAnalysis Metrics

		$scope.getsecurityanalysis = function(projectName) {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getsecurityanalysis?projectname="
							+ projectName, config).success(function(response) {
				getsecurityanalysismetrics(response);
			});
		}
		
		function getsecurityanalysismetrics(data){
			
			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			// $scope.vulnerabilities=result.security.vulnerabilities;
			// $scope.security_remediation_effort=result.security.security_remediation_effort;

			$scope.newvulnerabilities = result.new_vulnerabilities == "" ? 0
					: result.new_vulnerabilities;
			$scope.security_rating = returnRating(result.security_rating);
			$scope.security_rating_color = returnColour($scope.security_rating);
			$scope.new_security_rating = returnRating(result.new_security_rating);
			$scope.new_security_rating_color = returnColour($scope.new_security_rating);
			// $scope.newvulnerabilitiesRating = data.new_reliability_rating;

			/*
			 * $scope.LabelSecurity = []; $scope.vulnerabilities = [];
			 * $scope.security_remediation_effort = [];
			 */

			var security = [];
			var groupbydata;
			var filterdata;

			for (var x = 0; x < data.length; x++) {
				security
						.push({
							date : data[x].date,
							vulnerabilities : data[x].vulnerabilities,
							remediationeffort : data[x].security_remediation_effort
						})
			}
			groupbydata = group(security);

			getData(groupbydata);

		
			function group(data) {
				return _.groupBy(data, function(item) {
					return moment(item.date).format('L');
				});
			}

			function getData(simplifiedData) {
				// loop through all days in the past two weeks in case there
				// weren't any builds
				// on that date

				$scope.LabelSecurity = [];
				$scope.vulnerabilities = [];
				$scope.security_remediation_effort = [];

				_.forEach(simplifiedData, function(caData) {
					var vulnerabilities = 0;
					var remediationeffort = 0;
					var securityremedationDate = "";
					// console.log(build);
					for (var x = 0; x < caData.length; x++) {

						vulnerabilities = Number(vulnerabilities)
								+ Number(caData[x].vulnerabilities);
						remediationeffort = Number(remediationeffort)
								+ Number(caData[x].remediationeffort);

						if (securityremedationDate == "") {
							securityremedationDate = moment(caData[x].date)
									.format('L')
						}
						// $scope.graphData
					}

					$scope.vulnerabilities.push(vulnerabilities);
					$scope.security_remediation_effort.push(remediationeffort);
					$scope.LabelSecurity.push(moment(securityremedationDate)
							.startOf('day').format("D/MMM"));

				});
			}

			// Chart Js //

			var securityanalysisconfig = {
				type : 'line',

				data : {
					labels : $scope.LabelSecurity,
					datasets : [ {
						data : $scope.vulnerabilities,
						label : "Vulnerabilities",
						borderColor : "#106810",
						fill : 1
					}, {
						data : $scope.security_remediation_effort,
						label : "Remedation",
						borderColor : "#a50303",
						fill : 1
					} ]
				},
				options : {
					scales : {
						xAxes : [ {

							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						} ],
						yAxes : [ {
							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						}, {
							ticks : {
								min : 0,
								stepSize : 1
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
						enabled : false,

						// Zooming directions. Remove the appropriate
						// direction to disable
						// Eg. 'y' would only allow zooming in the y
						// direction
						mode : 'x',
					},
					plugins : {
						filler : {
							propagate : true
						}
					}
				}
			}

			var ctx;

			$('#linesecurity').remove(); // this is my <canvas> element
			$('#security')
					.append(
							'<canvas id="linesecurity" style="height:400px;"> </canvas>');
			ctx = document.getElementById("linesecurity");

			// window.line = new Chart(ctx, config);
			var securityanalysisconfigchart = new Chart(ctx, securityanalysisconfig);
			// Chart Js //
		}

		// #7 End of SecurityAnalysis Metrics
		
		// #8 Get Duplications Metrics

		$scope.getduplications = function(projectName) {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getduplications?projectname="
							+ projectName, config).success(function(response) {
				getduplicationsmetrics(response);
			});
		}
		
		function getduplicationsmetrics(data) {
			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.duplicated_lines = result.duplicated_lines;
			$scope.duplicated_files = result.duplicated_files;
			$scope.new_duplicated_lines = result.new_duplicated_lines == "" ? 0
					: result.new_duplicated_lines;

			var duplications = [];
			var groupbydata;
			var filterdata;

			for (var x = 0; x < data.length; x++) {
				duplications
						.push({
							date : data[x].date,
							duplicatedLines : data[x].duplicated_lines
						})

			}
			groupbydata = group(duplications);

			getData(groupbydata);

			function group(data) {
				return _.groupBy(data, function(item) {
					return moment(item.date).format('L');
				});
			}

			function getData(simplifiedData) {
				$scope.duplication = [];
				$scope.duplicationDate = [];

				_.forEach(simplifiedData, function(caData) {
					var duplication = 0;
					var duplicationDate = "";
					// console.log(build);
					for (var x = 0; x < caData.length; x++) {

						duplication = Number(duplication)
								+ Number(caData[x].duplicatedLines);

						if (duplicationDate == "") {
							duplicationDate = moment(caData[x].date)
									.format('L')
						}
						// $scope.graphData
					}

					$scope.duplication.push(duplication);
					$scope.duplicationDate.push(moment(duplicationDate)
							.startOf('day').format("D/MMM"));

				});
			}

			// Chart Js //

			var config = {
				type : 'line',

				data : {
					labels : $scope.duplicationDate,
					datasets : [ {
						data : $scope.duplication,
						label : "Duplicated Lines",
						borderColor : "#106810",
						fill : 1
					} ]
				},
				options : {
					scales : {
						xAxes : [ {

							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						} ],
						yAxes : [ {
							gridLines : {
								color : "rgba(255,255,255,0.2)",
							}
						}, {
							ticks : {
								min : 0,
								stepSize : 1
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
						enabled : false,

						// Zooming directions. Remove the appropriate
						// direction to disable
						// Eg. 'y' would only allow zooming in the y
						// direction
						mode : 'x',
					},
					plugins : {
						filler : {
							propagate : true
						}
					}
				}
			}

			var ctx;

			$('#lineduplication').remove(); // this is my <canvas> element
			$('#duplication')
					.append(
							'<canvas id="lineduplication" style="height:400px;"> </canvas>');
			ctx = document.getElementById("lineduplication");

			// window.line = new Chart(ctx, config);
			var myChart = new Chart(ctx, config);
		}
		
		// #8 End of Duplications Metrics
		
		
		// #9 Get Maintainability Metrics

		$scope.getmaintainability = function(projectName) {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getmaintainability?projectname="
							+ projectName, config).success(function(response) {
				getmaintainabilitymetrics(response);
			});
		}
		
		function getmaintainabilitymetrics(data) {
			
			var result = _.max(data, function(item) {
				return new Date(item.date).getTime();
			});

			$scope.code_smells = result.code_smells;
			$scope.new_code_smells = result.new_code_smells == "" ? 0
					: result.new_code_smells;
			$scope.technical_debt = result.sqale_index;
			$scope.new_technical_debt = result.new_technical_debt == "" ? 0
					: result.new_technical_debt;
			$scope.maintainability_rating = returnRating(result.sqale_rating);
			$scope.maintainability_rating_color = returnColour($scope.maintainability_rating)
			$scope.new_maintainability_rating = returnRating(result.new_maintainability_rating);
			$scope.new_maintainability_rating_color = returnColour($scope.new_maintainability_rating);
		}

		function capitalizeFirstLetter(string) {
			string = string.replace("_", " ")
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		$scope.selectedProject = function(selectedProj) {
			$rootScope.caProjectName = selectedProj.prjName;

			$scope.getcoverage(selectedProj.prjName)
			$scope.getunittest(selectedProj.prjName)

			$scope.getsize(selectedProj.prjName)
			$scope.getcomplexity(selectedProj.prjName)
			$scope.getissues(selectedProj.prjName)

			$scope.getreliability(selectedProj.prjName)
			$scope.getsecurityanalysis(selectedProj.prjName)
			$scope.getduplications(selectedProj.prjName)
			$scope.getmaintainability(selectedProj.prjName)
			

		}

		function returnRating(ratingNo) {

			var rating = "NA";
			if (ratingNo == "1.0") {
				rating = "A"
			} else if (ratingNo == "2.0") {
				rating = "B"
			} else if (ratingNo == "3.0") {
				rating = "C"
			} else if (ratingNo == "4.0") {
				rating = "D"
			} else if (ratingNo == "5.0") {
				rating = "E"
			}
			return rating;
		}

		function returnColour(rating) {

			var ratingColour = "";
			if (rating == "A") {
				ratingColour = "circlegreen";
			} else if (rating == "B") {
				ratingColour = "circlelightgreen";
			} else if (rating == "C") {
				ratingColour = "circleOrange";
			} else if (rating == "D") {
				ratingColour = "circleOrangeRed";
			} else if (rating == "E") {
				ratingColour = "circleRed";
			}
			return ratingColour;
		}

		
		/*function unitTests(data) {
			$scope.unitTests = [];
			for (var x = 0; x < data.unitTests.length; x++) {

				if (data.unitTests[x].name !== "test_execution_time"
						&& data.unitTests[x].name !== "Errors"
						&& data.unitTests[x].name !== "Success") {
					$scope.unitTests.push({
						name : capitalizeFirstLetter(data.unitTests[x].name),
						formattedValue : data.unitTests[x].formattedValue
					})
				}
				// $scope.graphData
			}
		}*/

		

		

		
		/*function coveragePieChart(lineCoverage) {
			lineCoverage.value = lineCoverage.value || 0;

			ctrl.unitTestCoverageData = {
				series : [ lineCoverage.value, (100 - lineCoverage.value) ]
			};
		}
		;*/

		$scope.loadPieCharts = function(id, chartcount) {
			$scope.chartcount = chartcount;
			$scope.id = id;
			$($scope.id).each(function() {
				var chart = $(this);
				chart.easyPieChart({
					easing : 'easeOutBounce',
					onStep : function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent));
					},
					barColor : chart.attr('rel'),
					trackColor : 'rgba(0,0,0,0)',
					size : 120,
					scaleLength : 0,
					animation : 2000,
					lineWidth : 15,
					lineCap : 'round',
				});
				updatePieCharts($scope.id, $scope.chartcount)
			});
			$('.refresh-data').on('click', function() {
				updatePieCharts();
			});
		}

		function updatePieCharts(id, count) {
			$scope.id = id;
			$scope.count = count;

			$($scope.id).each(function(index, chart) {
				$(chart).data('easyPieChart').update($scope.count);
			});
		}

		/*$scope.sonarprojects = function() {

			$scope.projectList = {
				projectList : [ {
					name : 'Taxi4U-Java'
				}, {
					name : 'InsuranceQuote-.Net'
				} ]
			};

		}*/

		// Back Button Functionality

		$scope.back = function() {

			// alert("Back button");
			$state.go('viewDashbaord');

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

	}

})();