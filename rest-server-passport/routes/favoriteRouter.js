var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

var Verify = require('./verify');

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({
                'postedBy': req.decoded._id
            })
            .populate('favoritos')
            .populate('postedBy')
            .exec(function (err, favorites) {
                if (err) return next(err);
                res.json(favorites);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({
            'postedBy': req.decoded._id
        }, function (err, favorite) {
            if (err) return next(err);
            if (!favorite) {
                Favorites.create(req.body, function (err, favorite) {
                    if (err) return next(err);
                    favorite.postedBy = req.decoded._id;
                    favorite.favoritos.push(req.body);
                    favorite.save(function (err, favorite) {
                        if (err) return next(err);

                        res.json(favorite);
                    });
                });
            } else {
                var cuestionario = req.body;

                if (favorite.favoritos.indexOf(cuestionario) == -1) {
                    favorite.favoritos.push(cuestionario);
                }
                favorite.save(function (err, favorite) {
                    if (err) return next(err);
                    res.json(favorite);
                });
            }
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOneAndUpdate({
            'postedBy': req.decoded._id
        }, {
            $pull: {
                favoritos: {
                    _id: req.query._id
                }
            }
        }, function (err, favorite) {
            if (err) return next(err);
            Favorites.findOne({
                'postedBy': req.decoded._id
            }, function (err, favorite) {
                res.json(favorite);
            });
        });
    });



module.exports = favoriteRouter;