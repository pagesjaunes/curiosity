var templateEditionCtrl = function($scope, $modalInstance, template, mapping, $http){	
	$scope.info = {};
	$scope.info.txt = global_text;

	$scope.data = template.info;
	$scope.mappingData = mapping.info;
	
	$scope.template = {};
	$scope.template.tab = 0;
	$scope.template.selected = -1;
	$scope.template.aggregation = {};
	$scope.template.aggregation.selected = -1;

	$scope.template.currentTemplate = {};
	$scope.template.aggregation.currentTemplate = {};

	$scope.readonlyTemplate = 0;
	// EVENT

	$scope.fieldLimit = 12;

	$scope.changeTemplate = function (type, obj, attr, index) {
		if (index !== "undefined" && index >= 0) {
			obj[attr] = $scope.data[type][index];
			if (globalConf.readonlyTemplate.indexOf(obj[attr].name) == -1) $scope.readonlyTemplate = 0;
			else $scope.readonlyTemplate = 1;
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
		$scope.readonlyTemplate = 0;
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

	/**
	* $scope.addField : quickly add a field to a string
	* @param obj : an object which contains the string to fill 
	* @param attr : the object's attribute to fill
	* @param field : the field to add
	*/
	$scope.addField = function (obj,attr,field) {
		obj[attr] += ("{{ item._source." + field + " }}")
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

	$scope.close = function () {
		$modalInstance.close();
	}
};