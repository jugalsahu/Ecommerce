const Razorpay = require("razorpay")
const fs = require("fs")
const crypto = require("crypto")
const OrderSchema = require("../model/order.model")
const sendMail = require("../util/mail.util")
const secret = process.env.RAZORPAY_SECREAT

const Razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECREAT
})

// create order
const createOrder = async (req, res) => {
    try {
        const {price, discount} = req.user
        const amount = price-(price*discount)/100
        const order = await Razor.orders.create({
            amount: (amount * 100),
            receipt: 'WP_RN_' + Date.now()
        })
        res.status(200).json({
            amount: order.amount,
            orderId: order.id
        })
    }
    catch (err) {
        
        res.status(500).json({
            success: false,
        })
    }
}

// fetch payment
const fetchPayment = async (req, res) => {
    try {
        const payments = await Razor.payments.all()
        res.status(200).json(payments)
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

const createProductOrder = async (data, res) => {
    try {
    const { email, description } = data.payload.payment.entity
    const payload = data.payload.payment.entity.notes
    const mailPayload = {
        email,
        description
    }
        const newOrder = new OrderSchema(payload)
        await newOrder.save()
        await sendMail(email, `Payment Success - ${description}`, 'paymentSuccess', mailPayload )
        res.status(200).json({ success: true })

    }
    catch (err) {
        // fs.writeFileSync(`./errors/${user}-${Date.now()}.json`, JSON.stringify(err, null, 2))
        
        res.status(500).json({
            success: false,
            message: 'Failed to creating an order'
        })
    }
}

const handleFailedPayment = async (data, res) => {
    const { email, description } = data.payload.payment.entity
    const payload = {
        email,
        description
    }
    await sendMail(email, `Payment Failed - ${description}`, 'paymentFailed' , payload)
    res.status(200).json({ success: false })
}

const webhook = async (req, res) => {
    const data = req.body
    const signature = req.headers['x-razorpay-signature']
    const ownServerSignature = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(data)).digest('hex')

    if (signature !== ownServerSignature)
        return res.status(400).json({ success: false, message: 'Bad Request' })

    //request is valid 
    if (data.event === "payment.failed") return handleFailedPayment(data, res)
    if (data.event === "payment.captured") return createProductOrder(data, res)

    res.status(200).json({ success: true })
}

module.exports = {
    createOrder,
    fetchPayment,
    webhook
}