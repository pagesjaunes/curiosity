/** 
* @desc document module's controller. Hiden module used to modify data on elasticsearch server, onli for test and advanced users
* more functionality in incoming versions
*/
Curiosity.controller('docCtrl', function($scope, doc, query){

	$scope.info = doc.data;
	$scope.queryData = query.info;

	/**
	* @desc delete a document 
	* @param string id elasticsearch document id
	* @param string type document's type
	*/
	$scope.deleteDocument = function (id, type) {
		doc.deleteDocument(id, type);
	}


	/**
	* @desc update a elasticsearch document
	* @param string id elastcsearch document's id
	* @param string type document's type
	* @param json doc to update
	*/
	$scope.updateDocument = function (id, type, source) {
		doc.updateDocument(id, type, source);
	}

});