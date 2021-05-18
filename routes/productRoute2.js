const mongoose = require('mongoose')
const router = require('express').Router()
const Product = require('../models/product')

router.patch('/:id', async (req, res) => {

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { price: 699 }, { new: true })
    if (!updatedProduct) return res.json("no product found")

    updatedProduct.save((err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('The product has been updated')
            res.json(updatedProduct)
        }
    })
})

router.delete('/:id', async (req, res) => {

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.send("no product found")

    res.send('The product has been deleted')

})

module.exports = router;