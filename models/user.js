const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: [8, 'Password require minimum of 8 characters'],

    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        match: [/^[a-zA-Z]+$/, 'Only letters allowed']
    },
    role: String,

    adress: {
        street: {
            type: String,
            required: [true, 'Street is required']
        },
        zip: {
            type: Number,
            required: [true, 'Zip is required'],
            match: [/^[0-9]+$/, 'Only numbers allowed']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        }
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})


module.exports = mongoose.model('User', userSchema);
