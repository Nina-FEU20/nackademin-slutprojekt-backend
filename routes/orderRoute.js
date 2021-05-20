const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')



router.post('/', async (req, res) => {

    // getting token from cookies 
    const token = req.cookies['auth-token'];
    if (!token) {
        return console.log("inte inloggad")
    }

    // verifying the token 
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
        if (err) {
            console.log("error: " + err)
            return res.status(404)
        } else {

            // getting the logged in user using the payload from the token 
            const user = await User.findOne({ name: payload.user.name });

            // getting the items in the cart
            let items = req.body.items;

            // if statement to convert into array if items is a string (Happens from postman/insomnia)
            if (typeof (items) === "string") {
                items = items.split(" ")
            }

            // mapping items to get the ObjectID
            items = items.map(prod => mongoose.Types.ObjectId(prod));

            // here it will find the specific ID inside items array in the order model with $in.
            const products = await Product.find({ _id: { $in: items } });

            // if there is no products inside order, then status 400 else 202.
            (items.length !== products.length) ? res.status(404) : res.status(202)

            // creating order from order models.
            let order = new Order({
                timeStamp: Date.now(),
                status: true,
                items: products.map(prod => prod._id),
                // products(which is a variable listed over this) so, in reduce it will check the total price of how many items entered the cart by id.
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
        }
    })

});


router.get('/', async (req, res) => {

    // getting the token from cookies and checks if there is any user logged in
    const token = req.cookies['auth-token'];
    if (!token) {
        return console.log("inte inloggad")
    }

    // verifying the token
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    // getting the user from database
    const user = await User.findOne({ name: verifiedUser.user.name });

    // if it is admin or customer that is logged in. If it is admin you will have all orders.
    if (user.role === 'admin') {
        const orders = await Order.find();
        res.json(orders);
        // If it is customer you will see your order.
    } else if (user.role === 'customer') {
        const user = await User.findOne({ name: verifiedUser.user.name },
            // if there is 1 in orderHistory it will connect, if its 0, it will not. populate calls the orderHistory field which references to the ObjectId in the document.
            { orderHistory: 1 }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});


module.exports = router;