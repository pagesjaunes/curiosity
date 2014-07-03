Curiosity.controller('docCtrl', function($scope, doc){
	$scope.info = doc.data;

	$scope.deleteDocument = function (id, type) {
		doc.deleteDocument(id, type);
	}

});