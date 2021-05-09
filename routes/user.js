// ------------------------------------- Importing the necessary files
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UsersModel = require('../models/UsersModel.js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// ------------------------------------- Creating a route for user add
// http://www.myapp.com/user/register
router.post(
    '/register',
    (req, res) => {
        // (1) Getting the form data from user
        const formData = {
            "userName": req.body.userName,
            "password": req.body.password,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phoneNumber": req.body.phoneNumber,
            "address":req.body.address
        };

        // (2) Create instance of UsersModel
        const newUsersModel = new UsersModel(formData);

        // (3) Check if email exists
        UsersModel
        .findOne(
            { email: formData.email }
        )
        // If findOne() connects to MongoDB
        .then(
            // Start an async function
            async (dbDocument) => {
                // (4.a) if email already in database
                if(dbDocument) {
                    res.send("Sorry. An account with that email already exists");
                }
                // (4.b) if email not in database
                else {
                    // Create an object which holds the value of the sent user file
                    const theFiles = Object.values(req.files);
                    // If user actually sent files, the length of the files would be > 0
                    // Thus, here we check if any files were sent
                    if( theFiles.length > 0 ) {
                        // Cloudinary upload function
                        await cloudinary.uploader.upload(
                            // Path of profile pic, first picture sent
                            theFiles[0].path,
                            // Uploading the file to cloudinary
                            (cloudinaryErr, cloudinaryResult) => {
                                // If error, send error
                                if(cloudinaryErr) {
                                    console.log(cloudinaryErr)
                                }
                                // If works fine, set the newUsersModel avatar to the generated cloudinary url
                                else {
                                    newUsersModel.avatar = cloudinaryResult.url
                                }
                            }
                        );
                    }
                    // (5) Create a hashed password for user
                    // (5.a) Generate salt
                    bcryptjs.genSalt(
                        (err, theSalt) => {
                            // (6) Hash function for the password
                            bcryptjs.hash(
                                formData.password,
                                theSalt,
                                (err, hashedPassword) => {
                                    // Set newUsersModel password to the hashed password created
                                    newUsersModel.password = hashedPassword;
                                    // (7) Saving the new password in the database
                                    newUsersModel
                                    .save()
                                    // If MongoDB connects
                                    .then( 
                                        (dbDocument) => {
                                            res.send(dbDocument)
                                        }
                                    )
                                    // If MongoDB doesn't connect
                                    .catch( 
                                        (error) => {
                                            console.log('error', error);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            }
        )
        // If connection to MongoDB fails
        .catch(
            (error) => {
                res.send('error')
            }
        )
    }
);

// ------------------------------------- Creating route for user update
// http://www.myapp.com/user/update
router.post(
    '/update',
    (req, res) => {
        UserModel
        .findOneAndUpdate(
            { 'firstName': 'John'},
            {
                $set: {
                    'firstName':'Jonathan'
                }
            }
        )
        .then(
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        .catch(
            (error) => {
                res.send("error", error)
            }
        )
    }
);

// ------------------------------------- Creating a route for user login
// http://www.myapp/com/user/login
router.post(
    '/login',
    (req, res) => {
        // (1) Capturing user data 
        const formData = {
            "userName": req.body.userName,
            "password": req.body.password
        };

        // (2) Checking for user existence in database
        UsersModel
            .findOne({ userName: formData.userName })
        .then(
            (dbDocument) => {
                // (3.a) If no account match found
                if (!dbDocument) {
                    res.send("Sorry. Wrong username or password");
                }
                // (3.b) if there is a match in database 
                else {
                    // (4) Check if password is correct 
                    bcryptjs 
                    .compare(formData.password, dbDocument.password)
                    // If MongoDB connects
                    .then(
                        (isMatch) => {
                            // (5.a) If password is incorrect, reject login 
                            if (!isMatch) {
                                res.send("Sorry. Wrong username or password");
                            }
                            // (5.b) If password is correct 
                            else {
                                // (6) Prepare payload of web token
                                const payload = {
                                    // Payload consist of userID only 
                                    id: dbDocument.id
                                }
                                // (7) Send the jsonwebtoken to client 
                                jwt 
                                .sign(
                                    payload, 
                                    jwtSecret, 
                                    (err, jsonwebtoken) => {
                                        res.send(jsonwebtoken);
                                    }
                                );
                            }
                        }
                    )
                    // If MongoDB doesn't connect
                    .catch(
                        (error) => {
                            res.send(error);
                        }
                    )
                }
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
    }
);

// ------------------------------------- Creating a route for generic user
// http://www.myapp.com/user/:name
router.get(
    '/:name',
    (req, res) => {
        // Getting the name from the parameter request
        const {name} = req.params;
        res.send(`This is ${name}'s profile`);
    }
)

module.exports = router;