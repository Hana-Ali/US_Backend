const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel.js');
const cloudinary = require('cloudinary').v2;
const UsersModel = require('../models/UsersModel.js');



//product creation route
// http://www.myapp.com/product/add
router.post(
    '/add',
    async (req, res) => {

        // Capture data from client (e.g, Postman or Browser)
        const formData = {
            "title": req.body.title,
            "description": req.body.description,
            "price": req.body.price,
            "color": req.body.color,
            "associatedUsername": req.body.associatedUsername
        };
        
        // Instantiating an object for this data specifically
        const newProductsModel = new ProductsModel(formData);

        
        // Create an object which holds the value of the sent user file
        const theFiles = Object.values(req.files);
        // If user actually sent files, the length of the files would be > 0
        // Thus, here we check if any files were sent
        if (theFiles.length > 0) {
            // Cloudinary upload function
            await cloudinary.uploader.upload(
                // Path of profile pic, first picture sent
                theFiles[0].path,
                // Uploading the file to cloudinary
                (cloudinaryErr, cloudinaryResult) => {
                    // If error, send error
                    if (cloudinaryErr) {
                        console.log(cloudinaryErr)
                    }
                    // If works fine, set the newUsersModel avatar to the generated cloudinary url
                    else {
                        newProductsModel.productImage = cloudinaryResult.url

                        UsersModel
                            .findOneAndUpdate(
                                { "userName": formData.associatedUsername },
                                {
                                    $push: {
                                        "productsArray": {
                                            "pictureUrl": cloudinaryResult.url,
                                            "pictureTitle": formData.title,
                                            "pictureDescription": formData.description
                                        }
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
                }
            );
        }



        newProductsModel
        .save() //  Promise
        .then( //resolved...
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        .catch( //rejected...
            (error) => {
                res.send(error)
            }
        );
    }
);


// products listing route
// http://www.myapp.com/product/find
router.get(
    '/find',
    (req, res) => {

        // Use the Mongo Model for Products to find a product
        ProductsModel
        .find(
            { type: 'oil on canvas'}
        )
        // If the item is found in the database...
        .then(
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        // If the item is NOT found in the database...
        .catch(
            (error) => {
                console.log('mongoose error', error);
            }
        );
    }
);

// Route for updating the product in the database
// http://www.myapp.com/product/update
router.post(
    '/update',
    (req, res) => {
        // In order to update, we need to find an instance of the object and update it. This is done using the
        // findOneAndUpdate method on the general ProductsModel object. It takes as the first argument what to find,
        // and the second is what to do to change the object
        ProductsModel
        .findOneAndUpdate(
            // Finding the object by name
            { name: 'Grompy' },
            {
                // By default, the syntax for changing something is as follows
                $set: {
                    price: 100
                }
            }
        )
        // if MongoDB connection works, then send out the new document
        .then(
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        // if MongoDB connection doesn't work, then send the error
        .catch(
            (error) => {
                res.send(error);
            }
        )
    }
);

router.get(
    '/',
    (req, res) => {

        // Use the Mongo Model for Products to find a product
        ProductsModel
            .find()
            // If the item is found in the database...
            .then(foundProducts => res.json((foundProducts)))
            // If the item is NOT found in the database...
            .catch(
                (error) => {
                    console.log('mongoose error', error);
                }
            );
    }
);

// Export the routes
module.exports = router;