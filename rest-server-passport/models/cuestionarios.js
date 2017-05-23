var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);


var Schema = mongoose.Schema;

var cuestionarioSchema = new Schema({
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
    type: {
        type: String,
    },
    cuestCloud: {
        type: Boolean,
    },
    author: {
        type: String,
    },
    questions: [],
    tests: [],
    stats: [],
}, {
        timestamps: true
    });

var cuestionariosSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cuestionarios: [
        cuestionarioSchema
    ]
})

var Cuestionarios = mongoose.model('Cuestionario', cuestionariosSchema);

module.exports = Cuestionarios;