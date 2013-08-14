curiosity
=========

Curiosity is a generic frontend for facetting, displaying and editing data from any elasticsearch index.

Development repo is here: http://github.com/pagesjaunes/curiosity

Description
====

Curiosity is a client side tool, written in javascript (with MVC support from angularjs), that aims to make possible to explore bigdata from an elasticsearch index, regardless of the index structure.

It lets the user :
- Choose an elasticsearch server from a list ;
- Choose an index and a doc type, discovered from the selected server ;

Then, the fields are found out by the tool, and the user is able to :
- Pick the fields he wants to be displayed ;
- Pick the fields he wants to be facetted.

Once done, the user can dig into the data, using the chosen facets and/or the full text search.

Moreover, he can select a document from the view, edit it and thus :
- Modify any value ;
- Modify a field structure

Once validated, the changes are indexed in elasticsearch. If the user adds a field, it is then available for being displayed or facetted !


Requirements
====

The elasticsearch documents should have been indexed with a mapping that makes "full-text" search available on every fields.
Before indexing your data, you may set this generic mapping (replacing INDEX_NAME by your own index, and DOC_NAME by the doc type you are adressing) :

`curl -XPUT 'ES_SERVER:PORT/INDEX_NAME/_mapping' -d '{
    "DOC_NAME" : {
        "dynamic_templates" : [
            {
                "facette_template" : {
                    "match" : "*",
                    "match_mapping_type" : "string",
                    "mapping" : {
                        "type" : "multi_field",
                        "fields" : {
                            "{name}_fulltext" : {"type": "string", "index" : "analyzed"},
                            "{name}" : {"type": "string", "index" : "not_analyzed"}
                        }
                    }
                }
            }
        ]
    }
}'`

Every field will be indexed for "full-text" search AND facetting. 

Demo
====

No demo available yet.

Status
======

This version is not usable yet : for testing the concept, run the prototype tool (curiosityPoc on github).

MVC refactoring with angularjs.

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

.. _jsoneditor: https://github.com/josdejong/jsoneditor
