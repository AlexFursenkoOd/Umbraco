(function() {

	function jobSetupDirective() {

		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: Umbraco.Sys.ServerVariables.translatePlus.Plugin + "Directives/jobSetup.html",
			scope: {  
				job: '=',
				options: '=',
                items: '=',
                sendto: '='
			},
			link: link,
			controller: controller
		};

		return directive;

		///////////////////
		function link(scope, el, attr, ctrl) {
			scope.$watch('options', function (newVal, oldVal) {
				if (newVal != undefined) {
                    if (scope.options.singleProvider) {
						scope.getProvider(scope.options.key);
					}
					else {
						scope.getProviders();
					}
				}
			}, true);


		}

		function controller($scope, translateJobService) {

			$scope.getProvider = getProvider;
			$scope.getProviders = getProviders;

			////////////////
			function getProviders() {
				translateJobService.getProviders()
					.then(function (result) {
						$scope.providers = result.data;
					});
			}

			function getProvider(key) {
				translateJobService.getProvider(key)
					.then(function (result) {
						$scope.job.provider = result.data;
					});
			}

		}
	}

	angular.module('umbraco.directives')
		.directive('translateJobSetup', jobSetupDirective);

})();