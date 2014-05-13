// keyWordCtrl.js

Curiosity.controller('keyWordCtrl', ['$scope', 'elasticClient', 'ejsResource', 'conf', 
function($scope, elasticClient, ejsResource, conf){
	/* INITIALISATION */

	var keyWordToDisplay = "";
	var client = elasticClient.getClient(globalConf.confServer);
	$scope.keyword = {};
	$scope.index = -1;
	$scope.info.keyWordsIndexs = [];
	/* EVENTS */
	$scope.$on("ConfLoaded", function () {
		$scope.info.keyWordsIndexs = conf.getConfDocument("keyword").keywords; 
	});

	/**
	* selectIndex
	* Manage the index selection which impact the keyword list
	*/
	$scope.selectIndex = function () {
		if (typeof ($scope.info.keyWordsIndexs) !== "undefined") {
			var i = findKeyWordIndex($scope.keyword.selectedIndex, $scope.info.keyWordsIndexs);
			if (i >= 0) {
				$scope.myData = $scope.info.keyWordsIndexs[i].keywords; 
			}
			else {
				$scope.myData = [];
			}
		}
	}

	/**
	* saveKeyWords 
	* Save current selected keyWords
	*/
	$scope.saveKeyWords = function () {
		var i = conf.getConfDocumentIndice("keyword");
		if (i >= 0){
			if ($scope.index >= 0){
				gConf[i]._source.keywords[$scope.index].keywords = $scope.myData; 
			}
			else if ($scope.keyword.selectedIndex != ""){
				gConf[i]._source.keywords.push({"index":$scope.keyword.selectedIndex,"keywords":$scope.myData});
				conf.sendConfDocument(client, "keyword");
			}
		}
		$scope.$emit('UpdateKeyWord');
	}

	/**
	* addKeyWord
	* Add a new keyword in the keyword diplay list.
	*/
	$scope.addKeyWord = function () {
		var newKeyword = {label:"", value:"", desc:""};
		$scope.myData.push(newKeyword);
	}

	/**
	* removeRow
	* remove a row in th grid and the attached keyword in th sametime.
	*/
	$scope.removeRow = function() {
   		var index = this.row.rowIndex;
   		$scope.gridOptions.selectItem(index, false);
 		$scope.myData.splice(index, 1);
	};

	// Grid initialisation	
	var removeTemplate = '<button type="button" class="close" ng-click="removeRow($index)" aria-hidden="true">&times;</button>';
    
    $scope.gridOptions = { 
        data: 'myData',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{field: 'label', displayName:'Label', enableCellEdit: true}, 
                     {field:'value', displayName:'Value', enableCellEdit: true},
                     {field:'desc', displayName:'Description', enableCellEdit: true},
                     {field: 'remove', displayName:'Remove', cellTemplate: removeTemplate, enableCellEdit: false}
                     ]
    };
}]);

