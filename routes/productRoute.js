const mongoose = require('mongoose')
const router = require('express').Router()
const Product = require('../models/product')
//Require middleware to verify if user is Admin or not
const { verifyIsLoggedIn, verifyIsAdmin } = require('../authentication')

//Routes

//Frida
router.post('/', verifyIsLoggedIn, verifyIsAdmin, (req, res) => {

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
            res.send(err)
        } else {
            console.log('The new product has been saved')
            res.send('The new product has been saved')
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

// verifyIsLoggedIn and verifyIsAdmin are middlewares that runs before and needs to return a next(); for the next middleware/rest of the function to run
router.patch('/:id', verifyIsLoggedIn, verifyIsAdmin, async (req, res) => {

    try {
        // getting the chosen product by the id sent in as a param, then using the $set operator to update whatever values that are sent in i req.body that matches a key
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body },
            // by default, findByIdAndUpdate doesn't run validators so to run validators I use option runValidators and set it to true. To return the new modified product rather than the original I'm setting the option new to true.
            { runValidators: true, new: true })
        if (!updatedProduct) return res.status(404).send("No product found")
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:id', verifyIsLoggedIn, verifyIsAdmin, async (req, res) => {
    // getting the product and deleting it 
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    // if there is no product with this id
    if (!deletedProduct) return res.status(404).send("No product found")
    res.send('The product has been deleted')
})



module.exports = router