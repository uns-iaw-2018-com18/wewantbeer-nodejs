var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth');
const passportFacebook = require('../auth/facebook');

router.get('/signup', auth.getSignup);
router.post('/signup', auth.signup);

router.get('/login', auth.getLogin);
router.post('/login', auth.login);

router.get('/logout', auth.logout);

router.get('/auth/google',auth.google);
router.get('/auth/google/callback',auth.googleAuth,auth.googleCallback);

module.exports = router;
