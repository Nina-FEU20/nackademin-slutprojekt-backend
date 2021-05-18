const mongoose = require('mongoose')
const router = require('express').Router()
const Product = require('../models/product')
const jwt = require('jsonwebtoken')

router.patch('/:id', async (req, res) => {

    const token = req.cookies['auth-token']
    if (!token) return res.send("You are not logged in")

    const verifiedToken = await jwt.verify(token, process.env.TOKEN_SECRET)

    if (verifiedToken.user.role !== "admin") {
        return res.status(401).send('Access denied. You are not admin')
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { price: 699 }, { new: true })
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

router.delete('/:id', async (req, res) => {

    const token = req.cookies['auth-token']
    if (!token) return res.send("You are not logged in")

    const verifiedToken = await jwt.verify(token, process.env.TOKEN_SECRET)

    if (verifiedToken.user.role !== "admin") {
        return res.status(401).send('Access denied. You are not admin')
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.send("no product found")

    res.send('The product has been deleted')

})



module.exports = router;