#!/usr/bin/env nodejs

const express = require('express');
const app = express();
const helpers = require('./config/helpers');
//const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');

//Load Environment Variables
require('dotenv').config();
//Connect to DataBase
require('./database/db');

// const xss = require('xss');
// const rate = require('express-rate-limit');
// const multer = require('multer');
// const httpErrors = require('http-errors');
// const socket = require('socket.io');

// set security HTTP headers
app.use(helmet());

//sanitize request data
//app.use(xss());

//gzip compression
app.use(compression());

//Cross origin fix
app.use(cors());

// Logger
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

//Parses requests body
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Initialise Passport
app.use(passport.initialize());

//Cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method == "OPTIONS")
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }

    next();
})

//include route module
const authRoute = require('./routes/auth');
const startRoute = require('./routes/start');

//App Routes
app.use('/api/', authRoute);
app.use('/api/auth/', startRoute);

//Error handling
app.use( (err, req, res, next) => {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
});

app.use((error, req, res, next) => {
    if(error.message == "Unauthorized")
    {
        return res.status(401).json(
            helpers.sendError("Email does not exist")
        );
    }
    
    res.status(error.status || 500);
    res.json({
        error: {
            status: "ERROR",
            message: error.message
        }
    })
})

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage
  
    if (err.errors) {
      // mongoose validation error
      errCode = 400 // bad request
      const keys = Object.keys(err.errors)
      // report the first validation error
      errMessage = err.errors[keys[0]].message
    } else {
      // generic or custom error
      errCode = err.status || 500
      errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
      .send(errMessage)
})

//Landing Page
app.use('/', function(req, res, next){
    res.send("If you are here. Then you are lucky");
});

const PORT = process.env.PORT || 3014;

app.listen(PORT, err => {
    if (err) {
        throw err;
    } else {
        console.log('Server running on port: '+PORT);
    }
});
