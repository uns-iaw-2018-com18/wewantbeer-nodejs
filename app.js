const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');
require('./app_server/models/db');

const indexRouter = require('./app_server/routes/index');
const apiRouter = require('./app_server/routes/api');
const authRouter = require('./app_server/routes/auth');
const app = express();
const flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'wewantbeer-s3cr3t',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/', authRouter);

// Handle 404
app.use(function(req, res) {
  res.status(404).render('404');
});

// Quiero usar morgan
app.use(morgan('tiny'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get('*',(req,res)=>{
  res.end('Archivo no encontrado');
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

module.exports = app;
