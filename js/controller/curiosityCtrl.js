Curiosity.controller('curiosityCtrl',[ '$scope', '$http', 'elasticClient', 'ejsResource', 'conf',  
function($scope, $http, elasticClient, ejsResource, conf){	
	/* INITIALISATION */
	var client = elasticClient.getClient(globalConf.defaultServer);
	$scope.info = {};
	$scope.info.tab = 0;
	$scope.info.displayNewServer = false;
	$scope.info.newServer = "";
	$scope.info.mappings = [];
	$scope.info.loading = false;
	$scope.info.err = false;
	$scope.info.txt = global_text;
	$scope.conf = {};
	$scope.info.selectedIndex = "";
	$scope.info.version = globalConf.version;
	/* EVENTS */
	$scope.$on("ConfLoaded", function() {
		$scope.connectServer(globalConf.defaultServer); /* Init the Index list */
		$scope.info.serverList = conf.getConfDocument("server").servers;
	});
	
	conf.getConf(client, $scope);
	/*
	* selectIndex 
	* Update the selected Index
	*/
	$scope.selectIndex = function () {
		$scope.info.selectedIndex = $scope.info.selectedIndex;
		$scope.$broadcast("IndexChange");
	}
	
	/** 
	* Connect to a new server
	*/
	$scope.connectServer = function (url, addServer) {
		if (url == "")
			return ;
		var serverUrl = url + '/_aliases';
		$http({method: 'GET', url: serverUrl}).
		success(function(data) {
			$scope.info.connected = true;
			$scope.info.indexList = Object.keys(data);
			if (addServer) {
				addServerToConf(client, url);
			}
			$scope.info.selectedServer = url;
			globalConf.curentServer = url;
			$scope.$broadcast("ServerChange");		
		}). error(function() {
			$scope.info.connected = false;
		});
	};
	
	$scope.conf.saveDocument = function(type) {
		conf.sendConfDocument(client, type);
	}

	$scope.tiny = {};	

	$scope.tiny.tinymceOptions = {
		verify_html: false,
	 	plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons paste textcolor"
    	],
		toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
		toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
		toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",

		menubar: false,
		toolbar_items_size: 'small',

		style_formats: [
		{title: 'Bold text', inline: 'b'},
		{title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
		{title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
		{title: 'Example 1', inline: 'span', classes: 'example1'},
		{title: 'Example 2', inline: 'span', classes: 'example2'},
		{title: 'Table styles'},
		{title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
		],
	};

}]);