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

Install (on a web server)
===========

Curiosity hasn't external dependency. There is nothing to install. You just have to clone the git repository or uncompress the archive where you want. 
Then you have to modify few values in conf.js located at the folder root.

* "defaultServer" : The default server where curiosity will work
* "confServer" : The server where curiosity will store its data (keywords, context, template, ...)
* "confIndex" : The index in confServer where curiosity will store his data

Then open index.html. Let curiosity initializes its data (about 5 or 10 secondes) and reload the page. You are now ready to use curiosity. 
Note : If you don't run curiosity on a web server then use firefox instead of chrome because of the same origin policy.


Install (as a plugin site on Elasticsearch)
=================

Another way of installing Curiosity is by using the site plugin feature of Elasticsearch (makes use of netty to serve static content).

This method will help to solve _cross-domain http issues_ with recent versions of Elasticsearch (1.4+).

1. Go to your elasticsearch's bin subdirectory
2. Install Curiosity as a site plugin (from github) :
> ./plugin -install pagesjaunes/curiosity
3. Edit ../plugins/curiosity/\_site/conf.js (see § install on a web server)
4. Go to http://HOSTNAME:PORT/_plugin/curiosity/

How To Contribute
=================
If you get interet in this project, help us increasing its features. Here is how to do !

1. Clone the repo
> git clone https://github.com/pagesjaunes/curiosity.git

2. Switch to the develop-1 branch
> git checkout develop-1

3. Edit the code, commit your changes

4. Push your commit to github
> git push origin develop-1

It will be visible in github as "pull request". Once a month at least, we review all the incomming requests, test and eventually merge them with the master branch. Then a new tag is set on it.

Thanks for your interest !

Documentation
=============

[Curiosity's Documentation](http://pagesjaunes.github.io/curiosity/)

Contact
=======

If you have any question about curiosity you can contact Erwan PIGNEUL and Fabrice DEPAULIS : epigneul@pagesjaunes.fr / fdepaulis@pagesjaunes.fr

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
