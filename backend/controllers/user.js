const bcrypt = require('bcrypt'); // package de la fonction de hashage des données
const jwt = require('jsonwebtoken'); // package permettant de créer un token
const User = require("../models/user");  // exporte le contenu du fichier user.js contenant le modèle de données
const validator = require('validator'); // validation du format de l'email

const validatePwd = (password) => {
  let pwdPattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;
  return pwdPattern.test(password); 
}

exports.signup = (req, res, next) => {
  if(validator.isEmail(req.body.email, {blacklisted_chars: '$="'}) && validatePwd(req.body.password)) { // Vérification de l'email
      bcrypt.hash(req.body.password, 10) // salage du mot de passe
          .then(hash => {
              const user = new User({
                  email: req.body.email,
                  password: hash
              });
              user.save()
                  .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                  .catch(error => res.status(400).json({ error }));
          })
  } else {
      res.status(400).json({ error: "Le format de l'adresse email est invalide"});
  }
};


exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // finOne permet de rechercher notre user avec {l'email correspondant}
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // Si user correspondant trouvé, comparaison du hash (hash du user trouvé en bdd, hash saisi)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ // si requête réussi
            userId: user._id,
            token: jwt.sign( // permet d'encoder un nouveau token. Ce token contient un payload (1er argt) correspondant au user id
              { userId: user._id },
              process.env.SECRET_TOKEN, // Chaine secrète  pour encoder le token
              { expiresIn: '24h' } // Durée de validité du token
            ),
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
