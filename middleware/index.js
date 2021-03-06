/*jshint esversion: 6 */
'use strict';

const
  User = require('../models/user'),
  Gift = require('../models/gift');

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = middlewareObj;