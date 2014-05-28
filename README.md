# Curiosity 

## Overview

Curiosity is a tool used to discover data in elasticsearch's index. 
User can :
	  -Search data in an elasticsearch index 
	  -Add keyword wich represents a query or a part of a query
	  -Built and use template for the result list
	  -Make and use aggregations
	  -Export your result  

## Summary 
   * Installation procedure
   *

## Installation procedure 

You just need a recent browser to run curiosity. The application is able to work alone without any service.
If you want to use full curiosity's possibilities (templating, keyword) you have to specify an elasticsearch server where all data will be store.
To do that open the file conf.js located in the root folder.
There is few line that you can modifie :        
      "defaultServer" :  The server that you will connect automaticly every time you launch the application
      "confServer" : The server in all curiosity's data will be strore.
      "confIndex" : The indice in the confServer where curiosity data's will be store. If i doesn't exist then it will be automaticly create and initialized.
You should not modifie the other value, unexpected behaviour could result.

After that open index.html, if it's the first time that you launch the application then !!! reload !!! the page to 

