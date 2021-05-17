const db  = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcryptjs');
const helpers = require('../config/helpers');
const jwt_decode = require('jwt-decode');
const Joi = require('joi');

const loginSchema = Joi.object().keys({
    email: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
}).unknown();
 
const signToken = (user) => {

  var token = jwt.sign({
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  },
    process.env.SECRET,
    {
      expiresIn: 1800
    }
  );

  var decoded = jwt_decode(token);

  db.Oauth.create(decoded);
  return token;

};

module.exports = {
  
Login: async (req, res, next) => {

  const validate = Joi.validate(req.body, loginSchema)

  if(validate.error != null)
  {
      const errorMessage = validate.error.details.map(i => i.message).join('.');
      return res.status(400).json(
          helpers.sendError(errorMessage)
      );
  }

  var user = await db.User.findOne({ where: { email: req.body.email }});

  if(user)
  {
    if(bcrypt.compareSync(req.body.password, user.password))
    { 
      const token = signToken(user);

      return res.status(200).json({
        success: {
          token: token
        }
      });

    }
    else
    {
      res.status(400).json(
        helpers.sendError("Incorrect Password!")
      );
    }

  }

  return res.status(400).json(
    helpers.sendError("Account does not exist")
  );

}

};