const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const webshot = require('webshot');

const cfg = require('./config/config.json');

// routes
const index = require('./routes/index');
const naga = require('./routes/naga');
const about = require('./routes/about');
const portfolio = require('./routes/portfolio');
const contact = require('./routes/contact');
const api = require('./routes/api');

const app = express();

setInterval(() => api.fetchrepo(cfg.owner), cfg.refreshInterval);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images', 'nagada.jpg')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/naga', naga);
app.use('/about', about);
app.use('/portfolio', portfolio);
app.use('/contact', contact);
app.use('/api', api.router);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
