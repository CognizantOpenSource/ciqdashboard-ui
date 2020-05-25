/**
 * @author v.lugovsky created on 16.12.2015
 */
(function() {
	'use strict';

	angular.module('MetricsPortal.pages.riskCompliance').controller(
			'riskComplianceCtrl', riskComplianceCtrl).filter('trimDesc',
		  			function() {
				return function(value) {
					if (!angular.isString(value)) {
						return value;
					}
					return value.replace(/^\s+|\s+$/g, '');
				};
			});
	/** @ngInject */

	function riskComplianceCtrl($scope, $rootScope, $window, $base64,$timeout,
			localStorageService, $location,$element, $http, $state, toastr, baConfig, layoutPaths) {

		var inputValue = "";
		var charCode = "";
		$rootScope.menubar = true;
		$rootScope.var1 = false;
		$rootScope.var2 = false;
		$rootScope.var3 = false;
		$rootScope.var4 = false;
		$rootScope.var5 = false;
		$rootScope.var6 = true;

		$rootScope.menuItems = [ {
			"name" : "openRisks",
			"title" : "Open Risks",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-android-home",
			"stateRef" : "riskCompliance",
			"subMenu" : null
		}, {
			"name" : "OverdueRisksByCategory",
			"title" : "Overdue Risks By Category",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "overdueRisksByCategory",
			"subMenu" : null
		}, {
			"name" : "DueInRiskCategoryOrDivision",
			"title" : "Due in 60 days by Risk Category /Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "dueInRiskCategoryOrDivision",
			"subMenu" : null
		}, {
			"name" : "riskByDivision",
			"title" : "Risks By Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "riskByDivision",
			"subMenu" : null
		}, {
			"name" : "archersbyStatus",
			"title" : "Risks by Status",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "archersbyStatus",
			"subMenu" : null
		},

		/*{
			"name" : "qualysVulnerabilitiesByDivision",
			"title" : "Qualys Vulnerabilities by Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "qualysVulnerabilitiesByDivision",
			"subMenu" : null
		},*/
		{"name" : "archersCriticalHighbyDivision",
			"title" : "Archer-Critical & High by Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "archersCriticalHighbyDivision",
			"subMenu" : null
		}, /*{
			"name" : "ethicalHackFindingsbyStatus",
			"title" : "Ethical Hack Findings by Status",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "ethicalHackFindingsbyStatus",
			"subMenu" : null
		},*/ /*{
			"name" : "ethicalHackFindingsbyDivision",
			"title" : "Ethical Hack Findings by Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "ethicalHackFindingsbyDivision",
			"subMenu" : null
		}, {
			"name" : "networkPenetrationbyDivision",
			"title" : "Network Penetration by Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "networkPenetrationbyDivision",
			"subMenu" : null
		},*/ {
			"name" : "ethicalHackCriticalHighMediumbyDivision",
			"title" : "Ethical Hack-Critical, High & Medium by Division",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "ethicalHackCriticalHighMediumbyDivision",
			"subMenu" : null
		},

		{
			"name" : "networkPenetrationbySeverity",
			"title" : "Network Penetration by Severity",
			"level" : 0,
			"order" : 0,
			"icon" : "ion-stats-bars",
			"stateRef" : "networkPenetrationbySeverity",
			"subMenu" : null
		},

		];

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);
			return tokeen;
		}
		

		$scope.openUsTransferAgencyGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			console.log(		$rootScope.selectedDivision)
			$state.go('usAgengyTrendOpenRisks');
		}

		$scope.openSubAccountingGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('subAccountingTrendOpenRisk');
		}
		$scope.openCoreGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('onCoreTrendOpenRisks');
		}
		$scope.openAlternativeInvestmentGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('alternativeInvestmentTrendOpenRisks');
		}
		$scope.openGiarsGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('giarsTrendOpenRisks');
		}
		$scope.openEMEAGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('emeaTrendOpenRisks');
		}
		$scope.openGlobalFundGraph = function(selectedDivision) {
			$rootScope.selectedDivision=selectedDivision;
			$state.go('globalFundTrendOpenRisks');
		}
		$scope.divisinList=["IOT","QI BOTS","iDashboard","Smart Stub","ADPART","Automation","TDM"];

		// ////////// open risk tabular format data begins
		// calling qualys vulnerabiltity data for open risk
		$rootScope.countdetails1={};
		$scope.URagencyOpenRisks = function() {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get("rest/RiskComplianceServices/openRisksUSAgencyCount",
							config)
					.success(
							function(response) {
								console.log(response);
								$rootScope.countdetails1 = response;
								console.log("iuhilh0",$rootScope.countdetails1 );
							

								for (var i = 0; i < $rootScope.countdetails1.length; i++) {
									 if ($rootScope.countdetails1[i].division == "TDM") {
										$scope.openRiskGlobalFundCount1 = $scope.countdetails1[i].count;
									}
									else if ($rootScope.countdetails1[i].division == "IOT") {
										$scope.openRiskusAgency1 = $scope.countdetails1[i].count;
										console.log("$scope.openRiskusAgency ",$scope.openRiskusAgency1 )
									}
									else if ($scope.countdetails1[i].division == "Automation") {
										$scope.openRiskEMEACount1 = $scope.countdetails1[i].count;
									} 
									else if ($rootScope.countdetails1[i].division == "QI BOTS") {
										$scope.openRisksSubaccounting1 = $scope.countdetails1[i].count;
									} 
									else if ($rootScope.countdetails1[i].division == "iDashboard") {
										$scope.OpenRisksOnCoreMiddleCount1 = $scope.countdetails1[i].count;
									} 
									else if ($rootScope.countdetails1[i].division == "Smart Stub") {
										$scope.openRiskAlternativeInvestmentCount1 = $scope.countdetails1[i].count;
									} 
									 else if ($rootScope.countdetails1[i].division == "ADPART") {
										$scope.openRiskGiarsCount1 = $scope.countdetails1[i].count;
									} 
								}

							});

		}

		// showing archer data in open risk in tabular data

		$scope.URagencyOpenRisksArcherData = function() {
			$scope.divisionName = "IOT";

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/RiskComplianceServices/openRisksArcherDataUSAgencyCount",
							config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.openRisksSubaccountingArcherData = 0;
								$scope.openRiskGiarsCountArcherData = 0;
								$scope.openRiskEMEACountArcherData = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.openRisksSubaccountingArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.openRiskGiarsCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.openRiskEMEACountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.openRiskusAgencyArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.openRiskAlternativeInvestmentCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.OpenRisksOnCoreMiddleCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.openRiskGlobalFundCountArcherData = $scope.countdetails[i].count;
									}
								}

							});

		}

		// call of ethical data for open risk metric in tabular format
		$scope.URagencyOpenRisksEthicalData = function() {

			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/RiskComplianceServices/openRisksEthicalDataUSAgencyCount",
							config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.openRisksSubaccountingEthicalData = 0;
								$scope.openRiskGiarsCountEthicalData = 0;
								$scope.openRiskEMEACountEthicalData = 0;
								$scope.openRiskGlobalFundCountEthicalData = 0;
								$scope.openRiskAlternativeInvestmentCountEthicalData = 0;
								$scope.OpenRisksOnCoreMiddleCountEthicalData = 0;
								$scope.openRiskusAgencyEthicalData = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.openRisksSubaccountingEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.openRiskGiarsCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.openRiskEMEACountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.openRiskusAgencyEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.openRiskAlternativeInvestmentCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.OpenRisksOnCoreMiddleCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.openRiskGlobalFundCountEthicalData = $scope.countdetails[i].count;
									}
								}

							});

		}
		//call the ethical data count and display the list for a particular division
		
		$scope.getDetailsData=function(selectedDivision){
		
			
			$state.go('detailsEthicalData');
		/*	if($scope.index==0){
			$rootScope.selectedDivision=selectedDivision;}
			else if($scope.index==1){*/
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsOfEthicalData($rootScope.selectedDivision);
		}
$scope.getDetailsOfEthicalData=function(selectedDivision){

	$rootScope.selectedDivision=selectedDivision;
	console.log("5532",$rootScope.selectedDivision)
	var token  = getEncryptedValue();
	
	      var config = {headers: {
	              'Authorization': token
	              }};
	  
	$http.get("./rest/RiskComplianceServices/ethicalDetailsData?division="+ $rootScope.selectedDivision,config).success(
			function(response) {
				$rootScope.ethicalDetails = response;
				$rootScope.rowCollection=response;
				console.log($scope.ethicalDetails);
			});
	
}
//network data in detail for download


$scope.getNetworkDetailsData=function(selectedDivision){
	
	
	$state.go('networkDetailsData');
/*	if($scope.index==0){
	$rootScope.selectedDivision=selectedDivision;}
	else if($scope.index==1){*/
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfNetworkData($rootScope.selectedDivision);
}
$scope.getDetailsOfNetworkData=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};

$http.get("./rest/RiskComplianceServices/networkDetailsData?division="+ $rootScope.selectedDivision,config).success(
	function(response) {
		$rootScope.networkDetails = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.networkDetails);
	});

}

