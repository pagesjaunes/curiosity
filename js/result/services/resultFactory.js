// resultFactory.js

Curiosity.factory('result', function($rootScope, template, context){
	var resultObj = {};
	resultObj.info = {};
	resultObj.info.useTemplate = "none";
	resultObj.info.currentTemplate = "";
	
	resultObj.changeCurrentTemplate = function(type, templateId) {	
		resultObj.info.currentTemplate = template.addTemplateToCache(type, templateId);
		if (resultObj.info.currentTemplate == "") {
			resultObj.info.useTemplate = "none";
		}
		else {
			resultObj.info.useTemplate = "global";
		}
	}

	resultObj.init = function () {
		context.registerModule("result", resultObj);			
	}

	resultObj.store = function () {
		return (resultObj.info);
	}

	resultObj.load = function (obj) {
		resultObj.info =  obj;
		resultObj.switchDisplayMode("template", resultObj.info.templateSelected)			
	}

	resultObj.switchDisplayMode = function (type, templateId) {
		resultObj.info.currentTemplate = template.addTemplateToCache(type, templateId);
	}

	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("result", resultObj.info);
	});

	
	return (resultObj);
});
