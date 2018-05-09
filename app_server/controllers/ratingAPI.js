const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');
const users = mongoose.model('users');

const rate = function(req, res) {
  users.findOne({"_id": req.user._id}, {"rating": {$elemMatch: {"bar": req.body.bar}}}).exec((err, result) => {
    var valid = (err || result.rating === undefined || result.rating.length == 0);
    // Si todavia el usuario no puntuo la cerveceria
    if (valid) {
      // Actualizar cerveceria
      Cervecerias.findOne({"id": req.body.bar}).exec((err, cerveceria) => {
        var puntaje, cantidad;
        puntaje = cerveceria.sumaPuntajes + Number(req.body.count);
        cantidad = cerveceria.cantidadPuntajes + 1;
        Cervecerias.updateOne({"id": req.body.bar}, {$set: {sumaPuntajes: puntaje, cantidadPuntajes: cantidad}}, function(err, res) {
          if (err) throw err;
        });
      });
      // Actualizar usuario
      newValue = {"bar": req.body.bar, "count": Number(req.body.count)}; // Crear elemento para guardar
      users.updateOne({"_id": req.user._id}, {$push: {rating: newValue}}, function(err, res) {
        if (err) throw err;
      });
    }
  });
  res.send(req.body);
}

const unrate = function(req, res) {
  users.findOne({"_id": req.user._id}, {"rating": {$elemMatch: {"bar": req.body.bar}}}).exec((err, result) => {
    var invalid = (err || result.rating === undefined || result.rating.length == 0);
    // Si todavia el usuario no despuntuo la cerveceria
    if (!invalid) {
      // Actualizar cerveceria
      Cervecerias.findOne({"id": req.body.bar}).exec((err, cerveceria) => {
        var puntaje, cantidad;
        puntaje = cerveceria.sumaPuntajes - Number(req.body.count);
        cantidad = cerveceria.cantidadPuntajes - 1;
        Cervecerias.updateOne({id: req.body.bar}, {$set: {sumaPuntajes: puntaje, cantidadPuntajes: cantidad}}, function(err, res) {
          if (err) throw err;
        });
      });
      // Actualizar usuario
      toDelete = {"bar": req.body.bar, "count": Number(req.body.count)}; // Crear elemento para eliminar
      users.updateOne({"_id": req.user._id}, {$pull: {rating: toDelete}}, function(err, res) {
        if (err) throw err;
      });
    }
  });
  res.send(req.body);
}

module.exports = {rate, unrate};
