// keyWordCtrl.js

Curiosity.controller('keyWordCtrl', ['$scope','keyword', 'curiosity',
function($scope, keyword, curiosity, mapping){
	/* INITIALISATION */
	$scope.curiosityData = curiosity.info;
	$scope.keyword = {};
	$scope.currentKeywords = [];
	$scope.keyword.selectedIndex = "global";

	/* EVENTS */
	$scope.$on("ConfLoaded", function () {
		keyword.update();
		$scope.currentKeywords = keyword.getIndex($scope.keyword.selectedIndex).keywords;
	});

	$scope.$on("IndexChange", function () {
		$scope.keyword.selectedIndex = curiosity.info.selectedIndex;
		if ($scope.keyword.selectedIndex == "") {
			$scope.keyword.selectedIndex = "global";
		}
		$scope.currentKeywords = keyword.getIndex($scope.keyword.selectedIndex).keywords;
	})
	
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
	* remove a row in the grid and the attached keyword in the sametime.
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
			enableColumnResize: true,
			enableRowSelection: false,
			enableCellEditOnFocus: true,
			columnDefs: [	
			{field: 'label', displayName:'Label', width:"25%", enableCellEdit: true,}, 
			{field:'value', displayName:'Value', width:"40%", enableCellEdit: true, },
			{field:'desc', displayName:'Description', width:"25%",enableCellEdit: true,},
			{field: 'remove', displayName:'Remove',width:"10%", cellTemplate: removeTemplate, enableCellEdit: false}
			]
		};
}]);

