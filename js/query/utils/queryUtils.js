/**
* escapeRegExp 
* escape many characters in a string to built a good regexp from user input
* @param str : the string to escape
* @return :  the escaped string
*/

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

//interpret.js

var wordToIgnore = ["and", "or", "AND", "OR", "NOT","!",  ")"];

var globalKeywords = [{"label":"et", "value":"AND"}, 
						{"label":"ET", "value":"AND"},
						{"label":"and", "value":"AND"},
						{"label":"ou", "value":"OR"},
						{"label":"OU", "value":"OR"},
						{"label":"or", "value":"OR"},
						{"label":"NON", "value":"NOT"},
						{"label":"non", "value":"NOT"},
						{"label":"not", "value":"NOT"} ]

/**
* checkWordToIgnore
* Check if the string passed in params is in the global array wordToIgnore
* @param string : the string to check
* @return : true if the string is in wordToIgnore, false instead
*/
function checkWordToIgnore(string){
	var i = 0;
	while (i < wordToIgnore.length) {
		if (string == wordToIgnore[i]) {
			return (true);
		}
	  	i++;
	}
	return (false);
}

/**
 * checkKeyWord 
 * Search in a keyWord array the keyWord if one of them match with a string
 * If one match the function return his Value
 * @param keyWords : keyWords array
 * @param string : string to match
 */
function checkKeyWord(keyWords, string){
	for (var i = keyWords.length - 1; i >= 0; i--) {
		if (keyWords[i].label == string){
			return (keyWords[i].value);
		}
	};
	return ("");
}

/*
* splitRequest 
* Split a request in sub request. Manage "" and ()
* @param keywords : keywords array
* @param string : the string to split
* @result : an array which represent the request ?reviewed?
*/
function splitRequest(keywords , string)
{
	var stringSplitComa = string.split("\"");
	var result = [];
	var i = 0;
	while (i < stringSplitComa.length){
		if (i % 2) {
			result.push("\"" + stringSplitComa[i] + "\"");
		}
		else {
			result = result.concat(interpret(keywords, stringSplitComa[i]));
		}
		i++;
	} 
	return (result);
}

/**
* interpret 
* Built a querry string from a simplfified request.
* @param keyWords : keyWords array
* @param request : string array which represent the simplified request
*/
function interpret(keyWords, request){
	splitedRequest = request.split(" ");
	splitedRequest = cleanEmptyWords(splitedRequest);
	// TODO : check if it is usefull
	for (var i = splitedRequest.length - 1; i >= 0; i--) {		
		var res = checkKeyWord(keyWords, splitedRequest[i]); 
    	if (res != "") {
			splitedRequest[i] = '(' + res + ')';
		}
		else {
			var res = checkKeyWord(globalKeywords, splitedRequest[i]); 
    		if (res != "") {
				splitedRequest[i] =  res;
			}
		}
	};
	return (splitedRequest);
}

/**
* builtIndexList 
* Create an array which contain the list of index of a server
* @param data : json object which contain the index list
*/
function builtIndexList(data)
{
	var i = 0;
	var result = new Array();
	while (i < data.length)
	{
		result.push(data[i]);
		i++;
	}
	return (result);
}

/**
* getLastWord
* Return the last word of a string
* @param string : the string where to find the last word
* @return : the last word, an empty string instead
*/
function getLastWord(string)
{
	var tab = string.split(" ");
	if (string.length > 0 && string.charAt(string.length - 1) == " ") {
		tab.push("");
	}	
	if (tab.length) {
		return  (tab[tab.length - 1]);
	}
	return ("");
}

/**
* keyWordFilter
* filtre a key word array
* @param array : array to filter 
* @param string : the string on which is base the filter
* @return : an array which contain onli keyWords which have a label containing string  
*/
function keyWordFilter(array, string)
{
	var result = new Array();
	var i = 0;
	string = escapeRegExp(string);
	var re = new RegExp("^" + string + ".*")
	while (i < array.length){
		if (re.test(array[i].label)) {
			result.push(array[i]);
		}
		i++;
	}
	return (result);
}

/**
* fieldFilter
* filtre a key word array
* @param array : array to filter 
* @param string : the string on which is base the filter
* @return : an array which contain onli keyWords which have a label containing string  
*/
function fieldFilter(array, string){
	var result = new Array();
	var i = 0;
	string = escapeRegExp(string);
	var re = new RegExp("^" + string + ".*")
	while (i < array.length){
		if (re.test(array[i].name)) {
			result.push(array[i]);
		}
		i++;
	}
	return (result);
}

/**
* cleanEmptyWords
* Delete empty words from an array of strings 
* @param array : the array to clean
* @result : the array without empty words
*/
function cleanEmptyWords(array)
{
	var i = 0;
	var result = new Array();
	while (i < array.length) {
		if (array[i] != "") {
			result.push(array[i]);
		}
		i++;
	}
	return (result);
}