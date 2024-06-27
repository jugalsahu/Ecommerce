const express = require("express")
const { createCategory, fetchCategory } = require("../controller/category.controller")
const adminMiddleware = require("../middleware/admin.middleware")
const router = express.Router()

router.get('/', fetchCategory)

router.post('/',adminMiddleware, createCategory)

module.exports = router