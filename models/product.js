const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    shortDesc: String,
    longDesc: String,
    imgFile: String
})

module.exports = mongoose.model('Products', productSchema)