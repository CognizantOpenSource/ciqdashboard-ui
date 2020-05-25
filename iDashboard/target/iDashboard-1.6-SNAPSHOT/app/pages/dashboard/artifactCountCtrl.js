/**
* @author 653731
* created on 16.12.2015
*/
(function () {
  'use strict';

  angular.module('MetricsPortal.pages.dashboard')
      .controller('artifactCountCtrl', artifactCountCtrl);

  /** @ngInject */
  function artifactCountCtrl($sessionStorage,$scope, $rootScope, AES, $base64,$http, baConfig, $element, layoutPaths, UserService, localStorageService) {
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
            	  
                  $scope.artifactCountChart=function(){
                	    var token  = AES.getEncryptedValue();
                        var config = {headers: {
                                'Authorization': token
                                }};
                                 
                         $http.get("rest/operationalDashboardALMServices/artifactsCount?dashboardName="+dashboardName
                        		 +"&domainName="+domainName+"&projectName="+projectName,config).success(function (response) {
                         
                        			 $scope.data = response;
                        			 
                         	if(response.length != 0){                                                              
                         		$scope.artifactChart($scope.data);}
                         	
                         		
                              });                                                      
                          		
													
                    $scope.artifactChart = function(data){
					$scope.data = data;
					$scope.bardata = [];
					for(var i=0; i<$scope.data.length; i++){
						$scope.metrics = ["Requirements", "Defects"];
						
						if($scope.data[i].metrics == null){
							metrics:$scope.data[i].metrics = $scope.metrics[i];
						}
							$scope.bardata.push({metrics:$scope.data[i].metrics,
								a:$scope.data[i].nopriority,
								b:$scope.data[i].urgent,
								c:$scope.data[i].veryhigh,
								d:$scope.data[i].high,
								e:$scope.data[i].medium,
								f:$scope.data[i].low,});
	
	
						}

						$scope.barData = $scope.bardata;
						$scope.drawchart($scope.barData)
						}

                        $scope.drawchart = function(barData){
                        	
                        	$('#artifactchart').remove(); // this is my <canvas> element
                 			$('#artifactdiv').append('<div id="artifactchart"></div>')
                 			
                        	$scope.barData = barData;
                        	$('#artifactchart').empty();
                        	var	bar = Morris.Bar({
                        		data : $scope.barData,
                        		element : 'artifactchart',
                        		xkey: 'metrics',
                        		ykeys: ['a', 'b','c','d','e','f'],
                        		labels: ['No Priority', 'Urgent', 'Very High', 'High', 'Medium', 'Low' ],
                        		barColors:["rgba(75, 192, 192, 0.8)","rgba(255, 99, 132, 0.8)",
                        		           "rgba(255, 159, 64, 0.8)", "rgba(255, 206, 86, 0.8)",
                        		           "rgba(153, 102, 255, 0.8)", "rgba(54, 162, 235, 0.8)"],
                        		           fillOpacity: 0.6,
                        		           hideHover: 'auto',
                        		           behaveLikeLine: true,
                        		           pointFillColors:['#ffffff'],
                        		           pointStrokeColors: ['black'],
                        		           lineColors:['gray','red'],
	     
                        	}); 
                        }
                  }
  }

})();
