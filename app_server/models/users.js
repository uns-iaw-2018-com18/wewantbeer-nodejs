const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  token: String,
  username: String,
  email: String,
  password: String,
  style: Number,
  rating: [{
    bar: String,
    rate: Number
  }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', userSchema);
