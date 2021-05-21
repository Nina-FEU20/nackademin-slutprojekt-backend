const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { verifyIsLoggedIn } = require('../authentication')


router.post('/', verifyIsLoggedIn, async (req, res) => {

    console.log(req.verifiedUser)

    // getting the logged in user using the req.verifiedUser that we get from the middleware verifyIsLoggedIn 
    const user = await User.findOne({ name: req.verifiedUser.user.name });

    // getting the items in the cart
    let items = req.body.items;

    // if statement to convert into array if items is a string (Happens from postman/insomnia)
    if (typeof (items) === "string") {
        items = items.split(" ")
    }

    // mappar items för att hämta objectID
    items = items.map(prod => mongoose.Types.ObjectId(prod));

    // if there is product from product list, then it will save to products.
    const products = await Product.find({ _id: { $in: items } });

    // if there is no products inside order, then status 400.
    if (items.length !== products.length) {
        // Do something
        res.status(400);
        return;
    }

    // creating order from order models.
    let order = new Order({
        timeStamp: Date.now(),
        status: true,
        items: products.map(prod => prod._id),
        orderValue: products.reduce((total, prod) => total + prod.price, 0)
    });


    // Saving the order to database
    await order.save();

    // orderHistory is inside user, so the order._id gets pushed into user. (if we are logged in)
    if (user) {
        user.orderHistory.push(order._id);
        // it saves when customer orders items, whatever he order, updates to his cart. Only for the specific logged in user. Because of the ID.
        await User.findByIdAndUpdate(user._id, user);
    }

    res.status(200).json(order);
});


router.get('/', verifyIsLoggedIn, async (req, res) => {

    // getting the user from database
    const user = await User.findOne({ name: req.verifiedUser.user.name });

    // if it is admin or customer that is logged in. If it is admin you will have all orders.
    if (user.role === 'admin') {
        const orders = await Order.find();
        res.json(orders);
        // If it is customer you will see your order.
    } else if (user.role === 'customer') {
        const user = await User.findOne({ name: verifiedUser.user.name },
            { orderHistory: 1 }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});


module.exports = router;