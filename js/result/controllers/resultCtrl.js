Curiosity.controller('resultCtrl', function($scope, $modal, result, query, template, aggregation, csv){
	$scope.queryData = query.info;
	$scope.templateData = template.info
	$scope.aggregationData = aggregation.info;
	$scope.showAggregationFilter = true;
	$scope.data = result.info;

	/* PAGER : go to queryFactory.js for more informations*/ 
	$scope.nextPage = function () {
		query.nextPage();
	}
	$scope.prevPage = function () {
		query.prevPage();
	}
	$scope.firstPage = function () {
		query.firstPage();
	}
	$scope.lastPage = function ()  {
		query.lastPage();	
	}
	$scope.goTo = function (page) {
		query.goTo(page);
	}

	$scope.selectTemplate = function(type, id) {
		result.changeCurrentTemplate(type, id);
	}

	$scope.switchDisplayMode = function (type, id) {
		result.switchDisplayMode(type, id);
	}

	$scope.addAggregationFilter = function(type ,aggr, bucket) {
		$scope.showAggregationFilter = true;
		aggregation["add"+type+"AggregationFilter"](aggr, bucket);
		if ($scope.queryData.autoRefresh){
			$scope.search();
		}
	}

	$scope.removeAggFilter = function(tab, index) {
		aggregation.removeAggFilter(tab, index);
		if ($scope.queryData.autoRefresh){
			$scope.search();
		}
	}
	
	$scope.isAgg = function (key) {
		aggregation.isAgg(key);
	}

	$scope.callAggregationFunc = function(func, params) {
		return (aggregation[func](params));
	}

	$scope.setAggregationValue = function(agg, field, value) {
		var prev = agg[field];
		agg[field] = value;
		if (value != prev && $scope.queryData.autoRefresh){
			query.search();
		}
	}

	$scope.switchAggregationValue = function (agg, field, values) {
		var i = 0;
		while (i < values.length) {
			if (agg[field] == values[i]) {
				if (i + 1 < values.length) {
					agg[field] = values[i+1];
					return ;
				}
			}
			i++;
		}
		agg[field] = values[0];
	}

	$scope.openModalCsv = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'template/modal/csv_modal.html',
			controller: csvCtrl,
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}}
			});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
		});
	}

	$scope.openModalAgg = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'template/modal/aggregation_modal.html',
			controller: aggregationCtrl,
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}}
			});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
		});
	}

	$scope.aggToCsv = function (size,agg) {
		csv.setField(aggregation.builtAggregationField(agg));
		csv.info.agg = agg;
		var modalInstance = $modal.open({
			templateUrl: 'template/modal/csv_agg_modal.html',
			controller: csvAggCtrl,
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}}
			});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
		});
	}

})