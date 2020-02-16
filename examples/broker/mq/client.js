'use strict';
const amqp = require('amqplib');
const queue = 'webmessages';

const createClient = (setting) => amqp.connect(setting.url)
    .then(conn => conn.createChannel()) // create channel
    .then(channel => {

        channel.assertQueue(queue, {
            durable: true
        });
        return channel;
    });


const sendRPCMessage = (channel, msg) => new Promise(resolve => {

    channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
    });
    console.log(" [x] Sent %s", msg);
});


module.exports.createClient = createClient;
module.exports.sendRPCMessage = sendRPCMessage;