const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const { verifyIsLoggedIn } = require('../authentication/authMiddlewares')

router.post('/', verifyIsLoggedIn, async (req, res) => {

    // getting the items in the cart
    let items = req.body.items;

    // if statement for the cart, if its nothing inside === you can not submit order.
    if (!items || items.length === 0) {
        res.status(404).send('no items in cart');
        // it ends here.
        return;
    }

    try {

        // creating an empty array to push all itemprices in to 
        const productPrices = [];
        for (let item of items) {
            // getting each product
            const product = await Product.find({ _id: item })
            // pushing every price into the array
            productPrices.push(product[0].price)
        }

        // reduce looping through each price, then it will return the total value of the price for the prices in the array, 0 = it begins from zero price.
        let total = productPrices.reduce((total, currentProduct) => {
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

        // getting the logged in user using the req.verifiedUser that we get from the middleware verifyIsLoggedIn 
        const user = await User.findOne({ _id: req.verifiedUser.id });

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

    // putting the users role into a variable
    const role = req.verifiedUser.role

    // checking if role is admin or customer. Admin can see all orders, customer can see its own 
    if (role === 'admin') {
        const orders = await Order.find();
        res.json(orders);
    } else if (role === 'customer') {
        // populate calls the orderHistory field which references to the ObjectId in the document.
        const user = await User.findOne({ _id: req.verifiedUser.id }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});


module.exports = router;