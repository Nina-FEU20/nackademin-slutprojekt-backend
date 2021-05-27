const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const { verifyIsLoggedIn } = require('../authentication')

router.post('/', verifyIsLoggedIn, async (req, res) => {

    // getting the items in the cart
    let items = req.body.items;

    // if statement for the cart, if its nothing inside === you can not submit order.
    if (!items || items.length === 0) {
        res.status(404).send('no items in cart');
        // it ends here.
        return;
    }

    // getting the logged in user using the req.verifiedUser that we get from the middleware verifyIsLoggedIn 
    const user = await User.findOne({ _id: req.verifiedUser.id });

    try {

        // creating an empty array to push all itemprices in to 
        const products = [];
        for (let item of items) {
            // getting each product
            const product = await Product.find({ _id: item })
            // pushing every price into the array
            products.push(product[0].price)
        }

        // reduce looping through products, then it will return the total value of the price for the products in array, 0 = it begins from zero price.
        let total = products.reduce((total, currentProduct) => {
            return total + currentProduct
        }, 0)

        // creating order from order models.
        let order = new Order({
            timeStamp: Date.now(),
            status: 'inProcess',
            items: items,
            orderValue: total
        });

        // Saving the order to database
        await order.save();

        // orderHistory is inside user, so the order._id gets pushed into user.
        user.orderHistory.push(order._id);
        // saving the user again with the updated orderhistory
        user.save()

        res.status(200).json(order);

    } catch (err) {
        return res.send(err.message)
    }
});


router.get('/', verifyIsLoggedIn, async (req, res) => {

    // getting the user from database
    const user = await User.findOne({ _id: req.verifiedUser.id });

    // if it is admin or customer that is logged in. If it is admin you will have all orders.
    if (user.role === 'admin') {
        const orders = await Order.find();
        res.json(orders);
        // If it is customer you will see your order.
    } else if (user.role === 'customer') {
        const user = await User.findOne({ _id: req.verifiedUser.id },
            // if there is 1 in orderHistory it will connect, if its 0, it will not. populate calls the orderHistory field which references to the ObjectId in the document.
            { orderHistory: 1 }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});


module.exports = router;