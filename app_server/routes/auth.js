var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth');
const passportFacebook = require('../auth/facebook');
const passportGoogle = require('../auth/google');

router.get('/signup', auth.getSignup);
router.post('/signup', auth.signup);

router.get('/login', auth.getLogin);
router.post('/login', auth.login);

router.get('/logout', auth.logout);

// /* Facebook router */
// router.get('/facebook', passportFacebook.authenticate('facebook'));
//
// router.get('/facebook/callback',
//   passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// });
//
// /* Google router */
// router.get('/google',
//   passportGoogle.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
//
// router.get('/google/callback',
//   passportGoogle.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
// });

module.exports = router;
