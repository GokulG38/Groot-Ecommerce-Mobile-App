const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true},

  contactNumber: {
    type: String,
    required: true,
    unique: true},

  password: {
    type: String,
    required: true},

  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      number:String
    },

  ],
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],

  wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
