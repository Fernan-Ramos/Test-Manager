var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CloudSchema = new Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    text: {
        type: String,
    },
    type: {
        type: String,
    },
    questions: [],
    tests: [],
    stats: [],
}, {
    timestamps: true
});



var Clouds = mongoose.model('Cloud', CloudSchema);

module.exports = Clouds;