const express = require('express');
const router = express.Router();

router.use((req, res, next) =>{
    res.json({message: 'Votre reqête a bien été reçue'})
});

module.exports = router;