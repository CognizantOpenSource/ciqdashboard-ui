(function() {
	'use strict';

	angular.module('MetricsPortal.LifeCycle').controller(
			'testManagementCtrl', testManagementCtrl);

	/** @ngInject */

	function testManagementCtrl($scope, AES, $state, buildData, baConfig,localStorageService,
			$element, $rootScope, $sessionStorage, layoutPaths, $base64, $http,$timeout,$uibModal) {
	
		  $rootScope.menubar = false;
		  $rootScope.sortkey = false;
		  $rootScope.searchkey = false;
		  $rootScope.loggedInuserId=localStorageService.get('loggedInuserId');
		  
		$scope.open = function() {
			$state.go('testMgmtMetrics');

		};
		
		/* DROP DOWN CODE START HERE*/
		if (localStorageService.get('component')) {
			// Will assign the selected to dropdown
			var almvalues = localStorageService.get('component');
			$rootScope.selecteddomain = almvalues.domainName;
			$rootScope.selectedproject = almvalues.projectName;
			$rootScope.selectedrelease = almvalues.releaseName;
		} 
		else{
			$rootScope.selecteddomain = false;
			$rootScope.selectedproject = false;
			$rootScope.selectedrelease = false;
			
		}
		
		$scope.getvalues=function(){
			$rootScope.selecteddomain;
			$rootScope.selectedproject;
			$rootScope.selectedrelease;
		}
		
		
		// Get selected repository
		 $scope.selectedDetails = function(){
			 $scope.testExeStatusPie();
			 $scope.newSeverityChart();
			 $scope.reqPrioirtyFunnelChart();
			 $scope.designTypeChart();

		 }

		// Get Domain List
			$scope.setdomain=function(){
			
				var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
			$http.get("./rest/almServicess/getdomains",config).success(function (response) {
				$scope.domains = response; 
			});
		}
			
		// Get Project List
		$scope.getproject=function(selecteddomain){
		var token  = AES.getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
		$rootScope.selecteddomain = selecteddomain;
		$http.get("./rest/almServicess/getproject?level1="+$rootScope.selecteddomain,config).success(function (response) {
		$scope.projects = response; 
		});
	 }
		
		// Get Release List
		$scope.getrelease=function(selectedproject){
		var token  = AES.getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
		$rootScope.selectedproject = selectedproject;
		$http.get("./rest/almServicess/getreleaselist?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject,config).success(function (response) {
		$scope.releases = response; 
		});
	 }
		
		// Get selected release 
		$scope.getSelectedRelease = function(selectedrelease){
			$rootScope.selectedrelease = selectedrelease;
		}
		
			
		/* DROP DOWN CODE END HERE*/
		
		//Design Status by Count
		$scope.newStatusChart=function(){

	 		var token  = AES.getEncryptedValue();
	 		      var config = {headers: {
	 		              'Authorization': token
	 		              }};
	 			$http.get("rest/almServicess/designstatuschartdata?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
	 			$scope.data = response; 
				$scope.tcstatuschart($scope.data);	
					
		 		
		 	});
	 		
		     $scope.tcstatuschart  = function(result){ 
		    	 $scope.result = result;
	        $scope.labels1 =[];
	        $scope.data1 = [];
	       
	        for( var i=0 ; i<$scope.result.length; i++){
	        	if($scope.result[i].testDesignStatus == ""){
		    			$scope.result[i].testDesignStatus = "No Status";
		    			}
	    		 $scope.labels1.push($scope.result[i].testDesignStatus);
	    		 $scope.data1.push($scope.result[i].statuscount);
	  }	
	    	$scope.labelspie = $scope.labels1;
	    	$scope.datapie = $scope.data1;
	        var layoutColors = baConfig.colors;  
	        $('#piechart').remove(); 
	        $('#piechartdiv').append('<canvas id="piechart" width="200" height="200" style="margin-top:20px; margin-left:120px"></canvas>'); 

	        var ctx = document.getElementById("piechart");
	        var piechart = new Chart(ctx, {
	            type: 'pie',
	            data: {
	                labels: $scope.labelspie,
	                datasets: [{
	                data: $scope.datapie,
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
	            
	        }); };
	 	}
		
		
		 // Defect By Severity Chart
	 	$scope.newSeverityChart=function(){
	 		var token  = AES.getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	 		
	 			 $http.get("rest/almServicess/defectsseveritychartdata?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
	 			 	$scope.data = response; 
	 			 	if($scope.data.length !=0){
	 			 	$scope.severitychart($scope.data);}
	 			 	else{
	 			 		 $('#tmdefectseverity').remove(); // this is my <canvas> element
   				 	  $('#tmseveritydiv').append('<canvas id="tmdefectseverity"> </canvas>'); 	
	 			 	}
	 		 }) ;
	 		
				     
				     $scope.severitychart  = function(result){ 
				    	 $scope.result = result;
			        $scope.labels1 =[];
			        $scope.data1 = [];
			       
			        for( var i=0 ; i<$scope.result.length; i++){
			        	if($scope.result[i].severity == ""){
		 	    			$scope.result[i].severity = "No Severity";
		 	    			}
			    		 $scope.labels1.push($scope.result[i].severity);
			    		 $scope.data1.push($scope.result[i].severityCnt);
			  }	
			    	$scope.labelspie = $scope.labels1;
			    	$scope.datapie = $scope.data1;
			        var layoutColors = baConfig.colors;  
			        	   $('#tmdefectseverity').remove(); // this is my <canvas> element
			        				 	  $('#tmseveritydiv').append('<canvas id="tmdefectseverity" style="width:400px ; height:200px; margin-top:0px;margin-left:10px"> </canvas>'); 

			        var ctx = document.getElementById("tmdefectseverity");
			        var tmdefectseverity = new Chart(ctx, {
			            type: 'doughnut',
			            data: {
			                labels: $scope.labelspie,
			                datasets: [{
			                data: $scope.datapie,
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
			            	 responsive: true,
			            	 maintainAspectRatio: false,
				            	pieceLabel: {
				            	    render: 'value',
				            	    fontColor:'#4c4c4c'
				            	  },
				            	  
				            	  legend: {
				                      display: true,
				                      position: 'bottom',
				                      labels: {
				                    	   fontColor: '#4c4c4c',
				                    	   boxWidth : 7,
				                    	   fontSize : 10
				                      }
				                  }
			            }
			            
			        }); }; 
		  
	 	} 
	 	
	 	
		   // Requirements by Status Chart
		 $scope.reqStatusChart=function(){
		
			 var token  = AES.getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
		        	 
				    $http.get("rest/almServicess/reqbarchartdata?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
					  $scope.data = response; 
					  $scope.statuschartnew($scope.data);
				    });

		         $scope.statuschartnew  = function(result){ 
		 		    $scope.result = result;
		 	        $scope.labels1 =[];
		 	        $scope.data1 = [];
		 	        for( var i=0 ; i<$scope.result.length; i++){
		 		    	
		 	    		if($scope.result[i].status == ""){
		 	    			$scope.result[i].status = "No Status";
		 	    			}
		 	    			$scope.labels1.push($scope.result[i].status);
		 	    		
		 	    			$scope.data1.push($scope.result[i].statusCnt);
		 	    				    	}
		 	    	$scope.labels = $scope.labels1;
		 	    	$scope.data = $scope.data1;
		 	    	
		 	    	
		 	        var layoutColors = baConfig.colors;   
		 	      
		 	      
		 	
		 	   $('#barchart').remove(); // this is my <canvas> element
		 	  $('#bardiv').append(' <canvas id="barchart" style="width:400px ; height:250px; margin-top:30px;margin-left:10px"> </canvas>');
		 
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
			            	responsive: true,
							maintainAspectRatio : false,
		            	hover : {
	 	            		animationDuration : 0
	 	            	}, 
			           	 "animation": {
			           	    "duration": 1,
			           	    "onComplete": function() {
			           	        var chartInstance = this.chart,
			           	            ctx = chartInstance.ctx;

			           	        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
			           	        ctx.textAlign = 'center';
			           	        ctx.textBaseline = 'bottom';

			           	        this.data.datasets.forEach(function(dataset, i) {
			           	            var meta = chartInstance.controller.getDatasetMeta(i);
			           	            meta.data.forEach(function(bar, index) {
		 	            	            var meta = chartInstance.controller.getDatasetMeta(i);
		 	            	            meta.data.forEach(function(bar, index) {
		 	            	                //This below lines are user to show the count in TOP of the BAR
		 	            	            	/*var data = dataset.data[index];
		 	            	                ctx.fillText(data, bar._model.x, bar._model.y - 5);*/ 
		 	            	            	
		 	            	            	//This below lines are user to show the count in CENTER of the BAR
		 	            	            	if(dataset.data[index] != 0){
												var data = dataset.data[index];}
												else{
													var data="";	
												}
												var centerPoint = bar.getCenterPoint();
											    ctx.fillText(data, centerPoint.x, centerPoint.y-2);
		 	            	            });
		 	            	        });
			           	        });
			           	    }
			           	},
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
			                            barThickness : 40,
			                            gridLines: {
			                                color: "rgba(255,255,255,0.2)"
			                            }
			                        }]
			                    
			                }
			            }
		 	        });
		 	    
		 		 	   };
		 	}
		 
		 
			// Requirement Priority Funnel Chart - Dashboard
		  
			$rootScope.reqPrioirtyFunnelChart=function(){
				 var token  = AES.getEncryptedValue();
			        var config = {headers: {
			                'Authorization': token
			                }};
			
					$http.get("rest/almServicess/reqprioritychartdata?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
						$scope.data = response; 
						if($scope.data.length !=0){	
						$scope.funnel($scope.data);}
						else{
							 $('#my-funnel').remove(); // this is my <canvas> element
						 	  $('#funneldiv').append(' <canvas id="my-funnel" height="300" style="margin-top:40px;margin-left:100px"> </canvas>');
						}
					}) ;			
				
				  $scope.funnel = function(result){
					  
					  $scope.result = result;
				        $scope.labels1 =[];
				        $scope.data1 = [];
				        $scope.backgroundColor =[];
				        $scope.borderColor=[];
				  
				    	 for( var i=0 ; i<$scope.result.length; i++){
				    		 if($scope.result[i].priority == ""){$scope.result[i].priority = "No Priority"; }
				    		 
				    		 if($scope.result[i].priority == "No Priority"){
				    			 $scope.backgroundColor.push("rgba(54, 162, 235, 0.8)");
				    			 $scope.borderColor.push("rgba(54, 162, 235, 1)");
				    		 }
				    		 if($scope.result[i].priority == "1-Low"){
				    			 $scope.backgroundColor.push("rgba(75, 192, 192, 0.8)");
				    			 $scope.borderColor.push("rgba(75, 192, 192, 1)");
				    		 }
				    		 if($scope.result[i].priority == "2-Medium"){
				    			 $scope.backgroundColor.push("rgba(153, 102, 255, 0.8)");
				    			 $scope.borderColor.push("rgba(153, 102, 255, 1)");
				    		 }
				    		 if($scope.result[i].priority == "3-High"){
				    			 $scope.backgroundColor.push("rgba(255, 206, 86, 0.8)");
				    			 $scope.borderColor.push("rgba(255, 206, 86, 1)");
				    		 }
				    		 if($scope.result[i].priority == "4-Very High"){
				    			 $scope.backgroundColor.push("rgba(255, 159, 64, 0.8)");
				    			 $scope.borderColor.push("rgba(255, 159, 64, 1)");
				    		 }
				    		 if($scope.result[i].priority == "5-Urgent"){
				    			 $scope.backgroundColor.push("rgba(255, 99, 132, 0.8)");
				    			 $scope.borderColor.push("rgba(255, 99, 132, 1)");
				    		 }
				    		 $scope.labels1.push($scope.result[i].priority);
				    		 $scope.data1.push($scope.result[i].priorityCnt);
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
						                  labelFontColor: '#4c4c4c'
						});
				  }
			 } 
			
			//TC by owner Chart 
			 $scope.designTypeChart=function(){
				 var token  = AES.getEncryptedValue();
			        var config = {headers: {
			                'Authorization': token
			                }};

			        	 $http.get("rest/almServicess/designtypechartdata?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
								$scope.data = response; 
								if($scope.data.length !=0){
							    $scope.designerchart($scope.data);}
								else{
									$('#designerbarchart').remove(); // this is my <canvas> element
		        				 	  $('#exediv').append('<canvas id="designerbarchart"> </canvas>'); 	
								}
					     }) ;
					 
			         $scope.designerchart  = function(result){ 
				    	 $scope.result = result;
			        $scope.labels1 =[];
			        $scope.data1 = [];
			       
			        for( var i=0 ; i<$scope.result.length; i++){
			    		 $scope.labels1.push($scope.result[i].testType);
			    		 $scope.data1.push($scope.result[i].typecount);
			  }	
			    	$scope.labelspie = $scope.labels1;
			    	$scope.datapie = $scope.data1;
			        var layoutColors = baConfig.colors;  
			        
			        	   $('#designerbarchart').remove(); // this is my <canvas> element
			        				 	  $('#exediv').append('<canvas id="designerbarchart"> </canvas>'); 

			        var ctx = document.getElementById("designerbarchart");
			        var designerbarchart = new Chart(ctx, {
			            type: 'bar',
			            data: {
			                labels: $scope.labelspie,
			                datasets: [{
			                data: $scope.datapie,
			                backgroundColor : ["rgba(54, 162, 235, 0.8)", 
			                                   "rgba(153, 102, 255, 0.8)",
			                                   "rgba(75, 192, 192, 0.8)",
			                                   "rgba(255, 159, 64, 0.8)",
			                                   "rgba(255, 99, 132, 0.8)",
			                                   "#429bf4",
			                                   "#723f4e",
			                                   "rgba(255, 206, 86, 0.8)",
			                                   "#835C3B" ],
							borderColor: [
												"rgba(54, 162, 235, 1)", 
												"rgba(153, 102, 255, 1)",
												"rgba(75, 192, 192, 1)",
												"rgba(255, 159, 64, 1)",
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
			            	responsive: true,
			             maintainAspectRatio: false,
			            	tooltips : {
	   	                    enabled: true      
	   	                },
			                scales: {
			                    yAxes: [{
			                        ticks: {
			                            beginAtZero:true,
			                            fontColor: '#4c4c4c'
			                        },
			                        scaleLabel : {
										display : true,
										labelString : 'Number of TestCases',
										fontColor: '#4c4c4c'
									},
			                        gridLines: {
		                                color: "#d8d3d3"
		                            }
			                    }],
			                    xAxes: [{
			                            barThickness : 40,
			                            scaleLabel : {
											display : true,
											labelString : 'Test Type',
											fontColor: '#4c4c4c'
										},
			                            gridLines: {
			                                color: "#d8d3d3"
			                            },
			                            ticks: {
				                            fontColor: '#4c4c4c'
				                        },
			                        }]
			                    
			                }
			            }
			            
			        }); }; 
		  

			 	}
			 
				//TestCase Execution by Status Chart 
				$scope.testExeStatusPie=function(){ 

					var token  = AES.getEncryptedValue();
			        var config = {headers: {
			                'Authorization': token
			                }};
					 $http.get("rest/almServicess/testcaseExeStatus?domainName="+$rootScope.selecteddomain+"&projectName="+$rootScope.selectedproject+"&releaseName="+$rootScope.selectedrelease,config).success(function (response) {
						   $scope.data = response; 
						   $scope.statuschart($scope.data);
					    });
		  
				     $scope.statuschart  = function(result){ 
				    	 $scope.result = result;
			        $scope.labels1 =[];
			        $scope.data1 = [];
			       
			        for( var i=0 ; i<$scope.result.length; i++){
			    		 $scope.labels1.push($scope.result[i].testExecutionStatus);
			    		 $scope.data1.push($scope.result[i].statusCnt);
			  }	
			    	$scope.labelspie = $scope.labels1;
			    	$scope.datapie = $scope.data1;
			        var layoutColors = baConfig.colors;  
			           $('#tmstatuschart').remove(); // this is my <canvas> element
			        		  $('#statuspiedivs').append('<canvas id="tmstatuschart"> </canvas>'); 

			        var ctx = document.getElementById("tmstatuschart");
			        var statusdoughnutchart = new Chart(ctx, {
			            type: 'doughnut',
			            data: {
			                labels: $scope.labelspie,
			                datasets: [{
			                data: $scope.datapie,
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
			            	 responsive: true,
			            	 maintainAspectRatio: false,
				            	pieceLabel: {
				            	    render: 'value',
				            	    fontColor:'#4c4c4c'
				            	  },
				            	  
				            	  legend: {
				                      display: true,
				                      position: 'bottom',
				                      labels: {
				                    	   fontColor: '#4c4c4c',
				                    	   boxWidth : 7,
				                    	   fontSize : 10
				                      }
				                  }
			            }
			            
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