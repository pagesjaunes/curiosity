// bugReportCtrl.js



Curiosity.controller('bugReportCtrl', ['$scope','conf', function($scope, conf, elasticClient){
	$scope.bugReport = {};
	$scope.bugReport.contact = "";
	$scope.bugReport.title = "";
	$scope.content = "toto";

	$scope.send = function () {
		var indice = conf.getConfDocumentIndice('bugreport');
		if (indice >= 0) {
			gConf[indice]._source.list.push({
											'contact':$scope.bugReport.contact, 
											'title':$scope.bugReport.title,
											'content':$scope.bugReport.content})
			
		}
		$scope.conf.saveDocument('bugreport');
		$scope.bugReport.sent = true;
	}
}])