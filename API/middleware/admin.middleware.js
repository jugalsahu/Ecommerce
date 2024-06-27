const jwt = require("jsonwebtoken")

const adminMiddleware = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) 
        return res.status(401).send("Unauthorized")

    const [type, token] = authorization.split(" ")

    if(type !== "Bearer") 
        return res.status(401).send("Unuthorized")

    try{
        const user = await jwt.verify(token, process.env.ADMIN_SECREAT)
        req.user = user
        next()
    }
    catch(err){
        return res.status(401).send("Unuthorized")
    }
    
}

module.exports = adminMiddleware