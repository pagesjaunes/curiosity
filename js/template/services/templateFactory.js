// templateFactory.js

Curiosity.factory('template', function($http, $templateCache, conf, agg){
	var templateObj = {};
	templateObj.info = {};
	templateObj.info.template = [];
	templateObj.info.aggregationsTemplates = [];
	templateObj.info.aggregationsAssociation = [];
	templateObj.info.possibleAggregation = agg.possibleAggregation;

	
	/**
	* templateObj.update
	* Update service's data from conf document. 
	*/
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

	/* 
	* The next function work with a type. 
	* By convention the type is equal to the conf document type.
	* This way we can add as many template type as we want and use the same functions
	*/

	/**
	* templateObj.new
	* Add a new template 
	* @param type : template's type
	* @param tpl : templae to add
	*/
	templateObj.new = function (type, tpl) {
		templateObj.info[type].push(tpl);
	}

	/**
	* templateObj.save
	* Save a list of template 
	* @param type : template list's type
	*/
	templateObj.save = function (type) {
		conf.getConfDocument(type).templates = templateObj.info[type];
		conf.sendConfDocument(type);
	}

	/**
	* templateObj.delete
	* delete a template in a template list 
	* @param type : template list's type
	* @param index : template's index in the list
	*/
	templateObj.delete = function (type, index) {
		if (index >= 0){
			templateObj.info[type].splice(index, 1);
		}
	}

	/**
	* templateObj.updateAggAssoc
	* Update the associaction between a template and and aggregation type  
	* @param type : aggregation's type
	* @param value : template's name
	*/
	templateObj.updateAggAssoc = function (type, value) {
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
		updateAggTemplate();
	}


	/**
	* templateObj.addTemplateToCache
	* Add a template in $templateCache
	* @param type : template's type
	* @param value : template index
	*/
	templateObj.addTemplateToCache = function (type, id) {
		tpl = templateObj.info[type][id];
		if (typeof(tpl) !== "undefined") {
			$templateCache.put(tpl.name, tpl.value);
			return (tpl.name);
		}
		return ("");
	}

	templateObj.addTemplateToCacheFromName = function (type, name) {
		var i = 0;
		while (i < templateObj.info[type].length) {
			if (templateObj.info[type][i].name == name) {
				$templateCache.put(templateObj.info[type][i].name, templateObj.info[type][i].value);
				break ;
			}
			i++;
		}
	}

	/**
	*
	*/
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