const OrderSchema = require("../model/order.model")

const fetchAllOrder = async (req, res) => {
    try {
        const orders = await OrderSchema.find()
            //.populate('user product') // connection with user product short hand proporty
            .populate('user', '-password')
            .populate('product')

        res.status(200).json(orders)
    }
    catch (err) {
        res.status(500).json({
            success: true,
            message: err
        })
    }
}

const updataStatus = async (req, res) => {
    try {
        await OrderSchema.findByIdAndUpdate(req.params.id, { status: req.body.status })
        res.status(200).json({ success: true })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

const fetchUserOrder = async (req, res) => {
    try {
        const orders = await OrderSchema.find({user: req.user.uid})
        .populate('product')
        res.status(200).json(orders)
    }
    catch (err) {
        res.status(500).json({
            success: true,
            message: err
        })
    }
}

module.exports = {
    fetchAllOrder,
    updataStatus,
    fetchUserOrder
}