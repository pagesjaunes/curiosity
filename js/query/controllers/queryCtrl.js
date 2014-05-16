// queryCtrl.js

Curiosity.controller('queryCtrl', ['$scope', 'query',
    function($scope, query) {
	    
	    /* INITIALISATIONS */
    	$scope.data = query.info;
    	// TODO : Clean initialisation
	    $scope.query = {};
	    $scope.query.mappings = $scope.info.mappings;
	    $scope.query.useTemplate = false;
	    $scope.query.template = {};
	    $scope.query.aggregation = {};
	    $scope.query.autoRefresh = false;
	    $scope.query.showAggregationFilter = true;
	    $scope.query.aggregationArray = [];
		$scope.query.aggregationFilter = [];
	    $scope.query.prevAgg = [];
	    $scope.query.aggregation.aggs = {};
	    $scope.template = {};

	    /* EVENTS */
		$scope.$on('IndexChange',function (){
			query.updateIndex($scope.info.selectedIndex);
		});

		$scope.$on('ServerChange', function() {
	    	query.updateClient();
		});

		$scope.search = function(noReset) {
			query.search(noReset);
		}

		$scope.addKeyWord = function (keyword) {
			query.addValueInQuery(keyword);
		}

		$scope.updateQuery = function () {
			query.updateQuery();
		}

		// TODO : MOVE TO AGGCONTROLLER
		$scope.quickAgg = function (field) {
			var aggreg = agg.quickAgg(field);
			aggreg.parent = $scope.query.aggregation.aggs; 
			$scope.query.aggregation.aggs.push(aggreg);
		}
	}
]);


