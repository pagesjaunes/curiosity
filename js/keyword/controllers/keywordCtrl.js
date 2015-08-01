/**
* @desc keyword controllers associated to the keywords module, used for keyword management
*/
var keywordCtrl = function($scope, $modalInstance, keyword, curiosity, mapping){
	/* INITIALISATION */
	$scope.info = {};
	$scope.info.txt = global_text;
	$scope.curiosityData = curiosity.info;
	$scope.keyword = {};
	$scope.currentKeywords = [];
	$scope.keyword.selectedIndex = "global";

	/* EVENTS */
	function init () {
		$scope.keyword.selectedIndex = curiosity.info.selectedIndex;
		if ($scope.keyword.selectedIndex == "") {
			$scope.keyword.selectedIndex = "global";
		}
		$scope.currentKeywords = keyword.getIndex($scope.keyword.selectedIndex).keywords;
		if (typeof ($scope.currentKeywords) === "undefined"){
			$scope.currentKeywords = [];
		}
	}

	init();
	
	/**
	* @desc manage the index selection which impact the keyword list
	*/
	$scope.selectIndex = function () {
		$scope.currentKeywords = keyword.getIndex($scope.keyword.selectedIndex).keywords;
		if (typeof ($scope.currentKeywords) === "undefined")
			$scope.currentKeywords = [];
	}
	/**
	* @desc save current selected keyWords
	*/
	$scope.saveKeyWords = function () {
		keyword.saveIndex($scope.keyword.selectedIndex, $scope.currentKeywords);
		$scope.$emit('UpdateKeyWord');
	}

	/**
	* @desc add a new keyword in the keyword diplay list.
	*/
	$scope.addKeyWord = function () {
		var newKeyword = {label:"", value:"", desc:""};
		$scope.currentKeywords.push(newKeyword);
	}

	/**
	* @desc remove a row in the grid and the attached keyword in the sametime.
	*/
	$scope.removeRow = function(index) {
		$scope.currentKeywords.splice(index, 1);
	};

	$scope.close = function () {
		$modalInstance.close();
	}
};

