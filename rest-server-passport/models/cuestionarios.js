var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);


var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    pregunta: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    r1: {
        type: String,
        required: true
    },
    r2: {
        type: String,
        required: true
    },
    r3: {
        type: String,
        required: true
    },
    r4: {
        type: String,
        required: true
    },
    rcorrect: {
        items: {
            type: String,
            required: true
        },
        type: Array
    },
}, {
    timestamps: true
});

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
    questions: [questionSchema],
    tests:[],
    stats:[],
}, {
    timestamps: true
});

var cuestionariosSchema = new Schema({
     postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cuestionarios:[
       cuestionarioSchema
    ]
})

var Cuestionarios = mongoose.model('Cuestionario', cuestionariosSchema);

module.exports = Cuestionarios;