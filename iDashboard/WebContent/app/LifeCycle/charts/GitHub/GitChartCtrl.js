/**
* @author v.lugovsky created on 16.12.2015
*/
(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller(
			'GitChartCtrl', GitChartCtrl);

	/** @ngInject */
	function GitChartCtrl($scope, $rootScope, AES, $state, $http, $timeout,
			baConfig, $element, layoutPaths,$base64,localStorageService) {
		/*function AES.getEncryptedValue()
		  {
			 var username= localStorageService.get('userIdA');
		     var password= localStorageService.get('passwordA');
		        var tokeen =$base64.encode(username+":"+password);
		        
		        return tokeen;
		        }*/
		$rootScope.loggedInuserId=localStorageService.get('loggedInuserId');
		
		//check if component is available
		if (localStorageService.get('component')) {
			if($rootScope.selectedtype == null && $rootScope.UserName == null && $rootScope.selectedRepo == null || $rootScope.selectedtype == false) {

			// Will assign the selected to dropdown
			var values = localStorageService.get('component');
		
			$rootScope.selectedtype = values.gitType;
			$rootScope.UserName = values.gitName;
			$rootScope.selectedRepo = values.gitRepo;
			} 
		}
		else if($rootScope.selectedtype == "" || $rootScope.selectedtype == null) {
			//alert("selectedGit "+$rootScope.selectedtype);
			$rootScope.selectedtype = false;
			$rootScope.UserName = false;
			$rootScope.selectedRepo = false;
			
		}
		else
		{
			// Will clear the selected job from drop down when clicked on "create new"
			$rootScope.selectedtype = false;
			$rootScope.UserName = false;
			$rootScope.selectedRepo = false;
			
		}
		
		$scope.getvalues=function(){
			$rootScope.selectedtype;
			$rootScope.UserName;
			$rootScope.selectedRepo;
		}

		
		// Types dropdown
	/*	$scope.types = ['User','Organization'];*/
		
		$scope.settype=function(){
			var token  = AES.getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
		$http.get("rest/gitServices/getGitTypes",config).success(function (response) {
			$scope.types = response; 
		});
	}
		
		// Get selected type and generate gitname list
		$scope.getusertype=function(selectedtype){
			var token  = AES.getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
			$rootScope.selectedtype = selectedtype;
		$http.get("rest/gitServices/getGitDashboardNames?type="+$rootScope.selectedtype,config).success(function (response) {
			$scope.gitnames = response; 
		});
	}
		 // Get RepoList based on git name
		 $scope.getRepoList = function(UserName){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $rootScope.UserName = UserName;
			 $http.get("rest/gitServices/getRepoList?UserName="+UserName,config).success(function (response) {
					$scope.repos = response; 
			 });		 }
		 
		// Get selected repo 
		$scope.getSelectedRepo = function(selectedRepo){
			$rootScope.selectedRepo = selectedRepo;
		}
		
		// Get contribuitor list for trend 
		
		 $scope.getcontributor = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $http.get("rest/gitServices/getCommitUser?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
					$scope.contributedrops = response; 
					 $scope.timeperioddrops = ["Last 15 days", "Last 30 days", "Last 90 days", "Last 180 days", "Last 365 days"];

			 }); 
		 }
		 
		 $scope.gettimeperiod = function(){
			 $scope.timeperioddrops = [];
		 }
		
		 $scope.getcontributorselection = function(committer){
			 localStorageService.set('committer',committer);
			 $rootScope.committer = localStorageService.get('committer');
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $http.get("rest/gitServices/commitswithfilter?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo+"&committer="+$rootScope.committer+"&timeperiod="+$rootScope.timeperiod,config).success(function (response) {
				 $scope.commitdetails = response; 
				 $scope.drawChart($scope.commitdetails);
			 });  
		 }
		
		 $scope.gettimeperiodselection = function(timeperiod){
			 localStorageService.set('timeperiod',timeperiod);
			 $rootScope.timeperiod = localStorageService.get('timeperiod');
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $http.get("rest/gitServices/commitswithfilter?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo+"&committer="+$rootScope.committer+"&timeperiod="+$rootScope.timeperiod,config).success(function (response) {
				 $scope.commitdetails = response; 
				 $scope.drawChart($scope.commitdetails);
			 });  
		 }
		/*// Create page display table details
		$scope.getDashboardDetails = function(type,UserName,Password){
			$rootScope.UserName = UserName;
			$rootScope.Password = Password;
			$http.get("rest/gitServices/getGitDashboardDetails?type="+type+"&UserName="+UserName).success(function (response) {
				$scope.gitDashDetails = response; 
		 });
		}*/
		
		// Open page on click on 'View more metrics'
		 $scope.open = function(UserName){
			 $state.go('viewgitdashboard');
			 $scope.getvalues();
		 }
		
		
		
		 // Get selected repository
		 $scope.selectedRepository = function(){
			 $rootScope.timeperiod = 0;
			 $scope.getfilesize();
			 $scope.commitscount();
			 $scope.contributorscount();
			 $scope.watcherscount();
			 $scope.starscount();
			 $scope.pullrequest();
			 $scope.pullrequest();
			 $scope.issuecount();
			 $scope.topcontributorscount();
			 $scope.commitTrend();
		 }
		 
		 // File count ba-panel
		 $scope.getfilesize = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $http.get("rest/gitServices/getFileSize?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
					$scope.filesize = response/1024; 
			 }); 
		 }
		 
		 // Commits count ba-panel
		 $scope.commitscount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/CommitCount?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.commitcount = response; 
				 }); 
		 }

		 // Contributors count ba-panel
		 $scope.contributorscount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/ContributorsCount?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.contributorcount = response; 
				 });  
		 }
		 
		 // Watchers count ba-panel
		 $scope.watcherscount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/WatchersCount?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.watchers = response; 
				 });  
			 }

		
		 // Stars count ba-panel
		 $scope.starscount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/StarsCount?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.stars = response; 
				 });  
			 }
			 
		 
	// Pull request progress bar	 
		 
		 $scope.pullrequest = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
		
				 $http.get("rest/gitServices/pullrequest?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.pulls = response; 
						$scope.mergedinpercentage = Math.round((($scope.pulls[0]-$scope.pulls[1])/$scope.pulls[0]) * 100);
						$scope.proposedinpercentage = Math.round(100 - $scope.mergedinpercentage);
						if($scope.mergedinpercentage == 0 && $scope.proposedinpercentage == 100){
							$scope.mergedinpercentage =100;
							$scope.proposedinpercentage = 0;
						}
				 });  
			 }

		 // Issues progress bar 
		 
		 $scope.issuecount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/Issues?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
						$scope.issues = response; 
						$scope.closedissuepercentage = Math.round(($scope.issues[1] / $scope.issues[0]) *100);
						$scope.newissuepercentage = Math.round(100 - $scope.closedissuepercentage);
						
				 });  
			 }

		 
		 $scope.topcontributorscount = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/topcontributors?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
					 $scope.feed = response; 
				 });  
			 }
		 
		 $scope.commitTrend = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
				 $http.get("rest/gitServices/commits?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
					 $scope.commitdetails = response; 
					 $scope.drawChart($scope.commitdetails);
				 });  
			 
			$scope.drawChart = function(data) {
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for(var i=0; i<$scope.data.length; i++){
					$scope.labeldate.push($scope.data[i].commitdate);
					
					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					    type: 'line',
					    data:{labels: $scope.labeldate,
					        datasets: [{
					            data: $scope.graphdata,
					            borderWidth: 1,
					            borderColor: 'rgb(67, 204, 194)',
					        }]
					    },
			  		 	options: {
			  		 		responsive : true,
							maintainAspectRatio : false,
			  		  		scales: {
			  		  		 xAxes: [{
			  		  		   type: "time",
			  		  		   time: {
			  		  		       displayFormats: {
			  		  		         millisecond: "SSS [ms]",
			  		  		         second: "h:mm:ss a",
			  		  		         minute: "h:mm:ss a",
			  		  		         hour: "MMM D, hA",
			  		  		         day: "ll",
			  		  		         week: "ll",
			  		  		         month: "MMM YYYY",
			  		  		         quarter: "[Q]Q - YYYY",
			  		  		         year: "YYYY"
			  		  		       },
			  		  		       tooltipFormat: "D MMM YYYY",
			  		  		       unit: "month"
			  		  		     },
			  		  		 scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor: '#4c4c4c'
								},
			  		  		     gridLines: {
			  		  		         color: "#d8d3d3",
			  		  		     },
			  		  		 ticks: {
		  		  	             fontColor: '#4c4c4c'
		  		  	         }
			  		  		 }],
			  		  		 yAxes: [{
			  		  		     gridLines: {
			  		  		         color: "#d8d3d3",
			  		  		     },
			  		  		 scaleLabel : {
									display : true,
									labelString : 'Number of Commits',
									fontColor: '#4c4c4c'
								},
			  		  		     ticks: {
			  		  	             beginAtZero:true,
			  		  	             fontColor: '#4c4c4c'
			  		  	         }
			  		  		 }]

			  		  		},
			  		  /*		pan: {
			  		  		   // Boolean to enable panning
			  		  		   enabled: true,

			  		  		   // Panning directions. Remove the appropriate direction to disable
			  		  		   // Eg. 'y' would only allow panning in the y direction
			  		  		   mode: 'x'
			  		  		},

			  		  		// Container for zoom options
			  		  		zoom: {
			  		  		   // Boolean to enable zooming
			  		  		   enabled: true,

			  		  		   // Zooming directions. Remove the appropriate direction to disable
			  		  		   // Eg. 'y' would only allow zooming in the y direction
			  		  		   mode: 'x',
			  		  		}*/
			  		  		}
					}; 

		$('#commitsubdiv').remove(); // this is my <canvas> element
	  $('#commitdiv').append(' <canvas id="commitsubdiv" height="100"> </canvas>'); 

	  var ctx = document.getElementById("commitsubdiv");
	  window.commitsubdiv = new Chart(ctx, config);
			 }	 

		 }
		 
		 $scope.weeklyCommitTrend = function(){
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			 $http.get("rest/gitServices/weeklycommits?type="+$rootScope.selectedtype+"&user="+$rootScope.UserName+"&repo="+$rootScope.selectedRepo,config).success(function (response) {
				 $scope.weeklycommitdetails = response; 
				 $scope.drawChart($scope.weeklycommitdetails);
			 });  
		 
		$scope.drawChart = function(data) {
			$scope.data = data
			
			$scope.labeldate = [];
			$scope.graphdata = [];
			for(var i=0; i<$scope.data.length; i++){
				$scope.labeldate.push($scope.data[i].commitdate);
				
				$scope.graphdata.push($scope.data[i].count);
			}
			
			var config = {
				    type: 'bar',
				    data:{labels: $scope.labeldate,
				        datasets: [{
				            data: $scope.graphdata,
				            borderWidth: 1,
				            borderColor: 'rgb(198, 108, 47)',
				            backgroundColor: 'rgb(198, 108, 47)'
				        }]
				    },
		  		 	options: {
		  		  		
		  		  		scales: {
		  		  		 xAxes: [{
		  		  		   type: "time",
		  		  		   time: {
		  		  		       displayFormats: {
		  		  		         millisecond: "SSS [ms]",
		  		  		         second: "h:mm:ss a",
		  		  		         minute: "h:mm:ss a",
		  		  		         hour: "MMM D, hA",
		  		  		         day: "ll",
		  		  		         week: "ll",
		  		  		         month: "MMM YYYY",
		  		  		         quarter: "[Q]Q - YYYY",
		  		  		         year: "YYYY"
		  		  		       },
		  		  		       categorySpacing: 10,
		  		  		       tooltipFormat: "D MMM YYYY",
		  		  		       unit: "day"
		  		  		     },
		  		  		     gridLines: {
		  		  		         color: "#d8d3d3",
		  		  		     },
		  		  		 ticks: {
		  		  			fontColor: '#4c4c4c'
		  		  		 }
		  		  		 }],		  		  		 yAxes: [{
		  		  		     gridLines: {
		  		  		         color: "#d8d3d3",
		  		  		     },
		  		  		     ticks: {
		  		  	             beginAtZero:true,
		  		  	             fontColor: '#4c4c4c',
		  		  	             stepSize: 5,
		  		  	             min: 0,
		  		  	             max: 20
		  		  	         }
		  		  		 }]

		  		  		},
		  		  	tooltips : {
	                    enabled: true ,
	                    callbacks: {
	                        label: function(tooltipItem) {
	                            return "" + Number(tooltipItem.yLabel) + "commits";
	                        }
	                    }
	                },
		  		  		
		  		  		}
				}; 

	$('#weekcommitsubdiv').remove(); // this is my <canvas> element
  $('#weekcommitdiv').append('<canvas id="weekcommitsubdiv">'); 

  var ctx = document.getElementById("weekcommitsubdiv");
  window.weekcommitsubdiv = new Chart(ctx, config);
		 }	 

	 }
		 
		 
//Back Button Functionality
		 
		 $scope.back=function(){
			 
			 //alert("Back button");
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
