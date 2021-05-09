// ----------------------------------- Importing the necessary modules

// Express
const express = require('express');
// Express file reader
const expressFormData = require('express-form-data');
// Dotenv
require('dotenv').config();
// Mongoose
const mongoose = require('mongoose');
// Cloudinary (image upload)
const cloudinary = require('cloudinary');
// User routes, redirects any http://myapp.com/user requests
const usersRoutes = require('./routes/user');
// Product routes, redirects any http://myapp.com/product requests
const productRoutes = require('./routes/products');
// Passport for login authentication
const passport = require('passport');
// PassportJWT strategy and Extraction 
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// User models
const UsersModel = require('./models/UsersModel');

// ----------------------------------- Necessary configurations and declarations

// Create server
const server = express();
// Configure server to be able to read body of packets, specifically urlencoded
server.use(express.urlencoded({ extended: false }));
// Configure server to read json data in body
server.use(express.json());
// Configure server to read form data, or files
server.use(expressFormData.parse());
// Configure server to be able to serve public files
server.use(express.static("public"));

// MongoDB connection string
const connectionString = process.env.DB_CONNECTION_STRING;
// Connection configuration for mongoose
const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
// Mongoose configuration to connect it to MongoDB
mongoose
.connect(connectionString, connectionConfig)
.then(
    () => {
        console.log('connected to database');
    }
)
.catch(
    (error) => {
        console.log('database error', error);
    }
);

// Cloudinary configurations
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

// Obtaining jwtSecret from .env file
const jwtSecret = process.env.JWT_SECRET;
// Configuration of passport for jwt 
const passportJwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Where the jwt string is
    secretOrKey: jwtSecret
}
// This function reads the contents (payload) of the jsonwebtoken
const passportJwt = (passport) => {
    // Configuring passport to use passport jwt
    passport.use(
        new JwtStrategy(
            // Use the specified configurations
            passportJwtConfig,
            (jwtPayload, done) => {
                // Extract and find user by ID
                UsersModel
                // Search by the payload ID. If there's a match, .then(), we return the entire method
                .findOne({ _id: jwtPayload.id })
                .then(
                    // If document is found 
                    (dbDocument) => {
                        return done(null, dbDocument);
                    }
                )
                // If something goes wrong with database search
                .catch(
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

// Invoking the function 
passportJwt(passport);

// ----------------------------------- Main server routes

// Landing page
server.get(
    '/',
    (req, res) => {
        res.sendFile(__dirname + '/index.html');
    }
);
// Ensuring proper user redirection 
server.use(
    '/user',
    usersRoutes
);
// Ensuring proper products redirection
server.use(
    '/product',
    productRoutes
);

// Making the general art-gallery route
server.get(
    '/art-gallery',
    (req, res) => {
        res.send("Art gallery here!")
    }
)

// Making the general illustrator route
server.get(
    '/illustrator-gallery',
    (req, res) => {
        res.send("Illustrator gallery here!")
    }
)

// Making the challenges route
server.get(
    '/challenges',
    (req, res) => {
        res.send("Challenges here!")
    }
)

// Default 404 behavior
server.get(
    '*',
    (req, res) => {
        res.send("<h1>404</h1>");
    }
)

// ----------------------------------- Server listening

// Allowing flexibility in port choice, or default 3001
server.listen(
    process.env.PORT || 3001,
    () => {
        console.log('connected to http://localhost:3001');
    }
);