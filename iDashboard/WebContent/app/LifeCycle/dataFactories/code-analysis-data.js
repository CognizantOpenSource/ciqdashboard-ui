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

    function codeAnalysisData($http,$base64,localStorageService) {   
    	
    	 function getEncryptedValue()
   	  {
   		 var username= localStorageService.get('userIdA');
   	     var password= localStorageService.get('passwordA');
   	        var tokeen =$base64.encode(username+":"+password);
   	        
   	        return tokeen;
   	        }

        return {
            details: details
        };
        
       

        // search for current builds
        function details() {
        	 var token  = getEncryptedValue();
             var config = {headers: {
                     'Authorization': token
                     }};
            return $http.get("rest/lifeCycleServices/ca_detail",config)
                .then(function (response) {                	
                    return response.data;
                });
        }
    }
})();





