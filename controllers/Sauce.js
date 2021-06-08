const Sauce = require('../models/Sauce.js')
const fs = require('fs');

exports.addSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.parse(req.body.Sauce));
    delete SauceObject._id;
    const Sauce = new Sauce({
        ...SauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    Sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};
exports.updateSauce = (req, res, next) => {
    const SauceObject = req.file ?
    {...JSON.parse(req.body.Sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } 
    :    
    { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, {...SauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(Sauce => {
        const filename = Sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((Sauce) => res.status(200).json(Sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then((Sauces) => res.status(200).json(Sauces))
        .catch((error) => res.status(400).json({ error }));
};
 
exports.addlike = (req,res,next) => {
        let sauceid= req.params.id;
        let userid= req.body.userId;
        let like=   req.body.like;//-1=dislike 0=neutre 1=like
        if (like==1){
            Sauce.updateOne({ _id: sauceid }, {$inc:{likes:1},$push:{usersLiked:userid} })// rajout de luser a userliked
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        else if (like==-1) {
            Sauce.updateOne({ _id: sauceid }, {$inc:{dislikes:1},$push:{usersDisliked:userid} })
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));

        }
        else if (like==0)
        {
            
        }
        
}

exports.test = (req,res,next) => {
    console.log(req.params.id)
 }