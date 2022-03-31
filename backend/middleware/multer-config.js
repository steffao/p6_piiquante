const multer = require('multer'); // téléchargement des fichiers frontend envoyés via une req HTTP

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // objet de config pour multer.
  destination: (req, file, callback) => { // élément précisant le repertoire d'enregistrement
    callback(null, 'images'); /// 'image' correspond au répertoire dans lequel on enregistre les images
  },
  filename: (req, file, callback) => { // élément pour gdénérer le nom du fichier
    const name = file.originalname.split(' ').join('_'); //nom d'origine du fichier avec les espaces éventuelles remplacés par un '_'
    const extension = MIME_TYPES[file.mimetype]; // on utilise le MIME type pour définir l'extension. On se base donc sur la  biblio MYME_TYPES créee
    callback(null, name + Date.now() + '.' + extension); // nom final du fichier avec le name, un timestamp , un '.' et l'extension
  }
});

module.exports = multer({storage: storage}).single('image'); // exportation du module avec en argument le storage. single précise que c'est un fichier unique