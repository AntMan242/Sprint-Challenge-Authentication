const jwt = require('jsonwebtoken');

const secrets = require('../config/secret.js')

module.exports = {
    generateToken
};


function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    }

    const options = {
        expiresIn: '10h',
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}

