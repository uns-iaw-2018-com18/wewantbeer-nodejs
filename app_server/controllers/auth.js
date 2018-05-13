const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const flash = require('connect-flash');
const queryString = require('query-string');

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
          // Ya existe un usuario con ese correo electronico
					return done(null, false, req.flash('signupError', 'Ya existe un usuario con ese correo electrónico'));
				} else {
          // Tamaños de campos mayores a los permitidos
          if ((req.body.nickname.length > 16) || (email.length > 32) || (password.length > 32)) {
            return done(null, false, req.flash('signupError', 'Se superó la cantidad de caracteres permitida en algún campo'));
          }
          // Formato de correo electronico invalido
          if (!validateEmail(email)) {
            return done(null, false, req.flash('signupError', 'El correo electrónico no tiene un formato válido'));
          }
          // Contraseña con un tamaño menor de 8 caracteres
          if (password.length < 8) {
            return done(null, false, req.flash('signupError', 'La contraseña debe tener al menos 8 caracteres'));
          }
          // Contraseña y confirmacion de contraseña no coinciden
          if (req.body.confirmPassword != password) {
            return done(null, false, req.flash('signupError', 'Las contraseñas no coinciden'));
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

/* GET signup */
const getSignup = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    var redirect = queryString.parseUrl(req.url).query.redirect;
    res.render('signup', {user: req.user, redirect: redirect, signupError: req.flash('signupError')});
  }
};

/* POST signup */
const signup = function(req, res, next) {
  var redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      if (redirect != undefined) {
        return res.redirect('signup?redirect=' + redirect);
      } else {
        return res.redirect('signup');
      }
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (redirect != undefined) {
        return res.redirect(redirect);
      } else {
        return res.redirect('/');
      }
    });
  }) (req, res, next);
};

/* GET login */
const getLogin = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    var redirect = queryString.parseUrl(req.url).query.redirect;
    res.render('login', {user: req.user, redirect: redirect, loginError: req.flash('loginError')});
  }
};

/* POST signup */
const login = function(req, res, next) {
  var redirect = queryString.parseUrl(req.get('Referrer')).query.redirect;
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      if (redirect != undefined) {
        return res.redirect('login?redirect=' + redirect);
      } else {
        return res.redirect('login');
      }
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (redirect != undefined) {
        return res.redirect(redirect);
      } else {
        return res.redirect('/');
      }
    });
  }) (req, res, next);
};

/* GET logout */
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

const googleAuth = function(req, res) {
  var redirect = req.session.redirect;
  if (redirect != undefined) {
    redirect = '?redirect=' + redirect;
  } else {
    redirect = '';
  }
  passport.authenticate('google', { failureRedirect: '/login' + redirect });
};

const googleCallback = function(req, res) {
  var redirect = req.session.redirect;
  if (redirect != undefined) {
    res.redirect(redirect);
  } else {
    res.redirect('/');
  }
};

const facebookAuth = function(req, res) {
  var redirect = req.session.redirect;
  if (redirect != undefined) {
    redirect = '?redirect=' + redirect;
  } else {
    redirect = '';
  }
  passport.authenticate('facebook', { failureRedirect: '/login' + redirect });
};

const facebookCallback = function(req, res) {
  var redirect = req.session.redirect;
  if (redirect != undefined) {
    res.redirect(redirect);
  } else {
    res.redirect('/');
  }
};

module.exports = {getSignup, signup, getLogin, login, logout, googleAuth, googleCallback, facebookAuth, facebookCallback};
