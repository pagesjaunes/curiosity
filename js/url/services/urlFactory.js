Curiosity.factory('url', function($location){
	var urlObj = {};

	urlObj.addData = function (attr, data) {
		$location.search(attr, data);
	}

	urlObj.addDataFromObj = function (object) {
		for (key in object) {
			urlObj.addData(key, object[key]);		
		}
	}
	
	urlObj.delData = function (attr) {
		$location.search(attr, null); // $location.$search with null as seconde parameter remove the attrbute	
	}

	urlObj.delDataFromObj = function (obj) {
		for (key in obj) {
			urlObj.delData(key);
		}		
	}

	urlObj.getData = function (attr) {
		return ($location.search()[attr]);
	}	

	urlObj.dataToObj = function (obj) {
		for (key  in obj) {
			obj[key] = urlObj.getData(key);
		}
	}
	
	return (urlObj);
});