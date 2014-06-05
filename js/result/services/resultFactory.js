// resultFactory.js

Curiosity.factory('result', function(query, template){
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

	return (resultObj);
});
