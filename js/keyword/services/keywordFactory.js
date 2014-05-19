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
		if (result < 0 || typeof(keywordArray[result]) === "undefined"){
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


	keywordObj.getKeywordListFromIndex = function (index) {
		var curentKeyword = findIndexByName(index);	
		if (curentKeyword < 0){
			return ([]);
		}
		return(keywordArray[curentKeyword].keywords);
	}


	/**
	* getKeywordListFromIndexFilter
	* Find all keywords that begin  by "word" in a specified index
	* @param index : the index to browse
	* @param word : the word to find
	* @result: an array which contains all keyword found.
	*/
	keywordObj.getKeywordListFromIndexFilter = function (index, word) {
		var result = new Array ;
		var i = 0;
		var re = new RegExp("^" + word + ".*");
		var curentKeyword = keywordObj.getKeywordListFromIndex(index);
		while (i < curentKeyword.length){
			if (re.test(curentKeyword[i].label))
				result.push(curentKeyword[i])
			i++;
		}
		return (result);
	}
	return (keywordObj);
})