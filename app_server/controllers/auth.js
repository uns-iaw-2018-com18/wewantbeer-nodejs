var passport = require('passport');
var User = require('../models/users');

const getSignup = function(req, res) {
  res.render('signup');
};

const signup = function(req, res) {
  User.register({ username: req.body.username, email: req.body.email }, req.body.password, function(err, user) {
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

// Controladores de las redes sociales
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
	    clientID: "883057773753-94nj4230rhpo58hdiettsru28rfc0tmi.apps.googleusercontent.com",
	    clientSecret: "-hDODhzoP-A8a6NEuZYogwqA",
	    callbackURL: "http://localhost:3000/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
			process.nextTick(function(){
				User.findOne({$or: [
                        { 'google.id': profile.id },
                        { 'email': profile.emails[0].value }
                    ]
                },
        function(err, user){
					if(err)
						return done(err);
					if(user){
            if (user.google.id == undefined) {
              user.google.id = profile.id;
              user.google.token = accessToken;
              user.google.email = profile.emails[0].value;
              user.google.name = profile.name;
              user.save();
            }
            return done(null, user);
          }else {
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.token = accessToken;
						newUser.google.name = profile.name;
						newUser.google.email = profile.emails[0].value;

						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
						})
						// console.log(profile);
					}
				});
			});
	    }

));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const google = passport.authenticate('google', {scope:['profile','email']});

const googleAuth =passport.authenticate('google', {failureRedirect: '/login'});

const googleCallback = function(req, res) {
    // console.log(req.user);
    res.redirect('/');
};


module.exports = {getSignup, signup, getLogin, login, logout, google, googleAuth, googleCallback};
