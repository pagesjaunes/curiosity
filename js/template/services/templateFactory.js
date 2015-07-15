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
	* @param name : template's name
	*/
	templateObj.delete = function (type, name) {
		var i = 0;
		while (i < templateObj.info[type].length) {
			if (templateObj.info[type][i].name == name) {
				templateObj.info[type].splice(i, 1);
			}
			i++;
		}
	}

	/**
	* templateObj.getByName
	* get a template 
	* @param type : template list's type
	* @param name : template's name
	*/
	templateObj.getByName = function (type, name) {
		var i = 0;
		while (i < templateObj.info[type].length) {
			if (templateObj.info[type][i].name == name) {
				return templateObj.info[type][i];
			}
			i++;
		}
		return false;
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
		tpl = templateObj.getByName(type, name);
		if (tpl !== false) {
			$templateCache.put(tpl.name, tpl.value);
			return (tpl.name);
		}
		return false;
	}

	templateObj.addTemplateToCacheFromValue = function (name, value) {
		$templateCache.put(name, value);
	}
	return (templateObj);
})