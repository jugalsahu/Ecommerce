const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categoryModel = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

const categorySchema = mongoose.model("Category", categoryModel)
module.exports = categorySchema