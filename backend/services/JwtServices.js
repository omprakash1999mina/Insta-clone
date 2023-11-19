const jwt_secret =process.env.JWT_SECREAT;
const refresh_secret =process.env.REFRESH_SECRET;
const jwt = require('jsonwebtoken');
class JWTSERVICES{
    static sign(payload,expiry = 6000,secret = jwt_secret){
        return jwt.sign(payload,secret,{expiresIn: expiry});
    }

    static verify(refresh_token,secret=jwt_secret){
        return jwt.verify(refresh_token,secret)
    }

    
}

module.exports = JWTSERVICES;