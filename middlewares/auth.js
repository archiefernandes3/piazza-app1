const jwt = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1] 
    if (!token) {
        return res.status(401).send({ message: 'No token, authorization denied' })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        res.status(401).send({ message: 'Token is not valid' })
    }
}

module.exports = auth
