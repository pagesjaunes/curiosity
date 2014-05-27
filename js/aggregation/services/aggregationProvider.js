// aggregationProvider.js


Curiosity.provider("agg", function() {
	/**
	*	aggrega class definition 
	*/
	function aggrega(type, field, params, nested, constructor, ejsConstrucor){
		this.type = type;
		this.template = type + "_template";
		this.name = "";
		this.field = "";
		this.idx = 0;
		this.params = params;
		this.nested = nested;
		this.nestedAgg = new Array();
		this.constructor = constructor;
		this.ejsConstrucor = ejsConstrucor;

		this.autoSetName = function() {
			this.name = this.field.split('.');
			this.name = this.name[this.name.length - 1];
			this.name = "agg_" + this.name + "_" + this.type;
		}
	}

	/**
	* builtAggregationRec 
	* Associate the result of aggregation performed with the object builted previously with the ui.
	* The goal of this function is to retreive an creat a link between nested aggregation and their parents
	* @param aggLaunched : object built by the user
	* @param aggResult :  the aggField in elasticsearch response
	*/
	function builtAggregationRec(aggLaunched, aggResult){
		var re = new RegExp("^" + "agg_" + ".*");
		for (var key in aggResult) {
			var i = 0;
			if (re.test(key)) {
				while (i < aggLaunched.length) {
					if (key == aggLaunched[i].name) {
						aggResult[key].agg = aggLaunched[i];
						if (aggLaunched[i].nested && aggLaunched[i].nestedAgg.length) {
							var j = 0;
							while (j < aggResult[key].buckets.length) {
								builtAggregationRec(aggLaunched[i].nestedAgg, aggResult[key].buckets[j]);
								j++;
							}
						}
						break;
					}
					i++;
				}
			}
		}
	}
	
	/**
	* addAggregationFilterToQuery
	* Add to the a string the value of aggregation filter
	* @param query : modified string
	* @param filter : filter to apply   
	*/
	function addAggregationFilterToQuery(query, filter) {
		if (typeof(query) !== "undefined" && query != "")
			query += " AND "
		else 
			query = "";
		query +=  "("
		var i = 0;
		first = false;
		while (i < filter.length) {
			var j = 0;
			if (filter[i].agg.length) {
				if (first)
					query+= " AND ";
				first = true;
				query += " " + filter[i].field + ":("; 
				while (j < filter[i].agg.length) {				
					if (j > 0 || filter[i].agg[j].opBool == "NOT") {
						query += filter[i].agg[j].opBool + " ";
					}
					query += "\"" + filter[i].agg[j].key + "\" "; 
					j++;
				}
				query += ")";
			}
			i++;
		}
	query += ')';
	return (query);
	}

	// TODO : MORE REFACTORING !!!!!!!!!!!!!!!!!!!
	function builtRangeAgg(obj) {
		obj.autoSetName();
		var result = ejs.RangeAggregation(obj.name);
		result.field(obj.field);
		result.range(obj.params[0].value, obj.params[1].value);
		return (result);
	}

	function builtTermAgg(obj) {
		obj.autoSetName();
		var result = ejs.TermsAggregation(obj.name);
		result.field(obj.field);
		obj.nbResult = 5;
		obj.predicate = 'doc_count';
		return (result);
	}

	function builtNoParamAgg(obj)
	{
		obj.autoSetName();
		var result = obj.ejsConstrucor(obj.name);
		result.field(obj.field);
		return (result);
	}
	
	function builtDateHistogramAgg(obj) {
		obj.autoSetName();
		var result = ejs.DateHistogramAggregation(obj.name);
		result.field(obj.field);
		result.interval(obj.params[0].value);
		return (result);	
	}

	function builtDateRangeAgg(obj) {
		obj.autoSetName();
		var result = ejs.DateRangeAggregation(obj.name);
		result.field(obj.field);
		result.range(obj.params[0].value, obj.params[1].value);
		return (result);	
	}

	function builtHistogramAgg(obj) {
		obj.autoSetName();
		var result = ejs.HistogramAggregation(obj.name);
		result.field(obj.field);
		result.interval(obj.params[0].value);
		return (result);	
	}

	function newMinAgg  () {
		return new aggrega("Min", "", [], false, builtNoParamAgg, ejs.MinAggregation);
	}

	function newMissingAgg () {
		return new aggrega("Missing", "", [], false, builtNoParamAgg, ejs.MissingAggregation);
	}

	function newSignificantTermsAgg () {
		return new aggrega("SignificantTerms", "", [], true, builtNoParamAgg, ejs.SignificantTermsAggregation);
	}

	function newStatsAgg () {
		return new aggrega("Stats", "", [], false, builtNoParamAgg, ejs.StatsAggregation);
	}

	function newSumAgg () {
		return new aggrega("Sum", "", [], false, builtNoParamAgg, ejs.SumAggregation);
	}

	function newValueCountAgg () {
		return new aggrega("ValueCount", "", [], false, builtNoParamAgg, ejs.ValueCountAggregation);
	}

	function newRangeAgg () {
		return new aggrega("Range", "", [{type:"number",name:"from",value:""},{type:"number",name:"to",value:""}], false, builtRangeAgg)
	}

	function newTermAgg (){
		return new aggrega("Terms", "", [], true , builtTermAgg);
	}

	function newAvgAgg () {
		return new aggrega("Avg", "", [], false, builtNoParamAgg, ejs.AvgAggregation)
	}

	function newCardinalityAgg () {
		return new aggrega("Cardinality", "", [], false, builtNoParamAgg, ejs.CardinalityAggregation);
	}

	function newDateHistogramAgg () {
		return new aggrega("DateHistogram", "", [{type:"text", name:"interval", value:""}], true, builtDateHistogramAgg);
	}

	function newDateRangeAgg () {
		return new aggrega("DateRange", "", [{type:"text", name:"from", value:""} , {type:"text", name:"to", value:""}], false, builtDateRangeAgg);
	}

	function newExtendedStatsAgg () {
		return new aggrega("ExtendedStats", "", [], false, builtNoParamAgg, ejs.ExtendedStatsAggregation);
	}

	function newHistogramAgg () {
		return new aggrega("Histogram", "", [{type:"number", name:"interval", value:""}], true, builtHistogramAgg);
	}

	function newMaxAgg () {
		return new aggrega("Max", "", [], false, builtNoParamAgg, ejs.MaxAggregation);
	}

	this.$get = function() {
		return {
			"cloneAgg" : function (aggs) {
				if (typeof(aggs) !== "undefined"){
					var result =  new Array ();
					var i = 0;
					while (i < aggs.length) {
						var tmp = {	
							type:aggs[i].obj.type, 
							name:aggs[i].obj.name,
							template:aggs[i].obj.template,
							field:aggs[i].obj.field, 
							params:aggs[i].obj.params,
							nbResult:aggs[i].obj.nbResult,
							predicate:aggs[i].obj.predicate,
							nested:aggs[i].obj.nested,
							nestedAgg:this.cloneAgg(aggs[i].obj.nestedAgg)
						} 
						result.push(tmp);
						i++;
					}
					return (result);
				}
			return ([]);
			},

			"builtAggregation" : builtAggregationRec,

			"possibleAggregation" : [{type:"Terms", func:newTermAgg}, 
				{type:"Range", func:newRangeAgg}, 
				{type:"Avg", func:newAvgAgg},
				{type:"Cardinality", func:newCardinalityAgg},
				{type:"DateHistogram", func:newDateHistogramAgg},
				{type:"DateRange", func:newDateRangeAgg},
				{type:"ExtendedStats", func:newExtendedStatsAgg},
				{type:"Histogram", func:newHistogramAgg},
				{type:"Max", func:newMaxAgg},
				{type:"Min", func:newMinAgg},
				{type:"SignificantTerms", func:newSignificantTermsAgg},
				{type:"Stats", func:newStatsAgg},
				{type:"Sum", func:newSumAgg},
				{type:"ValueCount", func:newValueCountAgg},
				{type:"Missing", func:newMissingAgg},
				],
			"quickAgg" : function (field) {
				var result =  newTermAgg();
				result.field = field;
				return ({"idx":0,"obj":result});
			},  

			"addAggregationFilter" : function(tab, type, field, key){
				var i = 0;
				while (i < tab.length){
					if (tab[i].field == field) {
						var j = 0;
						while (j < tab[i].agg.length) {
							if (tab[i].agg[j].key == key) {
								return ;
							}
							j++;
						}
						tab[i].agg.push({"key":key, type:type, "opBool":"AND"});
						return;
					}
					i++;
				}
				tab.push({"field":field, agg:[{"key":key, "type":type,"opBool":"AND"}]})
			},

			"addAggregationFilterToQuery" : addAggregationFilterToQuery,
		
			"aggregationFilterEmpty" : function(tab) {
				var i = 0;
				while (i < tab.length) {
					if (tab[i].agg.length)
						return (false);
					i++;
				}
				return (true);
			},

			// TODO : add a check on agg params
			"builtAggregationArray" : function (array)
			{
				var result = new Array();
				var i = 0;
				while (i < array.length){
					if (typeof(array[i].obj.field) !== "undefined" && array[i].obj.field != ""){
						var tmp = array[i].obj.constructor(array[i].obj);
						array[i].error = false;
						if (array[i].obj.nested) {
							var nested = this.builtAggregationArray(array[i].obj.nestedAgg);
							var j = 0;
							while (j < nested.length) {
								tmp.agg(nested[j]);
								j++;
							} 
						}
						result.push(tmp);
					}
					else {
						array[i].error = true;
					}
					i++;
				}
				return(result);
			}
		}
	};
})






