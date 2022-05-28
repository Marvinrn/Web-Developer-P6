const mongoose = require('mongoose');

//instalation du package mongoose-unique-validator pour réduire les erreurs de mongodb
const uniqueValidator = require('mongoose-unique-validator')

// creation de notre schema pour les users avec la fonction schema de mongoose
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// permet de pas avoir plusieurs utilisateur avec la même adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);