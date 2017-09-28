const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

// routes
const index = require('./routes/index');
const naga = require('./routes/naga');
const about = require('./routes/about');
const portfolio = require('./routes/portfolio');
const contact = require('./routes/contact');
const users = require('./routes/users');
const cfg = require('./config/config.js');


// get repo json
const getRepo = require('./get-repos');

const app = express();

// get repo json
const refresh = setInterval(() => {
  getRepo.getRepo(getRepo.user)
    .then((data) => {
      console.log(data);
      console.log('try to save data');
      fs.writeFile(path.join(__dirname, 'datai', `${cfg.user}.json`), data, (err) => {
        if (err) throw err;
        console.log(`The file '${cfg.user}.json' has been saved!`);
      });
    })
    .catch(data => console.log(data));
}, cfg.refreshInterval);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'nagada.jpg')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/naga', naga);
app.use('/about', about);
app.use('/portfolio', portfolio);
app.use('/contact', contact);

app.use('/users', users);

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
