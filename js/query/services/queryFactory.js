Curiosity.factory('query', function(elasticClient, ejsResource, keyword, agg){
	var queryObj = {};
	queryObj.info = {};
	queryObj.info.simplifiedRequest = "";
	queryObj.info.complexRequest = "";
	queryObj.info.nbResult = 10;
	queryObj.info.page = 0;
	queryObj.info.maxPage = 0;
	queryObj.info.keywordToShow = [];
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
		request.size = queryObj.info.page;
		request.from = queryObj.info.page * request.size; 
		queryObj.info.jsonRequest = request;
		return (request);
	}

	queryObj.updateIndex = function (index) {
		currentIndex = index;
	}

	queryObj.updateClient = function ()	{
		client = elasticClient.getClient(globalConf.curentServer);
	}

	queryObj.updateQuery = function () {
		queryObj.info.complexRequest = splitRequest(currentKeyword, queryObj.info.simplifiedRequest).join(" ");	
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
				if (typeof(noReset) !== "undefined") {
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
				var tmp = simplifiedRequest.split(" ");
				tmp[tmp.length-1] = keyword + " ";
				queryObj.info.simplifiedRequest = tmp.join(" ");	 
			}
		}
		else {
			queryObj.info.simplifiedRequest +=  keyword + " ";
		}
		queryObj.updateQuery();
		// TODO : Update keyword list		
	}

	return queryObj;
})