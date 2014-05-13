//mappingCtrl.js

Curiosity.controller('mappingCtrl', ['$scope', 'elasticClient', 'elasticFunc', 'agg', 
function($scope, elasticClient, elasticFunc, agg){
	var client = elasticClient.getClient(globalConf.curentServer);	
	$scope.curentIndex = $scope.info.selectedIndex;
	$scope.mappings = {};	
	$scope.$on("IndexChange", function () {
			$scope.curentIndex = $scope.info.selectedIndex;
			queryField = new Array();
			elasticFunc.getMapping(client, $scope.info.selectedIndex, refreshMapping);		
		}
	);
	$scope.$on("ServerChange", function () {
		queryField = new Array();
		client = elasticClient.getClient(globalConf.curentServer);
		}
	);
	
	function refreshMapping(error, resp)
	{
		$scope.mappings = resp[$scope.info.selectedIndex];// TODO :  find a better way to pass trought 
		/*	Sometimes attr .mappings doesn't exist and it broke display.
			It may come from the elasticsearch server's.
			TODO: Find from where it comes.
		*/
		if (typeof ($scope.mappings) !== "undefined" && 
			typeof ($scope.mappings.mappings) !== "undefined") {
			
			$scope.mappings = $scope.mappings.mappings; 
		}
		setAncestorDocuments($scope.mappings);
		$scope.info.mappings = builtFullFieldArrayDocuments($scope.mappings);
		$scope.$emit("UpdateMappings");
	}


	function showChangeRec (stringArray, index, obj)
	{
		if (index == stringArray.length){
			obj.__display__ = !obj.__display__;  
			return (obj);
		}
		else if (stringArray.length - index > 1) {
			obj[stringArray[index]].properties = showChangeRec(stringArray, index+1,obj[stringArray[index]].properties); 
			return (obj);			
		}
		else {
			obj[stringArray[index]] = showChangeRec(stringArray, index+1,obj[stringArray[index]]);
			return (obj);
		}
	}


	$scope.showChange = function (toShow)
	{		
		var splitedString = toShow.split(".");
		$scope.mappings = showChangeRec(splitedString, 0, $scope.mappings);
		queryField = builtFieldArrayDocuments($scope.mappings);
	}
}])