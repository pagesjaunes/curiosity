// queryCtrl.js

Curiosity.controller('queryCtrl', ['$scope', '$http', 'elasticClient','ejsResource', '$templateCache', 'agg', 'query',
    function($scope, $http, elasticClient, ejsResource, $templateCache, agg, query) {
	    
	    /* INITIALISATIONS */
	    var client = elasticClient.getClient(globalConf.curentServer);
    	var request;
    	var finalQuery = ejs.QueryStringQuery();
		
    	$scope.data = query.info;

		// TODO : Clean initialisation
		$scope.tab = 0;
	    $scope.query = {};
    	$scope.selectedKeyWord = "";
    	$scope.query.queryTerm = "";
    	$scope.query.keyWords = [];
    	$scope.query.keyWordsDisplay = [];
	    $scope.query.lastWord = "";
	    $scope.query.nbResult = 10;
	 	$scope.query.resultTab = 0;
	    $scope.query.mappings = $scope.info.mappings;
	    $scope.query.useTemplate = false;
	    $scope.query.template = {};
	    $scope.query.hits = 0;
	    $scope.query.from = 0;
	    $scope.query.page = 0;
	    $scope.query.maxPage = 0;
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

		/*
		* refreshKeyWordList
		* TODO :  Move To keyword
		function refreshKeyWordList()
		{	
			if (typeof ($scope.info.keyWordsIndexs) !== "undefined") {
				$scope.query.keyWords = findKeyWordArray($scope.info.selectedIndex, $scope.info.keyWordsIndexs)
				$scope.query.keyWords = $scope.query.keyWords.concat(findKeyWordArray("global", $scope.info.keyWordsIndexs))
				$scope.query.keyWordsDisplay = $scope.query.keyWords;
			}
		}
		*/


		$scope.search = function(noReset) {
			query.search(noReset);
		}

		$scope.addKeyWord = function (keyword) {
			query.addValueInQuery(keyword);
		}

		$scope.updateQuery = function () {
			query.updateQuery();
		}

		// TODO : MOVE TO RESULT CONTROLLERS !!! 
		$scope.selectTemplate = function () {
			$scope.query.template = $scope.template.list[$scope.query.templateSelected];
			if (typeof($scope.query.template) !== "undefined") {
				$templateCache.put($scope.query.template.name, $scope.query.template.value);
				$scope.query.useTemplate = false;
				$scope.query.useTemplate = true;
			}
		}
		// TODO : wrap into directives
		$scope.firstPage = function() {
			$scope.query.page = 0;	
			$scope.search("no");
		}

		$scope.lastPage = function() {
			$scope.query.page = $scope.query.maxPage;
			$scope.search("no");		
		}

		$scope.nextPage = function() {
			if ($scope.query.page < $scope.query.maxPage) {
				$scope.query.page++;
				$scope.search("no");
			}
		}

		$scope.prevPage = function() {
			if ($scope.query.page > 0) {
				$scope.query.page--;
				$scope.search("no");
			}
		}

		// TODO : MOVE TO AGGCONTROLLER
		$scope.quickAgg = function (field) {
			var aggreg = agg.quickAgg(field);
			aggreg.parent = $scope.query.aggregation.aggs; 
			$scope.query.aggregation.aggs.push(aggreg);
		}
	}
]);


