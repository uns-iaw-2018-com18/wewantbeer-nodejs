const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String
});

mongoose.model('users', usersSchema);
