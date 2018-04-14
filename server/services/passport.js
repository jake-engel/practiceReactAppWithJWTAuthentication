const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify email and password, call done with user if correct
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err, false); }
    if (!user) { return done(null, false); }

    // compare password - is 'password' equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    });
  });

  // Calse done with false if not correct
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if user_id in the payload exists in our database,
  // if so call done with that user, if not call done with empty object
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }
    user ? done(null, user) : done(null, false);
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
