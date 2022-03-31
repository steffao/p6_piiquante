const express = require('express');

const router = express.Router(); // Création d'un routeur

const authCtrl = require('../controllers/user');



router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);


module.exports = router;