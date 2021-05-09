// Importing mongoose to be able to make models and schemas
const mongoose = require('mongoose');

// Creating the products schema
const ProductsSchema = mongoose.Schema(
    {
        // Name is required 
        name: {
            type: String,
            required: true
        },
        // Price is required 
        price: {
            type: Number,
            required: true
        },
        // Size of drawing is required
        dimensions: {
            type: String, // Since it'll probably be AxB
            required: true
        },
        // Type of art (oil on canvas, etc) is required 
        type: {
            type: String,
            required: true
        }
    }
);

// Creating a model of the schema. Takes the collection name and the schema
const ProductsModel = new mongoose.model('products', ProductsSchema);

// Exporting the model 
module.exports = ProductsModel;