Curiosity.factory('init', function($rootScope, context, aggFactory, log, template, keyword, filters, result, query, conf, mapping, moduleManager, layout, curiosity, notebook){
	var initObj = {};
	var arg = arguments;
	conf.getConf();
	
	function initModule(services) {
		var i = 1;
		while (i < services.length) {
			services[i].init();
			i++;
		}
		context.launch();
	}	
	
	$rootScope.$on("ConfLoaded", function () {
		initModule(arg);
	});

	return initObj;
});