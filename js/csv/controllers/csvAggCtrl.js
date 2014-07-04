// Will be updtated soon 

var csvAggCtrl = function($scope, $modalInstance, csv, query){
	$scope.data = csv.info;
	$scope.queryData = query.info
	$scope.info = {}
	$scope.info.txt = global_text;
	$scope.hideAll = false;

	$scope.$on("CsvDone", function (){
		$modalInstance.close();
	}) 
	
	$scope.builtCsv = function(){	
		csv.exportAggregatiton();
	}

	$scope.hideField = function (index) {
		if (typeof($scope.data.fields[index].hide) === "undefined"){
			$scope.data.fields[index].hide = true;
		}
		else {
			$scope.data.fields[index].hide = !$scope.data.fields[index].hide;
		}
	}

	$scope.hideAllField = function () {
		var i = 0;
		$scope.hideAll = !$scope.hideAll;
		while (i < $scope.data.fields.length) {
			$scope.data.fields[i].hide = $scope.hideAll;
			i++;
		}
	}
	csv.builtCsvFromAgg(csv.info.agg, csv.info.fields);	
}

Curiosity.controller('csvAggCtrl', csvAggCtrl);