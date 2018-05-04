const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');

const rate = function(req, res) {
  Cervecerias.findOne({"id": req.body.id}).exec((err, cerveceria) => {
    var puntaje, cantidad;
    puntaje = cerveceria.sumaPuntajes + Number(req.body.rating);
    cantidad = cerveceria.cantidadPuntajes + 1;
    Cervecerias.updateOne({id: req.body.id}, {$set: {sumaPuntajes: puntaje, cantidadPuntajes: cantidad}}, function(err, res) {
      if (err) throw err;
    });
  });
  res.send(req.body);
}

const unrate = function(req, res) {
  Cervecerias.findOne({"id": req.body.id}).exec((err, cerveceria) => {
    var puntaje, cantidad;
    puntaje = cerveceria.sumaPuntajes - Number(req.body.rating);
    cantidad = cerveceria.cantidadPuntajes - 1;
    Cervecerias.updateOne({id: req.body.id}, {$set: {sumaPuntajes: puntaje, cantidadPuntajes: cantidad}}, function(err, res) {
      if (err) throw err;
    });
  });
  res.send(req.body);
}

module.exports = {rate, unrate};
