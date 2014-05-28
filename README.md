# Documentation 

## Présentation 

Curiosity est outil dévelloppé par Pages Jaunes dont le but est de découvrir et rechercher dans des indexs elasticSearch de manière simple et intuitive.
Le fonctionnalitées principales de curiosity sont :
* Des mots clés permettant de sauvegarder une requette complète ou seulement une partie de celle-ci
* Le templating de liste des résultats
* L'utilisation d'aggrégations pour filtrer la liste résultat
* L'export des résultat au format csv

## Sommaire

* Instalation
* Premier pas 
  * Connexion à un server elasticsearch
  * Première requette
  * Utilisation des mots clés

* Utilisation avancés 


## Instalation 

Curiosity ne possede aucune dépendance extérieur, la seul containte est l'utilisation d'un navigateur internet récent. 
Pour installer Curiosity télécharger l'archive du projet, et décompressez la dans le dossier de votre choix.
Ensuite ouvrer le fichier conf.js situé à la racine du dossier décompressé. Vous pouvez avoir à modifier certaines valeurs :

* "defaultServer" : correspond à l'adresse du serveur elasticsearch par défault utilisé par curiosity.
* "confServer" : correspond à l'adresse du serveur elasticsearch dans lequel curiosity stockera ses données de personalisation. Dans la majorité des cas "defaultServer" sera égale à "confServer"
* "confIndex" : correspond au nom de l'index dans lequel curiosity stockera ses données.

Une fois vos préfèrence modifier. Ouvrer la page index.html situer à la racine du dossier. Lors du premier lancement attentez quelque seconde le temps que curiosity initialise ses données puis raffraichisser la page. 
Curiosity est prèt à être utiliser.

## Premiers pas

Lorsque vous lancer curiosity vous arriver sur la page principale de l'application. Depuis cette page vous pouvez éffectuer des recherches et parcourir les résultats. 
En haut à gauche de la page se trouve un menus vous permettant de parcourir les différent modules de l'application.
Plus à droite se trouve respectivement la liste des indexs et la liste des serveurs.

Le corps de la page est séparé en trois colonnes :
* La colonne de gauche correspond au résultat des aggrégations. 
* La colonne centrale est la colonne principale, vous constiturez votre requette et les différents résultats viendrons s'afficher ici.
* La colonne de droite affiche des informations diverses (erreurs, log, ect).  

### Connexion à un serveur elasticsearch 

La première chose à faire quand vous lancez curiosity est de choisir un serveur et un index. Il y a deux listes déroulantes situé en haut de la page internet. La première correspond à la liste des indexs présent sur le serveur courant. La seconde liste correspond à la liste des serveurs elasticsearch connu par curiosity. Vous pouvez rajouter un serveur en clicquant sur nouveau puis en renseignant l'adresse du serveur dans le champs qui apparait. Si curiosity établi la connexion le bouton connect deviendra vert, dans le cas contraire il sera rouge.
Ensuite sélectioner votre index dans la première liste déroulante. 

### Première requette

Curiosity utilise la syntaxe [query string query](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-dsl-query-string-query "Documentation query string") de elasticsearch pour éffectuer des recherches. Pour rendre la création de recherche plus intuitives nous avons cacher la complexité de la syntaxe en rajoutant des mots clés. 
Ainsi en tapant dans la barre de recherche "description" vous rechercherez dans tous les champs d'un documents la précence du mot description. Si vous enlevez les guillemets vous rechercherez si le champs description exists dans un document. Les opérateurs booléèn de base sont présent ainsi en écrivant :
      "description" et description vous rechercher la présence du champs descrition et de la chaines de carractère descrption dans les documents de l'index.

### Utilisation des mots clés

Pour utiliser des fonctionnalités de recherches plus poussez clicquez sur le bouton requêtte avancée. Un panneau s'ouvre en dessus du boutons. Sur ce panneau apparaissent deux encadrés bleus. Le premier correspond à la liste des mots clés de l'index courant. Le second correspond à la liste des champs pouvant être présent dans les documents de l'index. En cliquant sur un mots clés ou sur un champs celui-ci est directement ajouter à la requette.
En dessous ce trouve deux champs de texte. Le premier correspond à la requette simplifié rentrez par l'utilisateur. Le second correspond à l'équivalent de la requètte simplifié formaté selon le format query string. La modification du premier champs entraine la modification du deuxième mais pas l'inverse. Ainsi si vous souhaitez éffectuer une requette plus complexe vous pouvez directement écrire dans le deuxième champs. Le bouton mot clé depuis requette vous permet de créer un mot clé qui sera ajouter à la liste des mots clés présent dans l'encadré bleu depuis la requette.


