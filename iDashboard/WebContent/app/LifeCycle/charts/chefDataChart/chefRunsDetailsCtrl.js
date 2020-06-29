/**
 * @author v.lugovksy created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.LifeCycle')
      .controller('chefRunsDetailsCtrl', chefRunsDetailsCtrl).filter('trimDesc',
  			function() {
			return function(value) {
				if (!angular.isString(value)) {
					return value;
				}
				return value.replace(/^\s+|\s+$/g, '');
			};
		});

  /** @ngInject */
 function chefRunsDetailsCtrl($sessionStorage, paginationService, AES, $element, $scope, $state, $base64, $http, $timeout, $uibModal,
		 $rootScope, baConfig, layoutPaths, localStorageService) {
	  
	$rootScope.sortkey = false;
	$rootScope.searchkey = false;
	$rootScope.menubar = false;
	
	 var dashboardName = localStorageService.get('dashboardName');
	  var owner = localStorageService.get('owner');

	// Refresh Node Details Page
	$scope.refreshNodeDetailsPage = function(){
		$scope.selectedCookbook = $sessionStorage.cookbookname;
		$rootScope.cookbookname = $sessionStorage.cookbookname;
		$scope.nodename=$sessionStorage.nodename;
		$rootScope.chefLastRunOnNodes = $sessionStorage.chefLastRunOnNodes;
		$scope.chefLastRunOnNodes = $sessionStorage.chefLastRunOnNodes;
		findLastRunDetailsForNode($scope.nodename, $scope.selectedCookbook);
 	};
 	
 	

	// Cookbook Names
	$scope.chefCookbookNamesData = function(){
	 	var token  = AES.getEncryptedValue();
        var config = {headers: {
        	'Authorization': token
        }};
        
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
 	    $http.get("rest/chefRunsServices/chefRunsCookbookNames?dashboardName="+dashboardName,config).success(function (response) {	
 	    	$rootScope.chefCookbookNames = response;
 		});
 		if (localStorageService.get('component')) {
 			var component = localStorageService.get('component')
 			// Will assign the selected job to dropdown
 			$rootScope.cookbookname = component.cookbookName;
 		} else {
 			// Will clear the selected job from dropdown
 			$rootScope.cookbookname = false;
 			$scope.selectedCookbook = false;
 		}

	    $scope.selectedCookbook = $rootScope.cookbookname;
		//$rootScope.cookbookname = $sessionStorage.cookbookname;
		setSelectedApplication($scope.selectedCookbook);
	};
	
	$scope.openNode = function(selectedRunOnNode) {
		$sessionStorage.nodename = selectedRunOnNode.nodename;
		$sessionStorage.starttime = selectedRunOnNode.starttime;
		$sessionStorage.cookbookname = selectedRunOnNode.cookbookname;
		$sessionStorage.status = selectedRunOnNode.status;
		$state.go('chefnodedetails');
		findLastRunDetailsForNode($sessionStorage.nodename, $sessionStorage.cookbookname);
	}

     $scope.changeSelectedCookbookHome = function (selectedCookbook) {
		$scope.selectedCookbook = selectedCookbook;
		$rootScope.cookbookname = selectedCookbook;
		$sessionStorage.cookbookname = selectedCookbook;
		chefRunsTableData(1, selectedCookbook);
	}

	$scope.getSelectedNodeDetails = function() {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.nodename=$sessionStorage.nodename;
		
	 	$http.get("rest/chefRunsServices/chefGetRunNodesData?nodename="+$scope.nodename+"+&dashboardName="+dashboardName,config).success(function (response) {
			$rootScope.chefNodeDetails = response;
			assignNodeDetails(response);
		}); 
	}

	function assignNodeDetails(data) {
		$scope.nodename = data.name;
		$scope.envname = data.envname;
		$scope.nodeplatform = data.platform;
		$scope.hostname = data.hostname;
		$scope.local_hostname = data.local_hostname;
		$scope.public_hostname = data.public_hostname;
		$scope.local_ipv4 = data.local_ipv4;
		$scope.public_ipv4 = data.public_ipv4;
		$scope.fqdn = data.fqdn;
		$scope.domain = data.domain;
		$scope.uptime = data.uptime;
		$scope.idletime = data.idletime;
	}

	function setSelectedApplication(selectedCookbook) {
		$scope.selectedCookbook = $rootScope.cookbookname;
		chefRunsTableData(1, $scope.selectedCookbook);
	}

     // Table details
	function chefRunsTableData(start_index, cookbookname){
	 	var token  = AES.getEncryptedValue();
        var config = {headers: {
        	'Authorization': token
        }};
        $scope.itemsPerPage = 5;
        $scope.start_index=start_index;
        $scope.cookbookname=cookbookname;
        var dashboardName = localStorageService.get('dashboardName');
  	  var owner = localStorageService.get('owner');
 	    $http.get("./rest/chefRunsServices/chefRunsTableDetails?itemsPerPage="+$scope.itemsPerPage+"&start_index="+$scope.start_index+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
 	    	$rootScope.chefRunsTableDetails = response;
 		});
 	    findLastRunDetails(cookbookname);
	};
		 
	// Find Last Cookbook Run On Nodes 
	function findLastRunDetails(selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};

		$scope.cookbookname=selectedCookbook;
	    $http.get("./rest/chefRunsServices/chefGetLastRunDetails?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			var listbuild = [];
			var icon = 'ion-close-round';
			var iconcolor = {"color":"red"};
			for( var i=0 ; i<response.length; i++){
				icon = 'ion-close-round';
				iconcolor = {"color":"red"};
				if(response[i].status == "success"){
					icon = 'ion-checkmark';
					iconcolor = {"color":"#58d68d"};
				}
				listbuild.push({
					runid : response[i].runid,
					cookbookname : response[i].cookbookname,
					nodename : response[i].nodename,
					starttime : response[i].starttime,
					status : response[i].status,
					icon : icon,
					iconcolor : iconcolor
				});
			};	
 	    	$rootScope.chefLastRunOnNodes = listbuild;
			$sessionStorage.chefLastRunOnNodes = $rootScope.chefLastRunOnNodes;
		});
	    findLastSuccessfulRunDetails(selectedCookbook);
	};
	
	// Find Last Cookbook Run On Nodes 
	function findLastRunDetailsForNode(selectedNode, selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};

		$scope.nodename=selectedNode;
		$scope.cookbookname=selectedCookbook;
	    $http.get("./rest/chefRunsServices/chefGetLastRunDetailsForNode?nodename="+$scope.nodename+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			var listbuild = [];
			var icon = 'ion-close-round';
			var iconcolor = {"color":"red"};
			for( var i=0 ; i<response.length; i++){
				icon = 'ion-close-round';
				iconcolor = {"color":"red"};
				if(response[i].status == "success"){
					icon = 'ion-checkmark';
					iconcolor = {"color":"#58d68d"};
				}
				listbuild.push({
					runid : response[i].runid,
					cookbookname : response[i].cookbookname,
					nodename : response[i].nodename,
					starttime : response[i].starttime,
					status : response[i].status,
					icon : icon,
					iconcolor : iconcolor
				});
			};	
 	    	$rootScope.chefLastRunOnNodesForNode = listbuild;
		});
	    findLastSuccessfulRunDetailsForNode(selectedNode,selectedCookbook);
	};
	
	// Find Last Cookbook Run On Nodes 
	function findLastSuccessfulRunDetails(selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};

		$scope.cookbookname=selectedCookbook;
	    $http.get("./rest/chefRunsServices/chefGetLastSuccessfulRunDetails?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			var listbuild = [];
			var icon = 'ion-close-round';
			var iconcolor = {"color":"red"};
			for( var i=0 ; i<response.length; i++){
				icon = 'ion-close-round';
				iconcolor = {"color":"red"};
				if(response[i].status == "success"){
					icon = 'ion-checkmark';
					iconcolor = {"color":"#58d68d"};
				}
				listbuild.push({
					runid : response[i].runid,
					cookbookname : response[i].cookbookname,
					nodename : response[i].nodename,
					starttime : response[i].starttime,
					status : response[i].status,
					icon : icon,
					iconcolor : iconcolor
				});
			};	
 	    	$rootScope.chefLastSuccessfulRunOnNodes = listbuild;
		});
	    totalCookbookRunsCount(selectedCookbook);
	};
	
	// Find Last Cookbook Run On Nodes 
	function findLastSuccessfulRunDetailsForNode(selectedNode, selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};

		$scope.nodename=selectedNode;
		$scope.cookbookname=selectedCookbook;
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		$http.get("./rest/chefRunsServices/chefGetLastSuccessfulRunDetailsForNode?nodename="+$scope.nodename+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			var listbuild = [];
			var icon = 'ion-close-round';
			var iconcolor = {"color":"red"};
			for( var i=0 ; i<response.length; i++){
				icon = 'ion-close-round';
				iconcolor = {"color":"red"};
				if(response[i].status == "success"){
					icon = 'ion-checkmark';
					iconcolor = {"color":"#58d68d"};
				}
				listbuild.push({
					runid : response[i].runid,
					cookbookname : response[i].cookbookname,
					nodename : response[i].nodename,
					starttime : response[i].starttime,
					status : response[i].status,
					icon : icon,
					iconcolor : iconcolor
				});
			};	
 	    	$rootScope.chefLastSuccessfulRunOnNodesForNode = listbuild;
		});
	    totalCookbooksCountForNode(selectedNode, selectedCookbook);
	};
	
	function totalCookbookRunsCount(selectedCookbook) {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/totalRunsCountForCookbook?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.totalcookbookrunscount = response; 
		});
		totalSuccessCount(selectedCookbook);
	}
	
	function totalCookbooksCountForNode(selectedNode, selectedCookbook) {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.nodename=selectedNode;
		$scope.cookbookname=selectedCookbook;
		var dashboardName = localStorageService.get('dashboardName');
		var owner = localStorageService.get('owner');
		$http.get("rest/chefRunsServices/chefGetSuccessfulCookbooksRunForNode?nodename="+$scope.nodename+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.chefcookbooksrunfornode = response;  
		});
		totalCookbookRunsCountForNode(selectedNode, selectedCookbook);
	}
	
	function totalCookbookRunsCountForNode(selectedNode, selectedCookbook) {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.nodename=selectedNode;
		$scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/totalRunsCountForCookbookForNode?nodename="+$scope.nodename+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.totalcookbookrunscountfornode = response;  
		});
		totalSuccessCountForNode(selectedNode, selectedCookbook);
	}
	
	function totalSuccessCount(selectedCookbook) {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/totalRunsSuccessCount?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.totalrunssuccesscount = response;  
		});
		//runsByStatusBarChart(selectedCookbook);
		runsByStatusMultipleBarChart(selectedCookbook);
	}
	
	function totalSuccessCountForNode(selectedNode, selectedCookbook) {
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$scope.nodename=selectedNode;
		$scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/totalRunsSuccessCountForNode?nodename="+$scope.nodename+"&cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.totalrunssuccesscountfornode = response;  
		});
	}

