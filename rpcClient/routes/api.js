var express = require('express');
var router = express.Router();
const setting = require('../settings')
const rpcClient = require('../mq/clientRPC');
const EventEmitter = require('events');
const queue = 'webmessages';
let channel;

let storage = [];
let sseEventEmitter = new EventEmitter();

sseEventEmitter.on('message', sseSend
);

rpcClient.createClient(setting).then( ch => {
    channel = ch;
     rpcClient.consumeMessage(ch, savetoStorage)

});

router.post('/', function(req, res, next) {
    let message = req.body.message
    rpcClient.sentMessage(channel, queue, message)
    // rpcServer.consumeRpcMessage(channel, queue);

    res.sendStatus('201');
    // sseEventEmitter.emit('message',)

});

// how to use event emmiter to run the func inside the get?

router.get('/', function(req, res, next) {

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });
    res.write('retry: 1000 \n');

    setInterval(function() {

        if (storage.length !== 0) {
            // res.sendStatus('200')
            // res.send("No new messages")
            // res.write(`data: no message`);
            console.log('[x] send message to SSE')
            res.write(`event: message\n`);
            res.write(`data: ${JSON.stringify(storage)}\n\n`);
            storage = [];

        }

    }, 1000);

});

function sseSend(storage, res) {

    if (storage.length !== 0) {
        // res.sendStatus('200')
        // res.send("No new messages")
        // res.write(`data: no message`);
        console.log('[x] send message to SSE')
        res.write(`data: ${JSON.stringify(storage)}\n\n`);
        storage = [];

    }
}

function savetoStorage (message) {
    storage.push(message);
    console.log(storage)
}

module.exports = router;
