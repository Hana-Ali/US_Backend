// Importing mongoose to be able to make models and schemas
const mongoose = require('mongoose');

// Creating the products schema
const ProductsSchema = mongoose.Schema(
    {
        // Name is required 
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        // Price is required 
        price: {
            type: String,
            required: true
        },
        // To match template
        color: {
            type: String,
            required: true
        },
        // link for image
        productImage: {
            type: String,
            required: true
        },
        associatedUsername: {
            type: String,
            required: true
        }
    }
);

// Creating a model of the schema. Takes the collection name and the schema
const ProductsModel = new mongoose.model('products', ProductsSchema);

// Exporting the model 
module.exports = ProductsModel;