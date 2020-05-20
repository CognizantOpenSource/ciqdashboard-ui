(function() {
	'use strict';

	angular.module('MetricsPortal.pages.login').service('UserService',
			function() {

				var uservo = " ";

				this.setuservo = function(uservo) {
					this.uservo = uservo;
				};

				this.getuservo = function() {
					return this.uservo;
				};

			}).controller('LoginCtrl', LoginCtrl,
			function($scope, UserService) {

			});

	function LoginCtrl($uibModal, Idle, $scope, $rootScope, $templateCache,
			$base64, $window, $location, $http, $state, localStorageService,
			$cookies, $sessionStorage, $route, toastr, $timeout) {

		
		// $rootScope.loggedIn = false;
		$rootScope.registration = false;
		$rootScope.registereduser = false;
		$rootScope.changeMenu = false;
		$rootScope.menubar = false;
		$scope.operationaldrops = true;
		$scope.wrongpasswordcount = 0;
		$scope.started = false;
		$rootScope.var4 = true;
		$rootScope.aclock = localStorageService.get('aclock'); // only during
		// wrong
		// password lock
		$rootScope.acLock = localStorageService.get('acLock'); // main page
		$rootScope.isAdmin = localStorageService.get('admin');
		$rootScope.loggedInuserId = localStorageService.get('loggedInuserId');
		$rootScope.userNamee = localStorageService.get('userNamee');
		$rootScope.operational = localStorageService.get('operational');
		$rootScope.lifeCycle = localStorageService.get('lifeCycle');
		$rootScope.qbot = localStorageService.get('qbot');
		$rootScope.coEDashboard = localStorageService.get('coEDashboard');
		$rootScope.riskCompliance = localStorageService.get('riskCompliance');
		if ($rootScope.riskCompliance == true
				|| $rootScope.coEDashboard == true) {
			$rootScope.customMetrics = true;
		} else if ($rootScope.riskCompliance == false
				|| $rootScope.coEDashboard == false) {
			$rootScope.customMetrics = false;
		}

		//console.log("customMetricsvxcv", $rootScope.customMetrics)
		$rootScope.isLdap = localStorageService.get('isLdap');
		$rootScope.orgName = localStorageService.get('orgName');
		$rootScope.orgLogo = localStorageService.get('orgLogo');
		/* $rootScope.picSrc = localStorageService.get('userImg'); */
		// localStorageService.set('timeperiod',"Last 90 days");
		$rootScope.projects = localStorageService.get('projects');

		function getEncryptedValue() {
			var username = localStorageService.get('userIdA');
			var password = localStorageService.get('passwordA');
			var tokeen = $base64.encode(username + ":" + password);
			return tokeen;
		}

		var screenWidth = $window.innerWidth;

		if (screenWidth < 700) {
			$scope.includeMobileTemplate = true;
		} else {
			$scope.includeDesktopTemplate = true;
		}

		$scope.licenseCheck = function() {
			$http
					.get("rest/jsonServices/licenseDetails")
					.success(
							function(response) {
								$rootScope.licenseDetails = response;
								localStorageService.set('licenseDetails',
										$rootScope.licenseDetails);

								if ($rootScope.licenseDetails != "") {
									$scope.days = $rootScope.licenseDetails[0].daysRemaining;
									localStorageService
											.set('days', $scope.days);
								}
								if ($rootScope.licenseDetails == "") {
									$rootScope.noLicenseMsg = true;
									$rootScope.licenseExpiry = false;
								} else if ($rootScope.licenseDetails[0].macId == null) {
									$rootScope.licenseExpiry = true;
									$rootScope.noLicenseMsg = false;
								} else if ($rootScope.licenseDetails[0].isMacIdVerify) {
									if ($scope.days <= '0') {
										$rootScope.licenseExpiry = true;
										$rootScope.noLicenseMsg = false;
										$rootScope.daysRemaining = $scope.days;
										$rootScope.version = $rootScope.licenseDetails[0].version;
									} else if ($scope.days > 5) {
										$rootScope.licenseExpiry = false;
										$rootScope.daysRemaining = $scope.days;
										$rootScope.version = $rootScope.licenseDetails[0].version;
									} else if ($scope.days < 5
											&& !$scope.days == '0') {
										$rootScope.licenseExpiry = false;
										$rootScope.errormsg = true;
										$rootScope.daysRemaining = $scope.days;
										$rootScope.version = $rootScope.licenseDetails[0].version;
									}
								}
							});

		}

		if (localStorageService.get('days') <= 30
				&& localStorageService.get('admin')) {
			$rootScope.adminerrormsg = false;
			$rootScope.adminDaysRemaining = localStorageService.get('days');
		}

		/*
		 * window.onload = function(){ document.getElementById('close').onclick =
		 * function(){ this.parentNode.parentNode.parentNode
		 * .removeChild(this.parentNode.parentNode); return false; }; };
		 */

		if ($rootScope.isLdap == false) {
			$rootScope.profilePicAvailable = false;
			$rootScope.picSrc = localStorageService.get('userImg');
		} else if ($rootScope.isLdap == true
				&& (localStorageService.get('picSrc') == null || localStorageService
						.get('picSrc') == "")) {
			$rootScope.profilePicAvailable = false;
			$rootScope.picSrc = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAA"
					+ "DFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kA"
					+ "AAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoM"
					+ "TlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/"
					+ "i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NW"
					+ "MDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb"
					+ "3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCo"
					+ "AW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbEr"
					+ "C1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWV"
					+ "oeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD"
					+ "9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQ"
					+ "B6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/"
					+ "a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPo"
					+ "pHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNo"
					+ "dEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mI"
					+ "lRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW3"
					+ "2ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H"
					+ "8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLg"
					+ "KGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA"
					+ "1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2"
					+ "rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuET"
					+ "K0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1G"
					+ "bIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8Z"
					+ "PbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC";
		} else {
			$rootScope.profilePicAvailable = true;
			$rootScope.picSrc = localStorageService.get('picSrc');
		}

		// Setting the value in UserService
		$rootScope.setLoginDetails = function(userVO) {
			UserService.setuservo(userVO);
		};

		$scope.changeState = function() {
			$rootScope.registration = true;
			$state.go('register');
		}
		$scope.pageReload = function() {
			location.reload();
		}
		$rootScope.logout1 = function() {
			if (localStorageService.get('loggedIn') == true) {
				$scope.started = false;
				$rootScope.showExpiredMessages();
			}
		}

		// Modal dialog
		$scope.open = function(url, size) {
			$uibModal.open({
				animation : true,
				templateUrl : url,

				scope : $scope,
				size : size,
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		};

		/*
		 * $rootScope.logout=function(){ location.reload();
		 * localStorage.clear(); localStorageService.clearAll;
		 * 
		 * $location.path('/'); $rootScope.loggedIn = false; }
		 */
		// change password - save
		$scope.savenewpassword = function(newPassword, confirmnewpassword) {
			if (newPassword == confirmnewpassword) {
				var newPassword = btoa(newPassword);
				var token = getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http({
					url : "./rest/jsonServices/savenewpassword",
					method : "POST",
					data : newPassword,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {
									$scope.result = response;
									if ($scope.result == 0) {
										$scope
												.open(
														'app/pages/login/changePasswordSuccess.html',
														'sm');
									}
								});
			} else {
				$scope.open('app/pages/login/errorChangePassword.html', 'sm');
			}
		}

		$scope.Resetpassword = function(newPassword, confirmnewpassword) {
			if (newPassword == confirmnewpassword) {
				var newPassword = btoa(newPassword);
				var token = getEncryptedValue();
				var config = {
					headers : {
						'Authorization' : token
					}
				};

				$http({
					url : "./rest/jsonServices/Resetpassword",
					method : "POST",
					data : newPassword,
					headers : {
						'Authorization' : token
					}
				})
						.success(
								function(response) {
									$scope.result = response;
									if ($scope.result == 0) {
										$scope
												.open(
														'app/pages/login/changePasswordSuccess.html',
														'sm');
									}
								});
			} else {
				$scope.open('app/pages/login/errorChangePassword.html', 'sm');
			}
		}

		$rootScope.showExpiredMessages = function() {
			$uibModal.open({
				animation : true,
				templateUrl : 'app/pages/login/sessionExpired.html',
				scope : $scope,
				size : 'sm',
				resolve : {
					items : function() {
						return $scope.items;
					}
				}
			});
		}

		$rootScope.logout = function() {
			
			
			
			location.reload();
			localStorage.clear();

			delete $sessionStorage.user;
			localStorageService.clearAll;
			$templateCache.removeAll();
			delete $scope.password;

			delete $sessionStorage.admin;
			delete $sessionStorage.description;
			window.location = "./"
			$rootScope.loggedIn = false;

		}

		$scope.home = function() {

			if ($location.path().split('/').pop() == "requirements"
					|| $location.path().split('/').pop() == "testcases"
					|| $location.path().split('/').pop() == "functionalCoverageData"
					|| $location.path().split('/').pop() == "testexecution"
					|| $location.path().split('/').pop() == "defects"
					|| $location.path().split('/').pop() == "addNewMetrics"
					|| $location.path().split('/').pop() == "modifyMetrics"
					|| $location.path().split('/').pop() == "userstoriesdetails"
					|| $location.path().split('/').pop() == "slideshow") {
				$state.go('operationalDashBoard');
				$rootScope.menubar = true;
				$rootScope.var1 = true;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
			} else if ($location.path().split('/').pop() == "operationalDashBoard"
					|| $location.path().split('/').pop() == "viewDashbaordOperational"
					|| $location.path().split('/').pop() == "createDashbaordOperational"
					|| $location.path().split('/').pop() == "globalview") {
				$state.go('operationalDashBoard');
				$rootScope.menubar = false;
				$rootScope.var1 = true;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
			}

			else if ($location.path().split('/').pop() == "dashboard") {
				$state.go('operationalDashBoard');
				$rootScope.menubar = false;
				$rootScope.var1 = true;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
			}

			else if ($location.path().split('/').pop() == "createDashbaord"
					|| $location.path().split('/').pop() == "viewDashbaord"
					|| $location.path().split('/').pop() == "lifecycledashboard"
					|| $location.path().split('/').pop() == "createProdDashbaord") {
				$state.go('lifecycledashboard');
				$rootScope.menubar = false;
				$rootScope.var1 = true;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
			}

			else if ($location.path().split('/').pop() == "buildMetrics"
					|| $location.path().split('/').pop() == "codeanalysis"
					|| $location.path().split('/').pop() == "testMgmtMetrics"
					|| $location.path().split('/').pop() == "viewgitdashboard"
					|| $location.path().split('/').pop() == "perfMetrics"
					|| $location.path().split('/').pop() == "chefrundetails"
					|| $location.path().split('/').pop() == "chefnodedetails"
					|| $location.path().split('/').pop() == "userstorieslifecycledetails") {
				$state.go('lifecycledashboard');
				$rootScope.menubar = false;
				$rootScope.var1 = false;
				$rootScope.var2 = true;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;

				/*console.log("menu from lifecycle"
						+ JSON.stringify($rootScope.menubar));*/

			} else if ($location.path().split('/').pop() == "admin"
					|| $location.path().split('/').pop() == "toolSelect") {
				$state.go('admin');
				$rootScope.menubar = false;
				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = true;
				$rootScope.var5 = false;
				/*console.log("menu from lifecycle"
						+ JSON.stringify($rootScope.menubar));*/

			} else if ($location.path().split('/').pop() == "verticalcharts"
					|| $location.path().split('/').pop() == "capabilityreportchart") {
				$state.go('internalreport');
				$rootScope.menubar = false;
				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = true;
			} else {

				$state.go('dashbot');
				$rootScope.menubar = false;
				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = true;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
				/*console.log("menu from dashbot"
						+ JSON.stringify($rootScope.menubar));*/

			}
		}

		$scope.back = function() {
			if ($location.path().split('/').pop() == "userstorieslifecycledetails"
					|| $location.path().split('/').pop() == "testMgmtMetrics"
					|| $location.path().split('/').pop() == "viewgitdashboard"
					|| $location.path().split('/').pop() == "buildMetrics"
					|| $location.path().split('/').pop() == "chefrundetails"
					|| $location.path().split('/').pop() == "codeanalysis") {

				$state.go('viewDashbaord');

			} else if ($location.path().split('/').pop() == "userstoriesdetails"
					|| $location.path().split('/').pop() == "testexecution"
					|| $location.path().split('/').pop() == "defects"
					|| $location.path().split('/').pop() == "requirements"
					|| $location.path().split('/').pop() == "testcases") {

				$state.go('dashboard');
			}

		}

		$scope.hideSideBar = function() {

			$rootScope.menubar = false;

		}
		$scope.gotoHome = function() {
			$window.localStorage.clear();
			$rootScope.loggedIn = false;
			$rootScope.registereduser = false;
			$rootScope.registration = false;
			$rootScope.active = false;
			setTimeout(function() {
				$('#inputPassword').val('');
			}, 50);
		}

		$scope.SessionData = function(role, menuType) {
			
			if (menuType == "dashbot") {
				$rootScope.menubar = false;
				$scope.operationaldrops = false;

				$sessionStorage.menuType1 = menuType;
				// alert("sessionStorage in dashbot *****" +
				// $sessionStorage.menuType1);

				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = true;
				$rootScope.var5 = false;
				$rootScope.var6 = false;

			} else if (menuType == "lifecycle") {
				$scope.operationaldrops = false;
				$rootScope.menubar = false;
				$sessionStorage.menuType1 = menuType;
				$rootScope.var1 = false;
				$rootScope.var2 = true;
				$rootScope.var3 = false;
				$rootScope.var5 = false;
				$rootScope.var6 = false;

			} else if (menuType == "operational") {
				$rootScope.menubar = false;
				$scope.operationaldrops = true;
				$sessionStorage.menuType1 = menuType;
				$rootScope.var1 = true;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var5 = false;
				$rootScope.var6 = false;
			} else if (menuType == "internalreport") {
				$rootScope.menubar = false;
				$scope.operationaldrops = false;
				$sessionStorage.menuType1 = menuType;
				$rootScope.var5 = true;
				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var6 = false;
			} else if (menuType == "riskCompliance") {
				$scope.operationaldrops = false;
				$rootScope.menubar = false;
				$sessionStorage.menuType1 = menuType;
				$rootScope.var1 = false;
				$rootScope.var2 = false;
				$rootScope.var3 = false;
				$rootScope.var4 = false;
				$rootScope.var5 = false;
				$rootScope.var6 = true;

			}

			else if (menuType == null || menuType == "") {

				if ($sessionStorage.menuType1 == "operational") {
					$scope.operationaldrops = true;
					$rootScope.menubar = false;
					$rootScope.var1 = true;
					$rootScope.var2 = false;
					$rootScope.var3 = false;
					$rootScope.var5 = false;
					$rootScope.var6 = false;
				} else if ($sessionStorage.menuType1 == "lifecycle") {
					$scope.operationaldrops = false;
					$rootScope.menubar = false;
					$rootScope.var1 = false;
					$rootScope.var2 = true;
					$rootScope.var3 = false;
					$rootScope.var5 = false;
					$rootScope.var6 = false;
				} else if ($sessionStorage.menuType1 == "dashbot") {
					$scope.operationaldrops = false;
					$rootScope.menubar = false;
					$rootScope.var1 = false;
					$rootScope.var2 = false;
					$rootScope.var3 = true;
					$rootScope.var5 = false;
					$rootScope.var6 = false;
				} else if ($sessionStorage.menuType1 == "internalreport") {
					$scope.operationaldrops = false;
					$rootScope.menubar = false;
					$rootScope.var1 = false;
					$rootScope.var2 = false;
					$rootScope.var3 = false;
					$rootScope.var5 = true;
					$rootScope.var6 = false;
				}

				// alert(" sessionStorage in null" + $sessionStorage.menuType1);
			}

			// alert("inside session data menutype" + $rootScope.menuType +
			// "menu bar " + $rootScope.menubar );

			$rootScope.loggedInuserId = localStorageService
					.get('loggedInuserId');
			$rootScope.role = localStorageService.get('role');
			$rootScope.operational = localStorageService.get('operational');
			$rootScope.lifeCycle = localStorageService.get('lifeCycle');
			$rootScope.qbot = localStorageService.get('qbot');
			$rootScope.coEDashboard = localStorageService.get('coEDashboard');
			$rootScope.riskCompliance = localStorageService
					.get('riskCompliance');
			$rootScope.customMetrics = localStorageService.get('customMetrics');
			//console.log("571", $rootScope.customMetrics)
			$rootScope.dashboardName = $sessionStorage.dashName;
			$rootScope.description = $sessionStorage.description;
			$rootScope.owner = $sessionStorage.owner;
			$rootScope.dashid = $sessionStorage.dashid;

			// $rootScope.menuType=$sessionStorage.menuType
			// console.log("menuTyp in session data" + $rootScope.menuType);

			if (localStorageService.get('loggedIn')) {

				$rootScope = $sessionStorage.user;
				$scope.loggedIn = localStorageService.get('loggedIn');

			}

		}

		$scope.showGroup = function(userName, password) {

			localStorageService.set('userIdA', userName);
			var passwordauth = btoa(password);
			localStorageService.set('passwordA', passwordauth);

			var token = getEncryptedValue();
			var config = {
				headers : {
					'Authorization' : token
				}
			};

			if ((userName == null || userName == '')
					&& (password == null || password == '')) {
				$scope.showErrorMsg();
				$rootScope.loggedIn = false;
			}

			$http
					.post(
							"./rest/jsonServices/authentication",
							$scope.Authorization,
							{
								withCredentials : true,
								headers : {
									'Authorization' : 'Basic '
											+ btoa(localStorageService
													.get('userIdA')
													+ ":"
													+ localStorageService
															.get('passwordA'))
															
								}
							})
					.success(
							function(data) {
								if (data.userName != null) {
									var landingPage = '';
									$scope.inValidCredentials = false;
									$rootScope.role = data.role;
									$rootScope.loggedInuserId = userName;
									
									if (data != null && data.accessible == true) {
										
									    
									    
									    localStorageService.set('isEnablepublicopt',
									    		data.enbPublicOpt);

										localStorageService.set('loggedIn',
												true);
										localStorageService.set('userImg',
												data.userImg);
										localStorageService.set('isLdap',
												data.ldap);

										localStorageService.set('ispassReset',
												data.ispassReset);
										$rootScope.passReset = localStorageService
												.get('ispassReset');
										//console.log($rootScope.passReset);

										localStorageService.set('picSrc',
												data.profilePhoto);
										$rootScope.picSrc = localStorageService
												.get('picSrc');

										$rootScope.isLdap = localStorageService
												.get('isLdap');

										if ($rootScope.isLdap == false) {
											$rootScope.profilePicAvailable = false;
											$rootScope.picSrc = localStorageService
													.get('userImg');
										} else if ($rootScope.isLdap == true
												&& (localStorageService
														.get('picSrc') == null || localStorageService
														.get('picSrc') == "")) {

											$rootScope.profilePicAvailable = false;
											$rootScope.picSrc = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAA"
													+ "DFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kA"
													+ "AAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoM"
													+ "TlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/"
													+ "i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NW"
													+ "MDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb"
													+ "3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCo"
													+ "AW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbEr"
													+ "C1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWV"
													+ "oeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD"
													+ "9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQ"
													+ "B6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/"
													+ "a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPo"
													+ "pHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNo"
													+ "dEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mI"
													+ "lRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW3"
													+ "2ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H"
													+ "8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLg"
													+ "KGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA"
													+ "1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2"
													+ "rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuET"
													+ "K0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1G"
													+ "bIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8Z"
													+ "PbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC";
										} else {
											$rootScope.profilePicAvailable = true;
										}
										$rootScope.started = true;
										localStorageService.set('loggedIn',
												true);
										localStorageService.set('userNamee',
												data.userName);
										$rootScope.userNamee = localStorageService
												.get('userNamee');

										localStorageService.set('picSource',
												data.profilePhoto);
										localStorageService.set('role',
												data.role);
										localStorageService.set(
												'loggedInuserId', data.userId);
										localStorageService.set('operational',
												data.operational);
										localStorageService.set('lifeCycle',
												data.lifeCycle);
										localStorageService.set('qbot',
												data.qbot);
										localStorageService.set('coEDashboard',
												data.coEDashboard);
										localStorageService.set(
												'riskCompliance',
												data.riskCompliance);
										localStorageService.set(
												'customMetrics',
												$rootScope.customMetrics);
										/*
										 * if(data.riskCompliance==true ||
										 * data.coEDashboard==true){
										 * localStorageService.set('customMetrics',true); }
										 * else if(data.riskCompliance==false &&
										 * data.coEDashboard==false) {
										 * localStorageService.set('customMetrics',false); }
										 */

										localStorageService.set('active',
												data.active);
										localStorageService.set('admin',
												data.admin);

										localStorageService.set('acLock',
												data.acLock);
										$rootScope.isAdmin = localStorageService
												.get('admin');
										$rootScope.acLock = localStorageService
												.get('acLock');

										localStorageService.set('orgName',
												data.orgName);
										$rootScope.orgName = localStorageService
												.get('orgName');
										localStorageService.set('orgLogo',
												data.orgLogo);
										$rootScope.orgLogo = localStorageService
												.get('orgLogo');

										$rootScope.loggedIn = true;

										if ($rootScope.passReset == true) {
											$rootScope.loggedIn = false;
											//console.log("response");

										} else {
											$rootScope.loggedIn = true;
										}

										$rootScope.role = localStorageService
												.get('role');
										$rootScope.loggedInuserId = localStorageService
												.get('loggedInuserId');
										$rootScope.menuType = data.defaultMenuType;

										if (data.selectedProjects == null) {
											localStorageService.set('projects',
													false);
											$rootScope.projects = localStorageService
													.get('projects');
										} else if (data.selectedProjects.length != 0) {
											localStorageService.set('projects',
													true);
											$rootScope.projects = localStorageService
													.get('projects');
										}

										$rootScope.operational = localStorageService
												.get('operational');
										$rootScope.lifeCycle = localStorageService
												.get('lifeCycle');
										$rootScope.qbot = localStorageService
												.get('qbot');
										$rootScope.coEDashboard = localStorageService
												.get('coEDashboard');
										$rootScope.riskCompliance = localStorageService
												.get('riskCompliance');
										$rootScope.customMetrics = localStorageService
												.get('customMetrics');

										$rootScope.active = localStorageService
												.get('active');
										$rootScope.admin = localStorageService
												.get('admin');
										if ($rootScope.admin == true) {
											$rootScope.topmenu = true;
										} else if ($rootScope.operational == false
												&& $rootScope.lifeCycle == false
												&& $rootScope.qbot == false) {
											$rootScope.topmenu = false;
										}
										if ($rootScope.admin) {
											$state.go('admin');
											$rootScope.menubar = false;
											$rootScope.var1 = false;
											$rootScope.var2 = false;
											$rootScope.var3 = false;
											$rootScope.var5 = false;
										} else if ($rootScope.operational) {
											$state.go('operationalDashBoard');
											$rootScope.var1 = true;
											$rootScope.menubar = false;

										} else if ($rootScope.lifeCycle) {
											$state.go('lifecycledashboard');
											$rootScope.menubar = false;

										} else if ($rootScope.qbot) {
											$rootScope.menubar = false;

											$state.go('dashbot')
										} else if ($rootScope.coEDashboard) {
											$rootScope.menubar = false;
											$state.go('internalreport');
										}

										else if ($rootScope.riskCompliance) {
											$rootScope.menubar = false;
											$state.go('riskCompliance');
										} else if ($rootScope.customMetrics) {
											$rootScope.menubar = false;
											$state.go('customMetrics');
										}
									} else if (data != null
											&& data.accessible == false) {
										$rootScope.registereduser = true;
										$rootScope.loggedIn = false;
										$rootScope.unavailable = false;
									}
								}

								else {
									/* alert("Invalid Credentials"); */
									$scope.wrongpasswordcount = $scope.wrongpasswordcount + 1;
									localStorageService.set(
											'wrongpasswordcount',
											$scope.wrongpasswordcount);

									if ($scope.wrongpasswordcount >= 3) {
										var token = getEncryptedValue();
										var config = {
											headers : {
												'Authorization' : token
											}
										};
										$http
												.get(
														"./rest/jsonServices/lockAccount",
														config)
												.success(
														function(response) {
															$rootScope.aclock = response;
															localStorageService
																	.set(
																			'aclock',
																			$rootScope.aclock);
															if (localStorageService
																	.get('aclock')) {
																$state
																		.go('index');
															} else {
																$scope
																		.showErrorMsg();
															}
														})
									} else {
										$scope.showErrorMsg();
									}
								}

							})

			/*
			 * .error(function(data){ $scope.showErrorMsg();
			 * 
			 * });
			 */

			$scope.updateSideBar = function(role, menuType) {

				/*
				 * $http.get("./rest/jsonServices/getMenuItems?role="+role+"&menuType="+menuType).success(function
				 * (response) { $rootScope.menus=response;
				 * $scope.childmethod(response); }) ;
				 */

				// alert("updateSideBar" + menuType);
				if (menuType == "dashbot") {
					$rootScope.menubar = false;
					$scope.sideBar(menuType);

					$rootScope.var1 = false;
					$rootScope.var2 = false;
					$rootScope.var3 = true;
					$rootScope.var5 = false;

				} else if (menuType == "lifecycle") {
					$rootScope.menubar = false;
					$scope.sideBar(menuType);
					$rootScope.var1 = false;
					$rootScope.var2 = true;
					$rootScope.var3 = false;
					$rootScope.var5 = false;

				} else {
					$rootScope.menubar = true;
					$scope.sideBar(menuType);
					$rootScope.var1 = true;
					$rootScope.var2 = false;
					$rootScope.var3 = false;
					$rootScope.var5 = false;
				}

			};

			$scope.sideBar = function(menuType) {

				$sessionStorage.menuType = menuType;

				//console.log("menuTyp menuTypeValue" + $sessionStorage.menuType);
			};

			/*
			 * $scope.childmethod = function(response) {
			 * 
			 * $rootScope.$emit("CallParentMethod", response); };
			 */

			$scope.showErrorMsg = function() {
				$("#loginError").fadeOut(200000);
				$scope.errorMessage = " UserId and Password didn't match.Please enter valid credentials";
				/*
				 * toastr.error("UserId and Password didn't match.Please Enter
				 * Valid Credentials", 'Error');
				 */
			};
			
			
			

		}

	}

})();