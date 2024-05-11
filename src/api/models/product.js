const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name: {
    type: String, 
    required: true},

  description: {
    type: String, 
    required: true},

  price: {
    type: Number, 
    required: true},

  image: {
    type: String, 
    required: true},

  ratings: {
    type: Number, 
    default: 0},

  category: {
    type: String, 
    },

  brand: {
    type: String, 
    },

  quantityAvailable: {
    type: Number, 
    default: 0},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
