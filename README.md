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

### Connexion à un serveur elasticsearch 

La première chose à faire quand vous lancez curiosity est de choisir un serveur et un index. Il y a deux listes déroulantes situé en haut de la page internet. La première correspond à la liste des indexs présent sur le serveur courant. La seconde liste correspond à la liste des serveurs elasticsearch connu par curiosity. Vous pouvez rajouter un serveur en clicquant sur nouveau puis en renseignant l'adresse du serveur dans le champs qui apparait. Si curiosity établi la connexion le bouton connect deviendra vert, dans le cas contraire il sera rouge.
