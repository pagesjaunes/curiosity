Curiosity.factory('diary',function($rootScope, context){
	diaryObj = {};
	diaryObj.info = {};
	diaryObj.info.txt = "";
	diaryObj.info.hide = false;
	
	diaryObj.init = function () {
		context.registerModule("diary", diaryObj);		
	}

	diaryObj.load = function (obj) {
		for (key in obj) {
			diaryObj.info[key] = obj[key];
		}
	}

	diaryObj.store = function () {
		return (diaryObj.info);	
	}

	return (diaryObj);
});