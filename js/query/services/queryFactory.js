// queryFactory.js

Curiosity.factory('query', function(elasticClient, ejsResource, keyword, agg){
	var queryObj = {};
	queryObj.info = {};
	queryObj.info.simplifiedRequest = "";
	queryObj.info.complexRequest = "";
	queryObj.info.nbResult = 10;
	queryObj.info.page = 0;
	queryObj.info.maxPage = 0;
	queryObj.info.keywordToShow = [];
	queryObj.info.currentKeyword = []
	queryObj.info.jsonRequest = {};
	queryObj.info.loading = false;
	queryObj.info.error = false;
	queryObj.info.errorContent = "";
	queryObj.info.result = {};

	var client = elasticClient.getClient(globalConf.curentServer);
	var currentKeyword = [];
	var currentIndex = "";
	var queryString = ejs.QueryStringQuery();
	
	function builtRequest(query) {
		request = ejs.Request();
		queryString.query(agg.addAggregationFilterToQuery(query, []));
		// TODO Add field selection		
		// agg.addAggregation(request);
		if (typeof(query) === "undefined" ||  !query.length){
			request.query(ejs.MatchAllQuery())
		}
		else {
			request.query(queryString);
		}
		request.size(queryObj.info.nbResult);
		request.from(queryObj.info.page * queryObj.info.nbResult); 
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

	queryObj.updateIndex = function (index) {
		currentIndex = index;
		currentKeyword = keyword.getKeywordListFromIndex(currentIndex);
		queryObj.updateQuery();
	}

	queryObj.updateClient = function ()	{
		client = elasticClient.getClient(globalConf.curentServer);
	}

	queryObj.updateQuery = function () {
		queryObj.info.complexRequest = splitRequest(currentKeyword, queryObj.info.simplifiedRequest).join(" ");
		queryObj.info.keywordToShow = keyword.getKeywordListFromIndexFilter(currentIndex, getLastWord(queryObj.info.simplifiedRequest));
	}

	queryObj.search = function (noReset) {
		queryObj.info.loading = true;
		client.search({index:currentIndex,body:builtRequest(queryObj.info.complexRequest)}).then(
			function (resp) {
				queryObj.info.loading = false;
				queryObj.info.error = false;
				queryObj.info.errorContent = "";
				queryObj.info.result = resp;
				queryObj.info.hits = resp.hits.total;
				queryObj.info.maxPage = Math.floor(resp.hits.total/queryObj.info.nbResult);
				if (typeof(noReset) === "undefined") {
					queryObj.info.page = 0;
				}
				// TODO : Update other services !!!  
			},
			function err(err) {
				queryObj.info.loading = false;
				queryObj.info.error = true;
				queryObj.info.errorContent = err;
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
	return queryObj;
});