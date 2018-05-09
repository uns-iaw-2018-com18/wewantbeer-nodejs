const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  email: {
    type: String,
    unique: true
  },
  style: {
    type: Number,
    default: 0
  },
  rating: [{
    bar: String,
    count: Number,
    _id: false
  }],
  google: {
    id: String,
    token: String,
    name: {givenName: String, familyName: String}
  },
  facebook: {
    id: String,
    token: String,
    name: {givenName: String, familyName: String}
  }
});

module.exports = mongoose.model('users', userSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) {
      throw err;
    }
    callback(null, isMatch);
  });
}
