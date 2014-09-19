Curiosity.factory('context', function($rootScope, url, elasticClient, elasticFunc, log){
	// initializing service's vars 
	var contextObj = {};
	contextObj.info = {};
	contextObj.info.modules = {};
	contextObj.info.currentContext = {};
	contextObj.info.contextList = [];
	contextObj.info.contextIdx = -1;
	contextObj.info.contextLoaded = false;
	contextObj.info.updateStatus = "ok";
	var contextDocumentType = globalConf.defaultContextDocumentType;
	var prevIdx = -2;
	var client = elasticClient.getClient(globalConf.confServer);
	var curiosityObj = {};
	var context = {}

	/**
	* Init service function
	*/
	contextObj.init = function () {
		// contextObj.info = {};
		// contextObj.info.modules = {};
		// contextObj.info.currentContext = {};
		// contextObj.info.contextList = [];
		// contextObj.info.contextIdx = -1;
		// contextObj.info.contextLoaded = false;
		// contextObj.info.updateStatus = "ok";
		contextObj.getContextList();
	}

	/**
	* @desc Load a context from its id
	* @param string contextId elasticsearch context's id
	*/
	contextObj.loadContext = function(contextId) {
		if (prevIdx != contextId && typeof(contextId) !== "undefined" && contextId != "") {
			var request = ejs.Request();
			var query = ejs.QueryStringQuery("_id:\"" + contextId + "\"");
			var filter = ejs.TypeFilter(contextDocumentType);		
			//curiosityObj.load(true);
			request.query(query).filter(filter);
			client.search({index:globalConf.confIndex, body:request})
			.then(function(data) {
				//curiosityObj.load(false);
				context = data.hits.hits[0];
				if (typeof (context) === "undefined")  { 				// Context not found => default context loaded
					//$rootScope.$broadcast("NoContext");
					curiosityObj.connectToServer(globalConf.defaultServer);
					log.log("Context : Error : context " + contextId + " not found", "danger");
				}
				else {		// Context found
					// if a previous context was already loaded, blank url query	
					if (contextObj.info.contextLoaded == true) url.addData("simplifiedRequest", "");
					contextObj.info.currentContext = context._source;
					contextObj.setContextIdx();
					url.addData("context", contextId);
					prevIdx = context._id;	
					contextObj.info.contextLoaded = true;
					setModulesDatas();
				}
			}, 
			function (err) {
				log.log("Context : Error during context loading", "danger");
				curiosityObj.connectToServer(globalConf.defaultServer);
			});
		}
		else {
			curiosityObj.connectToServer(globalConf.defaultServer);
			// TODO				// Undefined context id => default context
		}
	}

	/**
	* @desc function that call load function of each modules registered with their context's specicifique datas
	*/
	function setModulesDatas () {
		for (key in contextObj.info.currentContext) {
			if (key != "contextDesc" && key != "contextName"){
				contextObj.info.modules[key].load(contextObj.info.currentContext[key]);
			}
		}
	}

	/**
	* @desc update current context data with returns of store function for each module registered
	*/
	function updateContextData() {
		for (key in contextObj.info.modules) {
			if (key != "contextDesc" && key != "contextName"){
				contextObj.info.currentContext[key] = contextObj.info.modules[key].store();
			}
		}
	}

	/**
	* @desc initialize a new context, update its content from modules datas then store it in elasticsearch
	* @param string name new context's name
	* @param string desc new context's description
	*/
	contextObj.saveNewContext = function (name, desc) {
		contextObj.info.newContextStatus = "Initializing new Context";
		contextObj.info.newContextoK = false;
		contextObj.info.newContextPercent = 0;
		contextObj.info.currentContext = {};
		contextObj.info.currentContext.contextName = name;
		contextObj.info.currentContext.contextDesc = desc;
		contextObj.info.newContextPercent = 26;
		contextObj.info.newContextStatus = "Updating modules informations";
      	updateContextData();
       	contextObj.info.newContextStatus = "Sending context to server";
       	contextObj.info.newContextPercent = 50;
       	elasticFunc.sendNewDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, contextObj.getNewContext);
	}

	/*
	* @desc function call after a new context as been sent to elasticsearch, manage error and call function that will wait till context is indexed
	*/
	contextObj.getNewContext = function (error,resp) {
		if (error) { // Error TODO : notifie user
			console.error(error);
			log.log("Error :" + error.status, "danger");
		}
		else { // New Context saved
			contextObj.info.newContextStatus = "Context sent. Waiting till indexed";
			contextObj.info.newContextPercent = 75;
			//Wait till the document is indexed
			waitTillIndexed(resp._id);
		}
	}

	/*
	* Launch search query in loop until a context is indexed in es
	* @param string contextId new context's id
	*/
	function waitTillIndexed(contextId) {
		setTimeout(function () {
			var request = ejs.Request();
			var query = ejs.QueryStringQuery("_id:\"" + contextId + "\"");
			var filter = ejs.TypeFilter(contextDocumentType);
			request.query(query).filter(filter);
			client.search({index:globalConf.confIndex, body:request}).then(function(data) {
				var tmp = data.hits.hits[0];
				if (typeof (tmp) === "undefined")  { // Context not found => Do it again till found
					waitTillIndexed(contextId); 
				}
				else {	// Context found
					context = tmp; 
					contextObj.info.currentContext = context._source;
					contextObj.setContextIdx();
					url.addData("context", contextId);
					contextObj.info.contextLoaded = true;
					contextObj.info.newContextStatus = "Context created with success";
					contextObj.info.newContextoK = true;
					contextObj.info.newContextPercent = 100;
					contextObj.getContextList();
				}
			});
		}, 1000);
	}

	/**
	* @desc update current context data's then update its associated documents in es
	*/
	contextObj.updateContext = function () {
		contextObj.info.updateStatus = "Updating"; 
      	updateContextData();
		elasticFunc.sendDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, context._id, contextObj.updateCB);
	}

	/**
	* @desc updateContext function's callback, manage errors and notify users 
	*/
	contextObj.updateCB = function (error, resp) {
		if (error) {
			contextObj.info.updateStatus = "error";
			//alert("Error while updating context");
		}
		else {
			contextObj.info.updateStatus = "ok";
			//alert("Context update success");
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
	contextObj.deleteContext = function (id) {
		elasticFunc.deleteDocument(client, globalConf.confIndex, contextDocumentType, id, deleteContextCB);
	}

	function deleteContextCB () {
		setTimeout(function () {
			contextObj.getContextList();
		},1000);
	}

	/*
	* @desc retreive context list from elasticsearch server
	*/
	contextObj.getContextList = function() {
		var request = ejs.Request();
		var query = ejs.MatchAllQuery();
		var filter = ejs.TypeFilter(contextDocumentType);	 
		request.fields(["contextName", "contextDesc"]);
		request.size(100);
		request.query(query).filter(filter);
		client.search({index:globalConf.confIndex, body:request})
		.then(function(data) {
			contextObj.info.contextList = data.hits.hits;
			var i = 0;
			while (i < contextObj.info.contextList.length) {
				if (typeof(contextObj.info.contextList[i].fields) !== "undefined") {
					if (contextObj.info.contextList[i].fields.contextName instanceof Array)
						contextObj.info.contextList[i].fields.contextName = contextObj.info.contextList[i].fields.contextName[0];
					else 
						break;
				}
				else {
					contextObj.info.contextList.splice(i,1);
				}
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
	contextObj.launch = function() {
		var params = url.getData("context");
		if (typeof(params) !== "undefined") { 	// Context in url => get context from es server
			contextObj.loadContext(params);
		}
		else { 													// no context =>  Default context
			//curiosityObj.connectToServer(globalConf.defaultServer);
			contextObj.loadContext(globalConf.homeContext);
		}
	}

	/**
	* @desc set curiosityObj with curiosity service to avoid circular depencies  
	*/	
	contextObj.setCuriosityObj = function(obj){
		curiosityObj = obj;
	}

	/**
	* @desc add a new attr in context's modules object  
	*/
	contextObj.registerModule = function(name, obj) {
		contextObj.info.modules[name] = obj;
	}
	
	return (contextObj); 
})