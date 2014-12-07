/**
 * Provides an object that manages and hold the history
 * of the search queries in the user cookie.
 */
// Curiosity.factory('history', function(){
Curiosity.factory('history', function($cookieStore){

	historyObj = {};
	historyObj.info = {};
	historyObj.info.queries = $cookieStore.get('curiosity_queries'); // List of queries

	/**
	 * Adds a query (simplified + complex forms)
	 * to the list of queries.
	 *
	 * @param pQuery Simplified form of the query
	 */
	historyObj.addQuery = function(pQuery){
		// Get queries from the cookie
		cookie_queries = $cookieStore.get('curiosity_queries');

		if (cookie_queries === undefined){
			cookie_queries = [];
		}
		if (cookie_queries.indexOf(pQuery) < 0){
			cookie_queries.unshift(pQuery);
			if (cookie_queries.length > 20){
				cookie_queries.pop();
			}
			$cookieStore.put('curiosity_queries',cookie_queries);
			this.info.queries = cookie_queries;
		}
	};

	return historyObj;

});