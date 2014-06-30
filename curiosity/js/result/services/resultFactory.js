// resultFactory.js

Curiosity.factory('result', function($rootScope, query, template, context){
	var resultObj = {};
	resultObj.info = {};
	resultObj.info.useTemplate = false;
	resultObj.info.currentTemplate = "";
	
	resultObj.changeCurrentTemplate = function(type, templateId) {	
		resultObj.info.currentTemplate = template.addTemplateToCache(type, templateId);
		if (resultObj.info.currentTemplate == "") {
			resultObj.info.useTemplate = false;
		}
		else {
			resultObj.info.useTemplate = true;
		}
	}

	resultObj.switchDisplayMode = function (type, templateId) {
		resultObj.info.currentTemplate = template.addTemplateToCache(type, templateId);
	}

	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("result", resultObj.info);
		resultObj.switchDisplayMode("template", resultObj.info.templateSelected)
	});

	$rootScope.$on("UpdateContext", function () {
		context.setContextInformation("result", resultObj.info);
	});

	return (resultObj);
});
