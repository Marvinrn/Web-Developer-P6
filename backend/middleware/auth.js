const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // on recupère le token dans le header authorization
        const token = req.headers.authorization.split(' ')[1];
        // on decode le token
        const decodedToken = jwt.verify(token, process.env.MY_TOKEN);
        // on recupère le userId lié au token 
        const userId = decodedToken.userId;
        req.auth = { userId };
        // on verifie que si dans la requête le userId correspond bien à celui du token
        if (req.body.userId && req.body.userId !== userId) {
            // si different on renvoit une erreur
            throw 'User ID non valable'
        } else {
            // on passe ensuite la requête si tout vas bien
            res.locals.userId = userId
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' })
    };
} 