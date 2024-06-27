const jwt = require("jsonwebtoken")
//const secreat = "wap@1234"

const verifyToken = (req, res) => {
    try {
        const iss = req.query.iss
        let secreat = null
        
        if (!iss) secreat = process.env.AUTH_SECREAT

        if (iss === "admin") secreat = process.env.ADMIN_SECREAT

        if (iss === "checkout") secreat = process.env.CHECKOUT_SECREAT
        
     
        const { token } = req.body
        const data = jwt.verify(token, secreat)
        
        res.status(200).json(data)
    }
    catch (err) {
        res.status(401).json({
            success: false
        })
    }
}

module.exports = {
    verifyToken
}