'use strict';

angular
		.module(
				'MetricsPortal',
				[ 'ngAnimate', 'ui.bootstrap', 'ui.router', 'ngTouch',
						'base64', 'toastr', 'smart-table', 'ngJsTree',
						'ngCookies', 'ngStorage', 'ngRoute', 'ngIdle',
						'reCAPTCHA', 'LocalStorageModule', 'oc.lazyLoad',
						'angularUtils.directives.dirPagination', 'dndLists',
						'MetricsPortal.theme', 'MetricsPortal.pages',
						'MetricsPortal.LifeCycle', 'MetricsPortal.QBot'
						 ])
		.config(function(IdleProvider, KeepaliveProvider, TitleProvider) {
			TitleProvider.enabled(false);
			IdleProvider.idle(600); // 15 min
			IdleProvider.timeout(600);
			KeepaliveProvider.interval(60); // heartbeat every 10 min
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
					$rootScope.dataloader = false;
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

		.config(
				[ '$routeProvider', '$locationProvider',
						function($routeProvider, $locationProvider) {

						} ]).factory('authHttpResponseInterceptor',
				[ '$q', '$location', function($q, $scope, $location) {
					return {
						response : function(response) {
							if (response.status === 401) {
								console.log("Response 401");
							}
							return response || $q.when(response);
						},
						responseError : function(rejection) {
							if (rejection.status === 401) {
								console.log("Response Error 401", rejection);
								// alert("No Access");
								window.location = "./";
							}
							return $q.reject(rejection);
						}
					}
				} ]).config([ '$httpProvider', function($httpProvider) {
			// Http Intercpetor to check auth failures for xhr requests
			$httpProvider.interceptors.push('authHttpResponseInterceptor');
		} ]);
