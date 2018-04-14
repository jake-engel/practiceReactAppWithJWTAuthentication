const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) => {
  const timeStamp = new Date().getTime();
  // Below sub === subject, and iat === issued at time
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
};

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd, they just need a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password

  // See if user with given email exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password' });
    } // This will happen before mongoose checks the model to see if required. Avoiding mongoose' ugly error message

    // If user with given email does exist, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is already in use!' });
    }

    // If a user with email does not exist, create and save user record
    const user = new User({ email, password });
    user.save((err) => {
      if (err) { return next(err); }

      // Respond to request
      res.json({ token: tokenForUser(user) });
    });
  });
}
