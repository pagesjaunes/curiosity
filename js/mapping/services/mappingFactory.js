// mappingFactory.js

Curiosity.factory('mapping', function($rootScope, elasticClient, elasticFunc, curiosity){
	var mappingObj = {};
	 

	mappingObj.init = function () {
		mappingObj.info = {};
		mappingObj.info.currentIndex = "";
		mappingObj.info.currentMapping = {}; 
		mappingObj.info.autoRefreshMapping = true;
		mappingObj.info.fields = [];
		mappingObj.info.mappingsList = {};
	}

	$rootScope.$on("IndexChange", function () {
		mappingObj.updateMapping(curiosity.info.selectedIndex);
	});
	$rootScope.$on("ServerChange", function () {
		mappingObj.updateClient(curiosity.info.currentServer);
	});

	/**
	* updateClient
	* update the service's client when server change
	* @param server : server's url
	*/
	mappingObj.updateClient = function(server) {
		client = elasticClient.getClient(server);
		mappingObj.info.currentIndex = "";
		mappingObj.info.selectedMapping = "";
	}

	/**
	* updateMapping
	* update fields when index change by getting index's mapping
	* @param index : index's name
	*/
	mappingObj.updateMapping = function (index) {
		mappingObj.info.currentIndex = index;
		if (mappingObj.info.autoRefreshMapping) {
			elasticFunc.getMapping(client, index, updateMappingCB);
		}
		else {	
			mappingObj.info.field = [];
		}
	}

	/** 
	* Select a mapping in the mapping list by his name !! No http request
	* @param index : index's name  
	*/ 
	mappingObj.selectMapping =  function (index) {
		var tmp = mappingObj.info.mappingsList[index];	
		if (typeof (tmp) !== "undefined") {
			mappingObj.info.currentMapping = tmp;
			mappingObj.info.selectedMapping = index;
			updateMappingEsVersion();	
		}
	}

	// TODO : Maybe delete this function 
	/**
	* updateDisplay
	*/
	mappingObj.updateDisplay = function (field) {
		mappingObj.info.currentMapping = showChangeRec(field.split("."), 0, mappingObj.info.currentMapping);
	}

	/**
	* updateMappingCB
	* callback function, called after mapping request on es server. Update fields value
	* @param error : http error message if there is some
	* @param resp : http response  
	*/
	function updateMappingCB(error, resp) {		
		mappingObj.info.mappingsList = resp;
		mappingObj.info.currentMapping = resp[mappingObj.info.currentIndex];
		if (typeof(mappingObj.info.currentMapping) === "undefined") {
			for(key in  resp) {
				mappingObj.info.currentMapping = resp[key];
				mappingObj.info.selectedMapping = key;
				break ;
			}
		}
		else {
			mappingObj.info.selectedMapping = mappingObj.info.currentIndex;
		}
		updateMappingEsVersion();		
	}

	function  updateMappingEsVersion() {
		if (typeof (mappingObj.info.currentMapping) !== "undefined" && 
			typeof (mappingObj.info.currentMapping.mappings) !== "undefined") {
			mappingObj.info.currentMapping = mappingObj.info.currentMapping.mappings; 
		}
		setAncestorDocuments(mappingObj.info.currentMapping);
		mappingObj.info.fields = builtFullFieldArrayDocuments(mappingObj.info.currentMapping);			
	}

	// TODO : Maybe delete this function

	/**
	* showChangeRec
	* update the mapping display (hidden fields, ...)
	* Not used yet 
	*/
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