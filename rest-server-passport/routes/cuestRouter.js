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
 * @description Fichero donde se realizan las operaciones CRUD de la ruta cuestionarios
 */
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

// Variable que almacena el objeto cuestionarios
var Cuestionarios = require('../models/cuestionarios');

var cuestRouter = express.Router()
var verify = require('./verify');
cuestRouter.use(bodyParser.json({
    limit: '1024mb'
}))

/**
 * Ruta cuestionarios
 */
cuestRouter.route('/')
    /**
     * @property get
     * 1- Se verifica que el usuario es del sistema
     * 2- Se obtiene los cuestionarios de dicho usuario
     */
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.find({
                'postedBy': req.decoded._id
            })
            //Identifica el array cuestionarios
            .populate('cuestionarios')
            //Identifica el id del usuario 
            .populate('postedBy')
            .exec(function (err, cuest) {
                if (err)
                    return next(err);
                res.json(cuest);
            });
    })
    /**
     * @property  post
     * 1- Se verifica que el usuario es del sistema 
     * 2- Se obtiene los cuestionarios de dicho usuario
     * 3- Se guarda el cuestionario pasado por parámetro 
     * 
     */
    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOne({
            'postedBy': req.decoded._id
        }, function (err, cuest) {
            if (err)
                return next(err);
            //Si no existe el array de cuestionarios
            if (!cuest) {
                //Se crea la colección de cuestionarios
                Cuestionarios.create(req.body, function (err, cuest) {
                    if (err)
                        return next(err);
                    //Este atributo define el id del usuario y que servirá para identificar los cuestionarios del usuario
                    cuest.postedBy = req.decoded._id;
                    //Se guarda el cuestionario en el array de cuestionarios
                    cuest.cuestionarios.push(req.body);
                    //Se guarda el array de cuestionarios en la colección
                    cuest.save(function (err, cuest) {
                        if (err)
                            return next(err);
                        //Se obtiene una respuesta en formato json
                        res.json(cuest);
                    });
                });
            } else {
                //Se obtiene el cuerpo del objeto cuestionario
                var cuestionario = req.body;
                //Si no está en el array de cuestioanarios
                if (cuest.cuestionarios.indexOf(cuestionario) == -1) {
                    //Se guarda el cuestionario en el array de cuestionarios
                    cuest.cuestionarios.push(cuestionario);
                }
                //Se guarda el array de cuestionarios en la colección
                cuest.save(function (err, cuest) {
                    if (err)
                        return next(err);
                    //Se obtiene una respuesta en formato json
                    res.json(cuest);
                });
            }
        });
    })
    /**
     * @property delete
     * 1- Se verifica que el usuario es del sistema 
     * 2- Se obtiene los cuestionarios del usuario
     * 3- Se elimina el cuestionario pasado por parametro
     */
    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOneAndUpdate({
            'postedBy': req.decoded._id
        }, {
            $pull: {
                cuestionarios: {
                    _id: req.query._id
                }
            }
        }, function (err) {
            if (err)
                return next(err);
            res.json(cuest);

        });
    });

/**
 * Ruta cuestionarios/cloud
 */

cuestRouter.route('/cloud')
    /**
     * @property get
     * 1- Se verifica que el usuario es del sistema 
     * 2- Se obtiene todos los cuestionarios públicos
     */
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.find(req.query)
            .exec(function (err, cuest) {
                if (err)
                    return next(err);
                res.json(cuest);
            });
    });

/**
 * Ruta cuestionarios/:id
 */
cuestRouter.route('/:cuestId')

    /**
     * @property  get
     * 1- Se verifica que el usuario es del sistema 
     * 2- Se obtiene el cuestionario del usuario con id del cuestionario pasado por parámetro
     */
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOne({
            'postedBy': req.decoded._id
        }, {
            cuestionarios: {
                $elemMatch: {
                    _id: req.params.cuestId
                }
            }
        }, function (err, cuest) {
            if (err)
                return next(err);
            res.json(cuest);
        });
    })

    /**
     * @property put
     * 1- Se verifica que el usuario es del sistema 
     * 2- Se obtiene el cuestionario del usuario con id del cuestionario pasado por parámetro
     * 3- Se actualiza la información del cuestionario
     */
    .put(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOneAndUpdate({
            'postedBy': req.decoded._id,
            'cuestionarios._id': req.params.cuestId
        }, {
            $set: {
                'cuestionarios.$': req.body
            },
        }, {
            new: true
        }, function (err, cuest) {
            if (err)
                return next(err);
            res.json(cuest);
        });

    });



module.exports = cuestRouter