const router = require('express').Router()
const Product = require('../models/product')
const { verifyIsLoggedIn, verifyIsAdmin } = require('../authentication')

// verifyIsLoggedIn and verifyIsAdmin are middlewares that runs before and needs to return a next(); for the next middleware/rest of the function to run
router.patch('/:id', verifyIsLoggedIn, verifyIsAdmin, async (req, res) => {

    try {
        // getting the chosen product by the id sent in as a param, then using the $set operator to update whatever values that are sent in i req.body that matches a key
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body },
            // by default, findByIdAndUpdate doesn't run validators so to run validators I use option runValidators and set it to true. To return the new modified product rather than the original I'm setting the option new to true.
            { runValidators: true, new: true })
        if (!updatedProduct) return res.status(404).json({ msg: "No product found" })
        res.json(updatedProduct)
    } catch (err) {
        res.status(400).json({ error: err })
    }
})

router.delete('/:id', verifyIsLoggedIn, verifyIsAdmin, async (req, res) => {
    // getting the product and deleting it 
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    // if there is no product with this id
    if (!deletedProduct) return res.status(404).json({ msg: "No product found" })
    res.json({ msg: 'The product has been deleted' })
})

module.exports = router;