require("dotenv").config();


const express = require("express");

const routes = require("./routes/api");
const authRoutes = require("./routes/auth")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const passport = require('passport');
const logger = require('morgan');
const createError = require('http-errors');
var path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;






app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(csrf());
app.use(passport.authenticate('session'));
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(cors({ origin: '*' }));


app.use("/api", routes);
app.use("/",authRoutes)





app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
