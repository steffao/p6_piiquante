// vérification de l'id grâce token avant de lancer une requête (requete métier de controllers par exemple) 

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token dans le header de la requête à la clé authorization (après le Bearer)
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN) // pour décomposer le TOKEN cf. auth.js du controllers qui construit le TOKEN avec la chaine 'RANDON_TOKEN_SECRET
        console.log(decodedToken)
        const userId= decodedToken.userId // récupération du userId ayant servi à créer le TOKEN
        req.auth = {userId : userId} // permet d'attribuer une clé userId à la requête
        if (req.body.userId && req.body.userId !== userId ){
            throw 'User ID non valable'
        } else {
            next()
        }

    } catch (error) {
        res.status(403).json({error :error | 'Requête non autorisée'})
    }
}