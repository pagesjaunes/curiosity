/**
* @desc keyword service, manage keyword list, addition, deletion 
*/
Curiosity.factory('keyword', function($rootScope, conf){
	var keywordObj = {};
	var keywordArray  = [];

	keywordObj.init = function (){
		keywordObj.update();
	}

	/**
	* @desc find the index indice on the index list  
	* @param string name index's name to find	
	* @return index indice if found, -2 instead
	*/
	function findIndexByName(name) {
		var i = 0;
		while (i < keywordArray.length) {
			if (keywordArray[i].index == name ) {
				return (i);
			}
			i++;
		}
		return (-2)
	}

	/**
	* @desc update from conf document the keyword array  
	*/
	keywordObj.update = function (){
		keywordArray = conf.getConfDocument("keyword").keywords;
	}

	/**
	* @desc find's index keywords
	* @param string index index's name   
	*/
	keywordObj.getIndex = function (index) {
		var result = findIndexByName(index);
		if (result < 0 || typeof(keywordArray[result]) === "undefined"){
			return ([]);
		}
		return (keywordArray[result]);
	}

	/**
	* @desc modify index specifique keywords array in confdoc and store the document in es 
	* @param string index index's name   
	* @param array data new index's data 
	*/
	keywordObj.saveIndex = function (index, data) {
		// delete space 
		var i = 0; 
		while  (i < data.length) {
			data[i].label = data[i].label.replace(/ /g, "");
			i++;
		}
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
			$rootScope.$broadcast("KeywordUpdate");
		}
	}

	/**
	* @desc get the index keyword list and add to this array globals keywords 
	* @param string index index's name   
	* @return the final keyword array 
	*/
	keywordObj.getKeywordListFromIndex = function (index) {
		var curentKeyword = findIndexByName(index);
		var result = [];
		if (curentKeyword >= 0){
			result = keywordArray[curentKeyword].keywords;
		}
		curentKeyword = findIndexByName("global");
		if (curentKeyword >= 0){
			result = result.concat(keywordArray[curentKeyword].keywords);
		}
		return(result);
	}

	/**
	* @desc Find all keywords that begin  by "word" in a specified index
	* @param index the index to browse
	* @param word the word to find
	* @return an array which contains all keyword found.
	*/
	keywordObj.getKeywordListFromIndexFilter = function (index, word) {
		var result = new Array ;
		var i = 0;
		var tmp = escapeRegExp(word)
		var re = new RegExp("^" + tmp + ".*");
		var curentKeyword = keywordObj.getKeywordListFromIndex(index);
		while (i < curentKeyword.length){
			if (re.test(curentKeyword[i].label))
				result.push(curentKeyword[i])
			i++;
		}
		return (result);
	}

	/**
	* @desc Add a keyword in an index, then send the document to elasticsearch
	* @param object keyword keyword to add   
	* @param string index index's name where to add the keyword
	*/
	keywordObj.addKeywordInIndex = function(keyword, index) {
		if (index == "") {
			index = "global";
		}
		var indice = findIndexByName(index);
		if (indice >= 0) {
			keywordArray[indice].keywords.push(keyword);	
		}
		else {
			keywordArray.push({"index":index, "keywords":[keyword]})
		}
		conf.sendConfDocument("keyword");
		$rootScope.$broadcast("KeywordUpdate");
	}

	return (keywordObj);
})