///////////////////	
	// Runs by Status Bar Chart
	
	$scope.runsBarChart = function(){
		$scope.selectedCookbook = $rootScope.cookbookname;
		runsByStatusBarChart($scope.selectedCookbook);
	}
 
	function runsByStatusBarChart(selectedCookbook) {
	
		var token  = AES.getEncryptedValue();
	    var config = {headers: {
	    	'Authorization': token
	    }};
	        	 
        $scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/runsbarchartdata?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {
			$scope.data = response; 
			$scope.statuschartnew($scope.data);
		});

		$scope.statuschartnew  = function(result){ 
			$scope.result = result;
			$scope.labels1 =[];
			$scope.data1 = [];
			$scope.labels1.push("Aborted");
			$scope.data1.push(0);

			for( var i=0 ; i<$scope.result.length; i++){
	 		    	
				if($scope.result[i].status == ""){
					$scope.result[i].status = "No Status";
				}
	 	    		
				$scope.labels1.push($scope.result[i].status);
				$scope.data1.push($scope.result[i].statusCnt);

				if($scope.result[i].status == "Aborted"){
					$scope.data1.push($scope.result[i].statusCnt);
				}
	 	        
			}
	 	        
			$scope.labels = $scope.labels1;
			$scope.data = $scope.data1;
	 	    	
			var layoutColors = baConfig.colors;   
	 	      
	 	
			$('#barchart').remove(); // this is my <canvas> element
			$('#bardiv').append(' <canvas id="barchart" style="width:500px; height:250px; margin-top:30px"> </canvas>');
			var ctx = document.getElementById("barchart");
			var myChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: $scope.labels1,
					datasets: [{
						data: $scope.data1,
						backgroundColor : ["rgba(54, 162, 235, 0.8)", 
							"rgba(153, 102, 255, 0.8)",
							"rgba(75, 192, 192, 0.8)",
							"rgba(255, 159, 64, 0.8)",
							"rgba(255, 99, 132, 0.8)",
							"rgba(255, 206, 86, 0.8)",
							"#835C3B" ],
	 	                                   
						borderColor: [
	 						"rgba(54, 162, 235, 1)", 
	 						"rgba(153, 102, 255, 1)",
	 						"rgba(75, 192, 192, 1)",
	 						"rgba(255, 159, 64, 1)",
	 						"rgba(255, 99, 132, 1)",
	 						"rgba(255, 206, 86, 1)",
	 						"#835C3B"
	 						],
	 						borderWidth: 1
					}]
				},
				options: {
					tooltips : {
						enabled: true      
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							},
							gridLines: {
								color: "rgba(255,255,255,0.2)"
							}   
						}],
	 	                    
						xAxes: [{
							gridLines: {
								color: "rgba(255,255,255,0.2)"			                             
							}   
						}]
					}
				}
			});
		};
		runsOnEachNodeFunnelChart(selectedCookbook);
	}
	 
