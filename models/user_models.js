const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseValidator = require('mongoose-validator');
var emailValidator = [
  mongooseValidator({
    validator: 'isEmail',
    passIfEmpty: false,
    message: 'Email should be an email',
  }),

]
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, validate : emailValidator  },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);