/**
* @desc document services used to manage document, this services isn't include by default in curiosity, it's only for advanced users or test
*/
Curiosity.factory('doc', function(elasticClient, curiosity, elasticFunc, $rootScope){
	var obj = {};
	obj.data = {};

	var currentIndex = "";
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

	return (obj);
});