const jwt = require("jsonwebtoken")

const sessionMiddleware = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) 
        return res.status(401).send("Unauthorized")

    const [type, token] = authorization.split(" ")

    if(type !== "Bearer" && type !== "Checkout") 
        return res.status(401).send("Unuthorized")

    let secreat = null
    if(type === "Bearer")
        secreat = process.env.AUTH_SECREAT
    if(type === "Checkout")
        secreat = process.env.CHECKOUT_SECREAT

    try{
        const user = await jwt.verify(token, secreat)
        req.user = user
        next()
    }
    catch(err){
        return res.status(401).send("Unuthorized")
    }
    
}

module.exports = sessionMiddleware