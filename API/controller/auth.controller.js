const UserSchema = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await UserSchema.findOne({ email: email })

    //user doesn't exist
    if (!user)
        return res.status(404).json({ success: false, message: "User doesn't exists" })

    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched)
        return res.status(401).json({ success: false, message: "Incorrect Password" })

    //login success
    const payload = {
        fullname: user.fullname,
        email: user.email,
        uid: user._id,
        role: user.role
    }

    const secreat = (user.role === "admin" ? process.env.ADMIN_SECREAT : process.env.AUTH_SECREAT)

    const token = await jwt.sign(payload, secreat, { expiresIn: '7d' })

    res.status(200).json({
        success: true,
        token: token
    })
}

const signup = async (req, res) => {
    try {
        const user = new UserSchema(req.body)
        await user.save()

        //signup success
        const payload = {
            fullname: user.fullname,
            email: user.email,
            uid: user._id,
            role: user.role
        }

        const secreat = (user.role === "admin" ? process.env.ADMIN_SECREAT : process.env.AUTH_SECREAT)

        const token = await jwt.sign(payload, secreat, { expiresIn: '7d' })

        res.status(200).json({
            success: true,
            token: token
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const forgotPassword = (req, res) => {
    res.send("forgot")
}

module.exports = {
    login,
    signup,
    forgotPassword
}