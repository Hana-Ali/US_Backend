// Importing mongoose to be able to make models and schemas
const mongoose = require('mongoose');

// Creating a schema
const UsersSchema = mongoose.Schema(
    {
        // Most artists have an associated username which is more popular than their real name
        userName: {
            type: String,
            required: true
        },
        // Password is required. No need to explain
        password: {
            type: String,
            required: true
        },
        // First name isn't required, as username is more important
        firstName: {
            type: String,
        },
        // Last name isn't required, as username is more important
        lastName: {
            type: String,
        },
        // Email is required
        email: {
            type: String,
            required: true
        },
        // Phone number is required, so buyers can contact sellers and vice versa
        phoneNumber: {
            type: String,
            required: true
        },
        // Address isn't required
        address: {
            type: String,
        },
        // Avatar isn't required
        avatar: {
            type: String
        },
        dataCreated: {
            type: Date,
            default: Date.now
        },
        productsArray: [{
            pictureUrl: String,
            pictureTitle: String,
            pictureDescription: String
        }]
    }
);

// Making a model of the Schema. Tajes as argument the collection name, and Schema 
const UsersModel = new mongoose.model('users', UsersSchema);

// Exporting the model
module.exports = UsersModel;

