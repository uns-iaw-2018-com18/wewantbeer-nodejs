const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./app_server/models/db');

const indexRouter = require('./app_server/routes/index');
const userRouter = require('./app_server/routes/users');
const apiRouter = require('./app_server/routes/api');

const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');
// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter);

//Quiero usar morgan
app.use(morgan('tiny'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get('*',(req,res)=>{
  res.end('Archivo no encontrado');
});
app.post('/rating', (req, res) => {
  console.log("------");
  console.log('id: ' + req.body.id);
  console.log('rating: '+req.body.rating);
  console.log("------");

  actualizarRating(req.body.rating,req.body.id);
	res.send(req.body);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



function actualizarRating(nuevoValor,cerveceriaId){
  Cervecerias.findOne({'id':cerveceriaId}).exec((err,cerveza)=>{
      var puntaje=cerveza.sumaPuntajes+Number(nuevoValor);
      var cantidad=cerveza.cantidadPuntajes+1;
      Cervecerias.updateOne({ id:cerveceriaId},{$set: {sumaPuntajes:puntaje, cantidadPuntajes:cantidad}},function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
  });
}
module.exports = app;
