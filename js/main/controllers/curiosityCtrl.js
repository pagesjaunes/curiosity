Curiosity.controller('curiosityCtrl',
function($scope, conf, curiosity, query){	
	/* INITIALISATION */
	$scope.data = curiosity.info;
	$scope.queryData = query.info;

	$scope.info = {};
	$scope.info.txt = global_text;
	/* EVENTS */
	$scope.$on("ConfLoaded", function() {
		curiosity.init();
		$scope.connectServer($scope.data.currentServer); /* Init the Index list */
		$scope.data.serverList = conf.getConfDocument("server").servers;
	});
	
	//conf.reInitConf();
	conf.getConf($scope);
	
	$scope.selectIndex = function (){
		curiosity.selectIndex();
	}	

	$scope.connectServer = function (url, add){
		curiosity.connectToServer(url, add);
	}

	$scope.search = function () {
		query.search();
	}

	$scope.updateQuery = function () {
		query.updateQuery();	
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
});