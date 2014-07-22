Curiosity.factory('aggFilter', function(aggFactory){
	var aggFilterObj = {};
	aggFilterObj.info = {};

	aggFilterObj.getRequestFilter = function (agg) {
		var filter = ejs.AndFilter([]);
		for (value in agg) {
			var tmp = agg[value];
			var i = 0;
			while (i < tmp.filters.length) {
				aggFilterObj[tmp.filters[i].type](filter,tmp.filters[i].data);
				i++;
			}
			filter.filters(aggFilterObj.getRequestFilter(agg[value].nested));	
		}
		return (filter);
	}
	
	aggFilterObj.Terms = function (filter, filterdata) {
		var nestedFilter = ejs.TermFilter(filterdata.field, filterdata.term);
		filter.filters(nestedFilter);
	}

	return (aggFilterObj);
});