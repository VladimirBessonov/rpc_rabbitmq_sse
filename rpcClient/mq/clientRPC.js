#!/usr/bin/env node
const amqp = require('amqplib');
var correlationId;

const createClient = (settings) =>
    amqp.connect(settings.url, settings.socketOptions)
        .then((conn) => conn.createChannel())
        .then((ch) => ch.assertQueue('', settings.queueOptions)
            .then((replyQueue) => {
                ch.replyQueue = replyQueue.queue;
                return ch;
            }));


const sentMessage = (channel, queue, message) => {
     correlationId = generateUuid();

    channel.sendToQueue(queue,
        Buffer.from(message.toString()),{
            correlationId: correlationId,
            replyTo: channel.replyQueue }); // using previously created reply channel
};

const consumeMessage = (channel, cb) => {
     channel.consume(channel.replyQueue.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
            let message = msg.content.toString()
            console.log(' [.] Got %s', message);
            cb(message)
            // setTimeout(function() {
            //     connection.close(); // how to close conncetion?
            //     process.exit(0)
            // }, 500);
        }
    }, {
        noAck: true
    });
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}


module.exports.createClient = createClient;
module.exports.sentMessage = sentMessage;
module.exports.consumeMessage = consumeMessage;