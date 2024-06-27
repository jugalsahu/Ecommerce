const CouponSchema = require("../model/coupon.model")

const createCoupon = async (req, res) => {
    try {
        const coupon = new CouponSchema(req.body)
        await coupon.save()
        res.status(200).json(coupon)
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// expire coupon code

const expireCoupon = async (req, res) => {
    try {
        await CouponSchema.findByIdAndUpdate(req.params.id, { isActive: false })
        res.status(200).json({ success: true })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// fetch coupon


const fetchCoupon = async (req, res) => {
    try {
        const coupon = await CouponSchema.findOne({ code: req.params.code, isActive: true })
        if(!coupon) return res.status(404).json({success:false})
        res.status(200).json(coupon)
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports = {
    createCoupon,
    expireCoupon,
    fetchCoupon
}