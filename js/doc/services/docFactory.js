/**
* @desc document services used to manage document, this services isn't include by default in curiosity, it's only for advanced users or test
*/
Curiosity.factory('doc', function(elasticClient, curiosity, elasticFunc, log, $rootScope){
	var obj = {};
	obj.data = {};

	var currentIndex = curiosity.info.selectedIndex;
	var client = elasticClient.getClient(curiosity.info.currentServer);

	// Event Management
	$rootScope.$on('IndexChange',function (){
		currentIndex = curiosity.info.selectedIndex;		
	});

	$rootScope.$on('ServerChange', function() {
		client = elasticClient.getClient(curiosity.info.currentServer);
	});

	/**
	* @desc delete a elasticsearch document
	* @param string id elastcsearch document's id
	* @param string type document's type
	*/
	obj.deleteDocument = function (id, type){
		elasticFunc.deleteDocument(client, currentIndex, type, id);
	}

	/**
	* @desc update a elasticsearch document
	* @param string id elastcsearch document's id
	* @param string type document's type
	* @param json doc to update
	*/
	obj.updateDocument = function (id, type, source) {
		elasticFunc.sendDocument(client, currentIndex, type, source, id);
	}

	return (obj);
});