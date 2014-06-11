Curiosity.factory('diary',function($rootScope, context){
	diaryObj = {};
	diaryObj.info = {};
	diaryObj.info.txt = "";
	diaryObj.info.hide = false;

	// Context event
	$rootScope.$on("ContextLoaded", function () {
		context.setModuleInformation("diary", diaryObj.info);
	});

	$rootScope.$on("UpdateContext", function () {
		context.setContextInformation("diary", diaryObj.info);
	});
	return (diaryObj);
});