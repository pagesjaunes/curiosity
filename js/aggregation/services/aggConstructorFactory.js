/**
* @desc service that built aggregation object which will be add to the final request launched on es
*/

Curiosity.factory('aggConstructor', function(){
	
	/**
	* @desc test mandatory values
	* @param val value to test
	*/
	function checkValue(val) {
		if (typeof(val) !== "undefined" && val != "") return true;
		return false;
	}

	/**
	* @desc reinit error message
	* @param agg aggregation to reinit
	*/
	function initError(agg) {
		agg.validation_error = false;
		agg.validation_message = "";
	}

	/**
	* @desc set an error message
	* @param agg aggregation where is the error
	* @param message error message
	*/
	function setError(agg, message) {
		agg.validation_error = true;
		agg.validation_message = message;
	}

	var obj = {};

	/**
	* @desc Built terms aggregation 
	* @param object agg contains all aggregation's param
	*/
	obj.Terms = function (agg) {

		initError(agg);

		if (!checkValue(agg.field) && !checkValue(agg.script)) {
			setError(agg, "you need to fill script or field input.");
			return ;
		}

		var result = ejs.TermsAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.size)) 
			result.size(agg.size);

		if (checkValue(agg.order)) {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			result.order(agg.order, order);			
		}
		if (checkValue(agg.minDoc)) 
			result.minDocCount(agg.minDoc);

		if (checkValue(agg.script)) 
			result.script(agg.script);

		if (checkValue(agg.include)) 
			result.include(agg.include);

		if (checkValue(agg.exclude)) 
			result.exclude(agg.exclude);
		
		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
		return (result);
	}

	obj.Histogram = function (agg) {

		initError(agg);

		if (!checkValue(agg.interval) || !(checkValue(agg.field) || checkValue(agg.script))) {
			setError(agg, "you need to fill interval and script or field input.");
			return ;
		}

		var result = ejs.HistogramAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.order)) {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			result.order(agg.order, order);			
		}
		if (checkValue(agg.format)) 
			result.format(agg.format);
		
		if (checkValue(agg.interval)) 
			result.interval(agg.interval);
		
		if (checkValue(agg.minDoc)) 
			result.minDocCount(agg.minDoc);

		if (checkValue(agg.script)) 
			result.script(agg.script);

		if (checkValue(agg.include)) 
			result.include(agg.include);

		if (checkValue(agg.exclude)) 
			result.exclude(agg.exclude);
		
		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
		return (result);
	}

	obj.DateHistogram = function (agg) {

		initError(agg);

		if (!checkValue(agg.interval) || !(checkValue(agg.field) || checkValue(agg.script))) {
			setError(agg, "you need to fill interval and script or field input.");
			return ;
		}

		var result = ejs.DateHistogramAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.order)) {
			order = "desc";
			if (agg.orderType)
				order = "asc";
			result.order(agg.order, order);			
		}
		if (checkValue(agg.format)) 
			result.format(agg.format);
		
		if (checkValue(agg.interval)) 
			result.interval(agg.interval);
		
		if (checkValue(agg.minDoc)) 
			result.minDocCount(agg.minDoc);

		if (checkValue(agg.script)) 
			result.script(agg.script);

		if (checkValue(agg.include)) 
			result.include(agg.include);

		if (checkValue(agg.exclude)) 
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

		initError(agg);

		if (!checkValue(agg.intervals) || !(checkValue(agg.field) || checkValue(agg.script))) {
			setError(agg, "you need to fill interval and script or field input.");
			return ;
		}

		var result = ejs.RangeAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		var i = 0;
		if (checkValue(agg.intervals)) {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (checkValue(agg.intervals[i].from)) {
					from = agg.intervals[i].from;
				}
				if (checkValue(agg.intervals[i].to)) {
					to = agg.intervals[i].to;
				}
				result.range(from, to);
				i++;
			}
		}
		if (checkValue(agg.script)) 
			result.script(agg.script);

		for (key in agg.nested) {
			if (agg.nested[key].validate)
				result.agg(obj[agg.nested[key].type](agg.nested[key]));	
		}
		return (result);
	}

	obj.DateRange = function (agg) {

		initError(agg);

		if (!checkValue(agg.intervals) || !(checkValue(agg.field) || checkValue(agg.script))) {
			setError(agg, "you need to fill interval and script or field input.");
			return ;
		}

		var result = ejs.DateRangeAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		var i = 0;
		if (checkValue(agg.intervals)) {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (checkValue(agg.intervals[i].from) 	&& agg.intervals[i].from != "") {
					from = agg.intervals[i].from;
				}
				if (checkValue(agg.intervals[i].to) && agg.intervals[i].to != "") {
					to = agg.intervals[i].to;
				}
				result.range(from, to);
				i++;
			}
		}
		if (checkValue(agg.script)) 
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

		initError(agg);

		if (!checkValue(agg.field) && !checkValue(agg.script)) {
			setError(agg, "you need to fill script or field input.");
			return ;
		}

		var result = constructor(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.script)) 
			result.script(agg.script);
		return (result);
	}


	/**
	* @desc Built filter aggregation 
	* @param object agg contains all aggregation's param
	*/
	obj.Filter = function (agg) {

		initError(agg);

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

		initError(agg);

		if (!checkValue(agg.intervals) || !(checkValue(agg.field) || checkValue(agg.script))) {
			setError(agg, "you need to fill interval and script or field input.");
			return ;
		}

		var result = ejs.IPv4RangeAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		var i = 0;              
		if (checkValue(agg.intervals)) {                      
			while (i < agg.intervals.length) {                              
				var from = null;                              
				var to = null;                              
				if (checkValue(agg.intervals[i].from)) {
				    from = agg.intervals[i].from;                              
				}                              
				if (checkValue(agg.intervals[i].to)) {
				    to = agg.intervals[i].to;                              
				}
				result.range(from, to);
				i++;                      
			}              
		}

		if (checkValue(agg.script)) 
			result.script(agg.script);          

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

		if (checkValue(agg.size)) 
			result.size(agg.size);
		if (checkValue(agg.from)) 
			result.from(agg.from);
		if (checkValue(agg.sort) && agg.sort != "") 
			result.sort(agg.sort);

		return (result);
	}

	/**
	 * @desc Built geo distance aggregation 
	 * @param object agg contains all aggregation's param
	 */
	obj.GeoDistance = function (agg) { 

		initError(agg);

		if (!checkValue(agg.intervals) || !checkValue(agg.field) && !checkValue(agg.longitude) && !checkValue(agg.latitude)) {
			setError(agg, "you need to fill intervals and field input and specify latitude and longitude.");
			return ;
		}

		var result = ejs.GeoDistanceAggregation(agg.name);

		if (checkValue(agg.longitude) && checkValue(agg.latitude)) 
			result.center(ejs.GeoPoint([agg.latitude,agg.longitude]));

		if (checkValue(agg.distanceType)) 
			result.distanceType(agg.distanceType);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.unit)) 
			result.unit(agg.unit);

		var i = 0;
		if (checkValue(agg.intervals)) {
			while (i < agg.intervals.length) {
				var from = null;
				var to = null;
				if (checkValue(agg.intervals[i].from) 	&& agg.intervals[i].from != "") {
					from = agg.intervals[i].from;
				}
				if (checkValue(agg.intervals[i].to) && agg.intervals[i].to != "") {
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

		initError(agg);

		if (!checkValue(agg.field)) {
			setError(agg, "you need to specify field input where geo coordinates are indexed.");
			return ;
		}

		var result = ejs.GeoHashGridAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (checkValue(agg.precision)) 
			result.precision(agg.precision);

		if (checkValue(agg.shardSize)) 
			result.shardSize(agg.shardSize);

		if (checkValue(agg.size)) 
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

		initError(agg);

		if (!checkValue(agg.path)) {
			setError(agg, "you need to specify path.");
			return ;
		}

		var result = ejs.NestedAggregation(agg.name);
		if (checkValue(agg.path)) 
			result.path(agg.path);		

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
	obj.GeoBounds = function (agg) {      

		initError(agg);

		if (!checkValue(agg.field)) {
			setError(agg, "you need to specify field.");
			return ;
		}

		var result = ejs.GeoBoundsAggregation(agg.name);

		if (checkValue(agg.field)) 
			result.field(agg.field);

		if (agg.wrap_longitude=="false" || agg.wrap_longitude=="0") 
			result.wrapLongitude(false);		
		if (agg.wrap_longitude=="true" || agg.wrap_longitude=="1") 
			result.wrapLongitude(true);

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