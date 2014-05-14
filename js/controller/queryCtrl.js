// queryCtrl.js

Curiosity.controller('queryCtrl', ['$scope', '$http', 'elasticClient','ejsResource', '$templateCache', 'agg',
    function($scope, $http, elasticClient, ejsResource, $templateCache, agg) {
	    
	    /* INITIALISATIONS */
	    var client = elasticClient.getClient(globalConf.curentServer);
    	var request;
    	var finalQuery = ejs.QueryStringQuery();
		
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
		$scope.$on('UpdateKeyWord',function (){
			refreshKeyWordList();
		});

		$scope.$on('IndexChange',function (){
			refreshKeyWordList();
		});

		$scope.$on('ServerChange', function() {
	    	client = elasticClient.getClient(globalConf.curentServer);
		});

		$scope.$on("UpdateMappings", function() {
			$scope.query.mappings = $scope.info.mappings;
		});

		/*
		* refreshKeyWordList
		* TODO :  comment
		*/
		function refreshKeyWordList()
		{	
			if (typeof ($scope.info.keyWordsIndexs) !== "undefined") {
				$scope.query.keyWords = findKeyWordArray($scope.info.selectedIndex, $scope.info.keyWordsIndexs)
				$scope.query.keyWords = $scope.query.keyWords.concat(findKeyWordArray("global", $scope.info.keyWordsIndexs))
				$scope.query.keyWordsDisplay = $scope.query.keyWords;
			}
		}

		/**
		* testSearch
		* TODO :  comment
		*/
		function smallSearch() {
		//  Check f the last caracter of the query is a space then launch the query
			if ($scope.query.queryTerm.length 
				&& $scope.query.queryTerm.charAt($scope.query.queryTerm.length - 1) == " " ) {
				var request = ejs.Request();
				finalQuery.query($scope.query.queryValue);
				request.query(finalQuery);
				client.search({index:$scope.info.selectedIndex,body:request}).then(function(resp){
					$scope.query.queryResults = resp;
					$scope.query.hits  = $scope.query.queryResults.hits.total;			
					gRequestResult = resp;
					$scope.$broadcast("queryLaunched");
				});
			}
		}

    	/**
    	* updateQuery
		* Update the final query from the simplified query each time it change	
		*/
		$scope.updateQuery = function() {
			var query = splitRequest($scope.query.keyWords, $scope.query.queryTerm).join(" ");
			$scope.query.queryValue = query;
			$scope.query.lastWord = getLastWord($scope.query.queryTerm);
			$scope.query.keyWordsDisplay = keyWordFilter($scope.query.keyWords, $scope.query.lastWord);
			$scope.query.mappings = fieldFilter($scope.info.mappings, $scope.query.lastWord);
			builtRequestObj();
			if ($scope.query.queryTerm.length && $scope.query.queryTerm.charAt($scope.query.queryTerm.length - 1) == " ") {
				smallSearch();
			}
		};

		/**
		* builtRequestObj 
		* Built a full request obj ready to launch from scope and global params
		*/
		function builtRequestObj() {
			var request = ejs.Request();
			finalQuery.query(agg.addAggregationFilterToQuery($scope.query.queryValue, $scope.query.aggregationFilter));
			if (queryField.length){
				request.fields(queryField);
			}
			var i = 0;
			while (i < $scope.query.aggregationArray.length) {
				request.aggregation($scope.query.aggregationArray[i]);
				i++;
			}
			if ((typeof($scope.query.queryValue) === "undefined" || $scope.query.queryValue == "") && agg.aggregationFilterEmpty($scope.query.aggregationFilter)) {
				request.query(ejs.MatchAllQuery())
			}
			else {
				request.query(finalQuery);
			}
			request.size($scope.query.nbResult);
			request.from($scope.query.nbResult * $scope.query.page);
			$scope.query.queryJson = request;
			return (request);
		}

		/**
		* search 
		* Launch the final query on the selected index to the selected server, then display the result 
		*/
		$scope.search = function(noResest){
			$scope.tab = 1;
			var request = builtRequestObj();
			$scope.info.loading = true;
			client.search({index:$scope.info.selectedIndex,body:request}).then(function(resp)
			{
				$scope.info.err = false;
				$scope.info.loading = false;
				$scope.query.queryResults = resp;
				gRequestResult = resp;
				$scope.query.hits  = $scope.query.queryResults.hits.total;
				$scope.query.maxPage = Math.floor($scope.query.hits / $scope.query.nbResult);
				if (typeof(noResest) === "undefined")
					$scope.query.page = 0;
				$scope.$broadcast("queryLaunched");
			}, function err(err) {
				$scope.info.loading = false;
				$scope.info.err = true;
			});
		};

		/*
		* addKeyWord
		* Add a keyWord to the simplified query field then refresh the complex query
		* @param keyWord : string which representing the keyWord to add
		*/
		$scope.addKeyWord = function (keyWord) {
			if ($scope.query.queryTerm != ""){
				$scope.query.queryTerm += " ";
			}
			$scope.query.queryTerm += keyWord;
			$scope.updateQuery($scope.query.nbResult);
		}

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
		$scope.quickAgg = function (field) {
			var aggreg = agg.quickAgg(field);
			aggreg.parent = $scope.query.aggregation.aggs; 
			$scope.query.aggregation.aggs.push(aggreg);
		}
	}
]);


