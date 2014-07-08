Curiosity.factory('context', function($rootScope, $location, elasticClient, elasticFunc, log){
	
	// initializing service's vars 
	var contextObj = {};
	var contextDocumentType = "context-doc";
	var prevIdx = -2;
	var client = elasticClient.getClient(globalConf.confServer);

	var context = {}

	contextObj.info = {};
	contextObj.info.currentContext = {};
	contextObj.info.contextList = [];
	contextObj.info.contextIdx = -1;


	/**
	* @desc Load a context from its id
	* @param string contextId elasticsearch context's id
	*/
	contextObj.loadContext = function(contextId) {
		if (prevIdx != contextObj.info.contextIdx && typeof(contextId) !== "undefined" && contextId != "") {
			var request = ejs.Request();
			var query = ejs.QueryStringQuery("_id:\"" + contextId + "\"");
			var filter = ejs.TypeFilter(contextDocumentType);		
			
			request.query(query).filter(filter);
			client.search({index:globalConf.confIndex, body:request})
			.then(function(data) {
				context = data.hits.hits[0];
				if (typeof (context) === "undefined")  { 				// Context not found => default context loaded
					$rootScope.$broadcast("NoContext"); 				
					log.log("Context : Error : context " + contextId + " not found", "danger");
				}
				else {													// Context found
					contextObj.info.currentContext = context._source;
					contextObj.setContextIdx();
					$location.search("context", contextId);
					prevIdx = contextObj.info.contextIdx;
					$rootScope.$broadcast("ContextLoaded");
				}
			}, 
			function (err) {
				log.log("Context : Error during context loading", "danger");
			});
		}
		else {
			$rootScope.$broadcast("NoContext"); 						// Undefined context id => default context
		}
	}

	/**
	* @desc send selected context, if its elasticsearch id is undefined then create a new document
	*/
	contextObj.sendContext = function() {
		if (typeof (context._id) === "undefined") {
			elasticFunc.sendNewDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, contextObj.getContextList);	
		}
		else {
			elasticFunc.sendDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, context._id);
		}
	}


	/**
	* @desc create a new context from a name, if its name is alredy attributed then do nothing and set error attribut to true
	* @param string name context's name
	*/
	contextObj.newContext = function(name) {
		if (name != "") {
			var i = 0;
			while (i < contextObj.info.contextList.length) { // Check if a context alredy exist with the same name
				if (contextObj.info.contextList[i].fields.contextName == name) {
					log.log("Context : Context " + name + " already exists !!","danger");		
					contextObj.info.error = true;
					return;
				}
				i++;
			}
			context = {};
			contextObj.info.currentContext = {};
			contextObj.info.currentContext.contextName = name;
			contextObj.info.error = false;
			log.log("Context : Context created locally", "success");
		}
		else {
			contextObj.info.error = true;
			log.log("Context : You have to name your new context", "danger");
		}
	}

	/**
	* @desc get module information from current context
	* @param string moduleName the module to find
	* @return module information
	*/
	contextObj.getModuleInformation = function(moduleName) {
		return (contextObj.info.currentContext[moduleName]);
	}

	/**
	* @desc set module information in current context
	* @param string moduleName the module to update
	* @param object value module information to store
	*/
	contextObj.setContextInformation = function(moduleName, value) {
		contextObj.info.currentContext[moduleName] = value;
	}

	/*
	* @desc delete current context from elasticsearch server and reinitialise current context object
	*/
	contextObj.deleteContext = function () {
		elasticFunc.deleteDocument(client, globalConf.confIndex, contextDocumentType, context._id);
		contextObj.info.currentContext = {};
		context = {};
	}

	/*
	* @desc retreive context list from elasticsearch server
	*/
	contextObj.getContextList = function() {
		var request = ejs.Request();
		var query = ejs.MatchAllQuery();
		var filter = ejs.TypeFilter(contextDocumentType);	 
		request.fields("contextName");
		request.size(100);
		request.query(query).filter(filter);
		client.search({index:globalConf.confIndex, body:request})
		.then(function(data) {
			contextObj.info.contextList = data.hits.hits;
			var i = 0;
			while (i < contextObj.info.contextList.length) {
				if (contextObj.info.contextList[i].fields.contextName instanceof Array)
					contextObj.info.contextList[i].fields.contextName = contextObj.info.contextList[i].fields.contextName[0]; 
				else 
					break;
				i++;
			}
		}, 
		function (error) {
			log.log("Context : Unable to load context list", "danger");
		})
	}

	/*
	* @desc set context idx from current context   
	*/
	contextObj.setContextIdx = function () {
		if (typeof (contextObj.info.currentContext.contextName) !== "undefined") {
			var i = 0;
			while (i < contextObj.info.contextList.length) {
				if (typeof (contextObj.info.contextList[i].fields) !== "undefined" &&
					contextObj.info.contextList[i].fields.contextName == contextObj.info.currentContext.contextName) {
					contextObj.info.contextIdx = i;
					break ;
				}
				i++;
			}
		}
	}

	/*
	* @desc send UpdateContext event to notifie each services to update their information
	*/
	contextObj.updateContext = function () {
		$rootScope.$broadcast("UpdateContext");
	}

	/*
	* @desc Update every attr of a reference object from a module with information stored in a context
	* @param string moduleName module's name where information has to be retreive 
	* @param object obj object where to update attr
	*/
	contextObj.setModuleInformation = function (moduleName, obj) {
		var module = contextObj.getModuleInformation(moduleName);
		if (typeof(module) !== "undefined") {
			for (key in module) {
				obj[key] = module[key];	
			}			
		}
	}

	/**
	* @desc function calls when services is created, getContext list from elasticSearch server and set context from url if there is one  
	*/
	contextObj.init = function() {
		contextObj.getContextList();
		var params = $location.search();
		if (typeof(params) != "undefined" && params.context) { 	// Context in url => get context from es server
			contextObj.loadContext(params.context);
		}
		else { 													// no context =>  Default context
			$rootScope.$broadcast("NoContext");
		}
	}

	return (contextObj); 
})