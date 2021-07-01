const User = require("../models/user_models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var passwordValidator = require('password-validator');

exports.signup = (req, res, next) => {
  var schema = new passwordValidator();

 
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
// console.log(schema.validate('validPASS123'));
if(!schema.validate(req.body.password)){
  return res.status(400).json({message: "majuscules et chiffre requis pour le mot de passe !" }); 
}

  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({ email: req.body.email, password: hash });
    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
      .catch((error) => res.status(400).json({ error }));
  });
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          let usertoken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          res.status(200).json({
            userId: user._id,
            token: usertoken,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
    
};
