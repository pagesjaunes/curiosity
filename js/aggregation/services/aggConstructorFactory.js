/**
* @desc service that built aggregation object which will be add to the final request launched on es
*/

Curiosity.factory('aggConstructor', function(){
	var obj = {};

	/**
	* @desc Built terms aggregation 
	* @param object agg contains all aggregation's param
	*/
	obj.Terms = function (agg) {
		var result = ejs.TermsAggregation(agg.name);
		result.field(agg.field);
		if (typeof (agg.size) !== "undefined") 
			result.size(agg.size);
		if (typeof (agg.order) !== "undefined") {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			console.log(order);
			result.order(agg.order, order);			
		}
		if (typeof (agg.minDoc) !== "undefined") 
			result.minDocCount(agg.minDoc);
		if (typeof (agg.script) !== "undefined" && agg.script != "") 
			result.script(agg.script);
		if (typeof (agg.include) !== "undefined" && agg.include != "") 
			result.include(agg.include);
		if (typeof (agg.exclude) !== "undefined" && agg.exclude != "") 
			result.exclude(agg.exclude);
		
		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
		return (result);
	}

	/**
	* @desc Built range aggregation 
	* @param object agg contains all aggregation's param
	*/
	obj.Range = function (agg) {
		var result = ejs.RangeAggregation(agg.name);
		result.field(agg.field); 
		var i = 0;
		if (typeof (agg.intervals) !== "undefined") {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (typeof (agg.intervals[i].from) !== "undefined") {
					from = agg.intervals[i].from;
				}
				if (typeof (agg.intervals[i].to) !== "undefined") {
					to = agg.intervals[i].to;
				}
				result.range(from, to);
				i++;
			}
		}
		if (typeof (agg.script) !== "undefined" && agg.script != "") 
			result.script(agg.script);
		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
		return (result);
	}

	/**
	* @desc generic function used to built simple aggregation with not a lot of params 
	* @param object agg contains all aggregation's param
	* @param constructor ejs constructor of the aggregation
	*/
	function simple(agg, constructor) {
		var result = constructor(agg.name);
		result.field(agg.field); 
		if (typeof (agg.script) !== "undefined" && agg.script != "") 
			result.script(agg.script);
		return (result);
	}

	/**
	* @desc Built avg aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.Avg = function (agg) {
		return (simple(agg, ejs.AvgAggregation));	
	}

	/**
	* @desc Built stats aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.Stats = function (agg) {
		return (simple(agg, ejs.StatsAggregation));
	}

	/**
	* @desc Built max aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.Max = function (agg) {
		return (simple(agg, ejs.MaxAggregation));
	}

	/**
	* @desc Built min aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.Min = function (agg) {
		return (simple(agg, ejs.MinAggregation));
	}

	/**
	* @desc Built Extendedstats aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.ExtendedStats = function (agg) {
		return (simple(agg,ejs.ExtendedStatsAggregation));
	}

	/**
	* @desc Built ValueCount aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.ValueCount = function (agg) {
		return (simple(agg, ejs.ValueCountAggregation));	
	}

	/**
	* @desc Built sum aggregation with throught simple function
	* @param object agg contains all aggregation's param
	*/
	obj.Sum = function (agg) {
		return (simple(agg, ejs.SumAggregation));
	}

	// More Incoming !!!!!

	return obj;
});