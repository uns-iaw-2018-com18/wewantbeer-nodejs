const index = function(req, res) {
  res.render('index');
};

const bar = function(req, res) {
  res.render('bar');
};

const login = function(req, res) {
  res.render('login');
};

const signup = function(req, res) {
  res.render('signup');
};

module.exports = {index, bar, login, signup};
