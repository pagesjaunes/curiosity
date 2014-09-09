/** 
* @desc directives used to aggregation result display 
*/
Curiosity.directive('aggResult', function($rootScope, $modal, aggFactory, filters, aggCsv){
	return {	
		scope: {
			agg : '='
		},	
		templateUrl : "partials/aggregation_module/aggResult.html",	
		controller : function ($scope) {	
			$scope.filters = [];
			
			// Event 
			$rootScope.$on("updateFilter", function() {
				updateFilter();
			});
			
			/**
			* @desc Update aggregation's filter list from aggregation sevices when "updateFilter" event is catch
			* @param object agg the aggregation to update
			*/
			function updateFilter(agg) {
				if (typeof(agg) === "undefined") {
					agg = $scope.agg;									
				}
				var newFilters = []; 
				if (typeof(agg.__ref__.aggfilters) !== "undefined"){
					var i = 0;
					while (i < agg.__ref__.aggfilters.length) {
						var filter = filters.getFilterFromId(agg.__ref__.aggfilters[i].id);
						if (typeof(filter) !== "undefined") {
							newFilters.push(filter)
						}
						i++;
					}
				}
				agg.__ref__.aggfilters = newFilters;
			}
			
			/**
			* @desc check if a string is an aggregation name or not
			* @param string key the string to test
			*/
			$scope.isAgg = function (key) {
				return (aggFactory.isAgg(key));
			}
			
			/**
			* @desc Open aggreagations csv modal
			* @param object agg aggregation where to take information used in csv modal
			*/
			$scope.aggToCsv = function (agg) {
				console.log(aggCsv.builtMapping(agg.__ref__));
			}

			/**
			* @desc add an agregation filter to an aggregation
			* @param object agg the aggregation where to add the filter
			* @param object filter the filter to add
			*/
			$scope.addFilter = function(agg, filter) {
				var tmpFilter = filters.addFilter(filter);
				if (typeof (agg.__ref__.aggfilters) === "undefined") {
					agg.__ref__.aggfilters = [];
				}
				agg.__ref__.aggfilters.push(tmpFilter);
			}
			
			/**
			* @desc remove filter in an aggregation's filters list and in filters service
			* @param object agg aggregation where to remove the filter
			* @param int idx filter's index in the agg filters list
			*/
			$scope.removeFilter = function(agg, idx) {
				filters.removeFilterFromId(agg.__ref__.aggfilters[idx].id);
				agg.__ref__.aggfilters.splice(idx,1); 
			}

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
