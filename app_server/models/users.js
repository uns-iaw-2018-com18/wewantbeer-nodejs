const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  email:{
    type: String,
    unique: true
  },
  username:String,
  displayName: String,
  style:{
    type: Number,
    default: 0
  },
  rating: [{
    bar: String,
    rate: Number
  }],
  password: String,
  google: {
    id: String,
    token: String,
    email: String,
    name: {givenName:String, familyName:String}
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.plugin(passportLocalMongoose, {selectFields:"username email"});

module.exports = mongoose.model('users', userSchema);
