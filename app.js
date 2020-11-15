const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const passport = require('passport');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const authenticator = require('./modules/authenticator');
const helpers = require('./modules/helpers');
const db = require('./models/db');

const indexRouter = require('./routes/index');
const app = express();

const errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  helpers.renderTemplate(res, 'serverError', { title: 'Server Error' });
}

const makeUserGlobal = (req, res, next) => {
  res.locals.user = req.user;
  next();
}

const fourOFourHandler = (req, res, next) => {
  res.status(404);
  helpers.renderTemplate(res, '404Error', { title: '404' });
}
 
const sessionConfig = {
  store: new MongoStore({ client: db.client }),
  saveUninitialized: false,
  secret: (process.env.mongoSessionKey || 'MonkeyMagic'),
  resave:false
};

authenticator.apply(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(makeUserGlobal);
app.use('/', indexRouter);
app.use(fourOFourHandler);
app.use(errorHandler);

module.exports = app


