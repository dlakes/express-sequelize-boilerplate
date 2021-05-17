const express = require('express');
const router = express.Router();
const passport = require('passport')
require('../config/passport')

// import controller
var AccountCtrl =  require('../controllers/AccountCtrl');

//middleware
var jwtMiddleWare = passport.authenticate('jwt', {session: false});

// Routes
router.get('/profile',[jwtMiddleWare], AccountCtrl.getProfile);

module.exports = router;