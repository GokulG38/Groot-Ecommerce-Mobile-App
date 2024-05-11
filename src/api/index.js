const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Product = require('./models/product');
const Admin = require('./models/admin');
const Wishlist = require("./models/wishlist")
const Order = require('./models/order')
const Review = require('./models/review')
require("dotenv").config()


const port = 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose
  .connect(process.env.MONGO_URL
    ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

const userAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({message: 'Access denied. Token not provided.'});
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.USER_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'Invalid token.'});
    }
    req.user = user;
    next();
  });
};
const adminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({message: 'Access denied. Token not provided.'});
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ADMIN_JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({message: 'Invalid token.'});
    }
    req.admin = admin;
    next();
  });
};

app.post('/signup', async function (req, res) {
  const {name, number, password} = req.body;
  if (
    !name ||
    name.trim() === '' ||
    !number ||
    number.trim() === '' ||
    !password ||
    password.trim() === ''
  ) {
    res.json({message: 'Invalid inputs'});
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    contactNumber: number,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(200).json({message: 'User registered'});
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

app.post('/admin/signup',adminToken, async function (req, res) {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are required'});
  }
  try {
    const existingAdmin = await Admin.findOne({email});
    if (existingAdmin) {
      return res
        .status(409)
        .json({message: 'Admin with this email already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({email, password: hashedPassword});
    await newAdmin.save();

    return res.status(201).json({message: 'Admin registered successfully'});
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({message: 'Internal server error'});
  }
});

app.post('/login', async (req, res) => {
  try {
    const {number, password} = req.body;
    if (!number || !password) {
      res
        .status(400)
        .json({message: 'Phone number and password are required.'});
      return;
    }

    let existingUser;
    try {
      existingUser = await User.findOne({contactNumber: number});
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal Server Error'});
      return;
    }

    if (!existingUser) {
      res.status(404).json({message: 'Unable to find user'});
      return;
    }
    const id =existingUser._id
    const isPassword = bcrypt.compareSync(password, existingUser.password);
    if (!isPassword) {
      res.status(400).json({message: 'Incorrect Password'});
      return;
    }

    const token = jwt.sign({id: existingUser._id}, process.env.USER_JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({message: 'Successfully logged in', token, id });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({message: 'Email and password are required.'});
      return;
    }

    let existingAdmin;
    try {
      existingAdmin = await Admin.findOne({email});
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal Server Error'});
      return;
    }

    if (!existingAdmin) {
      res.status(404).json({message: 'Unable to find admin'});
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password,
    );
    if (!isPasswordCorrect) {
      res.status(400).json({message: 'Incorrect Password'});
      return;
    }

    const token = jwt.sign({id: existingAdmin._id}, process.env.ADMIN_JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({message: 'Successfully logged in', token});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.post('/products/add', adminToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      brand,
      quantityAvailable,
    } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      brand,
      quantityAvailable,
    });
    await newProduct.save();
    res
      .status(201)
      .json({message: 'Product added successfully', product: newProduct});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/products', userAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Unauthorized. Please log in.'});
    }
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res.status(401).json({message: 'Unauthorized. User not found.'});
    }
    const {search, page} = req.query;
    let products;
    const perPage = 5;
    const pageNumber = parseInt(page) || 1;
    let query = {};
    if (search) {
      query.name = {$regex: search, $options: 'i'};
    }
    const totalCount = await Product.countDocuments(query);
    products = await Product.find(query)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({products, totalCount});
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/products/:id', userAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      return res.status(200).json(product);
    }
  } catch {
    return res.status(500).json({message: 'Internal Server Error'});
  }
});