///////////////////////
	// Runs by Status Multi Bar Chart
	
	$scope.runsMultipleBarChart = function(){
		$scope.selectedCookbook = $rootScope.cookbookname;
		runsByStatusMultipleBarChart($scope.selectedCookbook);
	}
 
	function runsByStatusMultipleBarChart(selectedCookbook) {
		var token  = AES.getEncryptedValue();
	    var config = {headers: {
	    	'Authorization': token
	    }};
	        	 
        $scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/runsmultibarchartdata?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {
			$scope.data = response; 
			if(response.length != 0){ 
				$scope.multibarChart($scope.data);}
		    else{
		    	$('#barchart').remove(); // this is my <canvas> element
		    	$('#bardiv').append('<div id="barchart"></div>');
		    }
		});
		
		$scope.multibarChart = function(data){
			$scope.data = data;
			$scope.bardata = [];
			for(var i=0; i<$scope.data.length; i++){
				$scope.metrics = ["Dev", "QA"];
				if($scope.data[i].metrics == null){
					metrics:$scope.data[i].metrics = $scope.metrics[i];
				}
				$scope.bardata.push({metrics:$scope.data[i].metrics,
					a:$scope.data[i].abortedCount,
					b:$scope.data[i].failureCount,
					c:$scope.data[i].successCount
				});
			}
			$scope.barData = $scope.bardata;
			$scope.drawchart($scope.barData)
		}
			
		$scope.drawchart = function(barData){	
			$scope.barData = barData;
			$('#barchart').empty();
			var	bar = Morris.Bar({
				data : $scope.barData,
				element : 'barchart',
				xkey: 'metrics',
				ykeys: ['a', 'b', 'c'],
				labels: ['Aborted', 'Failure', 'Success'],
				barColors:["rgba(75, 192, 192, 0.8)","rgba(255, 99, 132, 0.8)","rgba(54, 162, 235, 0.8)"],
				resize: true,
				redraw: true,
				fillOpacity: 0.6,
				pointFillColors:['#ffffff'],
				pointStrokeColors: ['black'],
				lineColors:['gray','red'],
				gridTextColor : '#4C4C4C',
				labelFontColor: "#4C4C4C"
			});
			$("#barchart").css("height","400");
			bar.redraw();
			$(window).resize(function() {
				window.bar.redraw();
			});
		}
		runsOnEachNodeFunnelChart(selectedCookbook);
	}

