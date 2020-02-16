#!/usr/bin/env node

var amqp = require('amqplib');
const REPLY_QUEUE = 'webmessages';
const q = 'example';

// var args = process.argv.slice(2);
//
// if (args.length === 0) {
//     console.log("Usage: rpc_client.js num");
//     process.exit(1);
// }

const createClient = (settings) =>
    amqp.connect(settings.url, settings.socketOptions)
        .then((conn) => conn.createChannel())
        .then((channel) => channel.assertQueue('', settings.queueOptions)
            .then((replyQueue) => {
                channel.replyQueue = replyQueue.queue;
                return channel;
            }));


const sendRPCMessage = (channel, message, rpcQueue) =>
    new Promise((resolve, reject) => {
        const correlationId = generateUuid();
        const msgProperties = {
            correlationId,
            replyTo: channel.replyQueue
        };

        // function helper (msg) {
        //     if (msg.properties.correlationId === correlationId) {
        //
        //         console.log(' [.] Got %s', msg.content.toString());
        //         setTimeout(function() {
        //             connection.close();
        //             process.exit(0);
        //         }, 500);
        //     }
        // }
        //
        function consumeAndReply (msg) {
            if (!msg) return reject(Error.create('consumer cancelled by rabbitmq'));

            if (msg.properties.correlationId === correlationId) {

                console.log(' [.] Got %s', msg.content.toString());


                channel.cancel(correlationId)
                    .then(() => resolve(resolve(msg.content)));
            }
        }

        channel.consume(channel.replyQueue, consumeAndReply, {
            noAck: true,
            // use the correlationId as a consumerTag to cancel the consumer later
            consumerTag: correlationId
        })
          channel.sendToQueue(rpcQueue, new Buffer(message), msgProperties);
    });


function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports.createClient = createClient;
module.exports.sendRPCMessage = sendRPCMessage;
