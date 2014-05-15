// templateFactory.js

Curiosity.factory('template', function($http, $templateCache, conf, agg){
	var templateObj = {};
	templateObj.info = {};
	templateObj.info.template = [];
	templateObj.info.aggregationsTemplates = [];
	templateObj.info.aggregationsAssociation = [];
	templateObj.info.possibleAggregation = agg.possibleAggregation;

	templateObj.update = function () {
		templateObj.info.template = conf.getConfDocument("template").templates;
		if (typeof(templateObj.info.template) === "undefined") {
			templateObj.info.template = [];
		}
		templateObj.info.aggregationsTemplates = conf.getConfDocument("aggregationsTemplates").templates;
		if (typeof(templateObj.info.aggregationsTemplates) === "undefined") {
			templateObj.info.aggregationsTemplates = [];
		}	
		templateObj.info.aggregationsAssociation = conf.getConfDocument("aggregationsTemplates").defaultValue;
		if (typeof(templateObj.info.aggregationAssociation) === "undefined") {
			templateObj.info.aggregationAssociation = [];
		}
		updateAggTemplate();
	}

	templateObj.new = function (type, tpl) {
		templateObj.info[type].push(tpl);
	}

	templateObj.save = function (type) {
		conf.getConfDocument(type).templates = templateObj.info[type];
		conf.sendConfDocument(type);
	}

	templateObj.delete = function (type, index) {
		if (index >= 0){
			templateObj.info[type].splice(index, 1);
		}
	}

	templateObj.updateAggAssoc = function (type, value) {
		console.log(type);
		console.log(value);
		var i = 0; 
		var find = false;
		while (i < templateObj.info.aggregationsAssociation.length){
			if (templateObj.info.aggregationsAssociation[i].type == type) {
				find = true;
				templateObj.info.aggregationsAssociation[i].tpl = value;
				break;
			}
			i++;
		}
		if (!find) {
			templateObj.info.aggregationsAssociation.push({'type':type,'tpl':value});
		}
		conf.getConfDocument('aggregationsTemplates').defaultValue = templateObj.info.aggregationsAssociation;
		conf.sendConfDocument('aggregationsTemplates');	
	} 

	function updateAggTemplate () {
		$http.get('template/aggregation/default.html', {cache:$templateCache}).then(function() {
			var defaultTemplate = $templateCache.get('template/aggregation/default.html')[1];
			var i = 0;
			while (i < templateObj.info.possibleAggregation.length) {
				$templateCache.put(templateObj.info.possibleAggregation[i].type + "_template", defaultTemplate);
				i++;
			}
			i = 0;
			if (typeof (templateObj.info.aggregationsAssociation) !== "undefined") {
				while (i < templateObj.info.aggregationsAssociation.length){
					var j = 0;					
					while (j < templateObj.info.aggregationsTemplates.length){
						if (templateObj.info.aggregationsTemplates[j].name == templateObj.info.aggregationsAssociation[i].tpl) {
							$templateCache.put(templateObj.info.aggregationsAssociation[i].type + "_template", templateObj.info.aggregationsTemplates[j].value);
							break;
						}
						j++;
					}
					i++;
				}
			}
		});
	}
	return (templateObj);
})