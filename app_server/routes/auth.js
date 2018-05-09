var express = require('express');
var router = express.Router();
const auth = require('../controllers/auth');
const queryString = require('query-string');

router.get('/signup*', auth.getSignup); // signup seguido de cualquier string
router.post('/signup', auth.signup, function(req, res) {
  var redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  if (redirect != undefined) {
    res.redirect(redirect);
  } else {
    res.redirect('/');
  }
});

router.get('/login*', auth.getLogin); // login seguido de cualquier string
router.post('/login', auth.login, function(req, res) {
  var redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  if (redirect != undefined) {
    res.redirect(redirect);
  } else {
    res.redirect('/');
  }
});

router.get('/logout*', auth.logout);

router.get('/auth/google', auth.google);
router.get('/auth/google/callback', auth.googleAuth, auth.googleCallback);
router.get('/auth/facebook', auth.facebook);
router.get('/auth/facebook/callback', auth.facebookAuth, auth.facebookCallback);

module.exports = router;
