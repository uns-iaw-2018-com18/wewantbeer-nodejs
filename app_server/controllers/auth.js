var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var flash = require('connect-flash');
const queryString = require('query-string');

/* GET signup */
const getSignup = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    var redirect = queryString.parseUrl(req.url).query.redirect;
    res.render('signup', {user: req.user, redirect: redirect, signupError: req.flash('signupError')});
  }
};

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'email': email}, function(err, user) {
				if (err) {
					return done(err);
        }
				if (user) {
          // Quiere decir que ya existe una cuenta con ese email
					return done(null, false, req.flash('signupError', 'Ya existe un usuario con ese correo electrónico'));
				} else {
          // La contraseña y la confirmacion de contraseña no coinciden
          if (req.body.confirmPassword != password) {
            return done(null, false, req.flash('signupError', 'Las contraseñas no coinciden'));
          }
          // El email no tiene un formato valido
          if (!validateEmail(email)) {
            return done(null, false, req.flash('signupError', 'El correo electrónico no tiene un formato válido'));
          }

					var newUser = new User({
            email: email,
            nickname: req.body.nickname,
            password: password
          });

          User.createUser(newUser, function(err, user) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
				}
			})
		});
	})
);

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'email': email}, function(err, user) {
				if (err) {
					return done(err);
        }
        if (!user) {
          // El usuario no existe
          return done(null, false, req.flash('loginError', 'El usuario y la contraseña no coinciden'));
        }
        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            // La contraseña es invalida
            return done(null, false, req.flash('loginError', 'El usuario y la contraseña no coinciden'));
          }
        });
			});
		});
	})
);

const signup = passport.authenticate('local-signup', {
		failureRedirect: '/signup'
});

/* GET login */
const getLogin = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    var redirect = queryString.parseUrl(req.url).query.redirect;
    res.render('login', {user: req.user, redirect: redirect, loginError: req.flash('loginError')});
  }
};

const login = passport.authenticate('local-login', {
		failureRedirect: '/login'
});

const logout = function(req, res) {
  req.logout();
  var redirect = queryString.parseUrl(req.url).query.redirect;
  if (redirect != undefined) {
    res.redirect(redirect);
  } else {
    res.redirect('/');
  }
};

// Controladores de las redes sociales
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
	    clientID: "417187322792-418h3puqt37tckhnfkg06tsk5ms0galo.apps.googleusercontent.com",
	    clientSecret: "965gh55NJt61Dgg5r7JlQOIV",
	    callbackURL: "https://wewantbeer.herokuapp.com/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				User.findOne({'email': profile.emails[0].value},function(err, user) {
					if (err) {
						return done(err);
          }
					if (user) {
            if (user.google.id == undefined) {
              user.google.id = profile.id;
              user.google.token = accessToken;
              user.google.name = profile.name;
              user.google.email = profile.emails[0].value;
              user.save();
            }
            return done(null, user);
          } else {
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.token = accessToken;
						newUser.google.name = profile.name;
						newUser.email = profile.emails[0].value;
						newUser.save(function(err) {
							if (err) {
								throw err;
              }
							return done(null, newUser);
						})
					}
				});
			});
    }
));

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
	    clientID: "412740312574930",
	    clientSecret: "76e4bad865dd61ca13357b2233083960",
	    callbackURL: "https://wewantbeer.herokuapp.com/auth/facebook/callback",
      profileFields: ['id', 'name', 'email']
	  },
	  function(accessToken, refreshToken, profile, done) {
			process.nextTick(function(){
				User.findOne({'email': profile.emails[0].value},function(err, user){
					if (err) {
						return done(err);
          }
					if (user) {
            if (user.facebook.id == undefined) {
              user.facebook.id = profile.id;
              user.facebook.token = accessToken;
              user.facebook.name = profile.name;
              user.save();
            }
            return done(null, user);
          } else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = accessToken;
						newUser.facebook.name = profile.name;
						newUser.email = profile.emails[0].value;
						newUser.save(function(err) {
							if (err) {
								throw err;
              }
							return done(null, newUser);
						})
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

const google = passport.authenticate('google', {scope: ['profile', 'email']});

const googleAuth = passport.authenticate('google', {failureRedirect: '/login'});

const googleCallback = function(req, res) {
    res.redirect('/');
};

const facebook = passport.authenticate('facebook', {scope:['email']});

const facebookAuth = passport.authenticate('facebook', {failureRedirect: '/login'});

const facebookCallback = function (req, res) {
  res.redirect('/');
}

module.exports = {getSignup, signup, getLogin, login, logout, google, googleAuth, googleCallback, facebook, facebookAuth, facebookCallback};