///////////////////////////
	
	$scope.runsFunnelChart = function(){
		$scope.selectedCookbook = $rootScope.cookbookname;
		runsOnEachNodeFunnelChart($scope.selectedCookbook);
	}
	 
	// Runs on Nodes Funnel Chart - Dashboard
	function runsOnEachNodeFunnelChart(selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};

		$scope.cookbookname=selectedCookbook;
		$http.get("rest/chefRunsServices/runsOnEachNodeChartData?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {
			$scope.data = response; 
			if($scope.data.length !=0){	
				$scope.funnel($scope.data);
			}
			else {
				$('#my-funnel').remove(); // this is my <canvas> element
				$('#funneldiv').append(' <canvas id="my-funnel" width="400px" height="300px" style="margin-top:40px;margin-left:120px"> </canvas>');
			}
		}
		);
		
		$scope.funnel = function(result) {
			$scope.result = result;
			$scope.labels1 =[];
			$scope.data1 = [];
			$scope.backgroundColor =[];
			$scope.borderColor=[];
			for( var i=0 ; i<$scope.result.length; i++) {
				if($scope.result[i].nodename == "") {
					$scope.result[i].nodename = "No Node"; 
				}
				if($scope.result[i].nodename == "No Node"){
					$scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
					$scope.borderColor.push("rgba(54, 162, 235, 1)");
				}
				if($scope.result[i].nodename == "node1ubuntu"){
					$scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
					$scope.borderColor.push("rgba(75, 192, 192, 1)");
				}
				if($scope.result[i].nodename == "node1windows"){
					$scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
					$scope.borderColor.push("rgba(153, 102, 255, 1)");
				}
				$scope.labels1.push($scope.result[i].nodename);
				$scope.data1.push($scope.result[i].nodeCnt);
			}		    	
			$scope.labelsfunnel = $scope.labels1;
			$scope.datafunnel = $scope.data1;
			  
			FunnelChart('my-funnel', {
				values: $scope.datafunnel,
				labels: $scope.labelsfunnel,
				displayPercentageChange: false,
				sectionColor: ["rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)"],
				
				labelFontColor: "#4C4C4C" //"rgba(255, 255, 255, 0.8)"
			});
		};
		runsTrendChart(selectedCookbook);

	}
	
	$scope.runsLineChart = function(){
		$scope.selectedCookbook = $rootScope.cookbookname;
		runsTrendChart($scope.selectedCookbook);
	}
 
 /////////////////////
  
 	/* Runs Trend Chart */

	function runsTrendChart(selectedCookbook){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
	    $scope.cookbookname=selectedCookbook;
		$http.get("./rest/chefRunsServices/runstrendchartdata?cookbookname="+$scope.cookbookname+"&dashboardName="+dashboardName,config).success(function (response) {
			$scope.data = response; 
			$scope.linechart($scope.data);
		}) ;			
		$scope.linechart = function(lineresult){
		   	$scope.lineresult = lineresult;
		   	$scope.labels = [];
		   	$scope.data = [];
		   	$scope.series =[];
		    	
		   	$scope.success=[];
		   	$scope.failure=[];
		   	$scope.aborted=[];
		   	$scope.nostatus=[];

		   	var text;
		   	for(var i=0; i<$scope.lineresult.length; i++){
		    		
		    	$scope.labels.push($scope.lineresult[i].mydate);
		    	
		    	$scope.success.push($scope.lineresult[i].success);
		    	$scope.failure.push($scope.lineresult[i].failure);
		    	$scope.aborted.push($scope.lineresult[i].aborted);
		    	$scope.nostatus.push($scope.lineresult[i].nostatus);
		   	}
		    $scope.data=[$scope.success, $scope.failure, $scope.aborted, $scope.nostatus];
		    
		    	var config = {
				type: 'line',
			 
				data: {
					labels: $scope.labels,
					datasets: [{
						data:$scope.success,
						label: "Success",
						borderColor: "rgba(67, 154, 213, 0.7)", 
					},
					{
						data:$scope.failure,
						label: "Failure",
						borderColor: "#835C3B", 
					},
					{
						data:$scope.aborted,
						label: "Aborted",
						borderColor: "rgb(255,165,0, 0.8)", 
					},
					{
						data:$scope.nostatus,
						label: "No Status",
						borderColor: "rgba(255, 159, 64, 0.8)", 
					}
					]
				},
				options: {
					scales: {
						xAxes: [{
							type: "time",
							scaleLabel : {
								display : true,
								labelString : 'Time Period'
							},
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
							gridLines: {
								color: "#e3e5e6"//"rgba(255,255,255,0.2)",
							},
							ticks : {
								beginAtZero: true,
								fontColor: '#4c4c4c'}
						}],
						yAxes: [{
							scaleLabel : {
								display : true,
								labelString : 'Number of Deployments',
								fontColor: '#4c4c4c'
							},
					
							gridLines: {
								color: "#e3e5e6" //"rgba(255,255,255,0.2)",
							},
							 ticks : {
									beginAtZero: true,
									fontColor: '#4c4c4c'}
						}]
					},
					pan: {
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
					}
				}
			}
			$('#line').remove(); // this is my <canvas> element
			$('#linediv').append('<canvas id="line" height="75"> </canvas>');		    	
			var ctx = document.getElementById("line");
				window.line = new Chart(ctx, config);
			}
		} 
		      
	// Total Runs count details
	$scope.totalRunsCount=function(){
		var token  = AES.getEncryptedValue();
		var config = {headers: {
			'Authorization': token
		}};
		$http.get("rest/chefRunsServices/totalRunsCount?dashboardName="+dashboardName,config).success(function (response) {	
			$rootScope.totalrunscount = response;  
		});
	}
		  		        
 	//var vm = this;
 	//vm.total_count = 0;
 	//$scope.itemsPerPage = 5; 


