const express = require("express")
const { fetchBrand, createBrand } = require("../controller/brand.controller")
const adminMiddleware = require("../middleware/admin.middleware")
const router = express.Router()

router.get('/', fetchBrand)

router.post('/', adminMiddleware, createBrand)

module.exports = router