const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({

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


module.export = mongoose.model('User', userSchema)