const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel.js');



//product creation route
// http://www.myapp.com/product/add
router.post(
    '/add',
    (req, res) => {

        // 1. Capture data from client (e.g, Postman or Browser)
        const formData = {
            "name": req.body.name,
            "dimensions": req.body.dimensions,
            "price": req.body.price,
            "type": req.body.type
        }
        
        // 2. Upload the data to MongoDB

        // Instantiating an object for this data specifically
        const newProductsModel = new ProductsModel(formData);

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

// Export the routes
module.exports = router;