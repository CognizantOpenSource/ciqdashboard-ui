/**
 * @author 653731 created on 28.06.2019
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller('OctaneLifeCtrl',
			OctaneLifeCtrl);

	/** @ngInject */
	function OctaneLifeCtrl($scope, AES, $rootScope, $state, $http, $timeout,
			baConfig, $element, layoutPaths, $base64, localStorageService) {

		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		var dashboardName = localStorageService.get('dashboardName');

		//check if component is available
		if (localStorageService.get('component')) {
			if ($rootScope.selectedOctaneProject == null
					|| $rootScope.selectedOctaneProject == false) {
				var component = localStorageService.get('component');
				$rootScope.selectedOctaneProject = component.octaneProject;
			}

		} else {
			$rootScope.selectedOctaneProject = false;

		}

		$scope.getvalues = function() {
			$rootScope.selectedOctaneProject;
		}

		// get Octane projects
		$rootScope.initialOctaneProjects = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/octaneprojectdetails?dashboardName="
							+ dashboardName, config).success(
					function(response) {
						$scope.octaneprojects = response;

					});

		}

		//changed Octaneproject
		$scope.changeSelectedOctaneProjectHome = function(selectedOctaneProject) {
			$rootScope.OctanePrjName = selectedOctaneProject;
			$rootScope.selectedOctaneProject = selectedOctaneProject;

		}

		$scope.initLifeOctaneSprintName = function(selectedOctaneProject) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getcurrentsprint?dashboardName="
							+ dashboardName + "&projectName="
							+ selectedOctaneProject, config).success(
					function(response) {
						$scope.octaneSprintName = response[0];
						$scope.octaneReleaseName = "Release12";

					});

		}

		//get octane Active sprint days left
		$scope.initLifeSprintdaysleft = function(selectedOctaneProject) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getdaysleftinsprint?dashboardName="
							+ dashboardName + "&projectName="
							+ selectedOctaneProject, config).success(
					function(response) {
						$scope.sprintDaysLeft = response;

					});

		}

		//get octane backlogCount
		$scope.initOctaneBacklogStatus = function(selectedOctaneProject) {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getbacklogcount?dashboardName="
							+ dashboardName + "&projectName="
							+ selectedOctaneProject, config).success(
					function(response) {
						$scope.octaneBacklogCount = response;
					});

		}

		$scope.open = function() {

			$state.go('octanelifecycledetails');
		}

		//get octane sprint user story period
		$scope.getOctaneSprintPeriod = function() {
			//alert("inside sprint period");

			// initialise
			$scope.selectedsprintperioddrop = "Current Sprint";
			$scope.sprintSel = "current";

			$rootScope.octanesprintperioddrops = [ "Current Sprint",
					"Last 2 Sprints", "Last 3 Sprints" ];
			$scope.noofsprints = [ "current", "lasttwo", "lastthree" ];
		}

		// get octane selected sprint drop down
		$scope.getSprintPeriodSelection = function(selectedsprint) {
			$scope.selectedsprintperioddrop = selectedsprint;
			var index = $rootScope.octanesprintperioddrops
					.indexOf(selectedsprint);
			$scope.sprintSel = $scope.noofsprints[index];

		}

		//change sprint
		$scope.getOctaneSprintChangeData = function() {
			$scope.initOctaneSprintStatus();
			$scope.initOctaneSprintVelocity();
			$scope.initOctaneInvestedHour();
			$scope.initOctaneDefectSeverity();
			$scope.initOctaneDefectStatus();
			$scope.initOctaneDefectPriority();
		}

		//get Octane sprint status
		$scope.initOctaneSprintStatus = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getsprintstatus?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneStoryStatusChart(response);
					});

		}

		$scope.octaneStoryStatusChart = function(response) {
			//alert("status chart");
			$scope.repdata = response;

			var numberWithCommas = function(x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			};

			var dataPack1 = [];
			var dataPack2 = [];
			var dataPack3 = [];
			var dates = [];

			//main Logic starts

			if ($scope.repdata.length != 0) {
				for (var i = 0; i < $scope.repdata.length; i++) {
					dataPack1.push($scope.repdata[i].storyTodo);
					dataPack2.push($scope.repdata[i].storyInprogress);
					dataPack3.push($scope.repdata[i].storyCompleted);
					dates.push($scope.repdata[i].sprintName);
				}

			}

			var layoutColors = baConfig.colors;
			$('#octanestatuschart').remove(); // this is my <canvas> element
			$('#octanestatusdiv').append(
					' <canvas id="octanestatuschart"> </canvas>');

			var bar_ctx = document.getElementById('octanestatuschart');

			var bar_chart = new Chart(
					bar_ctx,
					{
						type : 'bar',
						data : {
							labels : dates,
							datasets : [
									{
										label : 'New',
										data : dataPack1,
										backgroundColor : "rgba(0, 162, 232, 0.9)",
										hoverBackgroundColor : "rgba(17, 184, 225, 0.7)",
										hoverBorderWidth : 0
									},
									{
										label : 'In-Progress',
										data : dataPack2,
										backgroundColor : "rgba(147, 72, 166, 0.9)",
										hoverBackgroundColor : "rgba(175, 78, 175, 0.7)",
										hoverBorderWidth : 0
									},
									{
										label : 'Done',
										data : dataPack3,
										backgroundColor : "rgba(35, 186, 81, 0.9)",
										hoverBackgroundColor : "rgba(38, 198, 86, 0.7)",
										hoverBorderWidth : 0
									}, ]
						},
						options : {
							responsive : true,
							maintainAspectRatio : false,
							animation : {
								duration : 10,
							},
							tooltips : {
								enabled : true,
								mode : 'label',
								callbacks : {
									label : function(tooltipItem, data) {
										return data.datasets[tooltipItem.datasetIndex].label
												+ ": "
												+ numberWithCommas(tooltipItem.yLabel);
									}
								}
							},
							scales : {
								xAxes : [ {
									barThickness : 85,
									stacked : true,
									scaleLabel : {
										display : true,
										fontColor : '#2c2c2c',
										labelString : 'Sprints'
									},
									ticks : {
										fontColor : '#2c2c2c'
									},
									gridLines : {
										color : "rgba(255,255,255,0.2)"
									},
								} ],

								yAxes : [ {
									stacked : true,
									scaleLabel : {
										display : true,
										fontColor : '#2c2c2c',
										labelString : 'Status Count'
									},
									ticks : {
										beginAtZero : true,
										fontColor : '#2c2c2c'
									},
									gridLines : {
										color : "rgba(255,255,255,0.2)"
									},
								} ],
							},
							legend : {
								display : true,
								labels : {
									fontColor : '#000000',
									fontSize : 10
								}
							}
						}
					});
		}

		$scope.initOctaneSprintVelocity = function() {
			//alert("velocity value");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getsprintvelocity?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneStoryVelocityChart(response);
					});
		}

		$scope.octaneStoryVelocityChart = function(response) {

			$scope.veldata = response;

			var labeldata = [];
			var dataPack1 = [];
			var dataPack2 = [];

			if ($scope.veldata.length != 0) {
				for (var i = 0; i < $scope.veldata.length; i++) {
					dataPack1.push($scope.veldata[i].plannedStorypoint);
					dataPack2.push($scope.veldata[i].completedStorypoint);
					labeldata.push($scope.veldata[i].sprintName);
				}

			}

			var layoutColors = baConfig.colors;

			var mydata = {
				labels : labeldata,
				series : [

				dataPack1, dataPack2 ]
			};

			var options = {
				low : 0,
				showPoint : true,
				showArea : true,

				plugins : [ Chartist.plugins.tooltip(),

				Chartist.plugins.legend({
					legendNames : [ 'Planned Velocity', 'Actual Velocity' ],
				}),

				Chartist.plugins.ctAxisTitle({
					axisX : {
						axisTitle : 'Sprints',
						axisClass : 'ct-axis-title',
						offset : {
							x : 0,
							y : 38
						},
						textAnchor : 'middle'
					},
					axisY : {
						axisTitle : 'Story Points',
						axisClass : 'ct-axis-title',
						offset : {
							x : 0,
							y : 10
						},
						textAnchor : 'middle',
						flipTitle : true
					}
				})

				],

				seriesBarDistance : 50,

				axisX : {
					showGrid : true,
					offset : 30,
					labelOffset : {
						x : 20
					}
				},
				axisY : {
					type : Chartist.AutoScaleAxis,
					showGrid : true,
					offset : 40,
					onlyInteger : true,

					scaleMinSpace : 20
				},
				height : '375px',

				chartPadding : {
					top : 10,
					right : 15,
					bottom : 10,
					left : 10
				},
			};

			var bipolar = new Chartist.Bar('#simpleVelchart', mydata, options);

			bipolar.on('draw', function(data) {
				if (data.type === 'bar') {
					data.element.attr({
						style : 'stroke-width: 50px'
					});
				}
				//below code is to remove grid lines
				if (data.type === 'grid' && data.index !== 0) {
					data.element.remove();
				}
			});
		}

		$scope.initOctaneInvestedHour = function() {
			//alert("Hours");
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/gethourinvested?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneInvestedHourChart(response);
					});
		}

		$scope.octaneInvestedHourChart = function(result) {
			debugger;
			$scope.result = result;
			var labels1 = [];
			var data1 = [];

			for (var i = 0; i < $scope.result.length; i++) {

				labels1.push($scope.result[i].sprintName);
				data1.push($scope.result[i].investedHours);
			}

			var layoutColors = baConfig.colors;
			$('#octanhourchart').remove();
			$('#octanehoursdiv').append('<canvas id="octanhourchart">')
			var ctx = document.getElementById("octanhourchart");
			var ownerchart = new Chart(
					ctx,
					{
						type : 'bar',
						data : {
							labels : labels1,
							datasets : [ {
								label : 'Hours',
								data : data1,
								backgroundColor : [ "rgba(255, 128, 169, 0.9)",
										"rgba(255, 128, 169, 0.9)",
										"rgba(255, 128, 169, 0.9)",
										"rgba(255, 128, 169, 0.9)" ],

								borderColor : [ "rgba(255, 128, 169, 0.9)",
										"rgba(255, 128, 169, 0.9)",
										"rgba(255, 128, 169, 0.9)",
										"rgba(255, 99, 132, 0.8)" ],
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

									this.data.datasets.forEach(function(
											dataset, i) {
										var meta = chartInstance.controller
												.getDatasetMeta(i);
										meta.data.forEach(function(bar, index) {
											//This below lines are user to show the count in TOP of the BAR
											/*var data = dataset.data[index];
											ctx.fillText(data, bar._model.x, bar._model.y - 5); */

											//This below lines are user to show the count in CENTER of the BAR
											if (dataset.data[index] != 0) {
												var data = dataset.data[index]
														+ " h";
											} else {
												var data = "";
											}
											var centerPoint = bar
													.getCenterPoint();
											ctx.fillText(data, centerPoint.x,
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
									scaleLabel : {
										display : true,
										fontColor : '#2c2c2c',
										labelString : 'Invested Hours'
									},
									ticks : {
										beginAtZero : true,
										fontColor : '#2c2c2c'
									},
									gridLines : {
										color : "rgba(255,255,255,0.2)"
									}

								} ],
								xAxes : [ {
									scaleLabel : {
										display : true,
										fontColor : '#2c2c2c',
										labelString : 'sprints'
									},
									ticks : {
										beginAtZero : true,
										fontColor : '#2c2c2c'
									},
									gridLines : {
										color : "rgba(255,255,255,0.2)"
									},
									barThickness : 70

								} ]
							},

							legend : {
								display : true,
								labels : {
									fontColor : '#000000',
									fontSize : 10
								}
							}
						}
					});
		}

		$scope.initOctaneDefectSeverity = function() {
			//alert("defectPriority")
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getdefectseveritychart?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneDefectSeverityChart(response);
					});

		}

		$scope.octaneDefectSeverityChart = function(response) {
			//remove "list_node.severity.high" --> high in DefectStatusVO
			debugger;

			$scope.result = response;

			var dataUrgent = [];
			var dataVery = [];
			var dataHigh = [];
			var dataMedium = [];
			var dataLow = [];
			var dates = [];

			//main Logic starts

			if ($scope.result.length != 0) {
				for (var i = 0; i < $scope.result.length; i++) {
					dataUrgent.push($scope.result[i].defUrgent);
					dataVery.push($scope.result[i].defVery);
					dataHigh.push($scope.result[i].defHigh);
					dataMedium.push($scope.result[i].defMedium);
					dataLow.push($scope.result[i].defLow);

					dates.push($scope.result[i].sprintName);
				}

			}

			var layoutColors = baConfig.colors;
			$('#octanedefseveritychart').remove(); // this is my <canvas> element
			$('#octanedefectdiv').append(
					' <canvas id="octanedefseveritychart"> </canvas>');

			var bar_ctx = document.getElementById('octanedefseveritychart');

			var bar_chart = new Chart(bar_ctx, {
				type : 'bar',
				data : {
					labels : dates,
					datasets : [ {
						label : 'Low',
						data : dataLow,
						backgroundColor : "rgba(236, 224, 0, 0.9)",
						hoverBackgroundColor : "rgba(236, 224, 0, 0.7)",
						hoverBorderWidth : 0
					}, {
						label : 'Medium',
						data : dataMedium,
						backgroundColor : "rgba(255, 199, 6, 0.9)",
						hoverBackgroundColor : "rgba(255, 199, 6, 0.7)",
						hoverBorderWidth : 0
					}, {
						label : 'High',
						data : dataHigh,
						backgroundColor : "rgba(255, 47, 47, 0.9)",
						hoverBackgroundColor : "rgba(255, 47, 47, 0.7)",
						hoverBorderWidth : 0
					}, {
						label : 'Very High',
						data : dataVery,
						backgroundColor : "rgba(213, 17, 27, 0.9)",
						hoverBackgroundColor : "rgba(213, 17, 33, 0.7)",
						hoverBorderWidth : 0
					}, {
						label : 'Urgent',
						data : dataUrgent,
						backgroundColor : "rgba(149, 0, 22, 0.9)",
						hoverBackgroundColor : "rgba(149, 0, 22, 0.7)",
						hoverBorderWidth : 0
					}, ]
				},
				options : {
					responsive : true,
					maintainAspectRatio : false,
					animation : {
						duration : 10,
					},
					tooltips : {
						enabled : true,
						mode : 'label'
					},
					scales : {
						xAxes : [ {
							barThickness : 88,
							stacked : true,
							scaleLabel : {
								display : true,
								fontColor : '#2c2c2c',
								labelString : 'Sprints'
							},
							ticks : {
								fontColor : '#2c2c2c'
							},
							gridLines : {
								color : "rgba(255,255,255,0.2)"
							},
						} ],
						yAxes : [ {
							stacked : true,
							scaleLabel : {
								display : true,
								fontColor : '#2c2c2c',
								labelString : 'Defect Count'
							},
							ticks : {
								beginAtZero : true,
								fontColor : '#2c2c2c'
							},
							gridLines : {
								color : "rgba(255,255,255,0.2)"
							},
						} ],
					},
					legend : {
						display : true,
						labels : {
							fontColor : '#000000',
							fontSize : 10
						}
					}
				}
			});
		}

		$scope.initOctaneDefectStatus = function() {
			//alert("defectPriority")
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getdefectstatuschart?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneDefectStatusChart(response);
					});

		}

		$scope.octaneDefectStatusChart = function(result) {
			//alert("defStatus");
			var restatus = result;

			var labels1 = [ "closed", "open", "new" ];
			var datapie = [];

			for (var i = 0; i < restatus.length; i++)
				datapie.push(restatus[i]);

			var layoutColors = baConfig.colors;
			$('#statuspie').remove(); // this is my <canvas> element
			$('#statuspiediv').append(' <canvas id="statuspie"> </canvas>');

			var ctx = document.getElementById('statuspie');
			var piechart = new Chart(ctx, {
				type : 'pie',
				data : {
					labels : labels1,
					datasets : [ {
						data : datapie,
						backgroundColor : [ "rgba(2, 206, 103, 0.7)",
								"rgba(255, 98, 98, 0.8)",
								"rgba(6, 217, 217, 0.8)",
								"rgba(255, 99, 132, 0.8)" ],
						borderColor : [ "rgba(2, 206, 103, 1)",
								"rgba(255, 98, 98, 1)", "rgba(6, 217, 217, 1)",
								"rgba(6, 217, 217, 1)" ],
						borderWidth : 1
					} ]
				},
				options : {
					responsive : true,
					maintainAspectRatio : false,
					pieceLabel : {
						render : 'value',
						fontColor : 'white'
					},

					legend : {
						display : true,
						position : 'bottom',
						labels : {
							fontColor : '#000000',
							boxWidth : 20,
							fontSize : 10
						}
					}
				}

			});
		}
		$scope.initOctaneDefectPriority = function() {
			var token = AES.getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/OctaneLifeCycleServices/getdefectprioritychart?dashboardName="
							+ dashboardName + "&projectName="
							+ $rootScope.selectedOctaneProject
							+ "&selectedSprint=" + $scope.sprintSel, config)
					.success(function(response) {
						$scope.octaneDefectPriorityChart(response);
					});

		}

		$scope.octaneDefectPriorityChart = function(response) {
			var prioresult = response;

			var labels1 = [];
			var dataUrg = [];
			var dataVhigh = [];
			var dataHigh = [];

			for (var i = 0; i < prioresult.length; i++) {

				labels1.push(prioresult[i].sprintName);

				dataUrg.push(prioresult[i].priorUrgent);
				dataVhigh.push(prioresult[i].priorVhigh);
				dataHigh.push(prioresult[i].priorHigh);
			}

			var layoutColors = baConfig.colors;
			$('#octanedefprioritychart').remove(); // this is my <canvas> element
			$('#octaneprioritydiv').append(
					' <canvas id="octanedefprioritychart"> </canvas>');

			var ctx = document.getElementById('octanedefprioritychart');
			var piechart = new Chart(ctx, {
				type : 'bar',
				data : {
					labels : labels1,
					datasets : [ {
						label : "Urgent",
						backgroundColor : "rgba(176, 0, 0, 0.7)",
						data : dataUrg
					}, {
						label : "Very High",
						backgroundColor : "rgba(0, 0, 202, 0.7)",
						data : dataVhigh
					}, {
						label : "High",
						backgroundColor : "rgba(232, 232, 0, 0.7)",
						data : dataHigh
					} ]
				},
				options : {
					responsive : true,
					maintainAspectRatio : false,
					animation : {
						duration : 10,
					},
					tooltips : {
						enabled : true,
						mode : 'label'
					},
					scales : {
						xAxes : [ {
							barPercentage : 1.0,
							categoryPercentage : 0.4,
							scaleLabel : {
								display : true,
								fontColor : '#2c2c2c',
								labelString : 'Sprints'
							},
							ticks : {
								fontColor : '#2c2c2c'
							},
							gridLines : {
								color : "rgba(255,255,255,0.2)"
							},
						} ],
						yAxes : [ {
							scaleLabel : {
								display : true,
								fontColor : '#2c2c2c',
								labelString : 'Priority Count'
							},
							ticks : {
								beginAtZero : true,
								fontColor : '#2c2c2c'
							},
							gridLines : {
								color : "rgba(255,255,255,0.2)"
							},
						} ],
					},
					legend : {
						display : true,
						labels : {
							fontColor : '#000000',
							fontSize : 10
						}
					}
				}
			});
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
		/*--------------------*/

	}

})();