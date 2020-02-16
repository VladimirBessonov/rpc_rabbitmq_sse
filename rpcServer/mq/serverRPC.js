#!/usr/bin/env node
// const queue = 'webmessages';

var amqp = require('amqplib');

const createConnection = (settings, queue) =>
    amqp.connect(settings.url)
        .then((conn) => conn.createChannel())
        .then((channel) => channel.assertQueue(queue, settings.queueOptions)
            .then((replyQueue) => {
                channel.replyQueue = replyQueue.queue;
                console.log(' [x] Awaiting RPC requests');
                channel.prefetch(1);

                return channel;
            }));

const consumeRpcMessage = (channel, queue) => new Promise(resolve => {

    channel.consume(queue, function reply(msg) {
        let time = new Date()
        let r = (msg.content.toString() + " received " + time );

        console.log(" [.] from RabbitMQ " , r);
        //
        channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
            });

        channel.ack(msg);
    });
})


module.exports.createConnection = createConnection;
module.exports.consumeRpcMessage = consumeRpcMessage;