////////////////
	 
	 // Nodes by OS donut chart	  
	$scope.nodesByOSPieChart=function(){
	 var token  = AES.getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    
        	 $http.get("rest/chefNodeServices/nodespiechartdata?dashboardName="+dashboardName+"&owner="+owner,config).success(function (response) {
		 		    $scope.data = response; 
		 		    $scope.oschartnew($scope.data);
	  }) ;
        $scope.oschartnew  = function(result){ 
	    $scope.result = result;
        $scope.labels1 =[];
        $scope.data1 = [];
        $scope.backgroundColor=[];
        $scope.borderColor=[];
        for( var i=0 ; i<$scope.result.length; i++){
    		 if($scope.result[i].os == ""){$scope.result[i].os = "No os"; }
    		 
    		 if($scope.result[i].os == "No os"){
    			 $scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
    			 $scope.borderColor.push("rgba(54, 162, 235, 1)");
    		 }
    		 if($scope.result[i].os == "linux"){
    			 $scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
    			 $scope.borderColor.push("rgba(75, 192, 192, 1)");
    		 }
    		 if($scope.result[i].os == "windows"){
    			 $scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
    			 $scope.borderColor.push("rgba(153, 102, 255, 1)");
    		 }
    		 if($scope.result[i].os == "ios"){
    			 $scope.backgroundColor.push("rgba(255, 206, 86, 0.8)");
    			 $scope.borderColor.push("rgba(255, 206, 86, 1)");
    		 }
    		 if($scope.result[i].os == "mvs"){
    			 $scope.backgroundColor.push("rgba(255, 159, 64, 0.8)");
    			 $scope.borderColor.push("rgba(255, 159, 64, 1)");
    		 }
    		 if($scope.result[i].os == "Marshmallow"){
    			 $scope.backgroundColor.push("rgba(255, 99, 132, 0.8)");
    			 $scope.borderColor.push("rgba(255, 99, 132, 1)");
    		 }
    		 $scope.labels1.push($scope.result[i].os);
    		 $scope.data1.push($scope.result[i].osCnt);
        }	
    	$scope.labelspie = $scope.labels1;
    	$scope.datapie = $scope.data1;
        var layoutColors = baConfig.colors;  
        $('#doughnut').remove(); // this is my <canvas> element
	 	  $('#doughnutdiv').append('<canvas id="doughnut" style="margin-top:40px; margin-left:100px;">'); 
        var ctx = document.getElementById("doughnut");
        var doughnut = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: $scope.labelspie,
                datasets: [{
                data: $scope.datapie,
                backgroundColor : $scope.backgroundColor,
				borderColor: $scope.borderColor,
                    borderWidth: 1
                }]
            },
            
        }); };
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
