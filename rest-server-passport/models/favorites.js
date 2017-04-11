var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var favoritoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    text: {
        type: String,
    },
    questions: [],
    tests: [],
    stats: [],
}, {
    timestamps: true
});

var favoritosSchema = new Schema({
    favoritos: [
        favoritoSchema
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoritosSchema);

module.exports = Favorites;