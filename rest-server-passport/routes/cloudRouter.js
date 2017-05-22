var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var Clouds = require('../models/clouds');

var cloudRouter = express.Router()
var verify = require('./verify');
cloudRouter.use(bodyParser.json({ limit: '1024mb' }))


cloudRouter.route('/')

    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        Clouds.find(req.query)
            .exec(function (err, cuest) {
                if (err) return next(err);
                res.json(cuest);
            });
    })

    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        Clouds.create(req.body, function (err, cuest) {
            if (err) return next(err);
            cuest.save(function (err, cuest) {
                if (err) return next(err);
                res.json(cuest);
            });

        });
    });

module.exports = cloudRouter;