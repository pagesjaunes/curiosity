// queryFactory.js

Curiosity.factory('query', function($rootScope, elasticClient, ejsResource, curiosity, keyword, aggregation, context,log , aggFactory){
	var queryObj = {};
	queryObj.info = {};
	queryObj.info.simplifiedRequest = "";
	queryObj.info.complexRequest = "";
	queryObj.info.nbResult = 10;
	queryObj.info.page = 0;
	queryObj.info.maxPage = 0;
	queryObj.info.hits = 0;
	queryObj.info.keywordToShow = [];
	queryObj.info.currentKeyword = [];
	queryObj.info.autoRefresh = true;
	queryObj.info.jsonRequest = {};
	queryObj.info.loading = false;
	queryObj.info.error = false;
	queryObj.info.errorContent = "";
	queryObj.info.result = {};
	
	// Infomration to save in context
	queryObj.queryInfo = {};
	queryObj.queryInfo.simplifiedRequest = queryObj.info.simplifiedRequest;	 
	queryObj.queryInfo.complexRequest = queryObj.info.complexRequest;
 	queryObj.queryInfo.autoRefresh = queryObj.info.autoRefresh;

	var client = elasticClient.getClient(curiosity.info.currentServer);
	var currentKeyword = [];
	var currentIndex = "";
	var queryString = ejs.QueryStringQuery();

	$rootScope.$on("KeywordUpdate", function () {
		queryObj.info.keywordToShow = keyword.getKeywordListFromIndexFilter(currentIndex, getLastWord(queryObj.info.simplifiedRequest));		
	});

	// Context event
	$rootScope.$on("ContextLoaded", function () {
		var flag = false;
		context.setModuleInformation("request", queryObj.queryInfo);
		queryObj.info.simplifiedRequest = queryObj.queryInfo.simplifiedRequest; 	 
		if (queryObj.info.complexRequest = queryObj.queryInfo.complexRequest) {
			flag = true;
		}
		queryObj.info.complexRequest = queryObj.queryInfo.complexRequest; 
 		queryObj.info.autoRefresh = queryObj.queryInfo.autoRefresh;
		queryObj.info.nbResult = queryObj.queryInfo.nbResult;
		if (typeof(queryObj.info.nbResult) === "undefined") {
			queryObj.info.nbResult = 10;
		}
		if (flag && queryObj.info.autoRefresh) {
			queryObj.search();
		}
		currentKeyword = keyword.getKeywordListFromIndex(currentIndex);
	});

	$rootScope.$on('IndexChange',function (){
		queryObj.updateIndex();
	});

	$rootScope.$on('ServerChange', function() {
	    queryObj.updateClient();
	});

	$rootScope.$on("UpdateContext", function () {
 		queryObj.queryInfo.autoRefresh = queryObj.info.autoRefresh;
		queryObj.queryInfo.simplifiedRequest = queryObj.info.simplifiedRequest;	 
		queryObj.queryInfo.complexRequest = queryObj.info.complexRequest;
		queryObj.queryInfo.nbResult = queryObj.info.nbResult;
		context.setContextInformation("request", queryObj.queryInfo);
	});

	function builtRequest(query) {
		request = ejs.Request();
		queryString.query(aggregation.addAggregationFilterToQuery(query));
		aggFactory.addAggregationToRequest(request);
		if ((typeof(query) === "undefined" || !query.length) && aggregation.isAggregationFilterEmpty()){
			request.query(ejs.MatchAllQuery())
		}
		else {
			request.query(queryString);
		}
		request.size(queryObj.info.nbResult);
		request.from(queryObj.info.page * queryObj.info.nbResult);
		addSortToRequest(request,queryObj.info.sort);
		queryObj.info.jsonRequest = request;
		return (request);
	}

	function getLastWord(string) {
		var array = string.split(" ");
		if (array.length) {
			return (array[array.length-1]);		
		}
		return ("");
	}

	queryObj.updateIndex = function () {
		currentIndex = curiosity.info.selectedIndex;
		currentKeyword = keyword.getKeywordListFromIndex(currentIndex);
		queryObj.updateQuery();
		if (queryObj.info.autoRefresh) {
			queryObj.search();
		}
	}

	queryObj.updateClient = function ()	{
		client = elasticClient.getClient(curiosity.info.currentServer);
		queryObj.info.result = {};
		queryObj.info.hits = 0;
	}

	queryObj.updateQuery = function () {
		queryObj.info.complexRequest = splitRequest(currentKeyword, queryObj.info.simplifiedRequest).join(" ");
		queryObj.info.keywordToShow = keyword.getKeywordListFromIndexFilter(currentIndex, getLastWord(queryObj.info.simplifiedRequest));
	}

	queryObj.search = function (noReset) {
		curiosity.load(true);
		if (typeof(noReset) === "undefined") {
			queryObj.info.page = 0;
		}
		client.search({index:currentIndex,body:builtRequest(queryObj.info.complexRequest)}).then(
			function (resp) {
				curiosity.switchTab(1);
				curiosity.load(false);
				curiosity.stopError();
				queryObj.info.result = resp;
				queryObj.info.hits = resp.hits.total;
				aggFactory.updateAggResult(queryObj.info.result.aggregations);
				if (typeof(queryObj.info.nbResult) === "undefined")
					 queryObj.info.nbResult = 10;
				queryObj.info.maxPage = Math.floor(resp.hits.total/queryObj.info.nbResult);
				aggregation.updateResult(resp.aggregations);
				$rootScope.$broadcast("QueryLaunched");
				log.log("Requête : ok", "success");
			},
			function err(err) {
				curiosity.load(false);
				queryObj.info.result = {};
				queryObj.info.hits = 0;
				queryObj.info.maxPage = 0;
				curiosity.addError(err);
				log.log("Requête : ko, Code : " + err.status, "danger");
			}
		)	
	}

	queryObj.addValueInQuery = function(keyword) {
		if (queryObj.info.simplifiedRequest.length) {
			if (queryObj.info.simplifiedRequest.charAt(queryObj.info.simplifiedRequest.length-1) != " ") {
				var tmp = queryObj.info.simplifiedRequest.split(" ");
				tmp[tmp.length-1] = keyword + " ";
				queryObj.info.simplifiedRequest = tmp.join(" "); 
			}
			else {
				queryObj.info.simplifiedRequest += keyword + " ";
			}
		}
		else {
			queryObj.info.simplifiedRequest +=  keyword + " ";
		}
		queryObj.updateQuery();
	}

	/* PAGER */
	queryObj.firstPage = function() {
		queryObj.info.page = 0;	
		queryObj.search("no");
	}

	queryObj.lastPage = function() {
		queryObj.info.page = queryObj.info.maxPage;
		queryObj.search("no");		
	}

	queryObj.nextPage = function() {
		if (queryObj.info.page < queryObj.info.maxPage) {
			queryObj.info.page++;
			queryObj.search("no");
		}
	}

	queryObj.prevPage = function() {
		if (queryObj.info.page > 0) {
			queryObj.info.page--;
			queryObj.search("no");
		}
	}

	queryObj.goTo = function(page) {
		if (page > 0 && page <= queryObj.info.maxPage) {
			queryObj.page = page;
			queryObj.search("no");
		}
	}
		
	// Circular depencies
	queryObj.getAggregationObj = function() {
		return (aggregation);
	}

	queryObj.simpleSearch = function(request, index, callback) {
		client.search({index:index,body:request})
			.then(function (resp) {
				callback(resp);
			}, 
			function (err) {
				console.log(err);
			}
		);
	}

	queryObj.addKeywordFromQuery = function (name, value, desc) {
		var nKeyword = {'label':name, 'value':value, 'desc':desc};
		keyword.addKeywordInIndex(nKeyword, currentIndex);
	}
	
	// SORT FUNCTION
	// Initialisation
	queryObj.info.sort = [];

	queryObj.addSort = function () {
		queryObj.info.sort.push({"field":"",type:true});
	}

	queryObj.removeSort = function (index) {
		queryObj.info.sort.splice(index, 1);	
	}

	queryObj.cleanSort = function () {
		queryObj.info.sort = [];	
	}

	queryObj.sortUp = function(index) {
		if (index > 0) {
			var tmp1 = queryObj.info.sort[index];
			var tmp2 = queryObj.info.sort[index - 1];
			queryObj.info.sort[index] = tmp2;
			queryObj.info.sort[index - 1] = tmp1;
		}
	}

	queryObj.sortDown =  function (index)  {
		if (index < queryObj.info.sort.length - 1) {
			var tmp1 = queryObj.info.sort[index];
			var tmp2 = queryObj.info.sort[index + 1];
			queryObj.info.sort[index] = tmp2;
			queryObj.info.sort[index + 1] = tmp1;	
		}
 	}

	function addSortToRequest(request, sort) {
		var i = 0;
		while (i < sort.length) {
			var sortTmp =  ejs.Sort(sort[i].field);
			if (sort[i].type) {
				sortTmp.asc();
			}
			else {
				sortTmp.desc();	
			}
			request.sort(sortTmp);
			i++;
		}
	}
	return queryObj;
});