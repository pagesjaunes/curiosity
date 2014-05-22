var csvCtrl = function($scope, csv, query){
	$scope.data = csv.info;
	$scope.queryData = query.info

	$scope.$on("CsvDone", function (){
		var blob = new Blob([$scope.data.result], {type: "text/csv"});
		saveAs(blob, 'result.csv');	
	}) 


	$scope.builtCsv = function(){
		csv.builtCsvFromResult($scope.queryData.result.hits.hits)
	}

	$scope.builtFullCsv = function () {
		csv.getFullResult();
	}

	$scope.builtSplitCsv = function () {
		csv.getSomeResult();
	} 

	$scope.hideField = function (index) {
		if (typeof($scope.data.fields[index].hide) === "undefined"){
			$scope.data.fields[index].hide = true;
		}
		else {
			$scope.data.fields[index].hide = !$scope.data.fields[index].hide;
		}
	}
	csv.updateField();
}

Curiosity.controller('csvCtrl', csvCtrl);
