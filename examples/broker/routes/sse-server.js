var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sse', function(req, res, next) {
    res.status(200).set({
        "connection":"keep-alive",
        "cache-control": "no-cache",
        "content-Type":"text/event-stream"
    })
    res.write(`aloha mather fuckers`);
});

module.exports = router;