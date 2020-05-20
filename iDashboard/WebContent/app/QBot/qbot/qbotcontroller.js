/**
 * @author v.lugovsky created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('MetricsPortal.pages')
      .controller('qbotcontroller', qbotController);

  /** @ngInject */
  function qbotController($scope,$location,$stateParams,$http,$uibModal,$timeout) {
	  

	// alert("inside controller "+$stateParams.homeSearchTxt);
	  
	  $scope.keyword=$stateParams.homeSearchTxt;
	  $scope.keyword=atob($scope.keyword);
	  //console.log( $scope.keyword);
	  $scope.refine=function(index){
		  
		  var keyword1 =$scope.didYouMeanKeys1[index].tite;
		  
		  $scope.keyword = keyword1.trim();
		
	   	$scope.searchMain(); 
		
	  };
	  
	
	  $scope.searchMain=function()
	  {
		  		  		  
		  if($scope.keyword.length>0)
		  {
			
		  //console.log("in search main keyword" + $scope.keyword);
		 
		  $scope.showSummary=false;
		  $scope.showTable=false;
			$scope.showResult=false;
	  		$scope.slickUpdate=false;
	  		$scope.showTable=false;
    		$scope.nextHide=false;
    		$scope.prevHide=false;
    		$scope.slickUpdate1=true;
    		$scope.onlygraph=false;
    		$scope.showPageLimits=false;
    		$scope.dashbotmenu=false;
    		$scope.prevbtn=false;
    		$scope.nextbtn=true;
    		$scope.showCorrectResult=false;
    		$scope.moreObjects = "";
    		$scope.loadingImage=true;
    		
    		$scope.getTypeTabs();

	  }

    		 else{
    			 	 
    			  $scope.showRefineSearch=true;
    			  $scope.loadingImage=false;
    			  $scope.showSummary=false;
    			  $scope.showTable=false;
    				$scope.showResult=false;
    		  		$scope.slickUpdate=false;    		  	
    		  		$scope.showCorrectResult=false;
    		  		$scope.showPageLimits=false;
    	    		$scope.dashbotmenu=false;
    		 }
    		


    		 

    		

	

	  };
	  
	  
	  
	  $scope.drawGraph=function(dimension,group,chartid)
	  	  	  
		{
		  
		  $scope.image=[];
		 for(var i=0;i<group.length;i++)
			 {
			 var chart = [];
			  var dimension_1 = dimension[i];
			
			  var group_1 = group[i];
			  var chartid_1 = chartid[i];
			   console.log("chart id" + chartid_1);
			  console.log("group id" +group_1);
			  var datatypeForGraph=group_1.all()[0].key;
				  console.log("datatypeForGraph" + datatypeForGraph);
				  console.log("datatypeForGraph type of" + typeof(datatypeForGraph));
			  
			  if((typeof(datatypeForGraph))=="object")
			  {
				  $scope.image[i]=true;
				  console.log("inside if");
			       var minDate = dimension_1.bottom(1)[0][$scope.keysForAccess[i]];
			       var maxDate = dimension_1.top(1)[0][$scope.keysForAccess[i]];
			       console.log(minDate+"date1");
			       console.log(maxDate+"date1");
			       $scope.minDatePop=minDate;
			       $scope.maxDatePop=maxDate;
			       $scope.dimensionPop=dimension_1;
			       $scope.groupPop=group_1;
			       
			      
			       
			
				  chart[i]=dc.lineChart(chartid_1);
				  
				  chart[i]
		              .height(220)
		              .width(330)
		              .dimension(dimension_1)
		              .group(group_1)
		              .renderArea(false)
		              .transitionDuration(1500)
		              .x(d3.time.scale().domain([minDate, maxDate]))
		              .elasticX(true)
		              .mouseZoomable(true)
		              .colors( ['rgb(242,250,6)'] )
		              .brushOn(true)
		              .renderDataPoints(true)
		              .renderlet(function (chart) {chart.selectAll("g.x text").attr('x', '-40').attr('dx', '16').attr('dy', '-7').attr('transform', "rotate(-90)");})
		              .xAxisLabel("");
		             
				  
				  chart[i].render();
				  
				  
				
			  }
			  
			  
			  else if((typeof(datatypeForGraph))!="object" && (group_1.size()>=6))
			 {	  
				  $scope.image[i]=false;
			  	chart[i] = dc.pieChart(chartid_1);
				  	
			  	chart[i]
			  	.width(330)
		        .height(220)
		        .radius(90)
		        .innerRadius(35)
		        .transitionDuration(1000)
		        .dimension(dimension_1)
		        .group(group_1)
			  	.render();	
				    			    
			 	}
			 else
				 {
				 $scope.image[i]=false;
					$scope.chartsType=["BarChart","RowChart","PieChart"];
					
					$scope.chartIndex = (i+2) % ($scope.chartsType.length);
					 
					var selectedGraph =$scope.chartsType[$scope.chartIndex];
					if(selectedGraph=="RowChart")
					{
						
						 chart[i] = dc.rowChart(chartid_1);
						  	
						  	chart[i]
							    .width(330)
							    .height(220)
							    .dimension(dimension_1)
							    .ordinalColors(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'])
							    .group(group_1)
							    .render();
						
					}
					else if(selectedGraph=="BarChart")
						{
					
						 chart[i] = dc.barChart(chartid_1);
						  	
						  	chart[i]
						  	.width(330)
						  	
					        .height(220)
					        .transitionDuration(1000)
						    .dimension(dimension_1)
						    .group(group_1)
						    .margins({top: 10, right: 50, bottom: 30, left: 50})
						    .centerBar(false)
						    .gap(1)
					        .elasticY(true)
					        .x(d3.scale.ordinal().domain(dimension_1))
					        .xUnits(dc.units.ordinal)
				
					        .ordering(function(d){return d.value;})
					        
					        .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '40').attr('dy', '-7').attr('transform', "rotate(-90)");})
					        .yAxis().tickFormat(d3.format("s"));

						  	chart[i].colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);
						  	chart[i].render();
						}
					else
						{
						
						chart[i] = dc.pieChart(chartid_1);
					  	
					  	chart[i]
					  	.width(330)
				        .height(220)
				        .radius(90)
				        .innerRadius(35)
				        .transitionDuration(1000)
				        .dimension(dimension_1)
				        .group(group_1)
				   
				
				        .render();
						}
				
				 } 
			 }
		 
		// dc.redrawAll();
		  
		};
	  
	  $scope.drawChart=function(dimension,group,chartid)
	  {
		  console.log("drawChart:0000 "+chartid);
			$scope.chartsType=["BarChart","RowChart","PieChart"];
			
			$scope.chartIndex = index % ($scope.chartsType.length);
			
			
			var chart =$scope.chartsType[$scope.chartIndex];
			
			console.log(chart);
			
			  
				  $scope.drawGraph(dimension,group,chartid);
	    	  
	  };
	  
	  $scope.makeGraphs=function(crossFilterData,keysForAccess,index)
	  {			
		  	 		 
		  $scope.ndx= crossfilter($scope.crossFilterData);
					  		  // get dimension
		  $scope.dimensions = [];
		  $scope.groups =[];
		  $scope.chartIds=[];
		  $scope.chartIdsss=[];
		  $scope.chartIdsssForGraph=[]; 
		  $scope.chartIds1=[];
		  $scope.chartIdsss1=[];
		  $scope.chartIdsssForGraph1=[];
		  $scope.chartIds2=[];
		  $scope.chartIdsss2=[];
		  $scope.chartIdsssForGraph2=[];
		  
			for(var i=0;i<keysForAccess.length;i++)
			{			
			var temp = keysForAccess[i];
			console.log(temp);
			$scope.dimensions.push($scope.ndx.dimension(function(d) { return d[temp]; }));
			
			$scope.groups.push($scope.dimensions[i].group());
			$scope.chartIds[i]="#div"+"_"+index+"_"+i;
			$scope.chartIdsss[i]="div_"+index+"_"+i;
			$scope.chartIdsssForGraph.push({id:"div_"+index+"_"+i,label:keysForAccess[i]});
			
			$scope.chartIds1[i]="#divhide"+"_"+index+"_"+i;
			$scope.chartIdsss1[i]="divhide_"+index+"_"+i;
			$scope.chartIdsssForGraph1.push({id:"divhide_"+index+"_"+i,label:keysForAccess[i]});
			
			
			}
			
			if($scope.selectedCategoryValue!= null)
			{
			var categoryType = $scope.selectedCategoryValue;	
			var filterByCategory = $scope.ndx.dimension(function(d) { return d[categoryType]; }) ;
			console.log()
			
			}
			
			
			console.log($scope.chartIdsssForGraph);
			
			var all = $scope.ndx.groupAll();
			
			
			  var totalCount = dc.numberDisplay("#total-count");
			  totalCount
				.formatNumber(d3.format("d"))
				.valueAccessor(function(d) { $scope.totalvaluecount=d; return d; })
				.group(all)
				.render();
			
			var dimension_val = null;
			var group_val = null;
			var chart_val = null;
			
			dimension_val = $scope.dimensions;
			group_val = $scope.groups;
			if($scope.onlygraph==true)
				{
			chart_val = $scope.chartIds1;}
			else 
				{
				chart_val = $scope.chartIds;
				}
		
								
			setTimeout(function () {
			$scope.drawGraph(dimension_val,group_val,chart_val);},200);
			
			
	  };
	  
	  
	  
	  $scope.drawDataTable=function(crossFilterData,keysForAccess,index)
		{
		  
		  $scope.ofs = 0;
		  $scope.pag = 5;
		  
			  if(crossFilterData.length>$scope.pag)
				  {
				  $scope.showPageLimits=true;
				  }
			  else
				  {
				  $scope.showPageLimits=false;
				  }
		  
			$scope.dashTable=dc.dataTable("#data-table");
			 
			var i=0;
			
			var all = $scope.ndx.groupAll();
			
			  var totalCount = dc.numberDisplay("#total-count");
			  totalCount
				.formatNumber(d3.format("d"))
				.valueAccessor(function(d){return d;})
				.group(all)
				.render();
			
			$scope.dataDimension=[];
			$scope.dataDimension1=[];
			
			var dataTableKeys =Object.keys(crossFilterData[0]);
			console.log("dataTableKeys" + dataTableKeys);
			
			var tem2;
			var tem1;
			
			for(var i=0;i<dataTableKeys.length;i++)
			{	
				console.log("idFieldsList from table 2" + $scope.idFieldsList);
                if(dataTableKeys[i] == $scope.idFieldsList){
                    console.log("primary id " + dataTableKeys[i]);
                    tem1 =  dataTableKeys[i];
                    tem2 = dataTableKeys[0];
                    dataTableKeys[i] = tem2;
                    dataTableKeys[0] = tem1;
                }
                
			}
			
			
			for(var i=0;i<dataTableKeys.length;i++)
			{			
			var temp = dataTableKeys[i];
			var primaryid = $scope.idFieldsList;
			// console.log(temp);
			// $scope.dataDimension.push(ndx.dimension(function(d) { return
			// d[temp]; }));
			// alert(temp);
			var temp1=dataTableKeys[i];
			$scope.dataDimension.push($scope.ndx.dimension(function(d) { 
			
				/*if(typeof(d[temp])=="object")
					{
					var stringifyformat = JSON.stringify(d[temp]);
					
					var substringed = stringifyformat.substring(1,11);
					d[temp]= substringed;
					}*/
				
				return d[temp]; }));
			// console.log("dataDimension" + $scope.dataDimension);
			// $scope.dataDimension1.push({label:temp1,format:function(d)
			// {return d[temp]}});
			}
			var results=[];
			var dic =[];
			{
				$scope.keysForData=[];
				$scope.keysForData=dataTableKeys;
				// console.log("keysForData" + $scope.keysForData);
				for(var j=0;j<$scope.keysForData.length;j++)
					{					
					var temp=null;
					temp=$scope.keysForData[j];
					
					
					dic.push({label:$scope.keysForData[j],format:function(d,lib){
						
					
						results=d[lib];

						// console.log("dic" + JSON.stringify(dic));
						// console.log("results in dic" + results);

						

						// alert(results.length);
						/*
						 * if(results.length>12){ var str=results;
						 * results=str.substring(0,8)+"..."; }
						 */
						return results;}});
					}
			
				
			}
			var dataDim=$scope.dataDimension;
			
			var dataDim1=$scope.dataDimension1;
			
			
			
			
			console.log(dic);	
			
			$scope.dashTable	
			.width(800)
			.height(800)
		    .dimension(dataDim[0])
		    .group(function (d) {
		     return " ";
		    		})
		    .size(Infinity)
		    .columns(dic);

				function display() {
					if($scope.ofs>=0 && $scope.ofs<$scope.ndx.size())
						{
					
							    d3.select('#begin').text($scope.ofs+1);
						}
					if(($scope.ofs+$scope.pag)<=$scope.ndx.size())
				    	{	
							    d3.select('#end').text($scope.ofs+$scope.pag);
				    
				    		}
				    else
				    	{
							    	 d3.select('#end').text($scope.ndx.size());				    	
				    	}
				    
				    d3.select('#last').attr('disabled', $scope.ofs-$scope.pag<0 ? 'true' : null);
				    				   				    
				    d3.select('#next').attr('disabled', $scope.ofs+$scope.pag<=$scope.ndx.size() ?  'true' : null);
				    
				    d3.select('#size').text($scope.totalvaluecount);
				 
				}
				console.log(typeof("ndx.size()"));
				console.log(typeof("#total-count"));
				console.log($scope.ofs);
				function update() {
					 // alert($scope.ofs);
					  $scope.dashTable.beginSlice($scope.ofs);
					  $scope.dashTable.endSlice($scope.ofs+$scope.pag);
					  display();
					  // $scope.dashTable.render();
				}
				$scope.next1=function() {
					// alert("next");
					
					if($scope.ofs+$scope.pag<$scope.totalvaluecount)
						{
							$scope.ofs += $scope.pag;
							
							update();
							$scope.dashTable.redraw();
							$scope.pre=false;
							
						}
					else{
						$scope.nex=true;
					
					}
				  
				};
				$scope.last=function() {
					
						if($scope.ofs-$scope.pag>=0)
							{
								    $scope.ofs -= $scope.pag;
								    update();
								    $scope.dashTable.render();
								    $scope.nex=false;
							}
						else{
							$scope.pre=true;
							
						}
				  
				};
				
				
				update();
				
				$scope.dashTable.render();
		}
	  
	  
	  
	  $scope.getGraphData=function(tabs,data,index)
	  {
		  
		
		  var keys=Object.keys(data);
		  $scope.strtIndx=0;
		  
		  $scope.summaryListInPanel=[];
		
		  var temp = [];
		  var summaryList1 = [];
		  $scope.summaryList = [];
		  
		 console.log("data length" + data.length);
		  console.log("keys" + keys);
		  console.log("keys" + keys.length);
		  console.log("tabs" + tabs);
		  // console.log("data" + JSON.stringify(data));
		
		  // Single Summary for model handled
		  if(keys.length == 1){
			 
			 var summaryList = data.summary;
			
			  var keyForSummary = Object.keys(summaryList);
			  var summaryData = data.summary[keyForSummary];
			  
			// console.log("Single summaryList" + JSON.stringify(summaryList));
			 // console.log("Single keyForSummary" + keyForSummary);
			  // console.log("Single keyForSummary" +
				// JSON.stringify(summaryData));
			  
		  }
		  else if(keys.length > 1)
			  {
			  
			  // Single Summary for User model handled
			  if(data.length == "" || data.length == null){
				
				  var summaryList = data.summary;
				
				  var keyForSummary = Object.keys(summaryList);
				 
				  var summaryData = data.summary[keyForSummary];
				  
				// console.log("user summaryList" +
				// JSON.stringify(summaryList));
				 // console.log("user keyForSummary" + keyForSummary);
				  // console.log("user keyForSummary" +
					// JSON.stringify(summaryData));
			  }
			  
			 
			  // Multiple summary handled
			  else {
				  
				  for(var i=0;i<keys.length;i++){
					  
					  summaryList1[i]=Object.keys(data[i]);
					 
					}
				
				  for (var j = 0; j < summaryList1.length; j++){
					  
					  var data1 = Object.keys(data[j].summary);
					  
					  temp[j] = data1;
					  
					 
				  }
				  
				  var keyForSummary = temp;
				  
				  for(var k = 0; k < keyForSummary.length; k++ ){
						 
						 var summaryData = data[k].summary[keyForSummary[k]];
										 
					 }
				  
				// console.log("Multiple summaryList" +
				// JSON.stringify(summaryList));
				  console.log("Multiple keyForSummary" + keyForSummary);
				  console.log("Multiple keyForSummary" + JSON.stringify(summaryData));
				  
				  // console.log(" summaryData" + summaryData);
				  
				
			  }
			  			  
			  }
		  
		 
		 
		// console.log("summaryData" + JSON.stringify(summaryData)); //full data
		  	
		  	$scope.panelHeading = keyForSummary;
		  	// console.log(keyForSummary);
		  	
		  	if(summaryData.AttributesData.length==1)
		  		{
		  			$scope.limitForSummaryPerPanel=6;
		  			var keysForPanel = Object.keys(summaryData.AttributesData[0]);
		  			if(keysForPanel.length>1)
		  				{
		  			$scope.panelSize=(Math.round(keysForPanel.length/$scope.limitForSummaryPerPanel));
		  			var summaryList = summaryData.AttributesData[0];
		  			var keyListForSummary=summaryData.order;
		  			
				  	for (var aa=0; aa<keyListForSummary.length;aa++)
				  		{
				  		$scope.summaryListInPanel.push({Key:keyListForSummary[aa],value:summaryList[keyListForSummary[aa]]});
				  		}
				  	
		  				}
				  	console.log("summaryListInPanel" + $scope.summaryListInPanel);
				  	$scope.showSummary=true;
		  		}
		  /*
			 * console.log("showSummary:"+$scope.showSummary); console.log("tab
			 * index:"+index);
			 */
		  // $scope.crossFilterData = "";
		  // var
			// dummydata=[{"def_closingDateFormatted":"02/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561640,"def_severity":"Low","def_priority":"High","def_detectedBy":0,"def_rootCause":"DataIssue","def_causedBy":"tc002","def_detectionPhase":"UnitTesting","def_closingDate":1380676278000,"def_id":"def_001","def_name":"aa1","def_status":"Open","project":"Proj001","module":"tc_effectiveness"},{"def_closingDateFormatted":"03/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561642,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc003","def_detectionPhase":"PerformanceTesting","def_closingDate":1380762678000,"def_id":"def_002","def_name":"aa2","def_status":"Fixed","project":"Proj002","module":"Scheduler"},{"def_closingDateFormatted":"04/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561634,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc004","def_detectionPhase":"IntegrationTesting","def_closingDate":1380849078000,"def_id":"def_003","def_name":"aa3","def_status":"Closed","project":"Proj003","module":"Admin"},{"def_closingDateFormatted":"05/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561637,"def_severity":"Low","def_priority":"High","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc005","def_detectionPhase":"AcceptanceTesting","def_closingDate":1380935478000,"def_id":"def_004","def_name":"aa4","def_status":"New","project":"Proj001","module":"Devops"},{"def_closingDateFormatted":"06/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561632,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"CodingError","def_causedBy":"tc006","def_detectionPhase":"SystemTesting","def_closingDate":1381021878000,"def_id":"def_005","def_name":"aa5","def_status":"Open","project":"Proj002","module":"Actions"},{"def_closingDateFormatted":"07/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561640,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"DataIssue","def_causedBy":"tc007","def_detectionPhase":"UnitTesting","def_closingDate":1381108278000,"def_id":"def_006","def_name":"aa6","def_status":"Fixed","project":"Proj003","module":"Optimiser"},{"def_closingDateFormatted":"08/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561642,"def_severity":"Medium","def_priority":"High","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc008","def_detectionPhase":"PerformanceTesting","def_closingDate":1381194678000,"def_id":"def_007","def_name":"aa7","def_status":"Closed","project":"Proj001","module":"tc_effectiveness"},{"def_closingDateFormatted":"09/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561634,"def_severity":"High","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc009","def_detectionPhase":"IntegrationTesting","def_closingDate":1381281078000,"def_id":"def_008","def_name":"aa8","def_status":"New","project":"Proj002","module":"Scheduler"},{"def_closingDateFormatted":"10/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561637,"def_severity":"Low","def_priority":"Low","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc010","def_detectionPhase":"AcceptanceTesting","def_closingDate":1381367478000,"def_id":"def_009","def_name":"aa9","def_status":"Open","project":"Proj003","module":"Admin"},{"def_closingDateFormatted":"11/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561632,"def_severity":"Medium","def_priority":"Low","def_detectedBy":0,"def_rootCause":"CodingError","def_causedBy":"tc004","def_detectionPhase":"SystemTesting","def_closingDate":1381453878000,"def_id":"def_010","def_name":"aa10","def_status":"Fixed","project":"Proj001","module":"Devops"},{"def_closingDateFormatted":"02/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561640,"def_severity":"High","def_priority":"High","def_detectedBy":0,"def_rootCause":"DataIssue","def_causedBy":"tc005","def_detectionPhase":"SystemTesting","def_closingDate":1380676278000,"def_id":"def_011","def_name":"aa11","def_status":"Closed","project":"Proj002","module":"Actions"},{"def_closingDateFormatted":"03/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561642,"def_severity":"Low","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc006","def_detectionPhase":"UnitTesting","def_closingDate":1380762678000,"def_id":"def_012","def_name":"aa12","def_status":"New","project":"Proj003","module":"Optimiser"},{"def_closingDateFormatted":"04/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561634,"def_severity":"Medium","def_priority":"Low","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc007","def_detectionPhase":"PerformanceTesting","def_closingDate":1380849078000,"def_id":"def_013","def_name":"aa13","def_status":"Open","project":"Proj001","module":"tc_effectiveness"},{"def_closingDateFormatted":"05/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561637,"def_severity":"High","def_priority":"High","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc008","def_detectionPhase":"IntegrationTesting","def_closingDate":1380935478000,"def_id":"def_014","def_name":"aa14","def_status":"Fixed","project":"Proj002","module":"Scheduler"},{"def_closingDateFormatted":"06/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561632,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"CodingError","def_causedBy":"tc009","def_detectionPhase":"AcceptanceTesting","def_closingDate":1381021878000,"def_id":"def_015","def_name":"aa15","def_status":"Closed","project":"Proj003","module":"Admin"},{"def_closingDateFormatted":"07/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561640,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc004","def_detectionPhase":"AcceptanceTesting","def_closingDate":1381108278000,"def_id":"def_016","def_name":"aa16","def_status":"New","project":"Proj002","module":"Devops"},{"def_closingDateFormatted":"08/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561642,"def_severity":"Low","def_priority":"High","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc005","def_detectionPhase":"SystemTesting","def_closingDate":1381194678000,"def_id":"def_017","def_name":"aa17","def_status":"Open","project":"Proj003","module":"Actions"},{"def_closingDateFormatted":"09/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561634,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc006","def_detectionPhase":"UnitTesting","def_closingDate":1381281078000,"def_id":"def_018","def_name":"aa18","def_status":"Fixed","project":"Proj001","module":"Optimiser"},{"def_closingDateFormatted":"10/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561637,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"CodingError","def_causedBy":"tc007","def_detectionPhase":"PerformanceTesting","def_closingDate":1381367478000,"def_id":"def_019","def_name":"aa19","def_status":"Closed","project":"Proj002","module":"Devops"},{"def_closingDateFormatted":"11/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561632,"def_severity":"Low","def_priority":"High","def_detectedBy":0,"def_rootCause":"DataIssue","def_causedBy":"tc008","def_detectionPhase":"IntegrationTesting","def_closingDate":1381453878000,"def_id":"def_020","def_name":"aa20","def_status":"New","project":"Proj003","module":"Actions"},{"def_closingDateFormatted":"07/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561632,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc009","def_detectionPhase":"AcceptanceTesting","def_closingDate":1381108278000,"def_id":"def_021","def_name":"aa21","def_status":"New","project":"Proj001","module":"Optimiser"},{"def_closingDateFormatted":"08/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561640,"def_severity":"High","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc004","def_detectionPhase":"SystemTesting","def_closingDate":1381194678000,"def_id":"def_022","def_name":"aa22","def_status":"Open","project":"Proj002","module":"tc_effectiveness"},{"def_closingDateFormatted":"09/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561642,"def_severity":"Medium","def_priority":"Low","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc005","def_detectionPhase":"SystemTesting","def_closingDate":1381281078000,"def_id":"def_023","def_name":"aa23","def_status":"Fixed","project":"Proj003","module":"Scheduler"},{"def_closingDateFormatted":"10/10/2013","def_detectioninBuild":"Build_04","def_fixedBy":561634,"def_severity":"High","def_priority":"High","def_detectedBy":0,"def_rootCause":"CodingError","def_causedBy":"tc006","def_detectionPhase":"UnitTesting","def_closingDate":1381367478000,"def_id":"def_024","def_name":"aa24","def_status":"Closed","project":"Proj001","module":"Admin"},{"def_closingDateFormatted":"11/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561637,"def_severity":"Low","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc007","def_detectionPhase":"PerformanceTesting","def_closingDate":1381453878000,"def_id":"def_025","def_name":"aa25","def_status":"Fixed","project":"Proj002","module":"Devops"},{"def_closingDateFormatted":"02/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561632,"def_severity":"Medium","def_priority":"Low","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc008","def_detectionPhase":"AcceptanceTesting","def_closingDate":1380676278000,"def_id":"def_026","def_name":"aa26","def_status":"Closed","project":"Proj003","module":"Actions"},{"def_closingDateFormatted":"03/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561640,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"EvironmentIssue","def_causedBy":"tc009","def_detectionPhase":"SystemTesting","def_closingDate":1380762678000,"def_id":"def_027","def_name":"aa27","def_status":"New","project":"Proj001","module":"Optimiser"},{"def_closingDateFormatted":"05/10/2013","def_detectioninBuild":"Build_01","def_fixedBy":561634,"def_severity":"Medium","def_priority":"Medium","def_detectedBy":0,"def_rootCause":"DataIssue","def_causedBy":"tc006","def_detectionPhase":"PerformanceTesting","def_closingDate":1380935478000,"def_id":"def_029","def_name":"aa29","def_status":"Fixed","project":"Proj003","module":"Scheduler"},{"def_closingDateFormatted":"06/10/2013","def_detectioninBuild":"Build_02","def_fixedBy":561632,"def_severity":"High","def_priority":"Low","def_detectedBy":0,"def_rootCause":"DesignIssue","def_causedBy":"tc007","def_detectionPhase":"IntegrationTesting","def_closingDate":1381021878000,"def_id":"def_030","def_name":"aa30","def_status":"Closed","project":"Proj001","module":"Admin"},{"def_closingDateFormatted":"07/10/2013","def_detectioninBuild":"Build_03","def_fixedBy":561640,"def_severity":"Medium","def_priority":"High","def_detectedBy":0,"def_rootCause":"UnclearRequirment","def_causedBy":"tc008","def_detectionPhase":"AcceptanceTesting","def_closingDate":1381108278000,"def_id":"def_031","def_name":"aa31","def_status":"New","project":"Proj002","module":"Devops"}];
		 
		 
		  	
if(Object.keys(data).length<=1)
			  {
		  		console.log("crossFilterData Single Summary " + JSON.stringify(Object.keys(data)));
			 
	if(tabs.length>=1)
			  		{
								var keysForData=tabs[index].title;
				  
								console.log("keysForData " + keysForData);
				  
								console.log(keysForData);
				  
								console.log(data);
				  
								console.log(data.summary[keysForData]);
								
						if((data.summary[keysForData].AttributesData.length==1) && ($scope.summaryListInPanel.length==0))
				  			{
								var singleArrayForSummary=data.summary[keysForData].AttributesData;
				  		
								for (var jj=0;jj<singleArrayForSummary.length;jj++ )
									{
											var singleValue=singleArrayForSummary[jj];
											for(var key in singleValue)
											{
												$scope.summaryListInPanel.push({Key:key,value:singleValue[key]});
											}
									}
										$scope.showSummary=true;
				  			}
						else if((data.summary[keysForData].AttributesData.length>1) && ($scope.summaryListInPanel.length==0))
				  			{			
								$scope.crossFilterData=data.summary[keysForData].AttributesData;
				  		
				  			}
				  	
						else
				  			{
								$scope.crossFilterData=[];
				  			}
				  
					  var dateFormat =d3.time.format("%Y-%m-%d");
					  var dateField = data.summary[keysForData].AttributesType;
					  var Fields =Object.keys(dateField);
					  $scope.dateFieldsList=[];					
					  $scope.idFieldsList = [];
					  var j=0;
					  
					  for(var i=0;i<Fields.length;i++)
						  {
						  	if(Fields[i]=="date")
						  		{
						  		 	$scope.dateFieldsList=data.summary[keysForData].AttributesType.date;						  		 
						  		 	console.log("dateFieldsList 689" + $scope.dateFieldsList);
						  		 	console.log("dateFieldsList 689 length" + $scope.dateFieldsList.length);
						  		}
						  	 else if (Fields[i]=="id")
						  	 	{
						  			$scope.idFieldsList=data.summary[keysForData].AttributesType.id;
					  		
						  	 	}
						  };
						 
						 if($scope.dateFieldsList.length>=1)
							  {
							  
							  	console.log("date field length if *****" + $scope.dateFieldsList.length);
						  
							  	$scope.crossFilterData.forEach(function(d){
						  		
						  		for(i=0;i< $scope.dateFieldsList.length;i++)
						  			{
						  				var temp=$scope.dateFieldsList[i];
					  					var dateFormat=null;
					  					var datatypeToCheck=typeof(d[temp]);
					  				if(datatypeToCheck == "string")
					  					{
					  					dateFormat =d3.time.format("%Y-%m-%d");
					  					d[temp]=dateFormat.parse(d[temp]);
					  					
					  					}
						  			}
						  			});
							  }
						 
						
				  	
						  	$scope.keysForAccess=data.summary[keysForData].groupableAttributes;
						  	console.log("keysForAccess");
						  	console.log($scope.crossFilterData);
						
						  	
			  		}
		else
			  		{
			  		
			  		console.log("date field length else***" + $scope.dateFieldsList.length);
			  		
			  		$scope.crossFilterData=[];
			  		$scope.limitForSummaryPerPanel=6;
			  		
			  		var keysForSummary = Object.keys(data.summary);
			  		
			  		console.log(keysForSummary);
		  			var keysForPanel = Object.keys(data.summary[keysForSummary].AttributesData[0]);
		  			console.log(keysForPanel);
		  			if(keysForPanel.length>1)
		  				{
		  			$scope.panelSize=(Math.round(keysForPanel.length/$scope.limitForSummaryPerPanel));
		  			var summaryList = data.summary[keysForSummary].AttributesData[0];
		  			$scope.summaryListInPanel=[];
				  	for (var key in summaryList )
				  		{
				  		$scope.summaryListInPanel.push({Key:key,value:summaryList[key]});
				  		}
		  				}
				  	console.log($scope.summaryListInPanel);
				  	$scope.showSummary=true;
				  	
				  	$scope.showResult=false;
			  		$scope.slickUpdate=false;
			  		$scope.showTable=false;
			  		}
		 // keysForAccess=["def_status", "def_priority", "def_severity",
			// "module", "project"];
				  console.log($scope.keysForAccess);
				  $scope.panelHeading = keysForData;
		  
	
			  
			  }
		  	// data.length checking
else if(Object.keys(data).length>1){
		  		
		  	  console.log("crossFilterData greater then 1" + Object.keys(data));
		  		
		  	  if(data.length == "" || data.length == null){
				  
								  
				  console.log("crossFilterData User Summary key" + Object.keys(data));
				  if(tabs.length>=1)
					  {
				  	var keysForData=tabs[index].title;
				  	// console.log(keysForData);
				  		if((data[keysForData].AttributesData.length==1) &&($scope.summaryListInPanel.length==0))
				  		{
				  		
				  		var singleArrayForSummary=data[keysForData].AttributesData;
				  		
				  		for (var jj=0;jj<singleArrayForSummary.length;jj++ )
				  		{
				  	 		var singleValue=singleArrayForSummary[jj];
				  	 		for(var key in singleValue)
				  	 			{
				  		$scope.summaryListInPanel.push({Key:key,value:singleValue[key]});
				  	 			}
				  		}
				  	 	$scope.showSummary=true;
				  		
				  		
				  		}
				  	else if((data[keysForData].AttributesData.length>=1))
				  		{
				  		$scope.crossFilterData=data[keysForData].AttributesData;
				  	 	}
				  	
				  	else
				  		{
				  		$scope.crossFilterData=[];
				  		}
				  	
				  	var dataField = data[keysForData].AttributesType;
				  	
				  
					  var Fields =Object.keys(dataField);
					  
					
					  
					  $scope.dateFieldsList=[];
					  var j=0;
					  for(var i=0;i<Fields.length;i++)
						  {
						  	if(Fields[i]=="date")
						  		{
						  		 $scope.dateFieldsList=data[keysForData].AttributesType.date;
						  		 console.log("dateFieldsList 810" + $scope.dateFieldsList);
						  		}
						 	else if(Fields[i]=="id")
					  		{
					  			$scope.idFieldsList=data[keysForData].AttributesType.id;
					  		
					  		console.log("id in user else part" + $scope.idFieldsList );
					  		}
						  }
					  
					  console.log("dateFieldsList" + JSON.stringify($scope.dateFieldsList));
					  
				  	if($scope.dateFieldsList.length>=1)
					  {
				  		
				  		$scope.crossFilterData.forEach(function(d)
				  			{
				  		// alert("function-call-2");
				  		// alert(JSON.stringify(dataFieldsList));
				  		
				  		for(var i=0; i<$scope.dateFieldsList.length;i++)
				  			{
				  			var temp=$scope.dateFieldsList[i];
				  			var dateFormat=null;
				  			
				  			var datatypeToCheck=typeof(d[temp]);
				  			
				  			console.log("datatypeToCheck" + datatypeToCheck);
				  				if(datatypeToCheck == "string")
				  					{
				  					dateFormat =d3.time.format("%Y-%m-%d");
				  					d[temp]=dateFormat.parse(d[temp]);
				  					}
				  			}
				  		});
					  }
				  	$scope.keysForAccess=data[keysForData].groupableAttributes;
				  	
				  	$scope.linkObjectList = data[keysForData].linkObj;
				  	console.log($scope.linkObjectList);
					  }
				  	// console.log($scope.crossFilterData);
				  	
				  	
					  
			  }
		  		
		  		else 
		  			{
		  			
		  		  // alert("Multiple Summary" + index);
				

		  		console.log("crossFilterData Multiple Summary key" + JSON.stringify(Object.keys(data)));
			 
			  	if(tabs.length>=1)
			  		{
				  var keysForData=tabs[index].title;
				  
				  console.log("keysForData " + keysForData);
				  
				  console.log(keysForData);
				  
				  console.log(data);
				  
				  console.log(data[index].summary[keysForData]);
				  
				  if((data[index].summary[keysForData].AttributesData.length==1) && ($scope.summaryListInPanel.length==0))
				  		{
				  		var singleArrayForSummary=data[index].summary[keysForData].AttributesData;
				  		
				  	 	for (var jj=0;jj<singleArrayForSummary.length;jj++ )
				  		{
				  	 		var singleValue=singleArrayForSummary[jj];
				  	 		for(var key in singleValue)
				  	 			{
				  		$scope.summaryListInPanel.push({Key:key,value:singleValue[key]});
				  	 			}
				  		}
				  	 	$scope.showSummary=true;
				  	 	
				  		
				  		}
				  	else if((data[index].summary[keysForData].AttributesData.length>1) && ($scope.summaryListInPanel.length==0))
				  		{			
				  		$scope.crossFilterData=data[index].summary[keysForData].AttributesData;
				  		
				  		}
				  	
				  	else
				  		{
				  		$scope.crossFilterData=[];
				  		}
				  
					  var dateFormat =d3.time.format("%Y-%m-%d");
					  
					  var dateField = data[index].summary[keysForData].AttributesType;
					  
					  var Fields =Object.keys(dateField);
					  $scope.dateFieldsList=[];
					  $scope.idFieldsList = [];
					  var j=0;
					  for(var i=0;i<Fields.length;i++)
						  {
						  	if(Fields[i]=="date")
						  		{
						  		 $scope.dateFieldsList=data[index].summary[keysForData].AttributesType.date;
						  		 console.log("dateFieldsList 917" + $scope.dateFieldsList);
						  		}
						  	else if (Fields[i]=="id")
					  		{
					  		$scope.idFieldsList=data[index].summary[keysForData].AttributesType.id;
					  		
					  		// console.log("id ++++++++++++ " +
							// $scope.idFieldsList);
					  		}
						  };
						  
						  if($scope.dateFieldsList.length>1)
							  {
						  
						  	$scope.crossFilterData.forEach(function(d){
						  		// alert("function-call-2");
						  		// alert(JSON.stringify(dataFieldsList));
						  		for(i=0;i< $scope.dateFieldsList.length;i++)
						  			var temp=$scope.dateFieldsList[i];
					  			var dateFormat=null;
					  			
					  			var datatypeToCheck=typeof(d[temp]);
					  				if(datatypeToCheck == "string")
					  					{
					  					dateFormat =d3.time.format("%Y-%m-%d");
					  					d[temp]=dateFormat.parse(d[temp]);
					  					}
						  	});
							  }
				  	
				  	
				  $scope.keysForAccess=data[index].summary[keysForData].groupableAttributes;
				  
				  console.log("keysForAccess" + $scope.keysForAccess);
			  		}
			  	else
			  		{
			  		$scope.crossFilterData=[];
			  		$scope.limitForSummaryPerPanel=6;
			  		var keysForSummary = Object.keys(data.summary);
			  		console.log(keysForSummary);
		  			var keysForPanel = Object.keys(data.summary[keysForSummary].AttributesData[0]);
		  			console.log(keysForPanel);
		  			if(keysForPanel.length>1)
		  				{
		  			$scope.panelSize=(Math.round(keysForPanel.length/$scope.limitForSummaryPerPanel));
		  			var summaryList = data.summary[keysForSummary].AttributesData[0];
		  			$scope.summaryListInPanel=[];
				  	for (var key in summaryList )
				  		{
				  		$scope.summaryListInPanel.push({Key:key,value:summaryList[key]});
				  		}
		  				}
				  	console.log($scope.summaryListInPanel);
				  	$scope.showSummary=true;
				  	
				  	$scope.showResult=false;
			  		$scope.slickUpdate=false;
			  		$scope.showTable=false;
			  		}
		 // keysForAccess=["def_status", "def_priority", "def_severity",
			// "module", "project"];
				  console.log($scope.keysForAccess);
				  $scope.panelHeading = keysForData;
		  
		  			}
	
			}
		  
		 	
		  	if(($scope.summaryListInPanel.length!=0) && ($scope.crossFilterData.length==0))
		  		{
		  		 	  
				  	  $scope.showTable=false;
				  	  $scope.showResult=false;
				  	  $scope.slickUpdate=false;	
				  	  
		  		}
		  	else if(($scope.keysForAccess.length!=0) && ($scope.crossFilterData.length > 1))
		  		{
		  		$scope.showResult=true;
		  		$scope.slickUpdate=true
		  		$scope.showTable=true;
		  		$scope.makeGraphs($scope.crossFilterData,$scope.keysForAccess,index);
		  		$scope.drawDataTable($scope.crossFilterData,$scope.keysForAccess,index);
		  		}
		  	else if($scope.crossFilterData.length != 0)
		  		{
		  		$scope.showTable=true;
		  		$scope.showResult=true;
		  		$scope.slickUpdate=false;
		  		$scope.ndx= crossfilter($scope.crossFilterData);
		  		$scope.drawDataTable($scope.crossFilterData,$scope.keysForAccess,index);
		  		}
   	    
			  else if(($scope.summaryListInPanel.length==0) && ($scope.crossFilterData.length==0))
			  {
				  $scope.showTable=false;
			  	  $scope.showResult=false;
			  	  $scope.slickUpdate=false;
			  	  // alert($scope.showTable+"_"+$scope.showResult+"_"+$scope.slickUpdate);
				  $scope.showRefineSearch=true;
				 
			  }
		  	if($scope.summaryListInPanel.length>4){ 
		  		 $scope.detail=true;
		  	  }
		  	else{
		  		$scope.detail=false;
		  	}
		  
	  };
	  
	  
	  
	  $scope.getTypeTabValues=function(data)
	  {
		  var keys=Object.keys(data);
		  console.log("inside gettype tabs *** keys" + keys);
		  $scope.typeTabs=[];
		  $scope.showSummary=false;
		  $scope.showResult=false;
		  var j=0;
		  console.log(keys.length);
		// alert(JSON.stringify(data) +","+typeof data);
		  
		
			console.log("attribute data" + keys)
	
		  
		  // More then 500 objects return string
		  if ((typeof data) == "string"){
			  
			  $scope.moreObjects = data;
			  $scope.showCorrectResult=false;
		  }
		  // user name or id filter
		  else if(keys.length>1)
			  {
			
			  $scope.moreObjects = "";
			  
		  for(var i=0;i<keys.length;i++)
			  {
			 
			  if(keys[i]!="summary")
				  {
				   var emptyCheck=keys[i];
				   console.log("emptyCheck:"+emptyCheck);
				  if(data[emptyCheck].AttributesData.length>=1)
					  {
					  $scope.typeTabs.push({title:keys[i],index:j});
				  					  
					  j++;
					  }
				  }
			  }
			  }
		  else			
			  {
		
			  // non user filter
			  var nonUserKeys=Object.keys(data[keys]);
			  	console.log("non user keys:"+nonUserKeys);
			  
			  	for(var i=0;i<nonUserKeys.length;i++)
			  		{
			  		if(data.summary[nonUserKeys[i]].AttributesData.length>=1)
			  			{
			  		$scope.typeTabs.push({title:nonUserKeys[i],index:j});
			  		
			  		j++;
			  			}
			  		else{
			  			console.log("AttributesData is Empty");
			  			$scope.moreObjects = "No records found, Please Refine Your Search";
						$scope.showCorrectResult=false;
			  			
			  		}
			  		}
			  	
			  }
		  
		  console.log("tabs values" + JSON.stringify($scope.typeTabs));
		  var tabs =$scope.typeTabs; 
		  
		  $scope.activeTabIndex=0;
		  
		  // var index=$scope.activeTabIndex;
		  
		  $scope.updateGraph($scope.activeTabIndex,$scope.responseData);
		  
			   // $scope.getGraphData(tabs,data,index);
			  // $scope.getGraphData($scope.typeTabs,$scope.responseData,$scope.activeTabIndex);
	  
	  };
	  
	  $scope.changeTabFunction = function(index)
	  {
		  // console.log("index on tab change:"+index);
		  $scope.activeTabIndex = index;
		 $scope.getGraphData($scope.typeTabs,$scope.responseData,$scope.activeTabIndex);
		 
		  
	  }
	  
	  $scope.getCorrectString=function(givenString,correctedString)
	  {
		  $scope.showCorrectResult=true;
		  $scope.moreObjects = "";
		  $scope.givenstringArray=[];
		  $scope.correctedStringArray=[];
		
		  $scope.givenStringArray=givenString.split(" ");
		  $scope.correctedStringArray=correctedString.split(" ");
		  $scope.stringToDisplay=[];
		  var j=0;
		  for(var i=0;i<$scope.givenStringArray.length;i++)
			  {
			  	if($scope.givenStringArray[i].toUpperCase() != $scope.correctedStringArray[i].toUpperCase())
			  		{
			  			var dummyString=$scope.givenStringArray[i].strike();
			  			$scope.stringToDisplay[j]=dummyString;
			  			j++;
			  			$scope.stringToDisplay[j]=$scope.correctedStringArray[i];
			  			
			  		}
			  	else
			  		{
			  		$scope.stringToDisplay[j]=$scope.givenStringArray[i];
			  		}
			  	
			  	j++;
			  }
		  
		  $scope.appropriateString=$scope.stringToDisplay.join(" ");
		 
	
		  

		  console.log("givenString" + givenString);
		  console.log("corrected string" + correctedString);
		
	  }

	  
	  $scope.getTypeTabs = function()
	  {
			// alert("inside click");
			console.log("inside type tabs");
				 
		  	var keyword= $scope.keyword;
		  	$scope.showRefineSearch=false; 	
		  	console.log(keyword);
			
		      $http.get('app/QBot/qbot/connection.properties').then(function (response) {
		        
		          
		          var url=response.data.nerUrl;
		          
		          
		          $scope.getDataBasedOnUrl(url);
		         
		        });
		  	
		      $scope.getDataBasedOnUrl=function(url)
		      {
		    	  var keywordencode = btoa($scope.keyword);
			        var url1= url+keywordencode;
			        console.log("ner qbotcontroller " + url1);
				    $http({
				            url: url1,
				            method: "GET",
				            dataType: "json"}).
				            success(function (response) {  	
			    	if(response.result == null || response.result=="")
			    		{
			    		//alert("null result");
			    		$scope.showRefineSearch=true;
			    		$scope.showSummary=false;
			    		$scope.showResult=false;
			    		$scope.loadingImage=false;
			    		$scope.slickUpdate=false;
				  		$scope.showTable=false;
				  		$scope.suggestion=false;
			    		}
			    	else
			    		{
			    		
			    		$scope.showSummary=false;
			    		$scope.showResult=false;
				  		$scope.slickUpdate=false;
				  		$scope.showTable=false;
			    		$scope.loadingImage=false;
			    		$scope.nextHide=false;
			    		$scope.prevHide=false;
			    		$scope.slickUpdate1=true;
			    		$scope.onlygraph=false;
			    		$scope.showPageLimits=false;
			    		$scope.prevbtn=false;
			    		$scope.nextbtn=true;
			    		$scope.dashbotmenu=false;
			    		$scope.showCorrectResult=false;
			    		$scope.moreObjects = "";
			    		
				    	$scope.nex=false;
				    	$scope.prev=false;
				    	$scope.suggestion=false;

				    	// console.log((response1));

				    	$scope.responseData1 = response.result;

				    	var responsekey = Object.keys($scope.responseData1);
				    	var didyoumeankey = response.Did_you_mean;
				    	
				    	if(responsekey.length == 1){
				    		$scope.responseData = response.result[0]; 	
				    		console.log("Single summary" );
				    		$scope.getCorrectString(response.Given_String,response.Corrected_String);
				    		$scope.getTypeTabValues($scope.responseData);
				    		
				    		if(didyoumeankey.length >= 1 ){
				    			$scope.didyoumean($scope.responseData,response.Did_you_mean);
				    		}
				    		else{
				    			console.log("Did you mean key length is Zero ");
				    		}
				    		
				    	}
				    	
				    	else if (responsekey.length  >1){
				    		$scope.responseData = response.result; 	
				    		console.log("Multiple summary" );
				    		$scope.getCorrectString(response.Given_String,response.Corrected_String);
			    			$scope.multipleSummary($scope.responseData);
				    	}
				    		
				        	
				    	}
			    	  
		});
				    
		      };
		
	  };
	  
	  $scope.didyoumean=function(data,Did_you_mean)
	  {
		  $scope.didYouMeanKeys1=[];
		  $scope.suggestion=true;
		  $scope.firstSummary = Object.keys(data.summary);
		  var didYouMean1 = Did_you_mean;
		  var j = 0;
		  
		 	  for(var i = 0; i < didYouMean1.length; i++){
			  
			  $scope.didYouMeanKeys1.push({tite:Did_you_mean[i].val,index1:j});
			  
			j++;	
			 
			}
			  console.log("didYouMeanKeys1" + $scope.didYouMeanKeys1);
			  
		 }
	  
	  $scope.multipleSummary=function(data)
	  {
		// alert("data" + JSON.stringify(data));
		  
		  var keys=Object.keys(data);
		  var didYouMeanKeys=[];
	
		 var temp =[];
		 var j=0;
		 $scope.typeTabs = [];
		 $scope.keyword1 = "";
		  
		  
		  console.log("multiple summary keys length" + keys.length);
		 
		  for(var i=0;i<keys.length;i++)
		  		{
		  			var data1=Object.keys(data[i].summary);
		  				 temp[i] = data1;
		  				
		  				 console.log("data1" + JSON.stringify(data1));
		  				
		  				 for(var jj=0;jj<data1.length;jj++)
		  					{
		  							  					if(data[i].summary[data1[jj]].AttributesData.length>=1)
		  							  						{
		  							  					
		  		      $scope.typeTabs.push({title:$scope.keyword1+ "" +Object.keys(data[i].summary),index:j});
			  		  
		  		    	j++;		  						}
			  	
		  					
		  					console.log("didYouMeanKeys1 types tabs" + JSON.stringify( $scope.typeTabs));
		  				
			  			// console.log("temp" + JSON.stringify($scope.temp));
			  			
			  			}
			  		
			  		}	
			
		  	  var tabs =$scope.typeTabs; 
			  
			  $scope.activeTabIndex=0;
			  
			  $scope.updateGraph($scope.activeTabIndex,$scope.responseData);
	  
	  }
	  
	  
	  $scope.open = function (page) {
		  $scope.get="View all";
	      $uibModal.open({
	        animation: true,
	        templateUrl: page,
	       
	        scope: $scope,
	        resolve: {
	          items: function () {
	            return $scope.items;
	          }
	        }
	      });
	    };
	
	  $scope.loadingImage=true; 	  
	 $scope.getTypeTabs();
	  
	  function fireResize(){
		    if (document.createEvent) { // W3C
		        var ev = document.createEvent('Event');
		        ev.initEvent('resize', true, true);
		        window.dispatchEvent(ev);
		    }
		    else { // IE
		        element=document.documentElement;
		        var event=document.createEventObject();
		        element.fireEvent("onresize",event);
		    }
		};
		
	  
	$scope.getPanelSize=function(num)
	{
		return new Array(num);
	};
		
	
		  
		
	  $scope.updateGraph=function(index,data)
	  {
		
		  
		  
		  if($scope.onlygraph==true)
		  {
	
		  $scope.slickUpdate1=!$scope.slickUpdate1;
		  $scope.onlygraph=!$scope.onlygraph;
		  
		  }
		  $scope.prevbtn=false;
		  $scope.nextbtn=true;
		  $scope.get="Show all";
		  $scope.img="images/Grid1.png";
		  console.log("inside update Graph *** index" + index );
		  $scope.activeTabIndex=index;
		  
		  console.log("typeTabs in update graph" + JSON.stringify($scope.typeTabs));
		
		  $scope.getGraphData($scope.typeTabs,$scope.responseData,index);
		 
		  
	  }
	  
	  
	  $scope.hidden=function()
	  {
	  // alert("hidden");
	  		$scope.slickUpdate1=!$scope.slickUpdate1;
	  		$scope.onlygraph=!$scope.onlygraph;
	  		$scope.getGraphData($scope.typeTabs,$scope.responseData,$scope.activeTabIndex);
	  		if($scope.onlygraph==true)
			{
			$scope.get="Hide all";
			 $scope.img="images/List-view.png";
			}
		else
			{
			$scope.get="Show all";
			 $scope.img="images/Grid1.png";
			}
	   
	  	
	  	};
	  
	  
	  $scope.next=function()
	  {
		 
		  if(($scope.strtIndx+3)!= $scope.keysForAccess.length)
			  {
			  $scope.nextHide=true;
			  $scope.slickUpdate=false;
			  $scope.strtIndx++;
			  $scope.makeGraphs($scope.crossFilterData,$scope.keysForAccess,$scope.activeTabIndex);
			  $scope.drawDataTable($scope.crossFilterData,$scope.keysForAccess,$scope.activeTabIndex);
			  $scope.slickUpdate=true;
			  $scope.prevbtn=true;
			  }
		  else
			  {
			  $scope.nextHide=false;
			  $scope.nextbtn=false;
			  }
		 // alert($scope.strtIndx);
		  
	  };
	  
	  $scope.previous=function()
	  {
		  if($scope.strtIndx+3>3)
			  {
			  $scope.prevHide=true;
			  $scope.slickUpdate=false;
			  $scope.strtIndx--;
			  $scope.makeGraphs($scope.crossFilterData,$scope.keysForAccess,$scope.activeTabIndex);
			  $scope.drawDataTable($scope.crossFilterData,$scope.keysForAccess,$scope.activeTabIndex);
			  $scope.slickUpdate=true;
			  $scope.nextbtn=true;
			  }
		  else
			  {
			  $scope.prevHide=false;
			  $scope.prevbtn=false;
			  }
		  
		  
	  };
	  $scope.refresh=function(){
		  $scope.pre=false;
  		$scope.nex=false;
	  };
	  
	  
	  $scope.filterData=function(selectedCategory)
	  {
		 // alert("inside filterData");
		  console.log("inside filterData");
		  console.log(selectedCategory);
		  $scope.selectedCategoryValue=selectedCategory;
		  $scope.getGraphData($scope.typeTabs,$scope.responseData,$scope.activeTabIndex);
	  }
	  
	  var inputValue="";
	  var charCode="";
	  $scope.keyevent=function (keyCode,myValue) {
		  console.log(keyCode);
		    charCode = myValue;        
		    console.log(charCode);
		    inputValue=charCode;
		    console.log(inputValue.length);
		    if(inputValue.length>0)
			  {	
		    	
		    	$http.get('app/QBot/qbot/connection.properties').then(function (response) {
			         
	    			var url=response.data.predictUrl;
		            $scope.getPredictDataBasedOnUrl(url);
		         
		        });
	
	    	 $scope.getPredictDataBasedOnUrl=function(url)
		      {
	        	 var url1= url+inputValue;
	        	 
	        	 console.log("prediction qbotcontroller " + url1);

	    $http({
	            url: url1,
	            method: "GET",
	            dataType: "json"}).
	            success(function (response) {
	            	getTypeAheadValues(response);
	            });
		  }
		  }
	  }
	  function getTypeAheadValues(response)
	  {
	 // $scope.Countries = response.predictedValues;
		  $scope.titles=[];
		  $scope.titles=response;
		  console.log($scope.titles);
	  }
	  
	  
	  
	  $scope.myfunc = function(){	
		  var charttt=dc.lineChart("#linechart11");
		  
		  
		  charttt
	              .height(550)
	              .width(770)
	              .dimension($scope.dimensionPop)
	              .group($scope.groupPop)
	              .renderArea(false)
	              .transitionDuration(1800)
	              .x(d3.time.scale().domain([$scope.minDatePop, $scope.maxDatePop]))
	              .elasticX(true)
	              .mouseZoomable(true)
	               .colors( ['rgb(242,250,6)'] )
	               .brushOn(true)
	               .renderDataPoints(true)
	              .renderlet(function (chart) {chart.selectAll("g.x text").attr('dx', '16').attr('dy', '-7').attr('transform', "rotate(-90)");})
	              .xAxisLabel("Date");
	             
			  
		  charttt.render();
			  };
			  
			  		$scope.open1 = open;
			       $scope.opened = false;
			        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			        $scope.format = $scope.formats[0];
			        $scope.options = {
			            showWeeks: false
			        };

			        $scope.open1=function() {
			            $scope.opened = true;
			           
			        };
			  
			 
	  
	/*
	 * $scope.panels=['aaa0','a1','a3'];
	 */
	  
  }

})();