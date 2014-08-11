/*
* @desc service in charge of csv construction 
* !!! Every function about csv construction from aggregation will be updated Soon because of the new aggregations system
*/
Curiosity.factory('csv', function($rootScope, mapping, curiosity, query){
	var csvObj = {};
	
	csvObj.info = {}; // Shared data with controller
	csvObj.info.loadingData = false; // false : do nothing, true : fetching data
	csvObj.info.loadingPercent = 0; // Percent of data loaded
	csvObj.info.buildingPercent = 0; // Percent of data compiled
	csvObj.info.sep = ','; // Columm separator
	csvObj.info.tabSep = ';'; // Multi value colum sep
	csvObj.info.nbResult = 1000; // Result to fetch 
	csvObj.info.state = ""; // Curent State of the factory

	var csvHeader = [];
	var currentDownload = {working:false}; // Object witch contains all data bout the curent download

	/**
	* @desc Update working field from mapping service
	*/
	csvObj.updateField = function () {
		csvObj.info.fields = mapping.info.fields; 
	}

	/**
	* @desc setField
	*/
	csvObj.setField = function (fields) {
		csvObj.info.fields = fields;
	} 

	/**
	* @desc Built a csv file from an result list
	*/
	csvObj.builtCsvFromResult = function(objList, attr, fields) {
		fields = builtAttributeArrayFromField(csvObj.info.fields);
		csvObj.info.result = csvHeader.join(csvObj.info.sep) + "\n";
		csvObj.info.result += builtCsv(objList, fields, csvObj.info.sep, "_source");
		csvObj.info.buildingPercent = 0;
		exportCsvFile('result.csv',[csvObj.info.result]);
	}

	/**
	* @desc Get all result about our current query from es server then built a csv
	*/
	csvObj.getFullResult = function () {
		if (query.info.hits != 0) {
			initLoading(query.info.hits);
		}
	} 

	/**
	* @desc Get a number of result defined by csvObj.info.nbResult result about our current query from es server then built a csv
	*/
	csvObj.getSomeResult = function () {
		if (query.info.hits != 0) {
			initLoading(csvObj.info.nbResult);
		}
	}

	/** 
	* builtCsvFromAgg
	* Built a csv file from an aggregation
	*/
	csvObj.builtCsvFromAgg = function(agg, fields) {
		if (agg.agg.nested) {
			builtCsvFromBucketAgg(agg, fields);
		}
		else {
			builtCsvFromMetricAgg(agg, fields)	
		}
	}

	/**
	* @desc Create the csv dowloadable file 
	* @param string fileName result file's name
	* @param string content result file"s content
	*/
	function exportCsvFile(fileName, content) {
		var blob = new Blob(content, {type: "text/csv"});
		saveAs(blob, fileName);
		$rootScope.$broadcast("CsvDone");		
	}

	/** WILL BE UPDATED SOON
	* @desc built a csv file from a metric aggregation (avg, stats, ...)
	* 
	*/
 	function builtCsvFromMetricAgg(agg, fields)  {
		tmpFields = builtAttributeArrayFromField(fields);
		csvObj.info.result = csvHeader + "\n";
		csvObj.info.result += builtCsv([agg], tmpFields, csvObj.info.sep);
		csvObj.info.buildingPercent = 0;
		exportCsvFile('export_' + agg.agg.name + '.csv', [csvObj.info.result]);
	}

	/** WILL BE UPDATED SOON
	* builtCsvFromBucketAgg
	* built a csv file from a metric aggregation (avg, stats, ...)
	*/
	function builtCsvFromBucketAgg(agg, fields) {
		var tmpFields = builtAttributeArrayFromField(fields);
		var tmp = builtCsvFromBucketAgg2(agg, tmpFields, csvObj.info.sep);
		tmpFields = tmpFields.concat(tmp.subFields);
		var  i = 0;
		while (i < tmpFields.length) {
			tmpFields[i] = tmpFields[i].join('.');
			i++;
		}
		tmpFields = tmpFields.join(csvObj.info.sep) + '\n';
		csvObj.info.result = tmpFields;
		csvObj.info.result += tmp.subResult.join('\n');
		csvObj.info.buildingPercent = 0;
		exportCsvFile('export_' + agg.agg.name + '.csv', [csvObj.info.result]);
	}

	// WILL BE UPDATED SOON
	function builtSubCsvAgg(agg, line, sep, size) {
		var subFields = aggregation.builtAggregationField(agg);	
		subFields = builtAttributeArrayFromField(subFields);
		var subResult = builtCsvFromBucketAgg2(agg, subFields, sep);	
		subFields = subFields.concat(subResult.subFields);
		subResult = subResult.subResult;
		var emptyField  = "";
		var i = 0;
		while( i  < size) {
			emptyField += sep;
			i++;
		}
		i = 0;
		while (i < subResult.length) {
			subResult[i] = line + emptyField + sep + subResult[i]; 
			i++;
		}
		return ({"subFields":subFields,"subResult":subResult});
	}

	// WILL BE UPDATED SOON
	function builtCsvFromBucketAgg2 (agg, fields, sep) {
		var result = [];
		var subFields = [];
		if (agg.agg.nested) {
			var i = 0;
			var end = true;
			while (i < agg.buckets.length) {
				var line = builtLine(agg.buckets[i], fields, sep, false);
				subFields = [];
				for (key in agg.buckets[i]) {
					if (aggregation.isBucketAgg(key, agg.buckets[i][key])) {
						var subResult = builtSubCsvAgg(agg.buckets[i][key], line, sep, subFields.length);
						result = result.concat(subResult.subResult);
						subFields = subFields.concat(subResult.subFields);
						end = false;
					}
				}
				if (end) {
					result.push(line);
				}
				i++;
			}
		}
		return ({"subResult":result, "subFields":subFields});
	} 

	/**
	* builtAttributeArrayFromField
	* Generate an array which contains array equal to the way to each field of a json object  
	* @param field : a field array gave by mapping service
	* @return : string [][]
	*/
	function builtAttributeArrayFromField(field) {
		result = [];
		csvHeader = [];
		var i = 0;
		while (i < field.length) {
			if (typeof(field[i].hide) === "undefined" || !field[i].hide) {
				result.push(field[i].ancestor.split('.'));
				if (typeof(field[i].alias) != "undefined" && field[i].alias != ""){
					csvHeader.push(field[i].alias);
				}
				else {
					csvHeader.push(field[i].ancestor);	
				}
			}
			i++;
		}
		return (result);
	}
	
	/**
	* @desc Recursive function which get the value of an object attribute.
	* @param obj : the object to browse
	* @param field : an array which represent the way to the value wanted 
	* @param idx : the current position in field array
	* @return : the value if found, empty string instead
	*/
	function getValue(obj, field, idx) {
		var objTmp = obj[field[idx]];
		idx++;
		if (idx == field.length)
			return (objTmp);
		else if (typeof(objTmp) === "undefined" || objTmp === null) {
			return ("");
		}
		else if (objTmp instanceof Array){
			var i = 0;
			var result = "";
			while (i < objTmp.length) {
				if (i > 0) {
					result += csvObj.info.tabSep;
				}
				result += getValue(objTmp[i], field, idx);
				i++;
			}
			return (result);
		}
		return (getValue(objTmp, field, idx));
	}

	/**
	* @desc built a csv line by getting all wanted attribute of an object
	* @param obj : the object to represent
	* @param fields : the array representation of the object
	* @param sep : the separator between each colums 
	*/	
	function builtLine(obj, fields, sep, lineRet, attr) {
		var result = "";
		var i = 0;
		tmpObj = obj;
		if (typeof(attr) !== "undefined") {
			tmpObj = obj[attr];
		}
		while (i < fields.length) {
			if (i > 0) {
				result += sep;
		}
		result+= "\"" + getValue(tmpObj, fields[i], 0) + "\""
		i++;
		}
		if (lineRet){
			result += "\n"
		}
		return (result);
	}	

	/**
	* @desc built a csv file by getting all wanted attribute of all object in a list
	* @param objList : the list of object
	* @param fields : the array representation of objects
	* @param sep : the separator between each colums 
	*/
	function builtCsv(objList, fields, sep, attr) {
		var result = "";
		var i = 0;
		while (i < objList.length){
			result += builtLine(objList[i], fields, sep, true, attr); 
			csvObj.info.buildingPercent = Math.floor(i / objList.length * 100);
			i++;
		}
		return (result);
	}

	/**
	* @desc Create the dowload object from query and curiosity service data and launch the first query on es
	* @param size the number of line wanted
	*/	
	function initLoading (size) {
		if (!currentDownload.working) {
			var tmp = query.info.jsonRequest;
			delete query.info.jsonRequest.aggs
			currentDownload = {
								working:true,
								idx:0,
							 	index:curiosity.info.selectedIndex,
							 	end:size,
							 	request:tmp,
								result:[],
								done:false
							}
			if (size > query.info.hits) {
				currentDownload.size = query.info.hits; 
			}
			csvObj.info.loadingPercent = 0;
			csvObj.info.loading = true;
			currentDownload.request.from(currentDownload.idx);
			currentDownload.request.size(1000);
			csvObj.info.state = "Fetching data";
			query.simpleSearch(currentDownload.request, currentDownload.index, fetchResultRec);
		}
	}

	/**
	* @desc Callback function which will concat all query result in an array and launch query till enough result were feteched from es
	* @param result : an array which contains last query result
	*/
	function fetchResultRec (result) {
		if (!currentDownload.done) {
			csvObj.info.loadingPercent = Math.floor(currentDownload.idx / currentDownload.end * 100) ;
			currentDownload.result = currentDownload.result.concat(result.hits.hits);
			if (currentDownload.idx >= currentDownload.end) {
				currentDownload.done = true;
				currentDownload.working = false;
				csvObj.info.loading = false;
				csvObj.info.state = "Building CSV";
				csvObj.builtCsvFromResult(currentDownload.result);
			}
			else {
				currentDownload.idx += 1000;
				currentDownload.request.from(currentDownload.idx);
				currentDownload.request.size(1000);
				query.simpleSearch(currentDownload.request, currentDownload.index, fetchResultRec)
			}
		}
	}

	return (csvObj);
})