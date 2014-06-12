Overview 
========

Curiosity is tool developed by ["Pages Jaunes"](http://www.pagesjaunes.fr/) which is used to browse elasticSearch's data in a simple an intuivive way.

Main curiosity's functionality are : 

* Keywords system

* Result templating 

* Simple system to built complex aggregations

* Result Export

* Research Context

Summary
=======

* Instalation 

* First step

* Advanced user

Instalation 
===========

Curiosity hasn't external dependency. There is nothing to install. You just have to clone git repository or uncompress the archive where you want. 
Then you have to modify few values in conf.js located at the folder root.

* "defaultServer" : The default server where curiosity will work

* "confServer" : The server where curiosity will store his data (keywords, context, template, ...)

* "confIndex" : The index in confServer where curiosity will store his data

After that, open index.html. Wait a moment (about 5 or 10 seconde) untill curiosity initialize his data then reload the page. You are now ready to use curiosity.

First step
==========

Advanced user 
=============

Copyright and License
=====================

    Curiosity - BigData Explorer
    Copyright (C) 2013  Fabrice Depaulis for PagesJaunes

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.