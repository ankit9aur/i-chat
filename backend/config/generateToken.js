const jwt = require('jsonwebtoken')

const generateToken = (id) =>{
    return jwt.sign({id},"ankit",{
        expiresIn: "30d"
    });
};

module.exports = generateToken;