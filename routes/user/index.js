var express = require('express');
var router = express.Router();
var userServices = require('../../services/user');

router.post('/login', function (req, res, next) {
    var info = {
        publicSerialNumber: req.body.publicSerialNumber,
        privateSerialNumber: req.body.privateSerialNumber,
    }
    userServices
        .login(info)
        .then((u) => {
            res.json({ result: u });
        })
        .catch((e) => {
            res.json(e);
        });
});
router.post('/signup', function (req, res, next) {
    var info = {
        name: req.body.name,
        publicSerialNumber: req.body.publicSerialNumber,
        privateSerialNumber: req.body.privateSerialNumber,
        avatar: req.body.avatar,
    }
    userServices
        .register(info)
        .then((u) => {
            res.json({ result: u });
        })
        .catch((e) => {
            res.json(e);
        });
});
router.get('/me', function (req, res, next) {
    var info = {
        userId: req.decoded.uid,
    };
    userServices
        .getProfileUserLogin(info)
        .then((u) => {
            res.json({ result: u });
        })
        .catch((e) => {
            res.json(e);
        });
});
router.get('/rooms', function (req, res, next) {
    var info = {
        userId: req.decoded.uid,
    };
    userServices
        .getRooms(info)
        .then((u) => {
            res.json({ result: u });
        })
        .catch((e) => {
            res.json(e);
        });
});
router.post('/room', function (req, res, next) {
    var info = {
        ownerId: req.decoded.uid,
        name: req.body.name,
        pageUrl: req.body.pageUrl,
        visibility: req.body.visibility,
    };
    vendorsServices
        .createRoom(info)
        .then((u) => {
            res.json({ result: u });
        })
        .catch((e) => {
            res.json(e);
        });
});
module.exports = router;