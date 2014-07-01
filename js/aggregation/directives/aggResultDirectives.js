Curiosity.directive('aggResult', function(aggFactory){
	return {	
		scope: {
			agg : '='
		},	
		templateUrl : "template/aggregation_module/aggResult.html",	
		controller : function ($scope) {
			$scope.isAgg = function (key) {
				return (aggFactory.isAgg(key));
			}
			
			$scope.callFuncWithData = function (func) {
				window[func]($scope.agg);
			}

			$scope.includeExternalScript = function (url, callback) {
				var scripts = document.getElementsByTagName('script');
    			var i = 0;
    			while (i < scripts.length) {
    				if (scripts[i].src == url) {
        				return ;        				
    				}
					i++;
				}
				var script = document.createElement("script");
				script.type = "text/javascript";
				document.body.appendChild(script);
				script.src = url;
				script.onload = callback;
			}
		}
	}
});
