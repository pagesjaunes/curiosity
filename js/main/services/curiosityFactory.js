Curiosity.factory('curiosity', function($http, $rootScope, conf){
	var curiosityObj = {};
	curiosityObj.info = {};

	// General informations
	curiosityObj.info.version = globalConf.version;
	curiosityObj.info.tab = 1;
	curiosityObj.info.loading = false;
	curiosityObj.info.err = false;
	curiosityObj.info.errList = [];
	curiosityObj.info.log = [];
	curiosityObj.info.txt = global_text;
	
	// Server Informations 
	curiosityObj.info.currentServer = globalConf.defaultServer;
	curiosityObj.info.serverList = [];
	
	// Index Informations
	curiosityObj.info.selectedIndex = "";
	curiosityObj.info.indexList = [];
	curiosityObj.info.aliases = [];

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

	/** 
	* connectToServer : Etablish connection to an elasticSearch server 
	* @param  url : string, server's url
	* @param  addServer : boolean, if true the url will be added to server list and save in conf index
	*/

	curiosityObj.connectToServer = function(url, addServer) {
		if (typeof(url) === "undefinded" ||  url == "")
			return ;
		var serverUrl = url + '/_aliases';
		curiosityObj.info.loading = true;
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
		}). error(function() {
			curiosityObj.info.loading = false;
			curiosityObj.info.connected = false;
			curiosityObj.info.err = true;
			curiosityObj.log("error", "Unable to contact the server : " + url); 
		});
	}

	curiosityObj.log = function (type, message) {
		curiosityObj.info.log.push({"type":type, "message":message});
	}

	//curiosityObj.connectToServer(curiosityObj.info.currentServer, false);

	/** 
	* selectIndex : Function call every time an index is selected. Broadcast an event "IndexChange"  
	*/
	curiosityObj.selectIndex = function() {
		$rootScope.$broadcast("IndexChange");
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

	return (curiosityObj);
});