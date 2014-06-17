Curiosity.factory('curiosity', function($http, $rootScope, conf, log, context, moduleManager){
	var curiosityObj = {};
	curiosityObj.info = {};

	// General informations
	curiosityObj.info.version = version;
	curiosityObj.info.tab = 1;	
	curiosityObj.info.loading = false;
	curiosityObj.info.err = false;
	curiosityObj.info.errList = [];
	curiosityObj.info.log = [];
	
	// Server Informations 
	curiosityObj.info.currentServer = globalConf.defaultServer;
	curiosityObj.info.serverList = [];
	
	// Index Informations
	curiosityObj.info.selectedIndex = "";
	curiosityObj.info.indexList = [];
	curiosityObj.info.aliases = [];

	// Information to save in context
	curiosityObj.serverInfo = {};
	curiosityObj.serverInfo.server = curiosityObj.info.currentServer;
	curiosityObj.serverInfo.index = curiosityObj.info.selectedIndex;

	moduleManager.registerModuleBlock("rigth-column");
	moduleManager.registerModuleBlock("left-column");
	moduleManager.registerModuleBlock("content");
	moduleManager.registerModule("context", "template/context/context_selector.html", "rigth-column");
	moduleManager.registerModule("logs", "template/log/logConsole.html", "rigth-column");
	moduleManager.registerModule("diary", "template/diary/diary.html", "rigth-column");
	moduleManager.registerModule("aggResult", "template/aggregation_tab/aggregation_result_sub_tab.html", "left-column")
	moduleManager.registerModule("request", "template/request_module/request_module.html", "content");

	/** 
	* connectToServer : Etablish connection to an elasticSearch server 
	* @param url : string, server's url
	* @param addServer : boolean, if true the url will be added to server list and save in conf index
	* @param index to select rigth after the connection is etablish
	*/
	curiosityObj.connectToServer = function(url, addServer, index) {
		if (typeof(url) === "undefinded" ||  url == "")
			return ;
		var serverUrl = url + '/_aliases';
		curiosityObj.info.loading = true;
		curiosityObj.info.aliases = [];
		$http({method: 'GET', url: serverUrl}).
		success(function(data) {
			curiosityObj.info.loading = false;
			curiosityObj.info.connected = true;
			curiosityObj.info.indexList = Object.keys(data);
			if (addServer) {
				conf.addServerToConf(url);
			}
			curiosityObj.info.currentServer = url;
			globalConf.curentServer = url;
			getAlias(data);
			$rootScope.$broadcast("ServerChange");
			curiosityObj.info.err = false;
			log.log("Connection to \'" + url + "\' success", "success");
			if (typeof(index) !== "undefined" && index != curiosityObj.info.selectedIndex) {
				curiosityObj.info.selectedIndex = index;
				curiosityObj.selectIndex();
			}
		}). error(function() {
			curiosityObj.info.loading = false;
			curiosityObj.info.connected = false;
			curiosityObj.info.err = true;
			log.log("Unable to contact the server : \'" + url + "\'", "danger"); 
		});
	}

	curiosityObj.init = function () {
		context.init();
	}

	/** 
	* selectIndex : Function call every time an index is selected. Broadcast an event "IndexChange"  
	*/
	curiosityObj.selectIndex = function() {
		$rootScope.$broadcast("IndexChange");
		log.log("Index \'" + curiosityObj.info.selectedIndex+ "\' selected", "info");
	}

	/**
	* load : set the value of loading (boolean)
	* @param bool : the new value of loading
	*/
	curiosityObj.load = function(bool) {
		curiosityObj.info.loading = bool;
	}

	/**
	* addError : add an error to the error list, and set the boolean err to true 
	* @param errMessage : the error message
	*/
	curiosityObj.addError = function (errMessage) {
		curiosityObj.info.err = true;
		curiosityObj.info.errMessage = errMessage;
	}

	/**
	* stopError : set the boolean err to false
	*/
	curiosityObj.stopError = function () {
		curiosityObj.info.err = false;
	}

	/**
	* switchTab : set the tab
	* @param tab : the new value
	*/
	curiosityObj.switchTab = function(tab) {
		curiosityObj.info.tab = tab;
	}

	// Context event	
	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("curiosity", curiosityObj.serverInfo);
		if (typeof(curiosityObj.serverInfo.server) !== "undefined" && curiosityObj.serverInfo.server != "" && curiosityObj.info.currentServer != curiosityObj.serverInfo.server) {
			if (typeof(curiosityObj.serverInfo.index) !== "undefined") {
				curiosityObj.connectToServer(curiosityObj.serverInfo.server, false, curiosityObj.serverInfo.index)
			}
			else {
				curiosityObj.connectToServer(curiosityObj.serverInfo.server);
			}
		}
		else if (typeof(curiosityObj.serverInfo.index) !== "undefined"){
			curiosityObj.info.selectedIndex = curiosityObj.serverInfo.index;			
			curiosityObj.selectIndex();
		}
	}) 

	$rootScope.$on("UpdateContext", function () {
		curiosityObj.serverInfo.server = curiosityObj.info.currentServer;
		curiosityObj.serverInfo.index = curiosityObj.info.selectedIndex;
		context.setContextInformation("curiosity", curiosityObj.serverInfo);
	})

	// Index alias func
	function  addAlias(obj) {
		if (typeof(obj.aliases) !== "undefined") {
			for (key in obj.aliases) {
				var i = 0;
				var add = true
				while (i < curiosityObj.info.aliases.length) {
					if (curiosityObj.info.aliases[i] == key) {
						add = false;
						break;
					}
					i++;
				}
				if (add) {
					curiosityObj.info.aliases.push(key);
				}
			}
		}
	}

	function getAlias(data) {
		var i = 0;
		for (key in data) {
			addAlias(data[key]);
			i++;
		} 
	}

	return (curiosityObj);
});