//for archer detail data download

$scope.getArchersDetailsData=function(selectedDivision){
	
	
	$state.go('archerDetailsData');
/*	if($scope.index==0){
	$rootScope.selectedDivision=selectedDivision;}
	else if($scope.index==1){*/
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfArcherData($rootScope.selectedDivision);
}
$scope.getDetailsOfArcherData=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};

$http.get("./rest/RiskComplianceServices/archerDetailsData?division="+ $rootScope.selectedDivision,config).success(
	function(response) {
		$rootScope.archerDetails = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.archerDetails);
	});

}







//call of qualys data


$scope.getQualysDetailsData=function(selectedDivision){
	
	
	$state.go('qualysDetailsData');
/*	if($scope.index==0){
	$rootScope.selectedDivision=selectedDivision;}
	else if($scope.index==1){*/
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfQualysData($rootScope.selectedDivision);
}
$scope.getDetailsOfQualysData=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};

$http.get("./rest/RiskComplianceServices/qualysDetailsData?division="+ $rootScope.selectedDivision,config).success(
	function(response) {
		$rootScope.qualysDetails = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.qualysDetails);
	});

}



//overduedata download details for ethical data

$scope.getDetailsDataForOverdue=function(selectedDivision){
	
	
	$state.go('detailsEthicalData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfEthicalDataForOverdue($rootScope.selectedDivision);
}
$scope.getDetailsOfEthicalDataForOverdue=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/ethicalDetailsDataForOverdue?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.ethicalDetailsForOverdue = response;
		$rootScope.rowCollection=response;
		console.log($scope.ethicalDetailsForOverdue);
	});

}
//network data download for overdue risk 

$scope.getDetailsNetworkDataForOverdue=function(selectedDivision){
	
	
	$state.go('networkDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfNetworkDataForOverdue($rootScope.selectedDivision);
}
$scope.getDetailsOfNetworkDataForOverdue=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/networkDetailsDataForOverdue?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.ethicalDetForOverdue = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.ethicalDetailsForOverdue);
	});

}
//archer data fo overdue risk 

$scope.getDetailsArcherDataForOverdue=function(selectedDivision){
	
	
	$state.go('archerDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfArcherDataForOverdue($rootScope.selectedDivision);
}
$scope.getDetailsOfArcherDataForOverdue=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/archerDetailsDataForOverdue?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.archerDataForOverdue = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.archerDataForOverdue);
	});

}



//qualys data  for overdue risk

$scope.getDetailsQualysDataForOverdue=function(selectedDivision){
	
	
	$state.go('qualysDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfQualysDataForOverdue($rootScope.selectedDivision);
}
$scope.getDetailsOfQualysDataForOverdue=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/qualysDetailsDataForOverdue?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.ethicalDetailsForOverdue = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.ethicalDetailsForOverdue);
	});

}

//risk by daya for qualys data 



$scope.getDetailsDataForDays=function(selectedDivision){
	
	
	$state.go('detailsEthicalData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfEthicalDataForDays($rootScope.selectedDivision);
}
$scope.getDetailsOfEthicalDataForDays=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/ethicalDetailsDataForDays?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.networkDetailsForOverdue = response;
		$rootScope.rowCollection=response;
		console.log($scope.networkDetailsForOverdue);
	});

}
//risk by days for archer data



$scope.getDetailsDataForArcherDays=function(selectedDivision){
	
	
	$state.go('archerDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfArcherDataForDays($rootScope.selectedDivision);
}
$scope.getDetailsOfArcherDataForDays=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/archerDetailsDataForDays?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.archerDetailsForOverdues = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.archerDetailsForOverdues);
	});

}
//risk by days  for network data
$scope.getDetailsDataForNetworkDays=function(selectedDivision){
	
	
	$state.go('networkDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfNetworkDataForDays($rootScope.selectedDivision);
}
$scope.getDetailsOfNetworkDataForDays=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/networkDetailsDataForDays?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.networkDetailsForOverdues = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.networkDetailsForOverdues);
	});

}
//risk for 60 days for qualys data
$scope.getDetailsDataForQualysDays=function(selectedDivision){
	
	
	$state.go('qualysDetailsData');
	
		$rootScope.selectedDivision=selectedDivision;
	
	$scope.getDetailsOfQualysDataForDays($rootScope.selectedDivision);
}
$scope.getDetailsOfQualysDataForDays=function(selectedDivision){

$rootScope.selectedDivision=selectedDivision;
console.log("5532",$rootScope.selectedDivision)
var token  = getEncryptedValue();

  var config = {headers: {
          'Authorization': token
          }};
  var vardtfrom = "";
	var vardtto = "";
	if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
			|| $rootScope.dfromval == "") {
		vardtfrom = "-";
	} else {
		vardtfrom = $rootScope.dfromval;
	}

$http.get("./rest/RiskComplianceServices/qualysDetailsDataForDays?division="+ $rootScope.selectedDivision + "&vardtfrom="
		+ vardtfrom,config).success(
	function(response) {
		$rootScope.ethicalDetailsForOverdue = response;
		$timeout(function(){moreLink()},100);
		$rootScope.rowCollection=response;
		console.log($scope.ethicalDetailsForOverdue);
	});

}






