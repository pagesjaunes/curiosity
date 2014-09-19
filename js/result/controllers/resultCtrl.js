Curiosity.controller('resultCtrl', function($scope, $modal, result, query, template, csv, context){
	$scope.queryData = query.info;
	$scope.templateData = template.info
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
	$scope.loadContext = function(idContext) {
		context.loadContext(idContext);
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
			query.search();
		}
	}

	$scope.openModalCsv = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal/csv_modal.html',
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
			templateUrl: 'partials/modal/aggregation_modal.html',
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


	/**
	* @desc function used to open modals in results
	* @param string id : the id of the div to display in the modal
	* @param string size (optionnal) : the size (boostrap) of the modal
	*/ 
	$scope.openModal = function (id,size, item) {
	    var modalInstance = $modal.open({
    	  	templateUrl: id,
      		size: size,
      		controller:function($modalInstance,$scope){
      			$scope.item = item;
      			$scope.close = function() {
      				$modalInstance.close();
      			}
      		}
    	});
	}

})