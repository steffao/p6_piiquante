const express = require('express');

const router = express.Router(); // Création d'un routeur

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauce = require('../controllers/sauce');


//-------------Route GET----------
router.get('/', auth, sauce.getAllSauces);
router.get('/:id', auth, sauce.getOneSauce);

//-------------Route POST----------
router.post('/', auth, multer, sauce.createSauce);

//-------------Route PUT----------
router.put('/:id', auth, multer, sauce.updateSauce);

//-------------Route DELETE----------
router.delete('/:id', auth, multer, sauce.deleteSauce);

//-------------Likes------------
router.post('/:id/like', auth, sauce.likeSauce)

module.exports = router;