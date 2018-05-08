const mongoose = require('mongoose');
const users = mongoose.model('users');

const changeStyle = function(req, res) {
  users.updateOne({"_id": req.user._id}, {$set: {style: req.body.style}}, function(err, res) {
    if (err) throw err;
  });
  res.send(req.body);
}

module.exports = {changeStyle};
