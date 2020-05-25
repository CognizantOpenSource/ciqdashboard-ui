(function() {
  'use strict';

  angular.module('MetricsPortal.theme.components')
    .directive('operationalbaWizard', operationalbaWizard);

  /** @ngInject */
  function operationalbaWizard() {
    return {
      restrict: 'E',
      scope: {
          text: "@myText"
        	  },
      transclude: true,
      templateUrl: 'app/theme/components/baWizard/operationalbaWizard.html',
      controllerAs: '$baWizardController',
      controller: 'baWizardCtrl'
    }
  }
})();
