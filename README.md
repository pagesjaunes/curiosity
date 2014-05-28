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
   * Basic functionallity
     * First Steps
     * Simple search
     * Keywords
     * Template

## Installation procedure 

   You just need a recent browser to run curiosity. The application is able to work alone without any service.
If you want to use full curiosity's possibilities (templating, keyword) you have to specify an elasticsearch server where all data will be store.
To do that open the file conf.js located in the root folder.
There is few line that you can modifie :        
      * "defaultServer" :  The server that you will connect automaticly every time you launch the application
      * "confServer" : The server where all curiosity's data will be strore.
      * "confIndex" : The index  the confServer where curiosity data's will be store. If i doesn't exist then it will be automaticly create and initialized.
You should not modifie the other value, unexpected behaviour could result.
After that open index.html, if it's the first time that you launch the application wait 10 sec till conf documents were initialize on the server then reload the page.
Now you are ready to use Curiosity.

## Basic Functionality
    
### First Steps
    
    The first thing you have to do when you launch curisosity is to select the server and the index you want to work on. On the top of your screen there is two field that you can fill. The field server is the right one. You can select a server alredy saved or add a new server. To do that hit the button "New server" then add the url of your elasticsearh server. Try to connect. If it works button's color will be green if it don't it will be red. If connection is etablish between you and the server, curiosity will load server's index list. After that you can choose your index in the second field.

### Simple Search 
