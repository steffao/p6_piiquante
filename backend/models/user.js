const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator') // Package permettant de vérifier l'unicité d'un élément du modèle

const userSchema = mongoose.Schema({ // .Schema est une fonction permettant de créer le schéma de données. L'objet passé précise les éléments du schéma
    email: { type: String, required: true, unique: true}, // clé : { type: type du titre (str, nbr, etc), obligatoire, unique} 
    password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator); // Plugin permettant de vérifier l'unicité d'un élément du modèle ex ici avec l'email

module.exports = mongoose.model('User', userSchema); // permet l'export du modèle pour l'utiliser ultérieurement. La méthode  model  transforme ce modèle en un modèle utilisable.
// Le nom du modèle est passé en clé et le midèle en lui même en valeur