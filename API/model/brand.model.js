const mongoose = require("mongoose")
const Schema = mongoose.Schema

const brandModel = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

const brandSchema = mongoose.model("Brand", brandModel)
module.exports = brandSchema