// queryCtrl.js

Curiosity.controller('queryCtrl', ['$scope', 'query', 'mapping',
    function($scope, query, mapping) {
	    
	    /* INITIALISATIONS */
    	$scope.data = query.info;
    	$scope.mappingData = mapping.info;
    	// TODO : Clean initialisation

	    /* EVENTS */
		$scope.$on('IndexChange',function (){
			query.updateIndex();
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
	}
]);


