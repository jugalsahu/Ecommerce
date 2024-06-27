const express = require("express")
const { addToCart, removeFromCart, featchCart } = require("../controller/cart.controller")
const userMiddleware = require("../middleware/authorization.middleware")
const router = express.Router()

router.get('/',userMiddleware, featchCart)

router.post('/',userMiddleware, addToCart)

router.delete('/:id',userMiddleware, removeFromCart)


module.exports = router