app.post('/wishlist/add',userAuth, async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      if (!userId || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
      }
  
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [productId] });
        await wishlist.save();
      } else {
        if (!wishlist.products.includes(productId)) {
          wishlist.products.push(productId);
          await wishlist.save();
        }
      }
  
      if (!existingUser.wishlist.includes(productId)) {
        existingUser.wishlist.push(productId);
        await existingUser.save();
      }
  
      res.status(200).json({ message: 'Product added to the wishlist successfully' });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/:userId/address',userAuth, async (req, res) => {
    try {
      if (!req.params.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }
      
      const existingUser = await User.findById(req.params.userId);
      if (!existingUser) {
        return res.status(401).json({ message: 'Unauthorized. User not found.' });
      }
      
      if (existingUser.addresses.length === 0) {
        return res.status(200).json({ message: 'Proceed to Buy', addresses:null});
      }
      console.log(existingUser.addresses)
      return res.status(200).json({ message: 'Proceed to Buy', addresses: existingUser.addresses });
      
    } catch (error) {
      console.error('Error handling Proceed to Buy:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.post('/address/add',userAuth, async (req, res) => {
    try {
      const { street, city, state, zipCode, number, userId } = req.body;
      if (!street || !city || !state || !zipCode || !number||!userId) {
        return res.status(400).json({ message: 'All address fields are required' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.addresses.push({ street, city, state, zipCode, number });
      await user.save();
      return res.status(201).json({ message: 'Address added successfully', address: user.addresses });
    } catch (error) {
      console.error('Error adding address:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.put('/address/edit', userAuth,async (req, res) => {
    try {
      const { street, city, state, zipCode, number, userId, addressId } = req.body;
      if (!street || !city || !state || !zipCode || !number || !userId || !addressId) {
        return res.status(400).json({ message: 'All address fields and user ID are required' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ message: 'Address not found' });
      }
      user.addresses[addressIndex] = { street, city, state, zipCode, number };
      await user.save();
      return res.status(200).json({ message: 'Address updated successfully', address: user.addresses[addressIndex] });
    } catch (error) {
      console.error('Error updating address:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.post('/order', userAuth,async (req, res) => {
    try {
      const { address, items, totalPrice, user,status } = req.body;
      console.log(address, items, totalPrice, user,status )
      if (!address || !items || !totalPrice) {
        return res.status(400).json({ message: 'Incomplete order details provided.' });
      }
  
      const Existinguser = await User.findById(user);
      if (!Existinguser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const order = new Order({
        user: user,
        address: address,
        items: items,
        totalPrice: totalPrice,
        status: status,
      });
  
      for (const item of items) {
        const productItem = await Product.findById(item.product);
        if (!productItem) {
          return res.status(400).json({ message: 'Product not found.' });
        }
        productItem.quantityAvailable -= item.quantity;
        await productItem.save();
      }
  
      await order.save();
  
      !(Existinguser.orders.includes(order._id))?(Existinguser.orders.push(order._id)):{}
      await Existinguser.save();
  
      return res.status(201).json({ message: 'Order placed successfully.', order: order });
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });


app.get('/user/:id',userAuth, async (req, res) => {
    try {
        const userId = req.params.id; 
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID is required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            number: user.contactNumber,
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/wishlist/products',userAuth, async (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid wishlist IDs provided.' });
        }

        const products = await Product.find({ _id: { $in: ids } });

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching wishlist products:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/wishlist/remove',userAuth, async (req, res) => {
    try {
      console.log(req.body)
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const index = wishlist.products.indexOf(productId);
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found in the wishlist' });
        }

        wishlist.products.splice(index, 1);
        await wishlist.save();

        const userIndex = existingUser.wishlist.indexOf(productId);
        if (userIndex !== -1) {
            existingUser.wishlist.splice(userIndex, 1);
            await existingUser.save();
        }

        return res.status(200).json({ message: 'Product removed from the wishlist successfully' });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
 


app.get('/orders/user/:userId',userAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const orders = await Order.find({ user: userId })
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  



  app.get('/reviews/:productId/:userId',userAuth, async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.params.userId;
      console.log(productId,userId)
      if (!productId || !userId) {
        return res.status(400).json({ message: 'Product ID and User ID are required' });
      }
  
      const existingReview = await Review.findOne({ product: productId, user: userId });
  
      return res.status(200).json(existingReview);
    } catch (error) {
      console.error('Error fetching existing review:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.post('/reviews',userAuth, async (req, res) => {
    try {
      const { product, user, rating, comment } = req.body;
  
      if (!product || !user || !rating ) {
        return res.status(400).json({ message: 'Incomplete review details provided' });
      }

      let existingReview = await Review.findOne({ product: product, user: user });
  
      if (existingReview) {

        existingReview.rating = rating;
        existingReview.comment = comment;
        await existingReview.save();
      } else {
 
        const newReview = new Review({ product: product, user: user, rating: rating, comment: comment });
        await newReview.save();
      }
  
 
      const reviews = await Review.find({ product: product });
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / reviews.length;
  
      
      const updatedProduct = await Product.findByIdAndUpdate(product, { ratings: averageRating }, { new: true });
      updatedProduct.save()
  
      return res.status(200).json({ message: 'Review submitted successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error submitting review:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/reviews/:productId',userAuth, async (req, res) => {
    try {
        const productId = req.params.productId;
        
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const reviews = await Review.find({ product: productId });

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/order/edit/:orderId', adminToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { address, items, totalPrice, status } = req.body;

    if (!address || !items || !totalPrice || !status) {
      return res.status(400).json({ message: 'Incomplete order details provided.' });
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    existingOrder.address = address;
    existingOrder.items = items;
    existingOrder.totalPrice = totalPrice;
    existingOrder.status = status;

    await existingOrder.save();

    return res.status(200).json({ message: 'Order updated successfully.', order: existingOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log('Server is running on port 8000');
});
