Curiosity.factory('filters', function($rootScope, context){
	var filterObj = {};
	var queryObj = {};

	filterObj.init = function () {
		filterObj.info = {};
		filterObj.info.filters = {'opBool':'And', 'type':"node", 'nestedFilter':[]};	
		context.registerModule("filters", filterObj);
	}

	filterObj.load = function (obj) {		
		filterObj.info = obj;
	}

	filterObj.store = function () {
		return (filterObj.info);
	}

	filterObj.getRequestFilter = function (agg) {
		var filter = ejs.AndFilter([]);
		for (value in agg) {
			var tmp = agg[value];
			var i = 0;
			while (i < tmp.filters.length) {
				filterObj[tmp.filters[i].type](filter,tmp.filters[i].data);
				i++;
			}
			filter.filters(filterObj.getRequestFilter(agg[value].nested));	
		}
		return (filter);
	}

	filterObj.builtFilter = function (node) {
		var filter = {};
		if (node.opBool == "And") {
			filter = ejs.AndFilter([]);
		}
		else if (node.opBool == "Or")  {
			filter = ejs.OrFilter([]);
		}
		else if (node.opBool == "Not" ) {
			filter = ejs.AndFilter([]);
		}
		var i = 0;
		while (i < node.nestedFilter.length) {
			if (node.nestedFilter[i].type == 'node') {
				filter.filters(filterObj.builtFilter(node.nestedFilter[i]));
			}
			else {
				filterObj[node.nestedFilter[i].type](filter, node.nestedFilter[i].data)			
			}
			i++;
		}
		if (node.opBool == "Not") {
			return ejs.NotFilter(filter);
		}
		return (filter);
	}

	filterObj.changeNodeOp =  function (node, operator) {
		node.opBool = operator; 
	}

	filterObj.addNode =  function (parentNode) {
		var newNode ={'opBool':'And', 'type':"node", 'nestedFilter':[]};
		parentNode.nestedFilter.push(newNode); 
	}

	filterObj.addFilter = function (filter, container) {
		filter.id = "filter" + Math.floor((Math.random() * 1000000) + 1);
		if (typeof(container)  === "undefined") {
			filterObj.info.filters.nestedFilter.push(filter);
		}
		else {
			container.nestedFilter.push(filter);
		}
		queryObj.notify();
		return (filter);
	}

	filterObj.removeFilter = function(idx, filterContainer) {
		filterContainer.nestedFilter.splice(idx, 1);
		queryObj.notify();
		filterObj.notifyUpdate();
	}

	filterObj.getFilterFromId = function (id) {
		return findFilterRec(id, filterObj.info.filters.nestedFilter);
	}

	filterObj.removeFilterFromId = function(id) {
		removeFilterRec(id, filterObj.info.filters.nestedFilter);
	}

	filterObj.notifyUpdate = function () {
		$rootScope.$broadcast("updateFilter");
	}

	function findFilterRec(id, container) {
		var i = 0;
		while (i < container.length) {
			if (container[i].id == id) {
				return (container[i]);
			}
			if (typeof (container[i].nestedFilter) !== "undefined" && container[i].nestedFilter.length > 0) {
				var tmp = findFilterRec(id, container[i].nestedFilter);
				if (typeof(tmp) !== "undefined") {
					return (tmp);
				}
			}
			i++;
		}
	}

	function removeFilterRec(id, container) {
		var i = 0;
		while (i < container.length) {
			if (container[i].id == id) {
				container.splice(i, 1);	
				return ;
			}
			if (typeof (container[i].nestedFilter) !== "undefined" && container[i].nestedFilter.length > 0) {
				removeFilterRec(id, container[i].nestedFilter);
			}			
			i++;
		}	
	}

	filterObj.Terms = function (filter, filterdata) {
		var nestedFilter = ejs.TermFilter(filterdata.field, filterdata.term);
		if (filterdata.not) {
			filter.filters(ejs.NotFilter(nestedFilter));
		}	
		else {
			filter.filters(nestedFilter);
		}
		
	}

	filterObj.setQueryObj = function (obj) {
		queryObj = obj
	}
 
	return (filterObj);
});