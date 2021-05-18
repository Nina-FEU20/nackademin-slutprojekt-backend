const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timeStamp: Date.now(),
    status: Boolean,
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'}],
        orderValue: Number
    })

    const Order = mongoose.model('Order', orderSchema)

    module.exports = Order;