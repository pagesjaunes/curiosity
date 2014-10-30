// queryCtrl.js

Curiosity.controller('queryCtrl', ['$scope', 'query', 'mapping', '$modal',
    function($scope, query, mapping, $modal) {
	    
	    /* INITIALISATIONS */
    	$scope.data = query.info;
    	$scope.mappingData = mapping.info;
    	$scope.keywordLimit = 9;
    	$scope.fieldLimit = 9;
    	// TODO : Clean initialisation

    	var limitOnField = true;
    	var limitOnKeywords = true;
 
	    /* EVENTS */

		$scope.search = function(noReset) {
			query.search(noReset); 
		}

		$scope.addKeyWord = function (keyword) {
			query.addValueInQuery(keyword);
		}

		$scope.updateQuery = function () {
			query.updateQuery();
		}
		
		$scope.updateLimiteValueKeyword = function() {
			if (limitOnKeywords){
				$scope.keywordLimit = $scope.data.keywordToShow.length;
				limitOnKeywords = false;
			}
			else {
				$scope.keywordLimit = 9;
				limitOnKeywords = true
			}
		}

		$scope.updateLimiteValueField = function() {
			if (limitOnField){
				$scope.fieldLimit = $scope.mappingData.fields.length;
				limitOnField = false;
			}
			else {
				$scope.fieldLimit = 9;
				limitOnField = true
			}
		}

		$scope.addKeywordFromQuery = function (name, desc) {
			query.addKeywordFromQuery(name, $scope.data.complexRequest, desc);
		}

		$scope.addSort = function () {
			query.addSort();
		}

		$scope.removeSort = function (index) {
			query.removeSort(index)	
		}

		$scope.cleanSort = function () {
			query.cleanSort();	
		}

		$scope.move =  function (index, up) {
			if (up)
				query.sortUp(index);
			else 
				query.sortDown(index);
		}

		/**
		* @desc open a modal which contains the fields list. When closed change aggregation field attr value
		* @params 'sm' | 'lg' size modal size 
		*/
		$scope.openModalFields = function (size, curAgg) {
			var modalInstance = $modal.open({
				templateUrl: 'partials/modal/field_modal.html',
				controller: mappingModalCtrl,
				resolve: {
					item: function () {
						return curAgg;
					}}
				});
			modalInstance.result.then(function (value) {
				value.item.field = value.value;
			}, function () {
			})
		}

	}
]);


