Curiosity.controller('filtersCtrl', function($scope, filters) {
	$scope.data = filters.info;
	$scope.selectedFilter = [];
	$scope.filter = $scope.data.filters;

	$scope.changeNodeOp = function (node, operator) {
		filters.changeNodeOp(node, operator);
	}

	$scope.addNode = function (parentNode) {
		filters.addNode(parentNode);	
	}

	$scope.dropFilter = function (container) {
		var i = 0;
		while (i < $scope.selectedFilter.length) {
			container.nestedFilter.push($scope.selectedFilter[i].filter); 
			i++;
		}
		$scope.selectedFilter = [];
	}

	$scope.selectFilter = function (filter, index, parent) {
		var selected = {filter:filter, parent:parent};
		parent.nestedFilter.splice(index,1);	
		$scope.selectedFilter.push(selected);
	}

	$scope.removeFilter = function (idx, filterContainer) {
		filters.removeFilter(idx, filterContainer);
	}
});