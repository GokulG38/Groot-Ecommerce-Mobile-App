const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

    quantity: { 
      type: Number, 
      default:1 },

    price: { 
      type: Number, 
      required: true }
  }],

  totalPrice: { 
    type: Number, 
    required: true },
  address:{
    type:String,
    required:true
  },

  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered'], 
    default: 'pending' },

  orderedAt: { type: Date, default: Date.now } 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
