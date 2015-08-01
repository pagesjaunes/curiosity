// templateFactory.js

Curiosity.factory('template', function($http, $templateCache, $rootScope, conf){
	var templateObj = {};
	
	templateObj.init = function () {
		templateObj.info = {};
		templateObj.info.template = [];
		templateObj.info.aggregationsTemplates = [];
		templateObj.update();
	}

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
	}

	/* 
	* Next function work with a type. 
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

	templateObj.addTemplateToCacheFromValue = function (name, value) {
		$templateCache.put(name, value);
	}
	return (templateObj);
})