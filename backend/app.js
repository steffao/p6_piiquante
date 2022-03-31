const express = require ('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const app = express() ;
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PWD}@${process.env.MDB_CLUSTER}/${process.env.MDB_DB_NAME}?retryWrites=true&w=majority`, // adress de la base mongoDB
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet()); // Protection contre les failles XSS. Ajoute des headers HTTP supplémentaires.

app.use(mongoSanitize({ // Prévient contre les injections de code dans la base MongoDB
      replaceWith: '_',
    }),
);

app.use(express.json()); // middleware interceptant tous les objets json provenant de json. On recupere des objets .body

app.use((req, res, next) => { // s'applique à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_URL ); // header permettant d'accéder à notre API depuis l'adresse citée 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // header permettant d'ajouter les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site') // Autorisation de lecture de l'image 
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // middleware répondant au requête envoyée à /image
// requete envoyé a /images , le middleware sert le dossier static. en argument on passe le chemin.
// path = chemin du server, dirname = repertoire de base, 'images' = sous réperoire image

app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes); 

module.exports = app;


