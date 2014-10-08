/** 
* aggCtrl 
* @desc this controller is attached to each aggregation displayed 
*/
Curiosity.controller('aggCtrl', function($scope, $modal, aggFactory, template){
	$scope.aggTypeSelected = false;
	$scope.data = aggFactory.info;
	$scope.tplData = template.info; 

	/**
	* @desc function call by ng-init, called to load aggregation specifique data, and load template in $templateCache
	* @param string name : the name of the aggregation attached to the controller
	*/ 
	$scope.init = function (name) {
		$scope.curAgg = {};
		$scope.curAgg.validate = false;
		if (typeof(name) === "undefined") {
			$scope.curAgg = aggFactory.newEmptyAggregation(false);
		}
		else {
			$scope.curAgg = aggFactory.getAggregation(name);
			initTemplate($scope.curAgg);
		}
	}
	
	/**
	* @desc remove an aggregation from a container, used for nestedAgg
	* @param array container target array
	* @param int idx row's index to remove
	*/
	$scope.removeAgg = function (container, idx) {
		container.splice(idx, 1);
	}

	/**
	* @desc remove an aggregation from the aggregation list of aggFactory
	* @param object agg : the aggregation to remove
	* @param int id : the aggregation id
	*/
	$scope.removeMainAgg = function (agg, id) {
		aggFactory.removeMainAgg(agg, id);
	}

	/**
	* @desc change an aggregation type (terms, range ...)
	* @param object agg the aggregation to change type
	* @idx int idx the index of the new aggregation type in aggList
	*/
	$scope.changeAggType = function (agg,idx) {
		if (typeof (idx) != "undefined" && idx != null && idx >= 0) {
			agg.type = $scope.data.aggList[idx].type;
			agg.displayTemplate = $scope.data.aggList[idx].template;
			agg.resultTemplate = $scope.data.aggList[idx].resultTemplate;
			agg.aggTypeSelected = true;
		}
	}

	/**
	* @desc modifie the validate attr of an aggregation
	* @param object agg the agg to modify
	*/
	$scope.validateAgg = function (agg) {
		agg.validate = !agg.validate;
	}

	/**
	* @desc add a nested aggregation to an aggregation
	* @param object agg the agg to modify
	*/
	$scope.addNestedAgg = function (agg) {
		aggFactory.addNestedAgg(agg)
	}

	/**
	* @desc ask template service to add a template to the $templateCache whenever the template id different from default 
	* @param string the template name
	*/
	$scope.loadTpl = function (tpl) {
		if (typeof(tpl) !== "undefined" && tpl != "default") {
			template.addTemplateToCacheFromName("aggregationsTemplates", tpl);
		}
	}

	/**
	* @desc add an interval to a range aggregation
	* @param object agg target aggregation
	*/
	$scope.addInterval = function (agg) {
		if (typeof (agg.intervals) === "undefined") {
			agg.intervals = [];
		}
		agg.intervals.push({});
	}
	/**
 	* @desc remove an interval to a range aggregation
 	* @param object agg target aggregation
 	* @param int index index to remove
 	*/
	$scope.removeInterval =  function(agg, index) {
		if (typeof (agg.intervals) !== "undefined") {
			agg.intervals.splice(index, 1);
		}
	}

	/**
	* @desc open a modal which contains the fields list. When closed change aggregation field attr value
	* @params 'sm' | 'lg' size modal size 
	*/
	$scope.openModalFields = function (size, curAgg) {
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal/fieldsModal.html',
			controller: mappingModalCtrl,
			resolve: {
				item: function () {
					return curAgg;
				}}
			});
		modalInstance.result.then(function (value) {
			value.item.field = value.value;
		}, function () {
		})
	};

	/** 
	* @desc load aggregation and nested aggregation template in $templateCache 
	* @param object agg target aggregation   
	*/
	function initTemplate(agg) {
		$scope.loadTpl(agg.tpl);
		if (typeof(agg.nested) !== "undefined") {
			for (sub_agg in agg.nested) {
				initTemplate(agg.nested[sub_agg]);
			}
		}
	}
});
