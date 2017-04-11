var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

var Verify = require('./verify');

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id})
            .populate('favoritos')
            .populate('postedBy')
            .exec(function (err, favorites) {
                if (err) throw err;
                res.json(favorites);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({'postedBy': req.decoded._doc._id}, function (err, favorite) {
            if (err) throw err;
            if (!favorite) {
                Favorites.create(req.body, function (err, favorite) {
                    if (err) throw err;
                    console.log('Favorite created!');
                    favorite.postedBy = req.decoded._doc._id;
                    favorite.favoritos.push(req.body._id);
                    favorite.save(function (err, favorite) {
                        if (err) throw err;
                        res.json(favorite);
                    });
                });
            } else {
                var cuestionario = req.body._id;

                if (favorite.favoritos.indexOf(cuestionario) == -1) {
                    favorite.favoritos.push(cuestionario);
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    res.json(favorite);
                });
            }
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favoriteRouter.route('/:cuestId')

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOneAndUpdate({'postedBy': req.decoded._doc._id}, {$pull: {favoritos: req.params.cuestId}}, function (err, favorite) {
            if (err) throw err;
            Favorites.findOne({'postedBy': req.decoded._doc._id}, function(err, favorite){
                res.json(favorite);
            });
        });
    });


module.exports = favoriteRouter;