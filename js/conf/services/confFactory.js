//confUtils.js
Curiosity.factory("conf", function(elasticClient, elasticFunc, log){
	
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
		"templates":[]
	};
	
	var aggregationsTemplate = 
	{
		"type":"aggregationsTemplates",
		"defaultValue":[],
		"templates":[]
	};

	var bugReportDefault = 
	{
		"type":"bugreport",
		"list":[]
	};


	var confClient = elasticClient.getClient(globalConf.confServer); 

	/*
	* An array which contains all default conf document
	*/
	var defaultConfDocument = [keyWordDefault, serverDefault, templateDefault, aggregationsTemplate, bugReportDefault];
	
	return {

			/**
			* initConf 
			* send all default document to an index 
			* @param confClient : an elasticSearch.js confClient alredy initialised 
			*/
			"initConf" : function () {
				var i = 0;
				while (i < defaultConfDocument.length) {
					elasticFunc.sendNewDocument(confClient, 
						globalConf.confIndex, 
						globalConf.defaultConfDocumentType, 
						defaultConfDocument[i]);
					i++;
				}
			},
			"reInitConf" : function () {
				elasticFunc.deleteIndex(confClient, globalConf.confIndex);
				this.initConf();
			},

			"initDocument" : function (document) {
				elasticFunc.sendNewDocument(confClient, 
					globalConf.confIndex, 
					globalConf.defaultConfDocumentType, 
					document);

			},

			/**
			* getConf 
			* get all document from the conf index. If the index is missing then it create him and call initConf 
			* @param confClient : an elasticSearch.js confClient alredy initialised 
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
					log.log("Configuration chargée", "info");
					scope.$broadcast("ConfLoaded");
				},
				function (err) {
					elasticFunc.createIndex(confClient, globalConf.confIndex);
					initConfFunc(confClient);
				});
			},

			/**
			* sendConf 
			* send all curent conf document to the server, if there is no document then send all default document
			* @param confClient : an elasticSearch.js confClient alredy initialised 
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
			* sendConfDocument
			* send a specific conf document
			* @param confClient : an elasticSearch.js confClient alredy initialised   
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
			* getConfDocument
			* find a specific document in the array of conf document alredy fetched from the server
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