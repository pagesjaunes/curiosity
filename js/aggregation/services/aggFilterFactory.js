Curiosity.factory('aggFilter', function(aggFactory){
	var aggFilterObj = {};
	aggFilterObj.info = {};
	aggFilterObj.info.aggList = aggFactory.info.currentAggregation;

	aggFilterObj.getRequestFilter = function () {
		var filter = ejs.AndFilter([]);
		for (value in aggFilterObj.info.aggList) {
			var tmp = aggFilterObj.info.aggList[value];
			var i = 0;
			while (i < tmp.filters.length) {
				aggFilterObj[tmp.filters[i].type](filter,tmp.filters[i].data);
				i++;
			}
		}
		return (filter);
	}
	
	aggFilterObj.Terms = function (filter, filterdata) {
		var nestedFilter = ejs.TermFilter(filterdata.field, filterdata.term);
		filter.filters(nestedFilter);
	}

	return (aggFilterObj);
});