const express = require("express")
const { uploadFile } = require("../controller/storage.controller")
const router = express.Router()
const AdminOrUserMiddleware = require("../middleware/admin-or-user.middleware")

router.post('/', uploadFile)

module.exports = router