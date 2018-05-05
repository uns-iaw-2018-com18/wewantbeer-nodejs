var express = require('express');
var router = express.Router();
const passportFacebook = require('../auth/facebook');
const passportGoogle = require('../auth/google');
router.get('/facebook', passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  /* GOOGLE ROUTER */
  router.get('/google',
    passportGoogle.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

  router.get('/google/callback',
    passportGoogle.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

module.exports = router;
