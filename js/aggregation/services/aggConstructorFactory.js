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

	obj.Histogram = function (agg) {
		var result = ejs.HistogramAggregation(agg.name);
		result.field(agg.field);
		if (typeof (agg.order) !== "undefined") {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			result.order(agg.order, order);			
		}
		if (typeof (agg.format) !== "undefined" && agg.format != "") {
			result.format(agg.format);
		}
		if (typeof (agg.interval) !== "undefined") {
			result.interval(agg.interval);
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

	obj.DateHistogram = function (agg) {
		var result = ejs.DateHistogramAggregation(agg.name);
		result.field(agg.field);
		if (typeof (agg.order) !== "undefined") {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			result.order(agg.order, order);			
		}
		if (typeof (agg.format) !== "undefined" && agg.format != "") {
			result.format(agg.format);
		}
		if (typeof (agg.interval) !== "undefined") {
			result.interval(agg.interval);
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

	obj.DateRange = function (agg) {
		var result = ejs.DateRangeAggregation(agg.name);
		result.field(agg.field); 
		var i = 0;
		if (typeof (agg.intervals) !== "undefined") {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (typeof (agg.intervals[i].from) !== "undefined" 	&& agg.intervals[i].from != "") {
					from = agg.intervals[i].from;
				}
				if (typeof (agg.intervals[i].to) !== "undefined" && agg.intervals[i].to != "") {
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
	* @desc Built filter aggregation 
	* @param object agg contains all aggregation's param
	*/
	obj.Filter = function (agg) {
		var result = ejs.FilterAggregation(agg.name);
		var tmp = ejs.QueryStringQuery(agg.query);
		result.filter(ejs.QueryFilter(tmp));
		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
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

 
	/**
	 * @desc Built IPv4 range aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.IPv4Range = function (agg) {              
		var result = ejs.IPv4RangeAggregation(agg.name);
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
		if (typeof (agg.script) !== "undefined" && agg.script != "") result.script(agg.script);              
		for (key in agg.nested) {                      
			if (agg.nested[key].validate) result.agg(obj[agg.nested[key].type](agg.nested[key]));                   
		}              
		return (result);       
	}

	/**
	 * @desc Built cardinality aggregation with throught simple function
	 * @param object agg contains all aggregation's param
	 */
	obj.Cardinality = function (agg) {              
		return (simple(agg, ejs.CardinalityAggregation));       
	}

	/**
	 * @desc Built percentiles aggregation with throught simple function
	 * @param object agg contains all aggregation's param
	 */
	obj.Percentiles = function (agg) {              
		return (simple(agg, ejs.PercentilesAggregation));       
	}

	/**
	 * @desc Built missing aggregation with throught simple function
	 * @param object agg contains all aggregation's param
	 */
	obj.Missing = function (agg) {              
		return (simple(agg, ejs.MissingAggregation));       
	}

	/**
	 * @desc Built significant terms aggregation with throught simple function
	 * @param object agg contains all aggregation's param
	 */
	obj.SignificantTerms = function (agg) {              
		return (simple(agg, ejs.SignificantTermsAggregation));       
	}

	/**
	 * @desc Built global aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.Global = function (agg) {              
		var result = ejs.GlobalAggregation(agg.name);
		for (key in agg.nested) {
			if (agg.nested[key].validate) {
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
			}
		}
		return (result);
	}

	/**
	 * @desc Built top hits aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.TopHits = function (agg) { 
		var result = ejs.TopHitsAggregation(agg.name);

		if (typeof (agg.size) !== "undefined") 
			result.size(agg.size);
		if (typeof (agg.from) !== "undefined") 
			result.from(agg.from);
		if (typeof (agg.sort) !== "undefined" && agg.sort != "") 
			result.sort(agg.sort);

		return (result);
	}

	/**
	 * @desc Built geo distance aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.GeoDistance = function (agg) { 
		var result = ejs.GeoDistanceAggregation(agg.name);
		var i = 0;
		if (typeof (agg.longitude) !== "undefined" && agg.longitude != "" && typeof (agg.latitude) !== "undefined" && agg.latitude != "") 
			result.center(ejs.GeoPoint([agg.latitude,agg.longitude]));
		if (typeof (agg.distanceType) !== "undefined" && agg.distanceType != "") 
			result.distanceType(agg.distanceType);
		if (typeof (agg.field) !== "undefined" && agg.field != "") 
			result.field(agg.field);
		if (typeof (agg.keyed) !== "undefined" && agg.keyed != "") 
			result.keyed(agg.keyed);
		if (typeof (agg.unit) !== "undefined" && agg.unit != "") 
			result.unit(agg.unit);
		if (typeof (agg.intervals) !== "undefined") {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (typeof (agg.intervals[i].from) !== "undefined" 	&& agg.intervals[i].from != "") {
					from = agg.intervals[i].from;
				}
				if (typeof (agg.intervals[i].to) !== "undefined" && agg.intervals[i].to != "") {
					to = agg.intervals[i].to;
				}
				result.range(from, to);
				i++;
			}
		}
		for (key in agg.nested) {
			if (agg.nested[key].validate) {
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
			}
		}
		return (result);
	}

	/**
	 * @desc Built geo hash grid aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.GeoHashGrid = function (agg) { 
		var result = ejs.GeoHashGridAggregation(agg.name);
		if (typeof (agg.field) !== "undefined" && agg.field != "") 
			result.field(agg.field);
		if (typeof (agg.precision) !== "undefined") 
			result.precision(agg.precision);
		if (typeof (agg.shardSize) !== "undefined") 
			result.shardSize(agg.shardSize);
		if (typeof (agg.size) !== "undefined") 
			result.size(agg.size);

		for (key in agg.nested) {
			if (agg.nested[key].validate) {
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
			}
		}
		return (result);
	}

	/**
	 * @desc Built nested aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.Nested = function (agg) {              
		var result = ejs.NestedAggregation(agg.name);
		if (typeof (agg.path) !== "undefined" && agg.path != "") 
			result.path(agg.path);		
		for (key in agg.nested) {
			if (agg.nested[key].validate) {
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
			}
		}
		return (result);
	}

	// More Incoming !!!!!

	return obj;
});