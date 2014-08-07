Curiosity.factory('log', function(){
	var logObj = {};
	logObj.info = {};
	logObj.info.logList = []; 
	
	logObj.init = function () {

	} 

	logObj.log = function(value, type) {
		var date = new Date;
		logObj.info.logList.unshift({"value":value,"type":type, "date":date});			
	}

	logObj.delete = function (index) {
		logObj.info.logList.splice(index, 1);
	}

	logObj.clean = function () {
		logObj.info.logList = [];	
	}

	return (logObj);	
});

