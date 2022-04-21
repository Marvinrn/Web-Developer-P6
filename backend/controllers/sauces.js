const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//middleware pour supprimé un objet
exports.deleteSauce = (req, res, next) => {
    // on trouve l'objet dans la base de donnée
    Sauce.findOne({ _id: req.params.id })
        //on extrait le nom du fichier à supprimer
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            // avec fs.unlink, on supprime le fichier
            fs.unlink(`images/${filename}`, () => {
                //suppression de l'objet dans la base de donnée une fois que le fichier a été supprimé
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    let like = req.body.like;

    // si on like une sauce
    if (like === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersLiked : req.body.userId },
                $inc: { likes: +1 }
            })
            .then(() => res.status(200).json({ message: 'Sauce liked' }))
            .catch((error) => res.status(400).json({ error }));
    };
    // si on dislike une sauce
    if (like === -1) {
        Sauce.updateOne(
            { _id: sauceId },
            {
                $push: { usersDisliked: req.body.userId },
                $inc: { likes: -1 }
            })
            .then(() => res.status(200).json({ message: 'Sauce disliked' }))
            .catch((error) => res.status(400).json({ error }));
    };
    // si on annule un like
};