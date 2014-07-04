/** 
* @desc document module's controller. Hiden module used to modify data on elasticsearch server, onli for test and advanced users
* more functionality in incoming versions
*/
Curiosity.controller('docCtrl', function($scope, doc){

	$scope.info = doc.data;

	/**
	* @desc delete a document 
	* @param string id elasticsearch document id
	* @param string type document's type
	*/
	$scope.deleteDocument = function (id, type) {
		doc.deleteDocument(id, type);
	}
});