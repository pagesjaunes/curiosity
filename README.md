README.md 
	  Curiosity V2 

EN 

INSTALLATION PROCEDURE :

You just need a recent browser to run curiosity. The application is able to work alone without any service.
If you want to use full curiosity's possibilities (templating, keyword) you have to specify an elasticsearch server where all data will be store.
To do that open the file conf.js located in the root folder.
There is few line that you can modifie :        
      "defaultServer" :  The server that you will connect automaticly every time you launch the application
      "confServer" : The server in all curiosity's data will be strore.
      "confIndex" : The indice in the confServer where curiosity data's will be store. If i doesn't exist then it will be automaticly create and initialized.
You should not modifie the other value, unexpected behaviour could result.

After that open index.html, if it's the first time that you launch the application then !!! reload !!! the page to 

FR 

PROCEDURE D'INSTALATION 

Pour utiliser curiosity vous avez besoin d'un navigateur internet récent. L'application ne necessite aucune installation ni aucun service pour fonctionner.
Si vous voulez utiliser toute les features de curiosity (mots clées, templates, ...) vous devez spécifier un serveur elasticSearch dans lequel les données de curiosity seront stockées.
Pour cela ouvrez le fichier conf.js situé à la racine du dosiier.
Il y a quelque lignes que vous pouvez modifier :
   "defaultServer" : correspond au server par défault sur lequel vous serez connecté au lancement de l'application	"confServer" : correspond au server sur lequel seront stockées les données liées à curiosity
   "confIndex" : l'index sur le serveur de configuration dans lequel seront stockées les données liées à curiosity. Si il n'existe pas il sera automatiquement créer et initialiser.
Les autres valeurs ne devrais pas être modifier, il pourrais en découler des comportements non attendus.
Ensuite ouvrer index.html situer à la racine du dossier. Si vous venez de changer le serveur de configuration recharger la page pour que toute les modifications soient prises en compte.