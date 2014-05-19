// keyWordCtrl.js

Curiosity.controller('keyWordCtrl', ['$scope','keyword', 'curiosity',
function($scope, keyword, curiosity){
	/* INITIALISATION */
	$scope.curiosityData = curiosity.info;
	$scope.keyword = {};
	$scope.currentKeywords = [];
	$scope.keyword.selectedIndex = "";


	/* EVENTS */
	$scope.$on("ConfLoaded", function () {
		keyword.update(); 
	});

	/**
	* selectIndex
	* Manage the index selection which impact the keyword list
	*/
	$scope.selectIndex = function () {
		$scope.currentKeywords = keyword.getIndex($scope.keyword.selectedIndex).keywords;
		if (typeof ($scope.currentKeywords) === "undefined")
			$scope.currentKeywords = [];
	}
	/**
	* saveKeyWords 
	* Save current selected keyWords
	*/
	$scope.saveKeyWords = function () {
		keyword.saveIndex($scope.keyword.selectedIndex, $scope.currentKeywords);
		$scope.$emit('UpdateKeyWord');
	}

	/**
	* addKeyWord
	* Add a new keyword in the keyword diplay list.
	*/
	$scope.addKeyWord = function () {
		var newKeyword = {label:"", value:"", desc:""};
		$scope.currentKeywords.push(newKeyword);
	}

	/**
	* removeRow
	* remove a row in th grid and the attached keyword in th sametime.
	*/
	$scope.removeRow = function() {
		var index = this.row.rowIndex;
		$scope.gridOptions.selectItem(index, false);
		$scope.currentKeywords.splice(index, 1);
	};

	// Grid initialisation	
	var removeTemplate = '<button type="button" class="close" ng-click="removeRow($index)" aria-hidden="true">&times;</button>';
	$scope.gridOptions = { 
			data: 'currentKeywords',
			enableCellSelection: true,
			enableRowSelection: false,
			enableCellEditOnFocus: true,
			columnDefs: [	{field: 'label', displayName:'Label', enableCellEdit: true}, 
			{field:'value', displayName:'Value', enableCellEdit: true},
			{field:'desc', displayName:'Description', enableCellEdit: true},
			{field: 'remove', displayName:'Remove', cellTemplate: removeTemplate, enableCellEdit: false}
			]
		};
}]);

