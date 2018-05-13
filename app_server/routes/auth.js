const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const queryString = require('query-string');
const passport = require('passport');

router.get('/signup*', auth.getSignup); // signup seguido de cualquier string
router.post('/signup', auth.signup);

router.get('/login*', auth.getLogin); // login seguido de cualquier string
router.post('/login', auth.login);

router.get('/logout*', auth.logout); // logout seguido de cualquier string

router.get('/auth/google', function(req, res, next) {
  req.session.redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  next();
}, passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', auth.googleAuth, auth.googleCallback);

router.get('/auth/facebook', function(req, res, next) {
  req.session.redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  next();
}, passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback', auth.facebookAuth, auth.facebookCallback);

module.exports = router;
