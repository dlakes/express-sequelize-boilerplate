const db = require('../database/db');
const helpers = require('../config/helpers');
const sendotp = require('../mailer/sendotp');
const bcrypt = require('bcryptjs');
var uuid = require('node-uuid');
const Joi = require('joi');

const registerSchema = Joi.object().keys({
  email: Joi.string().min(5).required(),
  mobile: Joi.string().min(3).required(),
  password: Joi.string().required()
}).unknown();

const validateOTPschema = Joi.object().keys({
  otp: Joi.string().min(4).required(),
  mobile: Joi.string().min(5).required()
}).unknown();

module.exports = {

Register: async (req, res, next) => {

  const validate = Joi.validate(req.body, registerSchema)

  if (validate.error != null) {
    const errorMessage = validate.error.details.map(i => i.message).join('.');
    return res.status(400).json(
      helpers.sendError(errorMessage)
    );
  }

  var checkEmail = await helpers.checkUserEmail(req);

  if (checkEmail) {
    return res.status(400).json(
      helpers.sendError("Email already in use!")
    );
  }

  var code = await helpers.generateOTP();

  const createUser = await db.User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    mobile: req.body.mobile,
    email: req.body.email.toLowerCase(),
    password: bcrypt.hashSync(req.body.password),
    uuid: uuid(),
  });

  if (createUser) {
    return res.status(200).json(
      helpers.sendSuccess("Account created successfully")
    );
  }
  else 
  {
    res.status(400).json(
      helpers.sendError("Error ocurred!")
    )
  }
}

}