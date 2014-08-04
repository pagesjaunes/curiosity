// elasticSearchJsFunf.js

Curiosity.factory("elasticFunc", function(log){
	return {
		
		/**
		* @desc Function which is used to handle elasticsearch error 
		*/
		"elasticsearchError" : function (error) {
			if (error) {
				console.error(error);
				log.log("Error :" + error.status, "danger")
			}
			else {
				log.log('Opération réussit', "success");
			}
		},

		/**
		* @desc create a new index on elasticsearch server designed by client 
		* @param client an elasticSearch.js client alredy initialised
		* @param indexName the name of the new index 
		* @param func callback function by default elasticearchError 
		*/
		"createIndex" : function (client, indexName, func) {
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.indices.create({index:indexName}, this.elasticsearchError);
		},

		/**
		* @desc delete an index on elasticsearch server designed by client 
		* @param client an elasticSearch.js client alredy initialised
		* @param indexName the name of the index to delete 
		* @param func callback function by default elasticearchError 
		*/
		"deleteIndex" : function(client, indexName, func) {
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.indices.delete({index:indexName}, this.elasticsearchError);
		},

		/**
		* @desc send document to an elasticsearch server
		* @param client elasticsearch js client
		* @param indexName the index name where to post the document
		* @param type document type
		* @param doc the document in json
		* @param id id of the document 
		* @param func callback function by default elasticearchError 
		*/
		"sendDocument" : function (client, indexName, type, doc, id, func) {
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.index({
				index:indexName,
				type:type,
				id:id,
				body: doc
			}, func)
		},
		/**
		* @desc get document on an elasticsearch server
		* @param client elasticsearch js client
		* @param indexName the index name where to post the document
		* @param type document type
		* @param id id of the document 
		* @param func callback function by default elasticearchError 
		*/
		"getDocument" : function (client, indexName, type, id, func) {
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.get({
				index:indexName,
				type:type,
				id:id
			}, func)
		},
		
		/**
		* @desc delete document on an elasticsearch server
		* @param client elasticsearch js client
		* @param indexName the index name where to delete the document
		* @param type document type
		* @param id id of the document 
		* @param func callback function by default elasticearchError 
		*/
		"deleteDocument" : function (client, indexName, type, id, func) {
			if (typeof(func) ==='undefined') {
				func = this.elasticsearchError;				
			} 
			client.delete({
				index:indexName,
				type:type,
				id:id
			}, func)

		},

		/**
		* @desc send a new document to an elasticsearch server (id auto)
		* @param client elasticsearch js client
		* @param indexName the index name where to post the document
		* @param type document type
		* @param doc the document in json
		* @param func callback function by default elasticearchError 
		*/
		"sendNewDocument" : function (client, indexName, type, doc, func) {
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.index({
				index:indexName,
				type:type,
				body: doc
			}, func)
		},


		/**
		* @desc Get the mapping of an elasticsearch index
		* @param client elasticsearch js client
		* @param indexName the index name where to post the document
		* @param type document type by default all
		* @param func callback function, by default elasticearchError 
		*/
		"getMapping" : function (client, indexName, func)
		{
			if (typeof(func) ==='undefined') 
				func = this.elasticsearchError;
			client.indices.getMapping({
				index:indexName,
			}, func);
		}
	};
})