const mongoose = require('mongoose')
const router = require('express').Router()
const Product = require('../models/product')

//Routes

router.post('/', (req,res) => {
    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })
    newProduct.save((err) => {
        if(err){
            console.error(err)
        } else{
            console.log('The new product has been saved')
            res.json('The new product has been saved')
        }
    })
})


router.get('/', async (req,res) => {
    const allProducts = await Product.find({})

    res.json(allProducts)
})

router.get('/:id', async (req,res) => {
    const specProduct = await Product.find({_id: req.params.id})

    res.json(specProduct)
})


module.exports = router