Curiosity.factory('context', function($rootScope, $cookies, elasticClient, elasticFunc, log){
	var contextObj = {};
	var contextDocumentType = "context-doc";
	var cookieName = "CurisoityDefaultContext";
	
	var client = elasticClient.getClient(globalConf.confServer);

	var context = {}

	contextObj.info = {};
	contextObj.info.currentContext = {};
	contextObj.info.contextList = [];
	contextObj.info.contextIdx = -1;

	contextObj.loadContext = function(contextName) {
		var request = ejs.Request();
		var query = ejs.QueryStringQuery("contextName:\"" + contextName + "\"");
		var filter = ejs.TypeFilter(contextDocumentType);
		
		request.query(query).filter(filter);
		client.search({index:globalConf.confIndex, body:request})
		.then(function(data) {
			context = data.hits.hits[0];
			if (typeof (context) === "undefined")  {
				log.log("Error : context " + contextName + " not found", "danger");
			}
			else {
				contextObj.info.currentContext = context._source;
				$rootScope.$broadcast("ContextLoaded");
			}
		}, 
		function (err) {
			log.log("Error during context loading", "danger");
		});
	}

	contextObj.sendContext = function() {
		if (typeof (context._id) === "undefined") {
			elasticFunc.sendNewDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext);
		}
		else {
			elasticFunc.sendDocument(client, globalConf.confIndex, contextDocumentType, contextObj.info.currentContext, context._id);
		}
	}

	contextObj.newContext = function(name) {
		context = {};
		contextObj.info.currentContext.contextName = name;
	}

	contextObj.getModuleInformation = function(moduleName) {
		return (contextObj.info.currentContext[moduleName]);
	}

	contextObj.setContextInformation = function(moduleName, value) {
		contextObj.info.currentContext[moduleName] = value;
	}

	contextObj.getContextList = function() {
		var request = ejs.Request();
		var query = ejs.MatchAllQuery();
		var filter = ejs.TypeFilter(contextDocumentType);	 
		request.fields("contextName");
		request.query(query).filter(filter);
		client.search({index:globalConf.confIndex, body:request})
		.then(function(data) {
			contextObj.info.contextList = data.hits.hits;
		}, 
		function (error) {
			console.log("Unable to load context list");
		})
	}

	contextObj.setDefaultContext = function() {
		if (typeof (contextObj.info.currentContext.contextName) !== "undefined") {
			$cookies.CurisoityDefaultContext = contextObj.info.currentContext.contextName;
		}
		else {
			console.log("No context Selected yet");
		}
	}

	contextObj.setContextIdx = function () {
		if (typeof (contextObj.info.currentContext.contextName) !== "undefined") {
			var i = 0;
			while (i < contextObj.info.contextList.length) {
				if (typeof (contextObj.info.contextList[i].fields) !== "undefined" &&
					contextObj.info.contextList[i].fields.contextName[0] == contextObj.info.currentContext.contextName) {
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
		if (typeof ($cookies[cookieName]) !== "undefined") {
				contextObj.loadContext($cookies[cookieName]);
		}
	}

	return (contextObj); 
})