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

	/**
	* @desc update a elasticsearch document
	* @param string id elastcsearch document's id
	* @param string type document's type
	* @param json doc to update
	*/
	obj.updateDocument = function (id, type, source) {
		elasticFunc.sendDocument(client, currentIndex, type, source, id);
	}

	/**
	* @desc clone a elasticsearch document
	* @param string id elastcsearch document's id to clone
	* @param string type document's type to clone
	* @param string id elastcsearch document's id to create
	* @param string type document's type to create
	*/
	obj.cloneDocument = function (fromId, fromType, toId, toType) {
		client.get({index:currentIndex, type:fromType, id:fromId})
			.then(function(data) {
				docToClone = data.hits.hits[0];
				if (typeof (docToClone) === "undefined")  { 				// Doc not found
					log.log("Clone a doc : Error : doc " + fromId + " not found", "danger");
				}
				else {													// Context found
					elasticFunc.sendDocument(client, currentIndex, toType, docToClone._source, toId);
				}
			}		
	}

	/**
	* @desc generate an id. Can be usefull to clone a doc
	*/
	obj.generateId = function () {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	};


	return (obj);
});