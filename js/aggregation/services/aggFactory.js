Curiosity.factory('aggFactory', function($http, $rootScope, moduleManager, aggConstructor, context){
	var aggObj = {};
	aggObj.info = {};
	aggObj.info.currentAggregation = [];
	aggObj.info.aggList = {};

	aggObj.newAggregation = function (obj, type, fields, params, size, template) {
		var agg = {};
		agg.name = "agg" +  Math.floor((Math.random() * 1000000) + 1);   
		agg.displayName = type + "Agg on " + fields;
		agg.size = size;
		agg.nestedAgg = [];
		agg.data = [];
		obj.push(agg);
		moduleManager.registerModule(name, "template/aggregation_module/aggDisplay.html");
	}

	aggObj.newEmptyAggregation = function(nested, name) {
		var agg = {};
		if (typeof(name) === "undefined") {
			agg.name = "agg" +  Math.floor((Math.random() * 10000) + 1);
		}
		else {
			agg.name = name;	
		}
		agg.nested = {};
		agg.tpl = "default";
		agg.aggregationTypeIdx = -1;
		agg.displayName = "New Aggregation";
		if (!nested)
			aggObj.info.currentAggregation.push(agg);
		return (agg);
	}

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
	}

	aggObj.addNestedAgg = function (agg) {
		var tmp = aggObj.newEmptyAggregation(true);
		agg.nested[tmp.name] = tmp; 
	}

	aggObj.setAllReference = function (agg, aggResult) {
		aggResult.__ref__ = agg;
		if (typeof(aggResult.buckets !== "undefined")) {
			for (bucket in aggResult.buckets) {
				aggObj.setReference(agg, aggResult.buckets[bucket]);
			}	
		}	
	}
	
	aggObj.setReference = function(agg, bucket) {
		for (key in agg.nested) {
			if (typeof(bucket[key]) !== "undefined") {
				aggObj.setAllReference(agg.nested[key], bucket[key]);
			}
		}
	}

	aggObj.addAggregationToRequest = function (request) {
		var aggs = builtAggregationArray();
		var i = 0;
		while (i < aggs.length) {
			request.aggregation(aggs[i]);
			i++;
		}
	}

	aggObj.removeMainAgg = function (agg, id) {
		var  i = 0; 
		while (i < aggObj.info.currentAggregation.length) {
			if (aggObj.info.currentAggregation[i].name == agg.name)
				break;
			i++;
		}
		moduleManager.removeModule(id);
		aggObj.info.currentAggregation.splice(i, 1);
	}

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

	function loadAggList() {
		$http({method: 'GET', url: 'data/aggregationList.json'}).
		success(function(data) {
			aggObj.info.aggList = data.list;
		}).
		error(function(err){
			console.log("Unable to fecth aggregation's list");
		});
	}

	loadAggList(); 
	
	// Context Event 
	$rootScope.$on("UpdateContext", function () {
 		var list = cloneAggList(aggObj.info.currentAggregation);
 		context.setContextInformation("agg", list);
	});

	$rootScope.$on("ContextLoaded", function () {
		var list = []; 
		context.setModuleInformation("agg", list);
		aggObj.info.currentAggregation = list;
	});

	// Clone agg func 
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

	// Utils 
	aggObj.hasNestedAgg = function (bucket) {
		var re = new RegExp("^" + "agg" + ".*");
		for (key in bucket) {
			if (re.test(key))
				return (true);
		}
		return (false);
	}

	aggObj.isAgg = function (key){
		var re = new RegExp("^" + "agg" + ".*");
		return (re.test(key));
	}


	return (aggObj);
});