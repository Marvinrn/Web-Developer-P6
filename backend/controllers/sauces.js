const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        // on recupère les infos de la requête avec le spread operator
        ...sauceObject,
        // on recupère les segments necessaire de l'url de image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        dislikes: 0,
        likes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    // on fait une condition lorsqu'il y a une nouvelle image afin de savoir de quel manière traiter la modification
    const sauceObject = req.file ?
        // si on trouve un fichier, on modifie l'image
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // sinon on prend le corps de la requête 
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
    const like = req.body.like

    // si on like une sauce
    if (like == 1) {
        Sauce.updateOne(
            // on cible la sauce
            { _id: req.params.id },
            {
                // on ajoute 1 like selon le user qui l'a mit
                $push: { usersLiked: req.body.userId },
                $inc: { likes: +1 }
            })
            .then(() => res.status(200).json({ message: 'Sauce liked' }))
            .catch((error) => res.status(400).json({ error }));
    };
    // // si on dislike une sauce
    if (like == -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: +1 }
            })
            .then(() => res.status(200).json({ message: 'Sauce disliked' }))
            .catch((error) => res.status(400).json({ error }));
    };
    // si on annule un like
    if (like == 0) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 }
                        })
                        .then(() => res.status(200).json({ message: 'Like annulé' }))
                        .catch((error) => res.status(400).json({ error }))
                }

                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 }
                        })
                        .then(() => res.status(200).json({ message: 'Dislike annulé' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({ error }))
    }
};
