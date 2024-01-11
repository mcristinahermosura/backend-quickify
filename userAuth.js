const jwt = require("jsonwebtoken")
const authSecret = "E-CommerceAPI"

module.exports.generateAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }
    return jwt.sign(data, authSecret, {})
}

module.exports.verify = (request, response, next) =>{
    let token = request.headers.authorization
    
    if(token === undefined){
		return response.send({message: `Authentication token missing. Please provide a valid token for authentication.`})
	}else{
        token = token.slice(7, token.length)

        jwt.verify(token, authSecret, (err, decodedToken) =>{
            if(err){
                return response.send({
                   auth: `Failed`,
                   message: `Action Prohibited`
                })
            }else{
                request.user = decodedToken
                next()
            }
        })
    }
}

module.exports.verifyAdmin = (request, response, next) => {
    if(request.user.isAdmin){
        next()
    }else{
        return response.send({
            auth: `Operation Failed. Please check the provided information and try again`,
            message: `Access Forbidden: You do not have the necessary permissions to perform this action`
        })
    }
}
