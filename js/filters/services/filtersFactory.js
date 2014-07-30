Curiosity.factory('filters', function(){
	var filterObj = {};
	filterObj.info = {};
	filterObj.info.filters = {'opBool':'And', 'type':"node", 'nestedFilter':[]};	

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
		if (typeof(container)  === "undefined") {
			filterObj.info.filters.nestedFilter.push(filter);		
		}
		else {
			container.nestedFilter.push(filter);
		}	
	}

	filterObj.removeFilter = function(idx, filterContainer) {
		filterContainer.nestedFilter.splice(idx, 1);
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

	return (filterObj);
});