var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var favoritoSchema = new Schema({
    favoritos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cuestionario'
        }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
        timestamps: true
    });

var Favorites = mongoose.model('Favorite', favoritoSchema);

module.exports = Favorites;