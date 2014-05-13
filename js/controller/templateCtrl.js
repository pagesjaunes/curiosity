Curiosity.controller('templateCtrl', ['$scope', '$templateCache','$http', 'conf', 'agg',
function($scope, $templateCache, $http, conf, agg){
	// INITIALISATION
	$scope.template.currentTemplate = {};
	$scope.template.tab = 0;
	$scope.template.aggregation = {};
	$scope.template.aggregation.currentTemplate = {};
	$scope.tiny = {};	

	$scope.tiny.tinymceOptions = {
		verify_html: false,
		selector: "textarea",
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

	// EVENT

	$scope.$on("ConfLoaded", function() {
		$scope.template.list = conf.getConfDocument("template").templates;
		$scope.template.aggregation.list = conf.getConfDocument("aggregationsTemplates").templates;
		$scope.template.aggregation.association = conf.getConfDocument("aggregationsTemplates").defaultValue;
		$scope.template.aggregation.possibleAggregation = agg.possibleAggregation;
		$scope.initAggTemplate();
	});

	$scope.changeTemplate = function () {
		if (typeof($scope.template.selected) !== "undefined") {
			$scope.template.currentTemplate = $scope.template.list[$scope.template.selected]; 
		}
	}
	/**
	* $scope.new
	* Add a new template in the template list
	*/
	$scope.new = function () {
		$scope.template.currentTemplate = {};
		$scope.template.currentTemplate.name = "New Template";
		$scope.template.currentTemplate.value = "";
		$scope.template.list.push($scope.template.currentTemplate);
	}

	/**
	* $scope.save 
	* Send templates to the conf server
	*/
	$scope.save = function(){
		var indice = conf.getConfDocumentIndice("template");
		if (indice >= 0){
			gConf[indice]._source.templates = $scope.template.list;
			$scope.conf.saveDocument("template");
		}
	}


	$scope.addField =  function (field) {
		$scope.template.currentTemplate.value += ("{{ item._source." + field + " }}");
	}

	// Aggregation Tpl
	
	/**
	* $scope.updateAggAssoc 
	* Send to conf server the current association between an aggregation type and a template
	*/
	$scope.updateAggAssoc = function() {
		var i = 0;
		var find = false;
		while (i < $scope.template.aggregation.association.length)
		{
			if ($scope.template.aggregation.association[i].type == $scope.template.aggregation.aggSelected){
				$scope.template.aggregation.association[i].tpl = $scope.template.aggregation.tplSelected;
				find = true;
				break ;	
			}
			i++;
		}
		if (!find) {
			$scope.template.aggregation.association.push({	type:$scope.template.aggregation.aggSelected,
															tpl:$scope.template.aggregation.tplSelected 	
														});	
		}
		var indice = conf.getConfDocumentIndice("aggregationsTemplates");
		if (indice >= 0){
			gConf[indice]._source.defaultValue = $scope.template.aggregation.association;
			$scope.conf.saveDocument("aggregationsTemplates");
		}
	}

	$scope.changeAggTemplate = function () {
		$scope.template.aggregation.currentTemplate = $scope.template.aggregation.list[$scope.template.aggregation.selected]; 
	}

	/**
	* $scope.updateAggAssoc 
	* Add a new aggregation template to the list of aggregation template
	*/
	$scope.newAggTpl = function () {
		$scope.template.aggregation.currentTemplate = {};
		$scope.template.aggregation.currentTemplate.name = "New Template";
		$scope.template.aggregation.currentTemplate.value = "";
		$scope.template.aggregation.list.push($scope.template.aggregation.currentTemplate);
	}

	/**
	* $scope.updateAggAssoc 
	* Send aggregation templates to conf server
	*/
	$scope.saveAggTpl = function(){
		var indice = conf.getConfDocumentIndice("aggregationsTemplates");
		if (indice >= 0){
			console.log($scope.template.aggregation.list);
			gConf[indice]._source.templates = $scope.template.aggregation.list;
			$scope.conf.saveDocument("aggregationsTemplates");
		}
	}

	/**
	* $scope.initAggTemplate 
	* Load in template cache default aggregation template for each type of aggregation, 
	* then load the associate template for each type of aggregation when it can be found 
	*/
	$scope.initAggTemplate = function (){
		$http.get('template/aggregation/default.html', {cache:$templateCache}).then(function() {
			var defaultTemplate = $templateCache.get('template/aggregation/default.html')[1];
			var i = 0;
			while (i < $scope.template.aggregation.possibleAggregation.length) {
				$templateCache.put($scope.template.aggregation.possibleAggregation[i].type + "_template", defaultTemplate);
				i++;
			}
			i = 0;
			if (typeof ($scope.template.aggregation.association) !== "undefined") {
				while (i < $scope.template.aggregation.association.length){
					var j = 0;
					while (j < $scope.template.aggregation.list.length){
						if ($scope.template.aggregation.list[j].name == $scope.template.aggregation.association[i].tpl) {
							$templateCache.put($scope.template.aggregation.association[i].type + "_template", $scope.template.aggregation.list[j].value);
							break;
						}
						j++;
					}
					i++;
				}
			}
		});
	}
}]);