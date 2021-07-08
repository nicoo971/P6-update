const Sauce = require('../models/Sauce.js')
const fs = require('fs');
const { json } = require('body-parser');

exports.addSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce);
    delete SauceObject._id;
    console.log(typeof SauceObject);
    const sauce = new Sauce({
        ...SauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersLiked: []

    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};
exports.updateSauce = (req, res, next) => {
    const SauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        :
        { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...SauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauceToDelete => {
            const filename = sauceToDelete.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.addlike = (req, res, next) => {
    let sauceid = req.params.id;
    let userid = req.body.userId;
    let likeStatusRequested = req.body.like;//-1=dislike 0=neutre 1=like
    Sauce.findOne({ _id: sauceid })
        .then((sauce) => {
            if (likeStatusRequested == 1) {
                if (!sauce.usersLiked.includes(userid)) {
                    Sauce.updateOne({ _id: sauceid }, { $inc: { likes: 1 }, $push: { usersLiked: userid } })// rajout de luser a userliked
                        .then(() => res.status(200).json({ message: "Objet modifié !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                else {
                    res.status(404).json('deja like')
                }
            }
            else if (likeStatusRequested == -1) {
                if (!sauce.usersDisliked.includes(userid)) {
                    Sauce.updateOne({ _id: sauceid }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userid } })
                        .then(() => res.status(200).json({ message: "Objet modifié !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                else {
                    res.status(404).json('deja unlike')
                }


            }
            else if (likeStatusRequested == 0) {
                if (sauce.usersLiked.includes(userid)) {
                    Sauce.updateOne({ _id: sauceid }, { $inc: { likes: -1 }, $pull: { usersLiked: userid } })
                        .then(() => res.status(200).json({ message: "Objet modifié !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                else if (sauce.usersDisliked.includes(userid)) {
                    Sauce.updateOne({ _id: sauceid }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userid } })
                        .then(() => res.status(200).json({ message: "Objet modifié !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            }
        })
        .catch((error) => {
            res.status(404).json({ error })
        }
        );






}

exports.test = (req, res, next) => {
    console.log(req.params.id)
}