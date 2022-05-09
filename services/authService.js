var jwt = require('jsonwebtoken');

module.exports.getTokenUser = function (uid) {
    var token = jwt.sign({
        uid: uid
    },
        process.env.JSON_WEB_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24 * 90000 //60 * 60 * 24 * 90000 //expires in 9000 days
    });
    return token;
};

module.exports.extractUIDUser = function (token, myCallback) {
    jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            myCallback("Error in verifying Token.");
        } else {
            myCallback(null, decoded);
        }
    });
};