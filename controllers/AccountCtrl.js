const db = require('../database/db');
const helpers = require('../config/helpers');
require('dotenv').config();

module.exports = {

getProfile: async(req, res, next) => {

  return res.status(200).json({
    "success": {
      "status": "SUCCESS",
      'data': req.user
    }
  });
}

}

