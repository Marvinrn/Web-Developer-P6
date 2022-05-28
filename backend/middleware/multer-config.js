const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// on crée un objet de configuration de multer
const storage = multer.diskStorage({
    // fonction qui permet à multer de savoir dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // fonction qui permet à multer de savoir quel nom de fichier utiliser
    filename: (req, file, callback) => {
        // on remplace les espaces par des underscore afin de limiter les problèmes
        const name = file.originalname.split(' ').join('_');
        // on génère l'extension du fichier grâce aux mime_types
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});


module.exports = multer({ storage }).single('image');