const mongoose = require('mongoose')
const router = require('express').Router()
const Product = require('../models/product')
//Require middleware to verify if user is Admin or not
const { verifyIsAdmin } = require('../authentication')



//Routes


//Frida
router.post('/', verifyIsAdmin, (req, res) => {

    //saving the new Product to a variable that is created through the Product Schema + model. For ID, mongoose will assign it. 
    // req.body holds the parameters that are sent from the client per the POST request.
    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })
    //save() will save our new Product to the database. We check if there are no errors, if there is not we will return a statement that the product has been saved.
    newProduct.save((err) => {
        if (err) {
            res.json(err)
        } else {
            console.log('The new product has been saved')
            res.json('The new product has been saved')
        }
    })
})

//fetches all the products with the find() method. Returns all the products.
router.get('/', async (req, res) => {
    const allProducts = await Product.find({})

    res.json(allProducts)
})

//Ta bort?
router.get('/:id', async (req, res) => {
    const specProduct = await Product.find({ _id: req.params.id })

    res.json(specProduct)
})


//Nina





module.exports = router