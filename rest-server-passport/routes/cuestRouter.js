var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var Cuestionarios = require('../models/cuestionarios');

var cuestRouter = express.Router()
var verify = require('./verify');
cuestRouter.use(bodyParser.json())


cuestRouter.route('/')

    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.find({
                'postedBy': req.decoded._id
            })
            .populate('cuestionarios')
            .populate('postedBy')
            .exec(function (err, cuest) {
                if (err) return next(err);
                res.json(cuest);
            });
    })

    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOne({
            'postedBy': req.decoded._id
        }, function (err, cuest) {
            if (err) return next(err);
            if (!cuest) {
                Cuestionarios.create(req.body, function (err, cuest) {
                    if (err) return next(err);
                    cuest.postedBy = req.decoded._id;
                    cuest.cuestionarios.push(req.body);
                    cuest.save(function (err, cuest) {
                        if (err) return next(err);
                        res.json(cuest);
                    });
                });
            } else {
                var cuestionario = req.body;
                if (cuest.cuestionarios.indexOf(cuestionario) == -1) {
                    cuest.cuestionarios.push(cuestionario);
                }
                cuest.save(function (err, cuest) {
                    if (err) return next(err);
                    res.json(cuest);
                });
            }
        });
    })
    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findOneAndUpdate({
            'postedBy': req.decoded._id
        }, {
            $pull: {
                cuestionarios: {
                    _id: req.query._id
                }
            }
        }, function (err, cuest) {
            if (err) return next(err);
            Cuestionarios.findOne({
                'postedBy': req.decoded._id
            }, function (err, cuest) {
                res.json(cuest);
            });
        });
    });

/* Route '/:cuestId' */

cuestRouter.route('/:cuestId')
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
            if (err) return next(err);
            res.json(cuest);
        });
    })

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
            if (err) return next(err);
            res.json(cuest);
        });

    })

    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        Cuestionarios.findByIdAndRemove(req.params.cuestId, function (err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });


module.exports = cuestRouter