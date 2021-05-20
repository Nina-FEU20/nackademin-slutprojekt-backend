const router = require('express').Router()
const Product = require('../models/product')
const { verifyIsAdmin } = require('../authentication')

// verifyAccess is a middleware that runs before and needs to return a next(); for the rest of the function to run
router.patch('/:id', verifyIsAdmin, async (req, res) => {

    // getting the chosen product and saving it to a seperate variable first. 
    // This because all fields in product is required so it can not be empty,
    // so if we update a product but leave something blank we use the value that was there before. 
    const productBeforeUpdate = await Product.findById(req.params.id)
    // getting the chosen product again and updating it with the new values
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title || productBeforeUpdate.title,
            price: req.body.price || productBeforeUpdate.price,
            shortDesc: req.body.shortDesc || productBeforeUpdate.shortDesc,
            longDesc: req.body.longDesc || productBeforeUpdate.longDesc,
            imgFile: req.body.imgFile || productBeforeUpdate.imgFile
        }, { new: true })

    if (!updatedProduct) return res.json("No product found")

    // save the product to database and send proper message
    updatedProduct.save((err) => {
        if (err) {
            res.json({ msg: err })
        } else {
            res.json(updatedProduct)
        }
    })
})

router.delete('/:id', verifyIsAdmin, async (req, res) => {
    // getting the product and deleting it 
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    // if there is no product with this id
    if (!deletedProduct) return res.json({ msg: "No product found" })

    res.json({ msg: 'The product has been deleted' })
})

module.exports = router;