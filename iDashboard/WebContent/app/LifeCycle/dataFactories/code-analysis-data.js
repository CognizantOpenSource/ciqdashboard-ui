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
        .factory('codeAnalysisData', codeAnalysisData);

    function codeAnalysisData($http, AES, $base64, localStorageService) {   

        return {
            details: details
        };
        
       

        // search for current builds
        function details() {
        	debugger;
        	 var token  = AES.getEncryptedValue();
             var config = {headers: {
                     'Authorization': token
                     }};
            return $http.get("rest/codequality/ca_detail",config)
                .then(function (response) {                	
                    return response.data;
                });
        }
    }
})();