//more link function
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





		// call of network penetration data in tabular format for open risks

		$scope.URagencyOpenRisksNetworkData = function() {
			var token = getEncryptedValue();

			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/RiskComplianceServices/openRisksNetworkDataUSAgencyCount",
							config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.openRisksSubaccountingNetworkData = 0;
								$scope.OpenRisksOnCoreMiddleCountNetworkData = 0;
								$scope.openRiskAlternativeInvestmentCountNetworkData = 0;
								$scope.openRiskGiarsCountNetworkData = 0;
								$scope.openRiskEMEACountNetworkData = 0;
								$scope.openRiskusAgencyNetworkData = 0;
								$scope.openRiskGlobalFundCountNetworkData = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.openRisksSubaccountingNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.openRiskGiarsCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.openRiskEMEACountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.openRiskusAgencyNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.openRiskAlternativeInvestmentCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.OpenRisksOnCoreMiddleCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.openRiskGlobalFundCountNetworkData = $scope.countdetails[i].count;
									}
								}

							});
		}
		// ////////// open risk tabular format data ending

		// for us agency trending graph

		$scope.getlcfromdate = function(dtfrom) {
			$rootScope.dfromval = dtfrom;
			$scope.commitTrendForQualys();
			$scope.commitTrendForEthicalUsAgency();
			$scope.commitTrendForArcherUsAgency();
			// for subccounting
			$scope.commitTrendForQualysSubaccounting();
			$scope.commitTrendForArcherSubaccounting();
			$scope.commitTrendForEthicalSubaccounting();
			// on core middle office
			$scope.commitTrendForQualysOnCore();
			$scope.commitTrendForArcherOnCore();
			$scope.commitTrendForEthicalOnCore();
		}
		// for alternative trend graph

		$scope.getlc1fromdate = function(dtfrom) {
			$scope.commitTrendForQualysAlternativeInvestment();
			$scope.commitTrendForArcherAlternativeInvestment();
			$scope.commitTrendForEthicalAlternativeInvestment();
			// for giars
			$scope.commitTrendForQualysGIARS();
			$scope.commitTrendForArcherGIARS();
			$scope.commitTrendForEthicalGIARS();
			// for emea
			$scope.commitTrendForArcherEMEA();
			$scope.commitTrendForEthicalEMEA();
			$scope.commitTrendForQualysEMEA();
			// for global fund
			$scope.commitTrendForArcherGlobalFund();
			$scope.commitTrendForEthicalGlobalFund();
			$scope.commitTrendForQualysGlobalFund();
		}
		$scope.getlc1todate = function(dtto) {
			$scope.commitTrendForQualysAlternativeInvestment();
			$scope.commitTrendForArcherAlternativeInvestment();
			$scope.commitTrendForEthicalAlternativeInvestment();
			// for giars
			$scope.commitTrendForQualysGIARS();
			$scope.commitTrendForArcherGIARS();
			$scope.commitTrendForEthicalGIARS();
			// for emea
			$scope.commitTrendForArcherEMEA();
			$scope.commitTrendForEthicalEMEA();
			$scope.commitTrendForQualysEMEA();
			// for global fund
			$scope.commitTrendForArcherGlobalFund();
			$scope.commitTrendForEthicalGlobalFund();
			$scope.commitTrendForQualysGlobalFund();
		}
		$scope.getlctodate = function(dtto) {

			$rootScope.dtoval = dtto;
			$scope.commitTrendForQualys();
			$scope.commitTrendForEthicalUsAgency();
			$scope.commitTrendForArcherUsAgency();
			// for subccounting
			$scope.commitTrendForQualysSubaccounting();
			$scope.commitTrendForArcherSubaccounting();
			$scope.commitTrendForEthicalSubaccounting();
			// for oncore middle office
			$scope.commitTrendForQualysOnCore();
			$scope.commitTrendForArcherOnCore();
			$scope.commitTrendForEthicalOnCore();

		}
		// CALENDER DEFAULT VALUE

		$scope.getdefaultdate = function() {
			var date = new Date();
			var date1 = new Date();
			$rootScope.dtto = date;
			date1.setDate(date.getDate() - 30);
			$rootScope.dtfrom = date1;

			var dfromval = $rootScope.dtfrom;
			var month = dfromval.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var date = dfromval.getDate();
			if (date < 10) {
				date = '0' + date;
			}
			var year = dfromval.getFullYear();

			$rootScope.dfromval = "" + month + "/" + date + "/" + year;

			var dtoval = $rootScope.dtto;
			var month = dtoval.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var date = dtoval.getDate();
			if (date < 10) {
				date = '0' + date;
			}
			var year = dtoval.getFullYear();

			$rootScope.dtoval = "" + month + "/" + date + "/" + year;

		}

		$scope.getfromdate = function(dtfrom) {
			$rootScope.dfromval = dtfrom;
			$scope.URagencyOverdueOpenRisks();
			$scope.archerURagencyOverdueOpenRisks();
			$scope.ethicalURagencyOverdueOpenRisks();
			$scope.networkURagencyOverdueOpenRisks();
			/* $scope.commitTrendForQualys(); */
		}

		$scope.getTodate = function(dtto) {
			$rootScope.dtoval = dtto;
			/* $scope.commitTrendForQualys(); */
		}
		$scope.commitTrendForQualys = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "IOT";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/usAgencyTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;

						console.log("countdetails", $scope.countdetails);
						$scope.drawChart($scope.countdetails);
					});

			$scope.drawChart = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'IOT Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherUsAgency = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "IOT";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/usAgencyTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);

						$scope.drawChart2($scope.countdetails);
					});

			$scope.drawChart2 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(220,220,220,1)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'IOT Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		// end of open risks

		$scope.commitTrendForEthicalUsAgency = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "IOT";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/usAgencyTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart3($scope.countdetails);
					});

			$scope.drawChart3 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}

							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'IOT Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}

		// subaccounting trending graph for open risk
		$scope.commitTrendForQualysSubaccounting = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "QI BOTS";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/subAccountingTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart4($scope.countdetails);
					});

			$scope.drawChart4 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',
						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'QI BOTS Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherSubaccounting = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "QI BOTS";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/subAccountingTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart22($scope.countdetails);
					});

			$scope.drawChart22 = function(data) {

				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'QI BOTS Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalSubaccounting = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "QI BOTS";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/subAccountingTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart3($scope.countdetails);
					});

			$scope.drawChart3 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'QI BOTS  Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// on core middle trend graph for open risks
		$scope.commitTrendForQualysOnCore = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "iDashboard";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/onCoreTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart5($scope.countdetails);
					});

			$scope.drawChart5 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'iDashboard Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherOnCore = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "iDashboard";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/onCoreTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart6($scope.countdetails);
					});

			$scope.drawChart6 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'iDashboard Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalOnCore = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "iDashboard";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/onCoreTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart7($scope.countdetails);
					});

			$scope.drawChart7 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'iDashboard Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// Alternative Investment Services trend graph for open risks

		$scope.commitTrendForQualysAlternativeInvestment = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Smart Stub";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/alternativeInvestmentTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart8($scope.countdetails);
					});

			$scope.drawChart8 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Smart Stub Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};
				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherAlternativeInvestment = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Smart Stub";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/alternativeInvestmentTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart9($scope.countdetails);
					});

			$scope.drawChart9 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Smart Stub Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalAlternativeInvestment = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Smart Stub";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/alternativeInvestmentTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart11($scope.countdetails);
					});

			$scope.drawChart11 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Smart Stub Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// giars trend graph for open risks
		$scope.commitTrendForQualysGIARS = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "ADPART";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/giarsTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart4($scope.countdetails);
					});

			$scope.drawChart4 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'ADPART Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherGIARS = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "ADPART";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/giarsTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart21($scope.countdetails);
					});

			$scope.drawChart21 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'ADPART Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,
								}
							} ]

						},

					}
				};
				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalGIARS = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "ADPART";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/giarsTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart31($scope.countdetails);
					});

			$scope.drawChart31 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'ADPART Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// emea open risk trend graph
		$scope.commitTrendForQualysEMEA = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Automation";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/emeaTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart($scope.countdetails);
					});

			$scope.drawChart = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Automation Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherEMEA = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Automation";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/emeaTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart25($scope.countdetails);
					});

			$scope.drawChart25 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Automation Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalEMEA = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "Automation";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/emeaTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart3($scope.countdetails);
					});

			$scope.drawChart3 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Automation Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// global fund open risk trend graph
		$scope.commitTrendForQualysGlobalFund = function() {
			/* alert("commitTrendForQualys"); */
			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "TDM";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/globalFundTrendQualysCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart($scope.countdetails);
					});

			$scope.drawChart = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'TDM  Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};
				$('#commitsubdiv').remove(); // this is my <canvas> element
				$('#commitdiv').append(
						' <canvas id="commitsubdiv" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv");
				window.commitsubdiv = new Chart(ctx, config);
			}

		}

		$scope.commitTrendForArcherGlobalFund = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "TDM";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/globalFundTrendArcherCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart2($scope.countdetails);
					});

			$scope.drawChart2 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}
							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'TDM  Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv2').remove(); // this is my <canvas> element
				$('#commitdiv2').append(
						' <canvas id="commitsubdiv2" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv2");
				window.commitsubdiv2 = new Chart(ctx, config);
			}

		}
		$scope.commitTrendForEthicalGlobalFund = function() {

			var vardtfrom = "";
			var vardtto = "";

			$scope.divisionName = "TDM";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}

			if ($rootScope.dtoval == null || $rootScope.dtoval == undefined
					|| $rootScope.dtoval == "") {
				vardtto = "-";
			} else {
				vardtto = $rootScope.dtoval;
			}

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http.get(
					"rest/RiskComplianceServices/globalFundTrendEthicalCount?division="
							+ $scope.divisionName + "&fromdate=" + vardtfrom
							+ "&todate=" + vardtto, config).success(
					function(response) {
						$scope.countdetails = response;
						console.log("countdetails", $scope.countdetails);
						$scope.drawChart3($scope.countdetails);
					});

			$scope.drawChart3 = function(data) {
				/* alert("hsfhjgfdf"); */
				$scope.data = data
				$scope.labeldate = [];
				$scope.graphdata = [];
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.labeldate.push($scope.data[i].startdate);

					$scope.graphdata.push($scope.data[i].count);
				}
				var config = {
					type : 'line',
					data : {
						labels : $scope.labeldate,
						datasets : [ {
							data : $scope.graphdata,
							borderWidth : 1,
							borderColor : 'rgb(67, 204, 194)',

						} ]
					},
					options : {
						responsive : true,
						maintainAspectRatio : false,
						scales : {
							xAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'Time Period',
									fontColor : "rgb(67, 204, 194)",

								},
								type : "time",
								unit : "day",
								time : {
									displayFormats : {
										millisecond : "SSS [ms]",
										second : "h:mm:ss a",
										minute : "h:mm:ss a",
										hour : "MMM D, hA",
										day : "ll",
										week : "ll",
										month : "MMM YYYY",
										quarter : "[Q]Q - YYYY",
										year : "YYYY"
									},
									tooltipFormat : "D MMM YYYY",

								},
								gridLines : {
									color : "rgba(255,255,255,0.2)",

								}

							} ],
							yAxes : [ {
								scaleLabel : {
									display : true,
									labelString : 'TDM  Count',
									fontColor : "rgb(67, 204, 194)",

								},
								gridLines : {

									color : "rgba(255,255,255,0.2)",

								},
								ticks : {
									beginAtZero : true,

								}
							} ]

						},

					}
				};

				$('#commitsubdiv1').remove(); // this is my <canvas> element
				$('#commitdiv1').append(
						' <canvas id="commitsubdiv1" height="100"> </canvas>');

				var ctx = document.getElementById("commitsubdiv1");
				window.commitsubdiv1 = new Chart(ctx, config);
			}

		}
		// end of open risks

		// beginning of overdue
		// URagencyOverdueOpenRisks counts
		$scope.URagencyOverdueOpenRisks = function() {
			/* alert("in"); */

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/URagencyOverdueOpenRisksCount?vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {

								$scope.countdetails = response;
								$scope.URagencyOpenRisksCount = 0;
								$scope.subaccountingOverdueCount = 0;
								$scope.onCoreMiddleOfficeOverdue = 0;
								$scope.alternativeInvestment = 0;
								$scope.giarsOverdue = 0;
								$scope.emea = 0;
								$scope.globalFundAccountingOverdue = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.subaccountingOverdueCount = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.giarsOverdue = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.emea = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.URagencyOpenRisksCount = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.alternativeInvestment = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.onCoreMiddleOfficeOverdue = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.globalFundAccountingOverdue = $scope.countdetails[i].count;
									}
								}

							});

		}

		// overdue risk for archer data

		$scope.archerURagencyOverdueOpenRisks = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/ArcherURagencyOverdueOpenRisks?division="
									+ $scope.divisionName + "&vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {

								$scope.countdetails = response;
								$scope.openRiskusAgencyArcherData = 0;
								$scope.overdueRisksSubaccountingArcherData = 0;
								$scope.overdueRisksOnCoreMiddleCountArcherData = 0;
								$scope.overdueRiskAlternativeInvestmentCountArcherData = 0;
								$scope.overdueRiskGiarsCountArcherData = 0;
								$scope.overdueRiskEMEACountArcherData = 0;
								$scope.overdueRiskGlobalFundCountArcherData = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.overdueRisksSubaccountingArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.overdueRiskGiarsCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.overdueRiskEMEACountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.openRiskusAgencyArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.overdueRiskAlternativeInvestmentCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.overdueRisksOnCoreMiddleCountArcherData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.overdueRiskGlobalFundCountArcherData = $scope.countdetails[i].count;
									}
								}

							});

		}

		// overdue risk for ethical data

		$scope.ethicalURagencyOverdueOpenRisks = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/EthicalURagencyOverdueOpenRisks?division="
									+ $scope.divisionName + "&vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {

								$scope.countdetails = response;
								$scope.overdueRiskusAgencyEthicalData = 0;
								$scope.overdueRisksSubaccountingEthicalData = 0;
								$scope.overdueRisksOnCoreMiddleCountEthicalData = 0;
								$scope.overdueRiskAlternativeInvestmentCountEthicalData = 0;
								$scope.overdueRiskGiarsCountEthicalData = 0;
								$scope.overdueRiskEMEACountEthicalData = 0;
								$scope.overdueRiskGlobalFundCountEthicalData = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.overdueRisksSubaccountingEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.overdueRiskGiarsCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.overdueRiskEMEACountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.overdueRiskusAgencyEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.overdueRiskAlternativeInvestmentCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.overdueRisksOnCoreMiddleCountEthicalData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.overdueRiskGlobalFundCountEthicalData = $scope.countdetails[i].count;
									}
								}

							});

		}

		// overdue risk for network data

		$scope.networkURagencyOverdueOpenRisks = function() {
			/* alert("in"); */

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/networkURagencyOverdueOpenRisks?division="
									+ $scope.divisionName + "&vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {

								$scope.countdetails = response;
								$scope.overdueRiskusAgencyNetworkData = 0;
								$scope.overdueRisksSubaccountingNetworkData = 0;
								$scope.overdueRisksOnCoreMiddleCountNetworkData = 0;
								$scope.overdueRiskAlternativeInvestmentCountNetworkData = 0;
								$scope.overdueRiskGiarsCountNetworkData = 0;
								$scope.overdueRiskEMEACountNetworkData = 0;
								$scope.overdueRiskGlobalFundCountNetworkData = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.overdueRisksSubaccountingNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.overdueRiskGiarsCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.overdueRiskEMEACountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.overdueRiskusAgencyNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.overdueRiskAlternativeInvestmentCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.overdueRisksOnCoreMiddleCountNetworkData = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.overdueRiskGlobalFundCountNetworkData = $scope.countdetails[i].count;
									}
								}

							});

		}

		// end of overdue risk by category

		// start of due in 60 days by risk category
		$scope.getdate = function(dtfrom) {
			$rootScope.dfromval = dtfrom;
			$scope.URagencyOpenRisksByDaysEthical();
			$scope.URagencyOpenRisksByDays();
			$scope.URagencyOpenRisksByDaysNetwork();
			$scope.URagencyOpenRisksByDaysArcher();

		}

		// overdue for ethical by days
		$scope.URagencyOpenRisksByDaysEthical = function() {
			/* alert("fsdfs") */

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/URagencyOpenRisksByDaysEthical?vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {

								$scope.countdetails = response;
								$scope.URagencyByDaysEthical = 0;
								$scope.subaccByDaysEthical = 0;
								$scope.onCoreByDaysEthical = 0;
								$scope.alternativeByDaysEthical = 0;
								$scope.giarsByDaysEthical = 0;
								$scope.emeaByDaysEthical = 0;
								$scope.globalfundByDaysEthical = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.subaccByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.giarsByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.emeaByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.URagencyByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.alternativeByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.onCoreByDaysEthical = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.globalfundByDaysEthical = $scope.countdetails[i].count;
									}
								}

								console.log($scope.URagencyByDays)
							});

		}

		// overdue for archer by days
		// URagencyOverdueOpenRisks counts
		$scope.URagencyOpenRisksByDaysArcher = function() {
			/* alert("fsdfs") */
			$scope.divisionName = "IOT";
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/URagencyOpenRisksByDaysArcher?division="
									+ $scope.divisionName + "&vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.URagencyByDaysArcher = 0;
								$scope.subaccByDaysArcher = 0;
								$scope.onCoreByDaysArcher = 0;
								$scope.alternativeByDaysArcher = 0;
								$scope.giarsByDaysArcher = 0;
								$scope.emeaByDaysArcher = 0;
								$scope.globalfundByDaysArcher = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.subaccByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.giarsByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.emeaByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.URagencyByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.alternativeByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.onCoreByDaysArcher = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.globalfundByDaysArcher = $scope.countdetails[i].count;
									}
								}

							});

		}

		// overdue for qualys by days
		// URagencyOverdueOpenRisks counts
		$scope.URagencyOpenRisksByDays = function() {
			/* alert("fsdfs") */

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/URagencyOpenRisksByDays?vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.URagencyByDays = 0;
								$scope.subaccByDays = 0;
								$scope.onCoreByDays = 0;
								$scope.alternativeByDays = 0;
								$scope.giarsByDays = 0;
								$scope.emeaByDays = 0;
								$scope.globalfundByDays = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.subaccByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.giarsByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.emeaByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.URagencyByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.alternativeByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.onCoreByDays = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.globalfundByDays = $scope.countdetails[i].count;
									}
								}

								console.log($scope.URagencyByDays)

							});

		}

		// network URagencyOverdueOpenRisks counts
		$scope.URagencyOpenRisksByDaysNetwork = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			var vardtfrom = "";
			var vardtto = "";
			if ($rootScope.dfromval == null || $rootScope.dfromval == undefined
					|| $rootScope.dfromval == "") {
				vardtfrom = "-";
			} else {
				vardtfrom = $rootScope.dfromval;
			}
			$http
					.get(
							"rest/RiskComplianceServices/URagencyOpenRisksByDaysNetwork?division="
									+ $scope.divisionName + "&vardtfrom="
									+ vardtfrom, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.URagencyByDaysNetwork = 0;
								$scope.subaccByDaysNetwork = 0;
								$scope.onCoreByDaysNetwork = 0;
								$scope.alternativeByDaysNetwork = 0;
								$scope.giarsByDaysNetwork = 0;
								$scope.emeaByDaysNetwork = 0;
								$scope.globalfundByDaysNetwork = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].division == "QI BOTS") {
										$scope.subaccByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "ADPART") {
										$scope.giarsByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Automation") {
										$scope.emeaByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "IOT") {
										$scope.URagencyByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "Smart Stub") {
										$scope.alternativeByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "iDashboard") {
										$scope.onCoreByDaysNetwork = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].division == "TDM") {
										$scope.globalfundByDaysNetwork = $scope.countdetails[i].count;
									}
								}

							});

		}

		
		
		
		
		
		

	
	
		// Network penetration by division pie chart
		$scope.NetworkPenetrationByDivision=function(){
	
	 		var token  = getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	      
			 $http.get("rest/" +
			 		"RiskComplianceServices/NetworkBydivision",config).then(function (response) {
				    $scope.dataNetwork = response.data; 
				    if($scope.dataNetwork.length !=0){
				    $scope.prioritychartNetwork($scope.dataNetwork);}
				    else{
				    	$('#networkdivision').remove(); // this is my <canvas> element
  				 	  $('#divisionNetworkdiv').append('<canvas id="networkdivision"> </canvas>'); 	
				    }
				}) ;    	

			   $scope.prioritychartNetwork  = function(result){ 
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
		        	   $('#networkdivision').remove(); // this is my <canvas> element
		        				 	  $('#divisionNetworkdiv').append('<canvas id="networkdivision"> </canvas>'); 

		        var ctx = document.getElementById("networkdivision");
		        var networkdivision = new Chart(ctx, {
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
		            
		        }); 
		        
		        ctx.onclick = function(evt) {
	      			
	      		      var activePoints = networkdivision.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('networkDetailsData');
	      		
	      		        $scope.getnetworkPieChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getnetworkPieChartDetails= function( selectedDivisionData){
		    	 
		    	  $rootScope.selectedDivision=selectedDivisionData;
	      		console.log("5532",$rootScope.selectedDivision)
	      		var token  = getEncryptedValue();

	      		  var config = {headers: {
	      		          'Authorization': token
	      		          }};

	      		$http.get("./rest/RiskComplianceServices/networkChartDataDetails?division="+ $rootScope.selectedDivision,config).success(
	      			function(response) {
	      				$rootScope.networkDetailss = response;
	      				$timeout(function(){moreLink()},100);
	      				$rootScope.rowCollection=response;
	      				console.log($scope.networkDetailss);
	      			});

		    	    
		    	  
		    	  
		      }
			   
			   
			   
			   }; 
	 }
		
		
		//ethical By division
		$scope.EthicalHackFindingsByDivision=function(){
			
	 		var token  = getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	      
			 $http.get("rest/" +
			 		"RiskComplianceServices/EthicalBydivision",config).then(function (response) {
				    $scope.dataEthical = response.data; 
				    if($scope.dataEthical.length !=0){
				    $scope.prioritychart($scope.dataEthical);}
				    else{
				    	$('#ethicaldivision').remove(); // this is my <canvas> element
  				 	  $('#divisionethicaldiv').html('<canvas id="ethicaldivision"> </canvas>'); 	
				    }
				}) ;    	

			   $scope.prioritychart  = function(result){ 
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
		        	   $('#ethicaldivision').remove(); // this is my <canvas> element
		        				 	  $('#divisionethicaldiv').html('<canvas id="ethicaldivision"> </canvas>'); 

		        var ctx = document.getElementById("ethicaldivision");
		        var ethicaldivision = new Chart(ctx, {
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
		            
		        }); 
		        
		        ctx.onclick = function(evt) {
	      			
	      		      var activePoints = ethicaldivision.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('detailsEthicalData');
	      		
	      		        $scope.getethicalPieChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getethicalPieChartDetails= function( selectedDivisionData){
		    	 
		    	  $rootScope.selectedDivision=selectedDivisionData;
	      		console.log("5532",$rootScope.selectedDivision)
	      		var token  = getEncryptedValue();

	      		  var config = {headers: {
	      		          'Authorization': token
	      		          }};

	      		$http.get("./rest/RiskComplianceServices/ethicalChartDataDetails?division="+ $rootScope.selectedDivision,config).success(
	      			function(response) {
	      				$rootScope.ethicalDetailss = response;
	      				$timeout(function(){moreLink()},100);
	      				$rootScope.rowCollection=response;
	      				console.log($scope.ethicalDetailss);
	      			});

		    	    
		    	  
		    	  
		      }
		       
			   
			   
			   
			   
			   }; 
	 }
		
		
		//qualys by division
	$scope.QualysVulnerabilitiesbyDivision=function(){
			
	 		var token  = getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	      
			 $http.get("rest/" +
			 		"RiskComplianceServices/QualysBydivision",config).then(function (response) {
				    $scope.dataQualys = response.data; 
				    if($scope.dataQualys.length !=0){
				    $scope.priorityQualys($scope.dataQualys);}
				    else{
				    	$('#qualysdivision').remove(); // this is my <canvas> element
  				 	  $('#divisionQualysdiv').html('<canvas id="qualysdivision"> </canvas>'); 	
				    }
				}) ;    	

			   $scope.priorityQualys  = function(result){ 
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
		            
		        }); 
		        ctx.onclick = function(evt) {
	      			
	      		      var activePoints = qualysdivision.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('qualysDetailsData');
	      		
	      		        $scope.getQualysPieChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getQualysPieChartDetails= function( selectedDivisionData){
    		    	 
    		    	  $rootScope.selectedDivision=selectedDivisionData;
    	      		console.log("5532",$rootScope.selectedDivision)
    	      		var token  = getEncryptedValue();

    	      		  var config = {headers: {
    	      		          'Authorization': token
    	      		          }};

    	      		$http.get("./rest/RiskComplianceServices/qualysChartDataDetails?division="+ $rootScope.selectedDivision,config).success(
    	      			function(response) {
    	      				$rootScope.qualysDetailss = response;
    	      				$timeout(function(){moreLink()},100);
    	      				$rootScope.rowCollection=response;
    	      				console.log($scope.qualysDetailss);
    	      			});

    		    	    
    		    	  
    		    	  
    		      }
			   
			   
			   
			   
			   
			   }; 
	 }
		
		
		//archer by division
		$scope.archerByDivisionChart=function(){
			
	 		var token  = getEncryptedValue();
	        var config = {headers: {
	                'Authorization': token
	                }};
	      
			 $http.get("rest/" +
			 		"RiskComplianceServices/ArcherBydivision",config).then(function (response) {
				    $scope.dataArcher = response.data; 
				    if($scope.dataArcher.length !=0){
				    $scope.priorityArcher($scope.dataArcher);}
				    else{
				    	$('#archerdivision').remove(); // this is my <canvas> element
  				 	  $('#divisiondiv').html('<canvas id="archerdivision"> </canvas>'); 	
				    }
				}) ;    	

			   $scope.priorityArcher  = function(result){ 
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
		        	   $('#archerdivision').remove(); // this is my <canvas> element
		        				 	  $('#divisiondiv').html('<canvas id="archerdivision"> </canvas>'); 

		        var ctx = document.getElementById("archerdivision");
		        var archerdivision = new Chart(ctx, {
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
		            
		        }); 
		        
		    
			   
	      		  ctx.onclick = function(evt) {
	      			
	      		      var activePoints = archerdivision.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('archerDetailsData');
	      		
	      		        $scope.getArcherPieChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getArcherPieChartDetails= function( selectedDivisionData){
      		    	 
      		    	  $rootScope.selectedDivision=selectedDivisionData;
      	      		console.log("5532",$rootScope.selectedDivision)
      	      		var token  = getEncryptedValue();

      	      		  var config = {headers: {
      	      		          'Authorization': token
      	      		          }};

      	      		$http.get("./rest/RiskComplianceServices/archerChartDataDetails?division="+ $rootScope.selectedDivision,config).success(
      	      			function(response) {
      	      				$rootScope.archerDetailss = response;
      	      				$timeout(function(){moreLink()},100);
      	      				$rootScope.rowCollection=response;
      	      				console.log($scope.archerDetailss);
      	      			});

      		    	    
      		    	  
      		    	  
      		      }
			   
			   
			   
			   }; 
	 }
		
		
		
		
		// ethical status by bar chart
		 $scope.EthicalByStatus=function(){
			 var token  = getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
		        
		        	 $http.get("rest/RiskComplianceServices/EthicalByStatus",config).then(function (response) {
							$scope.EthicalStatus = response.data; 
							if($scope.EthicalStatus.length !=0){
						    $scope.designerchart($scope.EthicalStatus);}
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
		    		 $scope.labels1.push($scope.result[i].division);
		    		 $scope.data1.push($scope.result[i].count);
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
		 	                    	   labelString: ' Ethical Hack Count ',
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
			 	                    	   labelString: 'Status',
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
		            
		        }); 
		        
		         
		         
		        ctx.onclick = function(evt) {
	      			
	      		      var activePoints = designerbarchart.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('detailsEthicalData');
	      		
	      		        $scope.getethicalBarChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getethicalBarChartDetails= function( selectedDivisionData){
		    	 
		    	  $rootScope.selectedDivision=selectedDivisionData;
	      		console.log("5532",$rootScope.selectedDivision)
	      		var token  = getEncryptedValue();

	      		  var config = {headers: {
	      		          'Authorization': token
	      		          }};

	      		$http.get("./rest/RiskComplianceServices/ethicalStatusChartDataDetails?status="+ $rootScope.selectedDivision,config).success(
	      			function(response) {
	      				$rootScope.ethicalDetailss = response;
	      				$timeout(function(){moreLink()},100);
	      				$rootScope.rowCollection=response;
	      				console.log($scope.ethicalDetailss);
	      			});

		    	    
		    	  
		    	  
		      } 
		         
		         
		         
		         
		         }; 
	  

		 	}

		//archer by status 
		 $scope.ArcherByStatus=function(){
			 var token  = getEncryptedValue();
		        var config = {headers: {
		                'Authorization': token
		                }};
		        
		        	 $http.get("rest/RiskComplianceServices/ArcherByStatus",config).then(function (response) {
							$scope.archerStatus = response.data; 
							if($scope.archerStatus.length !=0){
						    $scope.ArcherStatuschart($scope.archerStatus);}
							else{
								$('#archerbarchart').remove(); // this is my <canvas> element
	        				 	  $('#archdiv').append('<canvas id="archerbarchart"> </canvas>'); 	
							}
				     }) ;
				 
		         $scope.ArcherStatuschart  = function(result){ 
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
		        
		        	   $('#archerbarchart').remove(); // this is my <canvas> element
		        				 	  $('#archdiv').append('<canvas id="archerbarchart"> </canvas>'); 

		        var ctx = document.getElementById("archerbarchart");
		        var archerbarchart = new Chart(ctx, {
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
		 	                    	   labelString: ' Archer  Count ',
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
			 	                    	   labelString: 'Status',
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
		            
		        });
		        
		         
		        ctx.onclick = function(evt) {
	      			
	      		      var activePoints = archerbarchart.getElementsAtEvent(evt);
	      		      if (activePoints[0]) {
	      		        var chartData = activePoints[0]['_chart'].config.data;
	      		        var idx = activePoints[0]['_index'];

	      		        var label = chartData.labels[idx];
	      		        $scope.selectedDivisionData=label;
	      		        var value = chartData.datasets[0].data[idx];

	      		        var url = "http://example.com/?label=" + label + "&value=" + value;
	      		      /*  console.log(url);
	      		        alert(url);*/
	      		      $state.go('archerDetailsData');
	      		
	      		        $scope.getarcherBarChartDetails( $scope.selectedDivisionData);
	      		        
	      		      }
	      		      
	      		     
	      		    };
	      		  $scope.getarcherBarChartDetails= function( selectedDivisionData){
		    	 
		    	  $rootScope.selectedDivision=selectedDivisionData;
	      		console.log("5532",$rootScope.selectedDivision)
	      		var token  = getEncryptedValue();

	      		  var config = {headers: {
	      		          'Authorization': token
	      		          }};

	      		$http.get("./rest/RiskComplianceServices/archerStatusChartDataDetails?status="+ $rootScope.selectedDivision,config).success(
	      			function(response) {
	      				$rootScope.archerDetailss = response;
	      				$timeout(function(){moreLink()},100);
	      				$rootScope.rowCollection=response;
	      				console.log($scope.archerDetailss);
	      			});

		    	    
		    	  
		    	  
		      } 
		        
		         
		         
		         
		         }; 
	  

		 	}

		
		
		/*// ethical by status row chart
		$scope.ethicalByStatusLineChart1 = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("rest/RiskComplianceServices/ethicalstatusRowChart",
					config).success(function(response) {
				$scope.tdmresponsedata = response;
				// alert(JSON.stringify($scope.tdmresponsedata));
				makeGraphs(response);
			});

			function makeGraphs(apiData) {

				// Start Transformations
				var dataSet = apiData;

				// Create a Crossfilter instance
				var ndx = crossfilter(dataSet);

				// alert(JSON.stringify(dataSet));

				// Define Dimensions

				var ethicalStatus = ndx.dimension(function(d) {
					return d.remediationStatus;
				});

				// console.log((defectOpenStatus.size()));

				// Calculate metrics

				var ethicalStatusTrend = ethicalStatus.group();

				$scope.ofs = 0;
				var all = ndx.groupAll();

				var ethicalStatusRowChart = dc.rowChart("#poverty-chart");

				$scope.ofs = 0;
				$scope.pag = 7;

				var rowChartColors = d3.scale.ordinal().range(
						[ "rgba(255, 113, 189, 0.9)", "rgba(9, 191, 22, 0.9)",
								"rgba(6, 239, 212, 0.9)",
								"rgba(236, 255, 0, 0.9)",
								"rgba(255, 159, 64, 0.9)",
								"rgba(255, 31, 0, 0.9)" ]);

				ethicalStatusRowChart
				// .width(300)
				.colors(rowChartColors).height(300).dimension(ethicalStatus)
						.group(ethicalStatusTrend).title(function(d) {
							return d.value;
						}).legend(dc.legend()).renderTitleLabel([ false ])
						.xAxis().ticks(4);

				dc.renderAll();
			}
			;
		}*/

		// archer by status row chart
		/*$scope.archerByStatusChart = function() {

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http.get("rest/RiskComplianceServices/archerStatusRowChart",
					config).success(function(response) {
				$scope.archerStatusss = response;
				// alert(JSON.stringify($scope.tdmresponsedata));
				makeGraphs(response);
			});

			function makeGraphs(apiData) {

				// Start Transformations
				var dataSet = apiData;

				// Create a Crossfilter instance
				var ndx = crossfilter(dataSet);

				// alert(JSON.stringify(dataSet));

				// Define Dimensions

				var archerStatus = ndx.dimension(function(d) {
					return d.status;
				});

				// console.log((defectOpenStatus.size()));

				// Calculate metrics

				var archerStatusTrend = archerStatus.group();

				$scope.ofs = 0;
				var all = ndx.groupAll();

				var archerStatusRowChart = dc.rowChart("#poverty-chart1");

				$scope.ofs = 0;
				$scope.pag = 7;

				var rowChartColors = d3.scale.ordinal().range(
						[ "rgba(255, 113, 189, 0.9)", "rgba(9, 191, 22, 0.9)",
								"rgba(6, 239, 212, 0.9)",
								"rgba(236, 255, 0, 0.9)",
								"rgba(255, 159, 64, 0.9)",
								"rgba(255, 31, 0, 0.9)" ]);

				archerStatusRowChart
				// .width(300)
				.colors(rowChartColors).height(300).dimension(archerStatus)
						.group(archerStatusTrend).title(function(d) {
							return d.value;
						}).legend(dc.legend()).renderTitleLabel([ false ])
						.xAxis().ticks(4);

				dc.renderAll();
			}
			;
		}

		// qualys by division row cahrt
		$scope.qualysVulnerabilitiesByDivisionChart = function() {
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			$http
					.get(
							"rest/RiskComplianceServices/qualysVulnerabilitiesByDivisionChart",
							config).success(function(response) {
						$scope.qualysDivision = response;
						// alert(JSON.stringify($scope.tdmresponsedata));
						makeGraphs(response);
					});

			function makeGraphs(apiData) {

				// Start Transformations
				var dataSet = apiData;

				// Create a Crossfilter instance
				var ndx = crossfilter(dataSet);

				// alert(JSON.stringify(dataSet));

				// Define Dimensions

				var qualysDivision = ndx.dimension(function(d) {
					return d.division;
				});

				// console.log((defectOpenStatus.size()));

				// Calculate metrics

				var qualysDivisionTrend = qualysDivision.group();

				$scope.ofs = 0;
				var all = ndx.groupAll();

				var qualysDivisionRowChart = dc.rowChart("#poverty-chart2");

				$scope.ofs = 0;
				$scope.pag = 7;

				var rowChartColors = d3.scale.ordinal().range(
						[ "rgba(255, 113, 189, 0.9)", "rgba(9, 191, 22, 0.9)",
								"rgba(6, 239, 212, 0.9)",
								"rgba(236, 255, 0, 0.9)",
								"rgba(255, 159, 64, 0.9)",
								"rgba(255, 31, 0, 0.9)" ]);

				
			
				qualysDivisionRowChart
				// .width(300)
				.colors(rowChartColors).height(300).dimension(qualysDivision)
						.group(qualysDivisionTrend).title(function(d) {
							return d.value;
						}).legend(dc.legend()).renderTitleLabel([ false ])
						.xAxis().ticks(4);

				dc.renderAll();
			}
			;
		}*/
		// archer by division for critical and high data

		$scope.archerCriticalHighByDivision = function() {

			$scope.divisionName = "IOT ";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/usAgencyArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.enterprisedata4 = 0;
								$scope.enterprisedata5 = 0;
								$scope.businessdata4 = 0;
								$scope.businessdata5 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.businessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.businessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.enterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.enterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.archerCriticalHighByDivisionSubAccounting = function() {

			$scope.divisionName = "QI BOTS";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/subAccountingArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.subbusinessdata4 = 0;
								$scope.subbusinessdata5 = 0;
								$scope.subenterprisedata5 = 0;
								$scope.subenterprisedata4 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.subbusinessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.subbusinessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.subenterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.subenterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.archerCriticalHighByDivisionOnCore = function() {

			$scope.divisionName = "iDashboard";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/onCoreArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.oncorebusinessdata4 = 0;
								$scope.oncorebusinessdata5 = 0;
								$scope.oncoreenterprisedata5 = 0;
								$scope.oncoreenterprisedata4 = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.oncorebusinessdata4 = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.oncorebusinessdata5 = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.oncoreenterprisedata5 = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.oncoreenterprisedata4 = $scope.countdetails[i].count;
									}

									/*
									 * else{ $scope.oncoreenterprisedata4=0;
									 * $scope.oncoreenterprisedata5=0;
									 * $scope.oncorebusinessdata5=0;
									 * $scope.oncorebusinessdata4=0; }
									 */

								}

							});
		}
		$scope.archerCriticalHighByDivisionAlternative = function() {

			$scope.divisionName = "Smart Stub";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/alternativeArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.alternativebusinessdata4 = 0;
								$scope.alternativebusinessdata5 = 0;
								$scope.alternativeenterprisedata5 = 0;
								$scope.alternativeenterprisedata4 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.alternativebusinessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.alternativebusinessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.alternativeenterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.alternativeenterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.archerCriticalHighByDivisionGIARS = function() {

			$scope.divisionName = "ADPART";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/giarsArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.giarsbusinessdata4 = 0;
								$scope.giarsbusinessdata5 = 0;
								$scope.giarsenterprisedata5 = 0;
								$scope.giarsenterprisedata4 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.giarsbusinessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.giarsbusinessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.giarsenterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.giarsenterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.archerCriticalHighByDivisionEMEA = function() {

			$scope.divisionName = "Automation";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/emeaArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.emeabusinessdata4 = 0;
								$scope.emeabusinessdata5 = 0;
								$scope.emeaenterprisedata5 = 0;
								$scope.emeaenterprisedata4 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.emeabusinessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.emeabusinessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.emeaenterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.emeaenterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.archerCriticalHighByDivisionGlobal = function() {

			$scope.divisionName = "TDM";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/globalArcherCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								$scope.globalbusinessdata4 = 0;
								$scope.globalbusinessdata5 = 0;
								$scope.globalenterprisedata5 = 0;
								$scope.globalenterprisedata4 = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].businessRiskClass == "Business Risk - 4") {
										$scope.globalbusinessdata4 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Business Risk - 5") {
										$scope.globalbusinessdata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 5") {
										$scope.globalenterprisedata5 = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].businessRiskClass == "Enterprise Risk - 4") {
										$scope.globalenterprisedata4 = $scope.countdetails[i].count;
									}

								}

							});
		}
		// ethical Hack By division for critical high low
		$scope.ethicalHackCriticalHighByDivision = function() {

			$scope.divisionName = "IOT ";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/usAgencyEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalUs = 0;
								$scope.HighUs = 0;
								$scope.mediumUs = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.HighUs = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumUs = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalUs = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionSubAccounting = function() {

			$scope.divisionName = "QI BOTS";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/subaccountingEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalSubAccounting = 0;
								$scope.HighSubAccounting = 0;
								$scope.mediumSubAccounting = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4) {
										$scope.HighSubAccounting = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3) {
										$scope.mediumSubAccounting = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5) {
										$scope.criticalSubAccounting = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionOncore = function() {

			$scope.divisionName = "iDashboard";
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/oncoreEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticaoncore = 0;
								$scope.Highoncore = 0;
								$scope.mediumoncore = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highoncore = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumoncore = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticaoncore = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionAlternative = function() {

			$scope.divisionName = "Smart Stub";
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/alternativeEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalalternative = 0;
								$scope.Highalternative = 0;
								$scope.mediumalternative = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highalternative = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumalternative = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalalternative = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionGIARS = function() {

			$scope.divisionName = "ADPART";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/giarsEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalgiars = 0;
								$scope.Highgiars = 0;
								$scope.mediumgiars = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highgiars = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumgiars = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalgiars = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionEMEA = function() {

			$scope.divisionName = "Automation";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/emeaEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalemea = 0;
								$scope.Highemea = 0;
								$scope.mediumemea = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highemea = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumemea = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalemea = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.ethicalHackCriticalHighByDivisionglobal = function() {
			$scope.divisionName = "TDM";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/globalEthicalCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalglobal = 0;
								$scope.Highglobal = 0;
								$scope.mediumglobal = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highglobal = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumglobal = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalglobal = $scope.countdetails[i].count;
									}

								}

							});
		}
		// network penetration critical,high,medium and low by division
		$scope.networkCriticalHighByDivision = function() {

			$scope.divisionName = "IOT ";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/usAgencyNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalUs = 0;
								$scope.HighUs = 0;
								$scope.mediumUs = 0;
								$scope.lowUs = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.HighUs = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumUs = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalUs = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowUs = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionSubAccounting = function() {

			$scope.divisionName = "QI BOTS";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/subaccountingNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalSubAccounting = 0;
								$scope.HighSubAccounting = 0;
								$scope.mediumSubAccounting = 0;
								$scope.lowSubAccounting = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4) {
										$scope.HighSubAccounting = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3) {
										$scope.mediumSubAccounting = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5) {
										$scope.criticalSubAccounting = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 2) {
										$scope.lowSubAccounting = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionOncore = function() {

			$scope.divisionName = "iDashboard";
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/oncoreNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticaoncore = 0;
								$scope.Highoncore = 0;
								$scope.mediumoncore = 0;
								$scope.lowoncore = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highoncore = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumoncore = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticaoncore = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowoncore = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionAlternative = function() {

			$scope.divisionName = "Smart Stub";
			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/alternativeNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalalternative = 0;
								$scope.Highalternative = 0;
								$scope.mediumalternative = 0;
								$scope.lowalternative = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highalternative = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumalternative = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalalternative = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowalternative = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionGIARS = function() {

			$scope.divisionName = "ADPART";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/giarsNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalgiars = 0;
								$scope.Highgiars = 0;
								$scope.mediumgiars = 0;
								$scope.lowgiars = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highgiars = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumgiars = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalgiars = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowgiars = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionEMEA = function() {

			$scope.divisionName = "Automation";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/emeaNetworkCriticalHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalemea = 0;
								$scope.Highemea = 0;
								$scope.mediumemea = 0;
								$scope.lowemea = 0;
								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highemea = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumemea = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalemea = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowemea = $scope.countdetails[i].count;
									}

								}

							});
		}
		$scope.networkCriticalHighByDivisionglobal = function() {
			$scope.divisionName = "TDM";

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};
			$http
					.get(
							"rest/RiskComplianceServices/globalNetworkHighByDivision?division="
									+ $scope.divisionName, config)
					.success(
							function(response) {
								$scope.countdetails = response;
								console.log($scope.countdetails);
								$scope.criticalglobal = 0;
								$scope.Highglobal = 0;
								$scope.mediumglobal = 0;
								$scope.lowglobal = 0;

								for (var i = 0; i < $scope.countdetails.length; i++) {
									if ($scope.countdetails[i].severity == 4.0) {
										$scope.Highglobal = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 3.0) {
										$scope.mediumglobal = $scope.countdetails[i].count;
									} else if ($scope.countdetails[i].severity == 5.0) {
										$scope.criticalglobal = $scope.countdetails[i].count;
									}

									else if ($scope.countdetails[i].severity == 2.0) {
										$scope.lowglobal = $scope.countdetails[i].count;
									}

								}

							});
		}
		
		///
		
		
//for network critical data
		$scope.getNetworkCriticalData=function(selectedDivision){
			
			
			$state.go('networkDetailsData');
			
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsNetworkCriticalData($rootScope.selectedDivision);
		}
		$scope.getDetailsNetworkCriticalData=function(selectedDivision){

		$rootScope.selectedDivision=selectedDivision;
		$scope.severity=5.0;
		console.log("5532",$rootScope.selectedDivision)
		var token  = getEncryptedValue();

		  var config = {headers: {
		          'Authorization': token
		          }};
		  

		$http.get("./rest/RiskComplianceServices/networkCriticalDataDetails?division="+ $rootScope.selectedDivision + "&severity="
				+ $scope.severity,config).success(
			function(response) {
				$rootScope.networkDetailsData = response;
				$rootScope.rowCollection=response;
				console.log($scope.networkDetailsData);
			});

		}
		
		//for network high dat
$scope.getNetworkHighData =function(selectedDivision){
			
			
			$state.go('networkDetailsData');
			
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsNetworkHighData($rootScope.selectedDivision);
		}
		$scope.getDetailsNetworkHighData=function(selectedDivision){

		$rootScope.selectedDivision=selectedDivision;
		$scope.severity=4.0;
		console.log("5532",$rootScope.selectedDivision)
		var token  = getEncryptedValue();

		  var config = {headers: {
		          'Authorization': token
		          }};
		  

		$http.get("./rest/RiskComplianceServices/networkHighDataDetails?division="+ $rootScope.selectedDivision + "&severity="
				+ $scope.severity,config).success(
			function(response) {
				$rootScope.networkDetailsss = response;
				$rootScope.rowCollection=response;
				console.log($scope.networkDetailsss);
			});

		}
		//for network medium data details 
$scope.getNetworkMediumData =function(selectedDivision){
			
			
			$state.go('networkDetailsData');
			
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsNetworkMediumData($rootScope.selectedDivision);
		}
		$scope.getDetailsNetworkMediumData=function(selectedDivision){

		$rootScope.selectedDivision=selectedDivision;
		$scope.severity=3.0;
		console.log("5532",$rootScope.selectedDivision)
		var token  = getEncryptedValue();

		  var config = {headers: {
		          'Authorization': token
		          }};
		  

		$http.get("./rest/RiskComplianceServices/networkMediumDataDetails?division="+ $rootScope.selectedDivision + "&severity="
				+ $scope.severity,config).success(
			function(response) {
				$rootScope.networkDetailss = response;
				$rootScope.rowCollection=response;
				console.log($scope.networkDetailss);
			});

		}
		//for low severity network details 
$scope.getNetworkLowData =function(selectedDivision){
			
			
			$state.go('networkDetailsData');
			
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsNetworkLowData($rootScope.selectedDivision);
		}
		$scope.getDetailsNetworkLowData=function(selectedDivision){

		$rootScope.selectedDivision=selectedDivision;
		$scope.severity=2.0;
		console.log("5532",$rootScope.selectedDivision)
		var token  = getEncryptedValue();

		  var config = {headers: {
		          'Authorization': token
		          }};
		  

		$http.get("./rest/RiskComplianceServices/networkLowDataDetails?division="+ $rootScope.selectedDivision + "&severity="
				+ $scope.severity,config).success(
			function(response) {
				$rootScope.networkDetails = response;
				$rootScope.rowCollection=response;
				console.log($scope.networkDetails);
			});

		}
$scope.getEthicalCriticalData =function(selectedDivision){
			
			
		$state.go('detailsEthicalData');
			
				$rootScope.selectedDivision=selectedDivision;
			
			$scope.getDetailsEthicalCriticalData($rootScope.selectedDivision);
		}
		$scope.getDetailsEthicalCriticalData=function(selectedDivision){

		$rootScope.selectedDivision=selectedDivision;
		$scope.severity=5.0;
		console.log("5532",$rootScope.selectedDivision)
		var token  = getEncryptedValue();

		  var config = {headers: {
		          'Authorization': token
		          }};
		  

		$http.get("./rest/RiskComplianceServices/ethicalcriticalDataDetails?division="+ $rootScope.selectedDivision + "&severity="
				+ $scope.severity,config).success(
			function(response) {
				$rootScope.ethicalDetails = response;
				$rootScope.rowCollection=response;
				console.log($scope.ethicalDetails);
			});

		}
		
		//for ethical medium data data
		
		
		$scope.getEthicalhighData =function(selectedDivision){
			
			
			$state.go('detailsEthicalData');
				
					$rootScope.selectedDivision=selectedDivision;
				
				$scope.getDetailsEthicalhighData($rootScope.selectedDivision);
			}
			$scope.getDetailsEthicalhighData=function(selectedDivision){

			$rootScope.selectedDivision=selectedDivision;
			$scope.severity=4.0;
			console.log("5532",$rootScope.selectedDivision)
			var token  = getEncryptedValue();

			  var config = {headers: {
			          'Authorization': token
			          }};
			  

			$http.get("./rest/RiskComplianceServices/ethicalhighDataDetails?division="+ $rootScope.selectedDivision + "&severity="
					+ $scope.severity,config).success(
				function(response) {
					$rootScope.ethicalDetails = response;
					$rootScope.rowCollection=response;
					console.log($scope.ethicalDetails);
				});

			}
			//ethical data for medium severity 
			$scope.getEthicalmediumData =function(selectedDivision){
				
				
				$state.go('detailsEthicalData');
					
						$rootScope.selectedDivision=selectedDivision;
					
					$scope.getDetailsEthicalmediumData($rootScope.selectedDivision);
				}
				$scope.getDetailsEthicalmediumData=function(selectedDivision){

				$rootScope.selectedDivision=selectedDivision;
				$scope.severity=3.0;
				console.log("5532",$rootScope.selectedDivision)
				var token  = getEncryptedValue();

				  var config = {headers: {
				          'Authorization': token
				          }};
				  

				$http.get("./rest/RiskComplianceServices/ethicalhighDataDetails?division="+ $rootScope.selectedDivision + "&severity="
						+ $scope.severity,config).success(
					function(response) {
						$rootScope.ethicalDetails = response;
						$rootScope.rowCollection=response;
						console.log($scope.ethicalDetails);
					});

				}
			//for archer enterprise risk high data 
				
				$scope.getArcherEnterpriseHighData =function(selectedDivision){
					
					
					$state.go('archerDetailsData');
						
							$rootScope.selectedDivision=selectedDivision;
						
						$scope.getDetailArcherEnterpriseHighData($rootScope.selectedDivision);
					}
					$scope.getDetailArcherEnterpriseHighData=function(selectedDivision){

					$rootScope.selectedDivision=selectedDivision;
					$scope.businessRisk="Enterprise Risk - 4";
					console.log("5532",$rootScope.selectedDivision)
					var token  = getEncryptedValue();

					  var config = {headers: {
					          'Authorization': token
					          }};
					  

					$http.get("./rest/RiskComplianceServices/archerEntripriseHighDataDetails?division="+ $rootScope.selectedDivision + "&businessRisk="
							+ $scope.businessRisk,config).success(
						function(response) {
							$rootScope.archerDetails = response;
							$timeout(function(){moreLink()},100);
							$rootScope.rowCollection=response;
							console.log($scope.archerDetails);
						});

					}
				//for archer enterprise critical data 
					$scope.getArcherEnterpriseCriticalData =function(selectedDivision){
						
						
						$state.go('archerDetailsData');
							
								$rootScope.selectedDivision=selectedDivision;
							
							$scope.getDetailArcherEnterpriseCriticalData($rootScope.selectedDivision);
						}
						$scope.getDetailArcherEnterpriseCriticalData=function(selectedDivision){

						$rootScope.selectedDivision=selectedDivision;
						$scope.businessRisk="Enterprise Risk - 5";
						console.log("5532",$rootScope.selectedDivision)
						var token  = getEncryptedValue();

						  var config = {headers: {
						          'Authorization': token
						          }};
						  

						$http.get("./rest/RiskComplianceServices/archerEntripriseCriticalDataDetails?division="+ $rootScope.selectedDivision + "&businessRisk="
								+ $scope.businessRisk,config).success(
							function(response) {
								$rootScope.archerDetails = response;
								$timeout(function(){moreLink()},100);
								$rootScope.rowCollection=response;
								console.log($scope.archerDetails);
							});

						}
						//for archer enterprise business risk data for critical severity 
						$scope.getArcherBusinessCriticalData =function(selectedDivision){
							
							
							$state.go('archerDetailsData');
								
									$rootScope.selectedDivision=selectedDivision;
								
								$scope.getDetailArcherBusinessCriticalData($rootScope.selectedDivision);
							}
							$scope.getDetailArcherBusinessCriticalData=function(selectedDivision){

							$rootScope.selectedDivision=selectedDivision;
							$scope.businessRisk="Business Risk - 5";
							console.log("5532",$rootScope.selectedDivision)
							var token  = getEncryptedValue();

							  var config = {headers: {
							          'Authorization': token
							          }};
							  

							$http.get("./rest/RiskComplianceServices/archerBusinessCriticalDataDetails?division="+ $rootScope.selectedDivision + "&businessRisk="
									+ $scope.businessRisk,config).success(
								function(response) {
									$rootScope.archerDetails = response;
									$timeout(function(){moreLink()},100);
									$rootScope.rowCollection=response;
									console.log($scope.archerDetails);
								});

							}
							//for archer business high risk data 
							$scope.getArcherBusinessHighData =function(selectedDivision){
								
								
								$state.go('archerDetailsData');
									
										$rootScope.selectedDivision=selectedDivision;
									
									$scope.getDetailArcherBusinessHighData($rootScope.selectedDivision);
								}
								$scope.getDetailArcherBusinessHighData=function(selectedDivision){

								$rootScope.selectedDivision=selectedDivision;
								$scope.businessRisk="Business Risk - 4";
								console.log("5532",$rootScope.selectedDivision)
								var token  = getEncryptedValue();

								  var config = {headers: {
								          'Authorization': token
								          }};
								  

								$http.get("./rest/RiskComplianceServices/archerBusinessHighDataDetails?division="+ $rootScope.selectedDivision + "&businessRisk="
										+ $scope.businessRisk,config).success(
									function(response) {
										$rootScope.archerDetails = response;
										$timeout(function(){moreLink()},100);
										$rootScope.rowCollection=response;
										console.log($scope.archerDetails);
									});

								}
	$scope.exportTableToExcel=function (tableID, filename = ''){
		
		    var downloadLink;
		    var dataType = 'application/vnd.ms-excel';
		    var tableSelect = document.getElementById(tableID);
		    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
		    
		    // Specify file name
		    filename = filename?filename+'.xls':'excel_data.xls';
		    
		    // Create download link element
		    downloadLink = document.createElement("a");
		    
		    document.body.appendChild(downloadLink);
		    
		    if(navigator.msSaveOrOpenBlob){
		        var blob = new Blob(['\ufeff', tableHTML], {
		            type: dataType
		        });
		        navigator.msSaveOrOpenBlob( blob, filename);
		    }else{
		        // Create a link to the file
		        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
		    
		        // Setting the file name
		        downloadLink.download = filename;
		        
		        //triggering the function
		        downloadLink.click();
		    }
		}
		///
		//csv download
	$scope.exportTableToCSV=function (filename) {
	    var csv = [];
	    var rows = document.querySelectorAll("table tr");
	    
	    for (var i = 0; i < rows.length; i++) {
	        var row = [];
	        var cols = rows[i].querySelectorAll("td, th");
	        
	        for (var j = 0; j < cols.length; j++) 
	            row.push(cols[j].innerText);
	        
	        csv.push(row.join(","));        
	    }

	    // Download CSV file
	    downloadCSV(csv.join("\n"), filename);
	}
	function downloadCSV(csv, filename) {
	    var csvFile;
	    var downloadLink;

	    // CSV file
	    csvFile = new Blob([csv], {type: "text/csv"});

	    // Download link
	    downloadLink = document.createElement("a");

	    // File name
	    downloadLink.download = filename;

	    // Create a link to the file
	    downloadLink.href = window.URL.createObjectURL(csvFile);

	    // Hide download link
	    downloadLink.style.display = "none";

	    // Add the link to DOM
	    document.body.appendChild(downloadLink);

	    // Click download link
	    downloadLink.click();
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
