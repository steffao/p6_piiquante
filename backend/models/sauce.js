const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({ // .Schema est une fonction permettant de créer le schéma de données. L'objet passé précise les éléments du schéma
    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { type : Number , default: 0},
    dislikes : { type : Number, default : 0 },
    usersLiked : { type : [String] },
    usersDisliked : { type : [String] },
})



module.exports = mongoose.model('Sauce', sauceSchema); // permet l'export du modèle pour l'utiliser ultérieurement. La méthode  model  transforme ce modèle en un modèle utilisable.
// Le nom du modèle est passé en clé et le modèle en lui même en valeur