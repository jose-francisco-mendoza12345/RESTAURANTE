var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var restaurantRouter = require('./routes/restaurant');   //---->link para restaurant
var menuRouter = require('./routes/menu');   //---->link para menu
var ordenesRouter = require('./routes/orden');   //---->link para ordenes
//var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/1.0', restaurantRouter);  //---->link para restaurant
app.use('/api/1.0', menuRouter);  //---->link para menu
app.use('/api/1.0', ordenesRouter);  //---->link para ordenes

//app.use('/api/1.0', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
var port = 8000;
app.listen(port, () => {
  console.log("Corriendo " + port);
});
module.exports = app;
