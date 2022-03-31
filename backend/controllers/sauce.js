
const fs = require('fs');
const Sauce = require("../models/sauce");  // exporte le contenu du fichier user.js contenant le modèle de données

//---------------------FIND ALL---------------------------
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

//---------------------FIND ONE---------------------------
exports.getOneSauce = (req, res, next) => { // Récupération d'une sauce spécifique. Nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre
  Sauce.findOne({ _id: req.params.id }) //  la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//---------------------CREATE---------------------------
exports.createSauce = (req, res, next) => { // crée une sauce
  const sauceObject = JSON.parse(req.body.sauce)
  console.log(sauceObject)
  delete sauceObject._id; // supprime l'id crée par le front pour reprendre l'id provenant de la bdd
  const sauce = new Sauce({
    ...sauceObject, // le corps de la requête sauf image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` , // req.protocole = http ou https , req.get = le host soit la racine du serveur ou l'adresse du serveur, images soit le repertoire sur le server puis le nom du fichier donne2 par multer  
  }); 
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès' }))
    .catch(error => res.status(400).json({ error }));
}

//---------------------UPDATE---------------------------
// exports.updateSauce = (req, res, next) => {
//   const sauceObject = req.file ?
//     {
//       ...JSON.parse(req.body.sauce),
//       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body };
//   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // 1er arg est l'objet de la bdd correspondant à l'/:id de la req
//     // 2e arg est le nouvel objet de la req dont l'id correspond à celui des param de la req
//     .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
//     .catch(error => res.status(400).json({ error }));
// };

exports.updateSauce = (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id }).then( // On cherche à récupérer le userId de l'objet à suppr pour comparer au userId de la requête
    (sauce) => {
      if (!sauce) { // si l'objet pas trouvé en base
        res.status(404).json({
          error: new Error('Sauce introuvable!')
        });
      }
      if (sauce.userId !== req.auth.userId) { // Si le userId de la req (défini dans le middleware auth) et le userId de l'objet en base sont différents
        res.status(400).json({
          error: new Error('Requête non autorisée!')
        });
      }
      const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // 1er arg est l'objet de la bdd correspondant à l'/:id de la req
        // 2e arg est le nouvel objet de la req dont l'id correspond à celui des param de la req
        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
        .catch(error => res.status(400).json({ error }));
    }
  )
};
//---------------------DELETE---------------------------
exports.deleteSauce = (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id }).then( // On cherche à récupérer le userId de l'objet à suppr pour comparer au userId de la requête
    (sauce) => {
      if (!sauce) { // si l'objet pas trouvé en base
        res.status(404).json({
          error: new Error('Sauce introuvable!')
        });
      }
      if (sauce.userId !== req.auth.userId) { // Si le userId de la req (défini dans le middleware auth) et le userId de l'objet en base sont différents
        res.status(400).json({
          error: new Error('Requête non autorisée!')
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => { // suppression de l'image du répertoire
        Sauce.deleteOne({ _id: req.params.id }).then( // callback, suppression de l'objet de la bdd
          () => {
            res.status(200).json({
              message: 'Supprimée!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
      )
    }
  )
};

//-------------------------LIKE/UNLIKE-------------
exports.likeSauce = (req, res, next) => { // crée une sauce
  
  const userId = req.body.userId
  const like = req.body.like
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      if (like === 1){

        if (!sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: req.params.id}, {$push: {usersLiked: userId}, $inc: {likes: 1}})
            .then(() => res.status(200).json({ message: 'L\' utilisateur aime cette sauce!' }))
            .catch(error => res.status(400).json({ error }));
        } 

      } else if (like === -1 ) {

        if (!sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({_id: req.params.id}, {$push: {usersDisliked: userId}, $inc: {dislikes: 1}})
            .then(() => res.status(200).json({ message: 'L\' utilisateur n\'aime pas cette sauce!'  }))
            .catch(error => res.status(400).json({ error }));
        } 

      } else if (like === 0) {

        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}})
            .then(() => res.status(200).json({ message: 'L\' utilisateur n\'aime pas cette sauce!'  }))
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: userId}, $inc: {likes: -1}})
            .then(() => res.status(200).json({ message: 'L\' utilisateur aime cette sauce!' }))
            .catch(error => res.status(400).json({ error }));
        }
      } 
    }
  )
  .catch((error) => res.status(404).json({ error }));
  }
  
