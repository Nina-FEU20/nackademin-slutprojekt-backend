const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


/*
Ska vi trycka på submit i hemsidan med varor i cart,
så ska req.body.customer.name behövas. istället för >>>>>>> req.body.name

I BÖRJAN

*/

router.post('/', async (req, res) => {
    // It checks and waits if there is any user logged in.

    const user = await User.findOne({ name: req.body.customer.name });


    // it checks all products in the cart, and split will convert it to array.

    let items = req.body.items;

    if (typeof(items) === "string") {
        items = items.split(" ")
    }


    items = items.map(prod => mongoose.Types.ObjectId(prod));

    // if there is product from product list, then it will save to products.
    const products = await Product.find({ _id: { $in: items }});


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


    // (order) needs to be put into Order.
    await order.save();

    // orderHistory is inside user, so the order._id gets pushed into user.
    user.orderHistory.push(order._id);


    // it saves into this variable when customer orders items, whatever he order, updates to his cart. Only for the specific customer. Because of the ID.
    const result = await User.findByIdAndUpdate(user._id, user);
    // user.save()

    res.status(200).json(order);
});


router.get('/', async (req, res) => {
    // It checks if there is any user logged in
    const user = await (await User.findOne({ name: req.body.customer.name }));

    // if it is admin or customer that is logged in. If it is admin you will have all orders.
    if (user.role === 'admin') {
        const orders = await Order.find();
        res.json(orders);
    // If it is customer you will see your order.
    } else if (user.role === 'customer') {
        const user = await User.findOne({ name: req.body.name },
        { orderHistory: 1 }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});


module.exports = router;