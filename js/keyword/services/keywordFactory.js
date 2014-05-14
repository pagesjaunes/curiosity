Curiosity.factory('keyword', function(conf){
	var keywordObj = {};
	var keywordArray  = [];

	function findIndexByName(name) {
		var i = 0;
		while (i < keywordArray.length) {
			if (keywordArray[i].index == name ) {
				return (i);
			}
			i++;
		}
		return (-1);
	}

	keywordObj.update = function (){
		keywordArray = conf.getConfDocument("keyword").keywords;
	}

	keywordObj.getIndex = function (index) {
		var result = findIndexByName(index);
		if (result < 0){
			return ([]);
		}
		return (keywordArray[result]);
	}

	keywordObj.saveIndex = function (index, data) {
		var confIndice = conf.getConfDocumentIndice("keyword");
		if (confIndice >= 0) {
			var curIndex = findIndexByName(index);
			if (curIndex >= 0) {
				gConf[confIndice]._source.keywords[curIndex].keywords = data;
			}
			else {
				gConf[confIndice]._source.keywords.push({"index":index, "keywords":data});
			}
			conf.sendConfDocument("keyword");
		}
	}

	return keywordObj;
})