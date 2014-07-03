Curiosity.factory('doc', function(elasticClient,curiosity, elasticFunc, $rootScope){
	var obj = {};
	obj.data = {};

	var currentIndex = "";
	var client = elasticClient.getClient(curiosity.info.currentServer);

	$rootScope.$on('IndexChange',function (){
		currentIndex = curiosity.info.selectedIndex;		
	});

	$rootScope.$on('ServerChange', function() {
		client = elasticClient.getClient(curiosity.info.currentServer);
	});

	
	obj.deleteDocument = function (id, type){
		elasticFunc.deleteDocument(client, currentIndex, type, id);
	}

	return (obj);
});