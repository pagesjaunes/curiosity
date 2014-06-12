Curiosity.factory('aggregation', function($rootScope, agg, context){
	aggregationObj = {};
	aggregationObj.info = {};
	aggregationObj.info.prevAgg = {};
	aggregationObj.info.validatedAgg = [];
	aggregationObj.info.resultAgg =  [];
	aggregationObj.info.currentAgg = [];
	aggregationObj.info.aggregationFilter = [];
	aggregationObj.info.possibleAgg = agg.possibleAggregation;
	aggregationObj.info.showAgg = false;

	// Information to save in context
	aggregationObj.aggregationInfo = {};
	aggregationObj.aggregationInfo.aggregationFilter = aggregationObj.info.aggregationFilter; 
	aggregationObj.aggregationInfo.validateAgg = aggregationObj.info.validateAgg; 
	
	// Context Event
	/*
	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("aggregation", aggregationObj.aggregationInfo);
		aggregationObj.info.aggregationFilter = aggregationObj.aggregationInfo.aggregationFilter;
		console.log(aggregationObj.aggregationInfo.currentAgg);	
		aggregationObj.validateAgg();	
	}); 

	$rootScope.$on("UpdateContext", function () {
		aggregationObj.aggregationInfo.aggregationFilter = aggregationObj.info.aggregationFilter;
		aggregationObj.aggregationInfo.currentAgg = aggregationObj.info.currentAgg;
		console.log(aggregationObj.aggregationInfo.currentAgg);
		context.setContextInformation("aggregation", aggregationObj.aggregationInfo);
	});
	*/
	aggregationObj.addAggregation = function (array) {
		array.push({obj:{},parent:array});
	}

	aggregationObj.modifieAgg = function(aggregation) {
		aggregation.obj = agg.possibleAggregation[aggregation.idx].func();
	}

	aggregationObj.deleteAgg = function(aggregation, idx) {
		aggregation.parent.splice(idx,1);
	}

	aggregationObj.validateAgg = function() {
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
		if (!this.isAggregationFilterEmpty()) {
			return (agg.addAggregationFilterToQuery(query, aggregationObj.info.aggregationFilter));
		}
		return (query);
	}

	aggregationObj.isAggregationFilterEmpty =  function () {
		return (agg.aggregationFilterEmpty(aggregationObj.info.aggregationFilter));		
	}

	aggregationObj.updateResult = function (aggregations) {
		aggregationObj.info.prevAgg = agg.cloneAgg(aggregationObj.info.currentAgg);
		aggregationObj.info.resultAgg = aggregations;
		agg.builtAggregation(aggregationObj.info.prevAgg, aggregationObj.info.resultAgg);
		if (typeof(aggregationObj.info.resultAgg) !== "undefined") {
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

	aggregationObj.isBucketAgg = function (key, obj) {
		return (aggregationObj.isAgg(key) && obj.agg.nested);
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

	aggregationObj.removeAggFilter = function(tab, index) {
		tab.splice(index, 1);
	}

	aggregationObj.builtAggregationField = function (agg) {
		if (typeof(agg.agg) !== "undefined" && agg.agg.nested) {
			if (typeof (agg.buckets) !== "undefined") {
				return (builtAggregationFieldBucket(agg.buckets));
			}
		}
		return (builtAggregationFieldRec(agg, ""));
	}

	function builtAggregationFieldRec (agg, root) {
		var result = [];
		for (key in agg) {
			// Ignore agg and $$hashKey attribute
			if (key != "agg" && key != "$$hashKey" && key != "showNested" && !aggregationObj.isBucketAgg(key, agg[key])) { // Angular add $$hashKey attribute during ng-repeat rendering  
				if (agg[key] instanceof Array) {
					if (root != "") { // Manage point add at first child 
						result = result.concat(builtAggregationFieldRec(agg[key][0], root + "." + key));
					}
					else {
						result = result.concat(builtAggregationFieldRec(agg[key][0], key));					
					}
				}
				else if (typeof (agg[key]) === "object" && agg[key] != null) {
					if (root != ""){ // Manage point add at first child
						result = result.concat(builtAggregationFieldRec(agg[key], root + "." + key));
					}
					else {
						result = result.concat(builtAggregationFieldRec(agg[key], key)); 
					}
				}
				else { // Manage point add at first child 
					if  (root != "") {
						result.push({"ancestor":root+ "." + key, "name":key});
					}
					else {
						result.push({"ancestor":key, "name":key});
					}
				}
			}
		}
		return (result);
	}

	function builtAggregationFieldBucket(buckets) {
		var result = [];
		var i = 0;
	 	if (buckets[i] != "undefined") {
	 		result = builtAggregationFieldRec(buckets[i], "");
	 	}
	 	return (result);
	}

	return (aggregationObj);
})