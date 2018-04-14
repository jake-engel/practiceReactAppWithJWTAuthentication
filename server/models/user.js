const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true // automatically turns any strings saved in db to lowercase
  },
  password: {
    type: String,
    required: true
  }
});

// On save hook, ecrypt the password
// Pre function runs before the user gets saved to the db
userSchema.pre('save', function(next) {
  const user = this; // because you are using this, you must NOT use fat arrow function above
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
