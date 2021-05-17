const express = require('express');
const router = express.Router();
const passport = require('passport')
require('../config/passport')

//import controller
var LoginCtrl = require('../controllers/LoginCtrl');
var RegisterCtrl = require('../controllers/RegisterCtrl');
var PasswordResetCtrl = require('../controllers/PasswordResetCtrl');

//Routes
router.post('/login', LoginCtrl.Login);
router.post('/register', RegisterCtrl.Register);

//Reset Password
router.post('/password-reset', PasswordResetCtrl.ResetPassword);
router.post('/validate-token', PasswordResetCtrl.validateToken);
router.post('/update-password', PasswordResetCtrl.updatePassword);

module.exports = router;