const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: String,

    adress: {
        street: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})


module.exports = mongoose.model('User', userSchema);