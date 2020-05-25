/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.charts.testcases')
      .controller('DesignAnalyzeCtrl', DesignAnalyzeCtrl);

  /** @ngInject */
  function DesignAnalyzeCtrl($sessionStorage,$scope,AES,localStorageService, UserService,baConfig, $rootScope,$element, layoutPaths,$http,$base64) {
	  function getEncryptedValue()
	  {
		  var username= localStorageService.get('userIdA');
		     var password= localStorageService.get('passwordA');
	        var tokeen =$base64.encode(username+":"+password);
	        
	        return tokeen;
	        }   
	  var dashboardName = localStorageService.get('dashboardName');
	  var owner = localStorageService.get('owner');
	  var domainName = localStorageService.get('domainName');
	  var projectName = localStorageService.get('projectName');
	  $scope.cancel = function () {
		  $rootScope.tcanalyse.close();
		};
	 
		  var token  = AES.getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	        var vardtfrom = "";
	    	var vardtto = "";
	    	

	    	if ($rootScope.dfromvalTc == null || $rootScope.dfromvalTc == undefined
	    			|| $rootScope.dfromvalTc == "") {
	    		vardtfrom = "-";
	    	} else {
	    		vardtfrom = $rootScope.dfromvalTc;
	    	}

	    	if ($rootScope.dtovalTc == null || $rootScope.dtovalTc == undefined
	    			|| $rootScope.dtovalTc == "") {
	    		vardtto = "-";
	    	} else {
	    		vardtto = $rootScope.dtovalTc;
	    	}
	    	
	    	vardtfrom = localStorageService.get('dtfrom');
			//vardtto = localStorageService.get('dtto');
			vardtto = localStorageService.get('dttoPlus');	
			
		    $http.get("./rest/almMetricsServices/designDataLevel?dashboardName="+dashboardName+"&domainName="+domainName+"&projectName="+projectName+"&vardtfrom="+vardtfrom+"&vardtto="+vardtto+"&timeperiod="+$rootScope.timeperiodTc,config).success(function (response) {
		    	 $scope.designdata = response; 
		    	 makeGraphs(response);
		     });				
    
	  


       
   
 
function makeGraphs(apiData) {

//Start Transformations	
	var dataSet = apiData;
	
	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);
	
	//alert(JSON.stringify(dataSet));
	
	//Define Dimensions
	var testID = ndx.dimension(function(d) { return d.testID; });
	var reqID = ndx.dimension(function(d) { return d.reqID; });
	var testDesigner = ndx.dimension(function(d) { return d.testDesigner; });
	var testName = ndx.dimension(function(d) { return d.testName; });
	var testDescription = ndx.dimension(function(d) { return d.testDescription; });
	var testType = ndx.dimension(function(d) { return d.testType; });
	var testDesignStatus = ndx.dimension(function(d) { return d.testDesignStatus; });
	var testCreationDate = ndx.dimension(function(d) { return d.testCreationDate; });
	
	var testAutomationStatus = ndx.dimension(function(d) { return d.automationStatus; });
	var testAutomationType = ndx.dimension(function(d) { return d.automationType; });
 
	//var defectOpenStatus = ndx.dimension(function(d) { return d.status("Open"); });
	
	//console.log((defectOpenStatus.size()));
	
	//Calculate metrics
	var testByID = testID.group(); 
	var testByReq = reqID.group();
	var testByDesigner = testDesigner.group(); 
	var testByName = testName.group();
	var testByDescription = testDescription.group();
	var testByType =  testType.group();
	var testByDesignStatus =  testDesignStatus.group();
	var testByCreationDate =  testCreationDate.group();

	var testByAutomationStatus = testAutomationStatus.group();
	var testByAutomationType = testAutomationType.group();
	
	// total tests 
	var totalTests = dc.numberDisplay("#total-tests");
	$scope.ofs = 0;
	var all = ndx.groupAll(); 
	 
	
	//Calculate Groups
	var DesignByStatus =testDesignStatus.group().reduceSum(function(d) {
		return d.status;
	});

	var DesignByAutomationStaus = testAutomationStatus.group().reduceSum(function(d) {
		return d.testAutomationStatus;
	});
	
	var DesignByType=testAutomationType.group().reduceSum(function(d) {
		return d.automationType;
	});
	
	function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(6);
            }
        };
    }
    var topGroup = getTops(testByAutomationStatus);
	
	
	var designStatusChart = dc.pieChart("#status-chart");
	var designTypeChart = dc.pieChart("#type-chart");
	var designOwnerChart = dc.barChart("#automation-chart");
	$scope.designTable = dc.dataTable("#datatable");
	  $scope.ofs = 0;
	  $scope.pag = 7;
	
	
	var pieChartColors = d3.scale.ordinal().range(["rgba(255, 134, 0, 1)","rgba(236, 255, 0, 1)","rgba(255, 31, 0, 1)","rgba(9, 191, 22, 1)", "rgba(153, 102, 255, 0.8)", "rgba(153, 102, 255, 1)","rgba(67, 154, 213, 1)"]);
	var pieChartColors1 = d3.scale.ordinal().range(["rgba(255, 0, 174, 0.8)", "rgba(47, 0, 255, 0.8)", "rgba(6, 239, 212, 0.8)", "rgba(189, 5, 171, 0.8)", "rgba(153, 102, 255, 0.8)",	"rgba(255, 245, 51, 0.8)", "rgba(255, 113, 189, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(153, 102, 255, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(255, 159, 64, 0.8)", "rgba(255, 99, 132, 0.8)"]);
	var barChartColors = d3.scale.ordinal().range(["#97516B","#dfb81c","#90b900","#209e91","#e85656"]);
	var rowChartColors = d3.scale.ordinal().range(["#dfb81c","#90b900","#209e91","#e85656"]);
	
	
