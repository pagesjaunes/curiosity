Overview 
========

Curiosity a is tool developed by ["Pages Jaunes"](http://www.pagesjaunes.fr/) which is used to browse elasticSearch's data in a simple and intuivive way.
If you want more information and screenshot refer to [Curiosity's Documentation](http://pagesjaunes.github.io/curiosity/).
The current version is a preview of the next release, which will occure i hope next week (07/21/2014). If you want a more stable version download 0.1.3 tag.

=======
Main curiosity's functionality are : 

* Keywords system
* Result templating 
* Simple system to built complex aggregations
* Result Export
* Research Context

Install 
===========

Curiosity hasn't external dependency. There is nothing to install. You just have to clone the git repository or uncompress the archive where you want. 
Then you have to modify few values in conf.js located at the folder root.

* "defaultServer" : The default server where curiosity will work
* "confServer" : The server where curiosity will store its data (keywords, context, template, ...)
* "confIndex" : The index in confServer where curiosity will store his data

Then open index.html. Let curiosity initializes its data (about 5 or 10 secondes) and reload the page. You are now ready to use curiosity. 
Note : If you don't run curiosity on a web server then use firefox instead of chrome because of the same origin policy.

Documentation
=============

[Curiosity's Documentation](http://pagesjaunes.github.io/curiosity/)

Contact
=======

If you have any question about curisity you can contact Erwan PIGNEUL and Fabrice DEPAULIS : epigneul@pagesjaunes.fr / fdepaulis@pagesjaunes.fr

Initial dev is the work of Arthur BABEY : 	arthur.babey@epitech.eu (many thanks Arthur)

# Informations

Cursiosity use many librairies and plugins, thanks to all of their contributors. We highly encourage you to visit and stars their github (ours too :)).

* [elasticsearch](https://github.com/elasticsearch/elasticsearch)
* [AngularJS](https://github.com/angular/angular.js)
* [bootstrap](https://github.com/twbs/bootstrap)
* [elastic.js](https://github.com/fullscale/elastic.js)
* [AngularUI](http://angular-ui.github.io/)
* [FileSaver](https://github.com/eligrey/FileSaver.js/)
* [D3](https://github.com/mbostock/d3)
* [nvd3](https://github.com/novus/nvd3)
