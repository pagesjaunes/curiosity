Curiosity.controller('templateCtrl', ['$scope', 'template','mapping', '$http',
function($scope, template, mapping, $http){
	// INITIALISATION
	

	$scope.data = template.info;
	$scope.mappingData = mapping.info;
	
	$scope.template = {};
	$scope.template.tab = 0;
	$scope.template.selected = -1;
	$scope.template.aggregation = {};
	$scope.template.aggregation.selected = -1;

	$scope.template.currentTemplate = {};
	$scope.template.aggregation.currentTemplate = {};
	// EVENT
	
	$scope.$on("ConfLoaded", function() {
		template.update();
	});

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
		var tmp = {name:"New Template",value:"<div ng-repeat='item in queryData.result.hits.hits'></div>"}
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
}]);