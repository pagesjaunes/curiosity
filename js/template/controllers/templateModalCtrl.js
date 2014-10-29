var templateModalCtrl = function($scope, $modalInstance, template, item){
	$scope.info = {};
	$scope.info.txt = global_text;

	$scope.data = template.info;
	
	$scope.template = {};
	$scope.template.tab = 0;
	$scope.template.selected = -1;
	$scope.template.aggregation = {};
	$scope.template.aggregation.selected = -1;

	$scope.template.currentTemplate = {};
	$scope.template.aggregation.currentTemplate = {};

	$scope.customTemplate = item.customTemplate;


	var itemloc = item;

	$scope.changeTemplate = function (type, obj, attr, index) {
		if (index !== "undefined" && index >= 0) {
			obj[attr] = $scope.data[type][index];
		}
	}
	
	/**
	* $scope.new
	* Add a new template in the template list
	*/
	$scope.new = function (type, obj, attr) {
		var tmp = {name:"New Template",value:"<div ng-repeat='item in queryData.result.hits.hits'>{{item._source}}</div>"}
		obj[attr] = tmp;
		template.new(type, tmp);
	}
	/**
	* $scope.save 
	* Send templates to the conf server
	*/
	$scope.save = function(type){
		template.save(type);
	}
	/**
	* $scope.delete 
	* Remove the selected template from the local template list
	*/
	$scope.delete = function (type, obj, attr, index) {
		template.delete(type, index);
		obj[attr] = {};
		index = 0;
	}



	// Aggregation Tpl
	
	/**
	* $scope.updateAggAssoc 
	* Send to conf server the current association between an aggregation type and a template
	*/
	$scope.updateAggAssoc = function(type, value) {
		template.updateAggAssoc(type, value);
	}

	$scope.updateLimiteValueField = function() {
		if ($scope.fieldLimit == 12) {
			$scope.fieldLimit = $scope.mappingData.fields.length;
		}
		else {
			$scope.fieldLimit = 12;
		}
	}

	$scope.ok = function (customTemplate) {
		var res = {"value":"", item:itemloc};
		res.value = customTemplate;
		console.log(customTemplate);
		$modalInstance.close(res);
	}

	$scope.cancel = function (customTemplate) {
		var res = {"value":"", item:itemloc};
		res.value = customTemplate;
		console.log(customTemplate);
		$modalInstance.dismiss(res);
	}

};