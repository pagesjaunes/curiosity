Curiosity.factory('aggregation', function(agg){
	aggregationObj = {};
	aggregationObj.info = {};
	aggregationObj.info.prevAgg = {};
	aggregationObj.info.validatedAgg = [];
	aggregationObj.info.resultAgg =  [];
	aggregationObj.info.currentAgg = [];
	aggregationObj.info.aggregationFilter = [];
	aggregationObj.info.possibleAgg = agg.possibleAggregation;
	aggregationObj.info.showAgg = false;

	aggregationObj.addAggregation = function (array) {
		array.push({obj:{},parent:array});
	}

	aggregationObj.modifieAgg = function(aggregation) {
		aggregation.obj = agg.possibleAggregation[aggregation.idx].func();
	}

	aggregationObj.deleteAgg = function(aggregation, idx) {
		aggregation.parent.splice(idx,1);
	}

	aggregationObj.validateAgg = function()
	{
		aggregationObj.info.validatedAgg = agg.builtAggregationArray(aggregationObj.info.currentAgg);
	}
	
	aggregationObj.addAggregationToRequest = function (request) {
		var  i = 0;
		while (i < aggregationObj.info.validatedAgg.length) {
			request.aggregation(aggregationObj.info.validatedAgg[i]);
			i++;
		}
	}

	aggregationObj.addAggregationFilterToQuery = function (query)  {
		return (agg.addAggregationFilterToQuery(query, aggregationObj.info.aggregationFilter));
	}

	aggregationObj.isAggregationFilterEmpty =  function () {
		console.log(aggregationObj.info.aggregationFilter);
		return (agg.aggregationFilterEmpty(aggregationObj.info.aggregationFilter));		
	}

	aggregationObj.updateResult = function (aggregations) {
		aggregationObj.info.prevAgg = agg.cloneAgg(aggregationObj.info.currentAgg);
		aggregationObj.info.resultAgg = aggregations;
		agg.builtAggregation(aggregationObj.info.prevAgg, aggregationObj.info.resultAgg);
		if (typeof(aggregationObj.info.resultAgg) !== "undefinded") {
			aggregationObj.info.showAgg = true;
		}
		else {
			aggregationObj.info.showAgg = false;	
		}
	}

	/**
	* isAgg
	* check a string is an aggrgation name
	* @param key : the string to check
	* @return : true if it's match false instead
	*/
	aggregationObj.isAgg = function (key){
		var re = new RegExp("^" + "agg_" + ".*");
		return (re.test(key));
	}

	/**
	* hasNestedAgg 
	* check if a aggregation's bucket have nested aggregation
	*/
	aggregationObj.hasNestedAgg = function (bucket) {
		var re = new RegExp("^" + "agg_" + ".*");
		for (key in bucket) {
			if (re.test(key))
				return (true);
		}
		return (false);
	}
	
	aggregationObj.addTermsAggregationFilter = function (aggr, bucket) {
		agg.addAggregationFilter(aggregationObj.info.aggregationFilter, "Terms", aggr.agg.field, bucket.key)
	
	}

	aggregationObj.removeAggFilter = function(tab, index)
	{
		tab.splice(index, 1);
	}

	return (aggregationObj);
})