// More information comming soon
Curiosity.factory('aggCsv', function(aggFactory){
	var aggCsvObj = {}; 
	var list = aggFactory.info.aggList; 
	
	aggCsvObj.builtMapping = function (agg) {
		if (typeof(agg.type) === "undefined") {
			return (null);
		}
		var res = aggCsvObj.findMappingType(agg.type);
		var path = aggCsvObj.haveNestedMapping(res)
		if (path != false) {
			for (var key in agg.nested) {
				var tmp = aggCsvObj.builtMapping(agg.nested[key]);
				if (typeof(res.buckets) !== "undefined") {
					res.buckets.push({path:key, mapping:tmp});
				}
				else {
					res[key] = {path:key, mapping:tmp}; 
				}
			}
		}
		return (res);
	}

	aggCsvObj.findMappingType = function(type) {
		var i = 0;
		while (i < list.length) {
			if (list[i].type == type) {
				return (angular.copy(list[i].mapping)); 
			}
			i++;
		}
	}

	aggCsvObj.haveNestedMapping = function(mapping) {
		for (var key in mapping) {
			if (key == "nested") {
				delete mapping.nested;
				return true;
			}
			else if (key == "buckets") {
				return (true);
			}
		}
		return (false);
	}

	aggCsvObj.builtAggCsv = function(mapping, agg) {
		var result = [];
	}

	return (aggCsvObj);
});