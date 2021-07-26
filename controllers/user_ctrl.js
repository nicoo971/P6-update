const User = require("../models/user_models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var passwordValidator = require('password-validator');
var crypto = require('crypto');




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
if(!validateEmail(req.body.email)){
  return res.status(400).json({message: "email non valide" }); 
}

  bcrypt.hash(req.body.password, 10).then((hash) => {
    const encryptedEmail = getEncryptedString(req.body.email);
    console.log(encryptedEmail);
    const user = new User({ email: encryptedEmail, password: hash });
    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.login = (req, res, next) => {
  const encryptedEmail = getEncryptedString(req.body.email);
  console.log(encryptedEmail);
  User.findOne({ email: encryptedEmail })
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

// https://www.npmjs.com/package/crypto-js
function getEncryptedString(data) {

  var mykey = crypto.createCipher('aes-128-cbc', process.env.CRYPTO_SECRET);
  var mystr = mykey.update(data, 'utf8', 'hex')
  mystr += mykey.final('hex');
  
  console.log(mystr);

  return mystr;
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}