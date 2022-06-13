var express = require('express');
var router = express.Router();
var authService = require('../services/authService');

//middleware routing
router.use(function (req, res, next) {
    var str = req.path;

    if (str.substr(-1) != '/') str += '/';
    var token = req.headers.authorization || req.body.token;
    if (str.startsWith('/party')) {
        next();
        return;
    }
    else if (str.startsWith('/api')) {
        if (str == "/api/user/login/" || str == "/api/user/signup/") {
            next();
            return;
        } else if (str.startsWith("/api/public/")) {
            next();
            return;
        } else {
            if (str.startsWith("/api/user")) {
                if (token) {
                    token = token.replace('Bearer ', '');
                    authService.extractUIDUser(token, function (err, decodedx) {
                        if (err) {
                            return res.json({
                                success: false,
                                code: "TOKEN_AUTH_FAILED"
                            });
                        } else {
                            req.decoded = decodedx;
                            req.token = token;
                            next();
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        code: "NO_TOKEN"
                    });
                }
            } else {
                return res.json({
                    code: "NOT_FOUNT_ROUTE"
                });
            }
        }
    }
    else if (str.startsWith('/socket.io')) {
        req.next();
    }
    else {
        return res.json({
            code: "NOT_FOUNT_ROUTE"
        });
    }
});
module.exports = router;