const request = require('request');
const db  = require('../database/db');
const axios = require('axios');

const sendError = message => {
    var error = {
        "error": {
            "status": "ERROR",
            "message": message
        }
    }

    return error;
}

const sendSuccess = message => {
    var success = {
        "success": {
            "status": "SUCCESS",
            "message": message
        }
    }

    return success;
}

const checkUserPhone = async function checkUserMobile(req) {
    return await db.User.findOne({ 
        where: {
        mobile: req.body.mobile }
    });
}

const checkUserEmail = async function createUserMail(req) {
    return await db.User.findOne({ 
        where: {
        email: req.body.email }
    });
}

const checkUserToken = async function checkToken(token) {
    return await db.Oauth.findOne({ 
        where: {
        token: token }
    });
}

const checkUserTransaction = async function checkTransaction(reference) {
    return await db.Transaction.findOne({ 
        where: {
        reference: reference }
    });
}

const generateOTP = async function generateOTP()
{
    return Math.floor(100000 + Math.random() * 900000);
}

const timestamp = async  => {
    return Date.now()/1000 | 0;
 }

const authCheck = async function generateOTP(req) {
    if(req.user)
    {
        return true;
    }

    return false;
}

function generateString(length)
{
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   var charactersLength = characters.length;

   for ( var i = 0; i < length; i++ ) 
   {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
   
}

function generateClientId(length)
{
   var result           = '';
   var characters       = '123456789123456789123456789';
   var charactersLength = characters.length;

   for ( var i = 0; i < length; i++ ) 
   {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}

module.exports = {
    authCheck,
    sendError,
    sendSuccess,
    checkUserEmail, 
    checkUserPhone, 
    checkUserToken, 
    generateOTP,
    checkUserTransaction,
    timestamp,
    generateString,
    generateClientId,
};