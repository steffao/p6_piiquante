const http = require('http'); // Commande pour importer le package node
const app = require('./app') // Importation du fichier app.js. require ajoute le .js par défaut pour donner app.js

const normalizePort = (val) => { // renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;       
    }
    return false
};

const port = normalizePort(process.env.PORT || 3000)
app.set('port',port) // .set permet de choisir le port d'écoute

const errorHandler = (error) => { // recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
    if (error.syscall !== 'listen') {
        throw error; // throw lance une exception et interrompt donc une action
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port; //typeof address === 'string' ? correspond à la condition du if
    switch (error.code) { // selon le cas renvoie un message dans la console avec soit l'adresse du serveur soit le port
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default :
        throw error;
    }
};

const server = http.createServer(app) 
// Cette méthode permet de créer le serveur du package http. La fonction executera app.js

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
server.listen(port) // Méthode listen permet au server d'écouter cad d'attendre les requêtes envoyées. 3000 est le port que l'on écoute