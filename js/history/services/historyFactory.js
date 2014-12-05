/**
 * Provides an object that manages and hold the history
 * of the search queries in the user cookie.
 */
Curiosity.factory('history', function($cookieStore){

	historyObj = {};
	historyObj.info = {};
	historyObj.info.queries = []; // List of queries

	/**
	 * Adds a query (simplified + complex forms)
	 * to the list of queries.
	 */
	historyObj. = function(pQuerySimple, pQueryComplex){
		this.info.queries.push({'name':pQuerySimple, 'query':pQueryComplex});
	};

	return historyObj;

});