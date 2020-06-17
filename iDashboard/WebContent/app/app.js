'use strict';

angular.module(
				'MetricsPortal',
				[ 'ngAnimate', 'ui.bootstrap', 'ui.router', 'ngTouch',
						'base64', 'toastr', 'smart-table', 'ngJsTree',
						'ngCookies','ngStorage', 'ngRoute',
						'ngIdle', 'reCAPTCHA', 'LocalStorageModule',
						'oc.lazyLoad', 'angularUtils.directives.dirPagination',
						'dndLists', 'MetricsPortal.theme','MetricsPortal.admin',
						 'MetricsPortal.LifeCycle','MetricsPortal.Login',
						'MetricsPortal.QBot', 'MetricsPortal.SlideShow','MetricsPortal.RiskCompliance','MetricsPortal.ReportData'])
		.config(function(IdleProvider, KeepaliveProvider, TitleProvider) {
			TitleProvider.enabled(false);
			IdleProvider.idle(1200); // 20 mins
			IdleProvider.timeout(5); // in seconds
			KeepaliveProvider.interval(60); // heartbeat in seconds(every 1 min)
			// KeepaliveProvider.http('/api/heartbeat'); // URL that makes sure
			// session
			// is alive
		})

		.config(
				function(localStorageServiceProvider) {
					localStorageServiceProvider.setPrefix('ID').setStorageType(
							'localStorage');
				})
		.config(
				[
						'$routeProvider',
						'$locationProvider',
						'$ocLazyLoadProvider',
						function($routeProvider, $locationProvider,
								$ocLazyLoadProvider) {

							$ocLazyLoadProvider.config({
								// events: true,
								// debug: true,
								modules : [ {
									name : 'tableDependancy',
									files : [ /* 'lib/smart-table.min.js', */
									'lib/ionicons.css'
									/*
									 * 'lib/tableexport.min.js',
									 * 'lib/filesaver.min.js'
									 */]
								}, ]
							});
						} ])
		.run(
				function($rootScope, Idle, $sessionStorage, $location, $route,
						toastr, $uibModal) {

					Idle.watch();

					$rootScope.$on('IdleTimeout', function() {
						$rootScope.logout1();
					});

				})

		.config(
				function(reCAPTCHAProvider) {
					// required: please use your own key :)
					reCAPTCHAProvider
							.setPublicKey('6LeCi2MUAAAAACmT5vTmbuACR24AVyXO5oWpy3AR');

					// optional: gets passed into the Recaptcha.create call
					reCAPTCHAProvider.setOptions({
						theme : 'clean'
					});
				})

		.config(['$routeProvider', '$locationProvider',
						function($routeProvider, $locationProvider) {

						}])
		
		.factory('authHttpResponseInterceptor',
				[ '$q', '$rootScope', '$location', function($q, $rootScope, $location) {
					return {
						response : function(response) {
							if (response.status === 401) {
								// alert(response.status);
							} else if (response.status === 203) {
									$rootScope.showExpiredMessages();
								
							} else if (response.status === 409) {
									$rootScope.showExpiredMessages(0);
								
							} else if (response.status === -1) {
								$rootScope.serverNotFound('Not able to locate Service Server.', response.status);
							}
							return response || $q.when(response);
						},
						
						responseError : function(rejection) {
							if (rejection.status === 401) {
								window.location = "./401.html";
							} else if (rejection.status === 203) {
									$rootScope.showExpiredMessages();
								
							} else if (rejection.status === 409) {
									$rootScope.showExpiredMessages(0);
							
							} else if (rejection.status === -1) {
								$rootScope.serverNotFound('Not able to locate Service Server.', rejection.status);
							}
							return $q.reject(rejection);
						}
					}
				} ]).config([ '$httpProvider', function($httpProvider) {
			// Http Intercpetor to check auth failures for xhr requests
			$httpProvider.interceptors.push('authHttpResponseInterceptor');
		} ]).service('AES', function (localStorageService) {
			const keySize = 256;
			const iterations = 100;
			let _key = null;
			let temp = null;
			this.encode = function (data, change) {
				let authHeader = null;
				if (data.includes('null'))
					return '';
				if (temp == null)
					temp = gk();
				const salt = CryptoJS.lib.WordArray.random(128 / 8);
				if (_key == null) {
					_key = temp[1];
				}
				const key = CryptoJS.PBKDF2(_key, salt, {
					keySize: keySize / 32,
					iterations: iterations
				});

				const iv = CryptoJS.lib.WordArray.random(128 / 8);
				const encrypted = CryptoJS.AES.encrypt(data, key, {
					iv: iv,
					padding: CryptoJS.pad.Pkcs7,
					mode: CryptoJS.mode.CBC
				});
				authHeader = btoa(salt.toString() + ":" + iv.toString() + ":" + encrypted.toString() + ":" +
					temp[0]);
				return authHeader
			}
			this.getEncryptedValue = () => {
				let username = localStorageService.get('userIdA');
				let password = localStorageService.get('passwordA');
				let token = this.encode(username + ":" + password);
				return token;
			};
		});
