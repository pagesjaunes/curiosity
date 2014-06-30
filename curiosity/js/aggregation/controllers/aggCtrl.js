Curiosity.controller('aggCtrl', function($scope, aggFactory, template){
	$scope.aggTypeSelected = false;
	$scope.data = aggFactory.info;
	$scope.tplData = template.info;   

	$scope.init = function (name) {
		$scope.curAgg = {};
		$scope.curAgg.validate = false;
		if (typeof(name) === "undefined") {
			$scope.curAgg = aggFactory.newEmptyAggregation(false);
		}
		else {
			$scope.curAgg = aggFactory.getAggregation(name);
		}
	}
	
	$scope.removeAgg = function (container, idx) {
		container.splice(idx, 1);
	}

	$scope.removeMainAgg = function (agg, id) {
		aggFactory.removeMainAgg(agg, id);
	}

	$scope.changeAggType = function (agg,idx) {
		if (typeof (idx) != "undefined" && idx != null && idx >= 0) {
			agg.type = $scope.data.aggList[idx].type;
			agg.displayTemplate = $scope.data.aggList[idx].template;
			agg.aggTypeSelected = true;
		}
	}

	$scope.validateAgg = function (agg) {
		agg.validate = !agg.validate;
	}

	$scope.addNestedAgg = function (agg) {
		aggFactory.addNestedAgg(agg)
	}

	$scope.loadTpl = function (tpl) {
		if (typeof(tpl) !== "undefined" && tpl != "default") {
			template.addTemplateToCacheFromName("aggregationsTemplates", tpl);
		}
	}

	$scope.addInterval = function (agg) {
		if (typeof (agg.intervals) === "undefined") {
			agg.intervals = [];
		}
		agg.intervals.push({});
	}

	$scope.removeInterval =  function(agg, index) {
		if (typeof (agg.intervals) !== "undefined") {
			agg.intervals.splice(index, 1);
		}
	}
});