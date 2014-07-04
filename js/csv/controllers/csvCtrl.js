/*
* @desc controllers associated with the csv modal which manage interaction between csv service and users   
*/
var csvCtrl = function($scope, $modalInstance, csv, query, mapping){
	// Initializing controller's vars
	$scope.data = csv.info;
	$scope.mappingData = mapping.info;
	$scope.queryData = query.info
	$scope.info = {}
	$scope.info.txt = global_text;
	$scope.hideAll = false;

	$scope.$on("CsvDone", function (){
		$modalInstance.close();
	}) 
	
	/*
	* @desc : built csv file from last query's results 
	*/
	$scope.builtCsv = function(){
		if (typeof($scope.queryData.result.hits) !== "undefined") {
			csv.builtCsvFromResult($scope.queryData.result.hits.hits)			
		}
	}

	/*
	* @desc : built csv file from all result of the last query 
	*/
	$scope.builtFullCsv = function () {
		csv.getFullResult();
	}

	/*
	* @desc : built csv file from a specifique number of result of the last query 
	*/
	$scope.builtSplitCsv = function () {
		csv.getSomeResult();
	}

	/*
	* @desc : change the csv mapping 
	*/
	$scope.updateMapping = function () {
		mapping.selectMapping($scope.mappingData.selectedMapping);
		csv.updateField();
	}

	/*
	* @desc : hide or show a field in the csv result document
	*/
	$scope.hideField = function (index) {
		if (typeof($scope.data.fields[index].hide) === "undefined"){
			$scope.data.fields[index].hide = true;
		}
		else {
			$scope.data.fields[index].hide = !$scope.data.fields[index].hide;
		}
	}

	/*
	* @desc : hide or show all field in the csv result document
	*/
	$scope.hideAllField = function () {
		var i = 0;
		$scope.hideAll = !$scope.hideAll;
		while (i < $scope.data.fields.length) {
			$scope.data.fields[i].hide = $scope.hideAll;
			i++;
		}
	}
	
	csv.updateField();
}

Curiosity.controller('csvCtrl', csvCtrl);
