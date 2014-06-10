<<<<<<< HEAD
# README.md 

## Présentation 

Curiosity est outil développé par Pages Jaunes dont le but est de découvrir et rechercher dans des indexs elasticSearch de manière simple et intuitive.
Le fonctionnalitées principales de curiosity sont :

* Des mots-clés permettant de sauvegarder une requête complète ou partiel

* Le templating de liste des résultats

* L'utilisation d'aggrégations pour filtrer la liste résultat

* L'export des résultat au format csv

## Sommaire

* Instalation

* Premier pas 

  * Connexion à un serveur elasticsearch

  * Première requête

  * Recherche avancée

* Utilisation avancés 

  * mots-clés

  * Agrégations

## Instalation 

Curiosity ne possède aucune dépendance extérieure, la seule contrainte est l'utilisation d'un navigateur internet récent. 
Pour installer Curiosity télécharger l'archive du projet, et décompressez-la dans le dossier de votre choix.
Ensuite ouvrer le fichier conf.js situé à la racine du dossier décompressé. Vous pouvez avoir à modifier certaines valeurs :

* "defaultServer" : correspond à l'adresse du serveur elasticsearch par défaut utilisé par curiosity.

* "confServer" : correspond à l'adresse du serveur elasticsearch dans lequel curiosity stockera ses données de personnalisation. Dans la majorité des cas "defaultServer" sera égale à "confServer"

* "confIndex" : correspond au nom de l'index dans lequel curiosity stockera ses données.

Une fois vos préfèrences modifiées, ouvrez la page index.html situer à la racine du dossier. Lors du premier lancement attendez quelques secondes le temps que curiosity initialise ses données puis rafraichissez la page. 
Curiosity est prêt à être utilisé.

## Premiers pas

Lorsque vous lancez curiosity, vous arrivez sur la page principale de l'application. Depuis cette page vous pouvez effectuer des recherches et parcourir les résultats. 
En haut à gauche de la page se trouve un menu vous permettant de parcourir les différents modules de l'application.
Plus à droite se trouvent respectivement la liste des indexs et la liste des serveurs.

Le corps de la page est séparé en trois colonnes :

* la colonne de gauche correspond au résultat des aggrégations 

* la colonne centrale est la colonne principale, vous constituerez votre requête et les différents résultats viendront s'afficher ici.

* la colonne de droite affiche des informations diverses (erreur, log, ...)

### Connexion à un serveur elasticsearch 

La première chose à faire quand vous lancez curiosity est de choisir un serveur et un index. Il y a deux listes déroulantes situées en haut de la page. La première correspond à la liste des indexs présents sur le serveur courant. La seconde liste correspond à la liste des serveurs elasticsearch connus par curiosity. Vous pouvez rajouter un serveur en clicquant sur "nouveau" puis en renseignant l'adresse du serveur dans le champ qui apparait. Si curiosity établit la connexion le bouton connection deviendra vert, dans le cas contraire il sera rouge.
Ensuite sélectionnez votre index dans la première liste déroulante. 

### Première requête

Curiosity utilise la syntaxe [query string query](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-dsl-query-string-query "Documentation query string") de elasticsearch pour éffectuer des recherches. Pour rendre la création de recherche plus intuitives nous avons cacher la complexité de la syntaxe en rajoutant des mots-clés. 
Ainsi en tapant dans la barre de recherche 

``` 
"description"
```  

vous rechercherez dans tous les champs d'un documents la précence du mot description. Si vous enlevez les guillemets vous rechercherez si le champs description exists dans un document. Les opérateurs booléèn de base sont présent ainsi en écrivant :

``` 
"description" et description 
``` 

vous rechercher la présence du champs description et de la chaines de carractère description dans les documents de l'index.

### Utilisation des mots-clés

Pour utiliser des fonctionnalités de recherches plus poussez cliquez sur le bouton "requête avancée". Un panneau s'ouvre en dessous du bouton. Sur ce panneau apparaissent deux encadrés bleus. Le premier correspond à la liste des mots-clés de l'index courant. Le second correspond à la liste des champs pouvant être présent dans les documents de l'index. En cliquant sur un mots-clés ou sur un champ celui-ci est directement ajouter à la requête.
En dessous ce trouvent deux champs de texte. Le premier correspond à la requête simplifiée rentrez par l'utilisateur. Le second correspond à l'équivalent de la requête simplifié formaté selon le format query string. La modification du premier champ entraine la modification du deuxième mais pas l'inverse. Ainsi si vous souhaitez éffectuer une requête plus complexe vous pouvez directement écrire dans le deuxième champ. Le bouton "mot-clé depuis requête" vous permet de créer un mot clé qui sera ajouter à la liste des mots-clés présent dans l'encadré bleu depuis la requête.

## Utilisation avancée

### Mots-clés 

Les mots-clés sont des raccourcis vous permettant de nommer des requêtes, pour pouvoir les réutiliser ensuite dans la recherche. Ces mots-clés sont compatibles avec les opérateurs booléens (et, ou) ainsi il devient aisé de les enchainer les uns avec les autres pour obtenir une requête complexe en peu de temps. 
Il y a deux moyens de créer un mot clés :

