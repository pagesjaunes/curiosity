// resultFactory.js

Curiosity.factory('result', function($rootScope, template, context){
	var resultObj = {};
	resultObj.info = {};
	resultObj.info.useTemplate = "none";
	resultObj.info.currentTemplate = "";
	
	resultObj.changeCurrentTemplate = function(type, name) {	
		tpl = template.getByName(type, name);
		resultObj.info.currentTemplate = name;
		template.addTemplateToCacheFromValue(tpl.name, tpl.value);
		resultObj.info.useTemplate = "global";
	}

	resultObj.init = function () {
		context.registerModule("result", resultObj);			
	}

	resultObj.store = function () {
		return (resultObj.info);
	}

	resultObj.load = function (obj) {
		resultObj.info =  obj;
		//to preserve compatibility with old context
		resultObj.info.templateSelected = resultObj.info.currentTemplate
		resultObj.changeCurrentTemplate("template", resultObj.info.templateSelected)			
	}

	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("result", resultObj.info);
	});

	
	return (resultObj);
});
