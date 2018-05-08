const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');
const users = mongoose.model('users');

const index = function(req, res) {
  if(req.user){
    users.findOne({'_id': req.user._id}).exec((err,usuario)=>{
        res.render('index', {user: usuario});
    })
  }else{
    res.render('index',{user:req.user});
  }

};



const bar = function(req, res) {
  var user=req.user;
  if(req.user){
    users.findOne({'_id': req.user._id}).exec((err,usuario)=>{
        user=usuario;
    })
  }

  Cervecerias.findOne({'id': req.params.id}).exec((err, cerveza) => {
      if (err || cerveza == null) {
        res.render('notfound', {user: user, search: req.params.id});
      } else {
        if (req.user) {
          users.findOne({"_id": req.user._id}, {"rating": {$elemMatch: {"bar": req.params.id}}}).exec((err, result) => {
            if (err || result.rating === undefined || result.rating.length == 0) {
              res.render('bar', {user: user, myRating: 0, cerveza: cerveza, horarios: horario(cerveza)});
            } else {
              res.render('bar', {user: user, myRating: Number(result.rating[0].count), cerveza: cerveza, horarios: horario(cerveza)});
            }
          });
        } else {
          res.render('bar', {user: user, cerveza: cerveza, horarios: horario(cerveza)});
        }
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

module.exports = {index, bar};
