const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');

const index = function(req, res) {
  res.render('index');
};

const bar = function(req, res) {
  Cervecerias.findOne({'id': req.params.id}).exec((err, cerveza) => {
      if(err || cerveza == null){
        res.render('notfound', {search: req.params.id});
      }else{
        res.render('bar', {cerveza: cerveza, horarios: horario(cerveza)});
      }
    })
};

function horario(cerveceria) {
  var hoy = new Date().getDay();
  var toRet = [];
  if (cerveceria.horario[hoy].localeCompare("") != 0) {
    var weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    toRet.push(weekdays[hoy] + " " + cerveceria.horario[hoy]);
    var day = (hoy + 1) % 7;
    while(day != hoy) {
      toRet.push(weekdays[day] + " " + cerveceria.horario[day])
      //$("#hidden-days-list").append("<div>" + weekdays[day] + " " + cerveceria.horario[day] + "</div>");
      day = (day + 1) % 7;
    }
  }
  return toRet;
}

const login = function(req, res) {
  res.render('login');
};

const signup = function(req, res) {
  res.render('signup');
};

module.exports = {index, bar, login, signup};
