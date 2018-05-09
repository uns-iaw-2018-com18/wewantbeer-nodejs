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

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('users', userSchema);
