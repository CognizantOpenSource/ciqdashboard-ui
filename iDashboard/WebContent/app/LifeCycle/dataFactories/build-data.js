/**
 * @author Mohan.k created on 23.03.2017
 */ 
 /**
 * Gets build related data
 */
(function () {
    'use strict';

    angular
        .module('MetricsPortal.LifeCycle')
        .factory('buildData', buildData);

    function buildData($http, AES, $base64, localStorageService) {       
    	

        return {
            details: details
        };
        
       

        // search for current builds
        function details() {
        	 var token  = AES.getEncryptedValue();
             var config = {headers: {
                     'Authorization': token
                     }};
            return $http.get("rest/buildcontroller/buildsJobs",config)
                .then(function (response) {                	
                    return response.data;
                });
        }
    }
})();





