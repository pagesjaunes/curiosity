//mappingCtrlUtils.js

function setAncestorDuo(ancestor, data, ancestorSep, func) {
	var result = new Array;

	for (key in data) {
		if (ancestor == "" )
			nAncestor = key;
		else
			nAncestor = ancestor + ancestorSep + key;
		nAncestor.__display__ = true;
		result.push(setAncestor(nAncestor, data[key], ancestorSep, func));
	}
	return (result);
}



/**
* setAncestor
* add an atribute in a json object for each of his nested object which represent his ancestors
* @param ancestor : previsous ancetor of the current object
* @param dat : object to browse
* @param ancestorSep : string to concatenate between each ancestor and his result 
* @param func :  function  to apply on each nested objet if specified
* @return the final object
*/
function setAncestor(ancestor, data, ancestorSep, func)
{
	var applyFunc = true;
	if (typeof(func) === 'undefined') {
		applyFunc = false;
	}
	if (typeof(data.properties) !== 'undefined') {
		setAncestorDuo(ancestor, 
					   	data.properties, 
						ancestorSep, 
						func)
	}
	if (typeof(data.fields) !== 'undefined') {
		setAncestorDuo(ancestor, 
					   	data.fields, 
						ancestorSep, 
						func)
	}
	data.ancestor = ancestor;
	if (applyFunc) {
		func(data);
	}
	return (data); 
}

/**	œ
* setAncestorDocuments
* Set ancestor properties for all document
*/
function setAncestorDocuments(data)
{
 	for (key in data){
 		setAncestor(key, data[key] , ".", setDisplay);
 	}
 }

/**
* builtFieldArray
* built the list of field which will be displayed after the request
* @param jObject : an json object
* @return : an array which represent the field to display
*/

function builtFieldArray(jObject)
{
	var result = new Array();

	if (typeof (jObject.properties) !== "undefined"){
		for (field in jObject.properties){
			if (typeof (jObject.properties[field].__display__) === "undefined" ||
				jObject.properties[field].__display__ == true) {
				if (typeof (jObject.properties[field].properties) === "undefined"){
					result.push(jObject.properties[field].ancestor.split(".").slice(1).join("."));
				}
				result = result.concat(builtFieldArray(jObject.properties[field]));
			}
		}
	}
	return (result);
}

function builtFullFieldArray(jObject)
{
	var result = new Array();

	if (typeof (jObject.properties) !== "undefined"){
		for (field in jObject.properties){
			if (typeof (jObject.properties[field].properties) === "undefined"){
				result.push({"name":field,"ancestor":
					jObject.properties[field].ancestor.split(".").slice(1).join(".")
					,"type":jObject.properties[field].type});
			}
			result = result.concat(builtFullFieldArray(jObject.properties[field]));
		}
	}
	if (typeof (jObject.fields) !== "undefined") {
		for (field in jObject.fields){
			if (typeof (jObject.fields[field].properties) === "undefined"){
				result.push({"name":field,"ancestor":
					jObject.fields[field].ancestor.split(".").slice(1).join(".")
					,"type":jObject.fields[field].type});
			}
			result = result.concat(builtFullFieldArray(jObject.fields[field]));
		}			
	}
	return (result);	
}

function builtFullFieldArrayDocuments(jObject)
{
	var result = new Array()

	for (doc in jObject) {
		result = result.concat(builtFullFieldArray(jObject[doc]));
	}
	return (result);
}

function builtFieldArrayDocuments(jObject)
{
	var result = new Array()

	for (doc in jObject) {
		result = result.concat(builtFieldArray(jObject[doc]));
	}
	return (result);
}

function setDisplay(jObject)
{
	jObject.__display__ = true;
}