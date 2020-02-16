var express = require('express');
var router = express.Router();
const amqpClient = require('../mq/clientRPC');

var setting = require('../settings')
// const amqp = require('amqplib/callback_api');
let channel;
const exchange = 'logs';
const queue = "rpc_queue";

amqpClient.createClient(setting.url)
    .then(ch => {
        // channel is kept for later use
        channel = ch;
    });


router.post("/api/v1/message", async (req, res) => {

    amqpClient.sendRPCMessage(channel, req.body.name, queue )
        .then(msg => {

            console.log( Buffer.isBuffer(msg))
            console.log(msg.toString())
            // res.send(result);
        });

    res.sendStatus(201)

});

module.exports = router;
