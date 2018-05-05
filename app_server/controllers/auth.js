var passport = require('passport');
var User = require('../models/users');

const getSignup = function(req, res) {
  res.render('signup');
};

const signup = function(req, res) {
  User.register({ username: req.body.username }, req.body.password, function(err, user) {
    if (err) {
      return res.render('signup', { user: user });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
};

const getLogin = function(req, res) {
  res.render('login', { user: req.user });
};

const login = function(req, res) {
  passport.authenticate('local')(req, res, function() {
    res.redirect('/');
  });
};

const logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = {getSignup, signup, getLogin, login, logout};
