var passport = require('passport');
var User = require('../models/users');

const getSignup = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('signup');
  }
};

var LocalStrategy = require('passport-local').Strategy;
passport.use('local-signup', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done){
		process.nextTick(function(){
			User.findOne({'email': req.body.email}, function(err, user){
				if(err)
					return done(err);
				if(user){
          if(user.username == undefined){
            user.username = username;
            user.password = user.generateHash(password);
            user.save();
          }
					return done(null, user);
				} else {
					var newUser = new User();
          newUser.email = req.body.email;
					newUser.username = username;
					newUser.password = newUser.generateHash(password);
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

  passport.use('local-login', new LocalStrategy({
  		passReqToCallback: true
  	},
  	function(req, username, password, done){
  		process.nextTick(function(){
  			User.findOne({'username': username}, function(err, user){
  				if(err){
            console.log("entro aca 4");
  					return done(err);
            }
          if(!user){
            console.log("entro aca");
            return done(null,false);
          }
          if(!user.validPassword(password)){
            console.log("entro aca 2")
            return done(null, false );
  				}
            console.log("entro aca 3");
  					return done(null, user);
  			});

  		});
  	}));


const signup = passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
});

const getLogin = function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
};

const login = passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login'
	});

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
				User.findOne({'email': profile.emails[0].value},function(err, user){
					if(err)
						return done(err);
					if(user){
            if (user.google.id == undefined) {
              user.google.id = profile.id;
              user.google.token = accessToken;
              user.google.name = profile.name;
              user.google.email = profile.emails[0].value;
              user.save();
            }
            return done(null, user);
          }else {
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.token = accessToken;
						newUser.google.name = profile.name;
						newUser.email = profile.emails[0].value;

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

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
	    clientID: "412740312574930",
	    clientSecret: "76e4bad865dd61ca13357b2233083960",
	    callbackURL: "http://localhost:3000/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
			process.nextTick(function(){
				User.findOne({'email': profile.emails[0].value},function(err, user){
					if(err)
						return done(err);
					if(user){
            if (user.facebook.id == undefined) {
              user.facebook.id = profile.id;
              user.facebook.token = accessToken;
              user.facebook.name = profile.name;
              user.save();
            }
            return done(null, user);
          }else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = accessToken;
						newUser.facebook.name = profile.name;
						newUser.email = profile.emails[0].value;

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

const googleAuth = passport.authenticate('google', {failureRedirect: '/login'});

const googleCallback = function(req, res) {
    // console.log(req.user);
    res.redirect('/');
};

const facebook = passport.authenticate('facebook', {scope:['profile','email']});
const facebookAuth = passport.authenticate('facebook', {failureRedirect: '/login'});
const facebookCallback = function (req, res) {
  res.redirect('/');
}

module.exports = {getSignup, signup, getLogin, login, logout, google, googleAuth, googleCallback, facebook, facebookAuth, facebookCallback};
