const express = require('express');
const router = express.Router();
var userServices = require('../../services/user');

router.get('/rooms', function (req, res, next) {
    var info = {

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

module.exports = router;