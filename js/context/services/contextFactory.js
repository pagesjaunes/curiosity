Curiosity.factory('context', function($rootScope, $cookies, $location, elasticClient, elasticFunc, log){
	var contextObj = {};
	var contextDocumentType = "context-doc";
	var cookieName = "CurisoityDefaultContext";
	var prevIdx = -2;
	var client = elasticClient.getClient(globalConf.confServer);

	var context = {}

	contextObj.info = {};
	contextObj.info.currentContext = {};
	contextObj.info.contextList = [];
	contextObj.info.contextIdx = -1;

	contextObj.loadContext = function(contextId) {
		if (prevIdx != contextObj.info.contextIdx && typeof(contextId) !== "undefined" && contextId != "") {
			var request = ejs.Request();
			var query = ejs.QueryStringQuery("_id:\"" + contextId + "\"");
			var filter = ejs.TypeFilter(contextDocumentType);		
			
			request.query(query).filter(filter);
			client.search({index:globalConf.confIndex, body:request})
			.then(function(data) {
				context = data.hits.hits[0];
				if (typeof (context) === "undefined")  {
					$rootScope.$broadcast("NoContext");
					log.log("Context : Error : context " + contextId + " not found", "danger");
				}
				else {
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
			$rootScope.$broadcast("NoContext");
		}
	}

	contextObj.sendContext = function() {
		if (typeof (context._id) === "undefined") {
			elasticFunc.sendNewDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, contextObj.getContextList);	
		}
		else {
			elasticFunc.sendDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, context._id);
		}
	}

	// Todo : check if the context name is alredy present in the context list
	contextObj.newContext = function(name) {
		if (name != "") {
			context = {};
			contextObj.info.currentContext = {};
			contextObj.info.currentContext.contextName = name;
			var i = 0;
			while (i < contextObj.info.contextList.length) {
				if (contextObj.info.contextList[i].fields.contextName == name) {
					log.log("Context : Context " + name + " already exists !!","danger");		
					contextObj.info.error = true;
					return;
				}
				i++;
			}
			contextObj.info.error = false;
			log.log("Context : Context created locally", "success");
		}
		else {
			contextObj.info.error = true;
			log.log("Context : You have to name your new context", "danger");
		}
	}

	contextObj.getModuleInformation = function(moduleName) {
		return (contextObj.info.currentContext[moduleName]);
	}

	contextObj.setContextInformation = function(moduleName, value) {
		contextObj.info.currentContext[moduleName] = value;
	}

	contextObj.deleteContext = function () {
		elasticFunc.deleteDocument(client, globalConf.confIndex, contextDocumentType, context._id);
		if ($cookies.CurisoityDefaultContext == context._id) {
			$cookies.CurisoityDefaultContext = "";
		}
		contextObj.info.currentContext = {};
		context = {};
	}

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

	contextObj.setDefaultContext = function() {
		console.log(contextObj.info.currentContext);
		if (typeof (context._id) !== "undefined") {
			$cookies.CurisoityDefaultContext = context._id;
		}
		else {
			log.log("Context : No context Selected yet", "warning");
		}
	}

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

	contextObj.updateContext = function () {
		$rootScope.$broadcast("UpdateContext");
	}

	contextObj.setModuleInformation = function (moduleName, obj) {
		var module = contextObj.getModuleInformation(moduleName);
		if (typeof(module) !== "undefined") {
			for (key in module) {
				obj[key] = module[key];	
			}			
		}
	}

	contextObj.init = function() {
		contextObj.getContextList();
		var params = $location.search();
		if (typeof(params) != "undefined" && params.context) {
			contextObj.loadContext(params.context);
		}
		else {
			if (typeof ($cookies[cookieName]) !== "undefined") {
				contextObj.loadContext($cookies[cookieName]);
			}
			else {
				$rootScope.$broadcast("NoContext");
			}
		}
	}
	return (contextObj); 
})