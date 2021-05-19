const router = require('express').Router()
const Product = require('../models/product')
const verifyAccess = require('../verifyAccess')

router.patch('/:id', verifyAccess, async (req, res) => {

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { price: 199 }, { new: true })
    if (!updatedProduct) return res.json("No product found")

    updatedProduct.save((err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('The product has been updated')
            res.json(updatedProduct)
        }
    })
})

router.delete('/:id', verifyAccess, async (req, res) => {

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.send("no product found")

    res.send('The product has been deleted')
})

module.exports = router;