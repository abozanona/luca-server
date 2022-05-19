const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/join', function (req, res, next) {
    var info = {
        roomId: req.query.roomId,
        roomLink: req.query.roomLink,
    }
    res.sendFile(path.resolve(process.cwd(), 'pages', 'index.html'));
});
module.exports = router;