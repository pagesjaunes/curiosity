/** 
* @desc directives used to aggregation result display 
*/
Curiosity.directive('aggResult', function(aggFactory, filters){
	return {	
		scope: {
			agg : '='
		},	
		templateUrl : "template/aggregation_module/aggResult.html",	
		controller : function ($scope) {	
			
			/**
			* @desc check if a string is an aggregation name or not
			* @param string key the string to test
			*/
			$scope.isAgg = function (key) {
				return (aggFactory.isAgg(key));
			}
			
			/**
			* @desc add an agregation filter to an aggregation
			* @param object agg the aggregation where to add the filter
			* @param object filter the filter to add
			*/
			$scope.addFilter = function(filter) {
				filters.addFilter(filter);
			}
			/**
			* @desc remove an aggregation filter 
			* @param object agg agg where the filter is
			* @param int index filter's index in the index tab
			*/
			/*$scope.removeFilter = function(agg, index) {
				agg.__ref__.filters.splice(index, 1);	
			} */

			/**
			* @desc call an external function and pass the agg data into parameters
			* @param string func function'name 
			*/
			$scope.callFuncWithData = function (func) {
				window[func]($scope.agg);
			}

			/** 
			* @desc include external script if it's not alredy present and call a function just after
			* @param string url the script url to load
			* @param string callback callback function name 
			*/
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
