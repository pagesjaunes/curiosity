//confUtils.js
Curiosity.provider("conf", function(){
	
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
		"servers":[globalConf.confServer]
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


	/*
	* An array which contains all default conf document
	*/
	var defaultConfDocument = [keyWordDefault, serverDefault, templateDefault, aggregationsTemplate];
	

	this.$get = function (elasticFunc) {
		return {

			/**
			* initConf 
			* send all default document to an index 
			* @param client : an elasticSearch.js client alredy initialised 
			*/
			"initConf" : function (client) {
				var i = 0;
				while (i < defaultConfDocument.length) {
					elasticFunc.sendNewDocument(client, 
						globalConf.confIndex, 
						globalConf.defaultConfDocumentType, 
						defaultConfDocument[i]);
					i++;
				}
			},

			"initDocument" : function (client, document) {
				elasticFunc.sendNewDocument(client, 
					globalConf.confIndex, 
					globalConf.defaultConfDocumentType, 
					document);
			},

			/**
			* getConf 
			* get all document from the conf index. If the index is missing then it create him and call initConf 
			* @param client : an elasticSearch.js client alredy initialised 
			*/
			"getConf" : function (client, scope) {
				var request = ejs.Request();
				var confQuery = ejs.MatchAllQuery();
				var initConfFunc = this.initConf;

				request.query(confQuery);
				client.search({index:globalConf.confIndex, body:request})
				.then(function(data) {
					gConf = data.hits.hits;
					scope.$broadcast("ConfLoaded")
				},
				function (err) {
					elasticFunc.createIndex(client, globalConf.confIndex);
					initConfFunc(client);
				});
			},

			/**
			* sendConf 
			* send all curent conf document to the server, if there is no document then send all default document
			* @param client : an elasticSearch.js client alredy initialised 
			*/
			"sendConf" : function (client) {
				if (!gConf.length) {
					this.initConf(client);
					getConf(client);
					return ;
				}
				var i = 0;
				while (i < gConf.length) {
					elasticFunc.sendDocument(client, globalConf.confIndex, gConf[i]._type, gConf[i]._source, gConf[i]._id);
					i++;
				}
			},

			/**
			* sendConfDocument
			* send a specific conf document
			* @param client : an elasticSearch.js client alredy initialised   
			* @param type : the conf document type's to send
			*/
			"sendConfDocument" : function (client, type) {
				var i = 0;
				while (i < gConf.length)
				{
					if (gConf[i]._source.type == type) {
						elasticFunc.sendDocument(client, globalConf.confIndex, gConf[i]._type, gConf[i]._source, gConf[i]._id);
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

			"addServerToConf"  : function (client, url) {
				var serverList = getConfDocument("server");
				var i = 0;
				while (i < serverList.servers.length) {
					if (serverList.servers[i] == url) {
						return ;
					}
					i++;
				}
				serverList.servers.push(url);
				elasticFunc.sendConfDocument(client, "server");
			}
		};
	}
})