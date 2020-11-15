const LocalStrategy = require('passport-local').Strategy;
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');

const db = require('./../models/db');

const createStrategyWith = async (username, password, done) => {
  const result = await db.users.findOne({ username })
    .then(document => ({ document })).catch(error => ({ error }));
  if (result.error) return done(result.error);

  const user = result.document;
  if (!user)
    return done(null, false, { msg: 'Incorrect Username' });

  const response = await bcrypt.compare(password, user.password)
    .then(isEqual => ({ isEqual })).catch(error => ({ error }));
  if (response.error) return done (response.error);
 
  if (!response.isEqual)
    return done(null, false, { msg: 'Incorrect Password' });
  else done(null, user);
}

const deserializeUser = async (_id, done) => {
  const result = await db.users.findOne({ _id: new ObjectID(_id) })
    .then(document => ({ document })).catch(error => ({ error }));
  const { error, document } = result;
  done(error, document);
}

const serializeUser = async (user, done) => done(null, user._id)

exports.getHashedPasswordFor = async password => {
  const result = await bcrypt.hash(password, 10)
    .then(hashedPassword => ({ hashedPassword }))
    .catch(error => ({ error }));
  if (result.error) throw result.error;

  return result.hashedPassword;
}

exports.apply = passport => {
  passport.use(new LocalStrategy(createStrategyWith));
  passport.deserializeUser(deserializeUser);
  passport.serializeUser(serializeUser);
}

