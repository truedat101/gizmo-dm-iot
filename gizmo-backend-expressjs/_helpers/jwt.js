// "use strict";
const { expressjwt } = require('express-jwt');
const config = require('../config.json');

// module.exports = jwt;

const jwt = () => {
    const { secret } = config;
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/bits/checkforupdatesbyserialno/:serialno/:version',
            /^\/bits\/checkforupdatesbyserialno\/.*/,
            /^\/bits\/downloadbitsdescriptor\/.*/
        ]
    });
}


module.exports = {
    jwt
};