/*	var selectField = dc.selectMenu('#menuselect')
    .dimension(defectPriority)
    .group(defectsByPriority); */
	
	var selectField = dc.selectMenu('#menuselect1')
    .dimension(testAutomationStatus)
    .group(testByAutomationStatus);
	
	var selectField = dc.selectMenu('#menuselect2')
    .dimension(testAutomationType)
    .group(testByAutomationType);
	
	var selectField = dc.selectMenu('#menuselect3')
    .dimension(testDesignStatus)
    .group(testByDesignStatus);
	
	totalTests
	.formatNumber(d3.format("d"))
	.valueAccessor(function(d){return d; })
	.group(all);

	designOwnerChart
	.width(450)
    .height(300)
    .colors(barChartColors)
    .dimension(testAutomationStatus)   
    .group(topGroup)
    .margins({top: 10, right: 80, bottom: 30, left: 50})
    .centerBar(false)
    .gap(5)
    .elasticY(true)
   .x(d3.scale.ordinal().domain(testAutomationStatus))
    .xUnits(dc.units.ordinal)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .ordering(function(d){return d.value;})
    .colorAccessor(function(d){return d.value; })
    .yAxis().tickFormat(d3.format("s"));
	    
	 	
	designStatusChart
	.height(300)
    .width(350)
    .colors(pieChartColors)
    .radius(140)
    .innerRadius(40)
    .transitionDuration(1000)
    .dimension(testDesignStatus)
     .legend(dc.legend().x(315).y(0).gap(5))
    .on('pretransition', function(designStatusChart) {
  	  designStatusChart.selectAll('text.pie-slice').text(function(d) {
          //return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
          return Math.round(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
      })
	    })
    .group(testByDesignStatus);
	
	
	designTypeChart
	.height(300)
    .width(350)
    .colors(pieChartColors1)
    .radius(140)
    .innerRadius(40)
    .transitionDuration(1000)
    .dimension(testAutomationType)
    //.legend(dc.legend().x(300).y(0).gap(5))
	.on('pretransition', function(designTypeChart) {
		designTypeChart.selectAll('text.pie-slice').text(function(d) {
	       return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
	   })
	 })
    .group(testByAutomationType);
	 
 
//Data table for defects	 
		$scope.designTable	
		.width(1200)
		.height(1200)
	    .dimension(testID)
	    .group(function (d) {
	    return " ";
	    		})
	    .size(Infinity)
	    .columns([{label:"Name", format:function (d) {
	    return d.testName;
	}},{label:"Type", format:
	function (d) {
	    return d.testType;
	}
	},
	{label:"Automation", format:
	function (d) {
	    return d.testAutomationStatus;
	}
	},{label:"Creation Date", format:
	function (d) {
	    return d.testCreationDate;
	}
	},
	{label:"Status ", format:function (d) {
	    return d.testDesignStatus;
	}
	}]);

			function display() {
			    d3.select('#begin')
			        .text($scope.ofs);
			    d3.select('#end')
			        .text($scope.ofs+$scope.pag-1);
			    d3.select('#last')
			        .attr('disabled', $scope.ofs-$scope.pag<0 ? 'true' : null);
			    d3.select('#next')
			        .attr('disabled', $scope.ofs+$scope.pag>=ndx.size() ? 'true' : null);
			    d3.select('#size').text(ndx.size());
			}

			function update() {
				 // alert($scope.ofs);
				  $scope.designTable.beginSlice($scope.ofs);
				  $scope.designTable.endSlice($scope.ofs+$scope.pag);
				  display();
				  //$scope.dashTable.render();
			}
			$scope.next=function() {
				//alert("next");
			    $scope.ofs += $scope.pag;
			    update();
			    $scope.designTable.redraw();
			  
			};
			$scope.last=function() {
				{
			    $scope.ofs -= $scope.pag;
			    update();
			    $scope.designTable.render();
					}
			  
			};
			
			
			update();
	 dc.renderAll(); 
	 
};

}


})();
