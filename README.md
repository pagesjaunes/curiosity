Overview 
========

Curiosity is tool developed by ["Pages Jaunes"](http://www.pagesjaunes.fr/) which is used to browse elasticSearch's data in a simple and intuivive way.

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
    
    * Server and index selection 

    * First query 

* Advanced user

    * Results Template

    * Aggregations Template

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

## Server and index selection

When you arrive on curiosity you are directly connected to the default server defined in conf.js.If you want to :

* add a new server : just click on the new button present in the navbar near the server list then write your server's url and click on connect. If curiosity manage to reach the new server connect button will stay green, in the other case the button will be red. In case of success the new server will be added to curiosity's server list.

* select an existing server : just choose the server you want in the server list which is in the navbar on the top of your screen.   

The second list in the navbar is about index and alias. It will display every index and alias which are present on the current elasticSearch server. When you choose an index it will automaticly load its mapping. 

## First Query 

When you have choose your server and index you want to work on. You can direclty write a query. The syntax used is the elasticSearch [Query string query](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-dsl-query-string-query) syntax. 
For example :

```
description
```
This query will search in every document the string description.

```
"description"
```
This query will search the exact string "description" in every document.

```
description:"a simple example" 
```
This query will search the exact string  "a simple example" in the description field of every documents

You can use boolean operator too :

```
description:"a simple test" AND name:Test
```
This query will search the exact string "a simple example" in the description field and the string Test in the field name of every documents

There is many possibility like range, fuziness ect. Refer the elasticSearch documentation

Advanced user 
=============

## Result's Template

One of the main features of curiosity is the ability to template the result list the way that you want. There is a WYSIWYG editor that allow you to built the template that you want. But if you want more you can directly edit the html code and add AngularJS function in your result list. There is no limit onli your imagination.

On the template edition (customization tab in the navbar then template) you can create, edit and delete template. 
The template syntax is html + angular syntax. As bootstrap css is included in curiosity you can use bootstrap's class. By default a div with an ng-repeat attribute (every element in the div will be repeated for each result documents) is added automaticly when you create a new template. In the future we will add many snippets to help you to easyly built our template. For the moment you can display a field by clicking on its name in the panel on the right. The path to the field will be added to the document. 

A generic template which display first level document's information could be : 

```
<div ng-repeat="item in queryData.result.hits.hits">
    <div ng-repeat="(key, value) in item">
        <b>{{ key }} : </b> {{ value }}
    </div>
    <hr/>
</div>
```

We are working on few angular directives that will allow you for example to display your result on a map, or with an histogram. If you have idea about result templating just contact us maybe i could do something.

## Aggregation's Template 

Aggregation's template work like Result template but are a way harder to create. Go to the template tab then click on the aggregation template button. In this tab you can create, edit and delete template and define association between an aggreation type and a template.

Here is a complex example of a terms aggregation template. This template allow you to filter your query with bucket value: 

```
<div>
    <div class="panel panel-primary panel-request">
        <div class="panel-heading">
        <h3 class="panel-title col-sm-8">{{ agg.agg.type }} on {{agg.agg.field}}</h3>
        <span class="col-sm-2 glyphicon pointer" ng-class="{'glyphicon-plus': agg.showAgg, 'glyphicon-minus':!agg.showAgg}" ng-click="agg.showAgg =!agg.showAgg"></span>
        <span title="Export csv" ng-click="aggToCsv('lg', agg)"class="glyphicon glyphicon glyphicon-download-alt col-sm-2 pointer">
        </span> 
        <div class="spacer"></div>
        </div>
        <div class="panel-body" ng-show="!agg.showAgg">
            <div>
                <div class="col-sm-5"><input placeholder="Search" ng-model="agg.agg.searchText" class="form-control input-sm" type="text" /></div>
                <div class="col-sm-7 input-group input-group-sm">
                    <span class="input-group-btn">
                        <button ng-click="switchAggregationValue(agg.agg, 'predicate', ['key', 'doc_count'])" class="btn btn-default">
                            {{ agg.agg.predicate }}
                        </button>
                    </span>
                    <input ng-model="agg.agg.nbResult" class="form-control" type="number" />
                    <span class="input-group-btn">
                        <button class="btn btn-default btn-with-image" ng-click="agg.agg.reverse = !agg.agg.reverse"> 
                            <span class="glyphicon" ng-class="{'glyphicon-arrow-up':!agg.agg.reverse,'glyphicon-arrow-down':agg.agg.reverse}">
                            </span>
                        </button>
                    </span>
                </div>
                <div class="spacer"></div>
            </div>
            <div ng-repeat="bucket in agg.buckets | filter:agg.agg.searchText | orderBy:agg.agg.predicate:!agg.agg.reverse | limitTo:agg.agg.nbResult">
                <span class="aggregation-items"> 
                    <label><a href="#" ng-click="addAggregationFilter('Terms' , agg, bucket)">{{bucket.key}} :</a></label> 
                    {{bucket.doc_count}} 
                </span> 
                <span class="col-sm-2 glyphicon" ng-class="{'glyphicon-plus': !bucket.showNested, 'glyphicon-minus':bucket.showNested}" ng-click="bucket.showNested =!bucket.showNested" ng-if="callAggregationFunc('hasNestedAgg', bucket)"></span>
                <div class="spacer"></div>
                <div ng-show="bucket.showNested">
                    <ul>
                        <li ng-repeat="(key, agg) in bucket">
                            <div ng-if="callAggregationFunc('isAgg', key)" ng-include="agg.agg.template"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
```

NB : This template will be included by default in incoming version of curiosity.

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