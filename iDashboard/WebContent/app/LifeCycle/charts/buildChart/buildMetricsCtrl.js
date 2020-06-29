/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller('buildMetricsCtrl',
			buildMetricsCtrl);

	/** @ngInject */

	function buildMetricsCtrl($scope, AES, $state, buildData, baConfig, $element,
			$rootScope, $sessionStorage, layoutPaths, localStorageService,
			$base64, $http) {

		var dashName = localStorageService.get('dashboardName');
		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		$rootScope.dashNam = dashName;

		if (localStorageService.get('component')) {
			var component = localStorageService.get('component')
			// Will assign the selected job to dropdown
			$rootScope.buildName = component.buildJobName;
		} else {
			// Will clear the selected job from dropdown
			$rootScope.buildName = false;
		}

		$scope.latestBuild = [];

		// get the
		buildData.details().then(function(data) {

			$scope.buildJobs(data);
			//$scope.getlatestbuild($rootScope.buildName);

			//$scope.getlatestbuild($rootScope.buildName);
			//$scope.gettotalbuild($rootScope.buildName);
			//$scope.getavaragebuildduration($rootScope.buildName);
			//$scope.getbuildperday($rootScope.buildName);

		})

		
		$scope.open = function() {

			
			$scope.selectedJob = $rootScope.buildJob;
			
			localStorageService.set('jobName', $scope.selectedJob);
			//localStorageService.set('nodays', 15);
			$rootScope.selectedVal = $scope.selectedJob;
			
			var jobname = localStorageService.get('jobName');
			if(jobname !=null) {
				$rootScope.selectedVal = jobname;
				
			}
			
			
			$state.go('buildMetrics');

		};
		$rootScope.nodays = localStorageService.get('nodays');
		
		// loading the Drop Down Data for home Screen.
		$scope.buildJobs = function(data) {

			
			$scope.buildJobList = data;// populating build jobs dropdown list

			if ($rootScope.buildName) {
				for (var i = 0; i < $scope.buildJobList.length; i++) {
					if ($scope.buildJobList[i].jobName == $rootScope.buildName) {
						// To save the Selected jobName in Collection
						// $rootScope.buildJob = $rootScope.selectedVal.jobName;
						$scope.selectedJob = $scope.buildJobList[i];
						break;
					}
				}
				
				
				
				if ($rootScope.nodays !== 15) {
					$scope.selectedBuildJob($scope.selectedJob, 5)
				} else {
					$scope.selectedBuildJob($scope.selectedJob, 15)
				}
                 
			}
			
			localStorageService.remove("jobName");

		}
		
		
		
		
		

		$scope.getlatestbuild = function(jobName) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/lifeCycleServices/getlatestbuilds?AppName="
									+ jobName, config).success(
							function(response) {
								latestbuild(response);
							});
		}

		// Get latetBuild
		function latestbuild(selectedJobData) {

			var listbuild = [];

			var tablebuild = document.getElementById("lbuilds");

			if (tablebuild) {
				while (tablebuild.rows.length > 0) {
					tablebuild.deleteRow(0);
				}

				var noofbuilds = selectedJobData.length > 5 ? 5
						: selectedJobData.length
				for (var x = noofbuilds - 1; x >= 0; x--) {

					var icon = 'ion-close-round';

					if (selectedJobData[x].result.toLowerCase() == 'success') {
						icon = "ion-checkmark";
					}

					listbuild.push({
						icon : icon,
						passed : selectedJobData[x].result,
						number : '#' + selectedJobData[x].buildNumber,
						endTime : moment(selectedJobData[x].endTime).startOf(
								'day').fromNow(),
						url : selectedJobData[x].buildUrl
					})

					var tr = document.createElement('tr');
					tr.style.margin = "1px";
					tr.style.fontSize = "14px";
					/*tr.style.cellspacing="10px";*/

					var td0 = document.createElement('td');
					td0.style.width = "10px";
					var td1 = document.createElement('td');
					var td2 = document.createElement('td');
					var td3 = document.createElement('td');

					var spantag = document.createElement('span');
					spantag.className = icon;

					var text2 = document.createTextNode('#'
							+ selectedJobData[x].buildNumber);
					var text3 = document.createTextNode(moment(
							selectedJobData[x].endTime).startOf('day')
							.fromNow());

					td1.appendChild(spantag);
					td2.appendChild(text2);
					td3.appendChild(text3);

					tr.appendChild(td0);
					tr.appendChild(td1);
					tr.appendChild(td2);
					tr.appendChild(td3);
					tablebuild.appendChild(tr);

				}

			}

			/* tablebuild.className ='table'; */

			// $scope.buildlist =listbuild;
		}

		$scope.gettotalbuild = function(jobName) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/gettotalbuilds?AppName=" + jobName,
					config).success(function(response) {
				totalbuild(response);

			});
		}

		function totalbuild(build) {

			var successCnt = 0;
			var failureCnt = 0;
			var builddate = "";
			var totalbuild = 0;

			$scope.passedBuild = [];
			$scope.failedBuild = [];
			$scope.totalBuild = [];
			$scope.labels = [];

			for (var x = 0; x < build.length; x++) {

				successCnt = build[x].successCnt;
				failureCnt = build[x].failureCnt;
				builddate = moment(build[x].endTime).format('L')
				totalbuild = build[x].totalbuildcount;

				$scope.passedBuild.push(successCnt);
				$scope.failedBuild.push(failureCnt);
				$scope.totalBuild.push(totalbuild)
				$scope.labels.push(moment(builddate).startOf('day').format(
						"D/MMM"));

			}

			// Grpah for TotalBuilds

			$('#barcharttotalbuilds').remove(); // this is my <canvas> element
			$('#totalBuilds')
					.append(
							' <canvas id="barcharttotalbuilds" style="width:200px ; height:125px;"> </canvas>');

			var ctx = document.getElementById("barcharttotalbuilds");
			var myChart = new Chart(ctx, {
				type : 'bar',
				data : {
					labels : $scope.labels,
					datasets : [ {
						label : 'No. of builds: ',
						data : $scope.totalBuild,
						backgroundColor : "#078f46",
						borderWidth : 1

					} ]
				},
				options : {
					tooltips : {
						enabled : true
					},
					scales : {
						yAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Number of Builds',
									fontColor: '#4c4c4c'
								},
						
							ticks : {
								beginAtZero : true,
								fontColor: '#4c4c4c'
							},
							gridLines : {
								color : "#d8d3d3"
							}
						} ],

						xAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Time Period'
								},
							/*display : false,*/
							gridLines : {
								color : "#d8d3d3"

							},
							ticks : {
								fontColor: '#4c4c4c'
							}
						} ]
					}
				}
			});

			// End of TotalBuilds

		}

		// Get Average Duration

		$scope.getavaragebuildduration = function(jobName) {

			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getaveragedurationbuild?AppName="
							+ jobName, config).success(function(response) {
				averagebuildDuration(response);

			});
		}

		function averagebuildDuration(build) {

			var builddate = "";
			var buildduration = 0;
			var avgbuildduration = 0;

			$scope.duration = [];
			$scope.label = [];

			for (var g = 0; g < build.length; g++) {

				builddate = moment(build[g].endTime).format('L');
				buildduration = build[g].duration

				$scope.duration.push(buildduration);
				$scope.label.push(moment(builddate).startOf('day').format(
						"D-MMM"));
			}

			$('#barchart').remove(); // this is my <canvas> element
			$('#averageBuildDuration')
					.append(
							' <canvas id="barchart";style="width: 350px;  "> </canvas>');

			var ctx = document.getElementById("barchart");
			var myChart = new Chart(ctx, {
				type : 'bar',
				data : {
					labels : $scope.label,
					datasets : [ {
						label : "Build Duration",
						data : $scope.duration,
						backgroundColor : "#078f46",
						borderWidth : 1
					} ]
				},
				options : {
					tooltips : {
						enabled : true
					},
					scales : {
						yAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Build duration',
									fontColor: '#4c4c4c'
								},
						ticks : {
								beginAtZero : true,
								fontColor: '#4c4c4c',
								stepSize : 2
							},
							gridLines : {
								color : "#d8d3d3"
							}
						} ],

						xAxes : [ {
							 scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor: '#4c4c4c'
								},
							gridLines : {
								color : "#d8d3d3"
							},
							ticks : {
								fontColor: '#4c4c4c',
							}
						} ]
					}
				}
			});
		}

		// End of Average Duration

		//Get Build Per Day

		$scope.getbuildperday = function(jobName) {
		
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get(
					"rest/lifeCycleServices/getbuildperday?AppName=" + jobName,
					config).success(function(response) {
				buildsperyday(response);

			});
		}

		function buildsperyday(build) {

			$scope.graphData = [];

			$scope.passedBuild = [];
			$scope.failedBuild = [];
			$scope.totalBuild = [];
			$scope.labels = [];

			var successCnt = 0;
			var failureCnt = 0;
			var builddate = "";
			var totalbuild = 0;

			for (var x = 0; x < build.length; x++) {

				successCnt = build[x].successCnt;
				failureCnt = build[x].failureCnt;
				builddate = moment(build[x].endTime).format('L')
				totalbuild = build[x].totalbuildcount;

				$scope.passedBuild.push(successCnt);
				$scope.failedBuild.push(failureCnt);
				$scope.totalBuild.push(totalbuild)
				$scope.labels.push(moment(builddate).startOf('day').format(
						"D/MMM"));

			}

			// Chart Js //
			var elementlen = 0;
			var secondelementlen = 0;

			elementlen = $("#lineHome").length;
			if (elementlen > 0) {

				var ctx;
				/*if (nodays <= 5) {*/
				$('#lineHome').remove(); // this is my <canvas> element
				$('#buildsperdayChartHome').append(
						'<canvas id="lineHome" style="width: 100%"> </canvas>');
				ctx = document.getElementById("lineHome");
				var myChart = new Chart(ctx, {
					type : 'line',
					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.passedBuild,
							label : "Passed",
							borderColor : "#106810",
							fill : 1
						}, {
							data : $scope.failedBuild,
							label : "Failed",
							borderColor : "#a50303",
							fill : 1
						} ]
					},
					options : {
						scales : {
							xAxes : [ {

								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									fontColor: '#4c4c4c',
								}
							} ],
							yAxes : [ {
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									beginAtZero : true,
									fontColor: '#4c4c4c',
									min : 0,
									stepSize : 5,
									max : 10
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
				});
			}

			secondelementlen = $("#line").length;

			if (secondelementlen > 0) {

				var ctx1;
				$('#line').remove(); // this is my <canvas> element
				$('#buildsperdayChart').append(
						'<canvas id="line" style="width: 100%"> </canvas>');
				ctx1 = document.getElementById("line");
				var myChart1 = new Chart(ctx1, {
					type : 'line',
					data : {
						labels : $scope.labels,
						datasets : [ {
							data : $scope.passedBuild,
							label : "Passed",
							borderColor : "#106810",
							fill : 1
						}, {
							data : $scope.failedBuild,
							label : "Failed",
							borderColor : "#a50303",
							fill : 1
						} ]
					},
					options : {
						scales : {
							xAxes : [ {
								 scaleLabel : {
										display : true,
										labelString : 'Time Period',
										fontColor: '#4c4c4c'
									},
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									fontColor: '#4c4c4c',
								}
							} ],
							yAxes : [ {
								 scaleLabel : {
										display : true,
										labelString : 'Number of Builds',
										fontColor: '#4c4c4c'
									},
							
								gridLines : {
									color : "#d8d3d3",
								},
								ticks : {
									beginAtZero : true,
									fontColor: '#4c4c4c',
									min : 0,
									stepSize : 5,
									max : 10
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
				});
			}

			/*}*/
			// window.line = new Chart(ctx, config);
			// Chart Js //
		}

		//End Build Per Day

		$scope.selectedBuildJob = function(selectedJob, nodays) {
			// console.log(selectedJob.buildList.length)

			
			
			var jobname = localStorageService.get('jobName');
		
			$scope.selectedJob = selectedJob;
			$rootScope.buildJob = selectedJob.jobName;// To save the Selected
			
			// jobName in Collection
			
			if (!$rootScope.selectedVal) {
				$rootScope.selectedVal = selectedJob;
			}
			
			if(jobname!=null) {
				$scope.selectedJob.jobName = jobname;
				$rootScope.buildJob = jobname;
				
			}
			if (!nodays) {
				nodays = 15;
			}

			var data = selectedJob;
			
			//buildsperday(data, nodays);
			$scope.getbuildperday($rootScope.buildJob);
			$scope.getlatestbuild($rootScope.buildJob);
			$scope.gettotalbuild($rootScope.buildJob);
			$scope.getavaragebuildduration($rootScope.buildJob);
			
			
			if (nodays > 5) {
				//latestbuild(selectedJob);
				//$scope.getlatestbuild($rootScope.buildName);
				//$scope.gettotalbuild($rootScope.buildName);
				//$scope.getavaragebuildduration($rootScope.buildName);

				//averagebuildDuration(data);
				//totalBuild(data)
			}
			// latestbuild(data);
			// $scope.latestbuilds();
		}

		$scope.clean = function() {
			$rootScope.nodays = false;
		}

		//Back Button Functionality
		$scope.back = function() {
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
