Curiosity.factory('aggFactory', function($http, $rootScope, moduleManager, aggConstructor, context){
	var aggObj = {};
	aggObj.info = {};
	aggObj.info.currentAggregation = [];
	aggObj.info.aggList = {};

	/*
	* Init service function
	*/
	aggObj.init = function () {
		context.registerModule("agg", aggObj);
		loadAggList();
	}

	/**
 	* Context's functions 
	*/
	aggObj.store = function () {
		return (cloneAggList(aggObj.info.currentAggregation)); 	
	}

	aggObj.load = function (obj) {
		aggObj.info.currentAggregation = obj;
	}

	/**
	* @desc Built a aggregation from params store it in a list and resiter a new module in the module manager
	* @param object obj aggregation list where store the new aggregation 
	* @param string type aggregation's type
	* @param string field aggregation's field
	* @param int size agg aggregation's size 
	* @param string template aggregation's template
	*/
	aggObj.newAggregation = function (obj, type, fields, params, size, template) {
		var agg = {};
		agg.name = "agg" +  Math.floor((Math.random() * 1000000) + 1);
		agg.displayName = type + "Agg on " + fields;
		agg.size = size;
		agg.nested = {};
		agg.data = [];
		obj.push(agg);
		moduleManager.registerModule(name, "partials/aggregation_module/aggDisplay.html");
	}

	/** 
	* @desc Create a new empty aggregation, if it's not nested then push it in the main aggregation list
	* @param boolean nested is the aggregation nested or not
	* @param string name aggregation's name, if undefined it will be attribuate automaticly 
	* @return the new aggregation
	*/
	aggObj.newEmptyAggregation = function(nested, name) {
		var agg = {};
		if (typeof(name) === "undefined") {
			agg.name = "agg" +  Math.floor((Math.random() * 10000) + 1);
		}
		else {
			agg.name = name;	
		}
		agg.nested = {};
		agg.filters = [];
		agg.tpl = "default";
		agg.aggregationTypeIdx = -1;
		agg.displayName = "New Aggregation";
		if (!nested)
			aggObj.info.currentAggregation.push(agg);
		return (agg);
	}

	/** 
	* @desc update aggregation attr
	* @param object data new aggregation's fields value
	* @param object agg target aggregation 
	*/
	aggObj.updateAgg = function (data, agg) {
		for (key in data) {
			var i = 0;
			while (i < agg.length && agg[i].name != key) {
				i++;
			}
			if (i < agg.length) {
				agg.data = data[key];
			}
		}
	}

	/**
	* @desc find an aggregation from its name, if it missed then create and return a new aggregation
	* @param string name aggregation's name
	* @return the aggregation found or a new aggregation
	*/
	aggObj.getAggregation = function (name) {
		var i = 0;
		while (i < aggObj.info.currentAggregation.length) {
			if (name == aggObj.info.currentAggregation[i].name) {
				return (aggObj.info.currentAggregation[i]);
			}
			i++;
		}
		return (aggObj.newEmptyAggregation(false,name));
	}

	/**
	* @desc update each aggregation with his new data
	* @param object data agg object from query result 
	*/
	aggObj.updateAggResult = function(data) {
		for (key in data) {			
			var i = 0;
			while (i < aggObj.info.currentAggregation.length) {
				if (key == aggObj.info.currentAggregation[i].name) {
					aggObj.info.currentAggregation[i].result = data[key];
					aggObj.setAllReference(aggObj.info.currentAggregation[i], data[key])
					break;
				}
				i++;
			}
		}
		$rootScope.$broadcast("AggregationUpdated");
	}

	/**
	* @desc add a nested aggregation to an aggregation
	* @param object agg the aggregation where to add 
	*/
	aggObj.addNestedAgg = function (agg) {
		var tmp = aggObj.newEmptyAggregation(true);
		agg.nested[tmp.name] = tmp; 
	}


	/**
	* @desc add reference from aggregation's object to aggregation's result then browse bukett's to add reference recursivly 
	* @param object agg the reference to the aggregation 
	* @param object aggResult result aggregation
	*/	
	aggObj.setAllReference = function (agg, aggResult) {
		aggResult.__ref__ = agg;
		if (typeof(aggResult.buckets !== "undefined")) {
			for (bucket in aggResult.buckets) {
				aggObj.setReference(agg, aggResult.buckets[bucket]);
			}
		}
		if (agg.type == "Filter" || agg.type == "Global"  || agg.type == "Nested") { // Manage Filter agg that have not bucket attribute
			aggObj.setReference(agg, aggResult);
		} 	
	}
	
	/** 
	* @desc browse nested aggregation and call setAllreference on each
	* @param object agg aggregation to browse
	* @param object bucket object where to add reference
	*/
	aggObj.setReference = function(agg, bucket) {
		for (key in agg.nested) {
			if (typeof(bucket[key]) !== "undefined") {
				aggObj.setAllReference(agg.nested[key], bucket[key]);
			}
		}
	}

	/**
	* @desc add aggregation to an ejs request 
	* @param ejs.Request request the request where to add aggregation 
	*/
	aggObj.addAggregationToRequest = function (request) {
		var aggs = builtAggregationArray();
		var i = 0;
		while (i < aggs.length) {
			request.aggregation(aggs[i]);
			i++;
		}
	}

	/**
	* @desc remove an aggregation from the main aggregation list, and remove its associate module in module manager
	* @param object agg aggreation to remove
	* @param string id aggregation id in module manager
	*/
	aggObj.removeMainAgg = function (agg, id) {
		var  i = 0;
		while (i < aggObj.info.currentAggregation.length) {
			
			if (aggObj.info.currentAggregation[i].name == agg.name){
				aggObj.info.currentAggregation.splice(i,1);
				break;
			}
			i++;
		}
		moduleManager.removeModule(id);
	}

	/**
	* @desc Built the final array that contains each validate aggregation, call ejs constructor of the aggregation   
 	*/
 	function builtAggregationArray () {
		var result = [];
		var i = 0;
		while (i < aggObj.info.currentAggregation.length) {
			if (aggObj.info.currentAggregation[i].validate)
				result.push(aggConstructor[aggObj.info.currentAggregation[i].type](aggObj.info.currentAggregation[i])) 
			i++;
		}
		return (result);
	}

	/**
	* @desc load aggregation list from data, function called when the service is created
	*/
	function loadAggList() {
		$http({method: 'GET', url: 'data/aggregationList.json'}).
		success(function(data) {
			aggObj.info.aggList = data.list;
		}).
		error(function(err){
			console.log("Unable to fecth aggregation's list");
		});
	}
 
	// Utils 
		
	/**
	* @desc check if a bucket have nested aggregation
	* @param object bucket the bucket to check
	* @return true if there is nested aggregation, false instead
	*/
	aggObj.hasNestedAgg = function (bucket) {
		var re = new RegExp("^" + "agg" + ".*");
		for (key in bucket) {
			if (re.test(key))
				return (true);
		}
		return (false);
	}

	/**
	* @desc check if a string is an aggregation name
	* @param string key string to check
	* @return true if it's an aggregation, false instead
	*/
	aggObj.isAgg = function (key){
		return (key.substring(0,3) == "agg");
	}
	
	/**
	* @desc clone aggregation list recursivly without result attr to avoid cyclic object 
	* @param object array aggList the array to clone
	* @return cloned array
	*/
	function cloneAggList (aggList) {
		var result = [];
		var i = 0;
		while (i < aggList.length) {
			var tmp =  {};
			for (key in aggList[i]) {
				if (key != 'result') {
					tmp[key] = aggList[i][key];
				}
			}
			result.push(tmp);
			i++;
		}
		return (result);
	}

	return (aggObj);
});