//confUtils.js
Curiosity.factory("conf", function($rootScope, elasticClient, elasticFunc, log){
	
	/*
	* Default value for the keyword list conf document
	*/
	var keyWordDefault = 
	{
		"type":"keyword",
		"keywords":[{"index":"global","keywords":[]}]
	};
	/**
	*	Default value for the server list conf document  
	*/
	var serverDefault = 
	{
		"type":"server",
		"servers":[globalConf.defaultServer]
	};

	var templateDefault = 
	{
		"type":"template",
		"templates":[
			{"name": "exploreContext", "value": "<div> <div class=\"row\"> <div class=\"col-sm-6 col-md-4\" ng-repeat=\'item in queryData.result.hits.hits\'> <div class=\"thumbnail\">  <div class=\"caption\"> <h3>{{ item._source.contextName }}<\/h3> <p>{{ item._source.contextDesc }}<\/p> <p><a href=\"#?context={{ item._id }}\" target=\"_blank\" class=\"btn btn-primary\" role=\"button\">Use it !<\/a> <\/p> <\/div> <\/div> <\/div> <\/div> <\/div>"},
			{"name": "prettyJson", "value": "<div class=\"panel-group\" id=\"accordion\">\r\n   <div class=\"panel panel-default\" ng-repeat=\'item in queryData.result.hits.hits\'>\r\n      <div class=\"panel-heading\">\r\n         <h4 class=\"panel-title\">\r\n            <a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#{{item._id}}\">\r\n            {{item._type}} -> {{item._id}}\r\n            <\/a>\r\n         <\/h4>\r\n      <\/div>\r\n      <div id=\"{{item._id}}\" class=\"panel-collapse collapse in\">\r\n         <div class=\"panel-body\">\r\n            <json-explorer json-data=\"{{item._source}}\" ><\/json-explorer>\r\n         <\/div>\r\n      <\/div>\r\n   <\/div>\r\n<\/div>"},

		]
	};
	
	var aggregationsTemplate = 
	{
		"type":"aggregationsTemplates",
		"templates":
			[
				{"name":"pieChart","value" : "<div piechart data=\"agg.buckets\" cols=\"[{id: 'Terms', label: 'Terms', type: 'string', path:'key'}, {id:'Doc_count', label: 'Count', type: 'number', path:'doc_count'}]\"> </div>"},
				{"name":"barChart","value" : "<div barchart data=\"agg.buckets\" cols=\"[{id: 'Terms', label: 'Terms', type: 'string', path:'key'}, {id:'Doc_count', label: 'Count', type: 'number', path:'doc_count'}]\"> </div>"},
				{"name":"lineChart","value": "<div linechart data=\"agg.buckets\" cols=\"[{id: 'Date', label: 'Date', type: 'date', path:'key'},{id: 'Doc_count', label: 'Count', type: 'number', path:'doc_count'}]\"></div>"}
			]
	};

	var basicSearchContext = 
	{"contextName":"basicSearch","contextDesc": "This context is usefull to just process a search and explore quickly an index.\nChoose it, select your index, eventualy add query string paramters and acces yours docs.","agg":[],"filters":{"filters":{"opBool":"And","type":"node","nestedFilter":[]}},"result":{"useTemplate":true,"currentTemplate":"prettyJson","templateSelected": "1"},"request":{"simplifiedRequest":"","complexRequest":"","autoRefresh":true,"nbResult":10},"moduleManager":{"trash":{"name":"trash","display":true,"modules":[],"id":0,"type":"trash"},"ws748760-r0-c0":{"name":"ws748760-r0-c0","display":true,"modules":[{"name":"module147804","display":true,"template":"partials/request_module/partials/request_form.html","id":2,"$$hashKey":"02X"},{"name":"module462756","display":true,"template":"partials/request_module/partials/request_option_bar.html","id":3,"$$hashKey":"02Y"},{"name":"module238113","display":true,"template":"partials/request_module/partials/request_pagination.html","id":4,"$$hashKey":"02Z"},{"name":"module254706","display":true,"template":"partials/request_module/partials/request_result_display.html","id":5,"$$hashKey":"030"}],"id":1,"type":"ws748760-r0-c0"}},"layout":{"workspaces":[{"name":"ws748760","displayName":"New Workspace","col":1,"row":1,"new":false,"cards":[[{"row":0,"col":0,"colType":"col-xs-12","rowType":"row-12","name":"ws748760-r0-c0","$$hashKey":"00R"}]],"idx":0,"$$hashKey":"00B"}],"currentWorkspace":{"name":"ws748760","displayName":"New Workspace","col":1,"row":1,"new":false,"cards":[[{"row":0,"col":0,"colType":"col-xs-12","rowType":"row-12","name":"ws748760-r0-c0","$$hashKey":"00R"}]],"idx":0,"$$hashKey":"00B"},"idx":0,"turn":false},"curiosity":{"server":globalConf.defaultServer,"index":""},"notebook":{"currentNotebook":[]}};

	var exploreContext = 
	{"contextName":"exploreContext","contextDesc": "This context is a specific context usefull for select a context !!! \nWe use the context system to display a search tool and show how to customize curiosity. Have fun !","agg":[],"filters":{"filters":{"opBool":"And","type":"node","nestedFilter":[{"type":"Terms","data":{"field":"_type","term":globalConf.defaultContextDocumentType},"id":"filter153040"}]}},"result":{"useTemplate":true,"currentTemplate":"exploreContext","templateSelected": "0"},"request":{"simplifiedRequest":"","complexRequest":"","autoRefresh":true,"nbResult":100},"moduleManager":{"trash":{"name":"trash","display":true,"modules":[],"id":0,"type":"trash"},"ws748760-r0-c0":{"name":"ws748760-r0-c0","display":true,"modules":[{"name":"module147804","display":true,"template":"partials/request_module/partials/request_form.html","id":2,"$$hashKey":"02X"},{"name":"module238113","display":true,"template":"partials/request_module/partials/request_pagination.html","id":4,"$$hashKey":"02Z"},{"name":"module254706","display":true,"template":"partials/request_module/partials/request_result_display.html","id":5,"$$hashKey":"030"}],"id":1,"type":"ws748760-r0-c0"}},"layout":{"workspaces":[{"name":"ws748760","displayName":"New Workspace","col":1,"row":1,"new":false,"cards":[[{"row":0,"col":0,"colType":"col-xs-12","rowType":"row-12","name":"ws748760-r0-c0","$$hashKey":"00R"}]],"idx":0,"$$hashKey":"00B"}],"currentWorkspace":{"name":"ws748760","displayName":"New Workspace","col":1,"row":1,"new":false,"cards":[[{"row":0,"col":0,"colType":"col-xs-12","rowType":"row-12","name":"ws748760-r0-c0","$$hashKey":"00R"}]],"idx":0,"$$hashKey":"00B"},"idx":0,"turn":false},"curiosity":{"server":globalConf.confServer,"index":globalConf.confIndex},"notebook":{"currentNotebook":[]}};




	var confClient = elasticClient.getClient(globalConf.confServer); 

	/*
	* An array which contains all default conf document
	*/
	var defaultConfDocument = [keyWordDefault, serverDefault, templateDefault, aggregationsTemplate];
	
	var defaultContextDocument = [basicSearchContext, exploreContext];


	return {

			"init": function () {
			}, 

			/**
			* @desc send all default document to an index 
			* @param confClient an elasticSearch.js confClient alredy initialised 
			*/
			"initConf" : function () {
				var i = 0;
				while (i < defaultConfDocument.length) {
					elasticFunc.sendDocument(confClient, 
						globalConf.confIndex, 
						globalConf.defaultConfDocumentType, 
						defaultConfDocument[i],
						defaultConfDocument[i].type);
					i++;
				}
				i = 0;
				while (i < defaultContextDocument.length) {
					elasticFunc.sendDocument(confClient, 
						globalConf.confIndex, 
						globalConf.defaultContextDocumentType, 
						defaultContextDocument[i],
						defaultContextDocument[i].contextName);
					i++;
				}
			},

			/**
			* @desc reinitialize conf value on es server
			*/
			"reInitConf" : function () {
				elasticFunc.deleteIndex(confClient, globalConf.confIndex);
				this.initConf();
			},

			/**
			* @desc send a new conf document on an elasticsearch server
			*/
			"initDocument" : function (document) {
				elasticFunc.sendNewDocument(confClient, 
					globalConf.confIndex, 
					globalConf.defaultConfDocumentType, 
					document);
			},

			/**
			* @desc get all document from the conf index. If the index is missing then it create him and call initConf 
			* @param scope scope scope where to broadcast an event when conf is loaded // TODO : Use $rootScope instead
			*/
			"getConf" : function (scope) {
				var request = ejs.Request();
				var confQuery = ejs.MatchAllQuery();
				var filter = ejs.TypeFilter(globalConf.defaultConfDocumentType);
				var initConfFunc = this.initConf;

				request.query(confQuery).filter(filter);
				confClient.search({index:globalConf.confIndex, body:request})
				.then(function(data) {
					gConf = data.hits.hits;
					log.log("Configuration loaded", "info");
					$rootScope.$broadcast("ConfLoaded");
				},
				function (err) {
					elasticFunc.createIndex(confClient, globalConf.confIndex);
					initConfFunc(confClient);
				});
			},

			/**
			* @desc send all curent conf document to the server, if there is no document then send all default document
			*/
			"sendConf" : function () {
				if (!gConf.length) {
					this.initConf(confClient);
					getConf(confClient);
					return ;
				}
				var i = 0;
				while (i < gConf.length) {
					elasticFunc.sendDocument(confClient, globalConf.confIndex, gConf[i]._type, gConf[i]._source, gConf[i]._id);
					i++;
				}
			},

			/**
			* @desc send a specific conf document
			* @param type : the conf document type's to send
			*/
			"sendConfDocument" : function (type) {
				var i = 0;
				while (i < gConf.length)
				{
					if (gConf[i]._source.type == type) {
						elasticFunc.sendDocument(confClient, globalConf.confIndex, gConf[i]._type, gConf[i]._source, gConf[i]._id);
						return ;	
					}
					i++;
				}
			},

			/**
			* @desc find a specific document in the array of conf document alredy fetched from the server
			* @param type : the conf document type's to find
			* @return : a json object which represent the document or an empty object instead
			*/
			"getConfDocument" : function (type){
				var i = 0;
				while (i < gConf.length){
					if (typeof(gConf[i]._source.type) !== "undefined" 
						&& gConf[i]._source.type == type) {
						return (gConf[i]._source);
					}
					i++;
				}
				return ([]);
			},

			/**
			* @desc get conf document's indice from is type in the confdoc list 
			* @param string type conf document's type
			*/
			"getConfDocumentIndice" : function (type) {
				var i = 0;
				while (i < gConf.length){
					if (typeof(gConf[i]._source.type) !== "undefined" 
						&& gConf[i]._source.type == type) {
						return (i);
					}
					i++;
				}
				return (-1);
			},

			/**
			* @desc add a server to the servers conf document
			* @param string url server's url
			*/
			"addServerToConf"  : function (url) {
				var serverList = this.getConfDocument("server");
				var i = 0;
				while (i < serverList.servers.length) {
					if (serverList.servers[i] == url) {
						return ;
					}
					i++;
				}
				serverList.servers.push(url);
				this.sendConfDocument("server");
			}
		}
})