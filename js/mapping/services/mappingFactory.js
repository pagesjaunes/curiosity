// mappingFactory.js

Curiosity.factory('mapping', function(elasticClient, elasticFunc){
	var mappingObj = {};
	mappingObj.info = {};
	mappingObj.info.currentIndex = "";
	mappingObj.info.currentMapping = {}; 
	mappingObj.info.autoRefreshMapping = true;
	mappingObj.info.fields = [];
	var client = elasticClient.getClient(globalConf.curentServer);
	
	mappingObj.updateClient = function(server) {
		client = elasticClient.getClient(server);
		mappingObj.info.currentIndex = "";
	}

	mappingObj.updateMapping = function (index) {
		mappingObj.info.currentIndex = index;
		if (mappingObj.info.autoRefreshMapping) {
			elasticFunc.getMapping(client, index, updateMappingCB);
		}
		else {	
			mappingObj.info.field = [];
		}
	}

	mappingObj.updateDisplay = function (field) {
		mappingObj.info.currentMapping = showChangeRec(field.split("."), 0, mappingObj.info.currentMapping);
	}

	function updateMappingCB(error, resp) {		
		mappingObj.info.currentMapping = resp[mappingObj.info.currentIndex];
		/*  TODO : find a better way to pass trought 
			Sometimes attr .mappings doesn't exist and it broke display.
			It may come from the elasticsearch server's.
			TODO: Find from where it comes.
		*/
		if (typeof (mappingObj.info.currentMapping) !== "undefined" && 
			typeof (mappingObj.info.currentMapping.mappings) !== "undefined") {
			mappingObj.info.currentMapping = mappingObj.info.currentMapping.mappings; 
		}
		setAncestorDocuments(mappingObj.info.currentMapping);
		mappingObj.info.fields = builtFullFieldArrayDocuments(mappingObj.info.currentMapping);
	}

	function showChangeRec (stringArray, index, obj)
	{
		if (index == stringArray.length){
			obj.__display__ = !obj.__display__;  
			return (obj);
		}
		else if (stringArray.length - index > 1) {
			obj[stringArray[index]].properties = showChangeRec(stringArray, index+1,obj[stringArray[index]].properties); 
			return (obj);			
		}
		else {
			obj[stringArray[index]] = showChangeRec(stringArray, index+1,obj[stringArray[index]]);
			return (obj);
		}
	}

	return (mappingObj);
});