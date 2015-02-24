Curiosity.factory('filters', function($rootScope, context){
	var filterObj = {};
	var queryObj = {};

	/**
	* init service function
	* @desc initialize filters list with and empty and filtres to encapsulate all other filters
	*/	
	filterObj.init = function () {
		filterObj.info = {};
		filterObj.info.filters = {'opBool':'And', 'type':"node", 'nestedFilter':[]};	
		context.registerModule("filters", filterObj);
	}

	/**
	* context's functions
	*/
	filterObj.load = function (obj) {		
		filterObj.info.filters = {'opBool':'And', 'type':"node", 'nestedFilter':[]};
		for (key in obj) {
			filterObj.info[key] = obj[key];	
		}
	}

	filterObj.store = function () {
		return (filterObj.info);
	}

	/**
	* @desc recursive function that builds an es filterObj from an aggregation
	* @param obj agg the aggregation from where to built filter 
	*/
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

	/**
	* @desc recursive function that create the final filters object that will be used in query  
	* @param object node the filter node where to apply function
	*/
	filterObj.builtFilter = function (node) {
		var filter = {};
		if (node.opBool == "And") {
			filter = ejs.AndFilter([]);
		}
		else if (node.opBool == "Or")  {
			filter = ejs.OrFilter([]);
		}
		else if (node.opBool == "Not" ) {
			filter = ejs.AndFilter([]); // We add a and filter because Not filter can only have one nested filters, then at the end of the function we encapsulate that filter with a not filter
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
			return ejs.NotFilter(filter); // Add not filter to the and filter
		}
		return (filter);
	}

	/**
	* @desc change the operator's type of a node 
	* @param obj node object to modify
	* @param string operator new operator 
	*/
	filterObj.changeNodeOp =  function (node, operator) {
		node.opBool = operator; 
	}

	/**
	* @desc add a nested node to a node
	* @param object parentNode node where to add the nested node
	*/
	filterObj.addNode =  function (parentNode) {
		var newNode ={'opBool':'And', 'type':"node", 'nestedFilter':[]};
		parentNode.nestedFilter.push(newNode); 
	}

	/**
	* @desc add a random id and store the filter in filters service or if a container is provided store in the container then notify query service  
	* @param obj filter the filter to add 
	* @param obj [container] where to add the filter 
	*/
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
	/** 
	* @desc remove a filter from a container
	* @param int idx filter's idx
	* @param obj filterContainer where to remove the filter
	*/
	filterObj.removeFilter = function(idx, filterContainer) {
		filterContainer.nestedFilter.splice(idx, 1);
		queryObj.notify();
		filterObj.notifyUpdate();
	}

	/**
	* @desc return a filter that match with an id
	* @param string id string to match
	*/
	filterObj.getFilterFromId = function (id) {
		return findFilterRec(id, filterObj.info.filters.nestedFilter);
	}

	/**
	* @desc find and remove a filter from its id
	* @param string id filter's id to remove
	*/
	filterObj.removeFilterFromId = function(id) {
		removeFilterRec(id, filterObj.info.filters.nestedFilter);
		queryObj.notify();
	}

	filterObj.notifyUpdate = function () {
		$rootScope.$broadcast("updateFilter");
	}

	/**
	* @desc recursive function that search a filter in a container and its nested container
	* @param string id filter's id to find
	* @param object container object where to search
	*/
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

	/**
	* Same 
	*/
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

	/**
	* Create a elasticsearch terms filter datas 
	*/
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