/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
	'use strict';

angular.module('MetricsPortal.ReportData').controller(
			'reportDataCtrl',reportDataCtrl);
/** @ngInject */

function reportDataCtrl ($scope, $rootScope, $window,$base64,paginationService, localStorageService, $location,$http,$state, toastr,baConfig, layoutPaths,$timeout,
		$uibModal,$element) {
/*	$scope.value=false;*/
/*alert("i m in the page ");*/
	var inputValue = "";
	var charCode = "";
	 $rootScope.menubar = true;
	 $rootScope.var1 = false;
		$rootScope.var2 = false;
		$rootScope.var3 = false;
		$rootScope.var4 = false;
		$rootScope.var6 = true;
	 
			$rootScope.menuItems = [
					              	    {
					              	      "name":  "Home",
					              	      "title": "Home",
					              	      "level": 0,
					              	      "order": 0,
					              	      "icon": "ion-android-home",
					              	      "stateRef": "internalreport",
					              	      "subMenu": null
					              	    },
					              	  /*{
						              	      "name": "Vertical wise Split up",
						              	      "title": "Vertical wise Split up",
						              	      "level": 0,
						              	      "order": 0,
						              	      "icon": "ion-stats-bars",
						              	     "stateRef": "verticalcharts",
						              	      "subMenu": null
						              	    },
						              	  {
							              	      "name": "Capability wise Split up",
							              	      "title": "Capability wise Split up",
							              	      "level": 0,
							              	      "order": 0,
							              	      "icon": "ion-stats-bars",
							              	      "stateRef": "capabilityreportchart",
							              	      "subMenu": null
							              	    },
							              	  {
								              	      "name": "Activity wise Split up",
								              	      "title": "Activity wise Split up",
								              	      "level": 0,
								              	      "order": 0,
								              	      "icon": "ion-stats-bars",
								              	      "stateRef": "activitychart",
								              	      "subMenu": null
								              	    },
								              	  {
									              	      "name": "Contribution wise split up",
									              	      "title": "Contribution wise split up",
									              	      "level": 0,
									              	      "order": 0,
									              	      "icon": "ion-stats-bars",
									              	      "stateRef": "impressionChart",
									              	      "subMenu": null
									              	    },*/
									              	  {
										              	      "name": "CoEDashboard View",
										              	      "title": "CoEDashboard View",
										              	      "level": 0,
										              	      "order": 0,
										              	      "icon": "ion-stats-bars",
										              	      "stateRef": "coEChartView",
										              	      "subMenu": null
										              	    }
								              	    
						              	    
					              	  ]; 
			 

		
		
	 function getEncryptedValue()
	 {
	  var username= localStorageService.get('userIdA');
	  var password= localStorageService.get('passwordA');
	  var tokeen =$base64.encode(username+":"+password);
	       return tokeen;
	       }
	
	/* $(document).ready(function() {
			
			$(".comment").shorten();
		
		});
	 
		$(".comment").shorten({
			"showChars" : 50,
			"moreText"	: "See More",
			"lessText"	: "Less",
		});*/
	
	//get values from dropdowns
	 $scope.getSelectedVertical = function(selectedVertical){
			$rootScope.selectedVertical = selectedVertical;
			console.log($rootScope.selectedVertical);
		}
	
		
		$scope.getSelectedGeo = function(selectedGeo){
			$rootScope.selectedGeo = selectedGeo;
			console.log($rootScope.selectedGeo);
		}
		$scope.getSelectedCoETrack = function(selectedCoETrack){
			console.log("gdhf");
			$rootScope.selectedCoETrack = selectedCoETrack;
			console.log($rootScope.selectedCoETrack);
		}
		$scope.getSelectedTypeofsupport = function(selectedTypeOfSupport){
			$rootScope.selectedTypeOfSupport = selectedTypeOfSupport;
			console.log($rootScope.selectedTypeOfSupport);
		}
		$scope.getSelectedHighImpact = function(selectedisItAHighiImpactContribution){
			console.log("hiihh");
			$rootScope.selectedisItAHighiImpactContribution=selectedisItAHighiImpactContribution;
			console.log(selectedisItAHighiImpactContribution);
		}
		
		
		//page number
		$scope.pageChangedLevel = function(pageno) {
			$scope.pageno = pageno;
			console.log($scope.pageno);
			if($rootScope.selectedVertical==undefined && $rootScope.selectedGeo==undefined && $rootScope.selectedCoETrack==undefined && $rootScope.selectedisItAHighiImpactContribution==undefined && $rootScope.selectedTypeOfSupport==undefined)
				{
			$scope.gettdmDetails($scope.pageno);}
			else{
				$scope.getTDMDetails($scope.pageno);
			}

		};
	
		
		//table details displayed initially on page load 
	

		$scope.itemsPerPage = 5;
	 $scope.gettdmDetails = function(start_index) {
			var token  = getEncryptedValue();
		      var config = {headers: {
		              'Authorization': token
		              }};
		  
		  	$scope.index = start_index;
			$http.get(
					"./rest/reportDataServices/tdmtable?itemsPerPage="
						+ $scope.itemsPerPage + "&start_index="
						+ $scope.index,config).success(
					function(response) {
						if(response){
							
						/*setTimeout(function(){$(window).trigger('resize')},0);*/
						$scope.TDMDetails = response;}
						$timeout(function(){moreLink()},100);
						console.log($scope.TDMDetails);
					});
			
		};
		function moreLink() {
			
				var showChar = 100;
				var ellipsestext = "...";
				var moretext = "more";
				var lesstext = "less";
				$('.more').each(function() {
					var content = $(this).html();

					if(content.length > showChar) {

						var c = content.substr(0, showChar);
						var h = content.substr(showChar-1, content.length - showChar);

						var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

						$(this).html(html);
					}

				});

				$(".morelink").click(function(){
					if($(this).hasClass("less")) {
						$(this).removeClass("less");
						$(this).html(moretext);
					} else {
						$(this).addClass("less");
						$(this).html(lesstext);
					}
					$(this).parent().prev().toggle();
					$(this).prev().toggle();
					return false;
				});
			};
	 
//report datails count
		$rootScope.initialcountofDetails = function() {
			var token  = getEncryptedValue();
		      var config = {headers: {
		              'Authorization': token
		              }};
			$http.get(
					"rest/reportDataServices/ReportDetailsCount",config).success(
					function(response) {
						$rootScope.detailsCount = response;
					});
		};

	 //----init details
		$rootScope.initialCountofDetails = function() {
			var token  = getEncryptedValue();
		      var config = {headers: {
		              'Authorization': token
		              }};
			$http.get(
					"rest/reportDataServices/ReportDetailsCounts?Vertical="+$rootScope.selectedVertical+"&Geo="+$rootScope.selectedGeo+"&coETrack="+$rootScope.selectedCoETrack+"&typeOfSupport="+$rootScope.selectedTypeOfSupport+"&isItAHighiImpactContribution="+$rootScope.selectedisItAHighiImpactContribution,config).success(
					function(response) {
						$rootScope.detailsCount = response;
					});
		};
		
	 
	   //table  search details
 $scope.getTDMDetails=function(start_index)
	   
	    {
	    /*	alert("inside");*/
	
	    	var token  = getEncryptedValue();
	    	 var config = {headers: {
	             'Authorization': token
	             }};
	    		$scope.index = start_index;
	    	 if($rootScope.selectedVertical==undefined && $rootScope.selectedGeo==undefined && $rootScope.selectedCoETrack==undefined && $rootScope.selectedisItAHighiImpactContribution==undefined && $rootScope.selectedTypeOfSupport==undefined )
	    		 {
	    		 $scope.open(
							'app/pages/reportData/warningMssg.html',
							'sm');

	    		 }
	  /*   else if($rootScope.selectedVertical!=undefined && $rootScope.selectedGeo==undefined && $rootScope.selectedCoETrack==undefined && $rootScope.selectedisItAHighiImpactContribution==undefined && $rootScope.selectedTypeOfSupport==undefined ){
	    		 $http.get("rest/reportDataServices/getVerticalTableData?Vertical="+$rootScope.selectedVertical,config).success(function (response) {
	    			 $scope.TDMDetails= response;
	    			 console.log($scope.TDMDetails);
	    			    
	    		    });
	    		    	 } 
	    */
	    	 else {
	    		
	    	 $http.get("rest/reportDataServices/getTDMTableData?Vertical="+$rootScope.selectedVertical+"&Geo="+$rootScope.selectedGeo+"&coETrack="+$rootScope.selectedCoETrack+"&typeOfSupport="+$rootScope.selectedTypeOfSupport+"&isItAHighiImpactContribution="+$rootScope.selectedisItAHighiImpactContribution+"&start_index="
						+ $scope.index+"&itemsPerPage="
							+ $scope.itemsPerPage,config).success(function (response) {
				   
	    		 
	    			
	    		if(response==null || response=="" ||response==undefined){
	    			/* alert("inside");*/
	    			 $scope.errorMsg();
	    		
	    		 }
	    		else {
	    		/*	 $rootScope.detailsCount=response.length;*/
	    			$timeout(function(){moreLink()},100);
	    		 $scope.TDMDetails= response;
	    		
	    		/* console.log( $rootScope.detailsCount);*/
				   console.log($scope.TDMDetails);
	    		 }
	       
	    });
	    	 }
	    	 }

 $scope.errorMsg = function() {
     $scope.open('app/pages/reportData/incorrectData.html', 'sm');
     
		
     
   };
   
   
   //export as csv
    $scope.exportDataInCSV=function(){
   	   var table = TableExport(document.getElementById("exportableBizReportDetails"));
   	   	   var exportData = table.getExportData();
   	   console.log("exportData",exportData);
   	   var samplecsvData = exportData.exportableBizReportDetails.csv.data;
   	   var blob = new Blob(
   			   [samplecsvData],
   			   {
   				   type : "application/vnd.ms-excel",
   				   type :"text/csv;charset=utf-8" 
   			   });
   			   saveAs(blob, "ReportDetails.csv");
   	   
   	   
      };
      
      $scope.exportData=function(){
   	   var blob = new Blob(
   			   [document.getElementById("exportableBizReportDetails").innerHTML],
   			   {
   				   type :"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
   			   });
   	   saveAs(blob, "ReportDetails.xls");
   			   
      }
      
      
      //csv table function
      $scope.getCsvTableDetails = function(start_index) {
   		var token  = getEncryptedValue();
   	      var config = {headers: {
   	              'Authorization': token
   	              }};
   	  
   	  	$scope.index = start_index;
   		$http.get(
   				"./rest/reportDataServices/csvTableDetail",config).success(
   				function(response) {
   					$scope.TDMDetails = response;
   					console.log($scope.TDMDetails);
   				});
   	};
   	
    
    //coEDashboardChartView
   	

    $scope.coEChartView=function(){
    var token  = getEncryptedValue();
    var config = {headers: {
            'Authorization': token
            }};
 	
 	   $http.get("rest/reportDataServices/coEDashboardChartView",config).success(
 		function(response) {
 			$scope.tdmresponsedata = response;
 			//alert(JSON.stringify($scope.tdmresponsedata));
 			console.log($scope.tdmresponsedata);
 			makeGraphs(response);
 		});
 	   
 	   function makeGraphs(apiData) {

 		 //Start Transformations	
 		 	var dataSet = apiData;
 		 	
 		 	//Create a Crossfilter instance
 		 	var ndx = crossfilter(dataSet);
 		 	
 		 	//alert(JSON.stringify(dataSet));
 		 	
 		 	//Define Dimensions
 		 	
 		 	var verticalData = ndx.dimension(function(d) { return d.vertical; });
 		 	var supportGroup = ndx.dimension(function(d) { return d.supportGroup; });
 		 	var geoType = ndx.dimension(function(d) { return d.geo; });
 		 	var coeType = ndx.dimension(function(d) { return d.coETrack; });
 		 	var highImpactContribution = ndx.dimension(function(d) { return d.highImpactContribution; });
		 	var supportType = ndx.dimension(function(d) { return d.typeOfSupport; });
 		 	
 		 	//console.log((defectOpenStatus.size()));
 		 	
 		 	//Calculate metrics
 		 	
 		 	var TDMbyVertical = verticalData.group();
 		 	var typeOfActivity = supportGroup.group();
 		 	var typeOfGeo = geoType.group();
 		 	var typeofCoE = coeType.group();
 		 	var highImpact = highImpactContribution.group();
			var typeOfSupport = supportType.group();
 		 	
 		 	$scope.ofs = 0;
 		 	var all = ndx.groupAll(); 
 		 	
 		 				 
 		 	var verticalTypeChart = dc.pieChart("#funding-chart");
 		 	var supporActivityeChart = dc.barChart("#poverty-chart");
 		 	var geoTypeChart = dc.barChart("#state-donations");
 		 	var coeTypeChart = dc.pieChart("#funding-chart1");
 			var supportGroupChart = dc.pieChart("#funding-chart2");
		 	var supporTypeChart = dc.barChart("#poverty-chart1");
 		 	
 		 	
 		 	
 		 	  $scope.ofs = 0;
 		 	  $scope.pag = 7;
 		 	
 		 	
 		 	var pieChartColors = d3.scale.ordinal().range(["#dfb81c","#0F8070","#045259","#d18c2b","#00b8e6","#90b900","#209e91","#e85656"]);
 		 	var barChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
 		 		   "rgba(9, 191, 22, 0.9)",
 		            "rgba(6, 239, 212, 0.9)",		                                   
 		            "rgba(236, 255, 0, 0.9)",
 		            "rgba(255, 159, 64, 0.9)",
 		            "rgba(255, 31, 0, 0.9)"]);
 		 	var rowChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
 		 		   "rgba(9, 191, 22, 0.9)",
 		            "rgba(6, 239, 212, 0.9)",		                                   
 		            "rgba(236, 255, 0, 0.9)",
 		            "rgba(255, 159, 64, 0.9)",
 		            "rgba(255, 31, 0, 0.9)"]);
 		 	
 		 	
 		 				 	 	
 		 	verticalTypeChart
 		       .height(300)
 		       .width(524)
 		       .colors(pieChartColors)
 		       .radius(140)
 		       .innerRadius(40)
 		       .transitionDuration(1000)
 		       .dimension(verticalData)
 		       .legend(dc.legend().x(450).y(0).gap(5))
 				      .on('pretransition', function(verticalTypeChart) {
 				    	  verticalTypeChart.selectAll('text.pie-slice').text(function(d) {
 				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
 				        })
 				    })
 		       .group(TDMbyVertical);
 		 	
 		 	/*supporTypeChart
 				//.width(300)
 				.colors(rowChartColors)
 				.height(300)
 		      .dimension(supportType)
 		      .group(typeOfSupport)
 		      .xAxis().ticks(4);*/
 		 	supporActivityeChart
 		  	  .width(450)
 		      .height(300)
 		      .colors(barChartColors)
 		      .dimension(supportGroup)
 		      .group(typeOfActivity)
 		      .margins({top: 10, right: 50, bottom: 30, left: 50})
 		      .centerBar(false)
 		      .gap(10)
 		      .elasticY(true)
 		     .x(d3.scale.ordinal().domain(supportGroup))
 		      .xUnits(dc.units.ordinal)
 		      .renderHorizontalGridLines(true)
 		      .renderVerticalGridLines(true)
 		     .ordering(function(d){return d.value;})
 		      .colorAccessor(function(d){return d.value; })
 		      .yAxis().tickFormat(d3.format("s"));
 		 	
 		 	
 		 	geoTypeChart
 		  	  .width(550)
 		      .height(300)
 		      .colors(barChartColors)
 		      .dimension(geoType)
 		      .group(typeOfGeo)
 		      .margins({top: 10, right: 50, bottom: 30, left: 50})
 		      .centerBar(false)
 		      .gap(10)
 		      .elasticY(true)
 		     .x(d3.scale.ordinal().domain(geoType))
 		      .xUnits(dc.units.ordinal)
 		      .renderHorizontalGridLines(true)
 		      .renderVerticalGridLines(true)
 		      .ordering(function(d){return d.value;})
 		       .colorAccessor(function(d){return d.value; })
 		      .yAxis().tickFormat(d3.format("s"));
 		 	
 		 	coeTypeChart
 		       .height(300)
 		       .width(524)
 		       .colors(pieChartColors)
 		       .radius(140)
 		       .innerRadius(40)
 		       .transitionDuration(1000)
 		       .dimension(coeType)
 		         .legend(dc.legend().x(440).y(0).gap(5))
 				      .on('pretransition', function(coeTypeChart) {
 				    	  coeTypeChart.selectAll('text.pie-slice').text(function(d) {
 				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
 				        })
 				    })
 		       .group(typeofCoE);
 		 	
 		 	supportGroupChart
		       .height(300)
		       .width(524)
		       .colors(pieChartColors)
		       .radius(140)
		       .innerRadius(40)
		       .transitionDuration(1000)
		       .dimension(highImpactContribution)
		        .legend(dc.legend().x(358).y(-1).gap(5))
			      .on('pretransition', function(supportGroupChart) {
			    	  supportGroupChart.selectAll('text.pie-slice').text(function(d) {
			            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
			        })
			    })
		       .group(highImpact);
 		 	
 		 	supporTypeChart
		  	  .width(1100)
		      .height(400)
		      
		      .colors(barChartColors)
		      .dimension(supportType)
		      .group(typeOfSupport)
		      .margins({top: 10, right: 50, bottom: 130, left: 50})
		      .centerBar(false)
		      .gap(10)
		      .elasticY(true)
		      
		      	
		     .x(d3.scale.ordinal().domain(supportType))
		      .xUnits(dc.units.ordinal)
		      .renderHorizontalGridLines(true)
		      .renderVerticalGridLines(true)
		      .ordering(function(d){return d.value;})
		    /*  .xAxis().orient("bottom")*/
		      /*.renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '-10').attr('dy', '-7').attr('transform', "rotate(-50)").style("text-anchor", "end");})*/
		       .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '0').attr('dy', '0').attr('transform', "rotate(-30)").style("text-anchor", "end");})
		     .colorAccessor(function(d){return d.value; })
		       .yAxis().tickFormat(d3.format("s"));
 		 	
 		 	 dc.renderAll(); 
 		 	 
 		 };
    }

    

   
   	
	$scope.verticalChart=function(){
		
 		var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
      
		 $http.get("rest/" +
		 		"reportDataServices/verticalChart",config).then(function (response) {
			    $scope.dataVertical = response.data; 
			    if($scope.dataVertical.length !=0){
			    $scope.priorityVertical($scope.dataVertical);}
			    else{
			    	$('#qualysdivision').remove(); // this is my <canvas> element
				 	  $('#divisionQualysdiv').html('<canvas id="qualysdivision"> </canvas>'); 	
			    }
			}) ;    	

		   $scope.priorityVertical  = function(result){ 
		    	 $scope.result = result;
	        $scope.labels1 =[];
	        $scope.data1 = [];
	       
	        for( var i=0 ; i<$scope.result.length; i++){
	        	if($scope.result[i].division == ""){
 	    			$scope.result[i].division = "No Priority";
 	    			}
	    		 $scope.labels1.push($scope.result[i].division);
	    		 $scope.data1.push($scope.result[i].count);
	  }	
	    	$scope.labelspie = $scope.labels1;
	    	$scope.datapie = $scope.data1;
	        var layoutColors = baConfig.colors;  
	        	   $('#qualysdivision').remove(); // this is my <canvas> element
	        				 	  $('#divisionQualysdiv').html('<canvas id="qualysdivision"> </canvas>'); 

	        var ctx = document.getElementById("qualysdivision");
	        var qualysdivision = new Chart(ctx, {
	            type: 'pie',
	            data: {
	                labels: $scope.labelspie,
	                datasets: [{
	                data: $scope.datapie,
	                backgroundColor : ["rgba(255, 113, 189, 0.9)",
	                				   "rgba(9, 191, 22, 0.9)",
	                                   "rgba(6, 239, 212, 0.9)",		                                   
	                                   "rgba(236, 255, 0, 0.9)",
	                                   "rgba(255, 159, 64, 0.9)",
	                                   "rgba(255, 31, 0, 0.9)"],
					borderColor: ["rgba(255, 113, 189, 1)",
     				   "rgba(9, 191, 22, 1)",
                       "rgba(6, 239, 212, 1)",                           
                       "rgba(236, 255, 0, 1)",
                       "rgba(255, 159, 64, 1)",
                       "rgba(255, 31, 0, 1)"],
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
	            
	        }); }; 
 }
	
	//impact chart
	$scope.impactChart=function(){
		
 		var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
      
		 $http.get("rest/" +
		 		"reportDataServices/impactChart",config).then(function (response) {
			    $scope.dataImpact = response.data; 
			    if($scope.dataImpact.length !=0){
			    $scope.impactData($scope.dataImpact);}
			    else{
			    	$('#impactData').remove(); // this is my <canvas> element
				 	  $('#impactDatadiv').html('<canvas id="impactData"> </canvas>'); 	
			    }
			}) ;    	

		   $scope.impactData  = function(result){ 
		    	 $scope.result = result;
	        $scope.labels1 =[];
	        $scope.data1 = [];
	       
	        for( var i=0 ; i<$scope.result.length; i++){
	        	if($scope.result[i].division == ""){
 	    			$scope.result[i].division = "No Priority";
 	    			}
	    		 $scope.labels1.push($scope.result[i].division);
	    		 $scope.data1.push($scope.result[i].count);
	  }	
	    	$scope.labelspie = $scope.labels1;
	    	$scope.datapie = $scope.data1;
	        var layoutColors = baConfig.colors;  
	        	   $('#impactData').remove(); // this is my <canvas> element
	        				 	  $('#impactDatadiv').html('<canvas id="impactData"> </canvas>'); 

	        var ctx = document.getElementById("impactData");
	        var impactData = new Chart(ctx, {
	            type: 'pie',
	            data: {
	                labels: $scope.labelspie,
	                datasets: [{
	                data: $scope.datapie,
	                backgroundColor : ["rgba(255, 113, 189, 0.9)",
	                				   "rgba(9, 191, 22, 0.9)",
	                                   "rgba(6, 239, 212, 0.9)",		                                   
	                                   "rgba(236, 255, 0, 0.9)",
	                                   "rgba(255, 159, 64, 0.9)",
	                                   "rgba(255, 31, 0, 0.9)"],
					borderColor: ["rgba(255, 113, 189, 1)",
     				   "rgba(9, 191, 22, 1)",
                       "rgba(6, 239, 212, 1)",                           
                       "rgba(236, 255, 0, 1)",
                       "rgba(255, 159, 64, 1)",
                       "rgba(255, 31, 0, 1)"],
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
	            
	        }); }; 
 }
	
	
	
	
	
   	
   	//geo type
$scope.geoChart=function(){
		
 		var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
      
		 $http.get("rest/" +
		 		"reportDataServices/geoChart",config).then(function (response) {
			    $scope.datageo = response.data; 
			    if($scope.datageo.length !=0){
			    $scope.priorityGeo($scope.datageo);}
			    else{
			    	$('#geodivision').remove(); // this is my <canvas> element
				 	  $('#geodiv').html('<canvas id="geodivision"> </canvas>'); 	
			    }
			}) ;    	

		   $scope.priorityGeo  = function(result){ 
		    	 $scope.result = result;
	        $scope.labels1 =[];
	        $scope.data1 = [];
	       
	        for( var i=0 ; i<$scope.result.length; i++){
	        	if($scope.result[i].division == ""){
 	    			$scope.result[i].division = "No Priority";
 	    			}
	    		 $scope.labels1.push($scope.result[i].division);
	    		 $scope.data1.push($scope.result[i].count);
	  }	
	    	$scope.labelspie = $scope.labels1;
	    	$scope.datapie = $scope.data1;
	        var layoutColors = baConfig.colors;  
	        	   $('#geodivision').remove(); // this is my <canvas> element
	        				 	  $('#geodiv').html('<canvas id="geodivision"> </canvas>'); 

	        var ctx = document.getElementById("geodivision");
	        var geodivision = new Chart(ctx, {
	            type: 'pie',
	            data: {
	                labels: $scope.labelspie,
	                datasets: [{
	                data: $scope.datapie,
	                backgroundColor : ["rgba(255, 113, 189, 0.9)",
	                				   "rgba(9, 191, 22, 0.9)",
	                                   "rgba(6, 239, 212, 0.9)",		                                   
	                                   "rgba(236, 255, 0, 0.9)",
	                                   "rgba(255, 159, 64, 0.9)",
	                                   "rgba(255, 31, 0, 0.9)"],
					borderColor: ["rgba(255, 113, 189, 1)",
     				   "rgba(9, 191, 22, 1)",
                       "rgba(6, 239, 212, 1)",                           
                       "rgba(236, 255, 0, 1)",
                       "rgba(255, 159, 64, 1)",
                       "rgba(255, 31, 0, 1)"],
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
	            
	        }); }; 
 }
   	//coe type
$scope.coeChart=function(){
	
		var token  = getEncryptedValue();
    var config = {headers: {
            'Authorization': token
            }};
  
	 $http.get("rest/" +
	 		"reportDataServices/coeChart",config).then(function (response) {
		    $scope.datacoe = response.data; 
		    if($scope.datacoe.length !=0){
		    $scope.prioritycoe($scope.datacoe);}
		    else{
		    	$('#coedivision').remove(); // this is my <canvas> element
			 	  $('#coediv').html('<canvas id="coedivision"> </canvas>'); 	
		    }
		}) ;    	

	   $scope.prioritycoe  = function(result){ 
	    	 $scope.result = result;
        $scope.labels1 =[];
        $scope.data1 = [];
       
        for( var i=0 ; i<$scope.result.length; i++){
        	if($scope.result[i].division == ""){
	    			$scope.result[i].division = "No Priority";
	    			}
    		 $scope.labels1.push($scope.result[i].division);
    		 $scope.data1.push($scope.result[i].count);
  }	
    	$scope.labelspie = $scope.labels1;
    	$scope.datapie = $scope.data1;
        var layoutColors = baConfig.colors;  
        	   $('#coedivision').remove(); // this is my <canvas> element
        				 	  $('#coediv').html('<canvas id="coedivision"> </canvas>'); 

        var ctx = document.getElementById("coedivision");
        var coedivision = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: $scope.labelspie,
                datasets: [{
                data: $scope.datapie,
                backgroundColor : ["rgba(255, 113, 189, 0.9)",
                				   "rgba(9, 191, 22, 0.9)",
                                   "rgba(6, 239, 212, 0.9)",		                                   
                                   "rgba(236, 255, 0, 0.9)",
                                   "rgba(255, 159, 64, 0.9)",
                                   "rgba(255, 31, 0, 0.9)"],
				borderColor: ["rgba(255, 113, 189, 1)",
 				   "rgba(9, 191, 22, 1)",
                   "rgba(6, 239, 212, 1)",                           
                   "rgba(236, 255, 0, 1)",
                   "rgba(255, 159, 64, 1)",
                   "rgba(255, 31, 0, 1)"],
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
            
        }); }; 
}
//support group
$scope.supportGroup=function(){
	 var token  = getEncryptedValue();
      var config = {headers: {
              'Authorization': token
              }};
      
      	 $http.get("rest/reportDataServices/supportGroup",config).then(function (response) {
					$scope.supportGroup = response.data; 
					if($scope.supportGroup.length !=0){
				    $scope.designerchart($scope.supportGroup);}
					else{
						$('#groupbarchart').remove(); // this is my <canvas> element
  				 	  $('#exediv').append('<canvas id="groupbarchart"> </canvas>'); 	
					}
		     }) ;
		 
       $scope.designerchart  = function(result){ 
	    	 $scope.result = result;
      $scope.labels1 =[];
      $scope.data1 = [];
     
      for( var i=0 ; i<$scope.result.length; i++){
  		 $scope.labels1.push($scope.result[i].division);
  		 $scope.data1.push($scope.result[i].count);
}	
  	$scope.labelspie = $scope.labels1;
  	$scope.datapie = $scope.data1;
      var layoutColors = baConfig.colors;  
      
      	   $('#groupbarchart').remove(); // this is my <canvas> element
      				 	  $('#exediv').append('<canvas id="groupbarchart"> </canvas>'); 

      var ctx = document.getElementById("groupbarchart");
      var groupbarchart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: $scope.labelspie,
              datasets: [{
              data: $scope.datapie,
              backgroundColor : ["rgba(199, 99, 5, 0.9)", 
		                            "rgba(255, 31, 0, 0.8)",
		                            "rgba(6, 239, 212, 0.8)",
		                            "rgba(189, 5, 171, 0.8)",
		                            "rgba(153, 102, 255, 0.8)",	                                  
		                            "rgba(67, 154, 213, 0.8)",
		                            "rgba(255, 113, 189, 0.8)",
              				   "rgba(54, 162, 235, 0.8)", 
                                 "rgba(153, 102, 255, 0.8)",
                                 "rgba(75, 192, 192, 0.8)",
                                 "rgba(255, 159, 64, 0.8)",
                                 "rgba(255, 99, 132, 0.8)",
                                 "#429bf4",
                                 "#723f4e",
                                 "rgba(255, 206, 86, 0.8)",
                                 "#835C3B" ],
				borderColor: [
					"rgba(199, 99, 5, 0.8)", 
                  "rgba(255, 31, 0, 0.8)",
                  "rgba(6, 239, 212, 0.8)",
                  "rgba(189, 5, 171, 0.8)",
                  "rgba(153, 102, 255, 0.8)",	                                  
                  "rgba(67, 154, 213, 0.8)",
                  "rgba(255, 113, 189, 0.8)",
				   "rgba(54, 162, 235, 0.8)", 
                 "rgba(153, 102, 255, 0.8)",
                 "rgba(75, 192, 192, 0.8)",
                 "rgba(255, 159, 64, 0.8)",
                 "rgba(255, 99, 132, 0.8)",
                 "#429bf4",
                 "#723f4e",
                 "rgba(255, 206, 86, 0.8)",
                 "#835C3B"
                                              ],
                  borderWidth: 1,
           
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
                          beginAtZero:true,
                          fontColor: '#4c4c4c'
                      },
                      scaleLabel:
	                       {
	                    	   display: true,
	                    	   labelString: ' Count ',
	                    	   fontColor: '#4c4c4c'
	     		          	},
                      gridLines: {
                          color: "#d8d3d3"
                      }
                  }],
                  xAxes: [{
                          barThickness : 40,
                          scaleLabel:
	 	                       {
	 	                    	   display: true,
	 	                    	   labelString: 'Support Group',
	 	                    	  fontColor: '#4c4c4c'
	 	     		          	},
                          gridLines: {
                              color: "#d8d3d3"
                          },ticks: {
                        	  fontColor: '#4c4c4c'
                          }
                      }]
                  
              }
          }
          
      }); }; 


	}

//type of support bar chart
$scope.typeOfSupport=function(){
	 var token  = getEncryptedValue();
       var config = {headers: {
               'Authorization': token
               }};
       
       	 $http.get("rest/reportDataServices/typeOfSupport",config).then(function (response) {
					$scope.typeOfSupport = response.data; 
					if($scope.typeOfSupport.length !=0){
				    $scope.designerchart1($scope.typeOfSupport);}
					else{
						$('#designerbarchart').remove(); // this is my <canvas> element
   				 	  $('#exedivv').append('<canvas id="designerbarchart"> </canvas>'); 	
					}
		     }) ;
		 
        $scope.designerchart1  = function(result){ 
	    	 $scope.result = result;
       $scope.labels1 =[];
       $scope.data1 = [];
      
       for( var i=0 ; i<$scope.result.length; i++){
   		 $scope.labels1.push($scope.result[i].division);
   		 $scope.data1.push($scope.result[i].count);
 }	
   	$scope.labelspie = $scope.labels1;
   	$scope.datapie = $scope.data1;
       var layoutColors = baConfig.colors;  
       
       	   $('#designerbarchart').remove(); // this is my <canvas> element
       				 	  $('#exedivv').append('<canvas id="designerbarchart"> </canvas>'); 

       var ctx = document.getElementById("designerbarchart");
       var designerbarchart = new Chart(ctx, {
           type: 'bar',
           data: {
               labels: $scope.labelspie,
               datasets: [{
               data: $scope.datapie,
               backgroundColor : ["rgba(199, 99, 5, 0.9)", 
		                            "rgba(255, 31, 0, 0.8)",
		                            "rgba(6, 239, 212, 0.8)",
		                            "rgba(189, 5, 171, 0.8)",
		                            "rgba(153, 102, 255, 0.8)",	                                  
		                            "rgba(67, 154, 213, 0.8)",
		                            "rgba(255, 113, 189, 0.8)",
               				   "rgba(54, 162, 235, 0.8)", 
                                  "rgba(153, 102, 255, 0.8)",
                                  "rgba(75, 192, 192, 0.8)",
                                  "rgba(255, 159, 64, 0.8)",
                                  "rgba(255, 99, 132, 0.8)",
                                  "#429bf4",
                                  "#723f4e",
                                  "rgba(255, 206, 86, 0.8)",
                                  "#835C3B" ],
				borderColor: [
					"rgba(199, 99, 5, 0.8)", 
                   "rgba(255, 31, 0, 0.8)",
                   "rgba(6, 239, 212, 0.8)",
                   "rgba(189, 5, 171, 0.8)",
                   "rgba(153, 102, 255, 0.8)",	                                  
                   "rgba(67, 154, 213, 0.8)",
                   "rgba(255, 113, 189, 0.8)",
				   "rgba(54, 162, 235, 0.8)", 
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                  "rgba(255, 99, 132, 0.8)",
                  "#429bf4",
                  "#723f4e",
                  "rgba(255, 206, 86, 0.8)",
                  "#835C3B"
                                               ],
                   borderWidth: 1,
            
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
                           beginAtZero:true,
                           fontColor: '#4c4c4c'
                       },
                       scaleLabel:
	                       {
	                    	   display: true,
	                    	   labelString: 'Count ',
	                    	   fontColor: '#4c4c4c'
	     		          	},
                       gridLines: {
                           color: "#d8d3d3"
                       }
                   }],
                   xAxes: [{
                           barThickness : 40,
                           scaleLabel:
	 	                       {
	 	                    	   display: true,
	 	                    	   labelString: 'TypeOf Support ',
	 	                    	   fontColor: '#4c4c4c'
	 	     		          	},
                           gridLines: {
                               color: "#d8d3d3"
                           },
                           ticks: {
                        	   fontColor: '#4c4c4c'
                           }
                       }]
                   
               }
           }
           
       }); }; 


	}

//
   
   /*//vertical wise charts 
   
   $scope.reportVerticalChart=function(){
   var token  = getEncryptedValue();
   var config = {headers: {
           'Authorization': token
           }};
	
	   $http.get("rest/reportDataServices/verticalChartData",config).success(
		function(response) {
			$scope.tdmresponsedata = response;
			//alert(JSON.stringify($scope.tdmresponsedata));
			console.log($scope.tdmresponsedata);
			makeGraphs(response);
		});
	   
	   function makeGraphs(apiData) {

		 //Start Transformations	
		 	var dataSet = apiData;
		 	
		 	//Create a Crossfilter instance
		 	var ndx = crossfilter(dataSet);
		 	
		 	//alert(JSON.stringify(dataSet));
		 	
		 	//Define Dimensions
		 	
		 	var verticalData = ndx.dimension(function(d) { return d.vertical; });
		 	var supportType = ndx.dimension(function(d) { return d.supportGroup; });
		 	var geoType = ndx.dimension(function(d) { return d.geo; });
		 	var coeType = ndx.dimension(function(d) { return d.coETrack; });
		 	
		 	//console.log((defectOpenStatus.size()));
		 	
		 	//Calculate metrics
		 	
		 	var TDMbyVertical = verticalData.group();
		 	var typeOfSupport = supportType.group();
		 	var typeOfGeo = geoType.group();
		 	var typeofCoE = coeType.group();
		 	
		 	$scope.ofs = 0;
		 	var all = ndx.groupAll(); 
		 	
		 				 
		 	var verticalTypeChart = dc.pieChart("#funding-chart");
		 	var supporTypeChart = dc.barChart("#poverty-chart");
		 	var geoTypeChart = dc.barChart("#state-donations");
		 	var coeTypeChart = dc.pieChart("#funding-chart1");
		 	
		 	  $scope.ofs = 0;
		 	  $scope.pag = 7;
		 	
		 	
		 	var pieChartColors = d3.scale.ordinal().range(["#dfb81c","#0F8070","#045259","#d18c2b","#00b8e6","#90b900","#209e91","#e85656"]);
		 	var barChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
		 		   "rgba(9, 191, 22, 0.9)",
		            "rgba(6, 239, 212, 0.9)",		                                   
		            "rgba(236, 255, 0, 0.9)",
		            "rgba(255, 159, 64, 0.9)",
		            "rgba(255, 31, 0, 0.9)"]);
		 	var rowChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
		 		   "rgba(9, 191, 22, 0.9)",
		            "rgba(6, 239, 212, 0.9)",		                                   
		            "rgba(236, 255, 0, 0.9)",
		            "rgba(255, 159, 64, 0.9)",
		            "rgba(255, 31, 0, 0.9)"]);
		 	
		 	
		 				 	 	
		 	verticalTypeChart
		       .height(300)
		       .width(524)
		       .colors(pieChartColors)
		       .radius(140)
		       .innerRadius(40)
		       .transitionDuration(1000)
		       .dimension(verticalData)
		       .legend(dc.legend().x(450).y(0).gap(5))
				      .on('pretransition', function(verticalTypeChart) {
				    	  verticalTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
		       .group(TDMbyVertical);
		 	
		 	supporTypeChart
				//.width(300)
				.colors(rowChartColors)
				.height(300)
		      .dimension(supportType)
		      .group(typeOfSupport)
		      .xAxis().ticks(4);
		 	supporTypeChart
		  	  .width(450)
		      .height(300)
		      .colors(barChartColors)
		      .dimension(supportType)
		      .group(typeOfSupport)
		      .margins({top: 10, right: 50, bottom: 30, left: 50})
		      .centerBar(false)
		      .gap(10)
		      .elasticY(true)
		     .x(d3.scale.ordinal().domain(supportType))
		      .xUnits(dc.units.ordinal)
		      .renderHorizontalGridLines(true)
		      .renderVerticalGridLines(true)
		     .ordering(function(d){return d.value;})
		      .colorAccessor(function(d){return d.value; })
		      .yAxis().tickFormat(d3.format("s"));
		 	
		 	
		 	geoTypeChart
		  	  .width(550)
		      .height(300)
		      .colors(barChartColors)
		      .dimension(geoType)
		      .group(typeOfGeo)
		      .margins({top: 10, right: 50, bottom: 30, left: 50})
		      .centerBar(false)
		      .gap(10)
		      .elasticY(true)
		     .x(d3.scale.ordinal().domain(geoType))
		      .xUnits(dc.units.ordinal)
		      .renderHorizontalGridLines(true)
		      .renderVerticalGridLines(true)
		      .ordering(function(d){return d.value;})
		       .colorAccessor(function(d){return d.value; })
		      .yAxis().tickFormat(d3.format("s"));
		 	
		 	coeTypeChart
		       .height(300)
		       .width(524)
		       .colors(pieChartColors)
		       .radius(140)
		       .innerRadius(40)
		       .transitionDuration(1000)
		       .dimension(coeType)
		         .legend(dc.legend().x(440).y(0).gap(5))
				      .on('pretransition', function(coeTypeChart) {
				    	  coeTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
		       .group(typeofCoE);

		 	
		 	 dc.renderAll(); 
		 	 
		 };
   }

   
   
   
   //capability wise chart 
   
   $scope.reportCapabilityChart=function(){
	   var token  = getEncryptedValue();
	   var config = {headers: {
	           'Authorization': token
	           }};
		
		   $http.get("rest/reportDataServices/capabilityChartData",config).success(
			function(response) {
				$scope.tdmresponsedata = response;
				
				//alert(JSON.stringify($scope.tdmresponsedata));
				makeGraphs(response);
			});
		   
		   function makeGraphs(apiData) {

			 //Start Transformations	
			 	var dataSet = apiData;
			 	
			 	//Create a Crossfilter instance
			 	var ndx = crossfilter(dataSet);
			 	
			 	//alert(JSON.stringify(dataSet));
			 	
			 	//Define Dimensions
			 	
			 	var coETrackData = ndx.dimension(function(d) { return d.coETrack; });
			 	var supportType = ndx.dimension(function(d) { return d.supportGroup; });
			 	var geoType = ndx.dimension(function(d) { return d.geo; });
			  var verticalData = ndx.dimension(function(d) { return d.vertical; });
			 	
			 	
			 	//console.log((defectOpenStatus.size()));
			 	
			 	//Calculate metrics
			 	
			 	var TDMbyCoETrack = coETrackData.group();
			 	var typeOfSupport = supportType.group();
			var typeOfGeo = geoType.group();
			 var TDMbyVertical = verticalData.group();
			 	
			 	
			 	$scope.ofs = 0;
			 	var all = ndx.groupAll(); 
			 	
			 				 
			 	var capabilityTypeChart = dc.pieChart("#funding-chart");
			 	var supporTypeChart = dc.barChart("#poverty-chart");
			  var geoTypeChart = dc.barChart("#state-donations");
			 	var verticalTypeChart = dc.pieChart("#funding-chart1");
			 
			 	  $scope.ofs = 0;
			 	  $scope.pag = 7;
			 	
			 	
			 	var pieChartColors = d3.scale.ordinal().range(["#dfb81c","#0F8070","#045259","#d18c2b","#00b8e6","#90b900","#209e91","#e85656"]);
			 	var barChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	var rowChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	
			 	
			 				 	 	
			 	capabilityTypeChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(coETrackData)
			         .legend(dc.legend().x(440).y(0).gap(5))
				      .on('pretransition', function(capabilityTypeChart) {
				    	  capabilityTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return  dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
			       .group(TDMbyCoETrack);
			 	
			 	supporTypeChart
					//.width(300)
					.colors(rowChartColors)
					.height(300)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .xAxis().ticks(4);
				supporTypeChart
			  	  .width(450)
			      .height(300)
			      .colors(barChartColors)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .margins({top: 10, right: 50, bottom: 30, left: 50})
			      .centerBar(false)
			      .gap(10)
			      .elasticY(true)
			     .x(d3.scale.ordinal().domain(supportType))
			      .xUnits(dc.units.ordinal)
			      .renderHorizontalGridLines(true)
			      .renderVerticalGridLines(true)
			      .ordering(function(d){return d.value;})
			       .colorAccessor(function(d){return d.value; })
			      .yAxis().tickFormat(d3.format("s"));
			 	
			 	
			 	geoTypeChart
			  	  .width(550)
			      .height(300)
			      .colors(barChartColors)
			      .dimension(geoType)
			      .group(typeOfGeo)
			      .margins({top: 10, right: 50, bottom: 30, left: 50})
			      .centerBar(false)
			      .gap(10)
			      .elasticY(true)
			     .x(d3.scale.ordinal().domain(geoType))
			      .xUnits(dc.units.ordinal)
			      .renderHorizontalGridLines(true)
			      .renderVerticalGridLines(true)
			      .ordering(function(d){return d.value;})
			       .colorAccessor(function(d){return d.value; })
			      .yAxis().tickFormat(d3.format("s"));
			 	
			 	verticalTypeChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(verticalData)
			        .legend(dc.legend().x(450).y(0).gap(5))
				      .on('pretransition', function(verticalTypeChart) {
				    	  verticalTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return  dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
			       .group(TDMbyVertical);
			 	 
			 	 dc.renderAll(); 
			 };
	   }
   
   
   //type of activity chart
   $scope.activityChartData=function(){
	   var token  = getEncryptedValue();
	   var config = {headers: {
	           'Authorization': token
	           }};
		
		   $http.get("rest/reportDataServices/activityChartData",config).success(
			function(response) {
				$scope.tdmresponsedata = response;
				
				//alert(JSON.stringify($scope.tdmresponsedata));
				makeGraphs(response);
			});
		   
		   function makeGraphs(apiData) {

			 //Start Transformations	
			 	var dataSet = apiData;
			 	
			 	//Create a Crossfilter instance
			 	var ndx = crossfilter(dataSet);
			 	
			 	//alert(JSON.stringify(dataSet));
			 	
			 	//Define Dimensions
			 	
			 	var supportGroup = ndx.dimension(function(d) { return d.supportGroup; });
			 	var supportType = ndx.dimension(function(d) { return d.typeOfSupport; });
			 	var geoType = ndx.dimension(function(d) { return d.geo; });
			  var verticalData = ndx.dimension(function(d) { return d.vertical; });
			 	
			 	
			 	//console.log((defectOpenStatus.size()));
			 	
			 	//Calculate metrics
			 	
			 	var supportGroups = supportGroup.group();
			 	var typeOfSupport = supportType.group();
			var typeOfGeo = geoType.group();
			 var TDMbyVertical = verticalData.group();
			 	
			 	
			 	$scope.ofs = 0;
			 	var all = ndx.groupAll(); 
			 	
			 				 
			 	var capabilityTypeChart = dc.pieChart("#funding-chart");
			 	var supporTypeChart = dc.barChart("#poverty-chart");
			  var geoTypeChart = dc.barChart("#state-donations");
			 	var verticalTypeChart = dc.pieChart("#funding-chart1");
			 
			 	  $scope.ofs = 0;
			 	  $scope.pag = 7;
			 	
			 	
			 	var pieChartColors = d3.scale.ordinal().range(["#dfb81c","#0F8070","#045259","#d18c2b","#00b8e6","#90b900","#209e91","#e85656"]);
			 	var barChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	var rowChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	
			 	
			 				 	 	
			 	capabilityTypeChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(supportGroup)
			         .legend(dc.legend().x(400).y(0).gap(5))
                   .on('pretransition', function(capabilityTypeChart) {
                	   capabilityTypeChart.selectAll('text.pie-slice').text(function(d) {
                   return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                	})
                   })
			       .group(supportGroups);
			 	
			 	supporTypeChart
					//.width(300)
					.colors(rowChartColors)
					.height(300)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .xAxis().ticks(4);
			 	supporTypeChart
			  	  .width(1100)
			      .height(400)
			      .colors(barChartColors)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .margins({top: 10, right: 50, bottom: 100, left: 50})
			      .centerBar(false)
			      .gap(10)
			      .elasticY(true)
			     .x(d3.scale.ordinal().domain(supportType))
			      .xUnits(dc.units.ordinal)
			      .renderHorizontalGridLines(true)
			      .renderVerticalGridLines(true)
			      .ordering(function(d){return d.value;})
			      .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '-10').attr('dy', '-7').attr('transform', "rotate(-50)").style("text-anchor", "end");})
			      .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '0').attr('dy', '0').attr('transform', "rotate(-30)").style("text-anchor", "end");})
			        .colorAccessor(function(d){return d.value; })
			      .yAxis().tickFormat(d3.format("s"));
			 	
			 	
			 	geoTypeChart
			  	  .width(550)
			      .height(300)
			      .colors(barChartColors)
			      .dimension(geoType)
			      .group(typeOfGeo)
			      .margins({top: 10, right: 50, bottom: 30, left: 50})
			      .centerBar(false)
			      .gap(10)
			      .elasticY(true)
			     .x(d3.scale.ordinal().domain(geoType))
			      .xUnits(dc.units.ordinal)
			      .renderHorizontalGridLines(true)
			      .renderVerticalGridLines(true)
			      .ordering(function(d){return d.value;})
			       .colorAccessor(function(d){return d.value; })
			      .yAxis().tickFormat(d3.format("s"));
			 	
			 	verticalTypeChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(verticalData)
			       .legend(dc.legend().x(450).y(0).gap(5))
				      .on('pretransition', function(verticalTypeChart) {
				    	  verticalTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return  dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
			       .group(TDMbyVertical);
			 	 
			 	 dc.renderAll(); 
			 };
	   }
   
   
   
   
   //high impact chart
   
   $scope.highImpactChart=function(){
	   var token  = getEncryptedValue();
	   var config = {headers: {
	           'Authorization': token
	           }};
		
		   $http.get("rest/reportDataServices/highImpactChart",config).success(
			function(response) {
				$scope.tdmresponsedata = response;
				
				//alert(JSON.stringify($scope.tdmresponsedata));
				makeGraphs(response);
			});
		   
		   function makeGraphs(apiData) {

			 //Start Transformations	
			 	var dataSet = apiData;
			 	
			 	//Create a Crossfilter instance
			 	var ndx = crossfilter(dataSet);
			 	
			 	
			 	//Define Dimensions
			 	
			 	var highImpactContribution = ndx.dimension(function(d) { return d.highImpactContribution; });
			 	var supportType = ndx.dimension(function(d) { return d.typeOfSupport; });
			 	var supportType = ndx.dimension(function(d) { return d.typeOfSupport; });
			  var verticalData = ndx.dimension(function(d) { return d.vertical; });
			 	
			 	
			 	//console.log((defectOpenStatus.size()));
			 	
			 	//Calculate metrics
			 	
			 	var highImpact = highImpactContribution.group();
			var typeOfSupport = supportType.group();
			var typeOfSupport = supportType.group();
			 var TDMbyVertical = verticalData.group();
			 	
			 	
			 	$scope.ofs = 0;
			 	var all = ndx.groupAll(); 
			 	
			 				 
			 	var supportGroupChart = dc.pieChart("#funding-chart");
			 	var supporTypeChart = dc.barChart("#poverty-chart");
			  var supporTypeChart = dc.barChart("#state-donations");
			 	var verticalTypeChart = dc.pieChart("#funding-chart1");
			 
			 	  $scope.ofs = 0;
			 	  $scope.pag = 7;
			 	
			 	
			 	var pieChartColors = d3.scale.ordinal().range(["#dfb81c","#0F8070","#045259","#d18c2b","#00b8e6","#90b900","#209e91","#e85656"]);
			 	var barChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	var rowChartColors = d3.scale.ordinal().range(["rgba(255, 113, 189, 0.9)",
			 		   "rgba(9, 191, 22, 0.9)",
			            "rgba(6, 239, 212, 0.9)",		                                   
			            "rgba(236, 255, 0, 0.9)",
			            "rgba(255, 159, 64, 0.9)",
			            "rgba(255, 31, 0, 0.9)"]);
			 	
			 	
			 				 	 	
			 	supportGroupChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(highImpactContribution)
			        .legend(dc.legend().x(358).y(-1).gap(5))
				      .on('pretransition', function(supportGroupChart) {
				    	  supportGroupChart.selectAll('text.pie-slice').text(function(d) {
				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
			       .group(highImpact);
			 	
			 	supporTypeChart
					//.width(300)
					.colors(rowChartColors)
					.height(300)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .xAxis().ticks(4);
			 	
			 	supporTypeChart
			  	  .width(1100)
			      .height(400)
			      
			      .colors(barChartColors)
			      .dimension(supportType)
			      .group(typeOfSupport)
			      .margins({top: 10, right: 50, bottom: 130, left: 50})
			      .centerBar(false)
			      .gap(10)
			      .elasticY(true)
			      
			      	
			     .x(d3.scale.ordinal().domain(supportType))
			      .xUnits(dc.units.ordinal)
			      .renderHorizontalGridLines(true)
			      .renderVerticalGridLines(true)
			      .ordering(function(d){return d.value;})
			      .xAxis().orient("bottom")
			      .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '-10').attr('dy', '-7').attr('transform', "rotate(-50)").style("text-anchor", "end");})
			       .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '0').attr('dy', '0').attr('transform', "rotate(-30)").style("text-anchor", "end");})
			     .colorAccessor(function(d){return d.value; })
			       .yAxis().tickFormat(d3.format("s"));
			 
			 	
			 	verticalTypeChart
			       .height(300)
			       .width(524)
			       .colors(pieChartColors)
			       .radius(140)
			       .innerRadius(40)
			       .transitionDuration(1000)
			       .dimension(verticalData)
			         .legend(dc.legend().x(450).y(0).gap(5))
				      .on('pretransition', function(verticalTypeChart) {
				    	  verticalTypeChart.selectAll('text.pie-slice').text(function(d) {
				            return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
				        })
				    })
			       .group(TDMbyVertical);
			 	 
			 	 dc.renderAll(); 
			 };
	   }
   */
   
//dropdown ends here
$scope.ReportData=function(){
    	
    	$state.go('reportdata');

    	console.log("response");
    	$scope.getVerticalData();
    
    	$scope.getGeoDropData();
    	$scope.getTypeofSupportData();
    	$scope.getCoETrackData();
    	$scope.getHighImpactData ();
    }



    $scope.getVerticalData = function(){
    	var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    $http.get("rest/reportDataServices/getverticalData",config).success(function (response) {
    	$scope.verticaldrops = response; 
    	
    	console.log($scope.verticaldrops);
    });
    }

    $scope.getGeoDropData = function(){
    	var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    $http.get("rest/reportDataServices/getGeoDropData",config).success(function (response) {
    	$scope.Geodrops = response; 
    	console.log($scope.Geodrops);
    	
    });
    }
    $scope.getTypeofSupportData = function(){
    	var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    $http.get("rest/reportDataServices/getTypeofSupportData",config).success(function (response) {
    	$scope.TypeofSupportdrops = response; 
    	console.log($scope.TypeofSupportdrops);
    });
    }
    $scope.getCoETrackData = function(){
    	var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    $http.get("rest/reportDataServices/getCoETrackData",config).success(function (response) {
    	$scope.CoETrackdrops = response; 
    	console.log($scope.CoETrackdrops);
    });
    }
    $scope.getHighImpactData = function(){
    	var token  = getEncryptedValue();
        var config = {headers: {
                'Authorization': token
                }};
    $http.get("rest/reportDataServices/getHighImpactData",config).success(function (response) {
    	$scope.highimpactdrops = response; 
    	console.log($scope.highimpactdrops);
    });
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
    