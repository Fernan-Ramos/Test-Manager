/**
    Test-Manager
    Copyright (c) 2016 - 2017 Fernán Ramos Sáiz
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author Fernán Ramos Saiz
 * @version 1.0
 * @description Modelo mongoose de cuestionarios
 */

var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);


var Schema = mongoose.Schema;

var cuestionarioSchema = new Schema({
    title: {
        type: String,
        required: true,
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