const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')

router.use((req, res, next) =>{
    res.json({message: 'Votre reqête a bien été reçue'})
});

module.exports = router;