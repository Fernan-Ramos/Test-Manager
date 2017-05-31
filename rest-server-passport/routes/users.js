/**
 * @author Fernán Ramos Saiz
 * @version 1.0
 * @description Fichero donde se realizan las operaciones CRUD de la ruta user
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/**
 * Ruta user
 */

/**
 * Se obtienen todos los usuarios
 */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

/**
 * Ruta user/register
 */

/**
 * @property post
 * Permite realizar el regsitro de usuarios
 */
router.post('/register', function (req, res) {
  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      //Se obtiene el nombre del usuario
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      //Se obtiene el apellido del usuario
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      //Se guarda en la colección user los datos del usuario
      user.save(function () {
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({
            status: 'Registration Successful!'
          });
        });
      });
    });
});


/**
 * Ruta user/login
 */

/**
 * @property post
 * Permite realizar el login de usuarios
 */
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
      //Si no se puede realizar el login
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      //Variable donde se almacena el token del usuario
      var token = Verify.getToken({
        "username": user.username,
        "_id": user._id,
        "admin": user.admin
      });
      //Si el lógin se realiza con éxito
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

/**
 * Ruta user/logout
 */

/**
 * @property get
 * Permite realizar el sign out de usuarios
 */
router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;