1. En créant un mot clés à partir d'une requête, dans le panneau requête avancée, le bouton "mots-clés depuis requête" ouvre un menu qui vous permettra d'ajouter un nom et une description. Le mot-clé ainsi créé rejoindra la liste des mots-clés liés à l'index.

2. En allant dans l'onglet personalisation/mots-clés. Dans cet onglet vous pouvez rajouter des mots-clés en choisissant l'index (ajouter un mot-clé dans l'index global le rend disponible pour tous les indexs) depuis la liste déroulante. Appuyer sur le bouton "ajouter" pour ajouter un mot-clé dans la liste, ensuite il suffit de renseigner les différents champs dans la liste des mots-clés en cliquant directement sur le champ à modifier, puis sauvegarder. 

### Agrégations 

Les agrégations, anciennement facettes permettent d'effectuer des opérations (statistiques, histogramme) sur des champs particuliers des résultats d'une recherche.

Il existe actuellement 15 types d'agrégations disponibles : 

* Terms : l'agrégation de type terms permet de découvrir toutes les valeurs que prend un champ dans une liste de documents et compte pour chacune de ces valeurs le nombre de fois où elles apparaissent. A l'affichage des résultats d'une agrégation de type terms vous pouvez cliquer sur les différentes valeurs pour affiner la recherche.

* Range : l'agrégation de type range permet d'obtenir le nombre de documents situé dans un intervale. Actuellement il n'est pas possible de définir plusieurs intervalles dans une même aggrégation, mais l'évolution est en cours. L'agrégation range ne fonctionne que sur des champs de type numérique.

* Avg : l'agrégation de type avg permet d'obtenir la valeur moyenne d'un champ dans une liste de documents. Cette agrégation ne fonctionne que sur un champ de type numérique.

* Cardinality : l'agrégation de type cardinality permet d'obtenir le nombre de valeurs différentes que peut prendre un champ dans une liste de documents.

* Histogram : l'agrégation de type histogram permet de définir un intervalle qui va se répéter et d'obtenir le nombre de documents présents dans chacun de ces intervalles. Cette agrégation ne fonctionne que sur des champs numérique et la taille de l'intervalle doit être un nombre entier.

* Max : l'agrégation de type max permet d'obtenir la valeur maximum que prend un champ dans une liste de documents. Cette agrégation ne fonctionne que sur des champs de type numérique.

* Min : l'agrégation de type min permet d'obtenir la valeur minimum que prend un champ dans une liste de documents. Cette agrégation ne fonctionne que sur des champs de type numérique.

* Sum : l'agrégation de type sum permet d'obtenir la somme des valeurs d'un champ dans une liste de documents. Cette 
agrégation ne fonctionne que sur des champs de type numérique.

* Missing : l'agrégation de type missing permet d'obtenir le nombre de documents pour lesquels le champ passez en paramètre 
n'est pas renseigné.

* ValueCount : l'agrégation de type valueCount permet d'obtenir le nombre de valeurs sur lesquels sont effectuées des 
agrégations sur un champ. Cette agrégation est généralement couplée à une autre agrégation. Par exemple si vous effectuez une agrégation avg et souhaitiez obtenir le nombre de valeurs sur lesquelles ont été éffectuées la moyenne.

* SignificantTerms : l'agrégation de type significantTerms permet d'obtenir la liste des terms significatifs d'un champ dans une liste de documents. Actuellement cette aggrégation ne fonctionne pas.

* Stats et ExtendStats : les agrégations de type stats et extendedStats permettent d'effectuer des statistiques sur un champ dans une liste de documents. L'agrégation extendedStats renvoie plus de statistique que stats. Ces deux agrégations ne fonctionnent que sur des champs de type numérique.

* DateHistogram et DateRange : les agrégations de types DateRange et DateHistogram sont les équivalents respectifs des agrégation range et histogram sur des champs de type date.
	
Pour effectuer des agrégations il suffit de cliquer sur le bouton "agrégations" dans l'onglet requête. Un pop-up s'ouvre dans laquelle vous pouvez :

* Ajouter une agrégation en cliquant sur le bouton présent en haut du pop-up.

* Une fois une agrégation ajoutée celle-ci apparaît au centre du pop-up. 

* Vous pouvez seléctionner le type de l'agréagation dans la liste déroulantes, puis renseigner le champ sur lequel sera effectuer l'agrégation soit en l'écrivant soit en cliquant sur un champ dans la liste des champs en haut du pop-up (il faut avoir auparavant déjà sélectionné un index pour que la liste des champs fonctionne). Puis renseigner les paramètres de l'agrégation si celle-ci en nécessite.

Une des possibilitées intéressantes des agrégations est le fait de pouvoir effectuer des agrégations à l'intérieur d'autres agrégations. Celles-ci sont appelées "nested Aggrégations". Imaginons que vous cherchiez pour chaque valeur d'un champ quelquonque des statistiques sur un autre champ. Il vous suffit d'ajouter une agrégation de type stats dans une agrégation de type terms. Vous ne pouvez pas ajouter de nested agrégations dans tout les types d'agrégations, seuls les types histogram et terms sont disponibles pour le moment.

=======
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
>>>>>>> a58d721055726eb154ef05869a8bb5a24168442e
